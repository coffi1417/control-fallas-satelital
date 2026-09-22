package com.controlfallas.controlfallassatelital.repository;

import com.controlfallas.controlfallassatelital.entity.DetalleMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DetalleMaterialRepository
        extends JpaRepository<DetalleMaterial, Integer> {
}