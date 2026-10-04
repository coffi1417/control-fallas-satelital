package com.controlfallas.controlfallassatelital.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(
    name = "detalle_materiales",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"id_asistencia", "id_material"})
    }
)
public class DetalleMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_detalle")
    private Integer idDetalle;

    @Column(name = "id_asistencia", nullable = false)
    private Integer idAsistencia;

    @Column(name = "id_material", nullable = false)
    private Integer idMaterial;

    @Column(name = "cantidad_utilizada", nullable = false, precision = 10, scale = 2)
    private BigDecimal cantidadUtilizada;

    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;

    public DetalleMaterial() {
    }

    public Integer getIdDetalle() {
        return idDetalle;
    }

    public void setIdDetalle(Integer idDetalle) {
        this.idDetalle = idDetalle;
    }

    public Integer getIdAsistencia() {
        return idAsistencia;
    }

    public void setIdAsistencia(Integer idAsistencia) {
        this.idAsistencia = idAsistencia;
    }

    public Integer getIdMaterial() {
        return idMaterial;
    }

    public void setIdMaterial(Integer idMaterial) {
        this.idMaterial = idMaterial;
    }

    public BigDecimal getCantidadUtilizada() {
        return cantidadUtilizada;
    }

    public void setCantidadUtilizada(BigDecimal cantidadUtilizada) {
        this.cantidadUtilizada = cantidadUtilizada;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
}