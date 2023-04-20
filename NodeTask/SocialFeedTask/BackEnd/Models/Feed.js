const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const feedSchema = new Schema({
    photo:{ type:String , required:true },
    caption:{ type:String , required:true },
    likes:{type:Array,default:[]},
    comments:{type:Array ,default:[]},
    createdBy: { type: Schema.Types.ObjectId, ref: 'user' },
    createdOn: { type: Date, default: Date.now }
})

module.exports = mongoose.model('feed', feedSchema);