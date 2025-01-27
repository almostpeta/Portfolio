/**
 * @swagger
 * /area/getAll:
 *  get:
 *    summary: Devuelve todas las áreas
 *    tags: [Areas]
 *    responses:
 *      200:
 *        description: Retorna todas las áreas existentes
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Area'
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 * /area/getAll/{plant}:
 *  get:
 *    summary: Retorna las áreas pertenecientes a la planta
 *    tags: [Areas]
 *    parameters:
 *      - in: path
 *        name: plant
 *        schema:
 *          type: integer
 *        required: true
 *        description: Id de la planta
 *    responses:
 *      200:
 *        description: Lista de áreas que pertenecen a la planta
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Area'
 *      403:
 *        description: Acceso denegado
 *      500:
 *        description: Error interno
 */
