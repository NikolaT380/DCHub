package dchub.service.application;

import dchub.model.domain.Category;
import dchub.model.dto.CreateCategoryDto;
import dchub.model.dto.DisplayCategoryDto;

import java.util.List;
import java.util.Optional;

public interface CategoryApplicationService {
    Optional<DisplayCategoryDto> findById(Long id);

    List<DisplayCategoryDto> findAll();

    DisplayCategoryDto create(CreateCategoryDto createCategoryDto);

    Optional<DisplayCategoryDto> delete(Long id);
}
