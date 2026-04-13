package com.example.voting.Controller;

import com.example.voting.Modal.User;
import com.example.voting.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/face")
public class FaceController {

    @Autowired
    private UserRepository userRepository;


    private static final double MAX_DISTANCE   = 0.5;
    private static final double MIN_CONFIDENCE = 50.0;


    @PostMapping("/register")
    public ResponseEntity<?> registerFace(@RequestBody Map<String, String> body) {
        String username   = body.get("username");
        String descriptor = body.get("descriptor");
        String image      = body.get("image");

        if (username == null || descriptor == null) {
            return ResponseEntity.badRequest().body("Username and face descriptor are required");
        }

        // Validate descriptor has 128 values
        String[] parts = descriptor.split(",");
        if (parts.length != 128) {
            return ResponseEntity.badRequest()
                    .body("Invalid face descriptor. Please retake your photo.");
        }

        try {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            user.setFaceDescriptor(descriptor);

            if (image != null) {
                String base64 = image.contains(",") ? image.split(",")[1] : image;
                user.setFaceImage(base64);
            }

            userRepository.save(user);
            return ResponseEntity.ok("Face registered successfully");

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyFace(@RequestBody Map<String, String> body) {
        String username          = body.get("username");
        String incomingDescriptor = body.get("descriptor");

        if (username == null || incomingDescriptor == null) {
            return ResponseEntity.badRequest().body("Username and descriptor are required");
        }


        String[] parts = incomingDescriptor.split(",");
        if (parts.length != 128) {
            return ResponseEntity.badRequest()
                    .body("Invalid face descriptor. Please retake your photo.");
        }

        try {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (user.getFaceDescriptor() == null) {
                return ResponseEntity.badRequest()
                        .body("No face registered for this account. Please register your face first.");
            }


            double[] stored   = parseDescriptor(user.getFaceDescriptor());
            double[] incoming = parseDescriptor(incomingDescriptor);

            double distance   = euclideanDistance(stored, incoming);
            double confidence = Math.round((1.0 - Math.min(distance, 1.0)) * 100.0 * 10) / 10.0;

            System.out.println("═══════════════════════════════");
            System.out.println("Face Verification Result:");
            System.out.println("  Distance:   " + String.format("%.4f", distance));
            System.out.println("  Confidence: " + confidence + "%");
            System.out.println("  Threshold:  " + MIN_CONFIDENCE + "% minimum");
            System.out.println("  Result:     " + (confidence >= MIN_CONFIDENCE ? "✅ PASS" : "❌ FAIL"));
            System.out.println("═══════════════════════════════");

            if (confidence >= MIN_CONFIDENCE && distance <= MAX_DISTANCE) {

                return ResponseEntity.ok(Map.of(
                        "verified",    true,
                        "confidence",  confidence,
                        "distance",    Math.round(distance * 10000.0) / 10000.0,
                        "message",     "Face verified successfully"
                ));
            } else {
                // ❌ FAIL — confidence below 50%
                return ResponseEntity.status(401).body(
                        "⚠️ Face verification failed. " +
                        "Confidence: " + confidence + "% " +
                        "(Minimum required: " + (int) MIN_CONFIDENCE + "%). " +
                        "Please ensure good lighting and face the camera directly."
                );
            }

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private double[] parseDescriptor(String descriptor) {
        String[] parts = descriptor.split(",");
        double[] result = new double[parts.length];
        for (int i = 0; i < parts.length; i++) {
            result[i] = Double.parseDouble(parts[i].trim());
        }
        return result;
    }

    private double euclideanDistance(double[] a, double[] b) {
        double sum = 0;
        for (int i = 0; i < a.length; i++) {
            double diff = a[i] - b[i];
            sum += diff * diff;
        }
        return Math.sqrt(sum);
    }
}
