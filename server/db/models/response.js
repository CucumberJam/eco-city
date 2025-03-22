'use strict';
import {Deferrable, DataTypes} from 'sequelize';
import sequelize from "../../config/database.js";

const response = sequelize.define('response',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT
      },
      advertId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'advertId can not be null'
          },
          notEmpty: {
            msg: 'advertId can not be empty'
          }
        },
        references:{
          model: {
            tableName: 'advert',
          },
          key: 'id',
          deferrable: Deferrable.INITIALLY_IMMEDIATE,
        }
      },
      status: {
        type: DataTypes.ENUM('На рассмотрении', 'Отклонено', 'Принято', 'Исполнено', 'Aрхив'),
        allowNull: false,
        defaultValue: 'На рассмотрении',
        validate: {
          notNull: {
            msg: 'status can not be null'
          },
          notEmpty: {
            msg: 'status can not be empty'
          }
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
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'user name can not be null'
          },
          notEmpty: {
            msg: 'user name can not be empty'
          },
        },
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
      longitude: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      latitude: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      userRole: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'user role can not be null'
          },
          notEmpty: {
            msg: 'user role can not be empty'
          }
        },
        references:{
          model: {
            tableName: 'role',
          },
          key: 'name',
          deferrable: Deferrable.INITIALLY_IMMEDIATE,
        }
      },
      price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'price can not be null'
          },
          notEmpty: {
            msg: 'price can not be empty'
          },
          min: 0.0
        }
      },
      totalPrice: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'totalPrice can not be null'
          },
          notEmpty: {
            msg: 'totalPrice can not be empty'
          },
          min: 0.0
        }
      },
      comment:{
        type: DataTypes.STRING,
        allowNull: true
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
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
      modelName: 'response'
    }
)
export default response;

