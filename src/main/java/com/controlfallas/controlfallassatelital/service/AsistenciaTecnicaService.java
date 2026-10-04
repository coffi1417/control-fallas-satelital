package com.controlfallas.controlfallassatelital.service;

import com.controlfallas.controlfallassatelital.entity.AsistenciaTecnica;
import com.controlfallas.controlfallassatelital.repository.AsistenciaTecnicaRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AsistenciaTecnicaService {

    private final AsistenciaTecnicaRepository asistenciaTecnicaRepository;

    public AsistenciaTecnicaService(
            AsistenciaTecnicaRepository asistenciaTecnicaRepository) {

        this.asistenciaTecnicaRepository = asistenciaTecnicaRepository;
    }

    public AsistenciaTecnica crear(AsistenciaTecnica asistencia) {
        return asistenciaTecnicaRepository.save(asistencia);
    }

    public List<AsistenciaTecnica> listar() {
        return asistenciaTecnicaRepository.findAll();
    }

    public Optional<AsistenciaTecnica> buscarPorId(Integer id) {
        return asistenciaTecnicaRepository.findById(id);
    }

    public Optional<AsistenciaTecnica> actualizar(
            Integer id,
            AsistenciaTecnica datos) {

        return asistenciaTecnicaRepository.findById(id)
                .map(asistencia -> {

                    asistencia.setIdOrden(datos.getIdOrden());
                    asistencia.setIdTecnico(datos.getIdTecnico());
                    asistencia.setFechaAsistencia(datos.getFechaAsistencia());
                    asistencia.setHoraInicio(datos.getHoraInicio());
                    asistencia.setHoraFin(datos.getHoraFin());
                    asistencia.setDiagnostico(datos.getDiagnostico());
                    asistencia.setEstadoServicio(datos.getEstadoServicio());
                    asistencia.setTecnicoNombreRegistro(datos.getTecnicoNombreRegistro());
                    asistencia.setResultadoServicio(datos.getResultadoServicio());
                    asistencia.setObservaciones(datos.getObservaciones());
                    asistencia.setFirmaCliente(datos.getFirmaCliente());
                    asistencia.setEvidenciaFotografica(datos.getEvidenciaFotografica());
                    asistencia.setMotivoAnulacion(datos.getMotivoAnulacion());
                    asistencia.setFechaAnulacion(datos.getFechaAnulacion());
                    asistencia.setAnuladoPor(datos.getAnuladoPor());

                    return asistenciaTecnicaRepository.save(asistencia);
                });
    }

    public boolean eliminar(Integer id) {

        if (!asistenciaTecnicaRepository.existsById(id)) {
            return false;
        }

        asistenciaTecnicaRepository.deleteById(id);
        return true;
    }
}