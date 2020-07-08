/*
 * @Description: 	我的定制消息回复,支持回复表情包，emoji表情, 远程控制机器人开启关闭等。
 * @Author: zdy
 * @Date: 2020-07-03 15:45:42
 * @LastEditors: zdy
 * @LastEditTime: 2020-07-08 17:09:10
 */ 
const { Message, UrlLink } = require("wechaty")
const { FileBox } = require('file-box')

let isAuto = true // 自动回复模式
// const WeChatId = 'wxid_h5s7aq81hp3e21' // 我的微信id
const imgs = [
  'http://59.110.223.199/img/Kumamon1.jpg',
  'http://59.110.223.199/img/Kumamon2.jpg',
]
module.exports = bot => {
  return async function onMessage(msg) {
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
    // if (msg.from().id !== WeChatId) return
    console.log('--查看类型--', msg.type(), Message.Type)
    
    const room = await msg.room() // 获取群聊
    const atSelf = await msg.mentionSelf() // 是否提到自己

    switch (msg.type()) {
      // 普通文本消息
      case Message.Type.Text:
        // 群聊
        if (room) {
          // 收到消息，提到自己
          if (atSelf) {
            if (msg.text().includes('修改群名称')) {
              const oldTopic = await room.topic() // 获取当前群名称
              const name = msg.text().split('：')[1]
              if (!name) return await room.say('好好打字，告诉爸爸改成什么？')
              await room.topic(name) // 修改名称
              await room.say(`群名称已从 ${oldTopic} 修改为 ${await room.topic()}`)
              return
            }
            await room.say('叫爸爸干啥?')
            return
          }
        } else {
          if (msg.text() == '图片') {
            const fileBox = FileBox.fromFile('img\\test.txt')
            console.log(fileBox)
            await msg.say(fileBox)
            return
          }
          await msg.say('嘻嘻')
        }
        break;
      // 图片
      case Message.Type.Image:
        
        break;
      // 语音
      case Message.Type.Video:
        
        break;
      // 视频
      case Message.Type.Audio:
        
        break;
      // 表情包
      case Message.Type.Emoticon:
        
        break;
    
      default:
        break;
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
  console.log("=============================")
  // console.log(`msg : ${msg}`)
  console.log(
    `from: ${msg.from() ? msg.from().name() : null}: ${
      msg.from() ? msg.from().id : null
    }`
  )
  console.log(`to: ${msg.to().name()}`)
  console.log(`text: ${msg.text()}`)
  console.log(`isRoom: ${msg.room()}`)
  console.log("=============================")
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
      return parseInt(Math.random() * minNum + 1, 10);
    case 2:
      return parseInt(Math.random() * ( maxNum - minNum + 1 ) + minNum, 10);
      //或者 Math.floor(Math.random()*( maxNum - minNum + 1 ) + minNum );
    default:
      return 0;
  }
}
/**
 * @description: 处理多条信息，设置Settimeout  在规定时间内收集所有消息 存到数组。然后遍历每条消息，针对关键词进行统一回复。
 * @param {type} 
 * @return: 
 */
function Multiple(params) {}