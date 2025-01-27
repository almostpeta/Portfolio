/**
 * @swagger
 * /cause/getAll:
 *  get:
 *    summary: Obtiene todas las causas
 *    tags: [Causas]
 *    responses:
 *      200:
 *        description: Retorna todas las causas existentes
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Causa'
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 *
 * /cause/getOne/{id}:
 *  get:
 *    summary: Retorna la causa solicitada por id
 *    tags: [Causas]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: Id de la causa
 *    responses:
 *      200:
 *        description: Retorna la causa con sus objetos relacionados
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Causa'
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 *
 * /cause/create:
 *  post:
 *    summary: Inserta una nueva causa en la base de datos y la retorna. Notifica a los administradores vía email. No accesible para los Operadores
 *    tags: [Causas]
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
 *              status:
 *                type: string
 *              requestedId:
 *                type: integer
 *                required: true
 *              description:
 *                type: string
 *                required: true
 *              reason:
 *                type: string
 *              relevant_data:
 *                type: string
 *    responses:
 *      200:
 *        description: Retorna la causa insertada
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Causa'
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 *
 * /cause/update/{id}:
 *  put:
 *    summary: Actualiza la información de una causa y la retorna. No accesible para los Operadores
 *    tags: [Causas]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: Id de la causa a actualizar
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              status:
 *                type: string
 *              requestedId:
 *                type: integer
 *              description:
 *                type: string
 *              reason:
 *                type: string
 *              relevant_data:
 *                type: string
 *    responses:
 *      200:
 *        description: Retorna la causa modificada
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Causa'
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 *
 * /cause/status/{id}:
 *  put:
 *    summary: Actualiza el estado de la causa. Solo el administrador puede acceder a este endpoint
 *    tags: [Causas]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: Id de la causa a actualizar
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
 *        description: Retorna si la operación fue exitosa
 *        content:
 *          application/json:
 *            schema:
 *              type: boolean
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 *
 * /cause/resend/{id}:
 *  put:
 *    summary: Modifica el estado de la causa a Solicitada. Notifica a los administradores vía email. No accesible para los Operadores
 *    tags: [Causas]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: Id de la causa a actualizar
 *    responses:
 *      200:
 *        description: Retorna si la operación fue exitosa
 *        content:
 *          application/json:
 *            schema:
 *              type: boolean
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 *
 * /cause/delete/{id}:
 *  delete:
 *    summary: Inhabilita la causa modificando el booleano isActive. Solo los administradores pueden acceder
 *    tags: [Causas]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: Id de la causa a eliminar
 *    responses:
 *      200:
 *        description: Retorna si la operación fue exitosa
 *        content:
 *          application/json:
 *            schema:
 *              type: boolean
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 *
 * /cause/similarCauses:
 *  get:
 *    summary: Obtiene las causas similares. Las causas son similares si se asocian a las mismas fallas
 *    tags: [Causas]
 *    parameters:
 *      - in: query
 *        name: causeIds
 *        schema:
 *          type: array
 *          items:
 *            type: integer
 *        required: true
 *        description: Ids de las causas a buscar similares
 *    responses:
 *      200:
 *        description: Retorna lista de causas que el sistema determina como similares
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Causa'
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 */
