const cloud = require('wx-server-sdk')
cloud.init({
  env: 'zhihao-2gqgyn10b1df04b1'
})
exports.main = async (event, context) => {
  try {
    return await cloud.uploadFile({
      cloudPath: event.path,
      fileContent: new Buffer(event.file, 'base64')
    })
  } catch (e) {
    return e;
  }
}