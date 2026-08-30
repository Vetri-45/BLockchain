package com.example.voting.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;


import com.example.voting.Modal.Election;
public interface ElectionRepository extends JpaRepository<Election, Long> {
        Optional<Election> findById(String electionId);

    List<Election> findByStatus(String active);
}
