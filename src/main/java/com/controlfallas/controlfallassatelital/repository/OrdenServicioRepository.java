package com.controlfallas.controlfallassatelital.repository;

import com.controlfallas.controlfallassatelital.entity.OrdenServicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrdenServicioRepository
        extends JpaRepository<OrdenServicio, Integer> {
}