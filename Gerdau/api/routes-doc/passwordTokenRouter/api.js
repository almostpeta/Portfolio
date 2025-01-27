/**
 * @swagger
 * /passwordToken/create:
 *  post:
 *    summary: Crea un token para el usuario y manda un email
 *    tags: [PasswordToken]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                required: true
 *    responses:
 *      200:
 *        description: Retorna el token creado
 *        content:
 *          application/json:
 *            schema:
 *              type: string
 *      500:
 *        description: Error interno
 */
