/**
 * @swagger
 * /piece/getAll:
 *  get:
 *    summary: Obtiene todas las piezas
 *    tags: [Piezas]
 *    responses:
 *      200:
 *        description: Retorna todas las piezas existentes
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Pieza'
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 *
 * /piece/getOne/{id}:
 *  get:
 *    summary: Retorna la pieza solicitada por id
 *    tags: [Piezas]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *    responses:
 *      200:
 *        description: Retorna la pieza con sus objetos relacionados
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Pieza'
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 *
 * /pieza/create:
 *  post:
 *    summary: Inserta una nueva pieza en la base de datos y lo retorna. Solo los administradores pueden acceder
 *    tags: [Piezas]
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
 *              serie_number:
 *                type: string
 *                required: true
 *              type:
 *                type: string
 *                required: true
 *              manufacturer:
 *                type: string
 *                required: true
 *              working_from_date:
 *                type: string
 *                required: true
 *              manufacturer_type:
 *                type: string
 *                required: true
 *              state:
 *                type: string
 *                required: true
 *              componentId:
 *                type: string
 *                required: true
 *              make:
 *                type: string
 *              model:
 *                type: string
 *              provider:
 *                type: string
 *              description:
 *                type: string
 *              relevant_data:
 *                type: string
 *              maintenance_responsible:
 *                type: integer
 *                required: true
 *    responses:
 *      200:
 *        description: Retorna la pieza insertada
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Pieza'
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 */

/**
 * @swagger
 * /piece/update/{id}:
 *  put:
 *    summary: Actualiza la información de una pieza y la retorna. Solo los administradores pueden acceder
 *    tags: [Piezas]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
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
 *              serie_number:
 *                type: string
 *              type:
 *                type: string
 *              manufacturer:
 *                type: string
 *              working_from_date:
 *                type: string
 *              manufacturer_type:
 *                type: string
 *              state:
 *                type: string
 *              componentId:
 *                type: string
 *              make:
 *                type: string
 *              model:
 *                type: string
 *              provider:
 *                type: string
 *              description:
 *                type: string
 *              relevant_data:
 *                type: string
 *              maintenance_responsible:
 *                type: integer
 *    responses:
 *      200:
 *        description: Retorna la pieza modificada
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Pieza'
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 *
 * /component/delete/{id}:
 *  delete:
 *    summary: Inhabilita la pieza modificando el booleano isActive. Solo los administradores pueden acceder
 *    tags: [Piezas]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: Id de la pieza a eliminar
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
 */
