/**
 * @swagger
 * /fault/getAll:
 *  get:
 *    summary: Obtiene todas las fallas
 *    tags: [Fallas]
 *    responses:
 *      200:
 *        description: Retorna todas las fallas existentes
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Falla'
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 *
 * /fault/getOne/{id}:
 *  get:
 *    summary: Retorna la falla solicitada por id
 *    tags: [Fallas]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: Id de la falla
 *    responses:
 *      200:
 *        description: Retorna la falla con sus objetos relacionados
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Falla'
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 *
 * /fault/create:
 *  post:
 *    summary: Inserta una nueva falla en la base de datos y la retorna
 *    tags: [Fallas]
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
 *              state:
 *                type: string
 *                required: true
 *              start_date_time:
 *                type: string
 *                required: true
 *              componentId:
 *                type: string
 *                required: true
 *              responsibleId:
 *                type: string
 *                required: true
 *              reporters:
 *                type: array
 *                items:
 *                  type: integer
 *                required: true
 *              clasification:
 *                type: array
 *                items:
 *                  type: string
 *                required: true
 *              end_date_time:
 *                type: string
 *              description:
 *                type: string
 *              description_record:
 *                type: string
 *              pieceId:
 *                type: integer
 *              fault_number:
 *                type: string
 *              stage:
 *                type: string
 *              are_measures:
 *                type: boolean
 *              analyzed_measures:
 *                type: string
 *              analyzed_measures_record:
 *                type: string
 *              consequences:
 *                type: string
 *              consequences_record:
 *                type: string
 *              relevant_data:
 *                type: string
 *    responses:
 *      200:
 *        description: Retorna la falla insertada
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Falla'
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 *
 * /fault/update/{id}:
 *  put:
 *    summary: Actualiza la información de una falla y la retorna
 *    tags: [Fallas]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: Id de la falla a actualizar
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              state:
 *                type: string
 *              start_date_time:
 *                type: string
 *              componentId:
 *                type: integer
 *              responsibleId:
 *                type: integer
 *              reporters:
 *                type: array
 *                items:
 *                  type: integer
 *              clasification:
 *                type: array
 *                items:
 *                  type: string
 *              end_date_time:
 *                type: string
 *              description:
 *                type: string
 *              description_record:
 *                type: string
 *              pieceId:
 *                type: integer
 *              fault_number:
 *                type: string
 *              stage:
 *                type: string
 *              are_measures:
 *                type: string
 *              analyzed_measures:
 *                type: string
 *              analyzed_measures_record:
 *                type: string
 *              consequences:
 *                type: string
 *              consequences_record:
 *                type: string
 *              relevant_data:
 *                type: string
 *    responses:
 *      200:
 *        description: Retorna la falla modificada
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Falla'
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 *
 * /fault/delete/{id}:
 *  delete:
 *    summary: Inhabilita modificando el booleano isActive. Solo los administradores pueden acceder
 *    tags: [Fallas]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: Id de la falla a eliminar
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
 * /fault/{id}/causes:
 *  post:
 *    summary: Asocia y remueve causas a la falla y devuelve una lista de causas similares
 *    tags: [Fallas]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: Id de la falla a la cual se relacionan las causas
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              newCausesIds:
 *                type: array
 *                items:
 *                  type: integer
 *                required: true
 *                description: Id de causas a agregar. No sobreescribe las existentes
 *              deletedCausesIds:
 *                type: array
 *                items:
 *                  type: integer
 *                required: true
 *                description: Id de causas a eliminar
 *    responses:
 *      200:
 *        description: Retorna las las soluciones asociadas a las causas
 *        content:
 *          application/json:
 *            schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Solución'
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 *
 * /fault/{id}/causes-assistant:
 *  get:
 *    summary: Asocia causas a la falla y devuelve una lista de causas similares. Sobreescribe las causas asociadas existentes y asocia las utilizadas en el body
 *    tags: [Fallas]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: Id de la falla a la cual se relacionan las causas
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              causeIds:
 *                type: array
 *                items:
 *                  type: integer
 *                required: true
 *                description: Id de causas a relacionar. Sobreescribe las existentes
 *    responses:
 *      200:
 *        description: Retorna las soluciones a las causas relacionadas
 *        content:
 *          application/json:
 *            schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Solución'
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 *
 * /fault/{id}/methods:
 *  post:
 *    summary: Asocia los métodos que fueron utilizados para resolver la falla
 *    tags: [Fallas]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: Id de la falla a la cual se relacionan los métodos
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              methods:
 *                type: array
 *                items:
 *                  type: integer
 *                required: true
 *                description: Id de métodos a relacionar con la falla
 *    responses:
 *      200:
 *        description: Retorna los métodos relacionados
 *        content:
 *          application/json:
 *            schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Método'
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 *
 * /fault/getFaultAndTaskByDate:
 *  get:
 *    summary: Obtiene las fallas y tareas segun los parametros, a ser utilizado en la linea del tiempo
 *    tags: [Fallas]
 *    parameters:
 *      - in: query
 *        name: machineId
 *        schema:
 *          type: integer
 *      - in: query
 *        name: componentId
 *        schema:
 *          type: integer
 *      - in: query
 *        name: pieceId
 *        schema:
 *          type: integer
 *      - in: query
 *        name: order
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Retorna las tareas y fallas que coinciden con la búsqueda
 *        content:
 *          application/json:
 *            schema:
 *                type: object
 *                properties:
 *                  faults:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/Falla'
 *                  tasks:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/Tarea'
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 */

/**
 * @swagger
 * /fault/faultZip/{id}:
 *  get:
 *    summary: Obtiene un archivo zip conteniendo la información de la falla y sus archivos relacionados
 *    tags: [Fallas]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *    responses:
 *      200:
 *        description: Base64 que representa el archivo a descargar
 *        content:
 *          application/json:
 *            schema:
 *                type: string
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 *
 * /fault/{id}/setResolved:
 *  post:
 *    summary: Modifica el estado de la falla a Resuelta
 *    tags: [Fallas]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *    responses:
 *      200:
 *        description: Booleano indicando si la operación fue exitosa
 *        content:
 *          application/json:
 *            schema:
 *                type: boolean
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 *
 * /fault/faultsByCauses:
 *  get:
 *    summary: Obtiene las fallas que están relacionadas a las causas
 *    tags: [Fallas]
 *    parameters:
 *      - in: query
 *        name: id
 *        schema:
 *          type: array
 *          items:
 *            type: integer
 *        required: true
 *    responses:
 *      200:
 *        description: Lista de fallas que están relacionadas a las causas
 *        content:
 *          application/json:
 *            schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Falla'
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 *
 * /fault/{id}/resolve-fault-causes:
 *  get:
 *    summary: Obtiene las causas de falla junto con sus soluciones y métodos
 *    tags: [Fallas]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *    responses:
 *      200:
 *        description: Lista de causas con soluciones y métodos
 *        content:
 *          application/json:
 *            schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Causa'
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 */
