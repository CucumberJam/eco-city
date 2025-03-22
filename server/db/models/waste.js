'use strict';
import {DataTypes} from 'sequelize';
import sequelize from "../../config/database.js";
import wasteType from "./wastetype.js";


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
        type: DataTypes.DATE
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

export default waste;