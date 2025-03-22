/*const {Sequelize} = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('./config');*/

import {Sequelize} from 'sequelize';
const env = process.env.NODE_ENV || 'development';
import config from './config.js';

const sequelize = new Sequelize(config[env]);

export default sequelize;
//module.exports = sequelize;