package org.example.izzy.service.impl.general.auth;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.example.izzy.model.entity.User;
import org.example.izzy.service.interfaces.general.auth.EmailService;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;


    @Override
    public void sendSimpleMail(User user) throws MessagingException {
        Context context = new Context();
        context.setVariable("fullName", user.getFullName());
        context.setVariable("code", user.getVerificationCode());

        String htmlContent = templateEngine.process("otp-email-template", context);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo(user.getEmail());
        helper.setSubject("Your Verification Code");
        helper.setText(htmlContent, true);
//        helper.setFrom("your_email@gmail.com"); //Optional

        mailSender.send(message);
    }
}
