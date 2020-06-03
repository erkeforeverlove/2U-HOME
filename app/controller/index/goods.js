'use strict';

const Controller = require('egg').Controller;

var BaseController =require('./base.js');

class GoodsController extends BaseController {
 
  /**
  * 获取 房屋列表
  */
  async list() {
    /*
    1、获取分类id   cid
    2、根据分类id获取当前的分类信息
    3、判断是否是顶级分类
    4、如果是二级分类自己获取二级分类下面的数据          如果是顶级分类 获取顶级分类下面的二级分类  根据二级分类获取下面所有的数据
    */
    
    var cid=this.ctx.request.query.cate_id;
    //根据分类id获取当前的分类新
    var curentCate=await this.ctx.model.GoodsCategory.find({"_id":cid});
    //判断是否是顶级分类
    if(curentCate[0].pid!=0){
        // 二级分类
        var goodsList=await this.ctx.model.Goods.find({"cate_id":cid,"status":1},'_id title price open_time goods_img cate_id');
        
        
    
    }else{
          //顶级分类  获取当前顶级分类下面的所有的子分类
          var subCatesIds=await this.ctx.model.GoodsCategory.find({"pid":this.app.mongoose.Types.ObjectId(cid)},'_id');
          var tempArr=[];
          for(var i=0;i<subCatesIds.length;i++){
            tempArr.push({
              "cate_id":subCatesIds[i]._id
            })
          }
          var goodsList=await this.ctx.model.Goods.find({
            $or:tempArr
          },'_id title price open_time goods_img cate_id');     
    }  
    await this.ctx.render('index/goods/goods_list.html',{
      goodsList:goodsList,
  
    });
  }

  /**
   * 获取 房屋详情
   */
  async info() {
    var id = this.ctx.request.query.id;   
    var userinfo = this.ctx.request.query.user; 
    if(userinfo){
      var user = await this.ctx.model.User.find({"_id":userinfo});
      // 1、获取房屋信息
      var productInfo=await this.ctx.model.Goods.findById(id);
    
      var sale=await this.ctx.model.Admin.find({'_id':productInfo.sale});
  
      //2、当前房屋关联的图片
      var goodsImageResult=await this.ctx.model.GoodsImage.find({"goods_id":id}).limit(8);
  
      //3、获取当前房屋收藏状态
      var collection = await this.ctx.model.Collection.find({"user_id":userinfo,"goods_id":productInfo._id,});
  
      if(collection&&collection.length!=0){
          var cunzai = 1;    
      }
      //4丶获取当前房屋评论
      var goods_id_obj = this.app.mongoose.Types.ObjectId(productInfo._id); 
      var comment=await this.ctx.model.Comment.aggregate([             
        {
          $match:{  
            "goods_id":goods_id_obj,
            "pinglun_id":undefined,
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
      
      await this.ctx.render('index/goods/goods_info.html',{
        productInfo:productInfo,
        goodsImageResult:goodsImageResult,
        sale:sale[0],
        user:user,
        comment:comment,
        cunzai,
      });    
    }else{
      await this.success('/login','请先登录再操作'); 
    }
    
  }

  
  async search(){
    var search=this.ctx.request.body.search;
    var json={'is_delete':false};
    if(search){
      json=Object.assign({"title":{$regex:new RegExp(search)}});
    }
    var goodsList=await this.ctx.model.Goods.find(json);
    
    await this.ctx.render('index/goods/goods_list.html',{
      goodsList:goodsList,
      search:search
  }); 
    
  }



}

module.exports = GoodsController;
