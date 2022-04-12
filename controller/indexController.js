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
  const sql = `delete from settings where Settings_id = ${id}`;
  const { affectedRows } = await query(sql)
  if (affectedRows > 0) {
    res.json({ err: '20000', msg: '删除成功' })
  } else {
    res.json({ err: '20002', msg: '删除失败' })
  }
}

module.exports = IndexController