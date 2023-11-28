import { Sequelize, DataTypes, Model } from "sequelize";
import type { ProductImgAttributes } from "../interfaces/productImg";

export default class ProductImg extends Model<ProductImgAttributes, any> {
  public readonly productId!: string;
  public imageUrl!: string;
  public imageId!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  public static associate(models: any) {
    ProductImg.belongsTo(models.Product, { foreignKey: "productId" });
  }

  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        productId: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: {
              tableName: "Products",
            },
            key: "UUID",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
        imageUrl: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: {
              msg: "imageUrl is required",
            },
            notNull: {
              msg: "imageUrl is required",
            },
          },
        },
        imageId: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: {
              msg: "imageId is required",
            },
            notNull: {
              msg: "imageId is required",
            },
          },
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
        modelName: "ProductImgs",
      }
    );
  }
}
