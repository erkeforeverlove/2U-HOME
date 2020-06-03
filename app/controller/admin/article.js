
const fs=require('fs');

const pump = require('pump');

var BaseController =require('./base.js');



class ArticleController extends BaseController {
    
    //文章列表
    async index() {
      var page=this.ctx.request.query.page || 1;
      var pageSize=8;
      //总数量
      var totalNum=await this.ctx.model.Article.find({}).countDocuments();

      //让文章和分类进行关联
        var articles=await this.ctx.model.Article.aggregate([
            {
                $lookup:{
                  from:'article_category',
                  localField:'cate_id',
                  foreignField:'_id',
                  as:'articleCategory'      
                }      
            },{
              $sort:{
                "sort":1
              }          
            },
            {
              $skip:(page-1)*pageSize
            },
            {
              $limit:pageSize
            }
        ])
       
        
        await this.ctx.render('admin/article/index',{  
          articles:articles,
          totalPages:Math.ceil(totalNum/pageSize),
          page:page
        });
    }
  

    async add() {       
        //获取所有的分类
        var articleCategorys=await this.ctx.model.ArticleCategory.aggregate([
            {
              $lookup:{
                from:'article_cate',
                localField:'_id',
                foreignField:'pid',
                as:'subCategorys'      
              }      
           },
           {
              $match:{
                "pid":'0'
              }
           }
        
        ])
        await this.ctx.render('admin/article/add',{
          articleCategorys:articleCategorys
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
        
        let article =new this.ctx.model.Article(Object.assign(files,parts.field));
        await article.save();
        await this.success('/admin/article','增加文章成功');
    }

    async edit() {
        var id=this.ctx.request.query.id;
        //当前id对应的数据
        var source = await this.ctx.model.Article.find({"_id":id});    
        //将数组中的一个对象中的一个键属性替换 
        var target = source[0].content.replace(/\\/g,'/');
        //将替换后的字符串转化成一个对象
        var obj = {"content":target};       
        //将两个对象进行拼接
        var result = Object.assign(source[0],obj);     
        //获取所有的分类
        var cateResult=await this.ctx.model.ArticleCategory.aggregate([
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
        ]);
        await this.ctx.render('admin/article/edit',{
            cateList:cateResult,
            list:result,
            prevPage:this.ctx.state.lastPage
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
            let target = dir.uploadPath;         
            let writeStream = fs.createWriteStream(target);
            await pump(stream, writeStream);   
            files=Object.assign(files,{
              [fieldname]:dir.dbUploadPath  
            })
           //生成缩略图
           this.service.tools.jimpImg(target);
        }     
        
        var id=parts.field.id;
        var prevPage=parts.field.prevPage;
        var updateResult=Object.assign(files,parts.field);
      
        await this.ctx.model.Article.updateOne({"_id":id},updateResult);
        await this.success(prevPage,'修改数据成功');

    }

    //上传商品详情的图片 到 目标目录
    async articleDetailImages() {

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
          
          
          
          let writeStream = fs.createWriteStream(dir.uploadPath);
          
          

          await pump(stream, writeStream);  

          files=Object.assign(files,{
            [fieldname]:dir.dbUploadPath    
          })
          
      }      
      //图片的地址转化成 {link: 'path/to/image.jpg'} 
      this.ctx.body={link: files.file};
 
      
    } 

    async delete(){
      var _id=this.ctx.request.query.id;
      var result = await this.ctx.model.Article.deleteOne({"_id":_id});        
      if(result){
        await this.success(this.ctx.locals.lastPage,'文章删除成功')
      }else{
          await this.fail(this.ctx.locals.lastPage,'文章删除失败')
      }  
      
    }

}
module.exports = ArticleController;