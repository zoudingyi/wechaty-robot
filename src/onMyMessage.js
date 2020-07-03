/*
 * @Description: 	我的定制消息回复,支持回复表情包，emoji表情, 远程控制机器人开启关闭等。
 * @Author: zdy
 * @Date: 2020-07-03 15:45:42
 * @LastEditors: zdy
 * @LastEditTime: 2020-07-03 15:52:28
 */ 
const { Message } = require("wechaty")
const config = require("./config")

let theSwitch = true // 自动回复消息开关

module.exports = bot => {
  return async function onMessage(msg) {
    // 判断消息来自自己，直接return
    if (msg.self()) {
      
    }

  }
}