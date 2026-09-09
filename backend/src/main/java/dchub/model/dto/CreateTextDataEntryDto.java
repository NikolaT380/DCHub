package dchub.model.dto;

import dchub.model.domain.Category;
import dchub.model.domain.DataEntry;
import dchub.model.domain.User;

public record CreateTextDataEntryDto(
        String title,
        String content,
        Category category,
        User uploadedBy
) {
    public DataEntry toDataEntry(){
        return new DataEntry(title, content, category, uploadedBy);
    }
}
