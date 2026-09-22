package com.controlfallas.controlfallassatelital.controller;

import com.controlfallas.controlfallassatelital.entity.InstalacionEquipo;
import com.controlfallas.controlfallassatelital.service.InstalacionEquipoService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/instalacion-equipos")
@CrossOrigin(origins = "*")
public class InstalacionEquipoController {

    private final InstalacionEquipoService service;

    public InstalacionEquipoController(InstalacionEquipoService service) {
        this.service = service;
    }

    @PostMapping
    public InstalacionEquipo crear(@RequestBody InstalacionEquipo datos) {
        return service.crear(datos);
    }

    @GetMapping
    public List<InstalacionEquipo> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public ResponseEntity<InstalacionEquipo> buscarPorId(
            @PathVariable Integer id) {

        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<InstalacionEquipo> actualizar(
            @PathVariable Integer id,
            @RequestBody InstalacionEquipo datos) {

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