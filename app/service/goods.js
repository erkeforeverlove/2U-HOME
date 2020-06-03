'use strict';

const Service = require('egg').Service;

class GoodsService extends Service{

    //hot 
    async getIndexGoods(type,limit){
        try {
            let findJson = {} 
            const limitSize = limit || 8;
            switch (type) {
              case 'hot':
                findJson = Object.assign(findJson, { is_hot: 1,"status":1 });
                break;
              case 'best':
                findJson = Object.assign(findJson, { is_best: 1,"status":1 });
                break;
              case 'new':
                findJson = Object.assign(findJson, { is_new: 1 ,"status":1 });
                break;
              default :
                findJson = Object.assign(findJson, { is_hot: 1 ,"status":1});
                break;
            }
            
            let goodsArray = await this.ctx.model.Goods.find(findJson,'title price goods_img open_time cate_id').limit(limitSize);
            return goodsArray;
        } catch (error) {
            console.log(error);
            return [];
        }
     
    }

    
}

module.exports = GoodsService;