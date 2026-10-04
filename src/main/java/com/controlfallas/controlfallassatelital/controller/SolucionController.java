package com.controlfallas.controlfallassatelital.controller;

import com.controlfallas.controlfallassatelital.entity.Solucion;
import com.controlfallas.controlfallassatelital.service.SolucionService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/soluciones")
@CrossOrigin(origins = "*")
public class SolucionController {

    private final SolucionService solucionService;

    public SolucionController(SolucionService solucionService) {
        this.solucionService = solucionService;
    }

    @PostMapping
    public ResponseEntity<Solucion> crear(@RequestBody Solucion solucion) {
        return ResponseEntity.ok(solucionService.crear(solucion));
    }

    @GetMapping
    public List<Solucion> listar() {
        return solucionService.listar();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Solucion> buscarPorId(@PathVariable Integer id) {
        return solucionService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Solucion> actualizar(
            @PathVariable Integer id,
            @RequestBody Solucion solucion) {

        return solucionService.actualizar(id, solucion)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {

        if (!solucionService.eliminar(id)) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}