/**
 * @swagger
 * components:
 *  schemas:
 *    Falla:
 *      type: object
 *      required: [state, name, clasification, componentId, responsibleId, reporters, start_date_time, priority, type]
 *      properties:
 *        id:
 *          type: string
 *          description: Id autogenerado por la base de datos
 *        name:
 *          type: string
 *          description: Nombre de la falla
 *        type:
 *          type: string
 *          description: Tipo de la falla. Valores -> Falla, Tarea
 *        state:
 *          type: string
 *          description: Valores -> Pendiente, En Progreso, Resuelta
 *        clasification:
 *          type: string
 *          description: Clasificación de la falla. Valores disponibles separados por punto y coma -> Eléctrica, Mecánica, Hidráulica, Neumática.
 *        description:
 *          type: string
 *          description: Descripción de la falla
 *        description_record:
 *          type: string
 *          description: Ruta hacia el archivo de audio
 *        start_date_time:
 *          type: Date
 *          description: Hora y Fecha de comienzo de falla
 *        end_date_time:
 *          type: Date
 *          description: Hora y Fecha de resuelta de falla
 *        consequences:
 *          type: string
 *          description: Consecuencias de la falla
 *        consequences_record:
 *          type: string
 *          description: Ruta hacia el archivo de audio
 *        stage:
 *          type: string
 *          description: Etapa en la cual sucede la falla. Varía segun el componente y pieza seleccionados
 *        relevant_data:
 *          type: string
 *          description: Datos relevantes de la falla
 *        relevant_data_record:
 *          type: string
 *          description: Ruta hacia el archivo de audio
 *        priority:
 *          type: string
 *          description: Valores -> Baja, Media, Alta
 *        reject_reason:
 *          type: string
 *          description: Motivo de rechazo de la causa
 *        are_measures:
 *          type: boolean
 *          description: Determina si se registraron medidas
 *        analyzed_measures:
 *          type: string
 *          description: Medidas analizadas durante la falla
 *        fault_number:
 *          type: string
 *          description: Número de la falla correspondiente al sistema existente
 *        componentId:
 *          type: string
 *          description: Id del componente al cual le occurre la falla
 *        pieceId:
 *          type: string
 *          description: Id de la pieza a la cual le occurre la falla
 *        responsibleId:
 *          type: string
 *          description: Id de usuario responsable de la falla
 *        reporters:
 *          type: string
 *          description: Lista separada por coma de ids de usuario que reportaron la falla
 *        isActive:
 *          type: boolean
 *          description: False si fue eliminada por un administrador
 */
