const city = require('../db/models/city');
const catchAsyncErrorHandler = require('../utils/catchAsync');
const AppError = require("../utils/appError");
const {removeCreatedFields} = require("./authController");

const getCities = catchAsyncErrorHandler(async (req, res, next) => {
    const cities = await city.findAll({
        attributes: {exclude: ['createdAt', 'updatedAt', 'deletedAt']},
    });
    if(!cities) return next(new AppError('Failed to get cities', 400));
    return res.status(200).json({
        status: 'success',
        data: cities
    });
});
const createCity = catchAsyncErrorHandler(async(req, res, next)=>{
    const { name, region, engName, engRegion, latitude, longitude } = req.body;
    const newCity = await city.create({name, region, engName, engRegion, latitude, longitude});
    if(!newCity) return next(new AppError('Failed to create the city', 400));
    const result = removeCreatedFields(newCity);

    return res.status(201).json({
        status: 'success',
        data: result
    })
});


/*const updateCity = async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    try {
        const result = await pool.query('UPDATE cities SET name = $1 WHERE id = $2 RETURNING *', [name, id]);
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteCity = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM cities WHERE id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};*/

module.exports = {getCities, createCity};