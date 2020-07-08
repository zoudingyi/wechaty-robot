/*
 * @Description: 	我的定制消息回复,支持回复表情包，emoji表情, 远程控制机器人开启关闭等。
 * @Author: zdy
 * @Date: 2020-07-03 15:45:42
 * @LastEditors: zdy
 * @LastEditTime: 2020-07-07 17:57:59
 */ 
const { Message } = require("wechaty")
const { FileBox } = require('file-box')

let isAuto = true // 自动回复模式
// const WeChatId = 'superegg177'
const WeChatId = 'r-a-n-son-g'

const imgs = [
  'http://hbimg.b0.upaiyun.com/11bad3bf0d9976e774e442aff23b6d2d1d276ddb933f-6vxpJs_fw236',
  'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1594116772774&di=9feace42b3538216974d31cf649e3783&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201806%2F02%2F20180602195147_oswdx.jpeg',
  'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1898554905,156454153&fm=26&gp=0.jpg',
  'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3362606401,1751985198&fm=26&gp=0.jpg',
  'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2832867884,2827131253&fm=26&gp=0.jpg'
]
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
    // if (msg.from().id !== WeChatId) return
    
    
    // 判断此消息类型是否为文本
    
    if (msg.room()) {
      // 获取群聊
      const room = await msg.room()
      // 收到消息，提到自己
      if (await msg.mentionSelf()) {
        const index = Math.floor(Math.random() * imgs.length)
        const randomImg = imgs[index];
        const fileBox1 = FileBox.fromUrl(
          'http://59.110.223.199/img/cat.gif',
          'cat.gif',
        )
        console.log('----1----', index, fileBox1)
        await msg.say(fileBox1)
        return
      }

    } else {
      if (msg.type() == Message.Type.Text) {
        try {
          const fileBox = FileBox.fromFile('D:\\studySpace\\myProject\\wechaty\\wechaty-robot\\img\\meme.jpg')
          console.log('----2----', fileBox)
          await msg.say(fileBox)
        } catch (error) {
          console.log(error)
        }
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