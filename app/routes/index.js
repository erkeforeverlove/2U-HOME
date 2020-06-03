'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
  
    //配置路由中间件
    const initMiddleware=app.middleware.indexinit({},app);
    const indexauthMiddleware = app.middleware.indexauth({}, app);
    const xmlparseMiddleware = app.middleware.xmlparse();

    router.get('/', initMiddleware,controller.index.index.index);
    //搜索
    

    //商品
    router.get('/goodslist',initMiddleware, controller.index.goods.list);
    router.get('/goodsinfo',initMiddleware, controller.index.goods.info);
    router.post('/search',initMiddleware, controller.index.goods.search);

    //文章
    router.get('/articlelist',initMiddleware, controller.index.article.list);
    router.get('/articleinfo',initMiddleware, controller.index.article.info);


    //收藏
    router.get('/addCollection', controller.index.collection.addCollection);
    router.get('/collection', initMiddleware,controller.index.collection.collectionList);
    router.get('/addCollectionSuccess', initMiddleware,controller.index.collection.addCollectionSuccess);
    router.get('/removeCollection', initMiddleware,controller.index.collection.removeCollection);

    // 用户注册登录
    router.get('/login', initMiddleware, controller.index.login.login);
    router.post('/login/doLogin', initMiddleware, controller.index.login.doLogin);
    router.get('/login/loginOut', initMiddleware, controller.index.login.loginOut);
    router.get('/register', initMiddleware, controller.index.login.registerStep1);
    router.get('/register/step2', initMiddleware, controller.index.login.registerStep2);
    router.get('/register/step3', initMiddleware, controller.index.login.registerStep3);
    router.get('/login/sendCode', initMiddleware, controller.index.login.sendCode);
    router.get('/login/validatePhoneCode', initMiddleware, controller.index.login.validatePhoneCode);
    router.post('/login/doRegister', initMiddleware, controller.index.login.doRegister);
    router.get('/verify', initMiddleware, controller.index.base.verify);
 
    
    // 用户中心
    router.get('/user/userinfo', initMiddleware, indexauthMiddleware, controller.index.user.userinfo);
    router.get('/user/userchange', initMiddleware, indexauthMiddleware, controller.index.user.userchange);
    router.post('/user/dc', initMiddleware, indexauthMiddleware, controller.index.user.dc);
    
    // 客服
    router.get('/kefu/index', initMiddleware, indexauthMiddleware, controller.index.kefu.index);
    router.post('/kefu/doAdd', initMiddleware, indexauthMiddleware, controller.index.kefu.doAdd);

    //评论
     router.get('/comment', initMiddleware, indexauthMiddleware, controller.index.comment.index);
     router.get('/comment/delete', initMiddleware, indexauthMiddleware, controller.index.comment.delete);
     router.post('/comment/doAdd', initMiddleware, indexauthMiddleware, controller.index.comment.doAdd);
 
    //评价
    router.get('/pingjia', initMiddleware, indexauthMiddleware, controller.index.pingjia.index);
    router.get('/pingjia/delete', initMiddleware, indexauthMiddleware, controller.index.pingjia.delete);
    router.post('/pingjia/doAdd', initMiddleware, indexauthMiddleware, controller.index.pingjia.doAdd);

    //文章
    router.get('/article', initMiddleware, controller.index.article.getArticle);

    //点赞
    router.get('/dianzan', initMiddleware, controller.index.dianzan.index);
    router.get('/dianzan/add', initMiddleware, controller.index.dianzan.add);
};

