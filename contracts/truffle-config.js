require("ts-node").register({
  files: true,
});

module.exports = {
  build_directory: "build",
  contracts_directory: "contracts",
  migrations_directory: "migrations",
  test_directory: "test",
  networks: {
    development: {
     host: "127.0.0.1",
     port: 9545,
     network_id: "*"
    },
  },

  mocha: {
    useColors: true
  },

  compilers: {
    solc: {
      version: "0.8.5",
    }
  }
}