package com.controlfallas.controlfallassatelital.service;

import com.controlfallas.controlfallassatelital.entity.Cliente;
import com.controlfallas.controlfallassatelital.repository.ClienteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    public Cliente crear(Cliente cliente) {
        if (cliente.getEstado() == null) {
            cliente.setEstado(true);
        }

        return clienteRepository.save(cliente);
    }

    public List<Cliente> listar() {
        return clienteRepository.findAll();
    }

    public Optional<Cliente> buscarPorId(Integer id) {
        return clienteRepository.findById(id);
    }

    public Cliente actualizar(Integer id, Cliente datos) {

        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        cliente.setNombres(datos.getNombres());
        cliente.setApellidos(datos.getApellidos());
        cliente.setTipoDocumento(datos.getTipoDocumento());
        cliente.setNumeroDocumento(datos.getNumeroDocumento());
        cliente.setTelefono(datos.getTelefono());
        cliente.setCorreo(datos.getCorreo());
        cliente.setDireccion(datos.getDireccion());
        cliente.setBarrio(datos.getBarrio());
        cliente.setCiudad(datos.getCiudad());
        cliente.setDepartamento(datos.getDepartamento());

        if (datos.getEstado() != null) {
            cliente.setEstado(datos.getEstado());
        }

        return clienteRepository.save(cliente);
    }

    public boolean eliminar(Integer id) {

        if (!clienteRepository.existsById(id)) {
            return false;
        }

        clienteRepository.deleteById(id);
        return true;
    }
}