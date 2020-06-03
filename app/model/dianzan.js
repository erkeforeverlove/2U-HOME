module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
  
    const DianzanSchema = new Schema({
      comment_id: { type: Schema.Types.ObjectId },
      user_id:{type:Array,default:[]},
      user_num:{type: Number,default:1},
      add_time: {
        type: Number,
        default: new Date().getTime(),
      },
    });
  
    return mongoose.model('Dianzan', DianzanSchema, 'dianzan');
  };
  
  