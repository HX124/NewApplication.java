package com.demo.new1.service;

import com.demo.new1.pojo.Project;
import com.demo.new1.pojo.dto.ProjectDto;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public interface IProjectService {
    // 新增项目
    Project add(ProjectDto project);

    // 查询单个项目
    Project getProject(Integer fmeaId);

    // 根据FMEA编号查询
    Project getByFmeaCode(String fmeaCode);

    // 查询所有项目
    List<Project> getAllProjects();

    // 修改项目
    Project edit(ProjectDto project);

    // 删除项目
    void delete(Integer fmeaId);

    // 根据责任人查询
    List<Project> findByResponsiblePerson(String responsiblePerson);

    // 根据状态查询
    List<Project> findByProjectStatus(String projectStatus);

    // 根据用户ID查询
    List<Project> findByUserId(Integer userId);

    // 更新最后访问时间
    Project updateLastVisitedTime(Integer fmeaId);

    // 获取最大的FMEA编号
    String getMaxFmeaCode();
}