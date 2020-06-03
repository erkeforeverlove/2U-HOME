module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  var d=new Date();   
  const GoodsCategorySchema = new Schema({
    title: { type: String  },
    link:{  
      type: String   //跳转 到 房屋 或者 房屋列表 
    },
    pid:{  //自关联表 (一对多 的关系 ) 上级分类 支持N级分类；此版本只做两级分类
      type:Schema.Types.Mixed  //混合类型   // 0 顶级，
    },      
    status: { type: Number,default:1  },    
    sort: { type: Number,default:100 },   
    add_time: {           
      type:Number,        
      default: d.getTime()    
    }
   
  });
 
  return mongoose.model('GoodsCategory', GoodsCategorySchema,'goods_category');
}