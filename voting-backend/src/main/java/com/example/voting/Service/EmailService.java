package com.example.voting.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendOtp(String toEmail, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("VoteChain — Your OTP Code");

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

            helper.setText(htmlContent, true);
            mailSender.send(message);

        } catch (Exception e) {
            throw new RuntimeException("Failed to send OTP email: " + e.getMessage());
        }
    }
}
