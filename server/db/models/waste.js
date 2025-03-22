'use strict';
/*
const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require("../../config/database");
const wasteType = require("../../db/models/wasteType");
*/
import {Sequelize, DataTypes} from 'sequelize';
import sequelize from "../../config/database.js";
import wasteType from "../../db/models/wastetype.js";


const waste = sequelize.define('waste',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'waste name can not be null'
          },
          notEmpty: {
            msg: 'waste name can not be empty'
          },
        }
      },
      hasTypes: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    }, {
      paranoid: true,
      freezeTableName: true,
      modelName: 'waste'
    }
);

//advert:
waste.hasMany(wasteType, {
  foreignKey: 'typeId'
});
wasteType.belongsTo(waste, {
  foreignKey: 'typeId'
});
/*
module.exports = waste;*/

export default waste;