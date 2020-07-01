const { Wechaty } = require("wechaty") // Wechaty核心包
const { PuppetPadplus } = require("wechaty-puppet-padplus") // padplus协议包
const config = require("./config") // 配置文件
// import config from './config'

const bot = new Wechaty({
  puppet: new PuppetPadplus({
    token: config.token
  }),
  name: config.name
})

const onScan = require("./onScan")
// const onRoomJoin = require("./onRoomJoin")
const onMessage = require("./onMessage")
const onFriendShip = require("./onFriendShip")

bot
  .on("scan", onScan) // 机器人需要扫描二维码时监听
  // .on("room-join", onRoomJoin) // 加入房间监听
  .on("message", onMessage(bot)) // 消息监听
  .on("friendship", onFriendShip) // 好友添加监听
  .start()