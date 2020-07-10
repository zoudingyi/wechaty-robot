/*
 * @Description: 	消息监听
 * @Author: zdy
 * @Date: 2020-07-01 17:22:21
 * @LastEditors: zdy
 * @LastEditTime: 2020-07-10 18:02:10
 */

const { Message, UrlLink } = require('wechaty')
const config = require('../config')
const { FileBox } = require('file-box')
const name = config.name // 机器人名字
const roomList = config.room.roomList // 管理群组列表
const { businessCard } = config

// 消息监听回调
module.exports = (bot) => {
  return async function onMessage(msg) {
    // 判断消息来自自己，直接return
    if (msg.self()) return

    logInfo(msg)

    const room = await msg.room() // 获取群聊
    // 判断此消息类型是否为文本
    if (msg.type() == Message.Type.Text) {
      // 判断消息类型来自群聊
      if (room) {
        // 收到@自己的消息
        if (await msg.mentionSelf()) {
          // @机器人修改群名称
          if (msg.text().includes('修改群名称')) {
            const oldTopic = await room.topic() // 获取当前群名称
            const name = msg.text().split('：')[1]
            if (!name) return await room.say('请用"修改群名称：xxx" 的形式告诉我')
            await room.topic(name) // 修改名称
            await room.say(`群名称已从 ${oldTopic} 修改为 ${await room.topic()}`)
            return
          }
          // @昵称 踢人
          if (msg.text().includes('踢了')) {
            const kick = msg.text().split('@')[2]
            if (!kick) return await room.say('请用"踢了@要踢的人" 的形式告诉我')
            const contact = await bot.Contact.find({ name: kick })
            console.log(kick, contact)
            if (!contact) return await room.say('没有找到该人')
            await room.del(contact)
            await room.say(`${kick} 已被移除群聊`)
            return
          }
          await room.say('叫我干啥？')
          return
        }
        // 收到消息，没有提到自己  忽略
      } else {
        // 回复信息是关键字 “加群”
        if (await isAddRoom(msg)) return

        // 回复信息是所管理的群聊名
        if (await isRoomName(bot, msg)) return

        // 发送图片
        if (msg.text() == '图片') {
          const fileBox = FileBox.fromFile('img\\Kumamon2.jpg')
          await msg.say(fileBox)
        }
        // 发送文件
        if (msg.text() == '文件') {
          const fileBox = FileBox.fromFile('img\\text.txt')
          await msg.say(fileBox)
        }
        // 发送链接
        if (msg.text() == '链接') {
          const urlLink = new UrlLink({
            description: '双色球模拟器,可以模拟摇双色球的号码', // 链接描述
            thumbnailUrl: 'http://59.110.223.199/img/Kumamon1.jpg', // 链接图片地址
            title: 'double-color-ball-emulator',
            url: 'http://59.110.223.199/'
          })

          await msg.say(urlLink)
        }
        // 发送名片
        if (msg.text() == '名片') {
          const contactCard = bot.Contact.load(businessCard)
          await msg.say(contactCard)
        }
      }
    } else {
      console.log('消息不是文本！')
    }
  }
}

/**
 * @description 回复信息是关键字 “加群” 处理函数
 * @param {Object} msg 消息对象
 * @return {Promise} true-是 false-不是
 */
async function isAddRoom(msg) {
  // 关键字 加群 处理
  if (msg.text() == '加群') {
    let roomListName = Object.keys(roomList)
    let info = `${name}当前管理群聊有${roomListName.length}个，回复群聊名即可加入哦\n\n`
    roomListName.map((v) => {
      info += '【' + v + '】' + '\n'
    })
    msg.say(info)
    return true
  }
  return false
}

/**
 * @description 回复信息是所管理的群聊名 处理函数
 * @param {Object} bot 实例对象
 * @param {Object} msg 消息对象
 * @return {Promise} true-是群聊 false-不是群聊
 */
async function isRoomName(bot, msg) {
  // 回复信息为管理的群聊名
  if (Object.keys(roomList).some((v) => v == msg.text())) {
    // 通过群聊id获取到该群聊实例
    const room = await bot.Room.find({ id: roomList[msg.text()] })

    // 判断是否在房间中 在-提示并结束
    if (await room.has(msg.from())) {
      await msg.say('您已经在房间中了')
      return true
    }

    // 发送群邀请
    await room.add(msg.from())
    await msg.say('已发送群邀请')
    return true
  }
  return false
}

/**
 * @description: 打印msg信息
 * @param {Object} msg 消息对象
 * @return:{string} msg信息
 * @author: zdy
 */
function logInfo(msg) {
  console.log('=============================')
  // console.log(`msg : ${msg}`)
  console.log(
    `from: ${msg.from() ? msg.from().name() : null}: ${msg.from() ? msg.from().id : null}`
  )
  console.log(`to: ${msg.to().name()}`)
  console.log(`text: ${msg.text()}`)
  console.log(`isRoom: ${msg.room()}`)
  console.log('=============================')
}
