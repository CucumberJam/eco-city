'use strict';
const {Sequelize, DataTypes, Deferrable} = require('sequelize');
const sequelize = require("../../config/database");

module.exports = sequelize.define('wasteType',
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
            msg: 'waste-type name can not be null'
          },
          notEmpty: {
            msg: 'waste-type name can not be empty'
          },
        }
      },
      typeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'type of waste can not be null'
          },
          notEmpty: {
            msg: 'type of waste can not be empty'
          },
        },
        references:{
          model: {
            tableName: 'waste',
          },
          key: 'id',
          deferrable: Deferrable.INITIALLY_IMMEDIATE,
        }
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
      modelName: 'wasteType'
    })
