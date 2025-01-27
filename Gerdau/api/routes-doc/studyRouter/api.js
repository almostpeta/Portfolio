/**
 * @swagger
 * /study/getAll:
 *  get:
 *    summary: Obtiene todos los estudios existentes
 *    tags: [Estudios]
 *    responses:
 *      200:
 *        description: Retorna todas los estudios
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Estudio'
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 *
 * /study/getOne/{id}:
 *  get:
 *    summary: Retorna el estudio
 *    tags: [Estudios]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *    responses:
 *      200:
 *        description: Retorna información del estudio
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Estudio'
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 *
 * /study/create:
 *  post:
 *    summary: Ingresa los datos del estudio. No accesible para operadores
 *    tags: [Estudios]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              internal_name:
 *                type: string
 *                required: true
 *              reason:
 *                type: string
 *                required: true
 *              componentId:
 *                type: integer
 *                required: true
 *              pieceId:
 *                type: integer
 *    responses:
 *      200:
 *        description: Retorna información del estudio
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Estudio'
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 *
 * /study/update/{id}:
 *  put:
 *    summary: Actualiza los datos del estudio. No accesible para operadores
 *    tags: [Estudios]
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
 *              internal_name:
 *                type: string
 *              reason:
 *                type: string
 *              componentId:
 *                type: integer
 *              pieceId:
 *                type: integer
 *    responses:
 *      200:
 *        description: Retorna información del estudio
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Estudio'
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 *
 * /solution/delete/{id}:
 *  delete:
 *    summary: Elimina el estudio de la base de datos. Accesible sólo para administradores
 *    tags: [Estudios]
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
