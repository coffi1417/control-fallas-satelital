package com.controlfallas.controlfallassatelital.entity;

import jakarta.persistence.*;

@Entity
@Table(
    name = "asistencia_fallas",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"id_asistencia", "id_tipo_falla"})
    }
)
public class AsistenciaFalla {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_asistencia_falla")
    private Integer idAsistenciaFalla;

    @Column(name = "id_asistencia", nullable = false)
    private Integer idAsistencia;

    @Column(name = "id_tipo_falla", nullable = false)
    private Integer idTipoFalla;

    @Column(name = "detalle", columnDefinition = "TEXT")
    private String detalle;

    public AsistenciaFalla() {
    }

    public Integer getIdAsistenciaFalla() {
        return idAsistenciaFalla;
    }

    public void setIdAsistenciaFalla(Integer idAsistenciaFalla) {
        this.idAsistenciaFalla = idAsistenciaFalla;
    }

    public Integer getIdAsistencia() {
        return idAsistencia;
    }

    public void setIdAsistencia(Integer idAsistencia) {
        this.idAsistencia = idAsistencia;
    }

    public Integer getIdTipoFalla() {
        return idTipoFalla;
    }

    public void setIdTipoFalla(Integer idTipoFalla) {
        this.idTipoFalla = idTipoFalla;
    }

    public String getDetalle() {
        return detalle;
    }

    public void setDetalle(String detalle) {
        this.detalle = detalle;
    }
}