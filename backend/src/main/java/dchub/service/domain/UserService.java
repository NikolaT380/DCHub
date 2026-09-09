package dchub.service.domain;

import dchub.model.domain.User;

import java.util.Optional;

public interface UserService {

    User register(String username, String email, String password);

    User login(String username, String password);

    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}