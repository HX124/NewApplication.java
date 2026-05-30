package com.demo.new1.controller;

import com.demo.new1.pojo.ResponseMessage;
import com.demo.new1.pojo.dto.library.PreventiveMeasureDto;
import com.demo.new1.pojo.library.PreventiveMeasure;
import com.demo.new1.repository.PreventiveMeasureRepository;
import com.demo.new1.service.BaseLibraryService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/library/preventive-measure")
public class PreventiveMeasureController {

    @Autowired
    private PreventiveMeasureRepository repository;

    private BaseLibraryService<PreventiveMeasure, PreventiveMeasureDto> service;

    @PostConstruct
    public void init() {
        this.service = new BaseLibraryService<>(repository);
    }

    @GetMapping("/list")
    public ResponseMessage<List<PreventiveMeasure>> list() {
        return ResponseMessage.success(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseMessage<PreventiveMeasure> getById(@PathVariable Long id) {
        return ResponseMessage.success(service.findById(id));
    }

    @PostMapping
    public ResponseMessage<PreventiveMeasure> add(@RequestBody PreventiveMeasureDto dto) {
        PreventiveMeasure entity = new PreventiveMeasure();
        return ResponseMessage.success(service.add(dto, entity));
    }

    @PutMapping("/{id}")
    public ResponseMessage<PreventiveMeasure> update(@PathVariable Long id,
                                                     @RequestBody PreventiveMeasureDto dto) {
        return ResponseMessage.success(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseMessage<String> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseMessage.success("删除成功");
    }

    @DeleteMapping("/batch")
    public ResponseMessage<String> batchDelete(@RequestBody List<Long> ids) {
        service.deleteBatch(ids);
        return ResponseMessage.success("批量删除成功");
    }

    @GetMapping("/search")
    public ResponseMessage<List<PreventiveMeasure>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category) {

        List<PreventiveMeasure> result;

        boolean hasKeyword = keyword != null && !keyword.isEmpty();
        boolean hasCategory = category != null && !category.isEmpty();

        if (hasKeyword && hasCategory) {
            result = repository.searchByKeywordAndCategory(keyword, category);
        } else if (hasCategory) {
            result = repository.findByCategory(category);
        } else if (hasKeyword) {
            result = repository.search(keyword);
        } else {
            result = service.findAll();
        }

        return ResponseMessage.success(result);
    }

}
