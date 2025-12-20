package com.shinefiling.common.service;

import com.shinefiling.common.model.AiPrompt;
import com.shinefiling.common.repository.AiPromptRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AiPromptService {

    @Autowired
    private AiPromptRepository repository;

    public List<AiPrompt> getAllPrompts() {
        return repository.findAll();
    }

    public AiPrompt savePrompt(AiPrompt prompt) {
        return repository.save(prompt);
    }

    public AiPrompt getPrompt(Long id) {
        return repository.findById(id).orElse(null);
    }

    public void deletePrompt(Long id) {
        repository.deleteById(id);
    }
}
