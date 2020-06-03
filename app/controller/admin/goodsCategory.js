'use strict';

var BaseController  = require('./base.js');
var fs = require('fs');
var pump = require('pump');

class GoodsCategoryController extends BaseController{

    //  房屋分类列表
    async index(){    
        var categorys=await this.ctx.model.GoodsCategory.aggregate([
            {
                $lookup:{
                    from:'goods_category',
                    localField:'_id',
                    foreignField:'pid',
                    as:'items'
                }
            },{
                $match:{
                    pid:'0'
                }
            }
        ]);
        
        await this.ctx.render('admin/goodscategory/index',{
            categorys
        });
    }

    // 添加房屋分类
    async add() {
         //顶级分类
         var categorys=await this.ctx.model.GoodsCategory.find({"pid":'0'});
         await this.ctx.render('admin/goodsCategory/add',{
            categorys
         });
    }

    // 添加房屋分类操作
    async doAdd() {
        let parts = this.ctx.multipart({ autoFields: true });
        let files = {};               
        let sourceStream;
        while ((sourceStream = await parts()) != null) {
            if(!sourceStream.filename){
                break;
            }

            let fieldname = sourceStream.fieldname;
            let dir  = await this.ctx.service.tools.getUploadPath(sourceStream.filename);
            let target = dir.uploadPath;
            let destStream  = fs.createWriteStream(dtarget);

            await pump(sourceStream,destStream,function(error) {
                console.log('pipe finished', error)
            });

            //拼接成对象格式
            files = Object.assign(files,{[fieldname]:dir.dbUploadPath})

           //生成缩略图
           this.service.tools.jimpImg(dir.uploadPath);
        }         
        
        if(parts.field.pid!=0){    
            parts.field.pid=this.app.mongoose.Types.ObjectId(parts.field.pid);    //调用mongoose里面的方法把字符串转换成ObjectId      
        }
        
        let goodsCate =new this.ctx.model.GoodsCategory(Object.assign(files,parts.field));
        await goodsCate.save();
        await this.success('/admin/goodsCategory','增加分类成功');
    }

    // 编辑房屋分类 显示
    async edit(){
        var id=this.ctx.request.query.id;
        var category=await this.ctx.model.GoodsCategory.findById(id);
        var categoryList=await this.ctx.model.GoodsCategory.find({"pid":'0'});
        
        await this.ctx.render('admin/goodsCategory/edit',{
            categoryList,category
        });
    }

    // 编辑房屋分类 操作
    async doEdit(){
        let parts = this.ctx.multipart({ autoFields: true });
        let files = {};               
        let sourceStream;
        while ((sourceStream = await parts()) != null) {
            if(!sourceStream.filename){
                break;
            }

            let fieldname = sourceStream.fieldname;
            let dir  = await this.ctx.service.tools.getUploadPath(sourceStream.filename);
            let destStream  = fs.createWriteStream(dir.uploadPath);

            await pump(sourceStream,destStream,function(error) {
                console.log('pipe finished', error)
            });

            //拼接成对象格式
            files = Object.assign(files,{[fieldname]:dir.dbUploadPath})

           //生成缩略图
           this.service.tools.jimpImg(dir.uploadPath);
        }         
        
        if(parts.field.pid!=0){    
            parts.field.pid=this.app.mongoose.Types.ObjectId(parts.field.pid);    //调用mongoose里面的方法把字符串转换成ObjectId      
        }
        
        let id = parts.field.id;
        let body = Object.assign(files,parts.field);
        await this.ctx.model.GoodsCategory.updateOne({'_id':id},body);
        await this.success('/admin/goodsCategory','修改分类成功');

    }


    async delete(){
        const {ctx}=this
        var _id=ctx.request.query.id
        var result=await this.ctx.model.GoodsCategory.deleteOne({"_id":_id});  
        if(result){
            await this.success(ctx.locals.lastPage,'房屋分类删除成功')
        }else{
            await this.fail(ctx.locals.lastPage,'房屋分类删除失败')
        }
      }

}

module.exports = GoodsCategoryController;
