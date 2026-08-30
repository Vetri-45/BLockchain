package com.example.voting.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.voting.Modal.Election;
import com.example.voting.Modal.User;
import com.example.voting.Modal.Votes;

@Repository
public interface VoteRepository extends JpaRepository<Votes, Integer> {

    boolean existsByUserAndElection(User user, Election election);
    Optional<Votes> findByUserAndElection(User user, Election election);

    List<Votes> findAllByUser(User user);

    List<Votes> findAllByElection(Election election);

    Votes findTopByOrderByIdDesc();

    List<Votes> findByElection(Election election);
    List<Votes> findAllByOrderByIdAsc();
}