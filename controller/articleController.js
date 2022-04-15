const path = require('path')
const moment = require('moment')
const { promisify } = require('util')
const fs = require('fs');

// controller模块导入操控mysql模块  再操控mysql  数据库返回数据给页面可视化  此过程为MVC开发模式
const query = require('../model/configure.js');

const unlink = promisify(fs.unlink);
const rename = promisify(fs.rename);

// 存放路由业务逻辑  业务逻辑在此模块中执行
const articleController = {}

articleController.index = (req, res) => {
  res.render(`articlelist.html`);
}

articleController.addArticle = (req, res) => {
  res.render('addArticle.html')
}

articleController.edtiArticle = (req, res) => {
  res.render('edtiArticle.html')
}

// 文章列表分页查询
articleController.artData = async (req, res) => {
  const { page, limit, keyword } = req.query;
  let sql1 = `SELECT count(id) as count from article where 1  `;
  let sql2 = `select t1.*,t2.cate_name,t3.username from article t1 
  left join category t2 on t1.cate_id = t2.cate_id 
  left join users t3 on t1.author = t3.id
  where 1 `;
  if (keyword) {
    sql1 += ` AND title like '%${keyword}%'`
    sql2 += `AND t1.title like '%${keyword}%'`
  }
  // 查询起始位置 : （当前页-1）* 每页显示的条数
  const newpage = (page - 1) * limit;
  sql2 += `order by t1.id desc limit ${newpage},${limit}`

  const result = await query(sql1);
  const { count } = result[0];

  let data = await query(sql2)
  data = data.map((item) => {
    const { add_date, status, cate_name, username } = item;
    item.statusText = status == 1 ? '已审核' : "未审核"
    item.cate_name = cate_name || '未分类'
    item.username = username || '神秘者'
    item.add_date = add_date ? moment(add_date).format('YYYY-MM-DD HH:mm:ss') : '未添加'
    return item;
  })
  // 4. 响应数据
  res.json({ count, data, code: 0, msg: "sucess" })
}

// 文章删除
articleController.delArtData = async (req, res) => {
  let { id, pic } = req.query;
  const sql = `delete from article where id = ${id}`;
  const { affectedRows } = await query(sql)

  if (pic !== '') {
    const picPath = path.join(path.dirname(__dirname), pic);
    await unlink(picPath)
  }
  if (affectedRows > 0) {
    res.json({ err: "20000", msg: "删除成功" })
  } else {
    res.json({ err: "20001", msg: "删除失败" })
  }
}

// 文章添加
articleController.addArtData = async (req, res) => {
  const { title, cate_id, status, content } = req.body;
  const add_date = moment().format('YYYY-MM-DD HH:mm:ss')
  const author = req.session.userInfo.id;
  let pic = '';
  let sql = '';
  if (req.file) {
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
    sql = `insert into article(title,cate_id,status,content,add_date,author,pic) 
          values('${title}','${cate_id}','${status}','${content}','${add_date}','${author}','${pic}')`;
  } else {
    // 保留原图路径
    sql = `insert into article(title,cate_id,status,content,add_date,author) 
          values('${title}','${cate_id}','${status}','${content}','${add_date}','${author}')`;
  }

  const { affectedRows } = await query(sql)

  if (affectedRows > 0) {
    res.json({ err: "20000", msg: "添加成功。" })
  } else {
    res.json({ err: "20002", msg: "添加失败。" })
  }
}

// 文章查询
articleController.fetchOneArt = async (req, res) => {
  let id = req.query.id;
  const sql = `select * from article where id = ${id}`
  let result = await query(sql);
  res.json(result[0])
}

// 文章更新
articleController.updArtData = async (req, res) => {
  const { id, title, cate_id, status, content, oldPic } = req.body;
  let pic = '';
  let sql = '';
  if (req.file) {
    // 有则上传新图删除原图
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
    // 更新sql语句  删除原图路径
    sql = `update article set title = '${title}', content = '${content}', status = '${status}',cate_id = '${cate_id}',
          pic = '${pic}' where id = ${id} `
  } else {
    // 保留原图路径
    sql = `update article set title = '${title}', content = '${content}', status = '${status}',cate_id = '${cate_id}' 
    where id = ${id} `;
  }

  const { affectedRows } = await query(sql)

  if (affectedRows > 0) {
    res.json({ err: "20000", msg: "添加成功。" })
  } else {
    res.json({ err: "20003", msg: "添加失败。" })
  }
}

module.exports = articleController