package com.shinefiling.common.controller;

import com.shinefiling.common.model.AiPrompt;
import com.shinefiling.common.service.AiPromptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prompts")
@CrossOrigin(origins = "http://localhost:5173")
public class AiPromptController {

    @Autowired
    private AiPromptService service;

    @GetMapping
    public List<AiPrompt> getAllPrompts() {
        return service.getAllPrompts();
    }

    @PostMapping
    public AiPrompt createPrompt(@RequestBody AiPrompt prompt) {
        return service.savePrompt(prompt);
    }

    @PutMapping("/{id}")
    public AiPrompt updatePrompt(@PathVariable Long id, @RequestBody AiPrompt prompt) {
        prompt.setId(id);
        return service.savePrompt(prompt);
    }

    @DeleteMapping("/{id}")
    public void deletePrompt(@PathVariable Long id) {
        service.deletePrompt(id);
    }
}
