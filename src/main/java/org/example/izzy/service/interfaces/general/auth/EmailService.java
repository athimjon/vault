package org.example.izzy.service.interfaces.general.auth;

import jakarta.mail.MessagingException;
import org.example.izzy.model.entity.User;

public interface EmailService {
    void sendSimpleMail(User user) throws MessagingException;
}
