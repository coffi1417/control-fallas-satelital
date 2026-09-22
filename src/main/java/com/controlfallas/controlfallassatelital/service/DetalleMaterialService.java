package com.controlfallas.controlfallassatelital.service;

import com.controlfallas.controlfallassatelital.entity.DetalleMaterial;
import com.controlfallas.controlfallassatelital.repository.DetalleMaterialRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DetalleMaterialService {

    private final DetalleMaterialRepository repository;

    public DetalleMaterialService(DetalleMaterialRepository repository) {
        this.repository = repository;
    }

    public DetalleMaterial crear(DetalleMaterial detalle) {
        return repository.save(detalle);
    }

    public List<DetalleMaterial> listar() {
        return repository.findAll();
    }

    public Optional<DetalleMaterial> buscarPorId(Integer id) {
        return repository.findById(id);
    }

    public Optional<DetalleMaterial> actualizar(
            Integer id,
            DetalleMaterial datos) {

        return repository.findById(id)
                .map(detalle -> {
                    detalle.setIdAsistencia(datos.getIdAsistencia());
                    detalle.setIdMaterial(datos.getIdMaterial());
                    detalle.setCantidadUtilizada(datos.getCantidadUtilizada());
                    detalle.setObservaciones(datos.getObservaciones());

                    return repository.save(detalle);
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