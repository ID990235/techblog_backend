
(function ($) {
  "use strict";


  /*==================================================================
 [ Focus input ]*/
  $('.input100').each(function () {
    $(this).on('blur', function () {
      if ($(this).val().trim() != "") {
        $(this).addClass('has-val');
      }
      else {
        $(this).removeClass('has-val');
      }
    })
  })


  /*==================================================================
  [ Validate ]*/
  let txt1Ele = $('.txt1')[0];
  let txt2Ele = $('.txt2')[0];
  let signinEle = $('.validate-form-signin')[0];
  let signupEle = $('.validate-form-signup')[0];
  // 正则判断
  let userReg = /^[a-zA-Z]+\w{7,}$/;
  let passReg = /^.{8,}$/;
  let signReg = /\.|\*|\@/;

  var input101 = $('.wrap-input101 .input101');
  // 登录
  $(signinEle).on('submit', function () {
    let check = true;
    let ipt0 = $(input101[0]).val()
    let ipt1 = $(input101[1]).val()
    const data = $("#loginForm").serialize()

    for (var i = 0; i < input101.length; i++) {
      if (validate(input101[i]) == false) {
        showValidate(input101[i]);
        check = false;
      }
    }
    if (!check) layer.msg('请输入用户名和密码', { icon: 2 })

    if (check) {
      if (!userReg.test(ipt0)) {
        layer.msg('用户名最少8位，开头必须是字母，只包含字母、数字和下划线。', { icon: 2 })
        return false
      } else if (!passReg.test(ipt1) || !signReg.test(ipt1)) {
        layer.msg('密码最少8位，需包含".或*或@"。', { icon: 2 })
        return false
      } else {
        $.post('/signin', data).then(res => {
          const { err, msg } = res;
          err == '20003' ? layer.msg(msg, { icon: 2 }) : location.href = '/'
        })
        return false;
      }
    }

  });

  var input102 = $('.wrap-input102 .input102');
  let promptEle = $('.prompt span')[0]

  let time;
  function close() {
    if (time) clearTimeout(time)
    time = setTimeout(() => {
      $(promptEle).text('')
    }, 3000)
  }
  $(input102[0]).on('keyup', debounce(function () {
    $.ajax({
      type: 'get',
      url: `/getuserinfo?username=${$(this).val()}`,
      success: function (data) {
        if ($(input102[0]).val() != '') {
          if (data.err == '20002') {
            $(promptEle).addClass('prompt-red').removeClass('prompt-green').text(data.msg)
          } else {
            $(promptEle).addClass('prompt-green').removeClass('prompt-red').text(data.msg)
          }
          close()
        }
      }
    })
  }, 800))

  //防抖函数
  function debounce(fn, delay) {
    // 闭包变量 ，用来记录保存上一次的延时器变量
    var timer;
    return function () {
      var context = this;
      var args = [...arguments];
      // 清除上一次延时器,取消执行
      if (timer) { clearTimeout(timer) };

      timer = setTimeout(function () {
        fn.apply(context, args)
      }, delay)
    }
  }

  // 注册
  $(signupEle).on('submit', function () {
    let check = true;
    let ipt0 = $(input102[0]).val()
    let ipt1 = $(input102[1]).val()
    let ipt2 = $(input102[2]).val()

    for (var i = 0; i < input102.length; i++) {
      if (validate(input102[i]) == false) {
        showValidate(input102[i]);
        check = false;
      }
    }

    if (!check) {
      layer.msg('请输入用户名和密码。', { icon: 2 })
      return false
    }

    if (check) {
      if (!userReg.test(ipt0)) {
        layer.msg('用户名最少8位，开头必须是字母，只包含字母、数字和下划线。', { icon: 2 })
        return false
      } else if (ipt2 != ipt1) {
        layer.msg('密码不一致', { icon: 2 })
        return false
      } else if (!passReg.test(ipt1) || !signReg.test(ipt1)) {
        layer.msg('密码最少8位，需包含".或*或@"。', { icon: 2 })
        return false
      } else {
        $.ajax({
          type: 'post',
          url: '/signup',
          data: {
            'username': ipt0,
            'password': ipt1
          },
          success: function (data) {
            data.err == '20001' ? layer.msg(`${data.msg}`, { icon: 2 }) : layer.msg(`${data.msg}`, { icon: 1 }), $(txt2Ele).click()
          }
        })
        return false;
      }
    }

  });


  $(txt1Ele).on('click', function () {
    $.each(input101, function (index, value) {
      hideValidate(input101[index]);
      $(input101[index]).val('')
    })
    $(signinEle).css({ display: 'none' })
    $(signupEle).css({ display: 'block' })
  })

  $(txt2Ele).on('click', function () {
    $.each(input102, function (index, value) {
      hideValidate(input102[index]);
      $(input102[index]).val('')
    })
    $(signinEle).css({ display: 'block' })
    $(signupEle).css({ display: 'none' })
  })


  $('.validate-form .input100').each(function () {
    $(this).focus(function () {
      hideValidate(this);
    });
  });

  function validate(input) {
    if ($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
      if ($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
        return false;
      }
    }
    else {
      if ($(input).val().trim() == '') {
        return false;
      }
    }
  }

  function showValidate(input) {
    var thisAlert = $(input).parent();

    $(thisAlert).addClass('alert-validate');
  }

  function hideValidate(input) {
    var thisAlert = $(input).parent();

    $(thisAlert).removeClass('alert-validate');
  }



})(jQuery);