package com.demo.new1.repository;

import com.demo.new1.pojo.library.PreventiveMeasure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface PreventiveMeasureRepository extends JpaRepository<PreventiveMeasure, Long> {

    // 关键字搜索（编号 + 描述）
    @Query("SELECT p FROM PreventiveMeasure p WHERE " +
            "LOWER(p.measureCode) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.measureDescription) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<PreventiveMeasure> search(@Param("keyword") String keyword);

    // ★ 新增：关键字 + 分类 联合搜索
    @Query("SELECT p FROM PreventiveMeasure p WHERE " +
            "p.category = :category AND (" +
            "LOWER(p.measureCode) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.measureDescription) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<PreventiveMeasure> searchByKeywordAndCategory(@Param("keyword") String keyword,
                                                       @Param("category") String category);

    // ★ 新增：仅按分类筛选
    List<PreventiveMeasure> findByCategory(String category);
}
