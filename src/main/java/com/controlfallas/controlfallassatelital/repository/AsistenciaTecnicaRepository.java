package com.controlfallas.controlfallassatelital.repository;

import com.controlfallas.controlfallassatelital.entity.AsistenciaTecnica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AsistenciaTecnicaRepository
        extends JpaRepository<AsistenciaTecnica, Integer> {
}