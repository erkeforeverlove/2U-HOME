'use strict';

const Controller = require('egg').Controller;

var BaseController =require('./base.js');

class PingjiaController extends BaseController {

  
  async index(){
    var goods_id = this.ctx.request.query.id; 
    var user_id = this.ctx.request.query.user; 
    var comment_id = this.ctx.request.query.co_id;
    var comment_id_obj = this.app.mongoose.Types.ObjectId(comment_id); 
    var comment=await this.ctx.model.Comment.aggregate([             
      {
        $match:{  
          "_id":comment_id_obj    
        }
      },
      {
          $lookup:{
            from:'user',
            localField:'user_id',
            foreignField:'_id',
            as:'items'      
          }      
      },
    ])    

    var pingjia_comment=await this.ctx.model.Pingjia.aggregate([             
      {
        $match:{  
          "comment_id":comment_id_obj    
        }
      },
      {
        $lookup:{
          from:'comment',
          localField:'pingjia_id',
          foreignField:'_id',
          as:'items'      
        },        
      }
    ])   
    console.log(JSON.stringify(comment));
    var user =await this.ctx.model.User.find({}); 
    var co =await this.ctx.model.Comment.find({}); 
    var goods =await this.ctx.model.Goods.find({"_id":goods_id}); 
    var title = goods[0].title;
    await this.ctx.render('index/pingjia/pingjia.html',{
      comment:comment,
      goods_id,
      co_id:comment[0]._id,
      pingjia_comment:pingjia_comment[0],
      user:user,
      co:co,
      title
    });
  }

  

  async doAdd(){
    var body = this.ctx.request.body;  
    var comment = new this.ctx.model.Comment(body);
    var goods_id = comment.goods_id;
    var user = comment.user_id;
    comment.save();
    await this.success('/goodsinfo?id='+goods_id+'&&user='+user,'提交评论成功')
    
  }

  async delete(){
        var id= this.ctx.request.query.id; 
        var user= this.ctx.request.query.user; 
        var result=await this.ctx.model.Comment.deleteOne({"_id":id});
        if(result){
            await this.success('/user/userinfo?id='+user,'删除评论成功')
        }else{
            await this.fail('/user/userinfo?id='+user,'删除评论失败')
        }
  }

}

module.exports = PingjiaController;
