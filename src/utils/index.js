/**
 * @description: 延迟回复, 如果不填时间 则随机时间内回复
 * @param {Number} item 秒
 * @return: none
 */
async function TimeLapse(time = 0) {
  if (time) {
    const second = Number(time + '000')
    console.log(`回复延时${time}秒`)
    return await new Promise((resolve) => setTimeout(resolve, second))
  }
  const delayed = randomNum(4, 6) * 1000
  console.log(`回复延时${delayed / 1000}秒`)
  await new Promise((resolve) => setTimeout(resolve, delayed))
}

/**
 * @description: 生成从minNum到maxNum的随机数
 * @param {Number} minNum 最小值
 * @param {Number} maxNum 最大值
 * @return:
 */
function randomNum(minNum, maxNum) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * minNum + 1, 10)
    case 2:
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
    //或者 Math.floor(Math.random()*( maxNum - minNum + 1 ) + minNum );
    default:
      return 0
  }
}

/**
 * @description: 处理多条信息，设置Settimeout  在规定时间内收集所有消息 存到数组。然后遍历每条消息，针对关键词进行统一回复。
 * @param {type}
 * @return:
 */
function Multiple(params) {}

/**
 * @description: 打印msg信息
 * @param {Object} msg 消息对象
 * @return:
 * @author: zdy
 */
function logInfo(msg) {
  // console.log('=============================')
  // console.log(`msg : ${msg}`)
  console.log('=============================')
  console.log(
    `from: ${msg.from() ? msg.from().name() : null}: ${msg.from() ? msg.from().id : null}`
  )
  console.log(`to: ${msg.to().name()}`)
  console.log(`text: ${msg.text()}`)
  console.log(`isRoom: ${msg.room()}`)
  console.log('=============================')
}

export { TimeLapse, randomNum, logInfo }
