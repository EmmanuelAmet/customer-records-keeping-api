let express = require('express')
let router = express.Router()
let Record = require('../model/record')
require('../db/connect_db')
let auth = require('../middleware/auth')


/* Create record */
router.post('/v1/records/create', auth, async(req, res) => {
    let record = new Record({
        ...req.body,
        owner: req.user._id
    })
    try {
        await record.save()
        res.status(201).send(record)
    } catch (e) {
        res.status(400).send(e)
    }
})

/* Fetch records */
router.get('/v1/records', auth, async(req, res) => {
    try {
        let sort = {}
        if (req.query.sortBy) {
            let parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }
        await req.user.populate({
            path: 'records',
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.status(201).send(req.user.records)
    } catch (e) {
        res.status(400).send(e)
    }
})

/* Update record */
router.patch('/v1/records/update/:id', auth, async(req, res) => {
    let updates = Object.keys(req.body)
    let allowedUpdates = ['firstname', 'lastname', 'othername', 'email', 'contact', 'product_name', 'address', 'quantity', 'unit_price']
    let isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidUpdate) {
        return res.status(400).send({ error: 'Invalid updates' })
    }

    try {
        let record = await Record.findOne({ _id: req.params.id, owner: req.user._id })
        if (!record) {
            res.status(400).send()
        }
        updates.forEach((update) => record[update] = req.body[update])
        await record.save()
        res.send(record)
    } catch (e) {
        res.status(500).send(e)
    }
})

/* Delete a particular record */
router.delete('/v1/records/delete/:id', auth, async(req, res) => {
    try {
        let record = await Record.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!record) {
            return res.status(404).send()
        }
        res.send(record)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router