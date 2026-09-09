package dchub.service.application;

import dchub.model.domain.User;
import dchub.model.dto.LoginUserRequestDto;
import dchub.model.dto.LoginUserResponseDto;
import dchub.model.dto.RegisterUserRequestDto;
import dchub.model.dto.RegisterUserResponseDto;

import java.util.Optional;

public interface UserApplicationService {
    Optional<RegisterUserResponseDto> register(RegisterUserRequestDto registerUserRequestDto);

    Optional<LoginUserResponseDto> login(LoginUserRequestDto loginUserRequestDto);

    Optional<RegisterUserResponseDto> findByUsername(String username);
}
