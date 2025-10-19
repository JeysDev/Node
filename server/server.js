///common js

// const express =require('express');
// const cors = require('cors');
// const helmet = require('helmet');
// require ('dotenv').config();

//ES MODULE
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

//middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// api routes
app.get('/', (req,res)=>{
    res.send(`<h1>BAIND IS RANING IN PURT: ${port}</h1>`)
});
const employees=[
    {name: 'Jeys'},
    {name:'Jm'},
    {name: 'Ray'},
    {name: 'Yen'},
    {name: 'Jham'},
]
app.get('/employees', (req, res) =>{
    // res.json(employees) // pag data
    res.send(employees)
})
//Common js
// const api = require('./routes/api') //inimport yung inexport mula sa api
//es module
import api from './routes/api.js';
app.use('/api',api); // app.use dapat kasi gagamitin yung api js


//server
app.listen(port, () =>{
    console.log('Server running on port: ', port);
});