const express = require("express")
const router = express.Router();
const URL = require('../models/url')

router.get('/', async(req, res) => {
    const allurls = await URL.find({})
    return res.render("home", {
        urls: allurls
    })
})

router.get('/analytics', async(req, res) => {
    const allurls = await URL.find({})
    return res.render("home", {
        urls: allurls,
        showTable: true
    })
})

router.get('/analytics/:shortId', async(req, res) => {
    const shortId = req.params.shortId;
    const url = await URL.findOne({ shortId: shortId });
    if (!url) {
        return res.status(404).send('URL not found');
    }
    return res.render('home', {
        urls: [url],
        showTable: true,
        specificUrl: url
    });
})


module.exports = router;