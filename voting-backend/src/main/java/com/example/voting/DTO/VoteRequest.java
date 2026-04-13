package com.example.voting.DTO;



import lombok.Data;

@Data
public class VoteRequest {


    private String candidateId;
    private String electionId;

}
