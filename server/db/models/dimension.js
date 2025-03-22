'use strict';
import {DataTypes} from 'sequelize';
import sequelize from "../../config/database.js";

const dimension = sequelize.define('dimension',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: {
            msg: 'full name of dimension can not be null'
          },
          notEmpty: {
            msg: 'full name of dimension not be empty'
          },
        },
      },
      shortName: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      deletedAt:{
        type: DataTypes.DATE
      }
    },
    {
      paranoid: true,
      freezeTableName: true,
      modelName: 'dimension'
    }
)
export default dimension;
//module.exports = dimension;