package com.controlfallas.controlfallassatelital.controller;

import com.controlfallas.controlfallassatelital.entity.AsistenciaFalla;
import com.controlfallas.controlfallassatelital.service.AsistenciaFallaService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/asistencia-fallas")
@CrossOrigin(origins = "*")
public class AsistenciaFallaController {

    private final AsistenciaFallaService asistenciaFallaService;

    public AsistenciaFallaController(
            AsistenciaFallaService asistenciaFallaService) {

        this.asistenciaFallaService = asistenciaFallaService;
    }

    @PostMapping
    public ResponseEntity<AsistenciaFalla> crear(
            @RequestBody AsistenciaFalla asistenciaFalla) {

        return ResponseEntity.ok(
                asistenciaFallaService.crear(asistenciaFalla)
        );
    }

    @GetMapping
    public ResponseEntity<List<AsistenciaFalla>> listar() {

        return ResponseEntity.ok(
                asistenciaFallaService.listar()
        );
    }

    @GetMapping("/asistencia/{idAsistencia}")
    public ResponseEntity<List<AsistenciaFalla>> listarPorAsistencia(
            @PathVariable Integer idAsistencia) {

        return ResponseEntity.ok(
                asistenciaFallaService.listarPorAsistencia(idAsistencia)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<AsistenciaFalla> buscarPorId(
            @PathVariable Integer id) {

        return asistenciaFallaService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(
                        () -> ResponseEntity.notFound().build()
                );
    }

    @PutMapping("/{id}")
    public ResponseEntity<AsistenciaFalla> actualizar(
            @PathVariable Integer id,
            @RequestBody AsistenciaFalla asistenciaFalla) {

        return asistenciaFallaService
                .actualizar(id, asistenciaFalla)
                .map(ResponseEntity::ok)
                .orElseGet(
                        () -> ResponseEntity.notFound().build()
                );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(
            @PathVariable Integer id) {

        if (!asistenciaFallaService.eliminar(id)) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}