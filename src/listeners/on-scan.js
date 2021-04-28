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
  if (status === ScanStatus.Waiting && qrcode) {
    Qrterminal.generate(qrcode, { small: true })
    const qrcodeImageUrl = ["https://api.qrserver.com/v1/create-qr-code/?data=", encodeURIComponent(qrcode)].join("");
    console.log(`onScan: ${ScanStatus[status]}(${status}) - ${qrcodeImageUrl}`);
  } else {
    console.log(`onScan: ${ScanStatus[status]}(${status})`);
  }
}

// onScan: Waiting(2) 等待确认登录
// onScan: Scanned(3) 扫描结束
// onScan: Cancel(1) 取消登录
