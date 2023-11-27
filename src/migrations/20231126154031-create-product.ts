import { QueryInterface } from "sequelize";

export = {
  up(queryInterface: QueryInterface, Sequelize: any) {
    return queryInterface.createTable("Products", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      desc: {
        type: Sequelize.STRING,
        defaultValue: "",
      },
      stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "stock is required",
          },
          notNull: {
            msg: "stock is required",
          },
        },
      },
      status: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: ["available", "not available", "preorder"],
        defaultValue: "available",
      },
      imageUrl: {
        type: Sequelize.STRING,
      },
      imageId: {
        type: Sequelize.STRING,
      },
      createdBy: {
        type: Sequelize.UUID,
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
    return queryInterface.dropTable("Products");
  },
};
