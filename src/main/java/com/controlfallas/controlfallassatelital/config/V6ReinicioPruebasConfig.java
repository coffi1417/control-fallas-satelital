package com.controlfallas.controlfallassatelital.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class V6ReinicioPruebasConfig {

    @Bean
    CommandLineRunner reinicioControladoV6(JdbcTemplate jdbc) {
        return args -> {
            jdbc.execute("CREATE TABLE IF NOT EXISTS app_control_migrations (codigo VARCHAR(100) PRIMARY KEY, fecha_aplicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
            Integer aplicado = jdbc.queryForObject(
                    "SELECT COUNT(*) FROM app_control_migrations WHERE codigo = ?",
                    Integer.class,
                    "V6_REINICIO_PRUEBAS_Y_ORDEN_UNICA"
            );

            if (aplicado == null || aplicado == 0) {
                // Reinicio solicitado para las pruebas finales. Conserva usuarios, técnicos y catálogos.
                jdbc.update("DELETE FROM detalle_materiales");
                jdbc.update("DELETE FROM asistencia_fallas");
                jdbc.update("DELETE FROM asistencia_soluciones");
                jdbc.update("DELETE FROM asistencias_tecnicas");
                jdbc.update("DELETE FROM ordenes_servicio");
                jdbc.update("DELETE FROM instalacion_equipos");
                jdbc.update("DELETE FROM instalaciones");
                jdbc.update("DELETE FROM clientes");

                // Impide físicamente que MySQL acepte dos órdenes con el mismo número.
                try {
                    jdbc.execute("ALTER TABLE ordenes_servicio ADD CONSTRAINT uk_ordenes_numero UNIQUE (numero_orden)");
                } catch (Exception ignored) {
                    // La restricción puede existir ya en instalaciones nuevas.
                }

                jdbc.update(
                        "INSERT INTO app_control_migrations(codigo) VALUES (?)",
                        "V6_REINICIO_PRUEBAS_Y_ORDEN_UNICA"
                );
            }
        };
    }
}
