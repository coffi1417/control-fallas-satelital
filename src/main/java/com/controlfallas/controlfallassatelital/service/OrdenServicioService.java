package com.controlfallas.controlfallassatelital.service;

import com.controlfallas.controlfallassatelital.entity.OrdenServicio;
import com.controlfallas.controlfallassatelital.repository.OrdenServicioRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrdenServicioService {

    private final OrdenServicioRepository ordenServicioRepository;

    public OrdenServicioService(
            OrdenServicioRepository ordenServicioRepository) {

        this.ordenServicioRepository = ordenServicioRepository;
    }

    // CREAR
    public OrdenServicio crear(OrdenServicio ordenServicio) {

        if (ordenServicio.getPrioridad() == null) {
            ordenServicio.setPrioridad("MEDIA");
        }

        if (ordenServicio.getEstado() == null) {
            ordenServicio.setEstado("PENDIENTE");
        }

        return ordenServicioRepository.save(ordenServicio);
    }

    // LISTAR
    public List<OrdenServicio> listar() {
        return ordenServicioRepository.findAll();
    }

    // BUSCAR POR ID
    public Optional<OrdenServicio> buscarPorId(Integer id) {
        return ordenServicioRepository.findById(id);
    }

    // ACTUALIZAR
    public Optional<OrdenServicio> actualizar(
            Integer id,
            OrdenServicio datos) {

        return ordenServicioRepository.findById(id)
                .map(orden -> {

                    orden.setNumeroOrden(
                            datos.getNumeroOrden()
                    );

                    orden.setIdCliente(
                            datos.getIdCliente()
                    );

                    orden.setIdInstalacion(
                            datos.getIdInstalacion()
                    );

                    orden.setIdTecnicoAsignado(
                            datos.getIdTecnicoAsignado()
                    );

                    orden.setTipoServicio(
                            datos.getTipoServicio()
                    );

                    orden.setDescripcionProblema(
                            datos.getDescripcionProblema()
                    );

                    orden.setPrioridad(
                            datos.getPrioridad()
                    );

                    orden.setEstado(
                            datos.getEstado()
                    );

                    orden.setFechaAsignacion(
                            datos.getFechaAsignacion()
                    );

                    orden.setFechaProgramada(
                            datos.getFechaProgramada()
                    );

                    orden.setFechaCierre(
                            datos.getFechaCierre()
                    );

                    orden.setObservacionesCierre(
                            datos.getObservacionesCierre()
                    );

                    return ordenServicioRepository.save(orden);
                });
    }

    // ELIMINAR
    public boolean eliminar(Integer id) {

        if (!ordenServicioRepository.existsById(id)) {
            return false;
        }

        ordenServicioRepository.deleteById(id);

        return true;
    }
}