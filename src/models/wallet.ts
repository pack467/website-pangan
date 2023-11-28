import { Sequelize, DataTypes, Model } from "sequelize";
import type { WalletAttributes } from "../interfaces/wallet";

export default class Wallet extends Model<WalletAttributes, any> {
  public userId!: string;
  public balance!: number;
  public readonly UUID!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  public static associate(models: any) {
    Wallet.belongsTo(models.User, { foreignKey: "userId" });
  }

  public static initialize(sequelize: Sequelize) {
    this.init(
      {
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
        balance: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
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
      { sequelize, modelName: "Wallets" }
    );
  }
}
