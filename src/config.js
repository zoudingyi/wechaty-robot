module.exports = {
  // puppet_padplus Token
  token: 'puppet_padplus_5703d8ae6c35c8da',
  // 你的机器人名字
  name: "远坂凛",
  // 房间/群聊
  room: {
    // 管理群组列表
    roomList: {
      // 群名字(用于发送群名字加群): 123456 (群id)
      "wechaty-robot": "21676493228@chatroom",
      "Tohsaka": "22887893475@chatroom"
    },  
    // 加入房间回复
    roomJoinReply: `你好，欢迎加入`
  },
  // 私人
  personal: {
    // 好友验证自动通过关键字
    addFriendKeywords: ["我永远喜欢远坂凛", "悟空"],
    // 是否开启加群
    addRoom: true
  }
}