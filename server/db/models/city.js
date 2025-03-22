'use strict';
import {DataTypes} from 'sequelize';
import sequelize from "../../config/database.js";

const city = sequelize.define('city',
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
            msg: 'city name can not be null'
          },
          notEmpty: {
            msg: 'city name can not be empty'
          },
        }
        },
        engName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notNull: {
                    msg: 'city name can not be null'
                },
                notEmpty: {
                    msg: 'city name can not be empty'
                },
            }
        },
        region: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'city region can not be null'
          },
          notEmpty: {
            msg: 'city region can not be empty'
          },
        }
        },
        engRegion: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'city region can not be null'
                },
                notEmpty: {
                    msg: 'city region can not be empty'
                },
            }
        },
        latitude: {
            type: DataTypes.DECIMAL,
            allowNull: true,
        },
        longitude: {
            type: DataTypes.DECIMAL,
            allowNull: true,
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
      modelName: 'city'
    })
export default city;
//module.exports = city;