package com.example.voting.Modal;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Data;

@Entity
@Data
@Table(name = "votes",uniqueConstraints = @UniqueConstraint(columnNames = {"user_id","election_id"}))
public class Votes {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  Integer id;
    
    @ManyToOne
    @JoinColumn(name="user_id",nullable = false)
    private  User user;
    @ManyToOne
    @JoinColumn(name="election_id",nullable = false)
    private  Election election;
    @ManyToOne
    @JoinColumn(name="candidate_id",nullable = false)
    private  Candidate candidate;
    



    private  LocalDateTime votedAt;
    private String previousHash;
    private String currentHash;



}
