package com.controlfallas.controlfallassatelital.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;

@Configuration
public class LimpiezaInicialV4Config {

    @Bean
    CommandLineRunner limpiarDatosPruebaUnaSolaVez(JdbcTemplate jdbcTemplate) {
        return args -> ejecutarLimpieza(jdbcTemplate);
    }

    @Transactional
    public void ejecutarLimpieza(JdbcTemplate jdbcTemplate) {
        jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS app_control_migrations (codigo VARCHAR(100) PRIMARY KEY, fecha_aplicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
        Integer existe = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM app_control_migrations WHERE codigo = ?",
                Integer.class,
                "V4_LIMPIEZA_INICIAL"
        );
        if (existe != null && existe > 0) return;

        jdbcTemplate.update("DELETE FROM detalle_materiales");
        jdbcTemplate.update("DELETE FROM asistencia_fallas");
        jdbcTemplate.update("DELETE FROM asistencia_soluciones");
        jdbcTemplate.update("DELETE FROM asistencias_tecnicas");
        jdbcTemplate.update("DELETE FROM ordenes_servicio");
        jdbcTemplate.update("DELETE FROM instalacion_equipos");
        jdbcTemplate.update("DELETE FROM instalaciones");
        jdbcTemplate.update("DELETE FROM clientes");
        jdbcTemplate.update("INSERT INTO app_control_migrations(codigo) VALUES (?)", "V4_LIMPIEZA_INICIAL");
    }
}
