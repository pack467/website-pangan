import { QueryInterface } from "sequelize";

export = {
  up(queryInterface: QueryInterface, Sequelize: any) {
    return queryInterface.createTable("Transactions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.UUID,
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
        type: Sequelize.ENUM,
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
        type: Sequelize.ENUM,
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
        type: Sequelize.INTEGER,
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
        type: Sequelize.STRING,
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
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down(queryInterface: QueryInterface, Sequelize: any) {
    return queryInterface.dropTable("Transactions");
  },
};
