package org.example.izzy.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.example.izzy.model.base.BaseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
@ToString
@Entity
@Table(name = "users")
@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class User extends BaseEntity implements UserDetails {


    @Column(nullable = false)
    private String fullName;

    @Column( nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String verificationCode;

    @ManyToMany
    private List<Role> roles;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.roles;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isEnabled() {
        return getIsActive();
    }
}
