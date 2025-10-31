import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Reservas Grupo AX",   
      version: "1.0.0",
      description: "Documentación oficial de la API del Proyecto Integrador Grupo AX.",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local de desarrollo",
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
    security: [{ bearerAuth: [] }],
  },

  // Documentaremos todas las rutas dentro de /src/v1/rutas/
  apis: ["./src/v1/rutas/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
export { swaggerUi };

