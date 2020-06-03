const url = require('url')
module.exports = options =>{
   
    return async (ctx,next)=>{
        //全局变量
        ctx.state.csrf = ctx.csrf
        ctx.state.lastPage =ctx.request.headers['referer'];   //上一页的地址    
        var pathname =url.parse(ctx.request.url).pathname    
        if(ctx.session.userinfo){
            ctx.state.userinfo = ctx.session.userinfo;
            
            /**
             * 登录成功后 用户，依据url 判断 是否具有访问权限；
             * 如果 地址有访问权限  则获取访问权限列表
             * 如果 地址没有访问权限  则提示 不能访问
             */
            // var isAuth  =  await ctx.service.admin.checkAuth();
            //  if(isAuth){
            //     var au= ctx.state.authList =await ctx.service.admin.getAuthList(ctx.session.userinfo.role_id);   
            //     await next()
            //  }else{
            //     ctx.body = '您没有访问权限'
            //  }

            await ctx.service.admin.checkAuth();
            
            ctx.state.authList =await ctx.service.admin.getAuthList(ctx.session.userinfo.role_id)
            await next()

        }else{
            if(pathname=='/admin/login'||pathname=='/admin/doLogin'||pathname=='/admin/verify'){
                await next()
            }else{
                ctx.redirect('/admin/login')
            }
        }
    }
}