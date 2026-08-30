package com.example.voting.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.voting.Modal.Candidate;
import com.example.voting.Service.CandidateService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class CandidateController {

    @Autowired
    private CandidateService candidateService;

    @PostMapping("/candidates")
    public Candidate createCandidate(@RequestBody Candidate candidate) {
        

        return candidateService.createCandidate(candidate);
    }
    @GetMapping("/candidates")
    public List<Candidate> getAllCandidates(){
        return candidateService.getAllCandidates();
    }

    @GetMapping("/candidates/{id}")
public ResponseEntity<?> getCandidateById(@PathVariable Long id){
    Candidate candidate = candidateService.getCandidateById(id);

    if(candidate == null){
        return ResponseEntity.status(404).body("Candidate not found");
    }

    return ResponseEntity.ok(candidate);
}

    @DeleteMapping("/candidates/{id}")
    public String deleteCandidate(@PathVariable Long id) {
        Candidate candidate = candidateService.getCandidateById(id);

        if (candidate != null) {
            candidateService.deleteCandidateById(id);
            return "Candidate with id " + id + " has been deleted.";
        }
        return "Candidate with id " + id + " not found.";

    }

    @DeleteMapping("/candidates")
    public String deleteAllCandidates() {
        candidateService.deleteAll();
        return "All candidates have been deleted.";
    }

    @PutMapping("/candidates/{id}")
    public Candidate updateCandidate(@PathVariable Long id, @RequestBody Candidate candidate) {
        return candidateService.updateById(id, candidate);
    }


}
