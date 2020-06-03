'use strict';

module.exports = app => {
  const { router, controller } = app;
   
  //首页
  router.get('/admin', controller.admin.home.index);
  router.get('/admin/welcome', controller.admin.home.welcome);
  
  //公共路由
  router.get('/admin/verify', controller.admin.base.verify);
  router.get('/admin/changeStatus', controller.admin.base.changeStatus);
  router.get('/admin/editNum', controller.admin.base.editNum);
  
  // 登录
  router.get('/admin/login', controller.admin.login.index);
  router.post('/admin/doLogin', controller.admin.login.doLogin);
  router.get('/admin/logout', controller.admin.login.logout);

  // 管理员管理
  router.get('/admin/manager', controller.admin.manager.index);
  router.get('/admin/manager/add', controller.admin.manager.add);
  router.post('/admin/manager/doAdd', controller.admin.manager.doAdd);
  router.get('/admin/manager/edit', controller.admin.manager.edit);
  router.post('/admin/manager/doEdit', controller.admin.manager.doEdit);
  router.get('/admin/manager/delete', controller.admin.manager.delete);

  // 角色管理
  router.get('/admin/role', controller.admin.role.index);
  router.get('/admin/role/add', controller.admin.role.add);
  router.post('/admin/role/doAdd', controller.admin.role.doAdd);
  router.get('/admin/role/edit', controller.admin.role.edit);
  router.post('/admin/role/doEdit', controller.admin.role.doEdit);
  router.get('/admin/role/delete', controller.admin.role.delete);
  router.get('/admin/role/auth', controller.admin.role.auth);
  router.post('/admin/role/doAuth', controller.admin.role.doAuth);

  // 权限管理
  router.get('/admin/access', controller.admin.access.index);
  router.get('/admin/access/add', controller.admin.access.add);
  router.post('/admin/access/doAdd', controller.admin.access.doAdd);
  router.get('/admin/access/edit', controller.admin.access.edit);
  router.post('/admin/access/doEdit', controller.admin.access.doEdit);
  router.get('/admin/access/delete', controller.admin.access.delete);

  // 广告管理
  router.get('/admin/advertise', controller.admin.advertise.index);
  router.get('/admin/advertise/add', controller.admin.advertise.add);
  router.post('/admin/advertise/doAdd', controller.admin.advertise.doAdd);
  router.get('/admin/advertise/edit', controller.admin.advertise.edit);
  router.post('/admin/advertise/doEdit', controller.admin.advertise.doEdit);
  router.get('/admin/advertise/delete', controller.admin.advertise.delete);
  

 
  
  // 商品分类管理
  router.get('/admin/goodsCategory', controller.admin.goodsCategory.index);
  router.get('/admin/goodsCategory/add', controller.admin.goodsCategory.add);
  router.post('/admin/goodsCategory/doAdd', controller.admin.goodsCategory.doAdd);
  router.get('/admin/goodsCategory/edit', controller.admin.goodsCategory.edit);
  router.post('/admin/goodsCategory/doEdit', controller.admin.goodsCategory.doEdit);
  router.get('/admin/goodsCategory/delete', controller.admin.goodsCategory.delete);
  
  // 房屋商品管理
  router.get('/admin/goods', controller.admin.goods.index);
  router.get('/admin/goods/add', controller.admin.goods.add);
  router.post('/admin/goods/doAdd', controller.admin.goods.doAdd);
  router.get('/admin/goods/look', controller.admin.goods.look);
  router.get('/admin/goods/edit', controller.admin.goods.edit);
  router.post('/admin/goods/doEdit', controller.admin.goods.doEdit);
  router.get('/admin/goods/delete', controller.admin.goods.delete); 
  router.post('/admin/goods/goodsDetailImages', controller.admin.goods.goodsDetailImages);
  router.post('/admin/goods/goodsAlbumImages', controller.admin.goods.goodsAlbumImages);
  router.post('/admin/goods/goodsImageRemove', controller.admin.goods.goodsImageRemove);


  //用户模块
  router.get('/admin/user', controller.admin.user.index);
  router.get('/admin/user/edit', controller.admin.user.edit);
  router.post('/admin/user/doEdit', controller.admin.user.doEdit);
  router.get('/admin/user/delete', controller.admin.user.delete);


  //导航模块
  router.get('/admin/nav', controller.admin.nav.index);
  router.get('/admin/nav/add', controller.admin.nav.add);
  router.post('/admin/nav/doAdd', controller.admin.nav.doAdd);
  router.get('/admin/nav/edit', controller.admin.nav.edit);
  router.post('/admin/nav/doEdit', controller.admin.nav.doEdit);
  router.get('/admin/nav/delete', controller.admin.nav.delete);

  //文章分类模块
  router.get('/admin/articleCategory', controller.admin.articleCategory.index);
  router.get('/admin/articleCategory/add', controller.admin.articleCategory.add);
  router.post('/admin/articleCategory/doAdd', controller.admin.articleCategory.doAdd);
  router.get('/admin/articleCategory/edit', controller.admin.articleCategory.edit);
  router.post('/admin/articleCategory/doEdit', controller.admin.articleCategory.doEdit);
  router.get('/admin/articleCategory/delete', controller.admin.articleCategory.delete);

  //文章管理
  router.get('/admin/article', controller.admin.article.index);
  router.get('/admin/article/add', controller.admin.article.add);
  router.post('/admin/article/doAdd', controller.admin.article.doAdd);
  router.get('/admin/article/edit', controller.admin.article.edit);
  router.post('/admin/article/doEdit', controller.admin.article.doEdit);
  router.post('/admin/article/articleDetailImages', controller.admin.article.articleDetailImages);
  router.get('/admin/article/delete', controller.admin.article.delete);

  //客服管理
  router.get('/admin/kefu', controller.admin.kefu.index);
  router.get('/admin/kefu/info', controller.admin.kefu.info);
  router.get('/admin/kefu/delete', controller.admin.kefu.delete);



  
  
};