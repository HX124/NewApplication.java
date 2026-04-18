package com.demo.new1.service;

import com.demo.new1.pojo.Project;
import com.demo.new1.pojo.dto.ProjectDto;
import com.demo.new1.repository.ProjectRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProjectService implements IProjectService {

    @Autowired
    ProjectRepository projectRepository;

    @Override
    public Project add(ProjectDto projectDto) {
        Project project = new Project();
        BeanUtils.copyProperties(projectDto, project);
        project.setCreatedAt(LocalDateTime.now());
        project.setLastVisitedTime(LocalDateTime.now());
        return projectRepository.save(project);
    }

    @Override
    public Project getProject(Integer fmeaId) {
        return projectRepository.findById(fmeaId)
                .orElseThrow(() -> new IllegalArgumentException("项目不存在"));
    }

    @Override
    public Project getByFmeaCode(String fmeaCode) {
        return projectRepository.findByFmeaCode(fmeaCode);
    }

    @Override
    public List<Project> getAllProjects() {
        return (List<Project>) projectRepository.findAll();
    }

    @Override
    public Project edit(ProjectDto projectDto) {
        Project project = projectRepository.findById(projectDto.getFmeaId())
                .orElseThrow(() -> new RuntimeException("项目不存在"));

        if (projectDto.getFmeaName() != null) {
            project.setFmeaName(projectDto.getFmeaName());
        }
        if (projectDto.getProjectType() != null) {
            project.setProjectType(projectDto.getProjectType());
        }
        if (projectDto.getProjectStatus() != null) {
            project.setProjectStatus(projectDto.getProjectStatus());
        }
        if (projectDto.getResponsiblePerson() != null) {
            project.setResponsiblePerson(projectDto.getResponsiblePerson());
        }
        if (projectDto.getPlanStartDate() != null) {
            project.setPlanStartDate(projectDto.getPlanStartDate());
        }

        return projectRepository.save(project);
    }

    @Override
    public void delete(Integer fmeaId) {
        projectRepository.deleteById(fmeaId);
    }

    @Override
    public List<Project> findByResponsiblePerson(String responsiblePerson) {
        return projectRepository.findByResponsiblePerson(responsiblePerson);
    }

    @Override
    public List<Project> findByProjectStatus(String projectStatus) {
        return projectRepository.findByProjectStatus(projectStatus);
    }

    @Override
    public List<Project> findByUserId(Integer userId) {
        return projectRepository.findByUserId(userId);
    }

    @Override
    public Project updateLastVisitedTime(Integer fmeaId) {
        Project project = projectRepository.findById(fmeaId)
                .orElseThrow(() -> new RuntimeException("项目不存在，ID: " + fmeaId));
        project.setLastVisitedTime(LocalDateTime.now());
        return projectRepository.save(project);
    }

    @Override
    public String getMaxFmeaCode() {
        return projectRepository.findMaxFmeaCode();
    }
}