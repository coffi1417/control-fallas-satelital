package com.controlfallas.controlfallassatelital.controller;

import com.controlfallas.controlfallassatelital.entity.TipoFalla;
import com.controlfallas.controlfallassatelital.service.TipoFallaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tipos-falla")
@CrossOrigin(origins = "*")
public class TipoFallaController {

    @Autowired
    private TipoFallaService tipoFallaService;


    // =========================
    // LISTAR TODOS
    // =========================
    @GetMapping
    public ResponseEntity<List<TipoFalla>> listarTiposFalla() {

        return ResponseEntity.ok(
                tipoFallaService.listarTiposFalla()
        );
    }


    // =========================
    // BUSCAR POR ID
    // =========================
    @GetMapping("/{id}")
    public ResponseEntity<TipoFalla> buscarPorId(
            @PathVariable Integer id) {

        TipoFalla tipoFalla =
                tipoFallaService.buscarPorId(id);

        if (tipoFalla == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(tipoFalla);
    }


    // =========================
    // CREAR
    // =========================
    @PostMapping
    public ResponseEntity<TipoFalla> crearTipoFalla(
            @RequestBody TipoFalla tipoFalla) {

        TipoFalla nuevo =
                tipoFallaService.guardarTipoFalla(tipoFalla);

        return ResponseEntity.ok(nuevo);
    }


    // =========================
    // ACTUALIZAR
    // =========================
    @PutMapping("/{id}")
    public ResponseEntity<TipoFalla> actualizarTipoFalla(
            @PathVariable Integer id,
            @RequestBody TipoFalla tipoFalla) {

        TipoFalla actualizado =
                tipoFallaService.actualizarTipoFalla(
                        id,
                        tipoFalla
                );

        if (actualizado == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(actualizado);
    }


    // =========================
    // ELIMINAR
    // =========================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarTipoFalla(
            @PathVariable Integer id) {

        boolean eliminado =
                tipoFallaService.eliminarTipoFalla(id);

        if (!eliminado) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}