package com.example.voting.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.voting.Modal.User;

public interface UserRepository extends JpaRepository<User, Integer>{

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);
}