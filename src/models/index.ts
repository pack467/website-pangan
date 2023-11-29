"use strict";

import { Options, Sequelize } from "sequelize";
import User from "./users";
import Admin from "./admin";
import Token from "./token";
import Product from "./product";
import ProductType from "./producttype";
import ProductImg from "./productimg";
import Cart from "./cart";
import Wallet from "./wallet";
import Transaction from "./transaction";

const config = require("../../config/config.json");
require("dotenv/config");

const production: string = process.env[config.use_env_variable] as string;
let sequelize: Sequelize;

if (process.env.NODE_ENV === "test") {
  sequelize = new Sequelize(
    config.test.database,
    config.test.username,
    config.test.password,
    {
      ...(<Options>config.test),
      dialectOptions: {
        connectTimeout: 60000,
      },
    }
  );
} else if (
  process.env.NODE_ENV === "production" ||
  process.env[config.use_env_variable]
) {
  sequelize = new Sequelize(production, {
    ...(<Options>config.production),
    dialectOptions: {
      connectTimeout: 60000,
    },
  });
} else {
  sequelize = new Sequelize(
    config.development.database,
    config.development.username,
    config.development.password,
    {
      ...(<Options>config.development),
      dialectOptions: {
        connectTimeout: 60000,
      },
    }
  );
}

const model = [
  User,
  Admin,
  Token,
  Product,
  ProductType,
  ProductImg,
  Cart,
  Wallet,
  Transaction,
];

model.forEach((el) => {
  el.initialize(sequelize);
});

model.forEach((el) => {
  el.associate({
    User,
    Admin,
    Token,
    Product,
    ProductType,
    ProductImg,
    Cart,
    Wallet,
    Transaction,
  });
});

export {
  sequelize as Db,
  User,
  Admin,
  Token,
  Product,
  ProductType,
  ProductImg,
  Cart,
  Wallet,
  Transaction,
};
