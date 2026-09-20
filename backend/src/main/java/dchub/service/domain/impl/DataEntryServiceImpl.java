package dchub.service.domain.impl;

import dchub.model.domain.Category;
import dchub.model.domain.DataEntry;
import dchub.model.domain.User;
import dchub.repository.CategoryRepository;
import dchub.repository.DataEntryRepository;
import dchub.service.domain.DataEntryService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DataEntryServiceImpl implements DataEntryService {

    private final DataEntryRepository dataEntryRepository;
    private final CategoryRepository categoryRepository;

    @Value("${app.storage.path}")
    private String storagePath;

    private static final List<String> ALLOWED_TYPES = List.of("pdf", "docx", "xlsx", "csv", "txt", "pptx");

    @Override
    public DataEntry saveTextEntry(String title, String content, Long categoryId, User uploadedBy) {
        Category category = resolveCategory(categoryId);

        DataEntry entry = new DataEntry(title, content, category, uploadedBy);

        return dataEntryRepository.save(entry);
    }

    @Override
    public DataEntry saveFileEntry(String title, MultipartFile file, Long categoryId, User uploadedBy) {
        Category category = resolveCategory(categoryId);
        String originalName = file.getOriginalFilename();
        String extension = getExtension(originalName);
        String storedName = UUID.randomUUID() + "." + extension;
        validateFileType(extension);

        Path storageDir = Paths.get(storagePath).toAbsolutePath().normalize();
        Path targetPath = storageDir.resolve(storedName);

        try {
            Files.createDirectories(storageDir);

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, targetPath, StandardCopyOption.REPLACE_EXISTING);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + originalName, e);
        }

        DataEntry entry = new DataEntry(title, targetPath.toString(), originalName, extension, category, uploadedBy);
        return dataEntryRepository.save(entry);
    }

    @Override
    public List<DataEntry> findAll() {
        return dataEntryRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    public List<DataEntry> findByUser(User user) {
        return dataEntryRepository.findByUploadedByOrderByCreatedAtDesc(user);
    }

    @Override
    public Optional<DataEntry> findById(Long id) {
        return dataEntryRepository.findById(id);
    }

    @Override
    public DataEntry update(Long id, String title, String content, Long categoryId) {
        DataEntry entry = dataEntryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("DataEntry not found: " + id));

        Category category = resolveCategory(categoryId);
        entry.setTitle(title);
        if (content != null) {
            entry.setContent(content);
        }
        entry.setCategory(category);

        return dataEntryRepository.save(entry);
    }

    @Override
    public Optional<DataEntry> delete(Long id) {
        Optional<DataEntry> dataEntryOptional = dataEntryRepository.findById(id);

        dataEntryOptional.ifPresent(dataEntry -> {
            if (dataEntry.getFilePath() != null && !dataEntry.getFilePath().isBlank()) {
                try {
                    Path path = Paths.get(dataEntry.getFilePath());
                    Files.deleteIfExists(path);
                } catch (IOException e) {
                    System.err.println("Failed to delete the file:" + e.getMessage());
                }
            }
            dataEntryRepository.delete(dataEntry);
        });

        return dataEntryOptional;
    }


    private Category resolveCategory(Long categoryId) {
        if (categoryId == null) return null;
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found: " + categoryId));
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "bin";
        return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
    }

    private void validateFileType(String extension) {
        if (!ALLOWED_TYPES.contains(extension)) {
            throw new IllegalArgumentException("File type not allowed: " + extension);
        }
    }
}