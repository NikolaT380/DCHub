package dchub.service.application.impl;

import dchub.model.domain.DataEntry;
import dchub.model.domain.Role;
import dchub.model.domain.User;
import dchub.model.dto.CreateFileDataEntryDto;
import dchub.model.dto.CreateTextDataEntryDto;
import dchub.model.dto.DisplayDataEntryDto;
import dchub.model.dto.UpdateDataEntryDto;
import dchub.model.dto.FileDownloadDto;
import dchub.service.application.DataEntryApplicationService;
import dchub.service.domain.DataEntryService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;

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
    public Optional<DisplayDataEntryDto> update(Long id, UpdateDataEntryDto dto, User currentUser) {
        Optional<DataEntry> optional = dataEntryService.findById(id);
        if (optional.isEmpty()) {
            return Optional.empty();
        }

        DataEntry entry = optional.get();
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        boolean isOwner = entry.getUploadedBy().getUsername().equals(currentUser.getUsername());

        if (!isAdmin && !isOwner) {
            throw new AccessDeniedException("You may update only your own data entries.");
        }

        return Optional.of(DisplayDataEntryDto.from(
                dataEntryService.update(id, dto.title(), dto.content(), dto.categoryId())
        ));
    }

    @Override
    public FileDownloadDto loadFile(Long id) {
        DataEntry entry = dataEntryService.findById(id)
                .orElseThrow(() -> new RuntimeException("DataEntry not found: " + id));

        if (entry.getFilePath() == null || entry.getFilePath().isBlank()) {
            throw new RuntimeException("This entry has no attached physical file.");
        }

        try {
            Path path = Paths.get(entry.getFilePath());
            Resource resource = new UrlResource(path.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                throw new RuntimeException("File not found or not readable at: " + entry.getFilePath());
            }

            String contentType = MediaTypeFactory.getMediaType(entry.getFileName())
                    .map(MediaType::toString)
                    .orElse(MediaType.APPLICATION_OCTET_STREAM_VALUE);

            return new FileDownloadDto(resource, entry.getFileName(), contentType);
        } catch (MalformedURLException e) {
            throw new RuntimeException("Malformed file path: " + e.getMessage());
        }
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