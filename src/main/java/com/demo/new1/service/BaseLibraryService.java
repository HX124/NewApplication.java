package com.demo.new1.service;

import com.demo.new1.pojo.library.BaseLibraryEntity;
import org.springframework.beans.BeanUtils;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public class BaseLibraryService<T extends BaseLibraryEntity, D> {

    private final JpaRepository<T, Long> repository;

    public BaseLibraryService(JpaRepository<T, Long> repository) {
        this.repository = repository;
    }

    public List<T> findAll() {
        return repository.findAll();
    }

    public T findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("记录不存在，ID: " + id));
    }

    public T add(D dto, T entity) {
        BeanUtils.copyProperties(dto, entity);
        entity.setCreateTime(LocalDateTime.now());
        entity.setUpdateTime(LocalDateTime.now());
        return repository.save(entity);
    }

    public T update(Long id, D dto) {
        T existing = findById(id);
        BeanUtils.copyProperties(dto, existing, "id", "createTime");
        existing.setUpdateTime(LocalDateTime.now());
        return repository.save(existing);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    public void deleteBatch(List<Long> ids) {
        repository.deleteAllById(ids);
    }
}
