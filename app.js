const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
const clothingModel = require('./models/clothingModel');
const mongoose = require('mongoose');

dotenv.config();
app.use(express.json());

var corsOptions = {
    origin: [process.env.LOCAL_URL, process.env.DEV_URL, process.env.PROD_URL],
    credentials: true,
    optionsSuccessSatus: 200
};

app.use(cors(corsOptions));

app.post('/addClothing', async (req, res) => {
    const owner = req.body.owner;
    const type = req.body.type;
    const article = req.body.article;
    const colour = req.body.colour;
    const weight = req.body.weight;
    const clothingImageUrl = req.body.imageUrl;
    const isAvailable = req.body.isAvailable;

    const newClothingItem = {
        owner: owner,
        type: type,
        article: article,
        colour: colour,
        weight: weight,
        imageUrl: clothingImageUrl,
        isAvailable: isAvailable
    };

    await clothingModel.create(newClothingItem)
        .then(() => { res.sendStatus(200) })
        .catch(() => { res.sendStatus(500) });
});

app.post('/getClothing', async (req, res) => {
    res.send(await clothingModel.find(req.body.query));
});

app.post('/updateClothing', async (req, res) => {
    const targetId = new mongoose.Types.ObjectId(req.body.query.id);
    res.send(await clothingModel.findByIdAndUpdate(targetId, req.body.query.update));
});

app.post('/deleteClothing', async (req, res) => {
    const targetId = new mongoose.Types.ObjectId(req.body.query.id);
    res.send(await clothingModel.deleteOne(targetId));
});

module.exports = app;