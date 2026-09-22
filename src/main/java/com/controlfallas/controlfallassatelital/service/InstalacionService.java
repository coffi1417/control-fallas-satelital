package com.controlfallas.controlfallassatelital.service;

import com.controlfallas.controlfallassatelital.entity.Instalacion;
import com.controlfallas.controlfallassatelital.repository.InstalacionRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InstalacionService {

    private final InstalacionRepository instalacionRepository;

    public InstalacionService(
            InstalacionRepository instalacionRepository) {

        this.instalacionRepository = instalacionRepository;
    }


    // CREAR
    public Instalacion crearInstalacion(
            Instalacion instalacion) {

        return instalacionRepository.save(instalacion);
    }


    // LISTAR
    public List<Instalacion> listarInstalaciones() {

        return instalacionRepository.findAll();
    }


    // BUSCAR POR ID
    public Optional<Instalacion> buscarPorId(Integer id) {

        return instalacionRepository.findById(id);
    }


    // ACTUALIZAR
    public Optional<Instalacion> actualizarInstalacion(
            Integer id,
            Instalacion datos) {

        return instalacionRepository.findById(id)
                .map(instalacion -> {

                    instalacion.setIdCliente(
                            datos.getIdCliente()
                    );

                    instalacion.setIdTecnico(
                            datos.getIdTecnico()
                    );

                    instalacion.setFechaInstalacion(
                            datos.getFechaInstalacion()
                    );

                    instalacion.setTipoInstalacion(
                            datos.getTipoInstalacion()
                    );

                    instalacion.setDireccionInstalacion(
                            datos.getDireccionInstalacion()
                    );

                    instalacion.setCiudad(
                            datos.getCiudad()
                    );

                    instalacion.setEstado(
                            datos.getEstado()
                    );

                    instalacion.setObservaciones(
                            datos.getObservaciones()
                    );

                    return instalacionRepository.save(
                            instalacion
                    );
                });
    }


    // ELIMINAR
    public boolean eliminarInstalacion(Integer id) {

        if (!instalacionRepository.existsById(id)) {
            return false;
        }

        instalacionRepository.deleteById(id);

        return true;
    }
}