const mongoose=require('mongoose');
const fileSchema = new mongoose.Schema({
    originalName:{
        type:String,
        required:true
    },
    path:{
        type:String,
        required:true
    },
    newName:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    downloads:{
        type:Number,
        default:0
    }
}) 
module.exports=mongoose.model('file',fileSchema);