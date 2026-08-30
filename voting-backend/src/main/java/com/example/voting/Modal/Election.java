  package com.example.voting.Modal;
  // package com.example.voting.Modal;

    // import java.time.LocalDate;

    // import jakarta.persistence.Entity;
    // import jakarta.persistence.GeneratedValue;
    // import jakarta.persistence.GenerationType;
    // import jakarta.persistence.Id;
    // import jakarta.validation.constraints.NotBlank;
    // import lombok.AllArgsConstructor;
    // import lombok.Data;
    // import lombok.NoArgsConstructor;

    // @Entity
    // @Data
    // @NoArgsConstructor
    // @AllArgsConstructor
    // public class Election {
    //     @Id
    //     @GeneratedValue(strategy = GenerationType.IDENTITY)
    //     private Long id;

    //     @NotBlank
    //     private String name;

    //     @NotBlank
    //     private String title;

    //     @NotBlank
    //     private String description;

    //     @NotBlank
    //     private LocalDate startDate;

    //     @NotBlank
    //     private LocalDate endDate;

    //     @NotBlank
    //     private String status;
    // }

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Election {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String name;


    private String title;


    private String description;


    private LocalDate startDate;


    private LocalDate endDate;

    private String status;

    private LocalDateTime endTime;






}
