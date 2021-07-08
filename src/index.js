let express = require('express')
let userRouter = require('./router/user')
let recordRouter = require('./router/record')

let app = express()
let port = process.env.PORT

app.use(express.json())

app.use(userRouter)
app.use(recordRouter)

app.listen(port, () => {
    console.log('Server is up and runningon port: ' + port)
})