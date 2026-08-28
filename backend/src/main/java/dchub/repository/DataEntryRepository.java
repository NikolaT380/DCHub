package dchub.repository;

import dchub.model.domain.DataEntry;
import dchub.model.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface DataEntryRepository extends JpaRepository<DataEntry, Long> {

    List<DataEntry> findByUploadedBy(User user);

    List<DataEntry> findByUploadedByOrderByCreatedAtDesc(User user);

    List<DataEntry> findByCategoryId(Long categoryId);

    List<DataEntry> findAllByOrderByCreatedAtDesc();

    Page<DataEntry> findAllByOrderByCreatedAtDesc(Pageable pageable);
    Page<DataEntry> findByUploadedBy(User user, Pageable pageable);
}
