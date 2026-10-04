package com.controlfallas.controlfallassatelital.entity;

import jakarta.persistence.*;

@Entity
@Table(
    name = "tipo_falla_soluciones",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"id_tipo_falla", "id_solucion"})
    }
)
public class TipoFallaSolucion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tipo_falla_solucion")
    private Integer idTipoFallaSolucion;

    @Column(name = "id_tipo_falla", nullable = false)
    private Integer idTipoFalla;

    @Column(name = "id_solucion", nullable = false)
    private Integer idSolucion;

    public TipoFallaSolucion() {
    }

    public Integer getIdTipoFallaSolucion() {
        return idTipoFallaSolucion;
    }

    public void setIdTipoFallaSolucion(Integer idTipoFallaSolucion) {
        this.idTipoFallaSolucion = idTipoFallaSolucion;
    }

    public Integer getIdTipoFalla() {
        return idTipoFalla;
    }

    public void setIdTipoFalla(Integer idTipoFalla) {
        this.idTipoFalla = idTipoFalla;
    }

    public Integer getIdSolucion() {
        return idSolucion;
    }

    public void setIdSolucion(Integer idSolucion) {
        this.idSolucion = idSolucion;
    }
}