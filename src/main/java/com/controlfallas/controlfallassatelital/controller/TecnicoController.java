package com.controlfallas.controlfallassatelital.controller;

import com.controlfallas.controlfallassatelital.entity.Tecnico;
import com.controlfallas.controlfallassatelital.service.TecnicoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tecnicos")
@CrossOrigin(origins = "*")
public class TecnicoController {

    @Autowired
    private TecnicoService tecnicoService;

    // LISTAR
    @GetMapping
    public ResponseEntity<List<Tecnico>> listarTecnicos() {
        return ResponseEntity.ok(
                tecnicoService.listarTecnicos()
        );
    }

    // BUSCAR POR ID
    @GetMapping("/{id}")
    public ResponseEntity<Tecnico> buscarTecnicoPorId(
            @PathVariable Integer id) {

        Tecnico tecnico =
                tecnicoService.buscarTecnicoPorId(id);

        if (tecnico == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(tecnico);
    }

    // CREAR
    @PostMapping
    public ResponseEntity<Tecnico> crearTecnico(
            @RequestBody Tecnico tecnico) {

        Tecnico tecnicoGuardado =
                tecnicoService.guardarTecnico(tecnico);

        return ResponseEntity.ok(tecnicoGuardado);
    }

    // ACTUALIZAR
    @PutMapping("/{id}")
    public ResponseEntity<Tecnico> actualizarTecnico(
            @PathVariable Integer id,
            @RequestBody Tecnico tecnico) {

        Tecnico actualizado =
                tecnicoService.actualizarTecnico(id, tecnico);

        if (actualizado == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(actualizado);
    }

    // ELIMINAR
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarTecnico(
            @PathVariable Integer id) {

        boolean eliminado =
                tecnicoService.eliminarTecnico(id);

        if (!eliminado) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}