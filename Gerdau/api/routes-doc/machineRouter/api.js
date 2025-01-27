/**
 * @swagger
 * /machine/getAll:
 *  get:
 *    summary: Obtiene todas las máquinas
 *    tags: [Máquinas]
 *    responses:
 *      200:
 *        description: Retorna todas las máquinas existentes que se encuentran activas
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Máquina'
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 *
 * /machine/getOne/{id}:
 *  get:
 *    summary: Retorna la máquina que coincide con el id
 *    tags: [Máquinas]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: Id de la máquina
 *    responses:
 *      200:
 *        description: Retorna información de la máquina
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Máquina'
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 *
 * /machine/create:
 *  post:
 *    summary: Ingresa la máquina y la retorna. Accesible sólo para aministradores
 *    tags: [Máquinas]
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
 *              purchase_number:
 *                type: string
 *                required: true
 *              maintenance_responsible:
 *                type: integer
 *                required: true
 *              manufacturer_type:
 *                type: string
 *                required: true
 *              state:
 *                type: string
 *                required: true
 *              stages:
 *                type: array
 *                items:
 *                  type: integer
 *                description: Lista de Ids del schema Etapas
 *                required: true
 *              fault_number:
 *                type: string
 *              sublevelId:
 *                type: integer
 *                required: true
 *              areaId:
 *                type: integer
 *                required: true
 *              plantId:
 *                type: integer
 *                required: true
 *              make:
 *                type: string
 *              model:
 *                type: string
 *              description:
 *                type: string
 *              relevant_data:
 *                type: string
 *    responses:
 *      200:
 *        description: Retorna información de la máquina junto con sus registros relacionados
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Máquina'
 *      300:
 *        description: Máquina duplicada para el mismo internal_name y areaId
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 *
 * /machine/update/{id}:
 *  put:
 *    summary: Actualiza los datos de la máquina. Accesible sólo para aministradores
 *    tags: [Máquinas]
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
 *              serie_number:
 *                type: string
 *              type:
 *                type: string
 *              manufacturer:
 *                type: string
 *              working_from_date:
 *                type: string
 *              purchase_number:
 *                type: string
 *              maintenance_responsible:
 *                type: integer
 *              manufacturer_type:
 *                type: string
 *              state:
 *                type: string
 *              stages:
 *                type: array
 *                items:
 *                  type: integer
 *                description: Lista de Ids del schema Etapas. Sobreescribe la existente
 *              fault_number:
 *                type: string
 *              sublevelId:
 *                type: integer
 *              areaId:
 *                type: integer
 *              plantId:
 *                type: integer
 *              make:
 *                type: string
 *              model:
 *                type: string
 *              description:
 *                type: string
 *              relevant_data:
 *                type: string
 *    responses:
 *      200:
 *        description: Retorna información de la máquina
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Máquina'
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 *
 * /machine/delete/{id}:
 *  delete:
 *    summary: Inhabilita la máquina modificando el campo isActive. Accesible sólo para administradores
 *    tags: [Máquinas]
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
