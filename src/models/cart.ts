import { Sequelize, DataTypes, Model } from "sequelize";
import type { CartAttributes } from "../interfaces/cart";

export default class Cart extends Model<CartAttributes, any> {
  public productId!: string;
  public userId!: string;
  public readonly UUID!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  public static associate(models: any) {
    Cart.belongsTo(models.Product, { foreignKey: "productId" });
    Cart.belongsTo(models.User, { foreignKey: "userId" });
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
        userId: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: {
              tableName: "Users",
            },
            key: "UUID",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
        UUID: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
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
      { sequelize, modelName: "Carts" }
    );
  }
}
