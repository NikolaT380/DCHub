package dchub.web;

import dchub.model.domain.DataEntry;
import dchub.model.domain.User;
import dchub.service.application.DataEntryApplicationService;
import dchub.service.domain.DataEntryService;
import lombok.AllArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@AllArgsConstructor
@RequestMapping("/api/data_entries")
public class DataEntryController {
    private final DataEntryApplicationService dataEntryApplicationService;



}
