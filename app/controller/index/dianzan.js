'use strict';

const Controller = require('egg').Controller;

var BaseController =require('./base.js');

class DianzanController extends BaseController {

  
  async index(){
    var goods_id = this.ctx.request.query.goods_id; 
    var user = this.ctx.request.query.userinfo; 
    await this.ctx.render('index/comment/comment.html',{
      goods_id,
      user
    });
  }

  

  async add(){
      var page = this.ctx.request.query.page;    
      var goods_id = this.ctx.request.query.id;
      var user = this.ctx.request.query.user;
      var comment_id = this.ctx.request.query.co_id;
      var dianzan_cunzai=await this.ctx.model.Dianzan.find({"comment_id":comment_id});
      if(dianzan_cunzai.length==1){      
        for (const key in dianzan_cunzai[0].user_id) {
          if (dianzan_cunzai[0].user_id.hasOwnProperty(key)) {
            if(dianzan_cunzai[0].user_id[key]==user){
              if(page=="userinfo"){
                await this.success('/user/userinfo?id='+user,'您点过赞了');
              }else if(page=="goodsinfo"){
                await this.success('/goodsinfo?id='+goods_id+"&&user="+user,'您点过赞了');
              }else if(page=="pingjia"){
                await this.success('/pingjia?id='+goods_id+"&&user="+user+"&&co_id="+comment_id,'您点过赞了');
              }    
              break;            
            }else{
              var dianzan_num = dianzan_cunzai[0].user_id.push(user);
              var dianzan_new = dianzan_cunzai[0].user_id;
              var quchong =  Array.from(new Set(dianzan_new));//数组去重
              var quchong_num=quchong.push();
              await this.ctx.model.Dianzan.updateOne({"comment_id":comment_id},{
                "user_id":quchong,
                "user_num":quchong_num
              });
              var result = await this.ctx.model.Comment.updateOne({"_id":comment_id},{
                "zan":quchong_num
              });           
              if(page=="userinfo"){
                await this.success('/user/userinfo?id='+user,'点赞成功');
              }else if(page=="goodsinfo"){
                await this.success('/goodsinfo?id='+goods_id+"&&user="+user,'点赞成功');
              }else if(page=="pingjia"){
                await this.success('/pingjia?id='+goods_id+"&&user="+user+"&&co_id="+comment_id,'点赞成功');         
              }          
            }      
          }
        }       
      }else{
        var dianzan = new this.ctx.model.Dianzan({
          comment_id:comment_id,
          user_id:user,       
        });
        dianzan.save();
        var result = await this.ctx.model.Comment.updateOne({"_id":comment_id},{
          "zan":1
        });
        if(page=="userinfo"){
          await this.success('/user/userinfo?id='+user,'点赞成功');
        }else if(page=="goodsinfo"){
          await this.success('/goodsinfo?id='+goods_id+"&&user="+user,'点赞成功');
        }else if(page=="pingjia"){
          await this.success('/pingjia?id='+goods_id+"&&user="+user+"&&co_id="+comment_id,'点赞成功');
        } 
      }  
  }

  

}

module.exports = DianzanController;
