'use strict';
/*const {Deferrable, DataTypes} = require('sequelize');
const sequelize = require("../../config/database");
const bcrypt = require('bcrypt');
const AppError = require("../../utils/appError");
const advert = require("../../db/models/advert");
const dialog = require("../../db/models/dialog");
const message = require("../../db/models/message");
const response = require("../../db/models/response");*/
import {Deferrable, DataTypes} from 'sequelize';
import sequelize from "../../config/database.js";
import bcrypt from 'bcrypt';
import AppError from "../../utils/appError.js";
import advert from "../../db/models/advert.js";
import dialog from "../../db/models/dialog.js";
import message from "../../db/models/message.js";
import response from "../../db/models/response.js";

const user = sequelize.define('user',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        validate: {
          notNull: {
            msg: 'user name can not be null'
          },
          notEmpty: {
            msg: 'user name can not be empty'
          },
          len: [5, 50],
        }
      },
      website: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        validate: {
          /*is: /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/,*/
          isUrl: {
            msg: 'Ivalid url for website'
          }
        }
      },
      ogrn: {
        type: DataTypes.BIGINT,
        unique: true,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'user ogrn can not be null'
          },
          notEmpty: {
            msg: 'user ogrn can not be empty'
          },
          isNumeric: true,
        }
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        references:{
          model: {
            tableName: 'role',
          },
          key: 'name',
          deferrable: Deferrable.INITIALLY_IMMEDIATE,
        },
        validate: {
          notNull: {
            msg: 'user role can not be null'
          },
          notEmpty: {
            msg: 'user role can not be empty'
          }
        }
      },
      cityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'user city can not be null'
          },
          notEmpty: {
            msg: 'user city can not be empty'
          }
        },
        references:{
          model: {
            tableName: 'city',
          },
          key: 'id',
          deferrable: Deferrable.INITIALLY_IMMEDIATE,
        }
      },
      wastes: {
        type: DataTypes.ARRAY({
          type: DataTypes.INTEGER,
          references:{
            model: {
              tableName: 'waste',
            },
            key: 'id',
            deferrable: Deferrable.INITIALLY_IMMEDIATE,
          }
        }),
        allowNull: true,
      },
      wasteTypes: {
        type: DataTypes.ARRAY({
          type: DataTypes.INTEGER,
          references:{
            model: {
              tableName: 'wasteType',
            },
            key: 'id',
            deferrable: Deferrable.INITIALLY_IMMEDIATE,
          }
        }),
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'user address can not be null'
          },
          notEmpty: {
            msg: 'user address can not be empty'
          }
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
      workingHourStart: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      workingHourEnd: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      workingDays: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true,
      },
      phone: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: true,
        validate: {
          notNull: {
            msg: 'user phone can not be null'
          },
          notEmpty: {
            msg: 'user phone can not be empty'
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: {
            msg: 'user email can not be null'
          },
          notEmpty: {
            msg: 'user email can not be empty'
          },
          isEmail: {
            mag: 'invalid email'
          }
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'user password can not be null'
          },
          notEmpty: {
            msg: 'user password can not be empty'
          },
        }
      },
      confirmPassword:{
        type: DataTypes.VIRTUAL,
        set(value){
          if(this.password.length < 6){
            throw new AppError('Password length must be at least 6 length', 400)
          }
          if(value === this.password){
            const hashPassword = bcrypt.hashSync(value, 10);
            this.setDataValue('password', hashPassword);
          }else{
            throw new AppError('Password and confirm-password must be the same', 400)
          }
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
      deletedAt:{
        type: DataTypes.DATE
      }
    },
    {
      paranoid: true,
      freezeTableName: true,
      modelName: 'user'
    }
);
//advert:
user.hasMany(advert, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});
advert.belongsTo(user, {
  foreignKey: 'userId'
});
//responses:
user.hasMany(response, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});
response.belongsTo(user, {
  foreignKey: 'userId'
});

// dialog:
user.hasMany(dialog, {
  foreignKey: 'firstUserId',
});
user.hasMany(dialog, {
  foreignKey: 'secondUserId',
});
dialog.belongsTo(user, {
  foreignKey: 'firstUserId',
});
dialog.belongsTo(user, {
  foreignKey: 'secondUserId',
});

// message:
user.hasMany(message, {
  foreignKey: 'userId'
});
user.hasMany(message, {
  foreignKey: 'toUserId'
});
message.belongsTo(user, {
  foreignKey: 'userId'
});
message.belongsTo(user, {
  foreignKey: 'toUserId'
});

/*
module.exports = user;*/
export default user