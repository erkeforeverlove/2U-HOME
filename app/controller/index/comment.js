'use strict';

const Controller = require('egg').Controller;

var BaseController =require('./base.js');

class CommentController extends BaseController {

  
  async index(){
    var goods_id = this.ctx.request.query.goods_id; 
    var user = this.ctx.request.query.userinfo; 
    var page = this.ctx.request.query.page;
    var co_id = this.ctx.request.query.co_id;
    
    await this.ctx.render('index/comment/comment.html',{
      goods_id,
      user,
      page,
      co_id
    });
  }

  

  async doAdd(){
    var body = this.ctx.request.body;   
    var page = body.page;
    var user = this.app.mongoose.Types.ObjectId(body.user); 
    if(page=="goodsinfo"){
      var comment = new this.ctx.model.Comment(body);
      var goods_id = comment.goods_id;
      var user = comment.user_id;
      comment.save();
      await this.success('/goodsinfo?id='+goods_id+'&&user='+user,'提交评论成功');       
    }else if(page=="pingjia"){
      var comment = new this.ctx.model.Comment({
        user_id: user,
        goods_id: body.goods_id,
        content: body.content,      
        pinglun_id: body.co_id,  
      });
      comment.save();
      var pj =await this.ctx.model.Pingjia.find({"comment_id":body.co_id});      
      if(pj.length==1){   
          var pl =await this.ctx.model.Comment.find({"pinglun_id":body.co_id});
          var pinglun_arr=[];
          for (const key in pl) {
            if (pl.hasOwnProperty(key)) {
              pinglun_arr.push(pl[key]._id);
            }
          }
          var pinglun_arr_num = pinglun_arr.push(); 
          await this.ctx.model.Pingjia.updateOne({"comment_id":body.co_id},{
            "pingjia_id":pinglun_arr,
            "pingjia_num":pinglun_arr_num
          });
          await this.ctx.model.Comment.updateOne({"_id":body.co_id},{
            "ping":pinglun_arr_num,
          });
          await this.success('/pingjia?id='+body.goods_id+"&&user="+user+"&&co_id="+body.co_id,'评价成功');  
      }else{
        var pl =await this.ctx.model.Comment.find({"pinglun_id":body.co_id});   
        var pinglun_arr=[];
        for (const key in pl) {
          if (pl.hasOwnProperty(key)) {
            pinglun_arr.push(pl[key]._id);
          }
        }  
        var pinglun_arr_num = pinglun_arr.push();
        var pingjia = new this.ctx.model.Pingjia({
          comment_id:body.co_id,
          user_id:user,
          pingjia_id:pinglun_arr,
          pingjia_num:pinglun_arr_num,   
        });
        pingjia.save();
        await this.ctx.model.Comment.updateOne({"_id":body.co_id},{
          "ping":pinglun_arr_num,
        });
        await this.success('/pingjia?id='+body.goods_id+"&&user="+user+"&&co_id="+body.co_id,'评价成功');
      }  
    }
    
    
    
  }

  async delete(){
        var id= this.ctx.request.query.id; 
        var user= this.ctx.request.query.user; 
        console.log(id);
        console.log(user);
        var pingjia=await this.ctx.model.Pingjia.find({"comment_id":id});  
        if(pingjia.length==0){
          await this.ctx.model.Dianzan.deleteOne({"comment_id":id});
          var result=await this.ctx.model.Comment.deleteOne({"_id":id});
          if(result){
              await this.success('/user/userinfo?id='+user,'删除评论成功')
          }else{
              await this.fail('/user/userinfo?id='+user,'删除评论失败')
          }
        }      
        if(pingjia.length==1){    //进入置顶评论        
          for (const key in pingjia[0].pingjia_id) {
            if (pingjia[0].pingjia_id.hasOwnProperty(key)) {    
              //循环删除子评论          
              await this.ctx.model.Comment.deleteOne({"_id":pingjia[0].pingjia_id[key]});
              await this.ctx.model.Dianzan.deleteOne({"comment_id":pingjia[0].pingjia_id[key]});            
            }
          }
          //删除置顶评论
          await this.ctx.model.Pingjia.deleteOne({"comment_id":id});
          await this.ctx.model.Dianzan.deleteOne({"comment_id":id});
          var result=await this.ctx.model.Comment.deleteOne({"_id":id});
          if(result){
              await this.success('/user/userinfo?id='+user,'删除评论成功')
          }else{
              await this.fail('/user/userinfo?id='+user,'删除评论失败')
          }
        }else{   //进入回复评论
          console.log(2);          
          var pingjia=await this.ctx.model.Pingjia.find({});
          //利用双重for循环遍历  比较pingjia表里的pingjia_id  然后进行操作
          for (let i = 0; i < pingjia.length; i++) {
            for (let j = 0; j < pingjia[i].pingjia_id.length; j++) {            
              if (pingjia[i].pingjia_id[j]==id) {    
                //找到目标数据的在目标数组中的下表          
                var index = pingjia[i].pingjia_id.indexOf(id);
                //利用splice进行切割删除
                pingjia[i].pingjia_id.splice(index,1);
                //留下新的数组
                var new_arr = pingjia[i].pingjia_id;
                //利用push空返回数组长度的特性获取长度
                var new_arr_num = pingjia[i].pingjia_id.push();
                //更改评价-回复中间表表
                await this.ctx.model.Pingjia.updateOne({"_id":pingjia[i]._id},{
                  "pingjia_id":new_arr,
                  "pingjia_num":new_arr_num
                });
                //更改评论表
                await this.ctx.model.Comment.updateOne({"_id":pingjia[i].comment_id},{
                  "ping":new_arr_num,
                });
                //删除目标数据
                var result=await this.ctx.model.Comment.deleteOne({"_id":id});
                await this.ctx.model.Dianzan.deleteOne({"comment_id":id});
                if(result){
                    await this.success('/user/userinfo?id='+user,'删除评论成功')
                }else{
                    await this.fail('/user/userinfo?id='+user,'删除评论失败')
                }            
              }          
            }           
          }
        }    
  }
}

module.exports = CommentController;
