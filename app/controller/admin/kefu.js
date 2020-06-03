'use strict';

var BaseController = require('./base.js')

class KefuController extends BaseController {
    async index(){
      var kefu=await this.ctx.model.Kefu.find({}); 
      await this.ctx.render('admin/kefu/index',{
        kefu:kefu
      });  
    }
    async info(){
      var _id=this.ctx.query.id;
      var kefu=await this.ctx.model.Kefu.find({"_id":_id}); 
      await this.ctx.render('admin/kefu/info',{
        item:kefu[0]
      }); 
    }
    async delete(){
      var id=this.ctx.query.id;
      var result=await this.ctx.model.Kefu.deleteOne({"_id":id});
        if(result){
            await this.success(this.ctx.locals.lastPage,'反馈信息删除成功')
        }else{
            await this.fail(this.ctx.locals.lastPage,'反馈信息删除失败')
        }
    }
}
module.exports = KefuController;
