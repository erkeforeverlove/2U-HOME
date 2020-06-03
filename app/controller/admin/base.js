'use strict';

const Controller = require('egg').Controller;

class BaseController extends Controller {
  
  async success(redirectUrl,message) {
    await this.ctx.render('admin/public/success',{
        redirectUrl:redirectUrl,
        message:message||'操作成功'
    })
  }

  async error(redirectUrl,message) {
    await this.ctx.render('admin/public/error',{
        redirectUrl:redirectUrl,
        message:message||'操作失败'
    })
  }
  
  async verify() {
      var captcha = await this.service.tools.captcha();
      this.ctx.session.code = captcha.text; /* 验证码的信息*/
      this.ctx.response.type = 'image/svg+xml';
      this.ctx.body = captcha.data;
  }

   //改变状态的方法  Api接口
  async changeStatus() {
    var model=this.ctx.request.query.model; /*数据库表 Model*/
    var attr=this.ctx.request.query.attr; /*更新的属性 如:status is_best */
    var id=this.ctx.request.query.id; /*更新的 id*/
    var result=await this.ctx.model[model].find({"_id":id});       
    var json = {}
    if(result.length>0){
      if(result[0][attr]==1){
          json={/*es6 属性名表达式*/
            [attr]:0
          }
      }else{
        json={
          [attr]:1
        }
      }
      //执行更新操作
      var updateResult=await this.ctx.model[model].updateOne({"_id":id},json);       

      if(updateResult){
        this.ctx.body={"message":'更新成功',"success":true};
      }else{
        this.ctx.body={"message":'更新失败',"success":false};
      }
    }else{
      //接口
      this.ctx.body={"message":'更新失败,参数错误',"success":false};
    }
  }

  //改变数量的方法
  async  editNum() {

    var model=this.ctx.request.query.model; /*数据库表 Model*/
    var attr=this.ctx.request.query.attr; /*更新的属性 如:sort */
    var id=this.ctx.request.query.id; /*更新的 id*/
    var num=this.ctx.request.query.num; /*数量*/

    var result=await this.ctx.model[model].find({"_id":id});       
    
    if(result.length>0){

      var json={/*es6 属性名表达式*/

        [attr]:num
      }

      //执行更新操作
      var updateResult=await this.ctx.model[model].updateOne({"_id":id},json);       

      if(updateResult){
        this.ctx.body={"message":'更新成功',"success":true};
      }else{

        this.ctx.body={"message":'更新失败',"success":false};
      }

    }else{
      //接口
      this.ctx.body={"message":'更新失败,参数错误',"success":false};

    }


  }

}

module.exports = BaseController;
