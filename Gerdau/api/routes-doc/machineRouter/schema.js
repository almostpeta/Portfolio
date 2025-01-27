/**
 * @swagger
 * components:
 *  schemas:
 *    Máquina:
 *      type: object
 *      required: [internal_name, serie_number, type, manufacturer, working_from_date, purchase_number, maintenance_responsible, manufacturer_type, state, stages, plantId, areaId, sublevelId]
 *      properties:
 *        id:
 *          type: string
 *          description: Id autogenerado por la base de datos
 *        internal_name:
 *          type: string
 *          description: Nombre de la máquina
 *        serie_number:
 *          type: string
 *          description: Número de serie de la máquina
 *        type:
 *          type: string
 *          description: Valores separados por coma. Valores disponibles -> Mecánica, Eléctrica, Hidráulica, Neumática
 *        manufacturer:
 *          type: string
 *          description: Fabricante de la máquina
 *        working_from_date:
 *          type: string
 *          description: Campo de fecha en formato ISO
 *        purchase_number:
 *          type: string
 *          description: Número de compra
 *        maintenance_responsible:
 *          type: integer
 *          description: Id del usuario que es responsable de la máquina
 *        manufacturer_type:
 *          type: integer
 *          description: Id del tipo de facturación. 1 -> Original, 2-> Según Plano
 *        state:
 *          type: string
 *          description: Id del estado. 1 -> Producción, 2 -> Mantenimiento, 3 -> Fuera de uso
 *        plantId:
 *          type: integer
 *          description: Id de la planta a la cual pertenece
 *        areaId:
 *          type: integer
 *          description: Id del área a la cual pertenece
 *        sublevelId:
 *          type: integer
 *          description: Id del subnivel a la cual pertenece
 *        make:
 *          type: string
 *          description: Marca de la máquina
 *        model:
 *          type: string
 *          description: Modelo de la máquina
 *        description:
 *          type: string
 *          description: Descripción de la máquina
 *        relevant_data:
 *          type: string
 *          description: Datos relevantes de la máquina
 *        flat_number:
 *          type: string
 *          description: Número de plano de la máquina
 *        electric_faults_count:
 *          type: integer
 *          description: Cantidad de fallas del tipo eléctrica relacionadas a la máquina
 *        neumatic_faults_count:
 *          type: integer
 *          description: Cantidad de fallas del tipo neumática relacionadas a la máquina
 *        hydraulic_faults_count:
 *          type: integer
 *          description: Cantidad de fallas del tipo hidráulica relacionadas a la máquina
 *        mechanic_faults_count:
 *          type: integer
 *          description: Cantidad de fallas del tipo mecánica relacionadas a la máquina
 *        isActive:
 *          type: boolean
 *          description: false si fue eliminada por un administrador
 */
