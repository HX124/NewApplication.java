package com.demo.new1.repository;

import com.demo.new1.pojo.Project;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProjectRepository extends CrudRepository<Project, Integer> {
    // 根据FMEA编号查询
    Project findByFmeaCode(String fmeaCode);
    // 根据责任人查询
    List<Project> findByResponsiblePerson(String responsiblePerson);
    // 根据状态查询
    List<Project> findByProjectStatus(String projectStatus);
    // 根据创建人的用户ID查询
    List<Project> findByUserId(Integer userId);
    // 查询最大编号
    @Query("SELECT MAX(p.fmeaCode) FROM Project p")
    String findMaxFmeaCode();
}