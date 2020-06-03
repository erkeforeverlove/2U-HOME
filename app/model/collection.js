module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    
    const CollectionSchema = new Schema({
      title: { type: String,default:""},
      user_id:{type:Schema.Types.ObjectId },
      goods_id:{type:Schema.Types.ObjectId },
      status: { type: Number,default:1},
      add_time:{type:Number,default:new Date().getTime()}
    });   

    return mongoose.model('Collection',CollectionSchema,'collection');
}
