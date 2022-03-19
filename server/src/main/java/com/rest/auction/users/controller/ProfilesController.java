package com.rest.auction.users.controller;

import com.rest.auction.users.service.UserServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile")
public class ProfilesController {
    private final UserServiceImpl userService;


    public ProfilesController(UserServiceImpl userService) {
        this.userService = userService;
    }

    @RequestMapping(method = RequestMethod.GET, produces = "application/json")
    ResponseEntity<?> getProfile( OAuth2Authentication authentication) {
        return userService.findByEmail(authentication.getName());
    }
}
