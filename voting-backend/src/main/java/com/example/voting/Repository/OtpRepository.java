package com.example.voting.Repository;

import com.example.voting.Modal.Otp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<Otp, Long> {

    // Get the latest unused, non-expired OTP for an email
    Optional<Otp> findTopByEmailOrderByIdDesc(String email);

    // Delete all OTPs for an email (cleanup after verification)
    void deleteAllByEmail(String email);
}
