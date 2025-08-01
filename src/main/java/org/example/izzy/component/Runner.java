package org.example.izzy.component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.izzy.model.entity.Role;
import org.example.izzy.model.entity.User;
import org.example.izzy.model.enums.Roles;
import org.example.izzy.repo.RoleRepository;
import org.example.izzy.repo.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
@Slf4j
@Component
@RequiredArgsConstructor
public class Runner implements CommandLineRunner {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    @Override
    public void run(String... args) throws Exception {

        if (roleRepository.count() == 0) {
            List<Role> roles = roleRepository.saveAll(
                    List.of(
                            new Role(Roles.ROLE_USER),
                            new Role(Roles.ROLE_ADMIN)
                    ));
            if (userRepository.count() == 0) {
                User user = userRepository.save(
                        User.builder()
                                .fullName("Nick Holden")
                                .email("tonym5one@gmail.com")
                                .password(passwordEncoder.encode("1"))
                                .isActive(true)
                                .roles(roles)
                                .build()
                );
                log.info(user.toString());
            }
        }

    }
}
