package dchub.service.domain.impl;

import dchub.model.domain.Category;
import dchub.repository.CategoryRepository;
import dchub.service.domain.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public List<Category> findAll() {
        return categoryRepository.findAllByOrderByNameAsc();
    }

    @Override
    public Optional<Category> findById(Long id) {
        return categoryRepository.findById(id);
    }

    @Override
    public Category create(String name, String description) {
        if (categoryRepository.existsByName(name)) {
            throw new RuntimeException("Category already exists: " + name);
        }

        Category category = new Category(name, description);

        return categoryRepository.save(category);
    }

    @Override
    public Optional<Category> delete(Long id) {
        Optional<Category> category = categoryRepository.findById(id);
        category.ifPresent(categoryRepository::delete);
        return category;
    }
}