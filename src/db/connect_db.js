let mongoose = require('mongoose')

let url = process.env.DB_CONNECTION_STRING

mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('DB connected successfully.')
}).catch((error) => {
    console.log('Unable to connect to DB: ' + error)
})