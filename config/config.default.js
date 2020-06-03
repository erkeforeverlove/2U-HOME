/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {

  const config = {};
  const userConfig = {};

  config.keys = appInfo.name + '_1552102108995_5843';

  //session 配置
  config.session={
    key:'SESSION_ID',
    maxAge:24 * 3600 * 1000,
    httpOnly: true,
    encrypt: true,
    renew: true //  延长会话有效期       
  }

  //配置中间件
  config.middleware = ['adminauth'];
  config.adminauth = {
    enable:true,
    match:'/admin'
  }
   
 //模板引擎配置
  config.view = {
    defaultViewEngine: 'nunjucks',
    defaultExtension: '.html',
    mapping: {
      '.html': 'nunjucks',
    },
  };

  // 配置 数据库mongodb
  config.mongoose = {
    client: {
      url: 'mongodb://127.0.0.1/db_name', options: {
        useNewUrlParser: true
      },
    },
  };

  //配置 数据库redis
  config.redis = {
    client: {
      port: 6379,          // Redis port
      host: '127.0.0.1',   // Redis host
      password: '',
      db: 0
    }
  }

  //配置公共的api
  config.api = ''
  
  //配置表单数量
  config.multipart = {
    fields: '50'
  };
  
  // 安全配置 
  config.security = {
    csrf: {
        // 判断是否需要 ignore 的方法，请求上下文 context 作为第一个参数
        ignore: ctx => {
          if(
            ctx.request.url=='/admin/goods/goodsDetailImages' 
            || ctx.request.url=='/admin/goods/goodsAlbumImages'
            || ctx.request.url=='/admin/article/articleDetailImages'
            || ctx.request.url == '/login/doLogin' 
            || ctx.request.url == '/user/addAddress' 
            ||  ctx.request.url == '/user/editAddress' 
          ){
            return true;
          }
          return false;
        }      
    },
    domainWhiteList: [ 'http://localhost:3000' ],
  }

  config.cors ={
    origin:'*',
    allowMethods:'GET,PUT,POST,DELETE'
  }

  //用户上传图片 基础目录
  userConfig.uploadBaseDir='app/public/admin/upload'
  //密码加盐 盐值
  userConfig.salt = '12345'

  userConfig.mobile_category_id = '12345'
  userConfig.tv_category_id = '12345'



  

  return {
    ...config,
    ...userConfig,
  };

};
