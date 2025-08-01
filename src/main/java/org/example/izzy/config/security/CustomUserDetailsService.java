package org.example.izzy.config.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final org.example.izzy.repo.UserRepository userRepository;


    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        log.debug("Attempting to load user by @EMAIL: {}", email);
        return userRepository.findByEmail(email).orElseThrow(() -> {
            log.warn("User not found with @EMAIL: {}", email);
            return new UsernameNotFoundException("User not found with @EMAIL: " + email);
        });
    }
}
