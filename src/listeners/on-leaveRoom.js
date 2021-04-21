module.exports = async function onRoomLeave(room, leaver) {
  console.log(`${nameList}退出了群聊...`)
  room.say(`${leaver}退出了群聊...`)
}
