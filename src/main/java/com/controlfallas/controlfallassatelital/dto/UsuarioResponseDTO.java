package com.controlfallas.controlfallassatelital.dto;

public class UsuarioResponseDTO {

    private Integer idUsuario;
    private String nombreUsuario;
    private String correo;
    private Boolean estado;
    private Integer idRol;
    private String nombreRol;

    public UsuarioResponseDTO() {
    }

    public UsuarioResponseDTO(
            Integer idUsuario,
            String nombreUsuario,
            String correo,
            Boolean estado,
            Integer idRol,
            String nombreRol) {

        this.idUsuario = idUsuario;
        this.nombreUsuario = nombreUsuario;
        this.correo = correo;
        this.estado = estado;
        this.idRol = idRol;
        this.nombreRol = nombreRol;
    }

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public Boolean getEstado() {
        return estado;
    }

    public void setEstado(Boolean estado) {
        this.estado = estado;
    }

    public Integer getIdRol() {
        return idRol;
    }

    public void setIdRol(Integer idRol) {
        this.idRol = idRol;
    }

    public String getNombreRol() {
        return nombreRol;
    }

    public void setNombreRol(String nombreRol) {
        this.nombreRol = nombreRol;
    }
}