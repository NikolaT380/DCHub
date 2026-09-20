package dchub.service.application;

import dchub.model.domain.User;
import dchub.model.dto.CreateFileDataEntryDto;
import dchub.model.dto.CreateTextDataEntryDto;
import dchub.model.dto.DisplayDataEntryDto;
import dchub.model.dto.UpdateDataEntryDto;
import dchub.model.dto.FileDownloadDto;

import java.util.List;
import java.util.Optional;

public interface DataEntryApplicationService {
    DisplayDataEntryDto saveTextEntry(CreateTextDataEntryDto createTextDataEntryDto);

    DisplayDataEntryDto saveFileEntry(CreateFileDataEntryDto createFileDataEntryDto);

    List<DisplayDataEntryDto> findAll();

    List<DisplayDataEntryDto> findByUser(User user);

    Optional<DisplayDataEntryDto> findById(Long id);

    Optional<DisplayDataEntryDto> update(Long id, UpdateDataEntryDto dto, User currentUser);

    FileDownloadDto loadFile(Long id);

    Optional<DisplayDataEntryDto> delete(Long id, User currentUser);
}