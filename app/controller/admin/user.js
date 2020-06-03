'use strict';

var BaseController =require('./base.js');

const fs=require('fs');

const pump = require('pump');

class UserController extends BaseController {
     
      async index() {
        var page=this.ctx.request.query.page || 1;
        var pageSize=4;       
        //获取当前数据表的总数量
        var totalNum=await this.ctx.model.User.find({}).count();
        //分页查询
        var result=await this.ctx.model.User.find({}).skip((page-1)*pageSize).limit(pageSize);
         await this.ctx.render('admin/user/index',{
           userArray:result,
           totalPages:Math.ceil(totalNum/pageSize),
           page:page
         });
      }     
    
      

      async edit() {
        var _id=this.ctx.query.id;
        var result=await this.ctx.model.User.find({"_id":_id});
        await this.ctx.render('admin/user/edit',{
          user:result[0],
          prevPage:this.ctx.state.lastPage
        });
      } 

      async doEdit() {
            
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

        }     
        
        var id=parts.field._id;
        var password=parts.field.password;
        if(password){
            var updateResult=Object.assign(files,parts.field);
            updateResult.password = await this.service.tools.md5(password);     
            var prevPage=parts.field.prevPage;         
            var result = await this.ctx.model.User.updateOne({"_id":id},updateResult);       
            if(result){
              await this.success(prevPage,'编辑用户成功'); 
            }else{
              await this.fail(prevPage,'编辑用户失败'); 
            }
        }else{
            var updateResult=Object.assign(files,parts.field);
            delete updateResult.password;     
            var prevPage=parts.field.prevPage;         
            var result = await this.ctx.model.User.updateOne({"_id":id},updateResult);       
            if(result){
              await this.success(prevPage,'编辑用户成功'); 
            }else{
              await this.fail(prevPage,'编辑用户失败'); 
            }
        }
        
 
            
    } 

 
      async delete(){
        
        var id=this.ctx.query.id;
      
        var result=await this.ctx.model.User.deleteOne({"_id":id});
        if(result){
            await this.success(this.ctx.locals.lastPage,'用户删除成功')
        }else{
            await this.fail(this.ctx.locals.lastPage,'用户删除失败')
        }
      }
}

module.exports = UserController;
