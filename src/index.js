// const { Wechaty } = require("wechaty") // Wechaty核心包
const {
  Wechaty,
  ScanStatus,
  log,
} = require('wechaty')
const { PuppetPadplus } = require("wechaty-puppet-padplus") // padplus协议包
const config = require("./config") // 配置文件
const Qrterminal = require("qrcode-terminal")

// const onRoomJoin = require("./onRoomJoin") // 加入房间监听回调
const onRobotMessage = require("./onRobotMessage") // 带机器人的消息监听
const onFriendShip = require("./onFriendShip") // 好友添加监听回调

// 机器人需要扫描二维码时监听回调
function onScan(qrcode, status) {
  // console.log('---ScanStatus---', ScanStatus )
  if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
    Qrterminal.generate(qrcode, { small: true })
    const qrcodeImageUrl = [
      'https://wechaty.github.io/qrcode/',
      encodeURIComponent(qrcode),
    ].join('')

    log.info('StarterBot', 'onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl)
  } else {
    log.info('StarterBot', 'onScan: %s(%s)', ScanStatus[status], status)
  }
}

function onLogin (user) {
  log.info('StarterBot', '%s login', user)
}

function onLogout (user) {
  log.info('StarterBot', '%s logout', user)
}

// 消息监听
async function onMessage (msg) {
  log.info('StarterBot', msg.toString())
}

// 初始化
const bot = new Wechaty({
  puppet: new PuppetPadplus({
    token: config.token
  }),
  name: config.name
})

bot.on("scan", onScan) // 机器人需要扫描二维码时监听
bot.on('login',   onLogin)
bot.on('logout',  onLogout)
// bot.on('message', onMessage)
// bot.on("room-join", onRoomJoin) // 加入房间监听
bot.on("message", onRobotMessage(bot)) // 带机器人的消息监听
bot.on("friendship", onFriendShip) // 好友添加监听

bot.start()
  .then(() => log.info('StarterBot', 'Starter Bot Started.'))
  .catch(e => log.error('StarterBot', e))