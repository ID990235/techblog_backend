const express = require('express')
const router = express.Router()

const homeController = require('../controller/homeController.js')

router.get('/cate', homeController.cate)

router.get('/article', homeController.article)

router.get('/fetchCateArt', homeController.fetchCateArt)

router.get('/fetchOneArt', homeController.fetchOneArt)

module.exports = router;

