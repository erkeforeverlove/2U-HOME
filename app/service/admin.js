'use strict'

const url = require('url')

const Service = require('egg').Service;

class AdminService extends Service{
    
    /**
     * 检查 地址访问权限
     */
    async checkAuth(){
        // 1 获取 当前登录用户 role_id   注： 忽略权限判断地址 和  超级管理员
        // 2 依据role_id   获取角色id 对应的所有权限id 数组A
        // 3 获取 当前访问 url  
        // 3 依据访问 url  获取对应的访问权限id B
        // 4 判断 访问权限B 是否在当前用户所属角色对应权限B 里面 

        let userinfo  = this.ctx.session.userinfo;
        let role_id = userinfo.role_id;
        
        
        // 2
        let roleAccess =await this.ctx.model.RoleAccess.find({'role_id':role_id})

        let roleAccessArray = []; 
        roleAccess.forEach(element => {
            roleAccessArray.push(element.access_id.toString())
        });
        
        
        // 3
        let pathname = url.parse(this.ctx.request.url).pathname;
        
        let ignoreUrl=['/admin/login','/admin/doLogin','/admin/verify','/admin/loginOut'];
 
        
        if(ignoreUrl.indexOf(pathname)!=-1 || userinfo.is_super==1){
             return true;   //允许访问
        }

        let urlAccess = this.ctx.model.Access.findOne({'action_url':pathname})

        
        // 4 
        if(urlAccess.length>0){
           let result = roleAccessArray.indexOf(urlAccess._id.toString()) ;
        
           if(result!=-1){
            return true;
           }else{
            return false;
           }
           return  false;
        }
    };
  
    async getAuthList(role_id){
        //获取 全部权限 A[obj]   注：自关联 和  顶级模块module_id = 0

        // 获取当前 用户所属角色权限  B[obj]

        //遍历权限 A[obj] id 是否在 B[obj] id 中
            //如果 在 则 A 中对象 obj 添加标记属性 checked = true 

        let accessAll =await this.ctx.model.Access.aggregate([
            {
                $lookup:{
                    from:'access',
                    localField:'_id',
                    foreignField:'module_id',
                    as:'items'
                }
            },
            {
                $match:{
                    'module_id':'0'
                }
            },
            {
                $sort:{
                    'sort':1
                }
            }
        ])
  

        let accessRole =await this.ctx.model.RoleAccess.find({'role_id':role_id});
     
        
        let accessRoleArray  = [];
        accessRole.forEach(access => {
            accessRoleArray.push(access.access_id.toString())
        });

        for (let i = 0; i < accessAll.length; i++) {
            if(accessRoleArray.indexOf(accessAll[i]._id.toString())!=-1){
                
                accessAll[i].checked  = true                          
                
            }

            for (let j = 0; j < accessAll[i].items.length; j++) {
                if(accessRoleArray.indexOf(accessAll[i].items[j]._id.toString())!=-1){
                    accessAll[i].items[j].checked  =true
                } 
            }
            
        }

        return accessAll;
        
    };
}

module.exports = AdminService;