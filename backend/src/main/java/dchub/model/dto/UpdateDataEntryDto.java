package dchub.model.dto;

public record UpdateDataEntryDto(
        String title,
        String content,
        Long categoryId
) {
}