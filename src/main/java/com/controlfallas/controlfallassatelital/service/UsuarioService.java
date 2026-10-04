package com.controlfallas.controlfallassatelital.service;

import com.controlfallas.controlfallassatelital.dto.UsuarioResponseDTO;
import com.controlfallas.controlfallassatelital.entity.Usuario;
import com.controlfallas.controlfallassatelital.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // BCrypt para proteger las contraseñas
    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();


    // =========================
    // LISTAR TODOS LOS USUARIOS
    // =========================
    public List<UsuarioResponseDTO> listarUsuarios() {

        return usuarioRepository.findAll()
                .stream()
                .map(this::convertirADTO)
                .toList();
    }


    // =========================
    // BUSCAR USUARIO POR ID
    // =========================
    public UsuarioResponseDTO buscarUsuarioPorId(Integer id) {

        Usuario usuario =
                usuarioRepository.findById(id).orElse(null);

        if (usuario == null) {
            return null;
        }

        return convertirADTO(usuario);
    }


    // =========================
    // CREAR USUARIO
    // =========================
    public UsuarioResponseDTO guardarUsuario(Usuario usuario) {

        // Convertimos la contraseña a BCrypt antes de guardarla
        String contrasenaCifrada =
                passwordEncoder.encode(usuario.getContrasena());

        usuario.setContrasena(contrasenaCifrada);

        Usuario usuarioGuardado =
                usuarioRepository.save(usuario);

        return convertirADTO(usuarioGuardado);
    }


    // =========================
    // ACTUALIZAR USUARIO
    // =========================
    public UsuarioResponseDTO actualizarUsuario(
            Integer id,
            Usuario usuarioActualizado) {

        Usuario usuarioExistente =
                usuarioRepository.findById(id).orElse(null);

        if (usuarioExistente == null) {
            return null;
        }

        usuarioExistente.setNombreUsuario(
                usuarioActualizado.getNombreUsuario()
        );

        usuarioExistente.setCorreo(
                usuarioActualizado.getCorreo()
        );

        // Si llega una contraseña nueva, se cifra antes de guardarla
        if (usuarioActualizado.getContrasena() != null
                && !usuarioActualizado.getContrasena().isBlank()) {

            String contrasenaCifrada =
                    passwordEncoder.encode(
                            usuarioActualizado.getContrasena()
                    );

            usuarioExistente.setContrasena(contrasenaCifrada);
        }

        usuarioExistente.setEstado(
                usuarioActualizado.getEstado()
        );

        usuarioExistente.setRol(
                usuarioActualizado.getRol()
        );

        Usuario usuarioGuardado =
                usuarioRepository.save(usuarioExistente);

        return convertirADTO(usuarioGuardado);
    }


    // =========================
    // ELIMINAR USUARIO
    // =========================
    public boolean eliminarUsuario(Integer id) {

        if (!usuarioRepository.existsById(id)) {
            return false;
        }

        usuarioRepository.deleteById(id);

        return true;
    }


    // =========================
    // LOGIN
    // =========================
    public UsuarioResponseDTO login(
            String correo,
            String contrasena) {

        Usuario usuario =
                usuarioRepository.findByCorreo(correo);

        if (usuario == null) {
            return null;
        }

        // Comparamos la contraseña escrita con el hash BCrypt
        if (!passwordEncoder.matches(
                contrasena,
                usuario.getContrasena())) {

            return null;
        }

        // No permite iniciar sesión a usuarios inactivos
        if (!usuario.getEstado()) {
            return null;
        }

        return convertirADTO(usuario);
    }


    // =========================
    // CONVERTIR USUARIO A DTO
    // =========================
    private UsuarioResponseDTO convertirADTO(Usuario usuario) {

        Integer idRol = null;
        String nombreRol = null;

        if (usuario.getRol() != null) {

            idRol = usuario.getRol().getIdRol();
            nombreRol = usuario.getRol().getNombreRol();
        }

        return new UsuarioResponseDTO(
                usuario.getIdUsuario(),
                usuario.getNombreUsuario(),
                usuario.getCorreo(),
                usuario.getEstado(),
                idRol,
                nombreRol
        );
    }
}