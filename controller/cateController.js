const path = require('path')

// controller模块导入操控mysql模块  再操控mysql  数据库返回数据给页面可视化  此过程为MVC开发模式
const query = require('../model/configure.js');

// 存放路由业务逻辑  业务逻辑在此模块中执行
const cateController = {}

cateController.index = (req, res) => {
  res.render(`catelist.html`);
}

// 获取分类数据
cateController.cateData = async (req, res) => {
  const sql = 'select * from category';
  const data = await query(sql);
  const responseData = {
    data,
    code: 0,
    msg: "success"
  }
  res.json(responseData)
}

// 添加分类数据
cateController.updCateData = async (req, res) => {
  let { cate_id, cate_name, orderBy } = req.body
  const sql = `update category set cate_name = '${cate_name}',orderBy = ${orderBy} where cate_id = ${cate_id}`;
  const { affectedRows } = await query(sql);

  if (affectedRows > 0) {
    res.json({ err: '20000', msg: '编辑成功' })
  } else {
    res.json({ err: '20001', msg: '编辑失败' })
  }
}

// 删除分类数据
cateController.removeCateData = async (req, res) => {
  let id = req.query.id;
  const sql = `delete from category where cate_id = ${id}`;
  const { affectedRows } = await query(sql)
  if (affectedRows > 0) {
    res.json({ err: '20000', msg: '删除成功' })
  } else {
    res.json({ err: '20002', msg: '删除失败' })
  }

}

module.exports = cateController