const express = require('express');
const { boolean } = require('joi');
const Joi = require('joi');
const mongoose = require('mongoose');
const app = express.Router();

const customerSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 11
    },
    isGold: {
        type: Boolean,
    }
});
const customerModel = mongoose.model('Customer', customerSchema);

app.get('/', async(req, res) => {
    const customers = await customerModel.find().sort('name');
    res.send(customers);
});

app.post('/', async(req, res) => {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(5).max(11).required(),
        isGold: Joi.boolean()
    });
    const result = schema.validate(req.body);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    let customers = new customerModel({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    });
    customers = await customers.save();
    res.send(customers);
});
app.get('/:id', async(req, res) => {
    const customer = await customerModel.findById(req.params.id);
    if (!customer) {
        res.status(404).send("This id was not found");
    }
    res.send(customer);
});
app.put('/:id', async(req, res) => {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(5).max(11).required(),
        isGold: Joi.boolean()
    });
    const result = schema.validate(req.body);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    const customer = await customerModel.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    }, {
        new: true
    });
    if (!customer) {
        return res.status(404).send("This id was not found");
    }
    res.send(customer);
});
app.delete('/:id', async(req, res) => {
    const customer = await customerModel.findByIdAndRemove(req.params.id);
    if (!customer) return res.status(404).send('The customer with the given ID was not found.');
    res.send(customer);
});

module.exports = app;