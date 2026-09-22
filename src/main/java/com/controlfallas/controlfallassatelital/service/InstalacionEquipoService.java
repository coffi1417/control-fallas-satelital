package com.controlfallas.controlfallassatelital.service;

import com.controlfallas.controlfallassatelital.entity.InstalacionEquipo;
import com.controlfallas.controlfallassatelital.repository.InstalacionEquipoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InstalacionEquipoService {

    private final InstalacionEquipoRepository instalacionEquipoRepository;

    public InstalacionEquipoService(
            InstalacionEquipoRepository instalacionEquipoRepository) {
        this.instalacionEquipoRepository = instalacionEquipoRepository;
    }

    public InstalacionEquipo crear(InstalacionEquipo instalacionEquipo) {
        return instalacionEquipoRepository.save(instalacionEquipo);
    }

    public List<InstalacionEquipo> listar() {
        return instalacionEquipoRepository.findAll();
    }

    public Optional<InstalacionEquipo> buscarPorId(Integer id) {
        return instalacionEquipoRepository.findById(id);
    }

    public Optional<InstalacionEquipo> actualizar(
            Integer id,
            InstalacionEquipo datos) {

        return instalacionEquipoRepository.findById(id)
                .map(instalacionEquipo -> {

                    instalacionEquipo.setIdInstalacion(datos.getIdInstalacion());
                    instalacionEquipo.setIdEquipo(datos.getIdEquipo());
                    instalacionEquipo.setFechaAsignacion(datos.getFechaAsignacion());
                    instalacionEquipo.setFechaRetiro(datos.getFechaRetiro());
                    instalacionEquipo.setEstado(datos.getEstado());

                    return instalacionEquipoRepository.save(instalacionEquipo);
                });
    }

    public boolean eliminar(Integer id) {

        if (!instalacionEquipoRepository.existsById(id)) {
            return false;
        }

        instalacionEquipoRepository.deleteById(id);
        return true;
    }
}