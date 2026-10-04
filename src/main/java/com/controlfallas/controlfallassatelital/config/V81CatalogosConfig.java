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
            falla(jdbc,"Decodificador con puerto HDMI defectuoso","El puerto HDMI no entrega imagen o presenta funcionamiento intermitente.","Decodificador");
            falla(jdbc,"Decodificador con salida de video defectuosa","La salida de video del decodificador no entrega imagen correctamente.","Decodificador");
            falla(jdbc,"Sin falla detectada en el momento","Durante la visita no se reproduce ni se identifica una falla técnica activa.","Sin falla detectada");

            solucion(jdbc,"Verificación y cambio de cable HDMI","Probar la conexión con un cable HDMI operativo y sustituirlo cuando corresponda.");
            solucion(jdbc,"Cambio de puerto HDMI o entrada de TV","Probar otro puerto disponible y validar la ruta de video.");
            solucion(jdbc,"Reparación o reemplazo de decodificador","Sustituir o remitir el decodificador cuando la salida física esté defectuosa.");
            solucion(jdbc,"Verificación de salida de video y configuración","Revisar resolución, formato de salida y configuración de video del equipo.");
            solucion(jdbc,"Revisión de conexiones de audio y video","Revisar y reajustar las conexiones físicas entre decodificador y televisor.");
            solucion(jdbc,"Pruebas operativas sin intervención","Realizar pruebas funcionales y dejar constancia de que la falla no se reprodujo.");
            solucion(jdbc,"Monitoreo y revisión preventiva","Verificar niveles, conexiones y funcionamiento general sin reemplazar componentes.");
            solucion(jdbc,"Verificación general de señal y conexiones","Comprobar señal, alimentación y conexiones para descartar una falla activa.");

            relacion(jdbc,"Decodificador con puerto HDMI defectuoso","Verificación y cambio de cable HDMI");
            relacion(jdbc,"Decodificador con puerto HDMI defectuoso","Cambio de puerto HDMI o entrada de TV");
            relacion(jdbc,"Decodificador con puerto HDMI defectuoso","Reparación o reemplazo de decodificador");
            relacion(jdbc,"Decodificador con salida de video defectuosa","Verificación de salida de video y configuración");
            relacion(jdbc,"Decodificador con salida de video defectuosa","Revisión de conexiones de audio y video");
            relacion(jdbc,"Decodificador con salida de video defectuosa","Reparación o reemplazo de decodificador");
            relacion(jdbc,"Sin falla detectada en el momento","Pruebas operativas sin intervención");
            relacion(jdbc,"Sin falla detectada en el momento","Monitoreo y revisión preventiva");
            relacion(jdbc,"Sin falla detectada en el momento","Verificación general de señal y conexiones");

            // Materiales puntuales solicitados para decodificador.
            material(jdbc,"Cable HDMI","Cable para conexión de audio y video entre decodificador y televisor.","Unidad");
            material(jdbc,"Cable RCA/AV","Cable analógico de audio y video entre decodificador y televisor.","Unidad");
            material(jdbc,"Tarjeta de deco","Tarjeta electrónica del decodificador satelital.","Unidad");
            material(jdbc,"Control remoto","Control remoto compatible con el decodificador satelital.","Unidad");

            // Catálogo ampliado para cubrir los reemplazos y reparaciones más comunes.
            material(jdbc,"Antena satelital completa","Conjunto completo de antena satelital para reemplazo por daño físico.","Unidad");
            material(jdbc,"Plato de antena satelital","Reflector o plato principal de la antena satelital.","Unidad");
            material(jdbc,"Brazo para antena satelital","Brazo o soporte estructural para montaje de antena.","Unidad");
            material(jdbc,"Soporte de antena","Elemento de fijación para antena satelital.","Unidad");
            material(jdbc,"Kit de tornillería para antena","Conjunto de tornillos, tuercas y arandelas para fijación.","Kit");
            material(jdbc,"Chazo para fijación de antena","Chazo utilizado para asegurar la base o soporte de la antena.","Unidad");
            material(jdbc,"LNB universal","LNB para recepción de señal satelital.","Unidad");
            material(jdbc,"Cable coaxial RG6","Cable coaxial para distribución de señal satelital.","Metro");
            material(jdbc,"Cable coaxial RG11","Cable coaxial para tramos de distribución de mayor distancia.","Metro");
            material(jdbc,"Conector F para RG6","Conector para terminación de cable coaxial RG6.","Unidad");
            material(jdbc,"Conector F de compresión RG6","Conector de compresión para terminación profesional de RG6.","Unidad");
            material(jdbc,"Conector F para RG11","Conector para terminación de cable coaxial RG11.","Unidad");
            material(jdbc,"Acoplador F hembra-hembra","Acoplador para unión de tramos coaxiales.","Unidad");
            material(jdbc,"Adaptador coaxial F","Adaptador para interconexión coaxial tipo F.","Unidad");
            material(jdbc,"TAP satelital","Elemento pasivo para derivación o distribución de señal.","Unidad");
            material(jdbc,"Switch satelital","Switch para distribución de señal.","Unidad");
            material(jdbc,"Multiswitch satelital","Equipo para distribución de señal hacia múltiples puntos.","Unidad");
            material(jdbc,"Divisor satelital 2 vías","Elemento de distribución compatible con la instalación.","Unidad");
            material(jdbc,"Divisor satelital 4 vías","Elemento de distribución de cuatro salidas.","Unidad");
            material(jdbc,"Amplificador satelital","Amplificador utilizado en la distribución de señal.","Unidad");
            material(jdbc,"Amplificador de cabecera","Amplificador utilizado en cabecera o red principal de distribución.","Unidad");
            material(jdbc,"Fuente para amplificador","Fuente de alimentación destinada al amplificador de distribución.","Unidad");
            material(jdbc,"Fuente de alimentación","Fuente para equipos del sistema de distribución.","Unidad");
            material(jdbc,"Adaptador de corriente para decodificador","Fuente o adaptador de corriente compatible con el decodificador.","Unidad");
            material(jdbc,"Cable de alimentación eléctrica","Cable para alimentación de equipos.","Metro");
            material(jdbc,"Decodificador satelital","Equipo receptor o decodificador del servicio.","Unidad");
            material(jdbc,"Tarjeta de acceso","Tarjeta asociada al servicio del decodificador.","Unidad");
            material(jdbc,"Protector para conector exterior","Protección contra humedad para conexiones exteriores.","Unidad");
            material(jdbc,"Cinta autofundente","Cinta para sellado y protección de conexiones exteriores.","Rollo");
            material(jdbc,"Cinta aislante","Cinta para protección y organización de conexiones.","Rollo");
            material(jdbc,"Grapa para cable coaxial","Grapa para fijar y organizar el tendido de cable coaxial.","Unidad");
            material(jdbc,"Abrazadera para cable","Elemento de fijación para tendido de cable.","Unidad");

            // Soluciones aplicadas correspondientes a esos elementos.
            solucion(jdbc,"Cambio de cable HDMI","Sustituir el cable HDMI y verificar imagen y audio.");
            solucion(jdbc,"Cambio de cable RCA/AV","Sustituir el cable RCA/AV y verificar imagen y audio.");
            solucion(jdbc,"Cambio de tarjeta de deco","Sustituir la tarjeta electrónica del decodificador y realizar pruebas funcionales.");
            solucion(jdbc,"Cambio de control remoto","Sustituir el control remoto y verificar operación del decodificador.");
            relacion(jdbc,"Decodificador con puerto HDMI defectuoso","Cambio de cable HDMI");
            relacion(jdbc,"Decodificador con puerto HDMI defectuoso","Cambio de tarjeta de deco");
            relacion(jdbc,"Decodificador con salida de video defectuosa","Cambio de cable RCA/AV");
            relacion(jdbc,"Decodificador con salida de video defectuosa","Cambio de tarjeta de deco");

            // Completa hasta tres alternativas para fallas existentes cuando tengan menos de tres relaciones.
            completarMinimoTres(jdbc);
        };
    }

    private void material(JdbcTemplate j,String n,String d,String u){
        j.update("INSERT INTO materiales(nombre_material,descripcion,unidad_medida,cantidad_stock,estado) SELECT ?,?,?,0,true WHERE NOT EXISTS (SELECT 1 FROM materiales WHERE nombre_material=?)",n,d,u,n);
        j.update("UPDATE materiales SET descripcion=?, unidad_medida=?, estado=true WHERE nombre_material=?",d,u,n);
    }
    private void falla(JdbcTemplate j,String n,String d,String c){
        j.update("INSERT INTO tipos_falla(nombre_falla,descripcion,categoria,estado) SELECT ?,?,?,true WHERE NOT EXISTS (SELECT 1 FROM tipos_falla WHERE nombre_falla=?)",n,d,c,n);
        j.update("UPDATE tipos_falla SET categoria=?, descripcion=? WHERE nombre_falla=?",c,d,n);
    }
    private void solucion(JdbcTemplate j,String n,String d){
        j.update("INSERT INTO soluciones(nombre_solucion,descripcion,estado) SELECT ?,?,true WHERE NOT EXISTS (SELECT 1 FROM soluciones WHERE nombre_solucion=?)",n,d,n);
    }
    private void relacion(JdbcTemplate j,String f,String s){
        j.update("INSERT INTO tipo_falla_soluciones(id_tipo_falla,id_solucion) SELECT f.id_tipo_falla,s.id_solucion FROM tipos_falla f JOIN soluciones s ON s.nombre_solucion=? WHERE f.nombre_falla=? AND NOT EXISTS (SELECT 1 FROM tipo_falla_soluciones r WHERE r.id_tipo_falla=f.id_tipo_falla AND r.id_solucion=s.id_solucion)",s,f);
    }
    private void completarMinimoTres(JdbcTemplate j){
        solucion(j,"Diagnóstico y verificación técnica","Realizar mediciones, pruebas y revisión del componente antes de definir reemplazo.");
        solucion(j,"Ajuste, limpieza y reconexión","Corregir ajuste, limpieza o conexión cuando el componente sea recuperable.");
        solucion(j,"Reemplazo del componente afectado","Sustituir el componente cuando las pruebas confirmen daño no recuperable.");
        String[] generales={"Diagnóstico y verificación técnica","Ajuste, limpieza y reconexión","Reemplazo del componente afectado"};
        for(String s:generales){
            j.update("INSERT INTO tipo_falla_soluciones(id_tipo_falla,id_solucion) SELECT f.id_tipo_falla,s.id_solucion FROM tipos_falla f CROSS JOIN soluciones s WHERE s.nombre_solucion=? AND f.estado=true AND f.nombre_falla<>'Sin falla detectada en el momento' AND (SELECT COUNT(*) FROM tipo_falla_soluciones r WHERE r.id_tipo_falla=f.id_tipo_falla)<3 AND NOT EXISTS (SELECT 1 FROM tipo_falla_soluciones r2 WHERE r2.id_tipo_falla=f.id_tipo_falla AND r2.id_solucion=s.id_solucion)",s);
        }
    }
}
