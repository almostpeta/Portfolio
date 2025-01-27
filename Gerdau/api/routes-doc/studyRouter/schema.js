/**
 * @swagger
 * components:
 *  schemas:
 *    Estudio:
 *      type: object
 *      required: [internal_name, reason, componentId]
 *      properties:
 *        id:
 *          type: string
 *          description: Id autogenerado por la base de datos
 *        internal_name:
 *          type: string
 *          description: Nombre del estudio
 *        reason:
 *          type: string
 *          description: Motivo del estudio
 *        componentId:
 *          type: integer
 *          required: true
 *        pieceId:
 *          type: integer
 *        isActive:
 *          type: boolean
 */
