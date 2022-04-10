const express = require('express');
const session = require('express-session')
const app = express();
const cors = require('cors')
const artTemplate = require('art-template');
const express_template = require('express-art-template');
const PORT = 3200;

// 托管图片和当前所有文件
// app.use('/uploads', express.static(__dirname + '/uploads'))
app.use('/assets', express.static(__dirname + '/assets'))

//配置模板的路径
app.set('views', __dirname + '/views/');
//设置express_template模板后缀为.html的文件(不设这句话，模板文件的后缀默认是.art)
app.engine('html', express_template);
//设置视图引擎为上面的html
app.set('view engine', 'html');

// 允许跨域
app.use(cors())

// 获取body请求体参数中间件
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({
  extended: true
})) // for parsing application/x-www-form-urlencoded

// 初始化session配置
app.use(session({
  name: 'sessionID',
  secret: 'sad!@#$%^&*sd5464DG',
  cookie: {
    path: "/",
    httpOnly: true,
    maxAge: 60000 * 40, // 设置有效期为24分钟，说明：24分钟内，不访问就会过期，如果24分钟内访问了。则有效期重新初始化为24分钟。
  }
}))

// 中间件，对session用户信息进行检查判断，防止翻墙
// 后台页面的路由都需要判断，后台页面之外的路由都需要放行
app.use((req, res, next) => {
  // 获取所有路径转小写
  let reqPath = req.path.toLowerCase();
  const release = ['/login', '/signin', '/signup', '/getuserinfo'];
  // 判断访问路径是否为存在于释放数组内  为真继续往下执行
  if (release.includes(reqPath)) {
    next()
  } else {
    // 为假则继续判断其他不存在于释放数组内的路径是否有session用户信息 为真继续往下执行
    if (req.session.userInfo) {
      next()
    } else {
      // 为假则重定向到登录页
      res.redirect('/login')
      return
    }
  }
})

// 导入路由模块
const router = require('./router/router.js')

// 执行路由模块
app.use(router)

// 启动
app.listen(PORT, () => {
  console.log(`server is runing port ar ${PORT}`);
})