package dchub.model.dto;

import dchub.model.domain.Category;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateCategoryDto(
        @NotBlank(message = "A name is required.")
        String name,
        @Size(max = 512, message = "The description should be up to 512 characters.")
        String description
) {
    public Category toCategory() {
        return new Category(name, description);
    }
}
