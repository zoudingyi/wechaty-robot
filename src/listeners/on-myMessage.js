/*
 * @Description: 	我的消息集中处理机制。所有发给机器人的消息 都通过机器人统一转发到我的号上，我可以通过引用该条消息回复给发消息的人。
 * @Author: zdy
 * @Date: 2020-07-03 15:45:42
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-04-05 18:54:48
 */

const { Message } = require('wechaty')
const config = require('../config')
const { businessCard } = config // 我的wechatId

let isAutoMsg = true // 自动转发消息模式

module.exports = (bot) => {
  return async function onMessage(msg) {
    console.log('--查看类型--', msg.type(), '--')
    const Master = await bot.Contact.find({ alias: 'Master' }) // 通过昵称找到我的微信
    const alias = (await msg.talker().alias()) || (await msg.talker().name()) // 获取对方的昵称
    const room = await msg.room() // 获取群聊
    const atSelf = await msg.mentionSelf() // 是否提到自己
    if (msg.self()) return // 不接收自己的消息
    
    // 处理Master的消息
    if (msg.talker().id === businessCard) {
      // 开启/关闭 消息转发功能
      if (msg.text() === '0') {
        isAutoMsg = false
        return await Master.say('Closed Success')
      }
      if (msg.text() === '1') {
        isAutoMsg = true
        return await Master.say('Opened Success')
      }
      await replyMessage(bot, msg)
      return
    }

    if (isAutoMsg) {
        // 群聊
        if (room) {
          // 收到群聊，@自己回复，其他暂时不做处理
          if (atSelf) {
            return await room.say('叫爸爸干啥?')
          }
          return;
        }
        // 消息类型集中处理 转发有效消息给我
        switch (msg.type()) {
          // 普通文本消息
          case Message.Type.Text:
            logInfo(msg)
            const mssage = `[${alias}]：${msg.text()}`
            await Master.say(mssage)
            break
          // 图片
          case Message.Type.Image:
            await Master.say(`[${alias}]：[Image]`)
            break
          // 视频
          case Message.Type.Video:
            await Master.say(`[${alias}]：[Video]`)
            break
          // 语音
          case Message.Type.Audio:
            await Master.say(`[${alias}]：[Audio]`)
            break
          // 表情包
          case Message.Type.Emoticon:
            await Master.say(`[${alias}]：[Emoticon]`)
            break
          // 获取撤回消息的文本内容
          case Message.Type.Recalled:
            await Master.say(`[${alias}]：[撤回了一条消息]`)
            break
        // 小程序
          case Message.Type.MiniProgram:
            await Master.say(`[${alias}]：[MiniProgram]`)
            break
          case Message.Type.Url:
            await Master.say(`[${alias}]：[Url]`)
            break
            
          default:
            break
            
        }
        // 文本信息单独处理 其他类型一律转发
        if (msg.type() !== Message.Type.Text) {
            await msg.forward(Master)
        }
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
  if (msg.text().indexOf('?xml') > -1) return // 如果是回复引用的消息就不打印。
  console.log('┍┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┑')
  console.log(
    `┝┄ from: ${msg.talker() ? msg.talker().name() : null}: ${msg.talker() ? msg.talker().id : null}`
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
  const quoteMsg = msg.text()
  // 获取消息内容
  const textStart = quoteMsg.indexOf('<title>') + 7
  const textStop = quoteMsg.indexOf('</title>')
  if (textStop === -1) return // 如果不是回复引用的消息就不打印
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
  // 通过名字或者昵称找到此人，把内容转发给对方
  const Sender =
    (await bot.Contact.find({ name: SenderName })) ||
    (await bot.Contact.find({ alias: SenderName }))
  if (!Sender) return
  await Sender.say(text)
}
