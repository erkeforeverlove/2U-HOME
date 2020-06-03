module.exports=app=>{
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const AccessSchema = new Schema({
        module_name:{type:String},
        type:{type:Number},  //节点类型：1 模块  2 菜单  3 操作
        action_name:{type:String},
        action_url:{type:String},
        module_id:{type:Schema.Types.Mixed},//所属模块 1： ='0' 顶级模块  2: 此module_id和当前模型的_id关联
        sort:{type:Number,default:100},
        description:{type:String},
        status:{type:Number,default:1},
        add_time:{type:Number,default:new Date().getTime()}
    })
    return mongoose.model('Access',AccessSchema,'access');
}