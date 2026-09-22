package com.controlfallas.controlfallassatelital.service;

import com.controlfallas.controlfallassatelital.entity.Equipo;
import com.controlfallas.controlfallassatelital.repository.EquipoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EquipoService {

    private final EquipoRepository equipoRepository;

    public EquipoService(EquipoRepository equipoRepository) {
        this.equipoRepository = equipoRepository;
    }

    public Equipo crearEquipo(Equipo equipo) {
        return equipoRepository.save(equipo);
    }

    public List<Equipo> listarEquipos() {
        return equipoRepository.findAll();
    }

    public Optional<Equipo> buscarPorId(Integer id) {
        return equipoRepository.findById(id);
    }

    public Optional<Equipo> actualizarEquipo(Integer id, Equipo datos) {

        return equipoRepository.findById(id).map(equipo -> {

            equipo.setTipoEquipo(datos.getTipoEquipo());
            equipo.setMarca(datos.getMarca());
            equipo.setModelo(datos.getModelo());
            equipo.setSerialEquipo(datos.getSerialEquipo());
            equipo.setSerialTarjeta(datos.getSerialTarjeta());
            equipo.setCodigoInventario(datos.getCodigoInventario());
            equipo.setEstado(datos.getEstado());
            equipo.setObservaciones(datos.getObservaciones());

            return equipoRepository.save(equipo);
        });
    }

    public boolean eliminarEquipo(Integer id) {

        if (!equipoRepository.existsById(id)) {
            return false;
        }

        equipoRepository.deleteById(id);
        return true;
    }
}