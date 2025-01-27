/**
 * @swagger
 * components:
 *  schemas:
 *    Método:
 *      type: object
 *      required: [name, solutionId]
 *      properties:
 *        id:
 *          type: integer
 *          description: Id autogenerado por la base de datos
 *        name:
 *          type: string
 *          description: Nombre del método
 *        solutionId:
 *          type: integer
 *          description: Id de la solución
 *        description:
 *          type: string
 *        description_record:
 *          type: string
 *          description: ruta al archivo de audio
 *        isActive:
 *          type: boolean
 */
