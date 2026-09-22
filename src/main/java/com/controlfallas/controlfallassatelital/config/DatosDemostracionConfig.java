package com.controlfallas.controlfallassatelital.config;

import com.controlfallas.controlfallassatelital.entity.*;
import com.controlfallas.controlfallassatelital.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.*;

@Configuration
public class DatosDemostracionConfig {

    @Bean
    CommandLineRunner completarCatalogos(
            TipoFallaRepository fallaRepo,
            SolucionRepository solucionRepo,
            MaterialRepository materialRepo,
            TipoFallaSolucionRepository relacionRepo) {
        return args -> {
            Map<String, TipoFalla> fallas = new LinkedHashMap<>();
            Object[][] datosFalla = {
                {"Señal débil","Pérdida parcial de intensidad de señal.","Señal"},
                {"Pérdida total de señal","Ausencia completa de señal satelital.","Señal"},
                {"LNB sin señal","El LNB no entrega señal al sistema.","LNB"},
                {"LNB defectuoso","El LNB presenta funcionamiento anormal o daño.","LNB"},
                {"Puerto de switch defectuoso","Un puerto del switch no entrega señal correctamente.","Distribución"},
                {"Switch sin funcionamiento","El switch de distribución no opera.","Distribución"},
                {"TAP defectuoso","El TAP presenta daño o pérdida de distribución.","Distribución"},
                {"Puerto de TAP defectuoso","Un puerto del TAP no entrega señal correctamente.","Distribución"},
                {"Cable coaxial dañado","El cable coaxial presenta daño físico o deterioro.","Cableado coaxial"},
                {"Cable coaxial fracturado o cortado","El cable coaxial presenta fractura, corte o interrupción física del conductor.","Cableado coaxial"},
                {"Conector coaxial defectuoso","El conector presenta daño, falso contacto o mala terminación.","Cableado coaxial"},
                {"Decodificador sin encender","El decodificador no enciende.","Decodificador"},
                {"Tarjeta defectuosa","La tarjeta presenta falla de funcionamiento.","Tarjeta"},
                {"Cable eléctrico dañado","El cable de alimentación presenta daño.","Alimentación eléctrica"},
                {"Toma eléctrica sin energía","No hay energía disponible en el punto de alimentación.","Alimentación eléctrica"},
                {"Decodificador sin señal","El decodificador enciende pero no recibe señal.","Decodificador"},
                {"Decodificador defectuoso","El equipo presenta una falla general de funcionamiento.","Decodificador"},
                {"Tarjeta no reconocida","El decodificador no reconoce la tarjeta instalada.","Tarjeta"},
                {"Antena desalineada","La orientación de la antena está fuera del punto óptimo.","Antena"},
                {"Antena con daño físico","La antena o sus elementos presentan daño físico.","Antena"},
                {"Conexión de LNB defectuosa","La conexión del LNB presenta corrosión, falso contacto o mala terminación.","LNB"},
                {"Switch sin alimentación","El switch no recibe alimentación eléctrica.","Distribución"},
                {"TAP sin señal de entrada","El TAP no recibe señal desde el tramo anterior.","Distribución"},
                {"Cable coaxial desconectado","Existe una desconexión en el recorrido coaxial.","Cableado coaxial"},
                {"Pérdida de señal por cable coaxial","El tramo coaxial genera atenuación o pérdida excesiva.","Cableado coaxial"},
                {"Fuente de alimentación defectuosa","La fuente no entrega alimentación adecuada.","Alimentación eléctrica"},
                {"Decodificador bloqueado","El decodificador queda bloqueado o no responde.","Decodificador"},
                {"Tarjeta mal insertada","La tarjeta no está instalada correctamente.","Tarjeta"},
                {"Señal intermitente","La señal aparece y desaparece durante el servicio.","Señal"},
                {"Pixelación o congelamiento de imagen","La imagen presenta cuadros, congelamiento o cortes frecuentes.","Señal"},
                {"Fijación de antena floja","La base o fijación de la antena presenta movimiento o pérdida de ajuste.","Antena"},
                {"Humedad o corrosión en conexión","Se observa humedad, sulfato o corrosión en conectores o puntos exteriores.","Cableado coaxial"},
                {"Amplificador sin señal","El amplificador no entrega señal a la red de distribución.","Distribución"},
                {"Amplificador defectuoso","El amplificador presenta falla de funcionamiento o nivel de salida inadecuado.","Distribución"},
                {"Amplificador de cabecera defectuoso","El amplificador de cabecera presenta falla, ausencia de salida o niveles inadecuados.","Amplificador"},
                {"Cable coaxial deteriorado por intemperie","El cable presenta envejecimiento, resequedad o deterioro exterior.","Cableado"},
                {"Cable coaxial con humedad","El tramo coaxial presenta ingreso de humedad y pérdida de desempeño.","Cableado"},
                {"Cable coaxial aplastado o deformado","El cable presenta deformación física que afecta la transmisión.","Cableado"},
                {"Conector F flojo","El conector presenta ajuste insuficiente o falso contacto.","Conectores"},
                {"Conector F sulfatado","El conector presenta corrosión o sulfatación.","Conectores"},
                {"Conector mal ponchado","La terminación del conector no cumple una conexión adecuada.","Conectores"},
                {"Brazo o soporte de antena deformado","El soporte de la antena presenta deformación o daño.","Antena"},
                {"LNB con ingreso de humedad","El LNB presenta indicios de humedad y funcionamiento irregular.","LNB"},
                {"LNB con nivel inestable","El LNB entrega niveles variables o intermitentes.","LNB"},
                {"TAP con pérdida excesiva","El TAP introduce una atenuación superior a la esperada.","TAP"},
                {"TAP con conexión deteriorada","Las conexiones del TAP presentan deterioro o falso contacto.","TAP"},
                {"Amplificador sin alimentación","El amplificador no recibe la alimentación requerida.","Amplificador"},
                {"Amplificador con nivel de salida bajo","El amplificador entrega un nivel insuficiente a la red.","Amplificador"},
                {"Decodificador reinicia constantemente","El equipo presenta reinicios repetitivos durante el servicio.","Decodificador"},
                {"Decodificador con puerto coaxial defectuoso","La entrada coaxial del equipo presenta daño o falso contacto.","Decodificador"}
            };
            for (Object[] d : datosFalla) {
                String nombre = (String)d[0];
                TipoFalla f = fallaRepo.findAll().stream().filter(x -> nombre.equalsIgnoreCase(x.getNombreFalla())).findFirst().orElse(null);
                if (f == null) {
                    f = new TipoFalla(); f.setNombreFalla(nombre); f.setDescripcion((String)d[1]); f.setCategoria((String)d[2]); f.setEstado(true); f = fallaRepo.save(f);
                }
                fallas.put(nombre, f);
            }

            Map<String, Solucion> soluciones = new LinkedHashMap<>();
            Object[][] datosSol = {
                {"Realineación de antena","Ajustar azimut, elevación y fijación hasta recuperar niveles adecuados de señal."},
                {"Reparación o reemplazo de antena","Corregir elementos físicos dañados o sustituir la antena cuando sea necesario."},
                {"Reemplazo de LNB","Retirar el LNB defectuoso e instalar uno operativo."},
                {"Rehacer conexión de LNB","Limpiar, ajustar y rehacer conectores y protección de la conexión del LNB."},
                {"Cambio de puerto de switch","Migrar la salida a un puerto operativo y verificar niveles de señal."},
                {"Reemplazo de switch","Sustituir el switch de distribución defectuoso."},
                {"Restablecer alimentación de switch","Corregir fuente, conexión o alimentación eléctrica del switch."},
                {"Reemplazo de TAP","Sustituir el TAP defectuoso y verificar entradas y salidas."},
                {"Cambio de puerto de TAP","Trasladar la conexión a un puerto operativo del TAP."},
                {"Restablecer señal de entrada al TAP","Revisar y corregir el tramo anterior que alimenta el TAP."},
                {"Reemplazo de tramo coaxial","Retirar el tramo deteriorado e instalar cable coaxial en buen estado."},
                {"Reconexión de cable coaxial","Reconectar, fijar y verificar continuidad del cable coaxial."},
                {"Reemplazo de conector coaxial","Cortar y rehacer la terminación con un conector nuevo."},
                {"Corrección de pérdida en coaxial","Localizar el punto de atenuación y corregir cable, empalme o conector."},
                {"Restablecer energía en toma","Corregir la alimentación disponible en el punto eléctrico."},
                {"Reemplazo de cable eléctrico","Sustituir el cable de alimentación deteriorado."},
                {"Reemplazo de fuente de alimentación","Sustituir la fuente que no entrega los valores requeridos."},
                {"Reinicio y reconfiguración de decodificador","Reiniciar, validar configuración y restablecer operación del decodificador."},
                {"Reemplazo de decodificador","Sustituir el decodificador cuando la falla del equipo es persistente."},
                {"Restablecer señal del decodificador","Verificar entrada coaxial, configuración y recepción de señal del equipo."},
                {"Reinstalación de tarjeta","Retirar, limpiar contactos e insertar correctamente la tarjeta."},
                {"Reemplazo de tarjeta","Sustituir la tarjeta defectuosa o no reconocida por una operativa."},
                {"Ajuste de fijación de antena","Asegurar la base y los puntos de fijación de la antena para evitar movimientos."},
                {"Corrección de humedad o corrosión","Limpiar, rehacer y proteger la conexión afectada por humedad o corrosión."},
                {"Revisión y ajuste de niveles de señal","Verificar niveles, conexiones y orientación hasta estabilizar la recepción."},
                {"Reemplazo de amplificador","Sustituir el amplificador cuando presenta falla o nivel de salida inadecuado."},
                {"Restablecer señal en amplificador","Verificar alimentación, entrada, salida y conexiones del amplificador."},
                {"Revisión o reemplazo de amplificador de cabecera","Verificar alimentación, niveles de entrada y salida y reemplazar el amplificador de cabecera si está defectuoso."},
                {"Saneamiento y reemplazo de tramo deteriorado","Retirar el tramo coaxial afectado por intemperie o humedad e instalar cable nuevo."},
                {"Corrección de tendido coaxial","Reubicar o sustituir el tramo aplastado, tensionado o mal instalado."},
                {"Rehacer conector F","Retirar la terminación defectuosa y realizar nuevamente el conector con el ajuste correcto."},
                {"Limpieza y protección de conexión","Eliminar corrosión o humedad, rehacer la conexión y aplicar protección exterior."},
                {"Reemplazo de soporte de antena","Sustituir el brazo o soporte deformado y asegurar nuevamente la antena."},
                {"Reemplazo de LNB por humedad","Sustituir el LNB afectado y proteger adecuadamente sus conexiones."},
                {"Verificación y reemplazo de TAP","Medir entrada/salidas y sustituir el TAP si presenta pérdida excesiva."},
                {"Restablecer alimentación del amplificador","Verificar fuente, alimentación y conexiones eléctricas del amplificador."},
                {"Ajuste de nivel del amplificador","Medir y ajustar niveles de entrada y salida dentro del rango operativo."},
                {"Revisión de alimentación y reemplazo de decodificador","Verificar fuente y alimentación; reemplazar el equipo si persisten reinicios."},
                {"Reparación o reemplazo de entrada coaxial del decodificador","Corregir la conexión de entrada o sustituir el equipo si el puerto está dañado."}
            };
            List<Solucion> existentesS = solucionRepo.findAll();
            for (Object[] d : datosSol) {
                String nombre = (String)d[0];
                Solucion s = existentesS.stream().filter(x -> nombre.equalsIgnoreCase(x.getNombreSolucion())).findFirst().orElse(null);
                if (s == null) { s = new Solucion(); s.setNombreSolucion(nombre); s.setDescripcion((String)d[1]); s.setEstado(true); s = solucionRepo.save(s); existentesS.add(s); }
                soluciones.put(nombre, s);
            }

            Object[][] datosMat = {
                {"Cable coaxial RG6","Cable coaxial para distribución de señal satelital.","Metro",100},
                {"Conector F para RG6","Conector para terminación de cable coaxial RG6.","Unidad",100},
                {"LNB universal","LNB para recepción de señal satelital.","Unidad",15},
                {"Switch satelital","Switch para distribución de señal.","Unidad",10},
                {"TAP satelital","Elemento pasivo para derivación/distribución de señal.","Unidad",15},
                {"Fuente de alimentación","Fuente para equipos del sistema de distribución.","Unidad",15},
                {"Cable de alimentación eléctrica","Cable para alimentación de equipos.","Metro",50},
                {"Clavija eléctrica","Clavija para terminación de alimentación.","Unidad",30},
                {"Decodificador satelital","Equipo receptor/decodificador del servicio.","Unidad",10},
                {"Tarjeta de acceso","Tarjeta asociada al servicio del decodificador.","Unidad",20},
                {"Protector para conector exterior","Protección contra humedad para conexiones exteriores.","Unidad",50},
                {"Abrazadera para cable","Elemento de fijación para tendido de cable.","Unidad",100},
                {"Acoplador F hembra-hembra","Acoplador para unión de tramos coaxiales.","Unidad",30},
                {"Terminal eléctrico","Terminal para conexión segura de alimentación.","Unidad",50},
                {"Soporte de antena","Elemento de fijación para antena satelital.","Unidad",8},
                {"Chazo para fijación de antena","Chazo utilizado para asegurar la base o soporte de la antena.","Unidad",100},
                {"Grapa para cable coaxial","Grapa para fijar y organizar el tendido de cable coaxial.","Unidad",150},
                {"Plato de antena satelital","Reflector o plato principal de la antena satelital.","Unidad",10},
                {"Tornillo o perno de fijación","Elemento de fijación para soporte y estructura de antena.","Unidad",100},
                {"Amplificador satelital","Amplificador utilizado en la distribución de señal.","Unidad",10},
                {"Amplificador de cabecera","Amplificador utilizado en cabecera o red principal de distribución.","Unidad",6},
                {"Cable coaxial RG11","Cable coaxial para tramos de distribución de mayor distancia.","Metro",100},
                {"Conector F de compresión RG6","Conector de compresión para terminación profesional de RG6.","Unidad",100},
                {"Conector F para RG11","Conector para terminación de cable coaxial RG11.","Unidad",50},
                {"Cinta autofundente","Cinta para sellado y protección de conexiones exteriores.","Rollo",20},
                {"Cinta aislante","Cinta para protección y organización de conexiones.","Rollo",30},
                {"Divisor satelital 2 vías","Elemento de distribución compatible con la instalación.","Unidad",20},
                {"Divisor satelital 4 vías","Elemento de distribución de cuatro salidas.","Unidad",15},
                {"Multiswitch satelital","Equipo para distribución de señal hacia múltiples puntos.","Unidad",10},
                {"Brazo para antena satelital","Brazo o soporte estructural para montaje de antena.","Unidad",10},
                {"Kit de tornillería para antena","Conjunto de tornillos, tuercas y arandelas para fijación.","Kit",20},
                {"Fuente para amplificador","Fuente de alimentación destinada al amplificador de distribución.","Unidad",15},
                {"Adaptador coaxial F","Adaptador para interconexión coaxial tipo F.","Unidad",40}
            };
            List<Material> existentesM = materialRepo.findAll();
            for (Object[] d : datosMat) {
                String nombre = (String)d[0];
                if (existentesM.stream().noneMatch(x -> nombre.equalsIgnoreCase(x.getNombreMaterial()))) {
                    Material m = new Material(); m.setNombreMaterial(nombre); m.setDescripcion((String)d[1]); m.setUnidadMedida((String)d[2]); m.setCantidadStock(new BigDecimal(String.valueOf(d[3]))); m.setEstado(true); materialRepo.save(m); existentesM.add(m);
                }
            }

            String[][] mapa = {
                {"Antena desalineada","Realineación de antena"},{"Antena con daño físico","Reparación o reemplazo de antena"},
                {"LNB sin señal","Reemplazo de LNB"},{"LNB defectuoso","Reemplazo de LNB"},{"Conexión de LNB defectuosa","Rehacer conexión de LNB"},
                {"Puerto de switch defectuoso","Cambio de puerto de switch"},{"Switch sin funcionamiento","Reemplazo de switch"},{"Switch sin alimentación","Restablecer alimentación de switch"},
                {"TAP defectuoso","Reemplazo de TAP"},{"Puerto de TAP defectuoso","Cambio de puerto de TAP"},{"TAP sin señal de entrada","Restablecer señal de entrada al TAP"},
                {"Cable coaxial dañado","Reemplazo de tramo coaxial"},{"Cable coaxial fracturado o cortado","Reemplazo de tramo coaxial"},{"Cable coaxial desconectado","Reconexión de cable coaxial"},{"Conector coaxial defectuoso","Reemplazo de conector coaxial"},{"Pérdida de señal por cable coaxial","Corrección de pérdida en coaxial"},
                {"Toma eléctrica sin energía","Restablecer energía en toma"},{"Cable eléctrico dañado","Reemplazo de cable eléctrico"},{"Fuente de alimentación defectuosa","Reemplazo de fuente de alimentación"},
                {"Decodificador sin encender","Reemplazo de fuente de alimentación"},{"Decodificador sin encender","Reemplazo de decodificador"},{"Decodificador sin señal","Restablecer señal del decodificador"},{"Decodificador defectuoso","Reemplazo de decodificador"},{"Decodificador bloqueado","Reinicio y reconfiguración de decodificador"},
                {"Tarjeta mal insertada","Reinstalación de tarjeta"},{"Tarjeta no reconocida","Reinstalación de tarjeta"},{"Tarjeta no reconocida","Reemplazo de tarjeta"},{"Tarjeta defectuosa","Reemplazo de tarjeta"},
                {"Señal débil","Realineación de antena"},{"Señal débil","Corrección de pérdida en coaxial"},{"Pérdida total de señal","Realineación de antena"},{"Pérdida total de señal","Reemplazo de LNB"},
                {"Señal intermitente","Revisión y ajuste de niveles de señal"},{"Señal intermitente","Corrección de pérdida en coaxial"},
                {"Pixelación o congelamiento de imagen","Revisión y ajuste de niveles de señal"},{"Pixelación o congelamiento de imagen","Realineación de antena"},
                {"Fijación de antena floja","Ajuste de fijación de antena"},
                {"Humedad o corrosión en conexión","Corrección de humedad o corrosión"},{"Humedad o corrosión en conexión","Reemplazo de conector coaxial"},
                {"Amplificador sin señal","Restablecer señal en amplificador"},{"Amplificador sin señal","Reemplazo de amplificador"},
                {"Amplificador defectuoso","Reemplazo de amplificador"},
                {"Amplificador de cabecera defectuoso","Revisión o reemplazo de amplificador de cabecera"},
                {"Cable coaxial deteriorado por intemperie","Saneamiento y reemplazo de tramo deteriorado"},
                {"Cable coaxial con humedad","Saneamiento y reemplazo de tramo deteriorado"},
                {"Cable coaxial aplastado o deformado","Corrección de tendido coaxial"},
                {"Conector F flojo","Rehacer conector F"},{"Conector mal ponchado","Rehacer conector F"},{"Conector F sulfatado","Limpieza y protección de conexión"},
                {"Brazo o soporte de antena deformado","Reemplazo de soporte de antena"},
                {"LNB con ingreso de humedad","Reemplazo de LNB por humedad"},{"LNB con nivel inestable","Reemplazo de LNB"},
                {"TAP con pérdida excesiva","Verificación y reemplazo de TAP"},{"TAP con conexión deteriorada","Reemplazo de TAP"},
                {"Amplificador sin alimentación","Restablecer alimentación del amplificador"},{"Amplificador con nivel de salida bajo","Ajuste de nivel del amplificador"},
                {"Decodificador reinicia constantemente","Revisión de alimentación y reemplazo de decodificador"},
                {"Decodificador con puerto coaxial defectuoso","Reparación o reemplazo de entrada coaxial del decodificador"}
            };
            List<TipoFallaSolucion> relaciones = relacionRepo.findAll();
            for (String[] par : mapa) {
                TipoFalla f = fallas.get(par[0]); Solucion s = soluciones.get(par[1]);
                if (f == null || s == null) continue;
                boolean existe = relaciones.stream().anyMatch(r -> Objects.equals(r.getIdTipoFalla(), f.getIdTipoFalla()) && Objects.equals(r.getIdSolucion(), s.getIdSolucion()));
                if (!existe) { TipoFallaSolucion r = new TipoFallaSolucion(); r.setIdTipoFalla(f.getIdTipoFalla()); r.setIdSolucion(s.getIdSolucion()); relacionRepo.save(r); relaciones.add(r); }
            }
        };
    }
}
