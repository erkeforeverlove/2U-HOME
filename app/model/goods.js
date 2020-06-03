module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  var d=new Date();   
  const GoodsSchema = new Schema({
    title: { type: String,default: ''},    //房屋标题
    cate_id: {type:Schema.Types.ObjectId },  //房屋类型id
    sale: {type:Schema.Types.ObjectId },       //房屋销售员id
    open_time: {             //开盘日期
      type:String,        
      default: d.getTime()
    },
    address: {             //房屋地址
      type:String,        
      default: '暂无'
    },
    house_huxing: {             //房屋户型
      type:String,        
      default: '暂无'
    },
    space: {             //建筑面积
      type:String,        
      default: '暂无'
    },
    price:{      //房屋价格
      type:String,
      default:'暂无'
    },
    house_tel:{      //楼盘电话
      type:String,
      default:'暂无'
    },
    goods_img:{
      type: String,
      default:''
    },
    goods_content:{
      type: String,
      default:''
    },
    sort: { type: Number,default:100 },  
    is_delete:{
      type: Boolean,
      default:false
    },
    is_hot:{
      type: Number,
      default:0 
    },
    is_best:{
      type: Number,
      default:0
    },
    is_new:{
      type: Number,
      default:0
    },
    status: { type: Number,default:1  },    
    
   
  });
 
  return mongoose.model('Goods', GoodsSchema,'goods');

}