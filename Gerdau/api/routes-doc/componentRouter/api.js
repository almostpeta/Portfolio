/**
 * @swagger
 * /component/getAll:
 *  get:
 *    summary: Obtiene todos los componentes
 *    tags: [Componentes]
 *    responses:
 *      200:
 *        description: Retorna todas los componentes activos existentes
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Componente'
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 */

/**
 * @swagger
 * /component/getOne/{id}:
 *  get:
 *    summary: Retorna el componente solicitado por id
 *    tags: [Componentes]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: Id del componente
 *    responses:
 *      200:
 *        description: Retorna el componente con sus objetos relacionados
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Componente'
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 */

/**
 * @swagger
 * /component/create:
 *  post:
 *    summary: Inserta un nuevo componente en la base de datos y lo retorna. Solo los administradores pueden acceder
 *    tags: [Componentes]
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
 *              machineId:
 *                type: integer
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
 *              responsibleId:
 *                type: integer
 *                required: true
 *    responses:
 *      200:
 *        description: Retorna el componente insertado
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Componente'
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 */

/**
 * @swagger
 * /component/update/{id}:
 *  put:
 *    summary: Actualiza la información de un componente y la retorna. Solo los administradores pueden acceder
 *    tags: [Componentes]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: Id del componente a actualizar
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
 *              machineId:
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
 *              responsibleId:
 *                type: integer
 *    responses:
 *      200:
 *        description: Retorna el componente modificado
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Componente'
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 */

/**
 * @swagger
 * /component/delete/{id}:
 *  delete:
 *    summary: Inabilita el componente modificando el booleano isActive. Solo los administradores pueden acceder
 *    tags: [Componentes]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: Id del componente a eliminar
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
