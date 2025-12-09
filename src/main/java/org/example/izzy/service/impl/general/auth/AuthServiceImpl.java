package org.example.izzy.service.impl.general.auth;

import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.izzy.config.security.JwtService;
import org.example.izzy.exception.ResourceNotFoundException;
import org.example.izzy.model.dto.request.general.auth.CodeVerificationReq;
import org.example.izzy.model.dto.request.general.auth.LoginReq;
import org.example.izzy.model.dto.request.general.auth.RegisterReq;
import org.example.izzy.model.dto.response.general.AuthResponse;
import org.example.izzy.model.dto.response.general.UserRes;
import org.example.izzy.model.entity.Role;
import org.example.izzy.model.entity.User;
import org.example.izzy.repo.RoleRepository;
import org.example.izzy.repo.UserRepository;
import org.example.izzy.service.interfaces.general.auth.AuthService;
import org.example.izzy.service.interfaces.general.auth.EmailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final RoleRepository roleRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    @Value("${jwt.expiration}")
    private Integer expirationTimeInMills;

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;


    @Transactional
    @Override
    public void logInUser(LoginReq loginReq) {

        User userFromDB = findUserFromDB(loginReq.email());
//         Check if user is active
        if (!userFromDB.isEnabled()) {
            throw new DisabledException("User account is disabled");
        }

        String verificationCode = generateVerificationCode();
        System.err.println("Generated SMS code: " + verificationCode);

        userFromDB.setVerificationCode(verificationCode);
        Thread thread = new Thread(() -> {
            try {
                emailService.sendSimpleMail(userFromDB);
            } catch (MessagingException e) {
                throw new RuntimeException(e);
            }
        });
        thread.start();


    }


    @Override
    public UserRes verifyBothRegisterAndLogin(CodeVerificationReq codeVerificationReq, HttpServletResponse response) {
        User user = findUserFromDB(codeVerificationReq.email());

        validateVerificationCode(codeVerificationReq, user);

        authenticateUser(user);

        generateTokenAndSetToCookie(user.getEmail(), response);

        return mapToUserResponse(user);
    }

    @Override
    public void register(RegisterReq registerReq) {

        String verificationCode = generateVerificationCode();
        System.err.println("Generated SMS code: " + verificationCode);
        Optional<User> optionalUser = userRepository.findByEmail(registerReq.email());

        // Check for duplicate phone number
        if (optionalUser.isPresent()) {
            User dbUser = optionalUser.get();
            if (registerReq.email().equals(dbUser.getEmail()) && dbUser.isEnabled()) {
                throw new IllegalArgumentException("""
                        User with this @email already Registered,
                        Please Log In .
                        """);

            } else if (dbUser.getEmail().equals(registerReq.email())) {
                dbUser.setVerificationCode(verificationCode);
            }
        }

        List<Role> roleUser = roleRepository.findALlByRoleNameIn(List.of("ROLE_USER"));

        // Map DTO to entity
        User user = User.builder()
                .fullName(registerReq.fullName())
                .email(registerReq.email())
                .verificationCode(verificationCode)
                .password(passwordEncoder.encode("1"))
                .roles(roleUser)
                .isActive(false)
                .build();

        // Save user
        User saved = userRepository.save(user);

    }


    private UserRes mapToUserResponse(User user) {
        return new UserRes(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRoles().stream().map(role -> role.getRoleName().name()).toList()
        );
    }

    private void generateTokenAndSetToCookie(String email, HttpServletResponse response) {
        String token = jwtService.generateToken(email);
        ResponseCookie cookie = ResponseCookie.from("izzy-token", token)
                .httpOnly(true)
                .secure(false) // Only if using HTTPS
                .path("/") // Available across the app
                .maxAge(expirationTimeInMills / 1000) //Time given in seconds
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private String generateVerificationCode() {
        SecureRandom random = new SecureRandom();
        int code = 100000 + random.nextInt(900000); // 6-digit code
        return String.valueOf(code);
    }

    private User findUserFromDB(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with @Email : " + email));
    }

    private static void validateVerificationCode(CodeVerificationReq codeVerificationReq, User user) {
        if (user.getIsActive() && user.getVerificationCode() == null) {
            throw new IllegalArgumentException(""" 
                    No Verification code has been sent!
                    Please Login again !""");

        } else if (!user.getIsActive() && user.getVerificationCode() != null) {
            user.setIsActive(true);
        } else if (!codeVerificationReq.code().equals(user.getVerificationCode())) {
            throw new IllegalArgumentException("Invalid verification code");
        }
        user.setVerificationCode(null);
    }

    private void authenticateUser(User user) {
        try {
            // Perform authentication
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    user.getEmail(), "1"
            );
            authenticationManager.authenticate(authToken);

        } catch (BadCredentialsException e) {
            e.printStackTrace();
            throw new IllegalArgumentException("Invalid @email or password");
        } catch (DisabledException e) {
            e.printStackTrace();
            throw new DisabledException("User account is disabled");
        }
    }

}
