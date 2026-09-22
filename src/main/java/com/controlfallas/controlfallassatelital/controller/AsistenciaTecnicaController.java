package com.controlfallas.controlfallassatelital.controller;

import com.controlfallas.controlfallassatelital.entity.AsistenciaTecnica;
import com.controlfallas.controlfallassatelital.service.AsistenciaTecnicaService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/asistencias-tecnicas")
@CrossOrigin(origins = "*")
public class AsistenciaTecnicaController {

    private final AsistenciaTecnicaService asistenciaTecnicaService;

    public AsistenciaTecnicaController(
            AsistenciaTecnicaService asistenciaTecnicaService) {

        this.asistenciaTecnicaService = asistenciaTecnicaService;
    }

    @PostMapping
    public ResponseEntity<AsistenciaTecnica> crear(
            @RequestBody AsistenciaTecnica asistencia) {

        return ResponseEntity.ok(
                asistenciaTecnicaService.crear(asistencia)
        );
    }

    @GetMapping
    public ResponseEntity<List<AsistenciaTecnica>> listar() {

        return ResponseEntity.ok(
                asistenciaTecnicaService.listar()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<AsistenciaTecnica> buscarPorId(
            @PathVariable Integer id) {

        return asistenciaTecnicaService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<AsistenciaTecnica> actualizar(
            @PathVariable Integer id,
            @RequestBody AsistenciaTecnica asistencia) {

        return asistenciaTecnicaService
                .actualizar(id, asistencia)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(
            @PathVariable Integer id) {

        if (!asistenciaTecnicaService.eliminar(id)) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}