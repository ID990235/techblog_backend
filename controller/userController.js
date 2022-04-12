const path = require('path')
const { promisify } = require('util')
const fs = require('fs');
const md5 = require('md5')

// controller模块导入操控mysql模块  再操控mysql  数据库返回数据给页面可视化  此过程为MVC开发模式
const query = require('../model/configure.js');
const { password_secret } = require('../config/other.js')

// 用promisify把fs.rename中间件封装  解决回调地狱问题
const rename = promisify(fs.rename);

// 存放路由业务逻辑  业务逻辑在此模块中执行
const UserController = {}
// 端口号
const PORT = 3200;

// 处理用户登录
UserController.signin = async (req, res) => {
  // 接受post参数
  let { username, password } = req.body;
  // 数据库查询用户数据
  password = md5(`${password}${password_secret}`)
  let sql = `SELECT * FROM users where username = '${username}'and password = '${password}'`;
  const Account_data = await query(sql)

  if (Account_data.length > 0) {
    // 成功,通过session记住用户信息，直接重定向到首页/index,
    req.session.userInfo = Account_data[0];
    // 将用户信息存在cookie中  客户端做一些回显操作
    res.cookie('userinfo', JSON.stringify(Account_data[0]))
    res.json({ err: '20000', msg: '登录成功' })
  } else {
    // 如果失败提示用户名或密码错误
    res.json({ err: '20003', msg: '用户名或密码错误。' })
  }
}

// 个人信息修改
UserController.upduserinfo = async (req, res) => {
  // let id = req.query.id
  let { id } = req.session.userInfo
  let { username, intro, isPicReplace } = req.body
  // 获取旧图路径
  let rows = await query(`select users.avatar from users where id = ${id}`)
  let oldPic = rows[0].avatar;

  let pic = '';
  let sql = '';
  if (isPicReplace == 1) {
    // 有则上传新图删除原图
    let { originalname, filename } = req.file;
    let uploadDir = './uploads'
    let extName = originalname.substring(originalname.lastIndexOf('.'))
    let oldName = path.join(uploadDir, filename);
    let newName = path.join(uploadDir, filename) + extName;

    // 修改上传文件名字
    await rename(oldName, newName)

    // 上传成功，把路径写到sql语句中，插入到数据库中
    pic = `/uploads/${filename}${extName}`
    // 更新sql语句  删除原图路径
    sql = `update users set username = '${username}',intro='${intro}',avatar='${pic}' where id=${id}`;
  } else {
    // 保留原图路径
    sql = `update users set username = '${username}',intro='${intro}' where id=${id}`;
  }

  const results = await query(sql);

  if (results.affectedRows > 0) {
    // 成功更新后且isPicReplace == 1 则删除原图路径
    if (isPicReplace == 1) {
      const picPath = path.join(path.dirname(__dirname), oldPic);
      fs.unlink(picPath, () => { })
    }
    // 取出用户信息，再同步session和cookie中的用户信息
    const sql = `select * from users where id = ${id}`
    const result = await query(sql)
    // 将信息记录到session或cookie
    res.cookie('userinfo', JSON.stringify(result[0]), {
      expires: new Date(Date.now() + 40 * 3600000),
    })
    res.json({ pic, err: '20000', msg: '修改成功', }); // 成功
  } else {
    res.json({ err: '20004', msg: '修改失败' }); // 失败
  }
}

// 修改密码
UserController.newpassword = async (req, res) => {
  let { id, oldpassword, newpassword } = req.body
  oldpassword = md5(`${oldpassword}${password_secret}`)
  newpassword = md5(`${newpassword}${password_secret}`)
  const sql1 = `select password from users where password = '${oldpassword}'`;
  const results1 = await query(sql1);
  if (results1.length > 0) {
    const sql2 = `update users set password = '${newpassword}' where id = ${id}`;
    const { affectedRows } = await query(sql2);
    if (affectedRows > 0) {
      res.json({ err: "20000", msg: "修改密码成功。" })
    } else {
      res.json({ err: "20006", msg: "修改密码失败。" })
    }
  } else {
    res.json({ err: "20005", msg: "旧密码不正确。" })
  }
}

// 处理用户注册
UserController.signup = async (req, res) => {
  // 接受post参数
  let { username, password } = req.body;
  // 数据库查询用户数据
  password = md5(`${password}${password_secret}`)
  let sql = `insert into users(username,password)values('${username}','${password}')`;
  const Account_data = await query(sql)

  if (Account_data.affectedRows > 0) {
    res.json({ err: 20000, msg: '注册成功' })
  } else {
    res.json({ err: 20001, msg: '注册失败' })
  }
}

// 判断用户注册账号是否已存在于数据库
UserController.getuserinfo = async (req, res) => {
  let username = req.query.username;
  let sql = `SELECT username FROM users`;
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
UserController.loginout = (req, res) => {
  req.session.destroy(function (err) {
    if (err) throw err;
  })
  res.redirect('/login')
}

module.exports = UserController