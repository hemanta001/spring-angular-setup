package com.rest.auction.users.service;

import com.rest.auction.users.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.provider.OAuth2Authentication;

public interface UserInterface {
    String existsByEmail(String email);

    ResponseEntity<?> isAdminRegistered();

    boolean isAdminCreated();

    ResponseEntity<?> save(User user);

    ResponseEntity<?> all(Pageable pageable, OAuth2Authentication authentication);

    ResponseEntity<?> getAllByRoleName(Pageable pageable, OAuth2Authentication authentication, String rollName);

    ResponseEntity<?> one(Long id);

    ResponseEntity<?> update(Long id, User res);

    ResponseEntity<?> create(User user);

    ResponseEntity<?> delete(Long id);

    ResponseEntity<?> search(String email, Pageable pageable, OAuth2Authentication authentication);

    ResponseEntity<?> findByEmail(String email);

    ResponseEntity<?> changePassword(Long id, String oldPassword, String newPassword);

    ResponseEntity<?> getRoles();

    ResponseEntity<?> getRoleByName(String name);

}
