/*
 * @Description:扫描二维码时监听回调
 * @Author: zdy
 * @Date: 2020-07-08 17:15:11
 * @LastEditors: zdy
 * @LastEditTime: 2020-07-09 17:06:32
 */
const { ScanStatus, log } = require('wechaty')
const Qrterminal = require('qrcode-terminal')

module.exports = async function onScan(qrcode, status) {
  // console.log('---ScanStatus---', ScanStatus )
  if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
    Qrterminal.generate(qrcode, { small: true })
    const qrcodeImageUrl = ['https://wechaty.github.io/qrcode/', encodeURIComponent(qrcode)].join(
      ''
    )

    log.info('StarterBot', 'onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl)
  } else {
    log.info('StarterBot', 'onScan: %s(%s)', ScanStatus[status], status)
  }
}
