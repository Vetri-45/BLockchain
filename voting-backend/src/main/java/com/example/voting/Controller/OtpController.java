package com.example.voting.Controller;

import com.example.voting.Modal.User;
import com.example.voting.Service.OtpService;
import com.example.voting.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/otp")
public class OtpController {

    @Autowired
    private OtpService otpService;

    @Autowired
    private UserService userService;

    // ✅ Temporary memory store — holds user data until OTP verified
    // Key = email, Value = pending User object
    private final Map<String, User> pendingUsers = new ConcurrentHashMap<>();


    @PostMapping("/send")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> body) {
        String email    = body.get("email");
        String username = body.get("username");
        String password = body.get("password");

        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body("Email is required");
        }

        try {
            // ✅ If registration flow — store user details temporarily
            if (username != null && password != null) {

                // Check if username or email already exists in DB
                if (userService.existsByUsername(username)) {
                    return ResponseEntity.status(409)
                            .body("Username already taken. Please choose another.");
                }
                if (userService.existsByEmail(email)) {
                    return ResponseEntity.status(409)
                            .body("Email already registered. Please login.");
                }

                // Store user details in memory — NOT in DB yet
                User pending = new User();
                pending.setUsername(username);
                pending.setEmail(email);
                pending.setPassword(password); // UserService will hash it on save
                pendingUsers.put(email, pending);

                System.out.println("✅ Pending user stored in memory: " + email);
            }

            // Send OTP email
            otpService.generateAndSend(email);
            return ResponseEntity.ok("OTP sent to " + email);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @PostMapping("/verify")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String code  = body.get("code");

        if (email == null || code == null) {
            return ResponseEntity.badRequest().body("Email and code are required");
        }

        try {
            // Verify OTP first
            otpService.verify(email, code);

            // ✅ OTP verified — now check if pending user exists
            User pending = pendingUsers.get(email);
            if (pending != null) {
                // Save user to DB ONLY after OTP verified
                userService.createUser(pending);
                pendingUsers.remove(email); // clean up memory
                System.out.println("✅ User saved to DB after OTP: " + email);
            }

            return ResponseEntity.ok("OTP verified successfully");

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}