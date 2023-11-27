module.exports = {
  apps: [
    {
      name: "ecommerce-pangan",
      script: "./build/bin/www.js",
      instances: 1,
      autoRestart: true,
    },
  ],
};
