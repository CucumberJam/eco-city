'use strict';
/*const {Deferrable, DataTypes} = require('sequelize');
const sequelize = require("../../config/database");
const AppError = require("../../utils/appError");
const response = require("../../db/models/response");*/

import {Deferrable, DataTypes} from 'sequelize';
import sequelize from "../../config/database.js";
import response from "../../db/models/response.js";

const advert = sequelize.define('advert',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT
      },
      status: {
        type: DataTypes.ENUM('На рассмотрении', 'Отклонено', 'Принято', 'Исполнено'),
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
      cityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'city advert can not be null'
          },
          notEmpty: {
            msg: 'city advert can not be empty'
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
      waste: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'waste can not be null'
          },
          notEmpty: {
            msg: 'waste can not be empty'
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
      wasteType: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: 'wasteType',
          },
          key: 'id',
          deferrable: Deferrable.INITIALLY_IMMEDIATE,
        }
      },
      dimension: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'dimension can not be null'
          },
          notEmpty: {
            msg: 'dimension can not be empty'
          }
        },
        references:{
          model: {
            tableName: 'dimension',
          },
          key: 'id',
          deferrable: Deferrable.INITIALLY_IMMEDIATE,
        }
      },
      amount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'amount can not be null'
          },
          notEmpty: {
            msg: 'amount can not be empty'
          },
          min: 1.0
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
      isPickedUp: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      photos: {
        type: DataTypes.ARRAY({
          type: DataTypes.STRING,
        }),
        allowNull: true,
      },
      comment:{
        type: DataTypes.STRING,
        allowNull: true
      },
      finishDate:{
        type: DataTypes.DATE,
        allowNull: false,
/*        set(value){
          if(value > new Date()){
            this.setDataValue('finishDate', value);
          }else{
            throw new AppError('Finish date of accepting response to advert must be greater than today', 400)
          }
        },*/
        validate: {
          notNull: {
            msg: 'finishDate can not be null'
          },
          notEmpty: {
            msg: 'finishDate can not be empty'
          },
        }
      },
      priceWithDelivery:{
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
      deletedAt:{
        type: DataTypes.DATE
      }
    },
    {
      paranoid: true,
      freezeTableName: true,
      modelName: 'advert'
    }
);

advert.hasMany(response, {
  foreignKey: 'advertId'
});
response.belongsTo(advert, {
  foreignKey: 'advertId'
});
export default advert;
//module.exports = advert;