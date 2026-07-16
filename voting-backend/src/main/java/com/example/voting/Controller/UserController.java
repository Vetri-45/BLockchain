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

    @Autowired
    private EmailValidationService emailValidationService;
    @GetMapping("/test")
    public String test() {
        System.out.println("TEST API HIT");
        return "Working";
    }

    @PostMapping("/user")
    public ResponseEntity<?> createUser(@RequestBody User user) {
        return ResponseEntity.status(403)
                .body("Direct registration not allowed. Use OTP verification.");
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
