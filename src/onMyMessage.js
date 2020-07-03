/*
 * @Description: 	我的定制消息回复,支持回复表情包，emoji表情, 远程控制机器人开启关闭等。
 * @Author: zdy
 * @Date: 2020-07-03 15:45:42
 * @LastEditors: zdy
 * @LastEditTime: 2020-07-03 17:46:28
 */ 
const { Message } = require("wechaty")

let isAuto = true // 自动回复模式
// const WeChatId = 'superegg177'
const WeChatId = 'r-a-n-son-g'

module.exports = bot => {
  return async function onMessage(msg) {
    consoleInfo(msg)
    // 判断自己的消息
    if (msg.self()) {
      if (msg.text() === '#关闭') {
        isAuto = false
      }
      if (msg.text() === '#开启') {
        isAuto = true
      }
      return
    }
    
    if (!isAuto) return
    if (msg.from().id !== WeChatId) return
    
    // 判断此消息类型是否为文本
    if (msg.type() == Message.Type.Text) {
      await msg.say('啊啊啊啊啊')
    }
    if (msg.type() == Message.Type.toRecalled) {
      const recalledMessage = await msg.toRecalled()
      await msg.say(`Message: ${recalledMessage} has been recalled.`)
    }
  }
}
/**
 * @description: 打印msg信息
 * @param {Object} msg 消息对象
 * @return: 
 * @author: zdy
 */
function consoleInfo(msg) {
  console.log("=============================")
  console.log(`msg : ${msg}`)
  console.log(
    `from: ${msg.from() ? msg.from().name() : null}: ${
      msg.from() ? msg.from().id : null
    }`
  )
  console.log(`to: ${msg.to()}`)
  console.log(`text: ${msg.text()}`)
  console.log(`isRoom: ${msg.room()}`)
  console.log("=============================")
}