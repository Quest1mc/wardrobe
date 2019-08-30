const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const itemSchema = new Schema({
    title: {
        type: String,
        required:true
    },
    description:{
        type: String,
        required: true
    },
    photo: {
        type:Number,
        required:false
    },
    price: {
        type:Number,
        required: true

    },
    date: {
        type:Date,
        required: true

    }
});

module.exports = mongoose.model('Item',itemSchema);
