import { QueryInterface } from "sequelize";

export = {
  async up(queryInterface: QueryInterface, Sequelize: any) {
    await queryInterface.createTable("Carts", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      productId: {
        type: Sequelize.UUID,
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
  async down(queryInterface: QueryInterface, Sequelize: any) {
    await queryInterface.dropTable("Carts");
  },
};
