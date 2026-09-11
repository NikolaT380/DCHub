package dchub.service.application;

import dchub.model.domain.User;
import dchub.model.dto.CreateFileDataEntryDto;
import dchub.model.dto.CreateTextDataEntryDto;
import dchub.model.dto.DisplayDataEntryDto;

import java.util.List;
import java.util.Optional;

public interface DataEntryApplicationService {
    DisplayDataEntryDto saveTextEntry(CreateTextDataEntryDto createTextDataEntryDto);

    DisplayDataEntryDto saveFileEntry(CreateFileDataEntryDto createFileDataEntryDto);

    List<DisplayDataEntryDto> findAll();

    List<DisplayDataEntryDto> findByUser(User user);

    Optional<DisplayDataEntryDto> findById(Long id);

    Optional<DisplayDataEntryDto> delete(Long id, User currentUser);
}