package com.controlfallas.controlfallassatelital.controller;

import com.controlfallas.controlfallassatelital.entity.Instalacion;
import com.controlfallas.controlfallassatelital.service.InstalacionService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/instalaciones")
@CrossOrigin(origins = "*")
public class InstalacionController {

    private final InstalacionService instalacionService;

    public InstalacionController(
            InstalacionService instalacionService) {

        this.instalacionService = instalacionService;
    }


    // CREAR
    @PostMapping
    public ResponseEntity<Instalacion> crear(
            @RequestBody Instalacion instalacion) {

        return ResponseEntity.ok(
                instalacionService.crearInstalacion(instalacion)
        );
    }


    // LISTAR
    @GetMapping
    public ResponseEntity<List<Instalacion>> listar() {

        return ResponseEntity.ok(
                instalacionService.listarInstalaciones()
        );
    }


    // BUSCAR POR ID
    @GetMapping("/{id}")
    public ResponseEntity<Instalacion> buscarPorId(
            @PathVariable Integer id) {

        return instalacionService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(
                        () -> ResponseEntity.notFound().build()
                );
    }


    // ACTUALIZAR
    @PutMapping("/{id}")
    public ResponseEntity<Instalacion> actualizar(
            @PathVariable Integer id,
            @RequestBody Instalacion instalacion) {

        return instalacionService
                .actualizarInstalacion(id, instalacion)
                .map(ResponseEntity::ok)
                .orElseGet(
                        () -> ResponseEntity.notFound().build()
                );
    }


    // ELIMINAR
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(
            @PathVariable Integer id) {

        if (!instalacionService.eliminarInstalacion(id)) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}