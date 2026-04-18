package com.demo.new1.controller;

import com.demo.new1.pojo.Project;
import com.demo.new1.pojo.ProjectDetail;
import com.demo.new1.pojo.ResponseMessage;
import com.demo.new1.pojo.dto.ProjectDto;
import com.demo.new1.service.IProjectService;
import com.demo.new1.service.ProjectDetailService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/project")
public class ProjectController {

    @Autowired
    private IProjectService projectService;

    @Autowired
    private ProjectDetailService projectDetailService;

    @GetMapping("/list")
    public ResponseMessage<List<Project>> getAllProjects() {
        List<Project> projects = projectService.getAllProjects();
        return ResponseMessage.success(projects);
    }

    @GetMapping("/{fmeaId}")
    public ResponseMessage<Project> getProject(@PathVariable Integer fmeaId) {
        Project project = projectService.getProject(fmeaId);
        return ResponseMessage.success(project);
    }

    @GetMapping("/code/{fmeaCode}")
    public ResponseMessage<Project> getByFmeaCode(@PathVariable String fmeaCode) {
        Project project = projectService.getByFmeaCode(fmeaCode);
        return ResponseMessage.success(project);
    }

    @PostMapping
    public ResponseMessage<Project> addProject(@RequestBody ProjectDto projectDto) {
        // 自动生成FMEA编号
        if (projectDto.getFmeaCode() == null || projectDto.getFmeaCode().isEmpty()) {
            String yearMonth = new java.text.SimpleDateFormat("yyyyMM").format(new java.util.Date());
            String maxCode = projectService.getMaxFmeaCode();
            int seq = 1;
            if (maxCode != null && maxCode.contains("-")) {
                String[] parts = maxCode.split("-");
                if (parts.length >= 3) {
                    try {
                        seq = Integer.parseInt(parts[2]) + 1;
                    } catch (Exception e) {
                        seq = 1;
                    }
                }
            }
            String fmeaCode = "FMEA-" + yearMonth + "-" + String.format("%03d", seq);
            projectDto.setFmeaCode(fmeaCode);
        }

        Project savedProject = projectService.add(projectDto);

        // 创建页面3默认数据
        try {
            projectDetailService.createPage3Default(
                    savedProject.getFmeaId(),
                    savedProject.getFmeaCode(),
                    savedProject.getFmeaName(),
                    savedProject.getResponsiblePerson(),
                    savedProject.getPlanStartDate()
            );
        } catch (Exception e) {
            System.out.println("创建页面3默认数据失败，但不影响项目创建: " + e.getMessage());
        }
        return ResponseMessage.success(savedProject);
    }

    @PutMapping
    public ResponseMessage<Project> updateProject(@RequestBody ProjectDto projectDto) {
        // 1. 更新项目表
        Project updatedProject = projectService.edit(projectDto);
        // 2. 同步更新细节表里的项目信息
        try {
            List<ProjectDetail> details = projectDetailService.getByFmeaId(updatedProject.getFmeaId());
            ObjectMapper mapper = new ObjectMapper();

            for (ProjectDetail detail : details) {
                String contentJson = detail.getContentJson();
                if (contentJson != null && !contentJson.isEmpty()) {
                    JsonNode root = mapper.readTree(contentJson);
                    boolean needUpdate = false;

                    if (root.has("fmea-name")) {
                        ((ObjectNode) root).put("fmea-name", updatedProject.getFmeaName());
                        needUpdate = true;
                    }
                    if (root.has("responsible-person")) {
                        ((ObjectNode) root).put("responsible-person", updatedProject.getResponsiblePerson());
                        needUpdate = true;
                    }
                    if (root.has("plan-start-date")) {
                        ((ObjectNode) root).put("plan-start-date", updatedProject.getPlanStartDate().toString());
                        needUpdate = true;
                    }

                    if (needUpdate) {
                        String newContentJson = mapper.writeValueAsString(root);
                        detail.setContentJson(newContentJson);
                        detail.setUpdatedAt(LocalDateTime.now());
                        projectDetailService.save(detail);
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return ResponseMessage.success(updatedProject);
    }

    @DeleteMapping("/{fmeaId}")
    public ResponseMessage<String> deleteProject(@PathVariable Integer fmeaId) {
        try {
            projectDetailService.deleteByFmeaId(fmeaId);
            projectService.delete(fmeaId);
            return ResponseMessage.success("删除成功");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseMessage.error("删除失败：" + e.getMessage());
        }
    }

    @DeleteMapping("/batch")
    public ResponseMessage<String> batchDeleteProjects(@RequestBody List<Integer> fmeaIds) {
        try {
            for (Integer fmeaId : fmeaIds) {
                projectDetailService.deleteByFmeaId(fmeaId);
                projectService.delete(fmeaId);
            }
            return ResponseMessage.success("批量删除成功");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseMessage.error("批量删除失败：" + e.getMessage());
        }
    }

    @PutMapping("/visit/{fmeaId}")
    public ResponseMessage<Project> updateVisitTime(@PathVariable Integer fmeaId) {
        Project project = projectService.updateLastVisitedTime(fmeaId);
        return ResponseMessage.success(project);
    }

    @GetMapping("/responsible/{person}")
    public ResponseMessage<List<Project>> getByResponsiblePerson(@PathVariable String person) {
        List<Project> projects = projectService.findByResponsiblePerson(person);
        return ResponseMessage.success(projects);
    }

    @GetMapping("/status/{status}")
    public ResponseMessage<List<Project>> getByStatus(@PathVariable String status) {
        List<Project> projects = projectService.findByProjectStatus(status);
        return ResponseMessage.success(projects);
    }

    @GetMapping("/user/{userId}")
    public ResponseMessage<List<Project>> getByUserId(@PathVariable Integer userId) {
        List<Project> projects = projectService.findByUserId(userId);
        return ResponseMessage.success(projects);
    }
}