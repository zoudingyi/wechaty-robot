/*
 * @Author: your name
 * @Date: 2020-07-19 10:14:34
 * @LastEditTime: 2020-07-23 19:35:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \wechaty-robot\src\config.js
 */ 
module.exports = {
  // puppet_padplus Token
  token: 'puppet_padplus_8626fc2bfeed57e7',
  // 你的机器人名字
  name: '远坂凛',
  // 房间/群聊
  room: {
    // 管理群组列表
    roomList: {
      // 群名字(用于发送群名字加群): 123456 (群id)
      'wechaty-robot': '21676493228@chatroom',
      Tohsaka: '22887893475@chatroom'
    },
    // 加入房间回复
    roomJoinReply: `你好，欢迎加入`
  },
  // 私人
  personal: {
    // 好友验证自动通过关键字
    addFriendKeywords: ['我永远喜欢远坂凛', '悟空'],
    // 是否开启加群
    addRoom: true
  },
  // 个人名片 formId
  businessCard: 'wxid_h5s7aq81hp3e21'
}
