/**
 * @swagger
 * /user/register:
 *  post:
 *    summary: Crea un usuario y notifica via email. No se crea contraseña en esta instancia. Solo para administradores
 *    tags: [Usuarios]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              firstName:
 *                type: string
 *                required: true
 *              lastName:
 *                type: string
 *                required: true
 *              email:
 *                type: string
 *                required: true
 *              role:
 *                type: string
 *                required: true
 *    responses:
 *      200:
 *        description: Retorna éxito en la operación
 *      300:
 *        description: Usuario duplicado por email
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 *
 * /user/getAll:
 *  get:
 *    summary: Retorna todos los usuarios
 *    tags: [Usuarios]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *    responses:
 *      200:
 *        description: Retorna información del usuario
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Usuario'
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 *
 * /user/update/{id}:
 *  put:
 *    summary: Actualiza datos del usuario. Solo para administradores
 *    tags: [Usuarios]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              firstName:
 *                type: string
 *              lastName:
 *                type: string
 *              email:
 *                type: string
 *              role:
 *                type: string
 *    responses:
 *      200:
 *        description: Retorna información del usuario
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Usuario'
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 *
 * /user/disableUser:
 *  post:
 *    summary: Modifica el flag isActive del usuario. Accesible sólo para administradores
 *    tags: [Usuarios]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              userId:
 *                type: integer
 *                required: true
 *    responses:
 *      200:
 *        description: Retorna el éxito de la operación
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 *
 * /user/enableUser:
 *  post:
 *    summary: Modifica el flag isActive del usuario. Accesible sólo para administradores
 *    tags: [Usuarios]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              userId:
 *                type: integer
 *                required: true
 *    responses:
 *      200:
 *        description: Retorna el éxito de la operación
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 *
 * /user/login:
 *  post:
 *    summary: Autentica al usuario
 *    tags: [Usuarios]
 *    security:
 *      bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                required: true
 *              password:
 *                type: string
 *                required: true
 *    responses:
 *      200:
 *        description: Retorna el token que permite el acceso a otras rutas
 *      500:
 *        description: Error interno
 *
 * /user/changePassword:
 *  post:
 *    summary: Permite modificar la contraseña
 *    tags: [Usuarios]
 *    security:
 *      bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              token:
 *                type: string
 *                required: true
 *              password:
 *                type: string
 *                required: true
 *    responses:
 *      200:
 *        description: Retorna éxito en la operación
 *      500:
 *        description: Error interno
 */
