package com.example.voting.Repository;

import java.util.List;
import java.util.Optional;

import com.example.voting.Modal.Election;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.voting.Modal.Candidate;

public interface CandidateRepository extends JpaRepository<Candidate, Long> {


   Optional<Candidate> findById(String id);
   Optional<Candidate> findByName(String name);

    List<Candidate> findByElection(Election election);
}