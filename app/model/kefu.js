module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
  
    const KefuSchema = new Schema({
      uid: { type: Schema.Types.ObjectId },
      name: { type: String },
      phone: { type: String },
      content: { type: String },      
      add_time: {
        type: Number,
        default: new Date().getTime(),
      },
    });
  
    return mongoose.model('Kefu', KefuSchema, 'kefu');
  };
  
  