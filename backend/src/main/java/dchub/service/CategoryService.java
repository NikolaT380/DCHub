package dchub.service;

import dchub.model.Category;

import java.util.List;
import java.util.Optional;

public interface CategoryService {

    List<Category> findAll();

    Optional<Category> findById(Long id);

    Category create(String name, String description);

    void delete(Long id);
}