package org.example.izzy.repo;

import org.example.izzy.model.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface RoleRepository extends JpaRepository<Role, UUID> {
    List<Role> findALlByRoleNameIn(List<String> roleUser);
}