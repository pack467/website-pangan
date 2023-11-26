import { Sequelize, DataTypes, Model } from "sequelize";
import { HookReturn } from "sequelize/types/hooks";

export default class Token extends Model<any, any> {
  public access_token!: string;
  public as!: "User" | "Admin";
  public userId!: string;
  public adminId!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  public static associate(models: any) {
    Token.belongsTo(models.User, { foreignKey: "userId" });
    Token.belongsTo(models.Admin, { foreignKey: "adminId" });
  }

  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        access_token: {
          allowNull: false,
          type: DataTypes.STRING,
          validate: {
            notEmpty: {
              msg: "access_token is required",
            },
            notNull: {
              msg: "access_token is required",
            },
          },
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
        adminId: {
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
        as: {
          type: DataTypes.ENUM,
          allowNull: false,
          values: ["User", "Admin"],
          validate: {
            notEmpty: {
              msg: "'as' is required",
            },
            notNull: {
              msg: "'as' is required",
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
      { sequelize, modelName: "Tokens" }
    );
  }
}
