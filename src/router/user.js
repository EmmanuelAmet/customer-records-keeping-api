let express = require('express')
let router = express.Router()
require('../db/connect_db')
let User = require('../model/user')
let auth = require('../middleware/auth')

/* Create user account */
router.post('/v1/account/create/users', async(req, res)=> {
    let user = new User(req.body)
    try {
        await user.save()
        let token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

/* User login */
router.post('/v1/account/users/login', async(req, res) => {
    try {
        let user = await User.findByCredentials(req.body.email, req.body.password)
        let token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})

/* Get or View user details */
router.get('/v1/account/users/me', auth, async(req, res) => {
    res.send(req.user)
})

/* Logout from a single device */
router.post('/v1/account/users/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

/* Logout from all devices */
router.post('/v1/account/users/logoutAll', auth, async(req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }

})

/* Update user details */
router.patch('/v1/account/update/users/me', auth, async(req, res) => {
    let updates = Object.keys(req.body)
    let allowedUpdates = ['email', 'password']
    let isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidUpdate) {
        return res.status(400).send({ error: 'Inalid updates!' })
    }
    try {
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })
        await req.user.save()

        res.send(req.user)
    } catch (e) {
        res.status(500).status(e)
    }
})

/* Delete user account, upon successful deletion, all records saved by the user will be deleted. */
router.delete('/v1/account/users/delete/me', auth, async(req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router