/**
 * @swagger
 * components:
 *  schemas:
 *    Usuario:
 *      type: object
 *      required: [firstName, lastName, email, role]
 *      properties:
 *        id:
 *          type: integer
 *          description: Id autogenerado por la base de datos
 *        firstName:
 *          type: string
 *        lastName:
 *          type: string
 *        email:
 *          type: string
 *        password:
 *          type: string
 *          description: Contraseña encriptada utilizando SHA-256
 *        role:
 *          type: string
 *          description: Valores -> Mecánico, Operario, Administrador
 *        isActive:
 *          type: boolean
 */
