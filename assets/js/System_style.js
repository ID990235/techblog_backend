; (function () {
  layui.use(['element', 'layer', 'util'], async function () {
    var element = layui.element
      , layer = layui.layer
      , util = layui.util
      , $ = layui.$;
    const { data } = await $.get('/systemData')
    let logoText = ''
    let headerColor = ''
    let sideColor = ''
    for (let item of data) {
      if (item.name === 'logoText') {
        logoText = item.val;
      } else if (item.name === 'headerColor') {
        headerColor = item.val;
      } else if (item.name === 'sideColor') {
        sideColor = item.val ;
      }
    }
    $("#logoText").text(logoText = '小明博客')
    // 存储到本地存储或cookie，供其他页面使用
    localStorage.setItem('logoText', logoText)
    $("#headerColor").css({ backgroundColor: `${headerColor}` })
    localStorage.setItem('headerColor', headerColor)
  });
}
)()