/*const express = require('express');
require('dotenv').config({path: `${process.cwd()}/.env`});
const setAppToRoutes = require('./routes/routes');
const cors= require('cors');
const AppError = require("./utils/appError");
const catchAsyncErrorHandler = require('./utils/catchAsync');
const globalErrorHandler = require("./controllers/errorController");*/
import express from 'express';
import 'dotenv/config';
import setAppToRoutes from './routes/routes.js';
import cors from 'cors';
import AppError from "./utils/appError.js";
import catchAsyncErrorHandler from './utils/catchAsync.js';
import globalErrorHandler from "./controllers/errorController.js";
const app = express();

app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL
}));
setAppToRoutes(app);

app.use('*', async (req, res, next)=>{
    console.log('HERE')
    catchAsyncErrorHandler(async (req, res, next) => {
        throw new AppError(`Can't find ${req.originalUrl} on this server`, 404)
    })
});
app.use(globalErrorHandler);

const PORT = process.env.APP_PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
