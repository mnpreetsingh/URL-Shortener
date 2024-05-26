const express = require("express");
const { connectToMongoDB } = require("./connect")
const urlRoute = require('./routes/url')
const URL = require('./models/url')
const path = require('path');
const staticRoute = require("./routes/staticRouter")

const app = express();
const PORT = 8002;


connectToMongoDB("mongodb://127.0.0.1:27017/short-url")
    .then(() => console.log('MongoDB Connected'));


app.set("view engine", "ejs")
app.set('views', path.resolve('./views'))

//MIDDLE WARE
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use("/url", urlRoute)

app.use("/", staticRoute)


app.get('/url/:shortId', async(req, res) => {
    try {
        const shortId = req.params.shortId;
        const entry = await URL.findOneAndUpdate({ shortId: shortId }, { $push: { visitHistory: { timestamp: Date.now() } } }, { new: true } // This option returns the updated document
        );

        if (!entry) {
            return res.status(404).send('URL not found');
        }

        return res.redirect(entry.redirectURL);
    } catch (err) {
        console.error(err);
        return res.status(500).send('Server Error');
    }
})

app.listen(PORT, () => console.log(`Server Started at PORT: ${PORT}`))


// ------------ EJS, PUG , HANDLEBARS FOR SERVER SIDE RENDERING-------------------