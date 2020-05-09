const express = require('express');

const router = express.Router();

//All our database queries

// @route GET
// @desc
// @access Public
// /api/price/platform/num
//make function in another .js file?
router.get('/:price/:platform/:num', (req, res) => {
    console.log(req.params.price)
    console.log(req.params.platform)
    console.log(req.params.num)
});

module.exports = router;