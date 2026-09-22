package com.controlfallas.controlfallassatelital.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "asistencias_tecnicas")
public class AsistenciaTecnica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_asistencia")
    private Integer idAsistencia;

    @Column(name = "id_orden", nullable = false)
    private Integer idOrden;

    @Column(name = "id_tecnico")
    private Integer idTecnico;

    @Column(name = "fecha_asistencia", nullable = false)
    private LocalDate fechaAsistencia;

    @Column(name = "hora_inicio", nullable = false)
    private LocalTime horaInicio;

    @Column(name = "hora_fin")
    private LocalTime horaFin;

    @Column(name = "diagnostico", nullable = false, columnDefinition = "TEXT")
    private String diagnostico;

    @Column(name = "estado_servicio", nullable = false, length = 40)
    private String estadoServicio;

    @Column(name = "tecnico_nombre_registro", length = 150)
    private String tecnicoNombreRegistro;

    @Column(name = "resultado_servicio", length = 30)
    private String resultadoServicio;

    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;

    @Column(name = "firma_cliente", length = 255)
    private String firmaCliente;

    @Column(name = "evidencia_fotografica", length = 255)
    private String evidenciaFotografica;

    @Column(name = "motivo_anulacion", columnDefinition = "TEXT")
    private String motivoAnulacion;

    @Column(name = "fecha_anulacion")
    private java.time.LocalDateTime fechaAnulacion;

    @Column(name = "anulado_por", length = 120)
    private String anuladoPor;

    public AsistenciaTecnica() {
    }

    public Integer getIdAsistencia() {
        return idAsistencia;
    }

    public void setIdAsistencia(Integer idAsistencia) {
        this.idAsistencia = idAsistencia;
    }

    public Integer getIdOrden() {
        return idOrden;
    }

    public void setIdOrden(Integer idOrden) {
        this.idOrden = idOrden;
    }

    public Integer getIdTecnico() {
        return idTecnico;
    }

    public void setIdTecnico(Integer idTecnico) {
        this.idTecnico = idTecnico;
    }

    public LocalDate getFechaAsistencia() {
        return fechaAsistencia;
    }

    public void setFechaAsistencia(LocalDate fechaAsistencia) {
        this.fechaAsistencia = fechaAsistencia;
    }

    public LocalTime getHoraInicio() {
        return horaInicio;
    }

    public void setHoraInicio(LocalTime horaInicio) {
        this.horaInicio = horaInicio;
    }

    public LocalTime getHoraFin() {
        return horaFin;
    }

    public void setHoraFin(LocalTime horaFin) {
        this.horaFin = horaFin;
    }

    public String getDiagnostico() {
        return diagnostico;
    }

    public void setDiagnostico(String diagnostico) {
        this.diagnostico = diagnostico;
    }

    public String getEstadoServicio() {
        return estadoServicio;
    }

    public void setEstadoServicio(String estadoServicio) {
        this.estadoServicio = estadoServicio;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    public String getFirmaCliente() {
        return firmaCliente;
    }

    public void setFirmaCliente(String firmaCliente) {
        this.firmaCliente = firmaCliente;
    }

    public String getEvidenciaFotografica() {
        return evidenciaFotografica;
    }

    public void setEvidenciaFotografica(String evidenciaFotografica) {
        this.evidenciaFotografica = evidenciaFotografica;
    }

    public String getMotivoAnulacion() { return motivoAnulacion; }
    public void setMotivoAnulacion(String motivoAnulacion) { this.motivoAnulacion = motivoAnulacion; }
    public java.time.LocalDateTime getFechaAnulacion() { return fechaAnulacion; }
    public void setFechaAnulacion(java.time.LocalDateTime fechaAnulacion) { this.fechaAnulacion = fechaAnulacion; }
    public String getAnuladoPor() { return anuladoPor; }
    public void setAnuladoPor(String anuladoPor) { this.anuladoPor = anuladoPor; }

    public String getTecnicoNombreRegistro() {
        return tecnicoNombreRegistro;
    }

    public void setTecnicoNombreRegistro(String tecnicoNombreRegistro) {
        this.tecnicoNombreRegistro = tecnicoNombreRegistro;
    }

    public String getResultadoServicio() {
        return resultadoServicio;
    }

    public void setResultadoServicio(String resultadoServicio) {
        this.resultadoServicio = resultadoServicio;
    }
}