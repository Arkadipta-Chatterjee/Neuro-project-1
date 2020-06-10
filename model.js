const mongoose = require('mongoose');
const validator = require('validator');
const slugify = require('slugify');

const modelSchema = new mongoose.Schema({
        name: {
            type: String,
            required: [true, 'Please enter your name'],
            unique: true,
            trim: true,
            maxlength: [
                40, 'A name cannot have more than 40 characters in it'
            ]

        },
        password: {
            type: String,
            required: [true, 'Please enter your password'],
            
            minlength: [8, 'A password must have minimum 8 characters']
        },
        email: {
            type: String,
            required: [true, 'Please enter email'],
            unique: true,
            lowercase:true
        },
        phone: {
            type: String,
            minlength: [10, 'Invalid phone number'],
            maxlength: [10, 'Invalid phone number']
        },
        isVerified:{
            type:Boolean,
            default:false
        },
        passwordResetToken:String,
        passwordResetExpires:Date

    },
    

)
const model = mongoose.model('model', modelSchema);
module.exports = model;
