const express = require('express');
require('dotenv').config({path: `${process.cwd()}/.env`}); //import 'dotenv/config'
const setAppToRoutes = require('./routes/routes');
const cors= require('cors');
const AppError = require("./utils/appError");
const catchAsyncErrorHandler = require('./utils/catchAsync');
const globalErrorHandler = require("./controllers/errorController");

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000'
}));
setAppToRoutes(app);

// errors:
app.use('*', catchAsyncErrorHandler(async (req, res, next) => {
        throw new AppError(`Can't find ${req.originalUrl} on this server`, 404)
}));
app.use(globalErrorHandler);


// total:
const PORT = process.env.APP_PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
