const express = require('express');
const router = express();

const multer = require('multer');

// 设置上传的目录
// const upload = multer({
//   dest: './uploads/'
// })
// 导入控制器模块  把业务逻辑分离执行
const indexController = require('../controller/indexController.js')

router.get('/index', indexController.index)

// 登录页
router.get('/login', indexController.login)

// 处理用户登录
router.post('/signin', indexController.signin)

// 处理用户注册
router.post('/signup', indexController.signup)

// 判断用户注册账号是否已存在于数据库
router.get('/getuserinfo', indexController.getuserinfo)

// 退出登录清除session信息
router.get('/loginout', indexController.loginout)

// 导入操控插件
module.exports = router;