import { QueryInterface } from "sequelize";

export = {
  up(queryInterface: QueryInterface, Sequelize: any) {
    return queryInterface.createTable("Tokens", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      access_token: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      as: {
        type: Sequelize.ENUM,
        values: ["User", "Admin"],
        allowNull: false,
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
      adminId: {
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
    return queryInterface.dropTable("Tokens");
  },
};
