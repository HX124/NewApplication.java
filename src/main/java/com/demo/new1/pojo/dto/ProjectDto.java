package com.demo.new1.pojo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;
import java.time.LocalDate;

public class ProjectDto {
    private Integer fmeaId;

    @NotBlank(message = "FMEA名称不能为空")
    private String fmeaName;

    private String fmeaCode;  // 编号系统自动生成，不需要校验

    @NotBlank(message = "项目类型不能为空")
    private String projectType;

    @NotBlank(message = "项目状态不能为空")
    private String projectStatus;

    @NotBlank(message = "责任人不能为空")
    private String responsiblePerson;

    @NotNull(message = "计划开始时间不能为空")
    private LocalDate PlanStartDate;

    private Integer userId;  // 创建人ID

    // Getter 和 Setter
    public Integer getFmeaId() {
        return fmeaId;
    }

    public void setFmeaId(Integer fmeaId) {
        this.fmeaId = fmeaId;
    }

    public String getFmeaName() {
        return fmeaName;
    }

    public void setFmeaName(String fmeaName) {
        this.fmeaName = fmeaName;
    }

    public String getFmeaCode() {
        return fmeaCode;
    }

    public void setFmeaCode(String fmeaCode) {
        this.fmeaCode = fmeaCode;
    }

    public String getProjectType() {
        return projectType;
    }

    public void setProjectType(String projectType) {
        this.projectType = projectType;
    }

    public String getProjectStatus() {
        return projectStatus;
    }

    public void setProjectStatus(String projectStatus) {
        this.projectStatus = projectStatus;
    }

    public String getResponsiblePerson() {
        return responsiblePerson;
    }

    public void setResponsiblePerson(String responsiblePerson) {
        this.responsiblePerson = responsiblePerson;
    }

    public LocalDate getPlanStartDate() {
        return PlanStartDate;
    }

    public void setPlanStartDate(LocalDate PlanStartDate) {
        this.PlanStartDate = PlanStartDate;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    @Override
    public String toString() {
        return "ProjectDto{" +
                "fmeaId=" + fmeaId +
                ", fmeaName='" + fmeaName + '\'' +
                ", fmeaCode='" + fmeaCode + '\'' +
                ", projectType='" + projectType + '\'' +
                ", projectStatus='" + projectStatus + '\'' +
                ", responsiblePerson='" + responsiblePerson + '\'' +
                ", PlanStartDate=" + PlanStartDate +
                ", userId=" + userId +
                '}';
    }
}