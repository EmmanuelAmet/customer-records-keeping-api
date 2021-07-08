let mongoose = require('mongoose')
let validator = require('validator')
let bcrypt = require('bcrypt')
let jwt = require('jsonwebtoken')
let Record = require('./record')

const userSchema = new mongoose.Schema({
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
    password: {
        type: String,
        trim: true,
        required: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password must not contain password')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

userSchema.virtual('records', {
    ref: 'Record',
    localField: '_id',
    foreignField: 'owner'
})

/* Generating auth token upon creating account or user login */
userSchema.methods.generateAuthToken = async function() {
    let user = this
    let token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

/* Prevent exposing sensity information as a response (user password and tokens) */
userSchema.methods.toJSON = function() {
    let user = this
    let userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

/* Checking user credentials before user login */
userSchema.statics.findByCredentials = async(email, password) => {
    let user = await User.findOne({ email })
    if (!user) {
        throw new Error('Unable to login')
    }
    let isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }
    return user
}

/* Encrypting password before saving (save and update actions) */
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }
    next()
})

/* Delete cascade - all records created by this user will be deleted. */
userSchema.pre('remove', async function(next) {
    await Record.deleteMany({ owner: this._id })
    next()
})

let User = mongoose.model('User', userSchema)

module.exports = User