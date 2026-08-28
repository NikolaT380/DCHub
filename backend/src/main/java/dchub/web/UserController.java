package dchub.web;

import dchub.service.application.UserApplicationService;
import dchub.service.domain.UserService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("/api/users")
public class UserController {
    private final UserApplicationService userApplicationService;


}
