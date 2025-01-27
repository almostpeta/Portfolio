/**
 * @swagger
 * /error:
 *  post:
 *    summary: Envía un email a soporte con detalles del error. Incluye el usuario logueado
 *    tags: [Error]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              body:
 *                type: string
 *                required: true
 *                description: mensaje de error a reportar
 *    responses:
 *      200:
 *        description: Retorna si la operación ha sido exitosa
 *      500:
 *        description: Error interno
 */
