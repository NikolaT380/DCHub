package dchub.model.exceptions;

public class DataEntryNotFoundException extends RuntimeException {
    public DataEntryNotFoundException(Long id) {
        super("Data entry with id %d does not exist.".formatted(id));
    }
}
