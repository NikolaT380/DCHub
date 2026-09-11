package dchub.web;

import dchub.model.domain.User;
import dchub.model.dto.CreateFileDataEntryDto;
import dchub.model.dto.CreateTextDataEntryDto;
import dchub.model.dto.DisplayDataEntryDto;
import dchub.service.application.DataEntryApplicationService;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    @GetMapping("/{id}")
    public ResponseEntity<DisplayDataEntryDto> findById(@PathVariable Long id) {
        return dataEntryApplicationService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
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