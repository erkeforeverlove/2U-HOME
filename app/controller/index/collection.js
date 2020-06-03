'use strict';
var BaseController =require('./base.js');
const Controller = require('egg').Controller;
class CollectionController extends BaseController {

    //收藏列表
    async collectionList(){
        var userinfo=this.ctx.request.query.userinfo;   
        
        
        var user = this.app.mongoose.Types.ObjectId(userinfo);     
        var collection=await this.ctx.model.Collection.aggregate([  
            
            {
              $match:{
                "status":1,
                "user_id":user             
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
        var cate=await this.ctx.model.GoodsCategory.find({});
        
        await this.ctx.render('index/collection/collection.html',{
            collection: collection,
            cate:cate
        });
   }

    // 添加 收藏
    async addCollection() {
        var goods_id=this.ctx.request.query.goods_id;
        var userinfo=this.ctx.request.query.userinfo;
        var goodsResult=await this.ctx.model.Goods.findById(goods_id);
        var collection = await this.ctx.model.Collection.find({"user_id":userinfo});
        var reqBody={
            title:goodsResult.title,
            user_id:userinfo,
            goods_id:goods_id,           
        }      
        var collection = new this.ctx.model.Collection(reqBody);
        collection.save();
        this.ctx.redirect('/addCollectionSuccess?goods_id='+goods_id);

        
        
    }

    //添加成功页面
    async addCollectionSuccess(){
            var goods_id=this.ctx.request.query.goods_id;
            var goodsResult=await this.ctx.model.Goods.findById(goods_id);
            if(goodsResult.length==0 ){
                this.ctx.status=404;
                this.ctx.body='错误404';   //404
            }else{
                var title=goodsResult.title;
                var img=goodsResult.goods_img;
                await this.ctx.render('index/collection/add_collection_success.html',{
                    title:title,
                    goods_id:goods_id,
                    img:img

                });
            }
    }

  
   
    //移出 收藏
    async removeCollection(){
        var id= this.ctx.request.query.id;
        var user= this.ctx.request.query.user;
        var result=await this.ctx.model.Collection.deleteOne({"_id":id});
        if(result){
            await this.success("/collection?userinfo="+user,'删除收藏成功')
        }else{
            await this.fail("/collection?userinfo="+user,'删除收藏失败')
        }
    }
    
}

module.exports = CollectionController;
