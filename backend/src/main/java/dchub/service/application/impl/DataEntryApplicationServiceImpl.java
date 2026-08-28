package dchub.service.application.impl;

import dchub.model.domain.User;
import dchub.model.dto.CreateFileDataEntryDto;
import dchub.model.dto.CreateTextDataEntryDto;
import dchub.model.dto.DisplayDataEntryDto;
import dchub.service.application.DataEntryApplicationService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DataEntryApplicationServiceImpl implements DataEntryApplicationService {
    @Override
    public DisplayDataEntryDto saveTextEntry(CreateTextDataEntryDto createTextDataEntryDto) {
        return null;
    }

    @Override
    public DisplayDataEntryDto saveFileEntry(CreateFileDataEntryDto createFileDataEntryDto) {
        return null;
    }

    @Override
    public List<DisplayDataEntryDto> findAll() {
        return List.of();
    }

    @Override
    public List<DisplayDataEntryDto> findByUser(User user) {
        return List.of();
    }

    @Override
    public Optional<DisplayDataEntryDto> findById(Long id) {
        return Optional.empty();
    }

    @Override
    public Optional<DisplayDataEntryDto> delete(Long id) {
        return Optional.empty();
    }
}
