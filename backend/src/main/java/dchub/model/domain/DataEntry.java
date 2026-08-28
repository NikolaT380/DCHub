package dchub.model.domain;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Entity
@Table(name = "data_entries")
public class DataEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "file_path", length = 500)
    private String filePath;

    @Column(name = "file_name", length = 255)
    private String fileName;

    @Column(name = "file_type", length = 50)
    private String fileType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by", nullable = false)
    private User uploadedBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public DataEntry(String title, String content, Category category, User uploadedBy) {
        this.title = title;
        this.content = content;
        this.category = category;
        this.uploadedBy = uploadedBy;
    }

    public DataEntry(String title, String filePath, String fileName, String fileType, Category category, User uploadedBy) {
        this.title = title;
        this.filePath = filePath;
        this.fileName = fileName;
        this.fileType = fileType;
        this.category = category;
        this.uploadedBy = uploadedBy;
    }
}