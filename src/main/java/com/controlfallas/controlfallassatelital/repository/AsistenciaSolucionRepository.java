package com.controlfallas.controlfallassatelital.repository;

import com.controlfallas.controlfallassatelital.entity.AsistenciaSolucion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AsistenciaSolucionRepository
        extends JpaRepository<AsistenciaSolucion, Integer> {
}