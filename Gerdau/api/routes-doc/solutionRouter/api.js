/**
 * @swagger
 * /solution/getAll:
 *  get:
 *    summary: Obtiene todas las soluciones existentes
 *    tags: [Soluciones]
 *    responses:
 *      200:
 *        description: Retorna todas las soluciones existentes
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Solución'
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 *
 * /solution/getOne/{id}:
 *  get:
 *    summary: Retorna la solución
 *    tags: [Soluciones]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *    responses:
 *      200:
 *        description: Retorna información de la solución
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Solución'
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 *
 * /solution/create:
 *  post:
 *    summary: Ingresa los datos de la solución. No accesible para operadores
 *    tags: [Soluciones]
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
 *              description:
 *                type: integer
 *                required: true
 *              status:
 *                type: integer
 *                required: true
 *              relevant_data:
 *                type: string
 *              causeId:
 *                type: integer
 *                required: true
 *    responses:
 *      200:
 *        description: Retorna información de la solución
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Solución'
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 *
 * /solution/update/{id}:
 *  put:
 *    summary: Actualiza los datos de la solución. No accesible para operadores
 *    tags: [Soluciones]
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
 *              description:
 *                type: integer
 *              relevant_data:
 *                type: string
 *              causeId:
 *                type: string
 *    responses:
 *      200:
 *        description: Retorna información de la solución
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Solución'
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 *
 * /solution/status/{id}:
 *  put:
 *    summary: Actualiza el estado de la solución. Solo para administradores
 *    tags: [Soluciones]
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
 *              status:
 *                type: string
 *                required: true
 *    responses:
 *      200:
 *        description: Retorna información de la solución
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Solución'
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 *
 * /solution/delete/{id}:
 *  delete:
 *    summary: Inhabilita la solución modificando el campo isActive. Accesible sólo para administradores
 *    tags: [Soluciones]
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
 *
 * /solution/resend/{id}:
 *  put:
 *    summary: Modifica el estado a Solicitado y notifica a los administradores. No accesible para operadores
 *    tags: [Soluciones]
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
