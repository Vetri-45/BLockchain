package com.example.voting.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.voting.Modal.Election;
import com.example.voting.Repository.ElectionRepository;

@Service
public class ElectionService{
    private final ElectionRepository electionRepository;

    public ElectionService(ElectionRepository electionRepository) {
        this.electionRepository = electionRepository;
    }
    public Election createElection(Election election) {
        return electionRepository.save(election);
    }
    public List<Election> getElection(){
        return electionRepository.findAll();
    }
    public Election getElectionById(Long id){
        return electionRepository.findById(id).orElse(null);
    }
    
    public void deleteElectionById(Long id){
        electionRepository.deleteById(id);
       
    }
    public void deleteAllElections(){
        electionRepository.deleteAll();
    }
    public Election updateByID(Long id,Election election){
        Election existingElection = getElectionById(id);
        if (existingElection != null) {
            existingElection.setName(election.getName());
            existingElection.setTitle(election.getTitle());

            return electionRepository.save(existingElection);
        }
        return null;
    }

}
