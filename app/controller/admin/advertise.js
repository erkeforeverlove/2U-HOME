'use strict';

var BaseController  = require('./base.js');
var fs = require('fs');
var pump = require('pump');

class AdvertiseController extends BaseController{

    //  广告列表
    async index(){
        
        var ads=await this.ctx.model.Advertise.find({});
        await this.ctx.render('admin/advertise/index',{
            ads:ads
        });
    }

    // 添加轮播
    async add() {
        await this.ctx.render('admin/advertise/add');
    }

    // 添加轮播广告操作
    async doAdd() {
        
        let parts = await this.ctx.multipart({'autoFields':true})
        let files = {}
        let sourceStream ;
        while((sourceStream = await parts())!=null){
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
        }

        // 拼接 上传图片和表单域 
        let obj = Object.assign(files,parts.field)
        
        let model = new this.ctx.model.Advertise(obj);
        let result = model.save();

        await this.success('/admin/advertise','添加广告图成功');
    }

    //  编辑 显示
    async edit(){
        let ad_id = this.ctx.request.query.id;
        var ad=await this.ctx.model.Advertise.findById(ad_id);
        console.log(ad);
        
        await this.ctx.render('admin/advertise/edit',{
            ad:ad
        });
    }

    //  编辑 操作
    async doEdit(){
        
        let parts = await this.ctx.multipart({'autoFields':true})
        let files = {}
        let sourceStream ;
        while((sourceStream = await parts())!=null){
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
        
        }
       
        
        let id = parts.field.id;
        // 拼接 上传图片和表单域 
        let newObj = Object.assign(files,parts.field)
        console.log('parts.field'+newObj);
        let model = await this.ctx.model.Advertise.updateOne({'_id':id},newObj);
        await this.success('/admin/advertise','修改广告图成功');
    }

    //删除

    async delete(){
        const {ctx}=this
        var id=ctx.request.query.id
        var result=await this.ctx.model.Advertise.deleteOne({"_id":id});
        if(result){
            await this.success(ctx.locals.lastPage,'广告删除成功')
        }else{
            await this.fail(ctx.locals.lastPage,'广告删除失败')
        }
    }
}

module.exports = AdvertiseController;
