module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const User = new Schema({
    img: { type: String  }, 
    name: { type: String,default: '暂无！！！！',},
    nicheng: { type: String,default: '暂无！！！！',},
    area: { type: String,default: '暂无！！！！',},
    Motto: { type: String,default: '这个人很懒，什么都没有留下 Σ( ￣д￣；) ！！！',},
    phone: { type: Number },
    password: { type: String },
    add_time: {type: Number,default: new Date().getTime(),},
    email: {type: String,default: '暂无！！！！',},
  });

  return mongoose.model('User', User, 'user');
};
