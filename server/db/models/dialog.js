'use strict';
import {DataTypes, Deferrable} from 'sequelize';
import sequelize from "../../config/database.js";
import message from "./message.js";


const dialog  = sequelize.define('dialog',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT
      },
      firstUserId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'firstUserId can not be null'
          },
          notEmpty: {
            msg: 'firstUserId can not be empty'
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
      secondUserId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'secondUserId can not be null'
          },
          notEmpty: {
            msg: 'secondUserId can not be empty'
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
      modelName: 'dialog'
    }
);
dialog.hasMany(message, {
  foreignKey: 'dialogId'
});
message.belongsTo(dialog, {
  foreignKey: 'dialogId'
});

export default dialog;
//module.exports = dialog;