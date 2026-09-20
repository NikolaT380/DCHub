package dchub.model.dto;

import dchub.model.domain.User;
import dchub.model.domain.Role;
import java.time.LocalDateTime;

public record RegisterUserResponseDto(
    String username,
    String email,
    Role role,
    LocalDateTime createdAt
) {
    public static RegisterUserResponseDto from(User user) {
        return new RegisterUserResponseDto(
            user.getUsername(),
            user.getEmail(),
            user.getRole(),
            user.getCreatedAt()
        );
    }
}


