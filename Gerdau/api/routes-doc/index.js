const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Gerdau",
      version: "1.0.0",
      description: "REST API",
    },
    servers: [
      {
        url: "http://localhost:4000/api",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: ["bearerAuth"],
      },
    ],
  },
  apis: ["./routes-doc/*/*.js"],
};

module.exports = swaggerJSDoc(options);
