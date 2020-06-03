'use strict';

var BaseController = require('./base.js')

class RoleController extends BaseController {
 
  //角色列表
  async index() {
    var items = await this.ctx.model.Role.find({})
    await this.ctx.render('admin/role/index', {
      items: items
    });
  }
  
  //添加页面
  async add() {
    await this.ctx.render('admin/role/add');
  }

  //添加操作
  async doAdd() {

    var role = new this.ctx.model.Role({
      title: this.ctx.request.body.title,
      description: this.ctx.request.body.description
    });

    await role.save();
    await this.success('/admin/role', '添加角色成功');
  }

  //编辑页面
  async edit() {

    var id = this.ctx.request.query.id;
    var result = await this.ctx.model.Role.find({'_id':id})

    await this.ctx.render('admin/role/edit',{
        item:result[0]
    });
  }

  async doEdit(){

    var body = this.ctx.request.body;
    
    var _id = body._id;
    var title = body.title;
    var description = body.description;

    await this.ctx.model.Role.updateOne({'_id':_id},{
      title,description
    })

    await this.success('/admin/role','角色修改成功')
  }



  async delete(){
    const {ctx}=this
    var id=ctx.request.query.id
    var result=await this.ctx.model.Role.deleteOne({"_id":id});
    if(result){
        await this.success(ctx.locals.lastPage,'角色删除成功')
    }else{
        await this.fail(ctx.locals.lastPage,'角色删除失败')
    }
  }

  //展示授权页面
  async auth(){
    let role_id = this.ctx.request.query.id;
    let accessRole =await this.ctx.service.admin.getAuthList(role_id);
    await this.ctx.render('admin/role/auth',{
      role_id,accessRole
    })
  }

  //授权操作
  async doAuth(){
    /**
     * 
     * 获取role_id 和 access_id []
     * 
     * 依据role_id  删除 原所有 role_access 所有权限记录
     * 
     * 添加role_id 和 access_id 添加到
     */
    var role_id = this.ctx.request.body.role_id;
    var accessArray = this.ctx.request.body.access_node;

    await this.ctx.model.RoleAccess.deleteMany({'role_id':role_id})
    
    for (var access_id of accessArray) {
      var roleAccess = new this.ctx.model.RoleAccess({
        role_id:role_id,
        access_id:access_id
      })
      roleAccess.save()
    }

    await this.success('/admin/role/auth?id='+role_id,"授权成功");
  }

}

module.exports = RoleController;