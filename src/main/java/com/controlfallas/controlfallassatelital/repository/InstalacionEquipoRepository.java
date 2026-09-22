package com.controlfallas.controlfallassatelital.repository;

import com.controlfallas.controlfallassatelital.entity.InstalacionEquipo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InstalacionEquipoRepository
        extends JpaRepository<InstalacionEquipo, Integer> {
}