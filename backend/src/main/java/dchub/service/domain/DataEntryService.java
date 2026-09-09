package dchub.service.domain;

import dchub.model.domain.DataEntry;
import dchub.model.domain.User;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface DataEntryService {

    DataEntry saveTextEntry(String title, String content, Long categoryId, User uploadedBy);

    DataEntry saveFileEntry(String title, MultipartFile file, Long categoryId, User uploadedBy);

    List<DataEntry> findAll();

    List<DataEntry> findByUser(User user);

    Optional<DataEntry> findById(Long id);

    Optional<DataEntry> delete(Long id);
}