// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import mongoose from 'mongoose';
// import userRouter from './routes/userRoutes.js';
// import productRouter from './routes/productRoutes.js';

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { productRouter } = require('./routes/productRoutes.js');
const { userRouter } = require('./routes/userRoutes.js');
const dotenv = require('dotenv');
// dotenv
dotenv.config();
mongoose.set('strictQuery', true);
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('connected to db'))
  .catch((err) => console.log(err));

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use(cors());
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);

// port
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server at http://localhost:${port}`);
});
