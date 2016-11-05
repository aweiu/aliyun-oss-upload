# aliyun-oss-upload
用于阿里云OSS采用服务端签名后WEB直传

## 安装
```
npm install aliyun-oss-upload
```
## 初始化
```
var ossUpload = new OssUpload({
  // 上传目录
  dir: 'datas/imgs',
  // OSS签名缓存时间
  expiration: 120000,
  // 是否使用uuid随机文件名。默认：false
  randomName: true,
  // 文件上传成功后的http返回码。默认：204
  successActionStatus: 200
  // 获取oss签名方法
  signatureGetter () {
    // 假设你使用的是httpFetch来请求数据
    // 该方法必须返回Promise对象
    return httpFetch.get('/oss_signature')
  },
  // 文件上传方法
  uploader (formData) {
    // formData：文件上传所需的FormData对象
    // 假设使用httpFetch来上传文件
    // 该方法必须返回Promise对象
    return httpFetch.post('http://xxx.oss-cn-shenzhen.aliyuncs.com', formData)
  }
})
```
## 关于signatureGetter
该方法返回的Promise，resolve的对象至少需要包含policy,accessId,signature。形如：
```
{
  policy: 'policy',
  accessId: 'OSSAccessKeyId',
  signature: 'signature'
}
```
## 开始上传
```
ossUpload.post(file, [cacheKey])
  .then(result => {
    console.log(result)
  })
```
**cacheKey**
用于缓存文件请求。你可以传一个唯一标志来区分你要上传的文件，这样当插件检测到上传的是同一个文件时，会直接复用之前的请求<br>
一般用在上传图片的时候，使用图片的base64码来作为唯一标志再好不过了<br>
**Result**对象：
```
{
  path: '已上传的文件路径("/" + options.dir + "/" + FileName)',
  data: '配置中uploader方法的返回值'
}
```
## 其他
* 如果后端恰好使用的是nodeJs，不妨使用[aliyun-oss-sign](https://github.com/aweiu/aliyun-oss-sign)来返回oss签名
* [Web端直传实践 —— 采用服务端签名后直传](https://help.aliyun.com/document_detail/31926.html?spm=5176.doc31925.6.180.Z8NIV6)
