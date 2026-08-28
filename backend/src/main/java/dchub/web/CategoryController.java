package dchub.web;

import dchub.model.domain.Category;
import dchub.service.application.CategoryApplicationService;
import dchub.service.domain.CategoryService;
import lombok.AllArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@AllArgsConstructor
@RequestMapping("/api/categories")
public class CategoryController {
    private final CategoryApplicationService categoryApplicationService;


}
