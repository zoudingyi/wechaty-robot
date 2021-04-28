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
let currentChat = '' // 当前聊天对象

module.exports = (bot) => {
  return async function onMessage(msg) {
    if (msg.self()) return // 不接收自己的消息
    console.log('--查看类型--', msg.type(), '--')
    const Master = await bot.Contact.find({ alias: 'Master' }) // 通过昵称找到我的微信
    const alias = (await msg.talker().alias()) || (await msg.talker().name()) // 获取对方的昵称
    const room = await msg.room() // 获取群聊
    const atSelf = await msg.mentionSelf() // 是否提到自己
    const msgText = msg.text()

    // 群聊
    if (room) {
      // 收到群聊，@自己回复，其他暂时不做处理
      if (atSelf) {
        return await room.say('hi~')
      }
      return
    } else {
      if (msgText === '加群') {
        // 通过群聊id获取到该群聊实例
        const robotRoom = await bot.Room.find({ id: '21676493228@chatroom' })

        // 判断是否在房间中 在-提示并结束
        if (await robotRoom.has(msg.talker())) {
          await msg.say('您已经在房间中了')
          return
        }

        // 发送群邀请
        await robotRoom.add(msg.talker())
        await msg.say('已发送群邀请')
      }
    }

    // 处理Master的消息，不会执行下面的集中处理。若非master则跳过，执行下面的处理。
    if (msg.talker().id === businessCard) {
      let status = 'logoff'
      
      // 设置当前聊天对象
      if (msgText.includes('-set chat')) return currentChat = msgText.split(' ')[2];

      switch (msgText) {
        case '-set 0':
          if (bot.logonoff()) status = 'logon'
          isAutoMsg = false
          return await Master.say(`[${status}] close success`)

        case '-set 1':
          if (bot.logonoff()) status = 'logon'
          isAutoMsg = true
          return await Master.say(`[${status}] open success`)

        case '-look chat':
          if (currentChat) {
            return await Master.say(`[${currentChat}]-current contact`)
          }
          return await msg.say('Please set the contact person.')

        case '-help':
          return await Master.say(`-set 1/0,
          -look chat,
          -help`)

        default:
          return await replyMessage(bot, msg)
      }
      // // 开启/关闭 消息转发功能
      // if (msg.text() === '0') {
      //   if (bot.logonoff()) status = 'logon'
      //   isAutoMsg = false
      //   return await Master.say(`[${status}] close success`)
      // }
      // if (msg.text() === '1') {
      //   if (bot.logonoff()) status = 'logon'
      //   isAutoMsg = true
      //   return await Master.say(`[${status}] open success`)
      // }
      // 回复消息集中处理
      // return await replyMessage(bot, msg)
    }

    // 消息类型集中处理 转发有效消息给我
    if (isAutoMsg) {
      switch (msg.type()) {
        // 普通文本消息 单独处理
        case Message.Type.Text:
          logInfo(msg)
          const mssage = `[${alias}]：${msgText}`
          await Master.say(mssage)
          return
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
        // 获取撤回消息的文本内容 不做转发
        case Message.Type.Recalled:
          const recalledMessage = await msg.toRecalled()
          await Master.say(`[${alias}] [撤回了一条消息]：${recalledMessage}`)
          return
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
      await msg.forward(Master)
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
    `┝┄ from: ${msg.talker() ? msg.talker().name() : null}: ${
      msg.talker() ? msg.talker().id : null
    }`
  )
  console.log(`┝┄ to: ${msg.to().name()}`)
  console.log(`┝┄ text: ${msg.text()}`)
  console.log(`┝┄ isRoom: ${msg.room()}`)
  // console.log(`┝┄ RoomId: ${msg.room().id}`)
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
  if (textStop === -1) return await appointor(bot, msg) // 如果不是回复引用的消息就不往后执行
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

// 指定联系人回复消息
async function appointor(bot, msg) {
  if (currentChat === '') return await msg.say('Please set the contact person.')
  const Sender =
    (await bot.Contact.find({ name: currentChat })) ||
    (await bot.Contact.find({ alias: currentChat }))
  if (!Sender) return await msg.say('The contact was not found!')
  await msg.forward(Sender)
}
