package com.example.voting.Controller;

import com.example.voting.Service.OtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/otp")
public class OtpController {

    @Autowired
    private OtpService otpService;


    @PostMapping("/send")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");

        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body("Email is required");
        }

        try {
            otpService.generateAndSend(email);
            return ResponseEntity.ok("OTP sent to " + email);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Verify OTP entered by user
    // Request body: { "email": "user@example.com", "code": "123456" }
    @PostMapping("/verify")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String code  = body.get("code");

        if (email == null || code == null) {
            return ResponseEntity.badRequest().body("Email and code are required");
        }

        try {
            otpService.verify(email, code);
            return ResponseEntity.ok("OTP verified successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
