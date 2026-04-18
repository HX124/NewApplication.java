package com.demo.new1.service;

import com.demo.new1.pojo.Project;
import com.demo.new1.pojo.ProjectDetail;
import com.demo.new1.pojo.dto.ProjectDetailDto;
import com.demo.new1.repository.ProjectDetailRepository;
import com.demo.new1.repository.ProjectRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ProjectDetailService implements IProjectDetailService {

    @Autowired
    private ProjectDetailRepository projectDetailRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public ProjectDetail save(ProjectDetailDto detailDto) {
        Project project = projectRepository.findByFmeaCode(detailDto.getFmeaCode());
        if (project == null) {
            throw new RuntimeException("项目不存在");
        }

        Integer fmeaId = project.getFmeaId();
        Integer pageType = detailDto.getPageType();

        Optional<ProjectDetail> existingDetail = projectDetailRepository.findByFmeaIdAndPageType(fmeaId, pageType);

        ProjectDetail detail;
        if (existingDetail.isPresent()) {
            detail = existingDetail.get();
            try {
                String contentJson = objectMapper.writeValueAsString(detailDto.getContent());
                detail.setContentJson(contentJson);
                detail.setUpdatedAt(LocalDateTime.now());
            } catch (Exception e) {
                throw new RuntimeException("JSON转换失败", e);
            }
        } else {
            detail = new ProjectDetail();
            detail.setFmeaId(fmeaId);
            detail.setPageType(pageType);
            detail.setCreatedAt(LocalDateTime.now());
            detail.setUpdatedAt(LocalDateTime.now());
            try {
                String contentJson = objectMapper.writeValueAsString(detailDto.getContent());
                detail.setContentJson(contentJson);
            } catch (Exception e) {
                throw new RuntimeException("JSON转换失败", e);
            }
        }

        return projectDetailRepository.save(detail);
    }

    @Override
    public ProjectDetail getByFmeaCodeAndPageType(String fmeaCode, Integer pageType) {
        Project project = projectRepository.findByFmeaCode(fmeaCode);
        if (project == null) {
            return null;
        }

        Integer fmeaId = project.getFmeaId();
        Optional<ProjectDetail> detail = projectDetailRepository.findByFmeaIdAndPageType(fmeaId, pageType);
        return detail.orElse(null);
    }

    public void deleteByFmeaId(Integer fmeaId) {
        projectDetailRepository.deleteByFmeaId(fmeaId);
    }

    public List<ProjectDetail> getByFmeaId(Integer fmeaId) {
        return projectDetailRepository.findByFmeaId(fmeaId);
    }

    public ProjectDetail save(ProjectDetail detail) {
        return projectDetailRepository.save(detail);
    }

    public void createPage3Default(Integer fmeaId, String fmeaCode, String fmeaName,
                                   String responsiblePerson, LocalDate planStartDate) {
        try {
            com.fasterxml.jackson.databind.node.ObjectNode defaultContent = objectMapper.createObjectNode();

            defaultContent.put("fmea-code", fmeaCode != null ? fmeaCode : "");
            defaultContent.put("fmea-name", fmeaName != null ? fmeaName : "");
            defaultContent.put("responsible-person", responsiblePerson != null ? responsiblePerson : "");
            defaultContent.put("plan-start-date", planStartDate != null ? planStartDate.toString() : "");

            defaultContent.put("project-name", fmeaName != null ? fmeaName : "");
            defaultContent.put("company-name", "");
            defaultContent.put("end-date", "");
            defaultContent.put("coordinator", "");
            defaultContent.put("confidentiality-level", "");
            defaultContent.put("core-team", "");
            defaultContent.put("extended-team", "");
            defaultContent.put("customer", "");
            defaultContent.put("customer-requirements", "");
            defaultContent.put("project-attachments", "");
            defaultContent.put("phone-number", "");
            defaultContent.put("notes", "");

            ProjectDetail detail = new ProjectDetail();
            detail.setFmeaId(fmeaId);
            detail.setPageType(3);
            detail.setCreatedAt(LocalDateTime.now());
            detail.setUpdatedAt(LocalDateTime.now());
            detail.setContentJson(objectMapper.writeValueAsString(defaultContent));

            projectDetailRepository.save(detail);
            System.out.println("=== 已自动创建页面3的默认数据 ===");
        } catch (Exception e) {
            System.out.println("创建页面3默认数据失败: " + e.getMessage());
            e.printStackTrace();
        }
    }
}