import { Sequelize, DataTypes, Model } from "sequelize";
import type { CarouselAttributes } from "../interfaces/carousel";

export default class Carousel extends Model<CarouselAttributes, any> {
  public productId!: string;
  public imageId!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  public static associate(models: any) {
    Carousel.belongsTo(models.Product, { foreignKey: "productId" });
    Carousel.belongsTo(models.ProductImg, { foreignKey: "imageId" });
  }

  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        productId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: {
              tableName: "Products",
            },
            key: "UUID",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
          validate: {
            notNull: { msg: "productId is required" },
            notEmpty: { msg: "productId is required" },
          },
        },
        imageId: {
          type: DataTypes.STRING,
          allowNull: false,
          references: {
            model: {
              tableName: "ProductImgs",
            },
            key: "imageId",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
          validate: {
            notNull: { msg: "imageId is required" },
            notEmpty: { msg: "imageId is required" },
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
        modelName: "Carousels",
      }
    );
  }
}
