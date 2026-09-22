package com.controlfallas.controlfallassatelital.controller;

import com.controlfallas.controlfallassatelital.dto.UsuarioResponseDTO;
import com.controlfallas.controlfallassatelital.entity.Usuario;
import com.controlfallas.controlfallassatelital.service.UsuarioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;


    // LISTAR TODOS LOS USUARIOS
    @GetMapping
    public ResponseEntity<List<UsuarioResponseDTO>> listarUsuarios() {

        List<UsuarioResponseDTO> usuarios =
                usuarioService.listarUsuarios();

        return ResponseEntity.ok(usuarios);
    }


    // BUSCAR USUARIO POR ID
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> buscarUsuarioPorId(
            @PathVariable Integer id) {

        UsuarioResponseDTO usuario =
                usuarioService.buscarUsuarioPorId(id);

        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(usuario);
    }


    // CREAR USUARIO
    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> guardarUsuario(
            @RequestBody Usuario usuario) {

        UsuarioResponseDTO usuarioGuardado =
                usuarioService.guardarUsuario(usuario);

        return ResponseEntity.ok(usuarioGuardado);
    }


    // ACTUALIZAR USUARIO
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> actualizarUsuario(
            @PathVariable Integer id,
            @RequestBody Usuario usuarioActualizado) {

        UsuarioResponseDTO usuario =
                usuarioService.actualizarUsuario(
                        id,
                        usuarioActualizado
                );

        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(usuario);
    }


    // ELIMINAR USUARIO
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarUsuario(
            @PathVariable Integer id) {

        boolean eliminado =
                usuarioService.eliminarUsuario(id);

        if (!eliminado) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }


    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<UsuarioResponseDTO> login(
            @RequestBody Map<String, String> datosLogin) {

        String correo = datosLogin.get("correo");
        String contrasena = datosLogin.get("contrasena");

        UsuarioResponseDTO usuario =
                usuarioService.login(correo, contrasena);

        if (usuario == null) {
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok(usuario);
    }
}