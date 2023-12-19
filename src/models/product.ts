import { Sequelize, DataTypes, Model } from "sequelize";
import type { ProductAttributes } from "../interfaces/product";

export default class Product extends Model<ProductAttributes, any> {
  public name!: string;
  public price!: number;
  public desc!: string;
  public stock!: number;
  public status!: "available" | "not available" | "preorder";
  public createdBy!: string;
  public typeId!: string;
  public readonly UUID!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  public static associate(models: any) {
    Product.belongsTo(models.Admin, { foreignKey: "createdBy" });
    Product.belongsTo(models.ProductType, { foreignKey: "typeId" });
    Product.hasMany(models.ProductImg, { foreignKey: "productId" });
    Product.hasMany(models.Cart, { foreignKey: "productId" });
    Product.hasOne(models.Carousel, { foreignKey: "productId" });
  }

  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            notEmpty: {
              msg: "name is required",
            },
            notNull: {
              msg: "name is required",
            },
          },
        },
        price: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            notEmpty: {
              msg: "price is required",
            },
            notNull: {
              msg: "price is required",
            },
          },
        },
        desc: {
          type: DataTypes.STRING,
          defaultValue: "",
        },
        stock: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            notEmpty: {
              msg: "stock is required",
            },
            notNull: {
              msg: "stock is required",
            },
          },
        },
        status: {
          type: DataTypes.ENUM,
          values: ["available", "not available", "preorder"],
          defaultValue: "available",
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
        typeId: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: {
              tableName: "ProductTypes",
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
        modelName: "Products",
      }
    );
  }
}
