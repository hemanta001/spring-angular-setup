package com.rest.auction.users.controller;

import com.rest.auction.users.entity.User;
import com.rest.auction.users.service.UserServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.Size;

@RestController
@RequestMapping("/api/users")
@Slf4j
@Validated
class UserController {
    private final UserServiceImpl userService;

    UserController(UserServiceImpl userService) {
        this.userService = userService;
    }

    @GetMapping
    ResponseEntity<?> all(
            @PageableDefault(size = Integer.MAX_VALUE) Pageable pageable,
            OAuth2Authentication authentication,
            @RequestParam(required = false) String roleName) {
        if (roleName != null){
            return userService.getAllByRoleName(pageable, authentication, roleName);
        }
        return userService.all(pageable, authentication);
    }

    @GetMapping("/search")
    ResponseEntity<?> search(@RequestParam String email, Pageable pageable, OAuth2Authentication authentication) {
        return userService.search(email, pageable, authentication);
    }

    @GetMapping("/findByEmail")
    @PreAuthorize("!hasAuthority('USER') || (authentication.principal == #email)")
    ResponseEntity<?> findByEmail(@RequestParam String email, OAuth2Authentication authentication) {
        return userService.findByEmail(email);
    }

    @GetMapping("/{id}")
    @PostAuthorize("!hasAuthority('USER') || (returnObject != null && returnObject.email == authentication.principal)")
    ResponseEntity<?> one(@PathVariable Long id) {
        return userService.one(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("!hasAuthority('USER') || (authentication.principal == @userRepository.findById(#id).orElse(new User()).email)")
    ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody User res) {
        return userService.update(id, res);
    }

    @PostMapping
    @PreAuthorize("!hasAuthority('USER')")
    ResponseEntity<?> create(@RequestBody User user) {
        return userService.create(user);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("!hasAuthority('USER')")
    ResponseEntity<?> delete(@PathVariable Long id) {
        return userService.delete(id);
    }

    @PutMapping("/{id}/changePassword")
    @PreAuthorize("!hasAuthority('USER') || (#oldPassword != null && !#oldPassword.isEmpty() && authentication.principal == @userRepository.findById(#id).orElse(new net.reliqs.gleeometer.users.User()).email)")
    ResponseEntity<?> changePassword(@PathVariable Long id, @RequestParam(required = false) String oldPassword, @Valid @Size(min = 3) @RequestParam String newPassword) {
        return userService.changePassword(id, oldPassword, newPassword);
    }

    @GetMapping(value = "/isAdminRegistered", produces = "application/json")
    ResponseEntity<?> isAdminRegistered() {
        return userService.isAdminRegistered();
    }

    @GetMapping(value = "/getRoles", produces = "application/json")
    ResponseEntity<?> getRoles() {
        return userService.getRoles();
    }

    @GetMapping(value = "/getRoleByName", produces = "application/json")
    ResponseEntity<?> getRoleByName(@RequestParam String name) {
        return userService.getRoleByName(name);
    }
}
