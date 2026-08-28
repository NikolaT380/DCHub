package dchub.model.dto;

import dchub.model.domain.User;
import dchub.model.domain.Role;

public record RegisterUserResponseDto(
    String username,
    String email,
    Role role
) {
    public static RegisterUserResponseDto from(User user) {
        return new RegisterUserResponseDto(
            user.getUsername(),
            user.getEmail(),
            user.getRole()
        );
    }
}


