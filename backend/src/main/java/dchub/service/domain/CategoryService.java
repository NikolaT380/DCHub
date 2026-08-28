package dchub.service.domain;

import dchub.model.domain.Category;

import java.util.List;
import java.util.Optional;

public interface CategoryService {
    Optional<Category> findById(Long id);

    List<Category> findAll();

    Category create(String name, String description);

    Optional<Category> delete(Long id);
}