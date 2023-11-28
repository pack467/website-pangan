import { QueryInterface } from "sequelize";

export = {
  async up(queryInterface: QueryInterface, Sequelize: any) {
    await queryInterface.createTable("ProductImgs", {
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
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "imageUrl is required",
          },
          notNull: {
            msg: "imageUrl is required",
          },
        },
      },
      imageId: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "imageId is required",
          },
          notNull: {
            msg: "imageId is required",
          },
        },
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
    await queryInterface.dropTable("ProductImgs");
  },
};
