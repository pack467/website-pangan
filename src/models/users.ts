import { Sequelize, DataTypes, Model } from "sequelize";
import type { HookReturn } from "sequelize/types/hooks";
import { hash } from "../helpers/encryption";
import type { UserAttributes } from "../interfaces/user";

export default class User extends Model<UserAttributes, any> {
  public username!: string;
  public readonly UUID!: string;
  public email!: string;
  public password!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  public static associate(models: any) {
    User.hasOne(models.Token, { foreignKey: "userId" });
    User.hasMany(models.Cart, { foreignKey: "userId" });
  }

  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        username: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            notEmpty: {
              msg: "username is required",
            },
            notNull: {
              msg: "username is required",
            },
          },
        },
        UUID: {
          type: DataTypes.UUID,
          primaryKey: true,
          allowNull: false,
          unique: true,
        },
        email: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false,
          validate: {
            notEmpty: {
              msg: "email is required",
            },
            notNull: {
              msg: "email is required",
            },
            isEmail: {
              msg: "invalid email format",
            },
          },
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            len: {
              args: [8, 16],
              msg: "password minimum characters are 8",
            },
            notNull: {
              msg: "password is required",
            },
            notEmpty: {
              msg: "password is required",
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
        modelName: "Users",
        hooks: {
          beforeCreate: (user, options): HookReturn => {
            user.password = hash(user.password);
          },
        },
      }
    );
  }
}
