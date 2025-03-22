'use strict';
/*const {DataTypes, Deferrable} = require('sequelize');
const sequelize = require("../../config/database");*/
import {DataTypes, Deferrable} from 'sequelize';
import sequelize from "../../config/database.js";

const message = sequelize.define('message',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT
      },
      dialogId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'dialogId can not be null'
          },
          notEmpty: {
            msg: 'dialogId can not be empty'
          }
        },
        references:{
          model: {
            tableName: 'dialog',
          },
          key: 'id',
          deferrable: Deferrable.INITIALLY_IMMEDIATE,
        }
      },
      text: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'text can not be null'
          },
          notEmpty: {
            msg: 'text can not be empty'
          },
          len: [1, 300],
        }
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'userId can not be null'
          },
          notEmpty: {
            msg: 'userId can not be empty'
          }
        },
        references:{
          model: {
            tableName: 'user',
          },
          key: 'id',
          deferrable: Deferrable.INITIALLY_IMMEDIATE,
        }
      },
      toUserId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'toUserId can not be null'
          },
          notEmpty: {
            msg: 'toUserId can not be empty'
          }
        },
        references:{
          model: {
            tableName: 'user',
          },
          key: 'id',
          deferrable: Deferrable.INITIALLY_IMMEDIATE,
        }
      },
      isRead: {
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
        type: DataTypes.DATE
      }
    }, {
      paranoid: true,
      freezeTableName: true,
      modelName: 'message'
    })

export default message;
//module.exports = message;
