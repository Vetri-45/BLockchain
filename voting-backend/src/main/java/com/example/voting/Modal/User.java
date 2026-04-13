package com.example.voting.Modal;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(unique = true)
    private String email;

    private String role;

    // Stores base64 face image for display/reference
    @Column(columnDefinition = "LONGTEXT")
    private String faceImage;

    // Stores face descriptor as comma-separated float values
    // e.g. "0.1234,0.5678,..." (128 values from face-api.js)
    @Column(columnDefinition = "TEXT")
    private String faceDescriptor;

    // ── Getters & Setters ──────────────────────────────────────
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getFaceImage() { return faceImage; }
    public void setFaceImage(String faceImage) { this.faceImage = faceImage; }

    public String getFaceDescriptor() { return faceDescriptor; }
    public void setFaceDescriptor(String faceDescriptor) { this.faceDescriptor = faceDescriptor; }
}
