module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
  
    const CommentSchema = new Schema({
      user_id: { type: Schema.Types.ObjectId },
      goods_id: { type: Schema.Types.ObjectId },
      content: { type: String },      
      pinglun_id:{type: Schema.Types.ObjectId},  //评论别人
      zan: { type: Number,default:0},//点赞数量
      ping: { type: Number,default:0},  //评论数量
      add_time: {
        type: Number,
        default: new Date().getTime(),
      },
    });
  
    return mongoose.model('Comment', CommentSchema, 'comment');
  };
  
  