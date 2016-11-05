/**
 * Created by aweiu on 16/11/4.
 */
import uuid from 'uuid'
import Cache from 'cache-promise'
var promiseCache = {}
function getRandomName (fileName) {
  var pos = fileName.lastIndexOf('.')
  var suffix = pos === -1 ? '' : fileName.substring(pos)
  return uuid.v4().replace(/-/g, '') + suffix
}
function Upload (options) {
  this.options = options
  this.signature = new Cache(options.signatureGetter, options.expiration)
}
Upload.prototype.post = function (file, cacheKey) {
  var cache = promiseCache[cacheKey]
  if (cache) return cache
  else {
    var options = this.options
    var fileName = options.randomName ? getRandomName(file.name) : file.name
    var promise = this.signature.get()
      .then(rs => {
        var formData = new window.FormData()
        formData.append('signature', rs.signature)
        formData.append('OSSAccessKeyId', rs.accessId)
        formData.append('policy', rs.policy)
        formData.append('key', options.dir + '/' + fileName)
        formData.append('file', file)
        if (options.hasOwnProperty('successActionStatus')) formData.append('success_action_status', options.successActionStatus)
        return this.options.uploader(formData)
      })
      .then(rs => {
        return {
          path: '/' + options.dir + '/' + fileName,
          data: rs
        }
      })
    return cacheKey ? (promiseCache[cacheKey] = promise) : promise
  }
}
export default Upload
