package dchub.web;

import dchub.model.domain.Category;
import dchub.model.dto.CreateCategoryDto;
import dchub.model.dto.DisplayCategoryDto;
import dchub.service.application.CategoryApplicationService;
import dchub.service.domain.CategoryService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@AllArgsConstructor
@RequestMapping("/api/categories")
public class CategoryController {
    private final CategoryApplicationService categoryApplicationService;

    @GetMapping("/{id}")
    public ResponseEntity<DisplayCategoryDto> findById(@PathVariable Long id) {
        return categoryApplicationService
                .findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<DisplayCategoryDto>> findAll() {
        return ResponseEntity.ok(categoryApplicationService.findAll());
    }

    @PostMapping("/add")
    public ResponseEntity<DisplayCategoryDto> create(@RequestBody @Valid CreateCategoryDto createCategoryDto) {
        return ResponseEntity.ok(categoryApplicationService.create(createCategoryDto));
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<DisplayCategoryDto> delete(@PathVariable Long id) {
        return categoryApplicationService
                .delete(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
