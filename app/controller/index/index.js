'use strict';

const Controller = require('egg').Controller;

class IndexController extends Controller {
  async index() { 
    //轮播图广告 
    var advertiseTop=await this.ctx.model.Advertise.find({"type":1,"level":1});
    //子广告
    var advertiseSub=await this.ctx.model.Advertise.find({"type":1,"level":2});
    //hot  
    var goodsHot=await this.ctx.service.goods.getIndexGoods('hot',4);
    //new
    var goodsNew=await this.ctx.service.goods.getIndexGoods('new',4);    
    //best
    var goodsBest=await this.ctx.service.goods.getIndexGoods('best',4);
    var user = await this.ctx.model.User.find({}); 
    await this.ctx.render('index/home/index',{     
      advertiseTop,advertiseSub,
      goodsHot,goodsNew,goodsBest,user
    });
    
  }

  
}

module.exports = IndexController;
