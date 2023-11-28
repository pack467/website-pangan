import { Sequelize, DataTypes, Model } from "sequelize";
import type { TransactionAttributes } from "../interfaces/transaction";

export default class Transaction extends Model<TransactionAttributes, any> {
  public userId!: string;
  public type!: "Top up" | "Payment";
  public status!:
    | "Pending"
    | "Success"
    | "Cancel"
    | "Refund"
    | "Failed"
    | "Expired"
    | "Deny"
    | "Settlement"
    | "Disbursement";
  public amount!: number;
  public readonly UUID!: string;
  public readonly signature!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  public static associate(models: any) {
    Transaction.belongsTo(models.User, { foreignKey: "userId" });
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
        type: {
          type: DataTypes.ENUM,
          values: ["Top up", "Payment"],
          allowNull: false,
          validate: {
            notEmpty: {
              msg: "type is required",
            },
            notNull: {
              msg: "type is required",
            },
          },
        },
        status: {
          type: DataTypes.ENUM,
          values: [
            "Pending",
            "Success",
            "Cancel",
            "Refund",
            "Failed",
            "Expired",
            "Deny",
            "Settlement",
            "Disbursement",
          ],
          defaultValue: "Pending",
        },
        amount: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            notEmpty: {
              msg: "amount is required",
            },
            notNull: {
              msg: "amount is required",
            },
          },
        },
        signature: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: {
              msg: "signature is required",
            },
            notNull: {
              msg: "signature is required",
            },
          },
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
      { sequelize, modelName: "Transactions" }
    );
  }
}
