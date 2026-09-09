package dchub.model.exceptions;

public class UsernameAlreadyExistsException extends RuntimeException {
    public UsernameAlreadyExistsException(String username) {
        super("Username already taken: '%s'".formatted(username));
    }
}
