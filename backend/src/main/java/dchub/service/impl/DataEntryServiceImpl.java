package dchub.service.impl;

import dchub.model.Category;
import dchub.model.DataEntry;
import dchub.model.User;
import dchub.repository.CategoryRepository;
import dchub.repository.DataEntryRepository;
import dchub.service.DataEntryService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
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

    private static final List<String> ALLOWED_TYPES = List.of("pdf", "docx", "xlsx", "csv", "txt");

    @Override
    public DataEntry saveTextEntry(String title, String content, Long categoryId, User uploadedBy) {
        Category category = resolveCategory(categoryId);

        DataEntry entry = DataEntry.builder()
                .title(title)
                .content(content)
                .category(category)
                .uploadedBy(uploadedBy)
                .build();

        return dataEntryRepository.save(entry);
    }

    @Override
    public DataEntry saveFileEntry(String title, MultipartFile file, Long categoryId, User uploadedBy) {
        Category category = resolveCategory(categoryId);

        String originalName = file.getOriginalFilename();
        String extension = getExtension(originalName);
        String storedName = UUID.randomUUID() + "." + extension;

        validateFileType(extension);

        Path targetPath = Paths.get(storagePath).resolve(storedName);

        try {
            Files.createDirectories(targetPath.getParent());
            file.transferTo(targetPath.toFile());
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + originalName, e);
        }

        DataEntry entry = DataEntry.builder()
                .title(title)
                .fileName(originalName)
                .filePath(targetPath.toString())
                .fileType(extension)
                .category(category)
                .uploadedBy(uploadedBy)
                .build();

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
    public void delete(Long id) {
        dataEntryRepository.deleteById(id);
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
            throw new RuntimeException("File type not allowed: " + extension);
        }
    }
}