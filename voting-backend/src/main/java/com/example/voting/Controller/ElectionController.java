package com.example.voting.Controller;

import java.util.List;

import com.example.voting.Repository.ElectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.voting.Modal.Election;
import com.example.voting.Service.ElectionService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class ElectionController {
    private final ElectionService electionService;

    @Autowired
    private ElectionRepository electionRepository;

    public ElectionController(ElectionService electionService) {
        this.electionService = electionService;
    }

    @PostMapping("/elections")
    public Election createElection(@RequestBody Election election) {
        return electionService.createElection(election);
    }
    @GetMapping("/elections")
    public List<Election> getAllelction(){
        return electionService.getElection();
    }
    @GetMapping("/elections/{id}")
    public Election getElectionbyid(@PathVariable Long id){
       return electionService.getElectionById(id);
       
    }
    @DeleteMapping("/elections/{id}")
    public String deleteElection (@PathVariable Long id){

        Election election = electionService.getElectionById(id);

        if (election != null) {
            electionService.deleteElectionById(id);
            return "Election with id " + id + " has been deleted.";
        }
        return "Election with id " + id + " not found.";

    }
    @DeleteMapping("/elections")
    public String deleteAllelection(){

        electionService.deleteAllElections();
        return "All elections have been deleted.";

    }
    @PutMapping("elections/{id}")
    public Election updateElectionById(@PathVariable Long id, @RequestBody Election election) {
        return electionService.updateByID(id, election);
         
    }
    @PutMapping("/end/{id}")
    public String endElection(@PathVariable Long id) {
        Election election = electionRepository.findById(id).get();
        election.setStatus("COMPLETED");
        electionRepository.save(election);
        return "Election ended";
    }
    @GetMapping("/all")
    public List<Election> getAll() {
        return electionRepository.findAll();
    }

    @PutMapping("/start/{id}")
    public String startElection(@PathVariable Long id) {
        Election election = electionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Election not found"));

        election.setStatus("ACTIVE");
        electionRepository.save(election);

        return " Election started";
    }

}


