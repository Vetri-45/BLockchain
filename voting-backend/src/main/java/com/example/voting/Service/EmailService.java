package com.example.voting.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EmailService {

    @Value("${brevo.api.key}")
    private String brevoApiKey;

    @Value("${brevo.sender.email}")
    private String fromEmail;

    private final RestTemplate restTemplate = new RestTemplate();

    public void sendOtp(String toEmail, String otp) {
        try {
            System.out.println("Sending OTP email to: " + toEmail);

            String htmlContent = """
                <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;
                            background: #050810; color: #f0f6ff; padding: 32px; border-radius: 12px;
                            border: 1px solid rgba(99,210,255,0.2);">
                    <h2 style="color: #63d2ff; margin-bottom: 8px;">⬡ VoteChain</h2>
                    <p style="color: #8ca3c0; margin-bottom: 24px;">Your one-time verification code</p>
                    <div style="background: #0c1120; border: 1px solid rgba(99,210,255,0.3);
                                border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 24px;">
                        <span style="font-size: 36px; font-weight: bold; letter-spacing: 12px;
                                     color: #63d2ff;">%s</span>
                    </div>
                    <p style="color: #4a6080; font-size: 13px;">
                        This code expires in <strong style="color:#f0f6ff">5 minutes</strong>.
                        Never share this code with anyone.
                    </p>
                    <p style="color: #4a6080; font-size: 12px; margin-top: 16px;">
                        If you did not request this, please ignore this email.
                    </p>
                </div>
            """.formatted(otp);

            HttpHeaders headers = new HttpHeaders();
            headers.set("api-key", brevoApiKey);
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> body = new HashMap<>();
            body.put("sender", Map.of("email", fromEmail, "name", "VoteChain"));
            body.put("to", List.of(Map.of("email", toEmail)));
            body.put("subject", "VoteChain — Your OTP Code");
            body.put("htmlContent", htmlContent);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            restTemplate.postForEntity(
                    "https://api.brevo.com/v3/smtp/email",
                    request,
                    String.class
            );

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to send OTP email: " + e.getMessage());
        }
    }
}