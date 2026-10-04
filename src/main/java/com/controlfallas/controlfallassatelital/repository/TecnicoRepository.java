package com.controlfallas.controlfallassatelital.repository;

import com.controlfallas.controlfallassatelital.entity.Tecnico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TecnicoRepository extends JpaRepository<Tecnico, Integer> {
}