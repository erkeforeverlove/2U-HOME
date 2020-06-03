'use strict';

const Controller = require('egg').Controller;

var BaseController =require('./base.js');

class KefuController extends BaseController {

  
  async index(){
    await this.ctx.render('index/kefu/kefu.html');
  }


  async doAdd(){
    var body = this.ctx.request.body; 
  
    var kefu = new this.ctx.model.Kefu(body);
    kefu.save();
    await this.success('/','提交信息成功')
    
  }


}

module.exports = KefuController;
