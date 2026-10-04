package com.controlfallas.controlfallassatelital.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "equipos")
public class Equipo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_equipo")
    private Integer idEquipo;

    @Column(name = "tipo_equipo", nullable = false, length = 50)
    private String tipoEquipo;

    @Column(name = "marca", length = 60)
    private String marca;

    @Column(name = "modelo", length = 60)
    private String modelo;

    @Column(name = "serial_equipo", unique = true, length = 100)
    private String serialEquipo;

    @Column(name = "serial_tarjeta", unique = true, length = 100)
    private String serialTarjeta;

    @Column(name = "codigo_inventario", unique = true, length = 100)
    private String codigoInventario;

    @Column(name = "estado", nullable = false, length = 30)
    private String estado = "ACTIVO";

    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;

    public Equipo() {
    }

    public Integer getIdEquipo() {
        return idEquipo;
    }

    public void setIdEquipo(Integer idEquipo) {
        this.idEquipo = idEquipo;
    }

    public String getTipoEquipo() {
        return tipoEquipo;
    }

    public void setTipoEquipo(String tipoEquipo) {
        this.tipoEquipo = tipoEquipo;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public String getSerialEquipo() {
        return serialEquipo;
    }

    public void setSerialEquipo(String serialEquipo) {
        this.serialEquipo = serialEquipo;
    }

    public String getSerialTarjeta() {
        return serialTarjeta;
    }

    public void setSerialTarjeta(String serialTarjeta) {
        this.serialTarjeta = serialTarjeta;
    }

    public String getCodigoInventario() {
        return codigoInventario;
    }

    public void setCodigoInventario(String codigoInventario) {
        this.codigoInventario = codigoInventario;
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