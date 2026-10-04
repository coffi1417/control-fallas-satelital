package com.controlfallas.controlfallassatelital.controller;

import com.controlfallas.controlfallassatelital.entity.TipoFallaSolucion;
import com.controlfallas.controlfallassatelital.service.TipoFallaSolucionService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tipo-falla-soluciones")
@CrossOrigin(origins = "*")
public class TipoFallaSolucionController {

    private final TipoFallaSolucionService service;

    public TipoFallaSolucionController(TipoFallaSolucionService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<TipoFallaSolucion> crear(
            @RequestBody TipoFallaSolucion relacion) {

        return ResponseEntity.ok(service.crear(relacion));
    }

    @GetMapping
    public ResponseEntity<List<TipoFallaSolucion>> listar() {
        return ResponseEntity.ok(service.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TipoFallaSolucion> buscarPorId(
            @PathVariable Integer id) {

        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<TipoFallaSolucion> actualizar(
            @PathVariable Integer id,
            @RequestBody TipoFallaSolucion relacion) {

        return service.actualizar(id, relacion)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {

        if (!service.eliminar(id)) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}
