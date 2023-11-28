import { QueryInterface } from "sequelize";

module.exports = {
  up(queryInterface: QueryInterface, Sequelize: any) {
    return queryInterface.createTable("Wallets", {
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
      balance: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
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
    return queryInterface.dropTable("Wallets");
  },
};
