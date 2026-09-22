package com.controlfallas.controlfallassatelital.service;

import com.controlfallas.controlfallassatelital.entity.Tecnico;
import com.controlfallas.controlfallassatelital.repository.TecnicoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TecnicoService {

    @Autowired
    private TecnicoRepository tecnicoRepository;

    // LISTAR
    public List<Tecnico> listarTecnicos() {
        return tecnicoRepository.findAll();
    }

    // BUSCAR POR ID
    public Tecnico buscarTecnicoPorId(Integer id) {
        return tecnicoRepository.findById(id).orElse(null);
    }

    // CREAR
    public Tecnico guardarTecnico(Tecnico tecnico) {
        return tecnicoRepository.save(tecnico);
    }

    // ACTUALIZAR
    public Tecnico actualizarTecnico(
            Integer id,
            Tecnico tecnicoActualizado) {

        Tecnico tecnicoExistente =
                tecnicoRepository.findById(id).orElse(null);

        if (tecnicoExistente == null) {
            return null;
        }

        tecnicoExistente.setUsuario(
                tecnicoActualizado.getUsuario()
        );

        tecnicoExistente.setNombres(
                tecnicoActualizado.getNombres()
        );

        tecnicoExistente.setApellidos(
                tecnicoActualizado.getApellidos()
        );

        tecnicoExistente.setTipoDocumento(
                tecnicoActualizado.getTipoDocumento()
        );

        tecnicoExistente.setNumeroDocumento(
                tecnicoActualizado.getNumeroDocumento()
        );

        tecnicoExistente.setTelefono(
                tecnicoActualizado.getTelefono()
        );

        tecnicoExistente.setCorreo(
                tecnicoActualizado.getCorreo()
        );

        tecnicoExistente.setDireccion(
                tecnicoActualizado.getDireccion()
        );

        tecnicoExistente.setCiudad(
                tecnicoActualizado.getCiudad()
        );

        tecnicoExistente.setCargo(
                tecnicoActualizado.getCargo()
        );

        tecnicoExistente.setFechaIngreso(
                tecnicoActualizado.getFechaIngreso()
        );

        tecnicoExistente.setEstado(
                tecnicoActualizado.getEstado()
        );

        return tecnicoRepository.save(tecnicoExistente);
    }

    // ELIMINAR
    public boolean eliminarTecnico(Integer id) {

        if (!tecnicoRepository.existsById(id)) {
            return false;
        }

        tecnicoRepository.deleteById(id);
        return true;
    }
}