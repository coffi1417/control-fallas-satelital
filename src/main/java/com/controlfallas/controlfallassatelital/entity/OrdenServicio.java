package com.controlfallas.controlfallassatelital.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ordenes_servicio")
public class OrdenServicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_orden")
    private Integer idOrden;

    @Column(name = "numero_orden", nullable = false, unique = true, length = 50)
    private String numeroOrden;

    @Column(name = "id_cliente", nullable = false)
    private Integer idCliente;

    @Column(name = "id_instalacion")
    private Integer idInstalacion;

    @Column(name = "id_tecnico_asignado")
    private Integer idTecnicoAsignado;

    @Column(name = "fecha_reporte", insertable = false, updatable = false)
    private LocalDateTime fechaReporte;

    @Column(name = "tipo_servicio", nullable = false, length = 50)
    private String tipoServicio;

    @Column(name = "descripcion_problema", nullable = false, columnDefinition = "TEXT")
    private String descripcionProblema;

    @Column(name = "prioridad", nullable = false, length = 20)
    private String prioridad = "MEDIA";

    @Column(name = "estado", nullable = false, length = 30)
    private String estado = "PENDIENTE";

    @Column(name = "fecha_asignacion")
    private LocalDateTime fechaAsignacion;

    @Column(name = "fecha_programada")
    private LocalDateTime fechaProgramada;

    @Column(name = "fecha_cierre")
    private LocalDateTime fechaCierre;

    @Column(name = "observaciones_cierre", columnDefinition = "TEXT")
    private String observacionesCierre;

    public OrdenServicio() {
    }

    public Integer getIdOrden() {
        return idOrden;
    }

    public void setIdOrden(Integer idOrden) {
        this.idOrden = idOrden;
    }

    public String getNumeroOrden() {
        return numeroOrden;
    }

    public void setNumeroOrden(String numeroOrden) {
        this.numeroOrden = numeroOrden;
    }

    public Integer getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(Integer idCliente) {
        this.idCliente = idCliente;
    }

    public Integer getIdInstalacion() {
        return idInstalacion;
    }

    public void setIdInstalacion(Integer idInstalacion) {
        this.idInstalacion = idInstalacion;
    }

    public Integer getIdTecnicoAsignado() {
        return idTecnicoAsignado;
    }

    public void setIdTecnicoAsignado(Integer idTecnicoAsignado) {
        this.idTecnicoAsignado = idTecnicoAsignado;
    }

    public LocalDateTime getFechaReporte() {
        return fechaReporte;
    }

    public void setFechaReporte(LocalDateTime fechaReporte) {
        this.fechaReporte = fechaReporte;
    }

    public String getTipoServicio() {
        return tipoServicio;
    }

    public void setTipoServicio(String tipoServicio) {
        this.tipoServicio = tipoServicio;
    }

    public String getDescripcionProblema() {
        return descripcionProblema;
    }

    public void setDescripcionProblema(String descripcionProblema) {
        this.descripcionProblema = descripcionProblema;
    }

    public String getPrioridad() {
        return prioridad;
    }

    public void setPrioridad(String prioridad) {
        this.prioridad = prioridad;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public LocalDateTime getFechaAsignacion() {
        return fechaAsignacion;
    }

    public void setFechaAsignacion(LocalDateTime fechaAsignacion) {
        this.fechaAsignacion = fechaAsignacion;
    }

    public LocalDateTime getFechaProgramada() {
        return fechaProgramada;
    }

    public void setFechaProgramada(LocalDateTime fechaProgramada) {
        this.fechaProgramada = fechaProgramada;
    }

    public LocalDateTime getFechaCierre() {
        return fechaCierre;
    }

    public void setFechaCierre(LocalDateTime fechaCierre) {
        this.fechaCierre = fechaCierre;
    }

    public String getObservacionesCierre() {
        return observacionesCierre;
    }

    public void setObservacionesCierre(String observacionesCierre) {
        this.observacionesCierre = observacionesCierre;
    }
}