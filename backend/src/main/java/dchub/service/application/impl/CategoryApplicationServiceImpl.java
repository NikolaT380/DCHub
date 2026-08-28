package dchub.service.application.impl;

import dchub.model.dto.CreateCategoryDto;
import dchub.model.dto.DisplayCategoryDto;
import dchub.service.application.CategoryApplicationService;
import dchub.service.domain.CategoryService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoryApplicationServiceImpl implements CategoryApplicationService {

    private final CategoryService categoryService;

    @Override
    public Optional<DisplayCategoryDto> findById(Long id) {
        return categoryService
                .findById(id)
                .map(DisplayCategoryDto::from);
    }

    @Override
    public List<DisplayCategoryDto> findAll() {
        return DisplayCategoryDto.from(categoryService.findAll());
    }

    @Override
    public DisplayCategoryDto create(CreateCategoryDto createCategoryDto) {
        return DisplayCategoryDto.from(categoryService.create(
                createCategoryDto.toCategory().getName(),
                createCategoryDto.description()));
    }

    @Override
    public Optional<DisplayCategoryDto> delete(Long id) {
        return categoryService
                .delete(id)
                .map(DisplayCategoryDto::from);
    }
}
