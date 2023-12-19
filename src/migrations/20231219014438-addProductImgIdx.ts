import { QueryInterface } from "sequelize";

export = {
  up: async (queryInterface: QueryInterface, Sequelize: any) => {
    await queryInterface.addIndex("ProductImgs", ["imageId"]);
  },
  down: async (queryInterface: QueryInterface, Sequelize: any) => {
    await queryInterface.removeIndex("ProductImgs", ["imageId"]);
  },
};
