/**
 * @swagger
 * components:
 *  schemas:
 *    Tarea:
 *      type: object
 *      required: [name, description, reason, deadline, status, requestedById, responsibleId]
 *      properties:
 *        id:
 *          type: integer
 *          description: Id autogenerado por la base de datos
 *        name:
 *          type: string
 *        description:
 *          type: string
 *        status:
 *          type: string
 *          description: Valores disponibles -> No Completado, Completado
 *        deadline:
 *          type: string
 *          description: Fecha límite para completar la tarea
 *        start_date:
 *          type: string
 *          description: Fecha donde comienza la tarea
 *        complete_date:
 *          type: string
 *          description: Fecha de completitud de la tarea
 *        responsibleId:
 *          type: integer
 *          description: Asignada al usuario con este id
 *        requestedId:
 *          type: integer
 *          description: Solicitada por el usuario con este id
 *        machineId:
 *          type: integer
 *          description: Asociada a la máquina con este id
 *        componentId:
 *          type: integer
 *          description: Asociada al componente con este id
 *        pieceId:
 *          type: integer
 *          description: Asociada a la pieza con este id
 *        isActive:
 *          type: boolean
 */
