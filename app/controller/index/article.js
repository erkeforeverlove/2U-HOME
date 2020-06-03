'use strict';

const Controller = require('egg').Controller;

class ArticleController extends Controller {

  
  async getArticle() {
      
      const _id = this.ctx.request.query._id;
      var article = await this.ctx.model.Article.findById(_id)
      await this.ctx.render('index/service/index',{article})

  }
  async list(){
    var cid=this.ctx.request.query.cate_id;
    var article = await this.ctx.model.Article.find({"cate_id":cid}).sort({sort:1});
    await this.ctx.render('index/article/article_list.html',{
      article:article,
  
    });
    
    
  }
  async info(){
    var id=this.ctx.request.query.id;
    var art = await this.ctx.model.Article.find({"_id":id});
    
    
    
    await this.ctx.render('index/article/article_info.html',{
      art:art[0]
  
    });
    
  }

 
  

}

module.exports = ArticleController;
