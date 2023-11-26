import { Sequelize, DataTypes, Model } from "sequelize";
import { HookReturn } from "sequelize/types/hooks";
import { hash } from "../helpers/encryption";
import type { AdminAttributes } from "../interfaces/admin";

export default class Admin extends Model<AdminAttributes, any> {
  public name!: string;
  public UUID!: string;
  public email!: string;
  public password!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  public static associate(models: any) {
    Admin.hasOne(models.Token, { foreignKey: "adminId" });
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
        modelName: "Admins",
        hooks: {
          beforeCreate: (admin, options): HookReturn => {
            admin.password = hash(admin.password);
          },
        },
      }
    );
  }
}
