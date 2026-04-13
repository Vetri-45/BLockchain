package com.example.voting.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.voting.Modal.User;
import com.example.voting.Service.EmailValidationService;
import com.example.voting.Service.UserService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

    // ✅ NEW: inject email validation service
    @Autowired
    private EmailValidationService emailValidationService;

    // ✅ UPDATED: validates email before saving user
    @PostMapping("/user")
    public ResponseEntity<?> createUser(@RequestBody User user) {
        try {
            // Validate email format + MX record
            emailValidationService.validate(user.getEmail());

            User created = userService.createUser(user);
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/user")
    public List<User> getAllUsers() {
        return userService.getAll();
    }

    @GetMapping("/user/{id}")
    public User getUserById(@PathVariable Integer id) {
        return userService.getById(id);
    }

    @PutMapping("/user/{id}")
    public User updateUser(@PathVariable Integer id, @RequestBody User user) {
        return userService.updateUser(id, user);
    }

    @DeleteMapping("/user/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Integer id) {
        User user = userService.getById(id);
        if (user != null) {
            userService.deleteUserById(id);
            return new ResponseEntity<>("User deleted successfully", HttpStatus.OK);
        }
        return new ResponseEntity<>("User Not Found", HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/user")
    public ResponseEntity<String> deleteAllUsers() {
        userService.deleteUsers();
        return new ResponseEntity<>("All users deleted successfully", HttpStatus.OK);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<String> dashboard() {
        return new ResponseEntity<>("Login Successful", HttpStatus.OK);
    }

    @PostMapping("/login")
    public String login(@RequestBody User user) {
        return userService.verify(user);
    }
}
