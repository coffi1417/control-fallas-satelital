package com.controlfallas.controlfallassatelital.service;

import com.controlfallas.controlfallassatelital.entity.TipoFalla;
import com.controlfallas.controlfallassatelital.repository.TipoFallaRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TipoFallaService {

    @Autowired
    private TipoFallaRepository tipoFallaRepository;


    // =========================
    // LISTAR TODOS
    // =========================
    public List<TipoFalla> listarTiposFalla() {
        return tipoFallaRepository.findAll();
    }


    // =========================
    // BUSCAR POR ID
    // =========================
    public TipoFalla buscarPorId(Integer id) {
        return tipoFallaRepository.findById(id).orElse(null);
    }


    // =========================
    // CREAR
    // =========================
    public TipoFalla guardarTipoFalla(TipoFalla tipoFalla) {
        return tipoFallaRepository.save(tipoFalla);
    }


    // =========================
    // ACTUALIZAR
    // =========================
    public TipoFalla actualizarTipoFalla(
            Integer id,
            TipoFalla tipoFallaActualizado) {

        TipoFalla tipoFallaExistente =
                tipoFallaRepository.findById(id).orElse(null);

        if (tipoFallaExistente == null) {
            return null;
        }

        tipoFallaExistente.setNombreFalla(
                tipoFallaActualizado.getNombreFalla()
        );

        tipoFallaExistente.setDescripcion(
                tipoFallaActualizado.getDescripcion()
        );

        tipoFallaExistente.setCategoria(
                tipoFallaActualizado.getCategoria()
        );

        tipoFallaExistente.setEstado(
                tipoFallaActualizado.getEstado()
        );

        return tipoFallaRepository.save(tipoFallaExistente);
    }


    // =========================
    // ELIMINAR
    // =========================
    public boolean eliminarTipoFalla(Integer id) {

        if (!tipoFallaRepository.existsById(id)) {
            return false;
        }

        tipoFallaRepository.deleteById(id);
        return true;
    }
}