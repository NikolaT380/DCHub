package dchub.model.dto;

import dchub.model.domain.User;
import org.springframework.web.multipart.MultipartFile;

public record CreateFileDataEntryDto(
        String title,
        MultipartFile file,
        Long categoryId,
        User uploadedBy
) {
}