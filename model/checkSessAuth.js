// 中间件，对session用户信息进行检查判断，防止翻墙
// 后台页面的路由都需要判断，后台页面之外的路由都需要放行
module.exports = (req, res, next) => {
  // 获取所有路径转小写
  let reqPath = req.path.toLowerCase();
  const release = ['/login', '/signin', '/signup', '/getuserinfo'];
  // 判断访问路径是否为存在于释放数组内  为真继续往下执行
  if (release.includes(reqPath)) {
    next()
  } else {
    // 为假则继续判断其他不存在于释放数组内的路径是否有session用户信息 为真继续往下执行
    if (req.session.userInfo) {
      next()
    } else {
      // 为假则重定向到登录页
      res.redirect('/login')
      return
    }
  }
}