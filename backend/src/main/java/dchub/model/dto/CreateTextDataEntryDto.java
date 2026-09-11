package dchub.model.dto;

import dchub.model.domain.User;

public record CreateTextDataEntryDto(
        String title,
        String content,
        Long categoryId,
        User uploadedBy
) {
}
