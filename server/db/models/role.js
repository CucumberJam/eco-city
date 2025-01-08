'use strict';
const {DataTypes} = require('sequelize');
const sequelize = require("../../config/database");

module.exports = sequelize.define('role',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: {
            msg: 'role can not be null'
          },
          notEmpty: {
            msg: 'role name can not be empty'
          },
        }
      },
      label: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
              notNull: {
                  msg: 'label can not be null'
              },
              notEmpty: {
                  msg: 'label name can not be empty'
              },
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
        type: DataTypes.DATE
      }
    }, {
      paranoid: true,
      freezeTableName: true,
      modelName: 'role'
    })
