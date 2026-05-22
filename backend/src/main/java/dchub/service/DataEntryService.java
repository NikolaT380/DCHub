package dchub.service;

import dchub.model.DataEntry;
import dchub.model.User;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface DataEntryService {

    DataEntry saveTextEntry(String title, String content, Long categoryId, User uploadedBy);

    DataEntry saveFileEntry(String title, MultipartFile file, Long categoryId, User uploadedBy);

    List<DataEntry> findAll();

    List<DataEntry> findByUser(User user);

    Optional<DataEntry> findById(Long id);

    void delete(Long id);
}