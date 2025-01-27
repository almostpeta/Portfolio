/**
 * @swagger
 * /stage:
 *  get:
 *    summary: Devuelve todas las etapas
 *    tags: [Etapas]
 *    responses:
 *      200:
 *        description: Retorna todas las etapas existentes
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Etapas'
 *      500:
 *        description: Error interno
 * /stage/{machineId}:
 *  get:
 *    summary: Retorna las etapas pertenecientes a la máquina
 *    tags: [Etapas]
 *    parameters:
 *      - in: path
 *        name: machineId
 *        schema:
 *          type: integer
 *        required: true
 *        description: Id de la máquina
 *    responses:
 *      200:
 *        description: Lista de etapas que pertenecen a la máquina
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Etapas'
 *      500:
 *        description: Error interno
 */
