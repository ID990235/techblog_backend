const path = require('path')

// controller模块导入操控mysql模块  再操控mysql  数据库返回数据给页面可视化  此过程为MVC开发模式
const query = require('../model/configure.js');

// 存放路由业务逻辑  业务逻辑在此模块中执行
const articleController = {}

articleController.index = (req, res) => {
  res.render(`articlelist.html`); 
}

module.exports = articleController