package com.controlfallas.controlfallassatelital.controller;

import com.controlfallas.controlfallassatelital.entity.DetalleMaterial;
import com.controlfallas.controlfallassatelital.service.DetalleMaterialService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/detalle-materiales")
@CrossOrigin(origins = "*")
public class DetalleMaterialController {

    private final DetalleMaterialService service;

    public DetalleMaterialController(DetalleMaterialService service) {
        this.service = service;
    }

    @PostMapping
    public DetalleMaterial crear(@RequestBody DetalleMaterial detalle) {
        return service.crear(detalle);
    }

    @GetMapping
    public List<DetalleMaterial> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DetalleMaterial> buscarPorId(
            @PathVariable Integer id) {

        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<DetalleMaterial> actualizar(
            @PathVariable Integer id,
            @RequestBody DetalleMaterial datos) {

        return service.actualizar(id, datos)
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