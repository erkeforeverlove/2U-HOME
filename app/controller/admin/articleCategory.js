
const fs=require('fs');
const pump = require('pump');
var BaseController =require('./base.js');

class ArticleCategoryController extends BaseController {
    async index() {
        var articleCategorys=await this.ctx.model.ArticleCategory.aggregate([
            {
              $lookup:{
                from:'article_category',
                localField:'_id',
                foreignField:'pid',
                as:'items'      
              }      
           },
           {
              $match:{
                "pid":'0'
              }
           }
        ])

        await this.ctx.render('admin/articlecategory/index',{
          articleCategorys
        });
    }

    async add() {
        var cateList=await this.ctx.model.ArticleCategory.find({"pid":'0'});
        await this.ctx.render('admin/articlecategory/add',{
            cateList
        });
    }

    async doAdd() {
        let parts = this.ctx.multipart({ autoFields: true });
        let files = {};               
        let stream;
        while ((stream = await parts()) != null) {
            if (!stream.filename) {          
              break;
            }       
            let fieldname = stream.fieldname;  //file表单的名字
            //上传图片的目录
            let dir=await this.service.tools.getUploadPath(stream.filename);
            let target = dir.uploadPath;
            let writeStream = fs.createWriteStream(target);
            
            await pump(stream, writeStream);  
            files=Object.assign(files,{
              [fieldname]:dir.dbUploadPath    
            })

           //生成缩略图
           this.service.tools.jimpImg(target);
        }         
        
        if(parts.field.pid!=0){    
            parts.field.pid=this.app.mongoose.Types.ObjectId(parts.field.pid);    //调用mongoose里面的方法把字符串转换成ObjectId      
        }
        
        let articleCategoryModel =new this.ctx.model.ArticleCategory(Object.assign(files,parts.field));
        await articleCategoryModel.save();
        await this.success('/admin/articleCategory','增加分类成功');
    }

    async edit() {
     
      
        var id=this.ctx.request.query.id;
        var articleCategory=await this.ctx.model.ArticleCategory.findById(id);
        var articleCategoryTopList=await this.ctx.model.ArticleCategory.find({"pid":'0'});
        await this.ctx.render('admin/articleCategory/edit',{
          articleCategoryTopList,
          articleCategory
        });
    }

    async doEdit() {
        let parts = this.ctx.multipart({ autoFields: true });
        let files = {};               
        let stream;
        while ((stream = await parts()) != null) {
            if (!stream.filename) {          
              break;
            }       
            let fieldname = stream.fieldname;  //file表单的名字
  
            //上传图片的目录
            let dir=await this.service.tools.getUploadPath(stream.filename);
            let target = dir.uploadDir;
            let writeStream = fs.createWriteStream(target);

            await pump(stream, writeStream); 

            files=Object.assign(files,{
              [fieldname]:dir.dbUploadPath   
            })
           //生成缩略图
           this.service.tools.jimpImg(target);
        }     
        
        if(parts.field.pid!=0){    
            parts.field.pid=this.app.mongoose.Types.ObjectId(parts.field.pid);    //调用mongoose里面的方法把字符串转换成ObjectId      
        }        
        var id=parts.field.id;
        var updateResult=Object.assign(files,parts.field);
        await this.ctx.model.ArticleCategory.updateOne({"_id":id},updateResult);
        await this.success('/admin/articleCategory','修改分类成功');
    }

    async delete(){
      var _id=this.ctx.request.query.id;
      await this.ctx.model.ArticleCategory.deleteOne({"_id":_id});          
      this.ctx.redirect(this.ctx.state.lastPage); 
    }
}

module.exports = ArticleCategoryController;