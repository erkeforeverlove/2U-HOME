module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
  
    const PingjiaSchema = new Schema({
      comment_id: { type: Schema.Types.ObjectId },
      user_id: { type: Schema.Types.ObjectId },
      pingjia_id:{type:Array,default:[]},
      pingjia_num:{type: Number,default:1},
      add_time: {
        type: Number,
        default: new Date().getTime(),
      },
    });
  
    return mongoose.model('Pingjia', PingjiaSchema, 'pingjia');
  };
  
  