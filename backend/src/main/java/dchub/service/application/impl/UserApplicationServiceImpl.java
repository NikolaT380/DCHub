package dchub.service.application.impl;

import dchub.config.JwtHelper;
import dchub.model.domain.User;
import dchub.model.dto.LoginUserRequestDto;
import dchub.model.dto.LoginUserResponseDto;
import dchub.model.dto.RegisterUserRequestDto;
import dchub.model.dto.RegisterUserResponseDto;
import dchub.service.application.UserApplicationService;
import dchub.service.domain.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserApplicationServiceImpl implements UserApplicationService {
    private final UserService userService;
    private final JwtHelper jwtHelper;

    @Override
    public Optional<RegisterUserResponseDto> register(RegisterUserRequestDto registerUserRequestDto) {
        User user = userService.register(
                registerUserRequestDto.toUser().getUsername(),
                registerUserRequestDto.toUser().getEmail(),
                registerUserRequestDto.toUser().getPassword());
        RegisterUserResponseDto displayUserDto = RegisterUserResponseDto.from(user);
        return Optional.of(displayUserDto);
    }

    @Override
    public Optional<LoginUserResponseDto> login(LoginUserRequestDto loginUserRequestDto) {
        User user = userService.login(loginUserRequestDto.username(), loginUserRequestDto.password());

        String token = jwtHelper.generateToken(user);

        return Optional.of(new LoginUserResponseDto(token));
    }

    @Override
    public Optional<RegisterUserResponseDto> findByUsername(String username) {
        return userService
                .findByUsername(username)
                .map(RegisterUserResponseDto::from);
    }
}
