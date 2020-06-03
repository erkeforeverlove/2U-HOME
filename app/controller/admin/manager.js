'use strict';

var BaseController = require('./base.js')

class ManagerController extends BaseController {
 
  /**
   * 管理员 列表
   */
  async index() {
    var result =  await  this.ctx.model.Admin.aggregate([
      {
        $lookup:{
          from:'role',
          localField:'role_id',
          foreignField:'_id',
          as:'role'
        }
      },{
        $match:{
          is_super:0
        }
      }
    ])
    
    var superman =  await  this.ctx.model.Admin.aggregate([
      {
        $lookup:{
          from:'role',
          localField:'role_id',
          foreignField:'_id',
          as:'role'
        }
      },{
        $match:{
          is_super:1
        }
      }
    ])
    
    await this.ctx.render('admin/manager/index',{
      items:result,
      superman:superman[0]
    });
  } 
  
  /**
   * 管理员添加 页面
   * 获取角色 数据
   * 渲染 添加管理员页面
   */
  async add() {
    var roles = await this.ctx.model.Role.find({})
    await this.ctx.render('admin/manager/add',{
      roles:roles
    });
  } 

  /**
   * 管理员添加 提交
   */
  async doAdd(){
    //获取参数 密码加密
    // 判断 用户名是否重复
    // 重复 提示错误
    //不重复 保存数据
    //提示成功
    var reqBody = this.ctx.request.body;
    reqBody.password = await this.ctx.service.tools.md5(reqBody.password);

    var result =await  this.ctx.model.Admin.find({'username':reqBody.username})
    console.log(result[0])
    if(result.length>0){
        await this.error('/admin/manager/add','此管理员已经存在');
    }else{
      var admin = new this.ctx.model.Admin(reqBody);
      admin.save();
      await this.success('/admin/manager','添加管理员 成功')
    }
  }
  
  /**
   * 管理员 编辑页面
   */
  async edit() {
    // 获取参数 id
    // 获取admin  依据id
    // 获取角色列表
    
    var id = this.ctx.request.query.id;
    var adminResult =await this.ctx.model.Admin.find({'_id':id});
    var roleResult =await this.ctx.model.Role.find();
    
    await this.ctx.render('/admin/manager/edit',{
      admin:adminResult[0],
      roles:roleResult,
    });
  }
  
  /**
   * 管理员 编辑 提交
   */
  async doEdit() {


    var id=this.ctx.request.body.id;
    var username=this.ctx.request.body.username;
    var password=this.ctx.request.body.password;
    var mobile=this.ctx.request.body.mobile;
    var email=this.ctx.request.body.email;
    var role_id=this.ctx.request.body.role_id;    

    if(password){
      //修改密码
      password=await this.service.tools.md5(password);
      await this.ctx.model.Admin.updateOne({"_id":id},{
        username,
        password,
        mobile,
        email,
        role_id
      })
    }else{
      //不修改密码
      await this.ctx.model.Admin.updateOne({"_id":id},{
        username,
        mobile,
        email,
        role_id
      })
    }


    await this.success('/admin/manager','修改用户信息成功')
  }
 


  async delete(){
    const {ctx}=this
    var id=ctx.request.query.id
    var result=await this.ctx.model.Admin.deleteOne({"_id":id});
    if(result){
        await this.success(ctx.locals.lastPage,'管理员删除成功')
    }else{
        await this.fail(ctx.locals.lastPage,'管理员删除失败')
    }
  }

}

module.exports = ManagerController;
