const swaggerJSDoc = require("swagger-jsdoc");
const json = require("./swagger.util");

const cfg = require("../../cf");
// Inicio - Configuraciones pertinentes a SwaggerJSDoc

const swaggerDefinition = {
  info: {
    // Información de API (requerida)
    title: "API - 2020_mp_backend-MpVirtual-seguridad", // Título (requerido)
    version: "1.0.0", // Versión (requerida)
    description: "Documentación de API - 2020_mp_backend-MpVirtual-seguridad" // Descripción (Opcional)
  },
  host: cfg.host + `:` + cfg.swaggerPort, // Host (Opcional)
  basePath: cfg.basePath, // Base path (Opcional)
  schemes: ["http", "https"]
};

// Opciones de Swagger
const options = {
  // Importando swaggerDefinitions
  swaggerDefinition,
  // Path de los lugares donde serán documentadas las API (routes)
  // Tenga en cuenta que esta ruta es relativa al directorio actual desde el que se ejecuta Node.js, no la aplicación en sí.
  apis: [
    "./routes/*.js",
    "./swagger/definitions/*.definitions.yaml",
    "./swagger/parameters/*.parameters.yaml"
  ]
};

// Inicializar swagger-jsdoc -> Devuelve especificaciones de swagger validadas en formato json
const swaggerSpec = swaggerJSDoc(options);

// Fin - Configuraciones pertinentes a SwaggerJSDoc
function init() {
  json.saveJSON(JSON.stringify(swaggerSpec));
}
module.exports.init = init;
