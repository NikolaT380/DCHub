package dchub.model.dto;

import dchub.model.domain.Category;
import dchub.model.domain.DataEntry;
import dchub.model.domain.User;

import java.util.List;
//TODO: Kako da napravam posebni za FileDataEntry i TextDataEntry
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

    public static List<DisplayDataEntryDto> from(List<DataEntry> dataEntries){
        return dataEntries.stream().map(DisplayDataEntryDto::from).toList();
    }
}
