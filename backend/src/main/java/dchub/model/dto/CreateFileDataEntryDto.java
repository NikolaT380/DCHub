package dchub.model.dto;

import dchub.model.domain.Category;
import dchub.model.domain.DataEntry;
import dchub.model.domain.User;

public record CreateFileDataEntryDto(
        String title,
        String filePath,
        String fileName,
        String fileType,
        Category category,
        User uploadedBy
) {
    public DataEntry toDataEntry(){
        return new DataEntry(title, filePath, fileName, fileType, category, uploadedBy);
    }
}
