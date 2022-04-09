const path = require('path')

// controller模块导入操控mysql模块  再操控mysql  数据库返回数据给页面可视化  此过程为MVC开发模式
const query = require('../model/configure.js');

// 存放路由业务逻辑  业务逻辑在此模块中执行
const IndexController = {}
// 端口号
const PORT = 3200;

// 后台管理首页
IndexController.index = (req, res) => {
  res.render(`index.html`);
}
IndexController.setting = (req, res) => {
  res.render(`System_Settings.html`);
}

// 登录页
IndexController.login = (req, res) => {
  res.render(`login.html`);
}

// 系统设置：获取数据
IndexController.systemData = async (req, res) => {
  const sql = 'select * from settings';
  const data = await query(sql)
  const responseData = {
    data,
    code: 0,
    msg: "success"
  }
  res.json(responseData)
}
// 系统设置：添加数据
IndexController.addsystemData = async (req, res) => {
  let { areaInfo, styleInfo } = req.body
  const sql = `insert into settings(name,val)values('${areaInfo}','${styleInfo}')`;
  const { affectedRows } = await query(sql)
  if (affectedRows > 0) {
    res.json({ err: '20000', msg: '添加成功' })
  } else {
    res.json({ err: '20003', msg: '添加失败' })
  }
}
// 系统设置：修改数据
IndexController.updsystemData = async (req, res) => {
  let { Settings_id, name, val } = req.body
  const sql = `update settings set name = '${name}',val = '${val}' where Settings_id = ${Settings_id}`;
  const { affectedRows } = await query(sql);

  if (affectedRows > 0) {
    res.json({ err: '20000', msg: '编辑成功' })
  } else {
    res.json({ err: '20004', msg: '编辑失败' })
  }
}
// 系统设置：删除数据
IndexController.rmsystemData = async (req, res) => {
  let id = req.query.id;
  console.log(id);
  const sql = `delete from settings where Settings_id = ${id}`;
  const { affectedRows } = await query(sql)
  if (affectedRows > 0) {
    res.json({ err: '20000', msg: '删除成功' })
  } else {
    res.json({ err: '20002', msg: '删除失败' })
  }
}

// 处理用户登录
IndexController.signin = async (req, res) => {
  // 接受post参数
  let { username, password } = req.body;
  // 数据库查询用户数据
  let sql = `SELECT * FROM account_data where username = '${username}'and password = '${password}'`;
  const Account_data = await query(sql)

  if (Account_data.length > 0) {
    // 成功,通过session记住用户信息，直接重定向到首页/index,
    req.session.userInfo = Account_data;
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