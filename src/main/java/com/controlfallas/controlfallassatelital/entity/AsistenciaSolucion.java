package com.controlfallas.controlfallassatelital.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "asistencia_soluciones")
public class AsistenciaSolucion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_asistencia_solucion")
    private Integer idAsistenciaSolucion;

    @Column(name = "id_asistencia", nullable = false)
    private Integer idAsistencia;

    @Column(name = "id_solucion", nullable = false)
    private Integer idSolucion;

    @Column(name = "detalle")
    private String detalle;

    public AsistenciaSolucion() {
    }

    public Integer getIdAsistenciaSolucion() {
        return idAsistenciaSolucion;
    }

    public void setIdAsistenciaSolucion(Integer idAsistenciaSolucion) {
        this.idAsistenciaSolucion = idAsistenciaSolucion;
    }

    public Integer getIdAsistencia() {
        return idAsistencia;
    }

    public void setIdAsistencia(Integer idAsistencia) {
        this.idAsistencia = idAsistencia;
    }

    public Integer getIdSolucion() {
        return idSolucion;
    }

    public void setIdSolucion(Integer idSolucion) {
        this.idSolucion = idSolucion;
    }

    public String getDetalle() {
        return detalle;
    }

    public void setDetalle(String detalle) {
        this.detalle = detalle;
    }
}