/**
 * @swagger
 * /methods/getAll:
 *  get:
 *    summary: Obtiene todos los métodos
 *    tags: [Métodos]
 *    responses:
 *      200:
 *        description: Retorna todos los métodos existentes
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Método'
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 *
 * /method/getOne/{id}:
 *  get:
 *    summary: Retorna el método
 *    tags: [Métodos]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *    responses:
 *      200:
 *        description: Retorna información del método
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Método'
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 *
 * /method/create:
 *  post:
 *    summary: Ingresa los datos del método. No accesible para operadores
 *    tags: [Métodos]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                required: true
 *              solutionId:
 *                type: integer
 *                required: true
 *              description:
 *                type: string
 *              description_record:
 *                type: string
 *    responses:
 *      200:
 *        description: Retorna información del método
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Método'
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 *
 * /method/update/{id}:
 *  put:
 *    summary: Actualiza los datos del método. No accesible para operadores
 *    tags: [Métodos]
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
 *              name:
 *                type: string
 *              solutionId:
 *                type: integer
 *              description:
 *                type: string
 *              description_record:
 *                type: string
 *    responses:
 *      200:
 *        description: Retorna información del método
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Método'
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 *
 * /method/delete/{id}:
 *  delete:
 *    summary: Elimina el método de la base de datos. Accesible sólo para administradores
 *    tags: [Métodos]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *    responses:
 *      200:
 *        description: Retorna el éxito de la operación
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 */
