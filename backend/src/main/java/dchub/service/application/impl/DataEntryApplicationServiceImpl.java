package dchub.service.application.impl;

import dchub.model.domain.DataEntry;
import dchub.model.domain.Role;
import dchub.model.domain.User;
import dchub.model.dto.CreateFileDataEntryDto;
import dchub.model.dto.CreateTextDataEntryDto;
import dchub.model.dto.DisplayDataEntryDto;
import dchub.service.application.DataEntryApplicationService;
import dchub.service.domain.DataEntryService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DataEntryApplicationServiceImpl implements DataEntryApplicationService {

    private final DataEntryService dataEntryService;

    @Override
    public DisplayDataEntryDto saveTextEntry(CreateTextDataEntryDto createTextDataEntryDto) {
        return DisplayDataEntryDto.from(
                dataEntryService.saveTextEntry(
                        createTextDataEntryDto.title(),
                        createTextDataEntryDto.content(),
                        createTextDataEntryDto.categoryId(),
                        createTextDataEntryDto.uploadedBy()
                )
        );
    }

    @Override
    public DisplayDataEntryDto saveFileEntry(CreateFileDataEntryDto createFileDataEntryDto) {
        return DisplayDataEntryDto.from(
                dataEntryService.saveFileEntry(
                        createFileDataEntryDto.title(),
                        createFileDataEntryDto.file(),
                        createFileDataEntryDto.categoryId(),
                        createFileDataEntryDto.uploadedBy()
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
    public Optional<DisplayDataEntryDto> delete(Long id, User currentUser) {
        Optional<DataEntry> dataEntryOptional = dataEntryService.findById(id);

        if (dataEntryOptional.isEmpty()) {
            return Optional.empty();
        }

        DataEntry dataEntry = dataEntryOptional.get();

        boolean isAdmin = currentUser.getRole() == Role.ADMIN;

        boolean isOwner = dataEntry.getUploadedBy()
                .getUsername()
                .equals(currentUser.getUsername());

        if (!isAdmin && !isOwner) {
            throw new AccessDeniedException("You may delete only your own data entries.");
        }

        return dataEntryService.delete(id).map(DisplayDataEntryDto::from);
    }
}