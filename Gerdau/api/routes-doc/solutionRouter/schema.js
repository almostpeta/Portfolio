/**
 * @swagger
 * components:
 *  schemas:
 *    Solución:
 *      type: object
 *      required: [name, description, status, causeId]
 *      properties:
 *        id:
 *          type: string
 *          description: Id autogenerado por la base de datos
 *        name:
 *          type: string
 *          description: Nombre de la solución
 *        description:
 *          type: string
 *        status:
 *          type: string
 *          description: Estado de la solución
 *        relevant_data:
 *          type: string
 *          description: Datos relevantes de la solución
 *        reject_reason:
 *          type: string
 *          description: Motivo de rechazo de la solución
 *        causeId:
 *          type: integer
 *          description: Id de la causa que soluciona
 *        isActive:
 *          type: boolean
 */
