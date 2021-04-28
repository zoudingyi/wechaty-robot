const { Wechaty, log } = require('wechaty')
const { PuppetPadlocal } = require('wechaty-puppet-padlocal') // padlocal协议包
const config = require('./config')

const onScan = require('./listeners/on-scan')
const onFriendShip = require('./listeners/on-friend') // 好友添加监听回调
const onMessage = require('./listeners/on-message') // 消息监听
const onJoinRoom = require('./listeners/on-joinRoom') // 加入房间监听回调
const onLeaveRoom = require('./listeners/on-leaveRoom') // 退出群监听回调
// const onMyMessage = require('./listeners/on-myMessage')

// init
const bot = new Wechaty({
  puppet: new PuppetPadlocal({
    token: config.token
  }),
  name: config.name
})

bot.on('scan', onScan)
bot.on('login', (user) => log.info('StarterBot', '%s login', user))
bot.on('logout', (user) => log.info('StarterBot', '%s logout', user))
bot.on('message', onMessage(bot))
// bot.on('message', onMyMessage(bot))
bot.on('friendship', onFriendShip)
bot.on('room-join', onJoinRoom)
bot.on('room-leave', onLeaveRoom)

bot
  .start()
  .then(() => {
    log.info('StarterBot', 'Starter Bot Started.')
  })
  .catch((e) => log.error('StarterBot', e))
