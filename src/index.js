const { Wechaty, log } = require('wechaty')
const { PuppetPadplus } = require('wechaty-puppet-padplus') // padplus协议包
const config = require('./config')

const onScan = require('./listeners/on-scan')
const onFriendShip = require('./listeners/on-friend') // 好友添加监听回调
const onMessage = require('./listeners/on-message') // 消息监听
const onRoomJoin = require('./listeners/on-room') // 加入房间监听回调
// const onMyMessage = require('./listeners/on-MyMessage')

// init
const bot = new Wechaty({
  puppet: new PuppetPadplus({
    token: config.token
  }),
  name: config.name
})

bot.on('scan', onScan)
bot.on('login', (user) => log.info('StarterBot', '%s login', user))
bot.on('logout', (user) => log.info('StarterBot', '%s logout', user))
bot.on('message', onMessage(bot))
bot.on('friendship', onFriendShip)
bot.on('room-join', onRoomJoin)
// bot.on('message', onMyMessage(bot))

bot
  .start()
  .then(() => {
    log.info('StarterBot', 'Starter Bot Started.')
  })
  .catch((e) => log.error('StarterBot', e))
