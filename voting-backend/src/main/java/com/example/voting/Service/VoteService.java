package com.example.voting.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.voting.DTO.VoteRequest;
import com.example.voting.Modal.Candidate;
import com.example.voting.Modal.Election;
import com.example.voting.Modal.User;
import com.example.voting.Modal.Votes;
import com.example.voting.Repository.VoteRepository;

import lombok.Data;

import com.example.voting.Repository.UserRepository;
import com.example.voting.Repository.ElectionRepository;
import com.example.voting.Repository.CandidateRepository;
import java.time.format.DateTimeFormatter;
@Service
public class VoteService {
    private static final DateTimeFormatter formatter =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    public String calculateHash(String data) { try { 
        MessageDigest digest = MessageDigest.getInstance("SHA-256"); 
        byte[] hash = digest.digest(data.getBytes(StandardCharsets.UTF_8)); 
        StringBuilder hexString = new StringBuilder(); 
        for (byte b:hash) {
            hexString.append(String.format("%02x", b)); 
        } 
        return hexString.toString(); 
    } catch (Exception e) { 
        throw new RuntimeException(e); 
    } 
}

    @Autowired
    private VoteRepository voteRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ElectionRepository electionRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    public String castVote(VoteRequest request, String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->new RuntimeException("User not found"));

        Election election = electionRepository.findById(request.getElectionId())
                .orElseThrow(() ->new RuntimeException("Election not found"));


        if (!"ACTIVE".equalsIgnoreCase(election.getStatus())) {
            throw new RuntimeException("Election is not active");
        }

        if (voteRepository.existsByUserAndElection(user, election)) {
            throw new RuntimeException("User has already voted in this election");
        }

        Candidate candidate =candidateRepository.findById(request.getCandidateId())
                .orElseThrow(() ->new RuntimeException("Candidate not found"));

        if (!candidate.getElection().getId().equals(election.getId())) {
            throw new RuntimeException("Candidate does not belong to this election");
        }

        Votes vote=new Votes();
        vote.setUser(user);
        vote.setElection(election);
        vote.setCandidate(candidate);

        LocalDateTime now=LocalDateTime.now();
        vote.setVotedAt(now);

        Votes lastVote=voteRepository.findTopByOrderByIdDesc();

        String previousHash=(lastVote != null)
                ?lastVote.getCurrentHash()
                :"0";
        String time=now.format(formatter);

        String data=user.getId() + "-" +
                election.getId() + "-" +
                candidate.getId() + "-" +
                time;

        String currentHash=calculateHash(data + previousHash);

        vote.setPreviousHash(previousHash);
        vote.setCurrentHash(currentHash);

        voteRepository.save(vote);

        return "Vote cast successfully";
    }
    public boolean verifyBlockchain() {

        List<Votes>votes=voteRepository.findAllByOrderByIdAsc();

        if (votes.isEmpty()) return true;

        Votes first=votes.get(0);

        String firstData =first.getUser().getId() + "-" +
                first.getElection().getId() + "-" +
                first.getCandidate().getId() + "-" +
                first.getVotedAt().format(formatter);

        String firstHash=calculateHash(firstData + "0");

        if (!first.getCurrentHash().equals(firstHash)) {
            return false;
        }

        for (int i=1;i<votes.size();i++) {

            Votes current =votes.get(i);
            Votes previous =votes.get(i - 1);

            if (!current.getPreviousHash().equals(previous.getCurrentHash())) {
                return false;
            }

            String data =current.getUser().getId() + "-" +
                    current.getElection().getId() + "-" +
                    current.getCandidate().getId() + "-" +
                    current.getVotedAt().format(formatter);

            String recalculatedHash=calculateHash(data + current.getPreviousHash());

            if (!current.getCurrentHash().equals(recalculatedHash)) {
                return false;
            }
        }

        return true;
    }

    public Object getResult(Long electionId) {

        Election election=electionRepository.findById(electionId)
                .orElseThrow(() -> new RuntimeException("Election not found"));

        if (!"COMPLETED".equalsIgnoreCase(election.getStatus())) {
            throw new RuntimeException("Election not completed yet");
        }
        List<Votes>votes=voteRepository.findByElection(election);

        if (votes.isEmpty()) {
            throw new RuntimeException("No votes found");
        }

        Map<Long, Integer>countMap=new HashMap<>();

        for (Votes vote:votes) {
            Long candidateId= vote.getCandidate().getId();
            countMap.put(candidateId,countMap.getOrDefault(candidateId, 0) + 1);
        }


        Long winnerId=countMap.entrySet()
                .stream()
                .max(Map.Entry.comparingByValue())
                .get()
                .getKey();

        Candidate winner = candidateRepository.findById(winnerId)
                .orElseThrow(() -> new RuntimeException("Winner not found"));
        return Map.of(
                "winner", winner.getName(),
                "votes", countMap.get(winnerId)
        );
    }
}
                