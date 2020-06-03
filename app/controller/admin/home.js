var BaseController =require('./base.js');
class HomeController extends BaseController {
    
    //主页面
    async index() {
        await this.ctx.render('admin/home/home');
    }
    
    
    // 统计页面
    async welcome() {
        var totalNum=await this.ctx.model.User.find({}).count();   
        var totalHouse=await this.ctx.model.Goods.find({"is_delete":"false"}).count();  
        var totalAdmin=await this.ctx.model.Admin.find({}).count(); 
        var totalkefu=await this.ctx.model.Kefu.find({}).count(); 
        var newHouse=await this.ctx.model.Goods.find({"cate_id":"5e75bcf95b19194798cf9ce3"}).count();
        var ershouHouse=await this.ctx.model.Goods.find({"cate_id":"5e64e00f62e34f5dc454eb16"}).count();
        var zuHouse=await this.ctx.model.Goods.find({"cate_id":"5e75bd6d5b19194798cf9ce4"}).count(); 
        var shangpuHouse=await this.ctx.model.Goods.find({"cate_id":"5e75bddc5b19194798cf9ce5"}).count();
        var user=await this.ctx.model.User.find({}); 
        var January = 0;
        var February = 0;
        var March = 0;
        var April = 0;
        var May = 0;
        var June = 0;
        var July = 0;
        var August = 0;
        var September = 0;
        var October = 0;
        var November = 0;
        var December = 0; 
        for (let i = 0; i < user.length; i++) {
            var date = this.ctx.helper.formatTime(user[i].add_time);
            var arr=date.split("-");  
            if(arr[1].toString()=="01"){
                January++;               
            }else if(arr[1].toString()=="02"){
                February++;
            }else if(arr[1].toString()=="03"){
                March++;
            }else if(arr[1].toString()=="04"){
                April++;
            }else if(arr[1].toString()=="05"){
                May++;
            }else if(arr[1].toString()=="06"){
                June++;
            }else if(arr[1].toString()=="07"){
                July++;
            }else if(arr[1].toString()=="08"){
                August++;
            }else if(arr[1].toString()=="09"){
                September++;
            }else if(arr[1].toString()=="10"){
                October++;
            }else if(arr[1].toString()=="11"){
                November++;
            }else if(arr[1].toString()=="12"){
                December++;
            }
        }
        var date = Array(January,February,March,April,May,June,July,August,September,October,November,December);
        
        await this.ctx.render('admin/home/welcome',{
            totalNum,
            totalHouse,
            totalAdmin,
            totalkefu,
            newHouse,
            ershouHouse,
            zuHouse,
            shangpuHouse,
            date
        });
    }
}
module.exports = HomeController;