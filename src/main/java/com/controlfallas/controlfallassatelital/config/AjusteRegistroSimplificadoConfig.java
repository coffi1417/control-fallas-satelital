package com.controlfallas.controlfallassatelital.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class AjusteRegistroSimplificadoConfig {

    @Bean
    CommandLineRunner permitirTecnicoEscrito(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                jdbcTemplate.execute("ALTER TABLE asistencias_tecnicas MODIFY COLUMN id_tecnico INT NULL");
            } catch (Exception ignored) {
                // La aplicación puede continuar si la columna ya admite nulos o si Hibernate ya aplicó el cambio.
            }
        };
    }
}
