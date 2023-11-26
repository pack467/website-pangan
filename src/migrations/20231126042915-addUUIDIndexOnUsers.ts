import { QueryInterface } from "sequelize";

export = {
  up: async (queryInterface: QueryInterface, Sequelize: any) => {
    await queryInterface.addIndex("Users", ["UUID"]);
  },
  down: async (queryInterface: QueryInterface, Sequelize: any) => {
    await queryInterface.removeIndex("Users", ["UUID"]);
  },
};
