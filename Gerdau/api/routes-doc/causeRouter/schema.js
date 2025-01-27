/**
 * @swagger
 * components:
 *  schemas:
 *    Causa:
 *      type: object
 *      required: [name, status, requestedId, description]
 *      properties:
 *        id:
 *          type: string
 *          description: Id autogenerado por la base de datos
 *        name:
 *          type: string
 *          description: Nombre de la causa
 *        description:
 *          type: string
 *          description: Descripción de la causa
 *        status:
 *          type: string
 *          description: Valores disponibles -> Solicitada, Aprobada, Rechazada
 *        reason:
 *          type: string
 *          description: Razón de la causa
 *        relevant_data:
 *          type: string
 *          description: Datos relevantes de la causa
 *        reject_reason:
 *          type: string
 *          description: Motivo de rechazo de la causa
 *        number_of_uses:
 *          type: integer
 *          description: Solo el sistema lo modifica -> se incrementa en base a las fallas que tengan esta causa
 *        requestedId:
 *          type: integer
 *          description: Id de usuario que crea la causa
 *        isActive:
 *          type: boolean
 *          description: False si fue eliminada por un administrador
 *
 */
