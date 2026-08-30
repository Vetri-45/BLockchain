package com.example.voting.Controller;

import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.voting.DTO.VoteRequest;
import com.example.voting.Service.VoteService;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/votes")
public class VotesController {

    @Autowired
    private VoteService voteService;

    @PostMapping("/cast")
    public ResponseEntity<?> castVote(@RequestBody VoteRequest voteRequest, Authentication authentication) {
      
        String username = authentication.getName();

        try {
            voteService.castVote(voteRequest, username);
            return ResponseEntity.ok("Vote cast successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyVotes() {
        boolean isValid = voteService.verifyBlockchain();
        if (isValid) {
            return ResponseEntity.ok("Blockchain is valid");
        } else {
            return ResponseEntity.status(400).body("Blockchain is invalid");
        }
    }
    @GetMapping("/result/{electionId}")
    public ResponseEntity<?> getResult(@PathVariable Long electionId) {

        try {
            return ResponseEntity.ok(voteService.getResult(electionId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body( e.getMessage());
        }
    }

}