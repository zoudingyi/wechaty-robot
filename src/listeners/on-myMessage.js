/*
 * @Description: 	我的定制消息回复,支持回复表情包，emoji表情, 远程控制机器人开启关闭等。
 * @Author: zdy
 * @Date: 2020-07-03 15:45:42
 * @LastEditors: zdy
 * @LastEditTime: 2020-07-23 17:54:31
 */

const { Message } = require('wechaty')
// const { FileBox } = require('file-box')

let isAuto = true // 自动回复模式

module.exports = (bot) => {
  return async function onMessage(msg) {
    const myContact = await bot.Contact.find({ name: '孫悟空' })
    const alias = (await msg.from().alias()) || (await msg.from().name()) // 获取对方的昵称
    logInfo(msg)
    // 判断自己的消息
    if (msg.self()) {
      if (msg.text() == '0') {
        isAuto = false
      }
      if (msg.text() == '1') {
        isAuto = true
      }
      return
    }

    if (!isAuto) return
    // console.log('--查看类型--', msg.type(), Message.Type)

    const room = await msg.room() // 获取群聊
    const atSelf = await msg.mentionSelf() // 是否提到自己

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
          // if (msg.from().id == WeChatId) return
          const mssage = `[${alias}] ${msg.text()}`
          await myContact.say(mssage)
        }
        break
      // 图片
      case Message.Type.Image:
        const filebox = await msg.toFileBox()
        await myContact.say(`${alias} [image]`)
        await myContact.say(filebox)
        break
      // 语音
      case Message.Type.Video:
        break
      // 视频
      case Message.Type.Audio:
        break
      // 表情包
      case Message.Type.Emoticon:
        // 转发forward和发送文件filebox是以文件的形式发送的 无法直接复原表情包
        // await msg.forward(myContact)
        // const emobox = await msg.toFileBox()
        // await myContact.say(emobox)
        await myContact.say(`${alias} [emoticon][unable to display]`)
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
  console.log('=============================')
  console.log(`msg : ${msg}`)
  console.log('=============================')
  console.log(
    `from: ${msg.from() ? msg.from().name() : null}: ${msg.from() ? msg.from().id : null}`
  )
  console.log(`to: ${msg.to().name()}`)
  console.log(`text: ${msg.text()}`)
  console.log(`isRoom: ${msg.room()}`)
  console.log('=============================')
}

/**
 * @description: 延迟回复, 如果不填时间 则随机时间内回复
 * @param {Number} item 秒
 * @return: none
 */
async function TimeLapse(time = 0) {
  if (time) {
    const second = Number(time + '000')
    console.log(`回复延时${time}秒`)
    return await new Promise((resolve) => setTimeout(resolve, second))
  }
  const delayed = randomNum(4, 6) * 1000
  console.log(`回复延时${delayed / 1000}秒`)
  await new Promise((resolve) => setTimeout(resolve, delayed))
}

/**
 * @description: 生成从minNum到maxNum的随机数
 * @param {Number} minNum 最小值
 * @param {Number} maxNum 最大值
 * @return:
 */
function randomNum(minNum, maxNum) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * minNum + 1, 10)
    case 2:
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
    //或者 Math.floor(Math.random()*( maxNum - minNum + 1 ) + minNum );
    default:
      return 0
  }
}
/**
 * @description: 处理多条信息，设置Settimeout  在规定时间内收集所有消息 存到数组。然后遍历每条消息，针对关键词进行统一回复。
 * @param {type}
 * @return:
 */
function Multiple(params) {}
