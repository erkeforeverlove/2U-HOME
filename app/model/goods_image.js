module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    var d=new Date();   
    const GoodsImageSchema = new Schema({
      goods_id: {type:Schema.Types.ObjectId },  
      img_url: { type: String  },    
      status: { type: Number,default:1  },
      add_time: {           
        type:Number,        
        default: d.getTime()    
      }
     
    });
   
    return mongoose.model('GoodsImage', GoodsImageSchema,'goods_image');
}