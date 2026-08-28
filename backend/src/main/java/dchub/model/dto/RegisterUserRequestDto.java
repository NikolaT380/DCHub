package dchub.model.dto;

import dchub.model.domain.Role;
import dchub.model.domain.User;

public record RegisterUserRequestDto(
    String username,
    String email,
    String password
) {
    public User toUser() {
        return new User(username, email, password);
    }
}
