package dchub.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.core.io.Resource;

@Getter
@AllArgsConstructor
public class FileDownloadDto {
    private final Resource resource;
    private final String originalFileName;
    private final String contentType;
}