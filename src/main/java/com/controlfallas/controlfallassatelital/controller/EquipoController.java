package com.controlfallas.controlfallassatelital.controller;

import com.controlfallas.controlfallassatelital.entity.Equipo;
import com.controlfallas.controlfallassatelital.service.EquipoService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/equipos")
@CrossOrigin(origins = "*")
public class EquipoController {

    private final EquipoService equipoService;

    public EquipoController(EquipoService equipoService) {
        this.equipoService = equipoService;
    }

    @PostMapping
    public ResponseEntity<Equipo> crear(@RequestBody Equipo equipo) {
        return ResponseEntity.ok(equipoService.crearEquipo(equipo));
    }

    @GetMapping
    public ResponseEntity<List<Equipo>> listar() {
        return ResponseEntity.ok(equipoService.listarEquipos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Equipo> buscarPorId(@PathVariable Integer id) {
        return equipoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Equipo> actualizar(
            @PathVariable Integer id,
            @RequestBody Equipo equipo) {

        return equipoService.actualizarEquipo(id, equipo)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {

        if (!equipoService.eliminarEquipo(id)) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}