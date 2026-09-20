package dchub.web;

import dchub.model.domain.User;
import dchub.model.dto.CreateFileDataEntryDto;
import dchub.model.dto.CreateTextDataEntryDto;
import dchub.model.dto.DisplayDataEntryDto;
import dchub.model.dto.UpdateDataEntryDto;
import dchub.model.dto.FileDownloadDto;
import dchub.service.application.DataEntryApplicationService;
import lombok.AllArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.nio.charset.StandardCharsets;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/data_entries")
public class DataEntryController {

    private final DataEntryApplicationService dataEntryApplicationService;

    @GetMapping
    public ResponseEntity<List<DisplayDataEntryDto>> findAll() {
        return ResponseEntity.ok(dataEntryApplicationService.findAll());
    }

    @GetMapping("/my")
    public ResponseEntity<List<DisplayDataEntryDto>> findMyEntries(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(dataEntryApplicationService.findByUser(currentUser));
    }

    @PostMapping("/add-text")
    public ResponseEntity<DisplayDataEntryDto> saveTextEntry(
            @RequestParam String title,
            @RequestParam String content,
            @RequestParam(required = false) Long categoryId,
            @AuthenticationPrincipal User currentUser
    ) {
        CreateTextDataEntryDto dto = new CreateTextDataEntryDto(title, content, categoryId, currentUser);
        return ResponseEntity.ok(dataEntryApplicationService.saveTextEntry(dto));
    }

    @PostMapping(value = "/add-file", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DisplayDataEntryDto> saveFileEntry(
            @RequestParam("title") String title,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "categoryId", required = false) Long categoryId,
            @AuthenticationPrincipal User currentUser
    ) {
        CreateFileDataEntryDto dto = new CreateFileDataEntryDto(title, file, categoryId, currentUser);
        return ResponseEntity.ok(dataEntryApplicationService.saveFileEntry(dto));
    }

    @GetMapping("/{id}/file")
    public ResponseEntity<Resource> getFile(
            @PathVariable Long id,
            @RequestParam(defaultValue = "false") boolean download
    ) {
        FileDownloadDto fileDto = dataEntryApplicationService.loadFile(id);

        String dispositionType = download ? "attachment" : "inline";
        ContentDisposition disposition = ContentDisposition.builder(dispositionType)
                .filename(fileDto.getOriginalFileName(), StandardCharsets.UTF_8)
                .build();

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(fileDto.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, disposition.toString())
                .body(fileDto.getResource());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DisplayDataEntryDto> findById(@PathVariable Long id) {
        return dataEntryApplicationService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<DisplayDataEntryDto> update(
            @PathVariable Long id,
            @RequestBody UpdateDataEntryDto dto,
            @AuthenticationPrincipal User currentUser
    ) {
        return dataEntryApplicationService.update(id, dto, currentUser)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<DisplayDataEntryDto> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser
    ) {
        return dataEntryApplicationService.delete(id, currentUser)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}