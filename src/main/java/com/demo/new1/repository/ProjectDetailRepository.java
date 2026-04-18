package com.demo.new1.repository;

import com.demo.new1.pojo.ProjectDetail;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectDetailRepository extends CrudRepository<ProjectDetail, Integer> {

    // 根据项目ID和页面类型查询
    Optional<ProjectDetail> findByFmeaIdAndPageType(Integer fmeaId, Integer pageType);

    // 根据项目ID查询所有页面数据
    List<ProjectDetail> findByFmeaId(Integer fmeaId);

    // 根据项目ID删除所有页面数据 - 使用 JPQL 查询
    @Modifying
    @Transactional
    @Query("DELETE FROM ProjectDetail pd WHERE pd.fmeaId = :fmeaId")
    void deleteByFmeaId(@Param("fmeaId") Integer fmeaId);
}