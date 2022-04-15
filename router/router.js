const express = require('express');
const router = express();

const multer = require('multer');

// 设置上传的目录
const upload = multer({
  dest: './uploads/'
})
// 导入控制器模块  把业务逻辑分离执行
const indexController = require('../controller/indexController.js')
const cateController = require('../controller/cateController.js')
const articleController = require('../controller/articleController.js')
const userController = require('../controller/userController.js')

// 管理业首页
router.get('/', indexController.index)

// 登录页
router.get('/login', indexController.login)

// 分离页面
router.get('/cate', cateController.index)
router.get('/article', articleController.index)
router.get('/setting', indexController.setting)
router.get('/addArticle', articleController.addArticle)
router.get('/edtiArticle', articleController.edtiArticle)

// 分类页数据
router.get('/cateData', cateController.cateData)
router.post('/updCateData', cateController.updCateData)
router.post('/addCateData', cateController.addCateData)
router.get('/removeCateData', cateController.removeCateData)
router.get('/cateCount', cateController.cateCount)

// 文章列表数据
router.get('/artData', articleController.artData)
router.get('/delArtData', articleController.delArtData)
router.get('/fetchOneArt', articleController.fetchOneArt)
router.post('/addArtData', upload.single('pic'), articleController.addArtData)
router.post('/updArtData', upload.single('pic'), articleController.updArtData)

// 系统设置数据
router.get('/systemData', indexController.systemData)
router.post('/addsystemData', indexController.addsystemData)
router.post('/updsystemData', indexController.updsystemData)
router.get('/rmsystemData', indexController.rmsystemData)

// 处理用户登录
router.post('/signin', userController.signin)
router.post('/upduserinfo', upload.single('avatar'), userController.upduserinfo)
// 修改密码
router.post('/newpassword', userController.newpassword)
// 处理用户注册
router.post('/signup', userController.signup)
// 判断用户注册账号是否已存在于数据库
router.get('/getuserinfo', userController.getuserinfo)
// 退出登录清除session信息
router.get('/loginout', userController.loginout)

// 导入操控插件
module.exports = router;