// login and register
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')  // 加密
const jwt = require('jsonwebtoken')  //token
const gravatar = require('gravatar')  //使用者頭像
const keys = require('../../config/keys')
const passport = require('passport')

const User = require('../../models/User')

// $route GET api/users/test
// @desc  返回請求的json資料
// @access public
router.get('/test', (req, res) => {
    res.json({ msg: "login works" })
})

// $route POST api/users/register
// @desc  返回請求json資料
// @access public
router.post('/register', (req, res) => {
    // console.log(req.body)

    // 查詢資料庫是否有信箱
    User.findOne({ email: req.body.email })  //req.body是拆出傳給api的內容
        .then(user => {  //user是匹配email出來的帳戶資料
            if (user) {  //如果user存在，就是用信箱有匹配到，代表信箱有人用過了
                return res.status(400).json('信箱已被註冊')
            }
            else {
                const avatar = gravatar.url(req.body.email, { s: '200', r: 'pg', d: 'mm' });

                const newUser = new User({  //用傳給api的內容創立帳戶
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password,
                    identity: req.body.identity
                })

                // 加密
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err

                        newUser.password = hash  // 密碼設為加密的hash

                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err))
                    });
                });
            }
        })
})

// $route POST api/users/login
// @desc  返回token jwt passport
// @access public
router.post('/login', (req, res) => {
    const email = req.body.email  //req.body是拆出傳給api的內容
    const password = req.body.password
    // 查詢資料庫
    User.findOne({ email })
        .then(user => {  // user是匹配email出來的帳戶資料
            // 如果帳戶不存在
            if (!user) {
                return res.status(404).json('使用者帳戶不存在')
            }

            // 如果存在就密碼匹配
            bcrypt.compare(password, user.password)
                .then(isMatch => {  // 如果匹配成功
                    if (isMatch) {
                        const rule = {
                            id: user.id,
                            name: user.name,
                            avatar: user.avatar,
                            identity: user.identity
                        }
                        jwt.sign(rule, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
                            if (err) throw err
                            res.json({
                                success: true,
                                token: 'Bearer ' + token  // 一定要叫Bearer，不能取別的
                            })
                        })  // 規則 加密名字 過期時間 箭頭函數
                        // res.json({ msg: 'success' })
                    }
                    else {
                        return res.status(400).json('密碼錯誤')
                    }
                })
        })
})

// $route GET api/users/current
// @desc  返回當前帳戶
// @access Private
// passport.authenticate() 是驗證token的方法
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    // res.json({msg: 'success'})
    res.json({   //返回帳戶資訊
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        identity: req.user.identity
    })
})

module.exports = router