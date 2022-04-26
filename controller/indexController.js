const path = require('path')
const { promisify } = require('util')
const fs = require('fs');

// controller模块导入操控mysql模块  再操控mysql  数据库返回数据给页面可视化  此过程为MVC开发模式
const query = require('../model/configure.js');

const unlink = promisify(fs.unlink);
const rename = promisify(fs.rename);

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

// 系统设置：修改数据
IndexController.updsystemData = async (req, res) => {
  let { logoText, oldPic } = req.body
  let pic = ''
  if (req.file) {
    const sql1 = `update settings set val = '${logoText}' where Settings_id = 1`;
    const { affectedRows: af1 } = await query(sql1);

    let { originalname, filename } = req.file;
    let uploadDir = './uploads'
    let extName = originalname.substring(originalname.lastIndexOf('.'))
    let oldName = path.join(uploadDir, filename);
    let newName = path.join(uploadDir, filename) + extName;
    // 修改上传文件名字
    await rename(oldName, newName)

    const picPath = path.join(path.dirname(__dirname), oldPic);
    await unlink(picPath)

    // 上传成功，把路径写到sql语句中，插入到数据库中
    pic = `/uploads/${filename}${extName}`
    const sql2 = `update settings set val = '${pic}' where Settings_id = 2`;
    const { affectedRows } = await query(sql2);
    affectedRows && af1 > 0 ? res.json({ err: '20000', msg: '编辑成功' }) : res.json({ err: '20005', msg: '编辑失败' })
    return;
  }

  const sql1 = `update settings set val = '${logoText}' where Settings_id = 1`;
  const { affectedRows } = await query(sql1);
  affectedRows > 0 ? res.json({ err: '20000', msg: '编辑成功' }) : res.json({ err: '20004', msg: '编辑失败' })
}

module.exports = IndexController