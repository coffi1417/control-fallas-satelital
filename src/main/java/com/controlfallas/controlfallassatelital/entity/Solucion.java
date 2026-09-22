package com.controlfallas.controlfallassatelital.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "soluciones")
public class Solucion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_solucion")
    private Integer idSolucion;

    @Column(name = "nombre_solucion", nullable = false, unique = true, length = 100)
    private String nombreSolucion;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "estado", nullable = false)
    private Boolean estado = true;

    public Solucion() {
    }

    public Integer getIdSolucion() {
        return idSolucion;
    }

    public void setIdSolucion(Integer idSolucion) {
        this.idSolucion = idSolucion;
    }

    public String getNombreSolucion() {
        return nombreSolucion;
    }

    public void setNombreSolucion(String nombreSolucion) {
        this.nombreSolucion = nombreSolucion;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Boolean getEstado() {
        return estado;
    }

    public void setEstado(Boolean estado) {
        this.estado = estado;
    }
}