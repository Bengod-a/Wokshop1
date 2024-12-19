const express = require('express')
const router = express.Router()

const { create, list, remov, update, listby, searchFiltsrs, read, createImages, removeImage, } = require('../controllers/product')
const { adminCheck,  authCheck } = require('../middleeares/authCheck')

router.post('/product', create)
router.get('/products/:count', list)
router.put('/product/:id', update)
router.get('/product/:id', read)
router.delete('/product/:id', remov)
router.post('/productby', listby)
router.post('/search/filters', searchFiltsrs)


router.post('/images', authCheck, adminCheck, createImages)
router.post('/removeimages',  authCheck, adminCheck, removeImage)



module.exports = router