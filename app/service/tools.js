'use strict';

const Service = require('egg').Service;
var svgCaptcha = require('svg-captcha'); //引入验证
var dateformat = require('dateformat'); 
var path=require('path');
var mkdirp = require('mkdirp');
var crypto = require('crypto'); //内置加密模块
const Jimp = require("jimp");  //生成缩略图的模块

class ToolsService extends Service {
    //生成验证码
    async captcha(width,height){
      width = width ? width : 100;
      height = height ? height : 32;
      const captcha = svgCaptcha.create({
        size: 4,
        fontSize: 50,
        width,height,
      });
      return captcha;
    }
    
    
    //MD5 加密
    async md5(password){
      var saltPassword = password + ':' + this.config.salt;
      var md5 = crypto.createHash('md5');
      var result = md5.update(saltPassword).digest('hex');
      return result;
    }

    //生成上传文件路径
    async getUploadPath(filename){
      
      /**
       * 获取年月日 YYYYMMDD 和 上传目录（配置）, 拼接 路径 并创建路径
       * 获取(毫秒数 + 随机数)重新命名 文件名(避免重复)
       * 拼接文件路径地址
       * 返回  路径（注意 window 反斜杠）
       */

        let uploadBaseDir = this.config.uploadBaseDir;  //创建文件夹
        let dateDir  = dateformat(new Date(),'yyyymmdd');  //给文件夹命名
        let basePath = path.join(uploadBaseDir , dateDir);
        
        await mkdirp(basePath);
       
        let newFileName =(Date.now() + Number.parseInt(Math.random() * 10000)) +  path.extname(filename);
        // 文件上传地址
        let uploadPath = path.join(basePath ,newFileName)  
        // app\public\admin\upload\20180914\1536895331444.png <= window        
        let dbUploadPath = uploadPath.slice(3).replace('/\\/g','/');     
        return {   
          uploadPath:uploadPath,
          dbUploadPath:dbUploadPath
        };
    }

    // 生成缩略图
    async jimpImg(target){
      Jimp.read(target)
        .then(lenna => {
          return lenna
            .resize(200, 200) // resize
            .quality(60) // set JPEG quality
            .write(target+'_200x200'+path.extname(target)); // save
        })
        .catch(err => {
          console.error(err);
        });
    }

    //生成4位 随机数
    async getRandomNum() {
      let random_str = '';
      for (let i = 0; i < 4; i++) {
        random_str += Math.floor(Math.random() * 10);
      }
      return random_str;
    }

    //毫秒数
    async getTime() {
      const d = new Date();
      return d.getTime();
    }
    //年月日
    async getDay() {
      const day = dateformat(new Date(), 'yyyymmdd');
      return day;
    }



}

module.exports = ToolsService;
