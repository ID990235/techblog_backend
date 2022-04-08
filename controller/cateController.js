const path = require('path')
const { promisify } = require('util')
const fs = require('fs');

// controller模块导入操控mysql模块  再操控mysql  数据库返回数据给页面可视化  此过程为MVC开发模式
const query = require('../model/configure.js');

// 存放路由业务逻辑  业务逻辑在此模块中执行
const cateController = {}
// 端口号
const PORT = 3200;
// 用promisify把fs.rename中间件封装  解决回调地狱问题
const rename = promisify(fs.rename);
// views路径
const viewsDir = path.join(path.dirname(__dirname), 'views')

cateController.cate = (req, res) => {
  res.render(`${viewsDir}/catelist.html`); 
}

module.exports = cateController