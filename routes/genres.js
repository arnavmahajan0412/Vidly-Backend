const express = require('express');
const Joi = require('joi');
const mongoose = require('mongoose');
const app = express.Router();

const genreSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});
const genreModel = mongoose.model('Genre', genreSchema);


app.get('/', async(req, res) => {
    const genres = await genreModel.find().sort('name');
    res.send(genres);
});
app.get('/:id', async(req, res) => {
    const genre = await genreModel.findById(req.params.id);
    if (!genre) {
        res.status(404).send("This id was not found");
    }
    res.send(genre);
});
app.post('/', async(req, res) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
    });
    const result = schema.validate(req.body);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    let genre = new genreModel({ name: req.body.name });
    genre = await genre.save();
    res.send(genre);
});

app.put('/:id', async(req, res) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
    });
    const result = schema.validate(req.body);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    const genre = await genreModel.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
        new: true
    });
    if (!genre) {
        return res.status(404).send("This id was not found");
    }
    res.send(genre);
});
app.delete('/:id', async(req, res) => {
    const genre = await genreModel.findByIdAndRemove(req.params.id);
    if (!genre) return res.status(404).send('The genre with the given ID was not found.');
    res.send(genre);
});

module.exports = app;