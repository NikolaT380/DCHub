package dchub.service.application.impl;

import dchub.model.domain.Category;
import dchub.model.domain.User;
import dchub.model.dto.CreateFileDataEntryDto;
import dchub.model.dto.CreateTextDataEntryDto;
import dchub.model.dto.DisplayDataEntryDto;
import dchub.repository.CategoryRepository;
import dchub.service.application.DataEntryApplicationService;
import dchub.service.domain.DataEntryService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DataEntryApplicationServiceImpl implements DataEntryApplicationService {
    private final DataEntryService dataEntryService;

    @Override
    public DisplayDataEntryDto saveTextEntry(CreateTextDataEntryDto createTextDataEntryDto) {
        return DisplayDataEntryDto.from(dataEntryService.saveTextEntry(
                createTextDataEntryDto.toDataEntry().getTitle(),
                createTextDataEntryDto.toDataEntry().getContent(),
                createTextDataEntryDto.toDataEntry().getCategory().getId(),
                createTextDataEntryDto.toDataEntry().getUploadedBy()
                )
        );
    }

    @Override
    public DisplayDataEntryDto saveFileEntry(CreateFileDataEntryDto createFileDataEntryDto) {


        return DisplayDataEntryDto.from(dataEntryService.saveFileEntry(
                    createFileDataEntryDto.toDataEntry().getTitle(),
                    createFileDataEntryDto.toDataEntry().getFilePath(),
                    createFileDataEntryDto.toDataEntry().getFileName(),
                    createFileDataEntryDto.toDataEntry().getFileType(),
                    createFileDataEntryDto.toDataEntry().getCategory().getId(),
                    createFileDataEntryDto.toDataEntry().getUploadedBy()
                )
        );
    }

    @Override
    public List<DisplayDataEntryDto> findAll() {
        return DisplayDataEntryDto.from(dataEntryService.findAll());
    }

    @Override
    public List<DisplayDataEntryDto> findByUser(User user) {
        return DisplayDataEntryDto.from(dataEntryService.findByUser(user));
    }

    @Override
    public Optional<DisplayDataEntryDto> findById(Long id) {
        return dataEntryService.findById(id).map(DisplayDataEntryDto::from);
    }

    @Override
    public Optional<DisplayDataEntryDto> delete(Long id) {
        return dataEntryService.delete(id).map(DisplayDataEntryDto::from);
    }
}
