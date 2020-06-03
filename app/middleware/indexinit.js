module.exports = (options,app) => {
    return async function init(ctx, next) {

        ctx.state.csrf = ctx.csrf; // 全局变量
        ctx.state.userinfo = ctx.service.cookie.get('userinfo'); // 获取用户信息

        //顶部导航
        var topNav=await ctx.model.Nav.find({"position":1}).sort({ sort:1 }); 
     
        //中间导航
        var middleNav=await ctx.model.Nav.find({"position":2}).sort({ sort:1 });
        
        //底部导航
        var bottomNav=await ctx.model.Nav.find({"position":3}).sort({ sort:1 }); 
        ctx.state.topNav=topNav; 
        ctx.state.middleNav=middleNav; 
        ctx.state.bottomNav=bottomNav; 
        await next();
    };
};
