module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    var d=new Date();
   
    const AdvertiseSchema = new Schema({
      title: { type: String  },
      type: { type: Number  },        // 网站 APP 小程序
      advertise_img: { type: String  },   
      link: { type: String  },   
      level: { type: Number },    // 1 一级广告   2 二级广告
      sort: { type: Number  },   
      status: { type: Number,default:1  },    
      add_time: {           
        type:Number,        
        default: d.getTime()    
       }
    });
   
    return mongoose.model('Advertise', AdvertiseSchema,'advertise');
}