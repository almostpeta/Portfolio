/**
 * @swagger
 * /task/getAll:
 *  get:
 *    summary: Obtiene todas las tareas que estan asignadas al usuario actual. Si el usuario es administrador, devuelve todas las tareas
 *    tags: [Tareas]
 *    responses:
 *      200:
 *        description: Retorna todas las tareas segun el usuario
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Tarea'
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 *
 * /task/getOne/{id}:
 *  get:
 *    summary: Retorna la tarea
 *    tags: [Tareas]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *    responses:
 *      200:
 *        description: Retorna información de la tarea
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Tarea'
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 *
 * /task/create:
 *  post:
 *    summary: Ingresa los datos de la solución. Solo accesible para administradores. Se notifica al responsable por email
 *    tags: [Tareas]
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
 *                type: string
 *                required: true
 *              reason:
 *                type: string
 *                required: true
 *              status:
 *                type: string
 *                required: true
 *              start_date:
 *                type: string
 *                required: true
 *              deadline:
 *                type: string
 *                required: true
 *              responsibleId:
 *                type: integer
 *                required: true
 *              requestedId:
 *                type: string
 *                required: true
 *              completed_date:
 *                type: string
 *              machineId:
 *                type: integer
 *              componentId:
 *                type: integer
 *              pieceId:
 *                type: integer
 *    responses:
 *      200:
 *        description: Retorna información de la tarea
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Tarea'
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 *
 * /task/update/{id}:
 *  put:
 *    summary: Actualiza los datos de la tarea. Solo para administradores
 *    tags: [Tareas]
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
 *                type: string
 *              reason:
 *                type: string
 *              status:
 *                type: string
 *              start_date:
 *                type: string
 *              deadline:
 *                type: string
 *              responsibleId:
 *                type: integer
 *              requestedId:
 *                type: integer
 *              completed_date:
 *                type: string
 *              machineId:
 *                type: integer
 *              componentId:
 *                type: integer
 *              pieceId:
 *                type: integer
 *    responses:
 *      200:
 *        description: Retorna información de la tarea
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Tarea'
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 *
 * /task/delete/{id}:
 *  delete:
 *    summary: Elimina la tarea de la base de datos. Accesible sólo para administradores
 *    tags: [Tareas]
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
 * /task/{id}/completeTask:
 *  post:
 *    summary: Modifica el estado de la tarea a Completada y fija el campo complete_date
 *    tags: [Tareas]
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
