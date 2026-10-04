package com.controlfallas.controlfallassatelital.repository;

import com.controlfallas.controlfallassatelital.entity.AsistenciaFalla;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AsistenciaFallaRepository
        extends JpaRepository<AsistenciaFalla, Integer> {

    List<AsistenciaFalla> findByIdAsistencia(Integer idAsistencia);
}