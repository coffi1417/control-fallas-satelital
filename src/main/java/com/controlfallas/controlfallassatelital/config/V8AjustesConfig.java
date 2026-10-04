package com.controlfallas.controlfallassatelital.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

@Configuration
public class V8AjustesConfig {

    @Bean
    CommandLineRunner ajustesV8(JdbcTemplate jdbc) {
        return args -> {
            // V8.1: no elimina ni depura órdenes existentes. Se conserva todo el historial.

            // Normaliza categorías para que la reincidencia se mida por componente técnico.
            actualizar(jdbc,"Cableado","Cable coaxial dañado","Cable coaxial fracturado o cortado","Cable coaxial desconectado","Pérdida de señal por cable coaxial");
            actualizar(jdbc,"Conectores","Conector coaxial defectuoso","Humedad o corrosión en conexión");
            actualizar(jdbc,"Antena","Antena desalineada","Antena con daño físico","Fijación de antena floja");
            actualizar(jdbc,"LNB","LNB sin señal","LNB defectuoso","Conexión de LNB defectuosa");
            actualizar(jdbc,"Decodificador","Decodificador sin encender","Decodificador sin señal","Decodificador defectuoso","Decodificador bloqueado","Tarjeta defectuosa","Tarjeta no reconocida","Tarjeta mal insertada");
            actualizar(jdbc,"TAP","TAP defectuoso","Puerto de TAP defectuoso","TAP sin señal de entrada");
            actualizar(jdbc,"Amplificador","Amplificador sin señal","Amplificador defectuoso","Amplificador de cabecera defectuoso");
            actualizar(jdbc,"TAP/Amplificador","Puerto de switch defectuoso","Switch sin funcionamiento","Switch sin alimentación");
        };
    }

    private void actualizar(JdbcTemplate jdbc, String categoria, String... nombres) {
        for (String nombre : nombres) jdbc.update("UPDATE tipos_falla SET categoria=? WHERE nombre_falla=?", categoria, nombre);
    }
}
