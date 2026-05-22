package dchub.service;

import dchub.model.User;

import java.util.Optional;

public interface UserService {

    User register(String username, String email, String password);

    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}