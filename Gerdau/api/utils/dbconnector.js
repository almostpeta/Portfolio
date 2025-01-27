import { Request, TYPES, Connection } from "tedious";

export function connect(executeStatement) {
  var config = {
    server: `${process.env.SERVER}`, //update me
    authentication: {
      type: "default",
      options: {
        username: `${process.env.USER}`, //update me
        password: `${process.env.PASSWORD}`, //update me
      },
    },
    options: {
      // If you are on Microsoft Azure, you need encryption:
      encrypt: false,
      database: `${process.env.DATABASE}`, //update me
    },
  };
  const connection = new Connection(config);
  connection.on("connect", function (err) {
    // If no error, then good to proceed.
    console.log("Connected");
    executeStatement(connection);
  });
}
