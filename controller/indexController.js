const path = require('path')
const { promisify } = require('util')
const fs = require('fs');

// controller模块导入操控mysql模块  再操控mysql  数据库返回数据给页面可视化  此过程为MVC开发模式
const query = require('../model/configure.js');

// 存放路由业务逻辑  业务逻辑在此模块中执行
const IndexController = {}
// 端口号
const PORT = 3200;
// 用promisify把fs.rename中间件封装  解决回调地狱问题
const rename = promisify(fs.rename);
// views路径
const viewsDir = path.join(path.dirname(__dirname), 'views')

IndexController.index = (req, res) => {
  res.render(`${viewsDir}/index.html`); 
}

// 登录页
IndexController.login = (req, res) => {
  res.sendFile(`${viewsDir}/login.html`);
}

// 处理用户登录
IndexController.signin = async (req, res) => {
  // 接受post参数
  let { username, password } = req.body;
  // 数据库查询用户数据
  let sql = 'SELECT * FROM account_data';
  const Account_data = await query(sql)
  // 验证用户账号和密码是否匹配 
  const findAccount_data = Account_data.find((item) => {
    const { username: u, password: p } = item;
    if (username == u && password == p) {
      return true;
    }
    return false;
  })

  if (findAccount_data) {
    // 成功,通过session记住用户信息，直接重定向到首页/index,
    req.session.userInfo = findAccount_data;
    res.redirect('/index')
  } else {
    // 如果失败提示用户名或密码错误
    res.redirect('/login')
  }
}

// 处理用户注册
IndexController.signup = async (req, res) => {
  // 接受post参数
  let { username, password } = req.body;
  // 数据库查询用户数据
  let sql = `insert into account_data(username,password)values('${username}','${password}')`;
  const Account_data = await query(sql)

  if (Account_data.affectedRows > 0) {
    res.json({ err: 20000, msg: '注册成功' })
  } else { 
    res.json({ err: 20001, msg: '注册失败' })
  }
}

// 判断用户注册账号是否已存在于数据库
IndexController.getuserinfo = async (req, res) => {
  let username = req.query.username;
  let sql = `SELECT username FROM account_data`;
  const Account_data = await query(sql);
  const filterAccount_data = Account_data.every((item) => {
    const { username: u } = item;
    return username != u;
  })

  if (filterAccount_data) {
    res.json({ err: 20000, msg: '该账号可用' })
  } else {
    res.json({ err: 20002, msg: '该账号已被使用' })
  }
}

// 用户退出清除session信息
IndexController.loginout = (req, res) => {
  req.session.destroy(function (err) {
    if (err) throw err;
  })
  res.redirect('/login')
}

module.exports = IndexController