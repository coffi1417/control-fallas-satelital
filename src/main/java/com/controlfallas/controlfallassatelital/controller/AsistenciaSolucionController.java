package com.controlfallas.controlfallassatelital.controller;

import com.controlfallas.controlfallassatelital.entity.AsistenciaSolucion;
import com.controlfallas.controlfallassatelital.service.AsistenciaSolucionService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/asistencia-soluciones")
@CrossOrigin(origins = "*")
public class AsistenciaSolucionController {

    private final AsistenciaSolucionService service;

    public AsistenciaSolucionController(AsistenciaSolucionService service) {
        this.service = service;
    }

    @PostMapping
    public AsistenciaSolucion crear(
            @RequestBody AsistenciaSolucion datos) {

        return service.crear(datos);
    }

    @GetMapping
    public List<AsistenciaSolucion> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public ResponseEntity<AsistenciaSolucion> buscarPorId(
            @PathVariable Integer id) {

        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<AsistenciaSolucion> actualizar(
            @PathVariable Integer id,
            @RequestBody AsistenciaSolucion datos) {

        return service.actualizar(id, datos)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(
            @PathVariable Integer id) {

        if (!service.eliminar(id)) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}