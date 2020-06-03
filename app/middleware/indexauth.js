

var url=require('url');

module.exports = (options, app) => {
  
    return async function init(ctx, next) {
        // 判断前台用户是否登录   如果登录可以进入 （ 去结算  用户中心）    如果没有登录直接跳转到登录
        // 用户中心 左侧菜单选中依据
        ctx.state.url=url.parse(ctx.request.url).pathname;
        
        var prevPage = ctx.request.headers.referer || '/';   //上一个页面的地址
        
        const userinfo = ctx.service.cookie.get('userinfo');

        if (userinfo && userinfo._id && userinfo.phone) {
        // 判断数据库里面有没有当前用户
        const userResutl = await ctx.model.User.find({ _id: userinfo._id, phone: userinfo.phone });
        if (userResutl && userResutl.length > 0) {
            await next();
        } else {
            ctx.redirect('/login?returnUrl='+encodeURIComponent(prevPage));
        }
        } else {
            ctx.redirect('/login?returnUrl='+encodeURIComponent(prevPage));
        }
    };
};
