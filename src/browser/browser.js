export function getOSAndBrowser() {
  const os = navigator.platform
  const userAgent = window.navigator.userAgent
  const info = {}
  let tempArray = []
  // 判断操作系统
  if (os.indexOf('Win') > -1) {
    if (userAgent.indexOf('Windows NT 5.0') > -1) {
      info.os = 'Win2000'
    } else if (userAgent.indexOf('Windows NT 5.1') > -1) {
      info.os = 'WinXP'
    } else if (userAgent.indexOf('Windows NT 5.2') > -1) {
      info.os = 'Win2003'
    } else if (userAgent.indexOf('Windows NT 6.0') > -1) {
      info.os = 'WindowsVista'
    } else if (
      userAgent.indexOf('Windows NT 6.1') > -1 ||
      userAgent.indexOf('Windows 7') > -1
    ) {
      info.os = 'Win7'
    } else if (
      userAgent.indexOf('Windows NT 6.2') > -1 ||
      userAgent.indexOf('Windows 8') > -1
    ) {
      info.os = 'Win8'
    } else if (
      userAgent.indexOf('Windows NT 6.3') > -1 ||
      userAgent.indexOf('Windows 8.1') > -1
    ) {
      info.os = 'Win8.1'
    } else if (
      userAgent.indexOf('Windows NT 10.0') > -1 ||
      userAgent.indexOf('Windows 10') > -1
    ) {
      info.os = 'Win10'
    } else {
      info.os = 'Other'
    }
  } else if (os.indexOf('Mac') > -1) {
    info.os = 'Mac'
  } else if (os.indexOf('X11') > -1) {
    info.os = 'Unix'
  } else if (os.indexOf('Linux') > -1) {
    info.os = 'Linux'
  } else {
    info.os = 'Other'
  }

  // 判断浏览器版本
  const isOpera = userAgent.indexOf('Opera') > -1 // 判断是否Opera浏览器
  const isSafari = userAgent.indexOf('Version') !== -1
  const isIE =userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera // 判断是否IE浏览器
  const isEdge = userAgent.toLowerCase().indexOf('edge') > -1 && !isIE // 判断是否IE的Edge浏览器
  const isIE11 =
    userAgent.toLowerCase().indexOf('trident') > -1 &&
    userAgent.indexOf('rv') > -1
  if (/[Ff]irefox(\/\d+\.\d+)/.test(userAgent)) {
    tempArray = /([Ff]irefox)\/(\d+\.\d+)/.exec(userAgent)
    info.browser = tempArray[1]
    info.version = tempArray[2]
  } else if (isIE) {
    var version = ''
    var reIE = new RegExp('MSIE (\\d+\\.\\d+);')
    reIE.test(userAgent)
    var fIEVersion = parseFloat(RegExp['$1'])
    if (fIEVersion === 7) {
      version = 'IE7'
    } else if (fIEVersion === 8) {
      version = 'IE8'
    } else if (fIEVersion === 9) {
      version = 'IE9'
    } else if (fIEVersion === 10) {
      version = 'IE10'
    } else {
      version = '0'
    }
    info.browser = version
    info.version = version
  } else if (isEdge) {
    info.browser = info.version = 'Edge'
  } else if (isIE11) {
    info.browser = info.version = 'IE11'
  } else if (/[Cc]hrome\/\d+/.test(userAgent)) {
    tempArray = /([Cc]hrome)\/(\d+)/.exec(userAgent)
    info.browser = tempArray[1]
    info.version = tempArray[2]
  } else if (isSafari) {
    tempArray = userAgent.split('/')
    info.browser = 'Safari'
    info.version = tempArray[tempArray.length - 2]
  } else if (/[Oo]pera.+[Vv]ersion\/\d+\.\d+/.test(userAgent)) {
    tempArray = /([Oo]pera).+[Vv]ersion\/(\d+)\.\d+/.exec(userAgent)
    info.browser = tempArray[1]
    info.version = tempArray[2]
  } else {
    info.browser = 'unknown'
    info.version = 'unknown'
  }
  return info
}
