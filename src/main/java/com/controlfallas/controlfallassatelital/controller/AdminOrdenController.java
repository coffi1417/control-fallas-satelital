package com.controlfallas.controlfallassatelital.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/admin/ordenes")
public class AdminOrdenController {

    private final JdbcTemplate jdbc;

    public AdminOrdenController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> eliminarOrden(
            @PathVariable Integer id,
            @RequestHeader(value = "X-User-Role", required = false) String rol) {

        if (!esAdministrador(rol)) {
            return ResponseEntity.status(403)
                    .body(Map.of("error", "Solo el administrador puede eliminar órdenes."));
        }

        Integer existe = jdbc.queryForObject(
                "SELECT COUNT(*) FROM ordenes_servicio WHERE id_orden = ?",
                Integer.class,
                id
        );

        if (existe == null || existe == 0) {
            return ResponseEntity.notFound().build();
        }

        eliminarDependenciasOrden(id);
        jdbc.update("DELETE FROM ordenes_servicio WHERE id_orden = ?", id);

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/datos-prueba")
    @Transactional
    public ResponseEntity<?> limpiarDatosPrueba(
            @RequestHeader(value = "X-User-Role", required = false) String rol) {

        if (!esAdministrador(rol)) {
            return ResponseEntity.status(403)
                    .body(Map.of("error", "Solo el administrador puede limpiar los datos de prueba."));
        }

        // Se conservan usuarios de acceso, técnicos y catálogos de fallas,
        // soluciones y materiales. Se eliminan únicamente datos operativos.
        jdbc.update("DELETE FROM detalle_materiales");
        jdbc.update("DELETE FROM asistencia_fallas");
        jdbc.update("DELETE FROM asistencia_soluciones");
        jdbc.update("DELETE FROM asistencias_tecnicas");
        jdbc.update("DELETE FROM ordenes_servicio");
        jdbc.update("DELETE FROM instalacion_equipos");
        jdbc.update("DELETE FROM instalaciones");
        jdbc.update("DELETE FROM clientes");

        return ResponseEntity.ok(Map.of(
                "mensaje", "Datos de prueba eliminados correctamente. Los catálogos, técnicos y usuarios de acceso se conservaron."
        ));
    }

    private boolean esAdministrador(String rol) {
        return "ADMINISTRADOR".equalsIgnoreCase(rol);
    }

    private void eliminarDependenciasOrden(Integer idOrden) {
        jdbc.update("DELETE dm FROM detalle_materiales dm " +
                "JOIN asistencias_tecnicas a ON a.id_asistencia = dm.id_asistencia " +
                "WHERE a.id_orden = ?", idOrden);
        jdbc.update("DELETE af FROM asistencia_fallas af " +
                "JOIN asistencias_tecnicas a ON a.id_asistencia = af.id_asistencia " +
                "WHERE a.id_orden = ?", idOrden);
        jdbc.update("DELETE aso FROM asistencia_soluciones aso " +
                "JOIN asistencias_tecnicas a ON a.id_asistencia = aso.id_asistencia " +
                "WHERE a.id_orden = ?", idOrden);
        jdbc.update("DELETE FROM asistencias_tecnicas WHERE id_orden = ?", idOrden);
    }
}
