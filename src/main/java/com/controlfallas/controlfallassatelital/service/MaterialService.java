package com.controlfallas.controlfallassatelital.service;

import com.controlfallas.controlfallassatelital.entity.Material;
import com.controlfallas.controlfallassatelital.repository.MaterialRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MaterialService {

    private final MaterialRepository repository;

    public MaterialService(MaterialRepository repository) {
        this.repository = repository;
    }

    public Material crear(Material material) {
        return repository.save(material);
    }

    public List<Material> listar() {
        return repository.findAll();
    }

    public Optional<Material> buscarPorId(Integer id) {
        return repository.findById(id);
    }

    public Optional<Material> actualizar(Integer id, Material datos) {

        return repository.findById(id)
                .map(material -> {

                    material.setNombreMaterial(datos.getNombreMaterial());
                    material.setDescripcion(datos.getDescripcion());
                    material.setUnidadMedida(datos.getUnidadMedida());
                    material.setCantidadStock(datos.getCantidadStock());
                    material.setEstado(datos.getEstado());

                    return repository.save(material);
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