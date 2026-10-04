package com.controlfallas.controlfallassatelital.controller;

import com.controlfallas.controlfallassatelital.entity.OrdenServicio;
import com.controlfallas.controlfallassatelital.service.OrdenServicioService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ordenes-servicio")
@CrossOrigin(origins = "*")
public class OrdenServicioController {

    private final OrdenServicioService ordenServicioService;

    public OrdenServicioController(
            OrdenServicioService ordenServicioService) {

        this.ordenServicioService = ordenServicioService;
    }

    // CREAR
    @PostMapping
    public ResponseEntity<OrdenServicio> crear(
            @RequestBody OrdenServicio ordenServicio) {

        return ResponseEntity.ok(
                ordenServicioService.crear(ordenServicio)
        );
    }

    // LISTAR
    @GetMapping
    public ResponseEntity<List<OrdenServicio>> listar() {

        return ResponseEntity.ok(
                ordenServicioService.listar()
        );
    }

    // BUSCAR POR ID
    @GetMapping("/{id}")
    public ResponseEntity<OrdenServicio> buscarPorId(
            @PathVariable Integer id) {

        return ordenServicioService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(
                        () -> ResponseEntity.notFound().build()
                );
    }

    // ACTUALIZAR
    @PutMapping("/{id}")
    public ResponseEntity<OrdenServicio> actualizar(
            @PathVariable Integer id,
            @RequestBody OrdenServicio ordenServicio) {

        return ordenServicioService
                .actualizar(id, ordenServicio)
                .map(ResponseEntity::ok)
                .orElseGet(
                        () -> ResponseEntity.notFound().build()
                );
    }

    // ELIMINAR
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(
            @PathVariable Integer id) {

        if (!ordenServicioService.eliminar(id)) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}