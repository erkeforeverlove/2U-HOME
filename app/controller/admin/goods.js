'use strict';

var BaseController  = require('./base.js');
var fs = require('fs');
var pump = require('pump');

class GoodsController extends BaseController{
    
    async index(){
      var page=this.ctx.request.query.page || 1;
      var keyword=this.ctx.request.query.keyword;
      var who = this.ctx.session.userinfo;
      var whosuper = this.ctx.session.userinfo.is_super;
      var whoroleid = this.ctx.session.userinfo.role_id;
      var whoid =this.ctx.session.userinfo._id;
      
     
      if(whoroleid=="5e64e3c162e34f5dc454eb1b"||whosuper==1){
         
           
        //注意
        var json={'is_delete':false};
        if(keyword){
          json=Object.assign({"title":{$regex:new RegExp(keyword)}});
        }
        var pageSize=6;
        //获取当前数据表的总数量
        var totalNum=await this.ctx.model.Goods.find(json).count();
        var goodsArray=await this.ctx.model.Goods.find(json).skip((page-1)*pageSize).limit(pageSize);
        var cateArray=await this.ctx.model.GoodsCategory.find({});
        
       
        
        await this.ctx.render('admin/goods/index',{
            goodsArray:goodsArray,
            totalPages:Math.ceil(totalNum/pageSize),
            page:page,
            cateArray:cateArray,
            keyword:keyword
        }); 
      }else{
        //注意
      
        
        var json={'is_delete':false,"sale":whoid};
        if(keyword){
          json=Object.assign({"title":{$regex:new RegExp(keyword)}});        
        }
        var noshow =1;
        var pageSize=6;
        //获取当前数据表的总数量
        var totalNum=await this.ctx.model.Goods.find(json).count();
        var goodsArray=await this.ctx.model.Goods.find(json).skip((page-1)*pageSize).limit(pageSize);
        var cateArray=await this.ctx.model.GoodsCategory.find({});
        
        await this.ctx.render('admin/goods/index',{
            goodsArray:goodsArray,
            totalPages:Math.ceil(totalNum/pageSize),
            page:page,
            cateArray:cateArray,
            keyword:keyword,
            noshow
        });
      }
      
     
   
    }   

    async add(){
      
       
      
        
        //获取房屋商品销售员所属人
        var sale=await this.ctx.model.Admin.find({"role_id":'5cb679cc63f2993844966288'});
        
        //获取房屋商品分类
        var goodsCategorys=await this.ctx.model.GoodsCategory.aggregate([
            {
                $lookup:{
                    from:'goods_category',
                    localField:'_id',
                    foreignField:'pid',
                    as:'subCategorys'      
                }      
            },{
                $match:{
                    "pid":'0'
                }
            }
        ])
        await this.ctx.render('admin/goods/add',{
          goodsCategorys,
          sale:sale
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
            let destStream  = fs.createWriteStream(dir.uploadPath);

            await pump(stream, destStream);  

                //拼接成对象格式
            files = Object.assign(files,{[fieldname]:dir.dbUploadPath})
            
        }   
        //  拼接form表单
        var formFields=Object.assign(files,parts.field);

    
        //增加房屋商品信息
        let goodsModel =new this.ctx.model.Goods(formFields);    
        var result= await goodsModel.save();
        
        //增加图库信息 到数据库   
        var goods_album_images=formFields.goods_album_images; 
        
        if( result._id && goods_album_images){  
            //解决上传一个图库不是数组的问题
            if(typeof(goods_album_images)=='string'){
                goods_album_images=new Array(goods_album_images);
            }

            for(var i=0;i<goods_album_images.length;i++){                     
                    let goodsImageRes =new this.ctx.model.GoodsImage({
                        goods_id:result._id,
                        img_url:goods_album_images[i]
                    });
                    await goodsImageRes.save();
            }
        }
        
    

        await this.success('/admin/goods','增加房屋商品数据成功');

    }  

    async edit(){
        
        //获取修改数据的id
        var goods_id=this.ctx.request.query.id;

        //获取房屋商品分类
        var goodsCate=await this.ctx.model.GoodsCategory.aggregate([
        
            {
              $lookup:{
                from:'goods_category',
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
        // console.log(JSON.stringify(goodsCate));
        
        //获取房屋商品销售员所属人
        var sale=await this.ctx.model.Admin.find({"role_id":'5cb679cc63f2993844966288'});
     
        // console.log(JSON.stringify(sale));
      
        //获取修改的房屋商品
        var goodsResult=await this.ctx.model.Goods.findById(goods_id);

        var target = goodsResult.goods_content.replace(/\\/g,'/');
  
        //将替换后的字符串转化成一个对象
        var obj = {"goods_content":target};       
        //将两个对象进行拼接
        var goodsResult = Object.assign(goodsResult,obj);

        //房屋商品的图库信息
        var goodsImageResult=await this.ctx.model.GoodsImage.find({"goods_id":goodsResult._id});
        

        await this.ctx.render('admin/goods/edit',{
          goodsCate:goodsCate,
          sale:sale,
          goods:goodsResult,
          goodsImages:goodsImageResult,
          prevPage:this.ctx.state.lastPage
        });
    }

    async look(){
        
      //获取修改数据的id
      var goods_id=this.ctx.request.query.id;



      //获取房屋商品分类
      var goodsCate=await this.ctx.model.GoodsCategory.aggregate([
      
          {
            $lookup:{
              from:'goods_category',
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
      
      
      //获取房屋商品销售员所属人
      var sale=await this.ctx.model.Admin.find({"role_id":'5cb679cc63f2993844966288'});
   
    
      //获取修改的房屋商品
      var goodsResult=await this.ctx.model.Goods.findById(goods_id);

      //房屋商品的图库信息
      var goodsImageResult=await this.ctx.model.GoodsImage.find({"goods_id":goodsResult._id});

      await this.ctx.render('admin/goods/look',{
        goodsCate:goodsCate,
        sale:sale,
        goods:goodsResult,
        goodsImages:goodsImageResult,
        prevPage:this.ctx.state.lastPage
      });
    }

    async doEdit(){
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
          });
           //生成缩略图
           this.service.tools.jimpImg(dir.uploadPath);
      }      

      var formFields=Object.assign(files,parts.field);
   
      if(formFields.is_best==null){
        formFields.is_best=0;
      }
      if(formFields.is_hot==null){
        formFields.is_hot=0;
      }
      
      if(formFields.is_new==null){
        formFields.is_new=0;
      }
      

      //修改房屋商品的id
      var goods_id=parts.field.id;        
      //修改房屋商品信息
      await this.ctx.model.Goods.updateOne({"_id":goods_id},formFields);

      //修改图库信息  （增加）
      var  goods_image_list=formFields.goods_image_list;
      if(goods_id && goods_image_list){            
        if(typeof(goods_image_list)=='string'){
          goods_image_list=new Array(goods_image_list);
        }
                  
        for(var i=0;i<goods_image_list.length;i++){                     
              let goodsImageRes =new this.ctx.model.GoodsImage({
                goods_id:goods_id,
                img_url:goods_image_list[i]
              });
        
              await goodsImageRes.save();
        }
      }
    

   
      var prevPage=parts.field.prevPage;
      // console.log('prevPage'+prevPage);
      
      await this.success(prevPage,'修改房屋商品数据成功');
    }

   

    //上传房屋商品详情的图片 到 目标目录
    async goodsDetailImages() {

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

    //上传房屋商品相册图片 到目标目录
    async goodsAlbumImages() {
        //实现图片上传
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

          //生成缩略图
          this.service.tools.jimpImg(dir.uploadPath);
      }      
      //图片的地址转化成 {link: 'path/to/image.jpg'} 
      this.ctx.body={link: files.file};
    } 
   
    //删除房屋商品  软删除
    async delete(){
        var goods_id =  this.ctx.request.query.goods_id;
        var result = await this.ctx.model.Goods.updateOne({'_id':goods_id},{'is_delete':true})
        await this.success('/admin/goods','删除房屋商品成功');
    }

  

     //删除图片
    async goodsImageRemove() {
            
          var goods_image_id=this.ctx.request.body.goods_image_id;
          if(goods_image_id){
            goods_image_id=this.app.mongoose.Types.ObjectId(goods_image_id);
        }   
          //注意  图片要不要删掉   fs模块删除以前当前数据对应的图片
          var result= await this.ctx.model.GoodsImage.deleteOne({"_id":goods_image_id});  
          if(result){
                  this.ctx.body={'success': true,'message':'删除数据成功'};
            }else{
                  this.ctx.body={'success': false,'message':'删除数据失败'};
            }
          
    } 
}

module.exports = GoodsController;