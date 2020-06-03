'use strict';

const Controller = require('egg').Controller;

var BaseController =require('./base.js');

const fs=require('fs');

const pump = require('pump');

class UserController extends BaseController {

  
  async userinfo(){
    //读取用户信息
    var id = this.ctx.request.query.id; 
    var user = await this.ctx.model.User.find({"_id":id});  
    //读取用户评论信息
    var user_id_obj = this.app.mongoose.Types.ObjectId(id); 
    var comment=await this.ctx.model.Comment.aggregate([             
      {
        $match:{  
          "user_id":user_id_obj
        }
      },
      {
          $lookup:{
            from:'goods',
            localField:'goods_id',
            foreignField:'_id',
            as:'items'      
          }      
      },
    
    ])
    await this.ctx.render('index/user/userinfo.html',{
      user:user,
      comment:comment
    });
  }

  async userchange(){
    var id = this.ctx.request.query.id;   
    var user = await this.ctx.model.User.find({"_id":id});  
    await this.ctx.render('index/user/userchange',{
      user:user,
    });
  }

  async dc(){
        let parts = this.ctx.multipart({ autoFields: true });
        let files = {};               
        let stream;
        while ((stream = await parts()) != null) {
            if (!stream.filename) {          
              break;
            }       
            let fieldname = stream.fieldname;  //file表单的名字
            //上传图片的目录
            let dir=await this.service.tools.getUploadPath(stream.filename);
            let target = dir.uploadPath;         
            let writeStream = fs.createWriteStream(target);
            await pump(stream, writeStream);   
            files=Object.assign(files,{
              [fieldname]:dir.dbUploadPath  
            })
          //生成缩略图
          this.service.tools.jimpImg(target);
        }     
               
        var id=parts.field.id;
        var body = parts.field;
        console.log(body);
        
        var password=parts.field.password;
        if(password){
            var updateResult=Object.assign(files,parts.field);
            updateResult.password = await this.service.tools.md5(password);
            await this.ctx.model.User.updateOne({"_id":id},updateResult);
            await this.success('/user/userinfo?id='+id,'编辑用户成功');
        }else{
            var updateResult=Object.assign(files,parts.field);
            delete updateResult.password;
            await this.ctx.model.User.updateOne({"_id":id},updateResult);
            await this.success('/user/userinfo?id='+id,'编辑用户成功');
        }
  }


 

}

module.exports = UserController;
