/*
 * @Description: 	我的消息集中处理机制。所有发给机器人的消息 都通过机器人统一转发到我的号上，我可以通过引用该条消息回复给发消息的人。
 * @Author: zdy
 * @Date: 2020-07-03 15:45:42
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-07-30 15:18:36
 */

const { Message } = require('wechaty')
// const { FileBox } = require('file-box')
const config = require('../config')
const { businessCard } = config // 我的wechatId

let isAuto = true // 自动转发消息模式

module.exports = (bot) => {
  return async function onMessage(msg) {
    const myContact = await bot.Contact.find({ name: '孫悟空' })
    const alias = (await msg.from().alias()) || (await msg.from().name()) // 获取对方的昵称
    const room = await msg.room() // 获取群聊
    const atSelf = await msg.mentionSelf() // 是否提到自己
    logInfo(msg)
    if (msg.self()) return // 不接收自己的消息
    // 处理我的消息
    if (msg.from().id === businessCard) {
      // 开启/关闭 消息转发功能
      if (msg.text() === '0') {
        isAuto = false
        return await myContact.say('Closed successfully')
      }
      if (msg.text() === '1') {
        isAuto = true
        return await myContact.say('Successfully opened')
      }
      await replyMessage(bot, msg)
      return
    }

    if (!isAuto) return
    // console.log('--查看类型--', msg.type(), Message.Type)

    // 消息类型集中处理 转发有效消息给我
    switch (msg.type()) {
      // 普通文本消息
      case Message.Type.Text:
        // 群聊
        if (room) {
          // 收到消息，提到自己
          if (atSelf) {
            await room.say('叫爸爸干啥?')
            return
          }
        } else {
          const mssage = `[${alias}]：${msg.text()}`
          await myContact.say(mssage)
        }
        break
      // 图片
      case Message.Type.Image:
        const filebox = await msg.toFileBox()
        await myContact.say(`[${alias}]：[Image]`)
        await myContact.say(filebox)
        break
      // 语音
      case Message.Type.Video:
        await myContact.say(`[${alias}]：[Video]`)
        break
      // 视频
      case Message.Type.Audio:
        await myContact.say(`[${alias}]：[Audio]`)
        break
      // 表情包
      case Message.Type.Emoticon:
        // 转发forward和发送文件filebox是以文件的形式发送的 无法直接复原表情包
        // await msg.forward(myContact)
        // const emobox = await msg.toFileBox()
        // await myContact.say(emobox)
        await myContact.say(`[${alias}]：[Emoticon]`)
        break
      // 获取撤回消息的文本内容
      case Message.Type.Recalled:
        const recalledMessage = await msg.toRecalled()
        const { payload } = recalledMessage
        if (payload.type == 7) {
          // 文本信息
          await myContact.say(`${alias} withdrew a message: ${recalledMessage.payload.text}`)
        }
        if (payload.type == 6) {
          // 图片
          await myContact.say(`${alias} withdrew a picture`)
          // await msg.forward(myContact) // 无法复现撤回的图片 只能复现一个文件
        }
        if (payload.type == 5) {
          // 表情包
          await myContact.say(`${alias} withdrew an emoticon`)
        }
        break

      default:
        break
    }
  }
}

/**
 * @description: 打印msg信息
 * @param {Object} msg 消息对象
 * @return:
 * @author: zdy
 */
function logInfo(msg) {
  // console.log('=============================')
  // console.log(`msg : ${msg}`)
  console.log('┍┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┑')
  console.log(
    `┝┄ from: ${msg.from() ? msg.from().name() : null}: ${msg.from() ? msg.from().id : null}`
  )
  console.log(`┝┄ to: ${msg.to().name()}`)
  console.log(`┝┄ text: ${msg.text()}`)
  console.log(`┝┄ isRoom: ${msg.room()}`)
  console.log('┕┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┙')
}

/**
 * @description: 通过引用回复指定人消息
 * @param {Promise} bot
 * @param {Promise} msg
 * @return:
 * @author: zdy
 */
async function replyMessage(bot, msg) {
  if (!isAuto) return
  // const quoteMsg = msg.text()
  // const start = quoteMsg.indexOf('[') + 1
  // const stop = quoteMsg.indexOf(']')
  // const SenderName = quoteMsg.substring(start, stop)
  // console.log('└┅┅┅┅正在回复[', SenderName, ']┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┘')
  // const Sender =
  //   (await bot.Contact.find({ name: SenderName })) ||
  //   (await bot.Contact.find({ alias: SenderName }))
  // if (!Sender) return
  // const infoStart = quoteMsg.indexOf('-') + 30
  // const myMsg = quoteMsg.substring(infoStart, quoteMsg.length)
  // await Sender.say(myMsg)
  // ---老版本分割线---

  // 2020年7月30日15:16:44 微信的系统消息变更 msg监听到xml 做出提取信息调整
  const quoteMsg = msg.text()
  // 获取消息内容
  const textStart = quoteMsg.indexOf('<title>') + 7
  const textStop = quoteMsg.indexOf('</title>')
  const text = quoteMsg.substring(textStart, textStop)
  // 获取要发送的人
  const extractStart = quoteMsg.indexOf('<content>') + 9
  const extractStop = quoteMsg.indexOf('</content>')
  const extract = quoteMsg.substring(extractStart, extractStop)
  const start = extract.indexOf('[') + 1
  const stop = extract.indexOf(']')
  const SenderName = extract.substring(start, stop)
  console.log('└┅┅┅┅回复内容：', text)
  console.log('└┅┅┅┅正在回复[', SenderName, ']┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┘')
  const Sender =
    (await bot.Contact.find({ name: SenderName })) ||
    (await bot.Contact.find({ alias: SenderName }))
  if (!Sender) return
  await Sender.say(text)
}
