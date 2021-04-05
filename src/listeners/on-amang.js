const { Message, UrlLink } = require('wechaty')
const config = require('../config')

// 消息监听回调
module.exports = (bot) => {
  return async function onMessage(msg) {
    // 判断消息来自自己，直接return
    if (msg.self()) return

    // logInfo(msg)

    const room = await msg.room() // 获取群聊
    // 判断此消息类型是否为文本
    if (msg.type() == Message.Type.Text) {
      // 判断消息类型来自群聊
      if (room) {
        // 收到@自己的消息
        if (await msg.mentionSelf()) {
          await room.say('请稍等。。。')
          return
        }
        // 收到消息，没有提到自己  忽略
      } else {
        // do something
      }
    } else {
      console.log('消息不是文本！')
    }
  }
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
    `from: ${msg.talker() ? msg.talker().name() : null}: ${msg.talker() ? msg.talker().id : null}`
  )
  console.log(`to: ${msg.to().name()}`)
  console.log(`text: ${msg.text()}`)
  console.log(`isRoom: ${msg.room()}`)
  console.log('=============================')
}
