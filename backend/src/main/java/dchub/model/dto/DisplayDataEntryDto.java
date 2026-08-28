package dchub.model.dto;

import dchub.model.domain.Category;
import dchub.model.domain.DataEntry;
import dchub.model.domain.User;

public record DisplayDataEntryDto(
        Long id,
        String title,
        String content,
        String filePath,
        String fileName,
        String fileType,
        Category category,
        User uploadedBy
) {
    public static DisplayDataEntryDto from(DataEntry dataEntry){
        return new DisplayDataEntryDto(
                dataEntry.getId(),
                dataEntry.getTitle(),
                dataEntry.getContent(),
                dataEntry.getFilePath(),
                dataEntry.getFileName(),
                dataEntry.getFileType(),
                dataEntry.getCategory(),
                dataEntry.getUploadedBy()
        );

    }
}
