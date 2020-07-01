module.exports = {
  // puppet_padplus Token
  token: "你自己申请的ipad协议token",
  // 你的机器人名字
  name: "圈子",
  // 房间/群聊
  room: {
    // 管理群组列表
    roomList: {
      // 群名字(用于发送群名字加群):群id，后面会介绍到
      // Web圈: "*****@chatroom",
      // 男神群: "*****@chatroom"
    },
    // 加入房间回复
    roomJoinReply: `你好，欢迎加入`
  },
  // 私人
  personal: {
    // 好友验证自动通过关键字
    addFriendKeywords: ["加群", "前端"],
    // 是否开启加群
    addRoom: true
  }
}