const { Wechaty, log } = require('wechaty')
const { PuppetPadlocal } = require('wechaty-puppet-padlocal') // padlocal协议包
const config = require('./config')

const config = require('./config')
const onScan = require('./listeners/on-scan')
const onFriendShip = require('./listeners/on-friend') // 好友添加监听回调
const onMessage = require('./listeners/on-message') // 消息监听
const onRoomJoin = require('./listeners/on-room') // 加入房间监听回调
// const onMyMessage = require('./listeners/on-myMessage')


// init
const puppet = new PuppetPadlocal({ token: config.token })
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
bot.on('room-join', onRoomJoin)

bot
  .start()
  .then(() => {
    log.info('StarterBot', 'Starter Bot Started.')
  })
  .catch((e) => log.error('StarterBot', e))
