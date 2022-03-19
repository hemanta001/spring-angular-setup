package com.rest.auction.users.service;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.rest.auction.common.models.ResponseModel;
import com.rest.auction.errors.EntityNotFoundException;
import com.rest.auction.users.UserSerializer;
import com.rest.auction.users.entity.Role;
import com.rest.auction.users.entity.User;
import com.rest.auction.users.repository.RoleRepository;
import com.rest.auction.users.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import javax.persistence.EntityManager;
import javax.validation.ConstraintViolationException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserInterface {
    private static final Logger LOGGER = LoggerFactory.getLogger(UserServiceImpl.class);
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    public final EntityManager entityManager;

    public UserServiceImpl(EntityManager entityManager,UserRepository userRepository, PasswordEncoder passwordEncoder, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
        this.entityManager=entityManager;
    }

    @Override
    public ResponseEntity<?> save(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        if (isAdminCreated()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Admin is already created.");

        user.setRoles(Collections.singletonList(roleRepository.findByName("ADMIN")));

        ResponseModel<User, Object> objectResponseModel = new ResponseModel<>();
        objectResponseModel.setData(userRepository.save(user));

        ObjectMapper mapper = new ObjectMapper();
        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
        SimpleModule module = new SimpleModule();
        module.addSerializer(User.class, new UserSerializer());
        mapper.registerModule(module);
        try {
            return ResponseEntity.ok(mapper.writeValueAsString(objectResponseModel));
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
            return null;
        }
    }

    @Override
    public ResponseEntity<?> all(Pageable pageable, OAuth2Authentication authentication) {
//        String auth = (String) authentication.getPrincipal();
//        String role = authentication.getAuthorities().iterator().next().getAuthority();
//        if (role.equals("USER")) {
//            return ResponseEntity.ok(userRepository.findAllByEmail(auth, pageable));
//        }
        return ResponseEntity.ok(userRepository.findAll(pageable));
    }

    @Override
    public ResponseEntity<?> getAllByRoleName(Pageable pageable, OAuth2Authentication authentication, String roleName) {
        String auth = authentication.getName();
        String role = authentication.getAuthorities().iterator().next().getAuthority();
        if (role.equals("USER")) {
            return ResponseEntity.ok(userRepository.findAllByEmail(auth, pageable));
        }
        return ResponseEntity.ok(userRepository.findByRoles_name(roleName, pageable));
    }

    @Override
    public ResponseEntity<?> one(Long id) {
        ResponseModel<User, Object> responseModel = new ResponseModel<>();
        responseModel.setData(userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException(User.class, "id", id.toString())));
        return ResponseEntity.ok(responseModel);
    }

    @Override
    public ResponseEntity<?> update(Long id, User res) {
        User u = userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException(User.class, "id", id.toString()));
        res.setPassword(u.getPassword());
        userRepository.save(res);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<?> create(User user) {
        String password = passwordEncoder.encode(user.getPassword());
        user.setPassword(password);

        List<Role> roles = user.getRoles().stream()
                .map(role -> roleRepository.findByName(role.getName()))
                .collect(Collectors.toList());
        user.setRoles(roles);

        ResponseModel<User, Object> responseModel = new ResponseModel<>();
        responseModel.setData(userRepository.save(user));

        return ResponseEntity.ok(responseModel);
    }

    @Override
    public ResponseEntity<?> delete(Long id) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            userRepository.delete(user);
        } else {
            throw new EntityNotFoundException(User.class, "id", id.toString());
        }
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<?> search(String email, Pageable pageable, OAuth2Authentication authentication) {
        String auth = (String) authentication.getUserAuthentication().getPrincipal();
        String role = authentication.getAuthorities().iterator().next().getAuthority();
        if (role.equals("USER")) {
            return ResponseEntity.ok(userRepository.findAllByEmailContainsAndEmail(email, auth, pageable));
        }
        return ResponseEntity.ok(userRepository.findByEmailContains(email, pageable));
    }

    @Override
    public ResponseEntity<?> findByEmail(String email) {
        return ResponseEntity.ok(userRepository.findByEmail(email).orElseThrow(() -> new EntityNotFoundException(User.class, "email", email)));
    }

    @Override
    public ResponseEntity<?> changePassword(Long id, String oldPassword, String newPassword) {
        User user = userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException(User.class, "id", id.toString()));
        if (oldPassword == null || oldPassword.isEmpty() || passwordEncoder.matches(oldPassword, user.getPassword())) {
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
        } else {
            throw new ConstraintViolationException("old password doesn't match", new HashSet<>());
        }
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<?> getRoles() {
        return ResponseEntity.ok(new HashMap<String, List<Role>>() {{
            put("roles", roleRepository.findAll());
        }});
    }

    @Override
    public ResponseEntity<?> getRoleByName(String name) {
        return ResponseEntity.ok(new HashMap<String, Role>() {{
            put("role", roleRepository.findByName(name));
        }});
    }

    @Override
    public String existsByEmail(String email) {
        ResponseModel<Map<String, Boolean>, Object> responseModel = new ResponseModel<>();
        responseModel.setData(new HashMap<String, Boolean>() {
            {
                put("exists", userRepository.existsByEmail(email));
            }
        });
        try {
            return new ObjectMapper().writeValueAsString(responseModel);
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
            return null;
        }
    }

    @Override
    public ResponseEntity<?> isAdminRegistered() {
        List<User> users = userRepository.findAll(PageRequest.of(0, 1)).getContent();
        return ResponseEntity.ok(new HashMap<String, Boolean>() {{
            put("isAdminRegistered", !users.isEmpty());
        }});
    }

    @Override
    public boolean isAdminCreated() {
        List<User> users = userRepository.findAll(PageRequest.of(0, 1)).getContent();
        return !users.isEmpty();
    }
}
