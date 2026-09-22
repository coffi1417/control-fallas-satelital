package com.controlfallas.controlfallassatelital.service;

import com.controlfallas.controlfallassatelital.entity.TipoFallaSolucion;
import com.controlfallas.controlfallassatelital.repository.TipoFallaSolucionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TipoFallaSolucionService {

    private final TipoFallaSolucionRepository repository;

    public TipoFallaSolucionService(TipoFallaSolucionRepository repository) {
        this.repository = repository;
    }

    public TipoFallaSolucion crear(TipoFallaSolucion relacion) {
        return repository.save(relacion);
    }

    public List<TipoFallaSolucion> listar() {
        return repository.findAll();
    }

    public Optional<TipoFallaSolucion> buscarPorId(Integer id) {
        return repository.findById(id);
    }

    public Optional<TipoFallaSolucion> actualizar(
            Integer id,
            TipoFallaSolucion datos) {

        return repository.findById(id)
                .map(relacion -> {
                    relacion.setIdTipoFalla(datos.getIdTipoFalla());
                    relacion.setIdSolucion(datos.getIdSolucion());
                    return repository.save(relacion);
                });
    }

    public boolean eliminar(Integer id) {
        if (!repository.existsById(id)) {
            return false;
        }

        repository.deleteById(id);
        return true;
    }
}