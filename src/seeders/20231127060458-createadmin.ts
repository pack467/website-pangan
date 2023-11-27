import { QueryInterface } from "sequelize";
import { readFileSync } from "fs";
import { hash } from "../helpers/encryption";
import { v4 } from "uuid";

type AdminSeeder = {
  name: string;
  email: string;
  password: string;
};

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
      "Admins",
      (JSON.parse(
        readFileSync("./data/admin_seeder.json", "utf-8")
      ) as AdminSeeder[]).map((el) => ({
        ...el,
        password: hash(el.password),
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
    return queryInterface.bulkDelete("Admins", {}, {});
  },
};
