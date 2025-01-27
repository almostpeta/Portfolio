/**
 * @swagger
 * components:
 *  schemas:
 *    Componente:
 *      type: object
 *      required: [internal_name, machineId, serie_number, type, state, manufacturer_type, working_from_date, responsibleId, manufacturer]
 *      properties:
 *        id:
 *          type: integer
 *          description: Id autogenerado por la base de datos
 *        internal_name:
 *          type: string
 *          description: Nombre interno del componente
 *        serie_number:
 *          type: string
 *          description: Número de serie del componente
 *        type:
 *          type: string
 *          description: Tipo del componente
 *        manufacturer:
 *          type: string
 *          description: Fabricante del componente
 *        make:
 *          type: string
 *          description: Marca del componente
 *        model:
 *          type: string
 *          description: Modelo del componente
 *        working_from_date:
 *          type: string
 *          description: Fecha desde la cual el componente se encuentra activo
 *        provider:
 *          type: string
 *          description: Proveedor del componente
 *        description:
 *          type: string
 *          description: Descripción del componente
 *        relevant_data:
 *          type: string
 *          description: Datos relevantes de la causa
 *        manufacturer_type:
 *          type: string
 *          description: Tipo de facturación.
 *        state:
 *          type: string
 *          description: Valores disponibles -> Fuera de uso, Mantenimiento, Producción
 *        machineId:
 *          type: integer
 *          description: Id de la máquina a la cual pertenece el componente
 *        responsibleId:
 *          type: integer
 *          description: Id del usuario que es responsable del componente
 *        isActive:
 *          type: boolean
 *          description: False si fue eliminada por un administrador
 */
