const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
const { OpenAI } = require('openai');
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

app.get('/connectionCheck', (req, res) => {
    res.sendStatus(200);
});

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

app.post('/pickClothing', async (req, res) => {
    const data = await clothingModel.find(req.body.query);
    const topsArray = data.filter(clothing => clothing.type === "Top");
    const bottomsArray = data.filter(clothing => clothing.type === "Bottom");

    let topsList = '';
    let bottomsList = '';

    for (let i = 0; i < topsArray.length; i++) {
        topsList += `(${topsArray[i].id}) ${topsArray[i].colour} ${topsArray[i].article}, `
    }

    for (let i = 0; i < bottomsArray.length; i++) {
        bottomsList += `(${bottomsArray[i].id}) ${bottomsArray[i].colour} ${bottomsArray[i].article}, `
    }

    const prompt = (`
    You have the following clothing items available: Tops: [${topsList}] Bottoms: [${bottomsList}].
    Please pick an outfit for me that is appropriate for ${req.body.weatherInfo.weatherInfo} weather and ${req.body.weatherInfo.weatherTemp} Celsius temperature.
    It must be colour coordinated (i.e. not the same colour, but complementary ones that do not clash).
    Please return exactly one clothing article from the tops list and one from the bottoms list.
    If you cannot find an appropriate item from either the top list or bottom list, please return "null" for that item.
    Please return it as a JSON object containing only the properties "top" and "bottom". The values should only contain the alphanumeric strings inside the parentheses (but not the parentheses themselves) and nothing else.
    `);

    const openai = new OpenAI({
        api_key: process.env.OPENAI_API_KEY,
    });

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ "role": "user", "content": prompt }],
            temperature: 0.6,
        });

        selectedOutfit = JSON.parse(completion.choices[0].message.content);
    } catch (err) {
        console.log("Unknown error retrieving outfit suggestions.")
    };

    let chosenTop = null;
    let chosenBottom = null;

    try {
        if (selectedOutfit.top !== 'null') {
            chosenTop = await clothingModel.findOne({
                '_id': selectedOutfit.top,
            });
        }

        if (selectedOutfit.bottom !== 'null') {
            chosenBottom = await clothingModel.findOne({
                '_id': selectedOutfit.bottom,
            });
        }
        res.send({ 'top': chosenTop, 'bottom': chosenBottom });
    } catch (err) {
        res.sendStatus(500);
    }
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