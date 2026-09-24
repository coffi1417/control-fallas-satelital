package com.controlfallas.controlfallassatelital.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class V81CatalogosConfig {

    @Bean
    CommandLineRunner catalogosV81(JdbcTemplate jdbc) {

        return args -> {

            // =====================================================
            // FALLAS DE DECODIFICADOR / VIDEO
            // =====================================================

            falla(
                    jdbc,
                    "Decodificador con puerto HDMI defectuoso",
                    "El puerto HDMI no entrega imagen o presenta funcionamiento intermitente.",
                    "Decodificador"
            );

            falla(
                    jdbc,
                    "Decodificador con salida de video defectuosa",
                    "La salida de video del decodificador no entrega imagen correctamente.",
                    "Decodificador"
            );

            falla(
                    jdbc,
                    "Sin falla detectada en el momento",
                    "Durante la visita no se reproduce ni se identifica una falla técnica activa.",
                    "Sin falla detectada"
            );


            // =====================================================
            // SOLUCIONES PARA HDMI / VIDEO
            // =====================================================

            solucion(
                    jdbc,
                    "Verificación y cambio de cable HDMI",
                    "Probar la conexión con un cable HDMI operativo y sustituirlo cuando corresponda."
            );

            solucion(
                    jdbc,
                    "Cambio de puerto HDMI o entrada de TV",
                    "Probar otro puerto disponible y validar la ruta de video."
            );

            solucion(
                    jdbc,
                    "Reparación o reemplazo de decodificador",
                    "Sustituir o remitir el decodificador cuando la salida física esté defectuosa."
            );

            solucion(
                    jdbc,
                    "Verificación de salida de video y configuración",
                    "Revisar resolución, formato de salida y configuración de video del equipo."
            );

            solucion(
                    jdbc,
                    "Revisión de conexiones de audio y video",
                    "Revisar y reajustar las conexiones físicas entre decodificador y televisor."
            );

            solucion(
                    jdbc,
                    "Pruebas operativas sin intervención",
                    "Realizar pruebas funcionales y dejar constancia de que la falla no se reprodujo."
            );

            solucion(
                    jdbc,
                    "Monitoreo y revisión preventiva",
                    "Verificar niveles, conexiones y funcionamiento general sin reemplazar componentes."
            );

            solucion(
                    jdbc,
                    "Verificación general de señal y conexiones",
                    "Comprobar señal, alimentación y conexiones para descartar una falla activa."
            );


            // =====================================================
            // RELACIONES FALLA - SOLUCIÓN
            // =====================================================

            relacion(
                    jdbc,
                    "Decodificador con puerto HDMI defectuoso",
                    "Verificación y cambio de cable HDMI"
            );

            relacion(
                    jdbc,
                    "Decodificador con puerto HDMI defectuoso",
                    "Cambio de puerto HDMI o entrada de TV"
            );

            relacion(
                    jdbc,
                    "Decodificador con puerto HDMI defectuoso",
                    "Reparación o reemplazo de decodificador"
            );

            relacion(
                    jdbc,
                    "Decodificador con salida de video defectuosa",
                    "Verificación de salida de video y configuración"
            );

            relacion(
                    jdbc,
                    "Decodificador con salida de video defectuosa",
                    "Revisión de conexiones de audio y video"
            );

            relacion(
                    jdbc,
                    "Decodificador con salida de video defectuosa",
                    "Reparación o reemplazo de decodificador"
            );

            relacion(
                    jdbc,
                    "Sin falla detectada en el momento",
                    "Pruebas operativas sin intervención"
            );

            relacion(
                    jdbc,
                    "Sin falla detectada en el momento",
                    "Monitoreo y revisión preventiva"
            );

            relacion(
                    jdbc,
                    "Sin falla detectada en el momento",
                    "Verificación general de señal y conexiones"
            );


            // =====================================================
            // MATERIALES
            // =====================================================

            material(
                    jdbc,
                    "Cable HDMI",
                    "Cable para conexión de audio y video entre decodificador y televisor.",
                    "Unidad"
            );

            material(
                    jdbc,
                    "Cable RCA/AV",
                    "Cable analógico de audio y video entre decodificador y televisor.",
                    "Unidad"
            );

            material(
                    jdbc,
                    "Tarjeta de deco",
                    "Tarjeta electrónica del decodificador satelital.",
                    "Unidad"
            );

            material(
                    jdbc,
                    "Control remoto",
                    "Control remoto compatible con el decodificador satelital.",
                    "Unidad"
            );


            // =====================================================
            // SOLUCIONES RELACIONADAS CON LOS MATERIALES
            // =====================================================

            solucion(
                    jdbc,
                    "Cambio de cable HDMI",
                    "Sustituir el cable HDMI y verificar imagen y audio."
            );

            solucion(
                    jdbc,
                    "Cambio de cable RCA/AV",
                    "Sustituir el cable RCA/AV y verificar imagen y audio."
            );

            solucion(
                    jdbc,
                    "Cambio de tarjeta de deco",
                    "Sustituir la tarjeta electrónica del decodificador y realizar pruebas funcionales."
            );

            solucion(
                    jdbc,
                    "Cambio de control remoto",
                    "Sustituir el control remoto y verificar operación del decodificador."
            );


            // =====================================================
            // RELACIONES ADICIONALES
            // =====================================================

            relacion(
                    jdbc,
                    "Decodificador con puerto HDMI defectuoso",
                    "Cambio de cable HDMI"
            );

            relacion(
                    jdbc,
                    "Decodificador con puerto HDMI defectuoso",
                    "Cambio de tarjeta de deco"
            );

            relacion(
                    jdbc,
                    "Decodificador con salida de video defectuosa",
                    "Cambio de cable RCA/AV"
            );

            relacion(
                    jdbc,
                    "Decodificador con salida de video defectuosa",
                    "Cambio de tarjeta de deco"
            );


            // =====================================================
            // ASEGURAR MÍNIMO DE SOLUCIONES
            // =====================================================

            completarMinimoTres(jdbc);
        };
    }


    // =========================================================
    // CREAR / ACTUALIZAR MATERIAL
    // =========================================================

    private void material(
            JdbcTemplate jdbc,
            String nombre,
            String descripcion,
            String unidad) {

        jdbc.update(
                """
                INSERT INTO materiales(
                    nombre_material,
                    descripcion,
                    unidad_medida,
                    cantidad_stock,
                    estado
                )
                SELECT ?, ?, ?, 0, true
                WHERE NOT EXISTS (
                    SELECT 1
                    FROM materiales
                    WHERE nombre_material = ?
                )
                """,
                nombre,
                descripcion,
                unidad,
                nombre
        );

        jdbc.update(
                """
                UPDATE materiales
                SET descripcion = ?,
                    unidad_medida = ?,
                    estado = true
                WHERE nombre_material = ?
                """,
                descripcion,
                unidad,
                nombre
        );
    }


    // =========================================================
    // CREAR / ACTUALIZAR FALLA
    // =========================================================

    private void falla(
            JdbcTemplate jdbc,
            String nombre,
            String descripcion,
            String categoria) {

        jdbc.update(
                """
                INSERT INTO tipos_falla(
                    nombre_falla,
                    descripcion,
                    categoria,
                    estado
                )
                SELECT ?, ?, ?, true
                WHERE NOT EXISTS (
                    SELECT 1
                    FROM tipos_falla
                    WHERE nombre_falla = ?
                )
                """,
                nombre,
                descripcion,
                categoria,
                nombre
        );

        /*
         * Si la falla ya existía pero estaba desactivada,
         * también vuelve a activarse.
         */
        jdbc.update(
                """
                UPDATE tipos_falla
                SET categoria = ?,
                    descripcion = ?,
                    estado = true
                WHERE nombre_falla = ?
                """,
                categoria,
                descripcion,
                nombre
        );
    }


    // =========================================================
    // CREAR SOLUCIÓN
    // =========================================================

    private void solucion(
            JdbcTemplate jdbc,
            String nombre,
            String descripcion) {

        jdbc.update(
                """
                INSERT INTO soluciones(
                    nombre_solucion,
                    descripcion,
                    estado
                )
                SELECT ?, ?, true
                WHERE NOT EXISTS (
                    SELECT 1
                    FROM soluciones
                    WHERE nombre_solucion = ?
                )
                """,
                nombre,
                descripcion,
                nombre
        );

        /*
         * También garantizamos que una solución previamente
         * existente quede activa y con su descripción actualizada.
         */
        jdbc.update(
                """
                UPDATE soluciones
                SET descripcion = ?,
                    estado = true
                WHERE nombre_solucion = ?
                """,
                descripcion,
                nombre
        );
    }


    // =========================================================
    // RELACIONAR FALLA CON SOLUCIÓN
    // =========================================================

    private void relacion(
            JdbcTemplate jdbc,
            String nombreFalla,
            String nombreSolucion) {

        jdbc.update(
                """
                INSERT INTO tipo_falla_soluciones(
                    id_tipo_falla,
                    id_solucion
                )
                SELECT
                    f.id_tipo_falla,
                    s.id_solucion
                FROM tipos_falla f
                JOIN soluciones s
                    ON s.nombre_solucion = ?
                WHERE f.nombre_falla = ?
                AND NOT EXISTS (
                    SELECT 1
                    FROM tipo_falla_soluciones r
                    WHERE r.id_tipo_falla = f.id_tipo_falla
                    AND r.id_solucion = s.id_solucion
                )
                """,
                nombreSolucion,
                nombreFalla
        );
    }


    // =========================================================
    // COMPLETAR MÍNIMO DE TRES SOLUCIONES POR FALLA
    // =========================================================

    private void completarMinimoTres(JdbcTemplate jdbc) {

        solucion(
                jdbc,
                "Diagnóstico y verificación técnica",
                "Realizar mediciones, pruebas y revisión del componente antes de definir reemplazo."
        );

        solucion(
                jdbc,
                "Ajuste, limpieza y reconexión",
                "Corregir ajuste, limpieza o conexión cuando el componente sea recuperable."
        );

        solucion(
                jdbc,
                "Reemplazo del componente afectado",
                "Sustituir el componente cuando las pruebas confirmen daño no recuperable."
        );


        String[] generales = {
                "Diagnóstico y verificación técnica",
                "Ajuste, limpieza y reconexión",
                "Reemplazo del componente afectado"
        };


        for (String solucion : generales) {

            jdbc.update(
                    """
                    INSERT INTO tipo_falla_soluciones(
                        id_tipo_falla,
                        id_solucion
                    )
                    SELECT
                        f.id_tipo_falla,
                        s.id_solucion
                    FROM tipos_falla f
                    CROSS JOIN soluciones s
                    WHERE s.nombre_solucion = ?
                    AND f.estado = true
                    AND f.nombre_falla <> 'Sin falla detectada en el momento'
                    AND (
                        SELECT COUNT(*)
                        FROM tipo_falla_soluciones r
                        WHERE r.id_tipo_falla = f.id_tipo_falla
                    ) < 3
                    AND NOT EXISTS (
                        SELECT 1
                        FROM tipo_falla_soluciones r2
                        WHERE r2.id_tipo_falla = f.id_tipo_falla
                        AND r2.id_solucion = s.id_solucion
                    )
                    """,
                    solucion
            );
        }
    }
}