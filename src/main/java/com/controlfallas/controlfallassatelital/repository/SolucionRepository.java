package com.controlfallas.controlfallassatelital.repository;

import com.controlfallas.controlfallassatelital.entity.Solucion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SolucionRepository extends JpaRepository<Solucion, Integer> {

}