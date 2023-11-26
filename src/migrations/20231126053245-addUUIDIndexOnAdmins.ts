import { QueryInterface } from "sequelize";

export = {
  up: async (queryInterface: QueryInterface, Sequelize: any) => {
    await queryInterface.addIndex("Admins", ["UUID"]);
  },
  down: async (queryInterface: QueryInterface, Sequelize: any) => {
    await queryInterface.removeIndex("Admins", ["UUID"]);
  },
};
