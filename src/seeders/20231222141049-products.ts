import { QueryInterface } from "sequelize";
import { readFileSync } from "fs";
import { ProductAttributes } from "../interfaces/product";
import { v4 } from "uuid";

export = {
  up(queryInterface: QueryInterface, Sequelize: any) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    return queryInterface.bulkInsert(
      "Products",
      (JSON.parse(
        readFileSync("./data/product_seeder.json", "utf-8")
      ) as ProductAttributes[]).map((el) => ({
        ...el,
        UUID: v4(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    );
  },

  down(queryInterface: QueryInterface, Sequelize: any) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete("Products", {}, {});
  },
};
