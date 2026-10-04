package com.controlfallas.controlfallassatelital.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "instalaciones")
public class Instalacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_instalacion")
    private Integer idInstalacion;

    @Column(name = "id_cliente", nullable = false)
    private Integer idCliente;

    @Column(name = "id_tecnico")
    private Integer idTecnico;

    @Column(name = "fecha_instalacion", nullable = false)
    private LocalDate fechaInstalacion;

    @Column(name = "tipo_instalacion", nullable = false, length = 50)
    private String tipoInstalacion;

    @Column(name = "direccion_instalacion", nullable = false, length = 150)
    private String direccionInstalacion;

    @Column(name = "ciudad", nullable = false, length = 80)
    private String ciudad;

    @Column(name = "estado", nullable = false, length = 30)
    private String estado = "ACTIVA";

    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;

    public Instalacion() {
    }

    public Integer getIdInstalacion() {
        return idInstalacion;
    }

    public void setIdInstalacion(Integer idInstalacion) {
        this.idInstalacion = idInstalacion;
    }

    public Integer getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(Integer idCliente) {
        this.idCliente = idCliente;
    }

    public Integer getIdTecnico() {
        return idTecnico;
    }

    public void setIdTecnico(Integer idTecnico) {
        this.idTecnico = idTecnico;
    }

    public LocalDate getFechaInstalacion() {
        return fechaInstalacion;
    }

    public void setFechaInstalacion(LocalDate fechaInstalacion) {
        this.fechaInstalacion = fechaInstalacion;
    }

    public String getTipoInstalacion() {
        return tipoInstalacion;
    }

    public void setTipoInstalacion(String tipoInstalacion) {
        this.tipoInstalacion = tipoInstalacion;
    }

    public String getDireccionInstalacion() {
        return direccionInstalacion;
    }

    public void setDireccionInstalacion(String direccionInstalacion) {
        this.direccionInstalacion = direccionInstalacion;
    }

    public String getCiudad() {
        return ciudad;
    }

    public void setCiudad(String ciudad) {
        this.ciudad = ciudad;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
}