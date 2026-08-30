package com.example.voting.Service;

import org.apache.commons.validator.routines.EmailValidator;
import org.springframework.stereotype.Service;

import javax.naming.directory.Attributes;
import javax.naming.directory.InitialDirContext;
import java.util.Hashtable;

@Service
public class EmailValidationService {

    private final EmailValidator emailValidator = EmailValidator.getInstance();

    // Full validation: format + MX record check
    public void validate(String email) {
        if (email == null || email.isBlank()) {
            throw new RuntimeException("Email is required");
        }

        // Step 1: Format check (RFC 5322)
        if (!emailValidator.isValid(email)) {
            throw new RuntimeException("Enter Your Correct Mail Address");
        }

        // Step 2: MX record check (does the domain actually receive emails?)
        String domain = email.substring(email.indexOf('@') + 1);
        if (!hasMxRecord(domain)) {
            throw new RuntimeException("Enter Your Correct Mail Address");
        }
    }

    // Check if domain has valid MX DNS record
    private boolean hasMxRecord(String domain) {
        try {
            Hashtable<String, String> env = new Hashtable<>();
            env.put("java.naming.factory.initial", "com.sun.jndi.dns.DnsContextFactory");
            env.put("java.naming.provider.url", "dns:");
            env.put("com.sun.jndi.dns.timeout.initial", "2000");
            env.put("com.sun.jndi.dns.timeout.retries", "1");

            InitialDirContext ctx = new InitialDirContext(env);
            Attributes attrs = ctx.getAttributes(domain, new String[]{"MX"});

            return attrs.get("MX") != null;
        } catch (Exception e) {
            // If DNS lookup fails, fall back to allowing the email
            // (avoid blocking valid emails due to network issues)
            return true;
        }
    }
}
