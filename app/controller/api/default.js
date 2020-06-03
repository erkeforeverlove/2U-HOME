const  Controller = require('egg').Controller;

class DefaultController extends Controller{
   
    async index(){
        this.ctx.body=['a','b','c']
    }

}
module.exports =  DefaultController;

