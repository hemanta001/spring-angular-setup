package com.rest.auction.security.services;

import com.rest.auction.users.entity.Role;
import com.rest.auction.users.entity.User;
import com.rest.auction.users.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = repository.findByEmail(username).orElseThrow(() -> new RuntimeException("User not found: " + username));
        List<String> roles = user.getRoles().stream()
                .filter(Objects::nonNull)
                .map(Role::getName)
                .collect(Collectors.toList());
        List<GrantedAuthority> grantedAuthorities=new ArrayList<>();
        roles.forEach(role->grantedAuthorities.add(new SimpleGrantedAuthority(role)));
        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), grantedAuthorities);
    }
}
