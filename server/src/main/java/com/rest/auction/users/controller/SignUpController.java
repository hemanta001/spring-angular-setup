package com.rest.auction.users.controller;

import com.rest.auction.users.entity.User;
import com.rest.auction.users.service.UserServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Slf4j
@Validated
@RestController
@RequestMapping("/api/signup")
public class SignUpController {

    private final UserServiceImpl userService;


    public SignUpController(UserServiceImpl userService) {
        this.userService = userService;
    }

    @RequestMapping(method = RequestMethod.POST, produces = "application/json")
    public ResponseEntity<?> signup(@RequestBody User user) {
        return userService.save(user);
    }

    @PostMapping("/validateEmail")
    String emailExists(@RequestParam String email) {
        return userService.existsByEmail(email);
    }

}
