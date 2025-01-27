/**
 * @swagger
 * components:
 *  schemas:
 *    Pieza:
 *      type: object
 *      required: [internal_name, identifier, componentId, type, working_from_date, manufacturer, manufacturer_type]
 *      properties:
 *        id:
 *          type: string
 *          description: Id autogenerado por la base de datos
 *        internal_name:
 *          type: string
 *          description: Nombre interno de la pieza
 *        identifier:
 *          type: string
 *          description: Identificador de la pieza
 *        serie_number:
 *          type: string
 *          description: Número de serie de la pieza
 *        type:
 *          type: string
 *          description: Tipo de la pieza
 *        manufacturer:
 *          type: string
 *          description: Fabricante de la pieza
 *        make:
 *          type: string
 *          description: Marca de la pieza
 *        model:
 *          type: string
 *          description: Modelo de la pieza
 *        working_from_date:
 *          type: date
 *          description: Fecha desde la cual la pieza se encuentra activa
 *        provider:
 *          type: string
 *          description: Proveedor de la pieza
 *        description:
 *          type: string
 *          description: Descripción de la pieza
 *        relevant_data:
 *          type: string
 *          description: Datos relevantes de la pieza
 *        manufacturer_type:
 *          type: string
 *          description: Tipo de facturación. Valores -> Original, Según plano
 *        state:
 *          type: string
 *          description: Valores disponibles -> Fuera de uso, Mantenimiento, Producción
 *        responsibleId:
 *          type: integer
 *          description: Id del usuario que es responsable de la pieza
 *        isActive:
 *          type: boolean
 *          description: False si fue eliminada por un administrador
 */
