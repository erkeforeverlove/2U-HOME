'use strict';

var BaseController = require('./base.js')

class LoginController extends BaseController {
  
  async index() {
    await this.ctx.render('admin/login');
  }

  async doLogin() { 
    
    var ctx = this.ctx;
    var username = ctx.request.body.username;
    var password = await this.service.tools.md5(this.ctx.request.body.password);
    
    var code = ctx.request.body.code;

    if(code.toUpperCase()== ctx.session.code.toUpperCase()){      
        var result= await this.ctx.model.Admin.find({"username":username,"password":password});

        if(result.length>0){
          ctx.session.userinfo = result[0];
          ctx.redirect('/admin')
        }else{
           await this.error('/admin/login','用户名或错误')
        }
      }else{
        await this.error('/admin/login','验证码错误')
     } 
  }

  
  async logout(){
    this.ctx.session.userinfo = null;
    this.ctx.redirect('/admin/login')
  }

}

module.exports = LoginController;
