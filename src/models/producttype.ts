import { Sequelize, DataTypes, Model } from "sequelize";
import type { ProductTypeAttributes } from "../interfaces/productType";

export default class ProductType extends Model<ProductTypeAttributes, any> {
  public type!: string;
  public createdBy!: string;
  public UUID!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  public static associate(models: any) {
    ProductType.hasMany(models.Product, { foreignKey: "typeId" });
    ProductType.belongsTo(models.Admin, { foreignKey: "createdBy" });
  }

  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        type: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            notEmpty: {
              msg: "type is required",
            },
            notNull: {
              msg: "type is required",
            },
          },
        },
        createdBy: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: {
              tableName: "Admins",
            },
            key: "UUID",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
        UUID: {
          type: DataTypes.UUID,
          primaryKey: true,
          allowNull: false,
          unique: true,
        },
        createdAt: {
          allowNull: false,
          type: DataTypes.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: DataTypes.DATE,
        },
      },
      {
        sequelize,
        modelName: "ProductTypes",
      }
    );
  }
}
