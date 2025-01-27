/**
 * @swagger
 * /plant/getAll:
 *  get:
 *    summary: Obtiene todas las plantas
 *    tags: [Plantas]
 *    responses:
 *      200:
 *        description: Retorna todas las plantas existentes
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Planta'
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 */
