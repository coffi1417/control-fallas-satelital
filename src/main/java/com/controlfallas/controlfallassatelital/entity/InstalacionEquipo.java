package com.controlfallas.controlfallassatelital.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(
    name = "instalacion_equipos",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"id_instalacion", "id_equipo"})
    }
)
public class InstalacionEquipo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_instalacion_equipo")
    private Integer idInstalacionEquipo;

    @Column(name = "id_instalacion", nullable = false)
    private Integer idInstalacion;

    @Column(name = "id_equipo", nullable = false)
    private Integer idEquipo;

    @Column(name = "fecha_asignacion", nullable = false)
    private LocalDate fechaAsignacion;

    @Column(name = "fecha_retiro")
    private LocalDate fechaRetiro;

    @Column(name = "estado", nullable = false, length = 30)
    private String estado;

    public InstalacionEquipo() {
    }

    public Integer getIdInstalacionEquipo() {
        return idInstalacionEquipo;
    }

    public void setIdInstalacionEquipo(Integer idInstalacionEquipo) {
        this.idInstalacionEquipo = idInstalacionEquipo;
    }

    public Integer getIdInstalacion() {
        return idInstalacion;
    }

    public void setIdInstalacion(Integer idInstalacion) {
        this.idInstalacion = idInstalacion;
    }

    public Integer getIdEquipo() {
        return idEquipo;
    }

    public void setIdEquipo(Integer idEquipo) {
        this.idEquipo = idEquipo;
    }

    public LocalDate getFechaAsignacion() {
        return fechaAsignacion;
    }

    public void setFechaAsignacion(LocalDate fechaAsignacion) {
        this.fechaAsignacion = fechaAsignacion;
    }

    public LocalDate getFechaRetiro() {
        return fechaRetiro;
    }

    public void setFechaRetiro(LocalDate fechaRetiro) {
        this.fechaRetiro = fechaRetiro;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
}