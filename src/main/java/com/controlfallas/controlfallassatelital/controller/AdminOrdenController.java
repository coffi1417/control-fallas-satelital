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
    public AdminOrdenController(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> eliminarOrdenResuelta(@PathVariable Integer id, @RequestHeader(value="X-User-Role", required=false) String rol) {
        if (!"ADMINISTRADOR".equalsIgnoreCase(rol)) return ResponseEntity.status(403).body(Map.of("error","Solo el administrador puede eliminar órdenes."));
        Integer existe = jdbc.queryForObject("SELECT COUNT(*) FROM ordenes_servicio WHERE id_orden=?", Integer.class, id);
        if (existe == null || existe == 0) return ResponseEntity.notFound().build();
        String estado = jdbc.queryForObject("SELECT estado FROM ordenes_servicio WHERE id_orden=?", String.class, id);
        if (!("CERRADA".equalsIgnoreCase(estado) || "FINALIZADO".equalsIgnoreCase(estado) || "RESUELTO".equalsIgnoreCase(estado)))
            return ResponseEntity.badRequest().body(Map.of("error","Solo se pueden eliminar órdenes resueltas."));
        jdbc.update("DELETE dm FROM detalle_materiales dm JOIN asistencias_tecnicas a ON a.id_asistencia=dm.id_asistencia WHERE a.id_orden=?", id);
        jdbc.update("DELETE af FROM asistencia_fallas af JOIN asistencias_tecnicas a ON a.id_asistencia=af.id_asistencia WHERE a.id_orden=?", id);
        jdbc.update("DELETE aso FROM asistencia_soluciones aso JOIN asistencias_tecnicas a ON a.id_asistencia=aso.id_asistencia WHERE a.id_orden=?", id);
        jdbc.update("DELETE FROM asistencias_tecnicas WHERE id_orden=?", id);
        jdbc.update("DELETE FROM ordenes_servicio WHERE id_orden=?", id);
        return ResponseEntity.noContent().build();
    }
}
