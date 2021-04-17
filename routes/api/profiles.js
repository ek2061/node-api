// login and register
const express = require('express')
const router = express.Router()
const passport = require('passport')

const Profile = require('../../models/Profile')

// $route GET api/profiles/test
// @desc  返回請求的json資料
// @access public
router.get('/test', (req, res) => {
    res.json({ msg: "profile works" })
})

// $route GET api/profiles/add
// @desc  創建訊息接口
// @access Private
// passport.authenticate() 是驗證token的方法
router.post('/add', passport.authenticate('jwt', { session: false }), (req, res) => {
    const profileFileds = {}

    // 確認內容存在
    if (req.body.type) profileFileds.type = req.body.type
    if (req.body.describe) profileFileds.describe = req.body.describe
    if (req.body.income) profileFileds.income = req.body.income
    if (req.body.expend) profileFileds.expend = req.body.expend
    if (req.body.cash) profileFileds.cash = req.body.cash
    if (req.body.remark) profileFileds.remark = req.body.remark

    new Profile(profileFileds).save().then(profile => {
        res.json(profile)
    })
})

// $route GET api/profiles/
// @desc  獲取所有訊息
// @access Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.find()
        .then(profile => {
            if (!profile) {
                return res.status(404).json('沒有任何內容')
            }

            res.json(profile)
        })
        .catch(err => res.status(404).json(err))
})

// $route GET api/profiles/:id
// @desc  獲取單個訊息
// @access Private
router.get('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ _id: req.params.id })
        .then(profile => {
            if (!profile) {
                return res.status(404).json('沒有任何內容')
            }

            res.json(profile)
        })
        .catch(err => res.status(404).json(err))
})

// $route POST api/profiles/edit/:id
// @desc  編輯訊息接口
// @access Private
// passport.authenticate() 是驗證token的方法
router.post('/edit/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const profileFileds = {}

    // 確認內容存在
    if (req.body.type) profileFileds.type = req.body.type
    if (req.body.describe) profileFileds.describe = req.body.describe
    if (req.body.income) profileFileds.income = req.body.income
    if (req.body.expend) profileFileds.expend = req.body.expend
    if (req.body.cash) profileFileds.cash = req.body.cash
    if (req.body.remark) profileFileds.remark = req.body.remark

    Profile.findOneAndUpdate(
        { _id: req.params.id },  // 要修改的資料的id
        { $set: profileFileds },  // 要修改的資料的欄位
        { new: true }
    ).then(profile => res.json(profile))
})

// $route POST api/profiles/delete/:id
// @desc  刪除訊息接口
// @access Private
// passport.authenticate() 是驗證token的方法
router.delete('/delete/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOneAndRemove({ _id: req.params.id })
        .then(profile => {
            profile.save().then(res.json(profile))
        })
        // .then(profile => {
        //     profile.save().then(profile => res.json(profile))
        // })
        .catch(err => res.status(404).json('刪除失敗'))
})

module.exports = router