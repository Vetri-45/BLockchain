package com.example.voting.Controller;

import com.example.voting.Modal.Election;
import com.example.voting.Repository.ElectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;


import com.example.voting.Repository.ElectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

    @Component
    public class ElectionScheduler {

        @Autowired
        private ElectionRepository electionRepository;

        // Runs every 60 seconds
        @Scheduled(fixedRate = 60000)
        public void autoEndExpiredElections() {
            List<Election> activeElections = electionRepository.findByStatus("ACTIVE");
            LocalDateTime now = LocalDateTime.now();

            for (Election election : activeElections) {
                if (election.getEndTime() != null && election.getEndTime().isBefore(now)) {
                    election.setStatus("COMPLETED");
                    electionRepository.save(election);
                    System.out.println("Auto-ended election: " + election.getId());
                }
            }
        }

}
