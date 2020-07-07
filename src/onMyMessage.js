/*
 * @Description: 	我的定制消息回复,支持回复表情包，emoji表情, 远程控制机器人开启关闭等。
 * @Author: zdy
 * @Date: 2020-07-03 15:45:42
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-07-07 21:07:30
 */ 
const { Message } = require("wechaty")

let isAuto = true // 自动回复模式
// const WeChatId = 'superegg177' //
const WeChatId = 'wxid_h5s7aq81hp3e21' // 我的微信id

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
    if (msg.from().id !== WeChatId) return
    
    // console.log('msg.type', msg.type(), Message.Type)
    // const dateline = new Date(new Date(msg.date()).getTime())
    // console.log('接受消息时间： ' + dateline, msg.age())
    console.log('--查看类型--', msg.type(), Message.Type)

    switch (msg.type()) {
      // 普通文本消息
      case Message.Type.Text:
        if (msg.text() == '宝宝') {
          // await TimeLapse()
          await msg.say('在呢')
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

    // if (msg.type() == Message.Type.Text) {
    //   if (msg.room()) {
    //     const room = await msg.room() // 获取群聊
    //     // 收到消息，提到自己
    //     if (await msg.mentionSelf()) {
    //       // 获取提到自己的名字
    //       const from = "@" + await msg.from().name()

    //       // 返回消息，并@来自人
    //       room.say(from + ' 干啥？')
    //       return
    //     }
    //   } else {
    //     await TimeLapse(1)
    //     await msg.say('啥子？[捂脸]')
    //   }
    // }
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
function Multiple(params) {
  
}