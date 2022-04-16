const query = require('../model/configure')
const moment = require('moment')

const homeController = {};

homeController.cate = async (req, res) => {
  const sql = `select * from category order by orderBy desc`
  const results = await query(sql);
  res.json(results)
}

homeController.article = async (req, res) => {
  const { page = 1, pagesize = 10 } = req.query;
  const newPage = (page - 1) * pagesize;
  const sql = `SELECT t1.*,t2.cate_name,t3.username from 
  article t1 LEFT JOIN category t2 on t1.cate_id = t2.cate_id 
  LEFT JOIN users t3 on t1.author = t3.id WHERE t1.status = 1 ORDER BY t1.id DESC LIMIT ${newPage},${pagesize}`;
  let results = await query(sql);
  res.json(results)
}

homeController.fetchCateArt = async (req, res) => {
  const { cate_id } = req.query;
  const sql = `SELECT t1.*,t2.cate_name,t3.username from 
  article t1 LEFT JOIN category t2 on t1.cate_id = t2.cate_id 
  LEFT JOIN users t3 on t1.author = t3.id WHERE t1.status = 1 and t1.cate_id = ${cate_id}`
  let results = await query(sql)
  results.map((item) => {
    const { add_date } = item;
    item.add_date = add_date ? moment(add_date).format('YYYY-MM-DD HH:mm:ss') : '未添加'
    return item;
  })
  res.json(results)
}

homeController.fetchOneArt = async (req, res) => {
  const { id } = req.query;
  const sql = `select t1.*,t2.cate_name,t3.username from article t1 left join category t2 on t1.cate_id = t2.cate_id
  LEFT JOIN users t3 on t1.author = t3.id where t1.id = ${id}`
  let results = await query(sql);
  results.map((item) => {
    const { add_date } = item;
    item.add_date = add_date ? moment(add_date).format('YYYY-MM-DD HH:mm:ss') : '未添加'
    return item;
  })
  res.json(results)
}

module.exports = homeController;