let mongoose = require('mongoose')
let validator = require('validator')

let recordSchema = mongoose.Schema({
    firstname: {
        trim: true,
        type: String,
        required: true,
        maxlength: 15
    },
    lastname: {
        trim: true,
        type: String,
        required: true,
        maxlength: 15
    },
    othername: {
        trim: true,
        type: String,
        maxlength: 15
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid.')
            }
        }
    },
    contact: {
        trim: true,
        type: String,
        required: true,
        maxlength: 15
    },
    date_purchase: {
        trim: true,
        type: String,
        required: true,
        default: Date()
    },
    product_name: {
        trim: true,
        type: String,
        required: true,
        maxlength: 30
    },
    quantity: {
        type: Number,
        trim: true,
        required: true,
        maxlength: 10
    },
    unit_price: {
        type: Number,
        trim: true,
        required: true,
        maxlength: 10
    },
    address: {
        trim: true,
        type: String,
        required: true,
        maxlength: 50
    }, 
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},{
    timestamps: true
})

let Record = mongoose.model('Record', recordSchema)

module.exports = Record