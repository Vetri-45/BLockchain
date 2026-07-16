package com.example.voting.Service;

import com.example.voting.Modal.Otp;
import com.example.voting.Repository.OtpRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
public class OtpService {

    @Autowired
    private OtpRepository otpRepository;

    @Autowired
    private EmailService emailService;

    @Value("${otp.expiry.minutes:5}")
    private int expiryMinutes;

    private final SecureRandom random = new SecureRandom();

    // Generate and send OTP to email
    @Transactional
    public void generateAndSend(String email) {

        otpRepository.deleteAllByEmail(email);

        String code = String.format("%06d", random.nextInt(1_000_000));

        Otp otp = new Otp(email, code,
                LocalDateTime.now().plusMinutes(expiryMinutes));

        // Save OTP first
        otpRepository.save(otp);

        // Then send email
        emailService.sendOtp(email, code);
    }

    // Verify OTP entered by user
    @Transactional
    public boolean verify(String email, String code) {
        Otp otp = otpRepository.findTopByEmailOrderByIdDesc(email)
                .orElseThrow(() -> new RuntimeException("No OTP found for this email"));

        if (otp.isUsed()) {
            throw new RuntimeException("OTP has already been used");
        }

        if (LocalDateTime.now().isAfter(otp.getExpiresAt())) {
            throw new RuntimeException("OTP has expired. Please request a new one.");
        }

        if (!otp.getCode().equals(code)) {
            throw new RuntimeException("Invalid OTP code");
        }

        // Mark as used
        otp.setUsed(true);
        otpRepository.save(otp);

        return true;
    }
}
