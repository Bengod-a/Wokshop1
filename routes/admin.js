const express = require("express")
const { authCheck } = require("../middleeares/authCheck")
const router = express.Router()

const { getOderAdmin,changeOderStatus } = require('../controllers/admin')


router.put('/admin/oder-status', authCheck, changeOderStatus)
router.get('/admin/orders', authCheck, getOderAdmin)



module.exports = router