const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    const sess = req.session
    if(sess.email && sess.password && sess.identifier === 'admin') {
        res.redirect('/admin')
    } else {
        res.render('client/index')
    }
})

module.exports = router