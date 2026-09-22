package com.controlfallas.controlfallassatelital.service;

import com.controlfallas.controlfallassatelital.entity.AsistenciaFalla;
import com.controlfallas.controlfallassatelital.repository.AsistenciaFallaRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AsistenciaFallaService {

    private final AsistenciaFallaRepository asistenciaFallaRepository;

    public AsistenciaFallaService(
            AsistenciaFallaRepository asistenciaFallaRepository) {

        this.asistenciaFallaRepository = asistenciaFallaRepository;
    }

    public AsistenciaFalla crear(AsistenciaFalla asistenciaFalla) {
        return asistenciaFallaRepository.save(asistenciaFalla);
    }

    public List<AsistenciaFalla> listar() {
        return asistenciaFallaRepository.findAll();
    }

    public List<AsistenciaFalla> listarPorAsistencia(Integer idAsistencia) {
        return asistenciaFallaRepository.findByIdAsistencia(idAsistencia);
    }

    public Optional<AsistenciaFalla> buscarPorId(Integer id) {
        return asistenciaFallaRepository.findById(id);
    }

    public Optional<AsistenciaFalla> actualizar(
            Integer id,
            AsistenciaFalla datos) {

        return asistenciaFallaRepository.findById(id)
                .map(asistencia -> {

                    asistencia.setIdAsistencia(
                            datos.getIdAsistencia()
                    );

                    asistencia.setIdTipoFalla(
                            datos.getIdTipoFalla()
                    );

                    asistencia.setDetalle(
                            datos.getDetalle()
                    );

                    return asistenciaFallaRepository.save(asistencia);
                });
    }

    public boolean eliminar(Integer id) {

        if (!asistenciaFallaRepository.existsById(id)) {
            return false;
        }

        asistenciaFallaRepository.deleteById(id);
        return true;
    }
}