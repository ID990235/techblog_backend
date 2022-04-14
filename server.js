const express = require('express');
const session = require('express-session')
const app = express();
const cors = require('cors')
const artTemplate = require('art-template');
const express_template = require('express-art-template');
const PORT = 3200;

// 托管图片和当前所有文件
app.use('/uploads', express.static(__dirname + '/uploads'))
app.use('/assets', express.static(__dirname + '/assets'))

// 导入路由模块
const router = require('./router/router.js')
const checkSessAuth = require('./model/checkSessAuth.js')

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

// 中间件，判断session阻止翻墙
app.use(checkSessAuth)

// 执行路由模块
app.use(router)

// 启动
app.listen(PORT, () => {
  console.log(`server is runing port ar ${PORT}`);
})