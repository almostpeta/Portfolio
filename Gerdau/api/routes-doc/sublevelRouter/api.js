/**
 * @swagger
 * /sublevel/getAll:
 *  get:
 *    summary: Obtiene todos los subniveles
 *    tags: [Subniveles]
 *    responses:
 *      200:
 *        description: Retorna todas los subniveles existentes
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Subnivel'
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 */
