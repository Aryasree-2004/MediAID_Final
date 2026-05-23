package com.cts.auth.service;

import org.springframework.stereotype.Service;

@Service
public class EmailService {

    public void sendOtpEmail(String to, String otp) {
        // Uncomment and configure SMTP to enable real email delivery:
        // SimpleMailMessage message = new SimpleMailMessage();
        // message.setTo(to);
        // message.setSubject("Password Reset OTP");
        // message.setText("Your OTP for password reset is: " + otp + ". It is valid for 10 minutes.");
        // mailSender.send(message);
        System.out.println("OTP for " + to + ": " + otp);
    }
}
