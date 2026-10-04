package com.controlfallas.controlfallassatelital.repository;

import com.controlfallas.controlfallassatelital.entity.TipoFallaSolucion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TipoFallaSolucionRepository
        extends JpaRepository<TipoFallaSolucion, Integer> {
}