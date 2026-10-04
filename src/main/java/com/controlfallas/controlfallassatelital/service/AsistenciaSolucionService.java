package com.controlfallas.controlfallassatelital.service;

import com.controlfallas.controlfallassatelital.entity.AsistenciaSolucion;
import com.controlfallas.controlfallassatelital.repository.AsistenciaSolucionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AsistenciaSolucionService {

    private final AsistenciaSolucionRepository repository;

    public AsistenciaSolucionService(AsistenciaSolucionRepository repository) {
        this.repository = repository;
    }

    public AsistenciaSolucion crear(AsistenciaSolucion datos) {
        return repository.save(datos);
    }

    public List<AsistenciaSolucion> listar() {
        return repository.findAll();
    }

    public Optional<AsistenciaSolucion> buscarPorId(Integer id) {
        return repository.findById(id);
    }

    public Optional<AsistenciaSolucion> actualizar(
            Integer id,
            AsistenciaSolucion datos) {

        return repository.findById(id)
                .map(asistenciaSolucion -> {

                    asistenciaSolucion.setIdAsistencia(
                            datos.getIdAsistencia());

                    asistenciaSolucion.setIdSolucion(
                            datos.getIdSolucion());

                    asistenciaSolucion.setDetalle(
                            datos.getDetalle());

                    return repository.save(asistenciaSolucion);
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