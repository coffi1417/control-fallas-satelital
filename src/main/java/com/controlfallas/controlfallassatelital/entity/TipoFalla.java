package com.controlfallas.controlfallassatelital.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tipos_falla")
public class TipoFalla {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tipo_falla")
    private Integer idTipoFalla;

    @Column(name = "nombre_falla", nullable = false, unique = true)
    private String nombreFalla;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "categoria")
    private String categoria;

    @Column(name = "estado", nullable = false)
    private Boolean estado = true;


    // Constructor vacío
    public TipoFalla() {
    }


    // Constructor completo
    public TipoFalla(
            Integer idTipoFalla,
            String nombreFalla,
            String descripcion,
            String categoria,
            Boolean estado) {

        this.idTipoFalla = idTipoFalla;
        this.nombreFalla = nombreFalla;
        this.descripcion = descripcion;
        this.categoria = categoria;
        this.estado = estado;
    }


    // GETTERS Y SETTERS

    public Integer getIdTipoFalla() {
        return idTipoFalla;
    }

    public void setIdTipoFalla(Integer idTipoFalla) {
        this.idTipoFalla = idTipoFalla;
    }

    public String getNombreFalla() {
        return nombreFalla;
    }

    public void setNombreFalla(String nombreFalla) {
        this.nombreFalla = nombreFalla;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public Boolean getEstado() {
        return estado;
    }

    public void setEstado(Boolean estado) {
        this.estado = estado;
    }
}