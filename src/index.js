const { Wechaty, log } = require('wechaty')
// import { PuppetPadlocal } from "wechaty-puppet-padlocal";
// import {Contact, Message, ScanStatus, Wechaty} from "wechaty";
const { PuppetPadlocal } = require('wechaty-puppet-padlocal')

const config = require('./config')
const onScan = require('./listeners/on-scan')
const onFriendShip = require('./listeners/on-friend') // 好友添加监听回调
// const onMessage = require('./listeners/on-message') // 消息监听
const onRoomJoin = require('./listeners/on-room') // 加入房间监听回调
const onMyMessage = require('./listeners/on-MyMessage')


// init
const puppet = new PuppetPadlocal({ token: config.token })
const bot = new Wechaty({
  name: config.name,
  puppet,
})

bot.on('scan', onScan)
bot.on('login', (user) => log.info('StarterBot', '%s login', user))
bot.on('logout', (user) => log.info('StarterBot', '%s logout', user))
// bot.on('message', onMessage(bot))
bot.on('friendship', onFriendShip)
bot.on('room-join', onRoomJoin)
bot.on('message', onMyMessage(bot))

bot
  .start()
  .then(() => {
    log.info('StarterBot', 'Starter Bot Started.')
  })
  .catch((e) => log.error('StarterBot', e))
