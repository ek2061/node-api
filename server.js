const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')  // req.body
const passport = require('passport')  //驗證token
const app = express()

// 引入users.js
const users = require('./routes/api/users')
const profiles = require('./routes/api/profiles')

// DB config
const db = require('./config/keys').mongoURI

// 使用body-parser中間件
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// 連接到mongoDB
mongoose.connect(db,
    { useNewUrlParser: true, useUnifiedTopology: true }  // 加這行可以少一點警告
)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err))

// passport token初始化
app.use(passport.initialize())

//把import的passport傳到./config/passport.js，這樣就可以在那邊寫
require('./config/passport')(passport)

// app.get('/', (req, res) => {
//     res.send('hello world')
// })

// 使用routes
// localhost:5000/api/users會連結users.js
// 然後users.js有GET /test會拿到{ msg: "login works"}
app.use('/api/users', users)
app.use('/api/profiles', profiles)

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})