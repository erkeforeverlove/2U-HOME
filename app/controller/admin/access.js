'use strict';

var BaseController = require('./base.js')

class AccessController extends BaseController {
  
  //权限列表
  async index() {
    var result =await this.ctx.model.Access.aggregate([
      {
        $lookup:{
          from:'access',
          localField:'_id',
          foreignField:'module_id',
          as:'items'
        }
      },
      {
        $sort:{
          'sort':1
        }
      },
      {
        $match:{
          'module_id':'0'
        }
      }
      
    ])
    await this.ctx.render('admin/access/index',{
      modules:result
    }); 

  } 
  
  

  async add() {
    // 获取顶级 模块列表
    var modules =await this.ctx.model.Access.find({'module_id':'0'})
    
    if(modules.length>0){
      await this.ctx.render('admin/access/add',{
        modules
      });
    }else{
      await this.ctx.render('admin/access/add')
    }
  } 

  async doAdd() {
      var accessBody  = this.ctx.request.body;
      var module_id = accessBody.module_id;
      
      // 菜单或操作
      if(module_id!=0){
         
         accessBody.module_id = this.app.mongoose.Types.ObjectId(module_id);
      }
  
      var access = new this.ctx.model.Access(accessBody) ;
      access.save();
      await this.success('/admin/access','权限添加成功')
  } 

  async edit() {
    // 获取修改权限 请求id
    // 查询access 实体 依据请求id
    // 获取 所有顶级模块[] 依据 module_id = 0;
    // 所属模块： 
    // 顶级模块：   如果 access.module_id==0  默认显示--顶级模块    
    //    +
    // 非顶级模块：  循环遍历 []  显示顶级模块，如果当前access module_id==顶级模块 _id 则选中  
    let id = this.ctx.request.query.id;
    let access = await this.ctx.model.Access.findById(id);
    let modules = await this.ctx.model.Access.find({'module_id':'0'})

    await this.ctx.render('admin/access/edit',{
      access,modules
    });
  
  } 

  async doEdit() {

    // 获取 表单数据
    // 获取 id
    // moduel_id 进行包装 （顶级模块为'0',非等级 模块 为 objectid）
    // 表单数据更新到数据库
    // 跳转 权限修改列表

    let body = this.ctx.request.body;

    let id = body.id;
    let module_id = body.module_id;

    if(module_id!=0){
       body.module_id = this.app.mongoose.Types.ObjectId(module_id);
    }

    var result = await this.ctx.model.Access.updateOne({'_id':id},body);
    
    
    await this.success('/admin/access','权限修改成功')
  
  } 



  async delete(){
    const {ctx}=this
    var id=ctx.request.query.id
    var result=await this.ctx.model.Access.deleteOne({"_id":id});
    if(result){
        await this.success(ctx.locals.lastPage,'权限删除成功')
    }else{
        await this.fail(ctx.locals.lastPage,'权限删除失败')
    }
  }
}

module.exports = AccessController;
