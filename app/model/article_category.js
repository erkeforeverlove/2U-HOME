module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    var d=new Date(); 
    
    const ArticleCategorySchema = new Schema({
      title: { type: String ,default:''},
      cate_icon: { type: String,  default:''}, 
      description: { type: String ,default:''},      
      status: { type: Number,default:1  },    
      sort: { type: Number,default:100 },   
      add_time: { type:Number,default: d.getTime()}
    });
   
    return mongoose.model('ArticleCategory',ArticleCategorySchema,'article_category');
}