let jwt = require('jsonwebtoken')
let User = require('../model/user')

let auth = async(req, res, next) => {
    try {
        let token = req.header('Authorization').replace('Bearer ', '')
        let decoded = jwt.verify(token, process.env.JWT_SECRET)
        let user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {
            throw new Error()
        }

        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

module.exports = auth