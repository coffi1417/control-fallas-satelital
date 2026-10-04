package com.controlfallas.controlfallassatelital.service;

import com.controlfallas.controlfallassatelital.entity.Solucion;
import com.controlfallas.controlfallassatelital.repository.SolucionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SolucionService {

    private final SolucionRepository solucionRepository;

    public SolucionService(SolucionRepository solucionRepository) {
        this.solucionRepository = solucionRepository;
    }

    public Solucion crear(Solucion solucion) {
        return solucionRepository.save(solucion);
    }

    public List<Solucion> listar() {
        return solucionRepository.findAll();
    }

    public Optional<Solucion> buscarPorId(Integer id) {
        return solucionRepository.findById(id);
    }

    public Optional<Solucion> actualizar(Integer id, Solucion datos) {
        return solucionRepository.findById(id)
                .map(solucion -> {
                    solucion.setNombreSolucion(datos.getNombreSolucion());
                    solucion.setDescripcion(datos.getDescripcion());
                    solucion.setEstado(datos.getEstado());

                    return solucionRepository.save(solucion);
                });
    }

    public boolean eliminar(Integer id) {
        if (!solucionRepository.existsById(id)) {
            return false;
        }

        solucionRepository.deleteById(id);
        return true;
    }
}