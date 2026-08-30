package com.example.voting.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.voting.Modal.Candidate;
import com.example.voting.Modal.Election;
import com.example.voting.Repository.CandidateRepository;
import com.example.voting.Repository.ElectionRepository;

@Service
public class CandidateService {

    @Autowired
    private ElectionRepository electionRepository;

    private final CandidateRepository candidateRepository;

    public CandidateService(CandidateRepository candidateRepository) {
        this.candidateRepository = candidateRepository;
    }

    
    public Candidate createCandidate(Candidate candidate) {

    Long electionId =candidate.getElection().getId();

    Election election =electionRepository.findById(electionId)
        .orElseThrow(() -> new RuntimeException("Election not found"));

    candidate.setElection(election);

    return candidateRepository.save(candidate);
}

  
    public List<Candidate> getAllCandidates() {
        return candidateRepository.findAll();
    }

   
    public Candidate getCandidateById(Long id) {
        return candidateRepository.findById(id).orElse(null);
    }

   
    public String deleteCandidateById(Long id) {
        candidateRepository.deleteById(id);
        return "Candidate with ID " + id + " has been deleted.";
    }

   
    public void deleteAll() {
        candidateRepository.deleteAll();
    }

 
    public Candidate updateById(Long id,Candidate candidate) {
        Candidate existingCandidate=getCandidateById(id);
        if (existingCandidate!=null) {
            existingCandidate.setName(candidate.getName());
            existingCandidate.setParty(candidate.getParty());
            existingCandidate.setElection(candidate.getElection());
            return candidateRepository.save(existingCandidate);
        }
        return null;
    }
}