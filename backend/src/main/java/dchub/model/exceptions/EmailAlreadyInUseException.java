package dchub.model.exceptions;

public class EmailAlreadyInUseException extends RuntimeException {
    public EmailAlreadyInUseException(String email) {
        super("Email already in use: '%s'".formatted(email));
    }
}
