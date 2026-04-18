package com.demo.new1.controller;

import com.demo.new1.pojo.Project;
import com.demo.new1.pojo.ProjectDetail;
import com.demo.new1.pojo.ResponseMessage;
import com.demo.new1.pojo.dto.ProjectDetailDto;
import com.demo.new1.pojo.dto.ProjectDto;
import com.demo.new1.service.IProjectDetailService;
import com.demo.new1.service.IProjectService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/project/detail")
public class ProjectDetailController {

    @Autowired
    private IProjectDetailService projectDetailService;

    @Autowired
    private IProjectService projectService;

    @Autowired
    private ObjectMapper objectMapper;

    // ========== 保存页面数据 ==========
    @PostMapping("/save")
    public ResponseMessage<ProjectDetail> saveDetail(@RequestBody ProjectDetailDto detailDto) {
        System.out.println("=== 保存页面数据 ===");
        System.out.println("项目编号: " + detailDto.getFmeaCode());
        System.out.println("页面类型: " + detailDto.getPageType());
        System.out.println("页面数据: " + detailDto.getContent());

        try {
            // 1. 先保存页面详情（保存所有 JSON 数据）
            ProjectDetail savedDetail = projectDetailService.save(detailDto);

            // 2. 页面3需要同步更新 project 表
            if (detailDto.getPageType() == 3) {
                try {
                    JsonNode content;
                    // 处理 content 可能是对象的情况
                    if (detailDto.getContent() instanceof String) {
                        content = objectMapper.readTree((String) detailDto.getContent());
                    } else {
                        String contentStr = objectMapper.writeValueAsString(detailDto.getContent());
                        content = objectMapper.readTree(contentStr);
                    }

                    System.out.println("同步 - 解析后的 content: " + content);

                    Project project = projectService.getByFmeaCode(detailDto.getFmeaCode());
                    System.out.println("同步 - 查询到的项目: " + (project == null ? "null" : project.getFmeaName()));

                    if (project != null) {
                        boolean needUpdate = false;

                        // 同步 fmea_name ← content_json{fmea-name}
                        if (content.has("fmea-name")) {
                            String newFmeaName = content.get("fmea-name").asText();
                            System.out.println("同步 - fmea-name: " + newFmeaName + ", 当前值: " + project.getFmeaName());
                            if (!newFmeaName.equals(project.getFmeaName())) {
                                project.setFmeaName(newFmeaName);
                                needUpdate = true;
                                System.out.println("同步 - fmea-name 需要更新");
                            }
                        }

                        // 同步 responsible_person ← content_json{responsible-person}
                        if (content.has("responsible-person")) {
                            String newResponsiblePerson = content.get("responsible-person").asText();
                            System.out.println("同步 - responsible-person: " + newResponsiblePerson + ", 当前值: " + project.getResponsiblePerson());
                            if (!newResponsiblePerson.equals(project.getResponsiblePerson())) {
                                project.setResponsiblePerson(newResponsiblePerson);
                                needUpdate = true;
                                System.out.println("同步 - responsible-person 需要更新");
                            }
                        }

                        // 同步 plan_start_date ← content_json{plan-start-date}
                        if (content.has("plan-start-date")) {
                            String newDate = content.get("plan-start-date").asText();
                            System.out.println("同步 - plan-start-date: " + newDate + ", 当前值: " + (project.getPlanStartDate() == null ? "null" : project.getPlanStartDate().toString()));
                            if (newDate != null && !newDate.isEmpty()) {
                                if (project.getPlanStartDate() == null || !newDate.equals(project.getPlanStartDate().toString())) {
                                    java.time.LocalDate localDate = java.time.LocalDate.parse(newDate);
                                    project.setPlanStartDate(localDate);
                                    needUpdate = true;
                                    System.out.println("同步 - plan-start-date 需要更新");
                                }
                            }
                        }

                        if (needUpdate) {
                            ProjectDto updateDto = new ProjectDto();
                            updateDto.setFmeaId(project.getFmeaId());
                            updateDto.setFmeaCode(project.getFmeaCode());
                            updateDto.setFmeaName(project.getFmeaName());
                            updateDto.setResponsiblePerson(project.getResponsiblePerson());
                            updateDto.setPlanStartDate(project.getPlanStartDate());
                            updateDto.setProjectStatus(project.getProjectStatus());
                            updateDto.setProjectType(project.getProjectType());

                            System.out.println("同步 - 准备更新 project 表: " + updateDto);
                            projectService.edit(updateDto);
                            System.out.println("=== 已同步更新 project 表 ===");
                        } else {
                            System.out.println("=== 没有需要同步的字段 ===");
                        }
                    } else {
                        System.out.println("同步 - 项目不存在，fmeaCode: " + detailDto.getFmeaCode());
                    }
                } catch (Exception e) {
                    System.out.println("同步更新 project 表失败: " + e.getMessage());
                    e.printStackTrace();
                }
            }

            return ResponseMessage.success(savedDetail);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseMessage.error("保存失败: " + e.getMessage());
        }
    }

    // ========== 查询页面数据 ==========
    @GetMapping("/{fmeaCode}/{pageType}")
    public ResponseMessage<JsonNode> getDetail(@PathVariable String fmeaCode, @PathVariable Integer pageType) {
        System.out.println("=== 查询页面数据 ===");
        System.out.println("项目编号: " + fmeaCode);
        System.out.println("页面类型: " + pageType);

        try {
            // 直接从 tb_project_detail 获取页面 JSON 数据
            ProjectDetail detail = projectDetailService.getByFmeaCodeAndPageType(fmeaCode, pageType);

            if (detail == null || detail.getContentJson() == null) {
                // 如果没有数据，返回空对象
                return ResponseMessage.success(objectMapper.createObjectNode());
            }

            // 直接返回细节表的 JSON 数据
            JsonNode content = objectMapper.readTree(detail.getContentJson());
            System.out.println("查询到的数据: " + content);
            return ResponseMessage.success(content);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseMessage.error("查询失败: " + e.getMessage());
        }
    }
}