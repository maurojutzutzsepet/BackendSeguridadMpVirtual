var express = require("express");
var OAUTH = require("../controllers/oauth.client");
var SSO = require("../controllers/validSSO.client");
var CATALOGS = require("../controllers/mpcatalogs.controller");
var FISCALIAS = require("../controllers/fiscalia.controllers")

var app = express.Router();
var swaggerUi = require("swagger-ui-express"),
   swaggerDocument = require("../swagger/swagger.json");
/**
 * @swagger
 * tags:
 *   - name: Agencia
 *     description: Create, Read, Update and Delete of Agencias
 */

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/", function (req, res, next) {
   res.redirect("/api-docs");
});


app.post("/api/fiscalias", FISCALIAS.getFiscalias);


app.post("/api/listado",  FISCALIAS.getFiscalias)

/**
 * @swagger
 * /validate/request:
 *   get:
 *     summary: "Validar si una acción tiene permisos en el SSO"
 *     description: Se valida si el tag de una acción existe en el SSO, y si esté tiene permisos.
 *     tags: [validate]
 *     security:
 *         - Bearer: []
 *     parameters:
 *         - $ref: "#/parameters/systemHeader"     
 *         - $ref: "#/parameters/cuiHeader"     
 *         - $ref: "#/parameters/rolHeader"     
 *         - $ref: "#/parameters/actionHeader"     
 *         - $ref: "#/parameters/envHeader"     
 *     responses:
 *       200:
 *         description: Ok
 *       401:
 *         description: No autorizado.
 *       400:
 *         description: Error en la validación o Error en los Headers.
 */
app.get("/validate/request", OAUTH.verify, SSO.verifyCheck);

/**
 * @swagger
 * /user/oauth/login:
 *   post:
 *     summary: "Verifica si las credenciales de un usuario son correctas"
 *     description: Generación de token de sesión para un usuario cuyas credenciales son correctas
 *     tags: [user]
 *     parameters:
 *         - $ref: "#/parameters/bodyLogin"
 *     responses:
 *       200:
 *         description: Ok
 *       203:
 *         description: No autorizado.
 *       400:
 *         description: Error en la validación o Error en los Headers.
 */
app.post("/user/oauth/login", OAUTH.loginOauth);

/**
 * @swagger
 * /user/oauth/refresh/{refreshToken}:
 *   get:
 *     summary: "Obtener un nuevo token de acceso utilizando un token para refrescar"
 *     description: Verifica si el token para refrescar el token de acceso es correcto y genera uno nuevo
 *     tags: [user]
 *     parameters:
 *         - $ref: "#/parameters/refreshToken"
 *     responses:
 *       200:
 *         description: Ok
 *       203:
 *         description: No autorizado.
 *       400:
 *         description: Error en la validación o Error en los Headers.
 */
app.get("/user/oauth/refresh/:refreshToken", OAUTH.refreshTokenOauth);

/**
 * @swagger
 * /credentials/restore/pass/cuimail:
 *   post:
 *     summary: "Envia un correo con una contraseña de usuario temporal"
 *     description: Restablece la contraseña de usuario y genera una temporal, la cual se envia al email del usuario
 *     tags: [credentials]  
 *     parameters:
 *         - $ref: "#/parameters/dpiUserBody"    
 *     responses:
 *       200:
 *         description: Ok
 *       401:
 *         description: No autorizado.
 *       400:
 *         description: Error en la validación o Error en los Headers.
 */
app.post("/credentials/restore/pass/cuimail", SSO.sendTemporalPassword);

/**
 * @swagger
 * /credentials/change/pass/{cui}:
 *   post:
 *     summary: "Cambia la contraseña de un usuario luego de que la ha restablecido via correo"
 *     description: Cambia la contraseña de un usuario luego de que se le envio un correo para cambiar sus credenciales de acceso
 *     tags: [credentials]  
 *     parameters:
 *         - $ref: "#/parameters/cuiParams"
 *         - $ref: "#/parameters/dpiChangeTemporalPasswordUserBody"
 *     responses:
 *       200:
 *         description: Ok
 *       401:
 *         description: No autorizado.
 *       400:
 *         description: Error en la validación o Error en los Headers.
 */
app.post("/credentials/change/pass/:cui", SSO.changeUserPasswordAfterReset);

/**
 * @swagger
 * /credentials/change/pass/{cui}:
 *   put:
 *     summary: "Cambia la contraseña de un usuario"
 *     description: Cambia la contraseña de un usuario con nuevas credenciales
 *     tags: [credentials]
 *     parameters:
 *         - $ref: "#/parameters/cuiParams"
 *         - $ref: "#/parameters/dpiChangePasswordUserBody"
 *     responses:
 *       200:
 *         description: Ok
 *       401:
 *         description: No autorizado.
 *       400:
 *         description: Error en la validación o Error en los Headers.
 */
app.put("/credentials/change/pass/:cui", SSO.changeUserPassword);

/**
 * @swagger
 * /mpcatalogs:
 *   get:
 *     summary: "Obtener todos los catalogos disponibles en el sistema"
 *     description: Obtiene todos los catalogos disponibles en el sistema y los retorna en un objeto
 *     tags: [mpcatalogs]  
 *     security:
 *         - Bearer: []
 *     parameters: 
 *         - $ref: "#/parameters/systemHeader" 
 *     responses:
 *       200:
 *         description: Ok
 *       401:
 *         description: No autorizado.
 *       400:
 *         description: Error en la validación o Error en los Headers.
 */
app.get("/mpcatalogs", /*OAUTH.verify,*/ CATALOGS.getAll);

/**
 * @swagger
 * /mpcatalogs/{id}:
 *   get:
 *     summary: "Obtener todos los catalogos disponibles en el sistema en base a un id de catalogo"
 *     description: Obtiene todos los catalogos disponibles en el sistema en base a un id de catalogo y los retorna en un objeto
 *     tags: [mpcatalogs]  
 *     security:
 *         - Bearer: []
 *     parameters:
 *        - $ref: "#/parameters/idMPCatalogParams"
 *        - $ref: "#/parameters/systemHeader" 
 *     responses:
 *       200:
 *         description: Ok
 *       401:
 *         description: No autorizado.
 *       400:
 *         description: Error en la validación o Error en los Headers.
 */
app.get("/mpcatalogs/:id", OAUTH.verify, CATALOGS.getById);


module.exports = app;