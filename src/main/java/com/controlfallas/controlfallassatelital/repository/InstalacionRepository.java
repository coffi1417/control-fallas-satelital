package com.controlfallas.controlfallassatelital.repository;

import com.controlfallas.controlfallassatelital.entity.Instalacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InstalacionRepository
        extends JpaRepository<Instalacion, Integer> {
}