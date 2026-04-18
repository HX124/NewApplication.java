package com.demo.new1.pojo;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Table(name = "tb_project")
@Entity
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fmea_id")
    private Integer fmeaId;
    @Column(name = "fmea_code")
    private String fmeaCode;
    @Column(name = "fmea_name")
    private String fmeaName;
    @Column(name = "project_type")
    private String projectType;
    @Column(name = "project_status")
    private String projectStatus;
    @Column(name = "responsible_person")
    private String responsiblePerson;
    @Column(name = "plan_start_date")
    private LocalDate PlanStartDate;
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    @Column(name = "last_visited_time")
    private LocalDateTime lastVisitedTime;
    @Column(name = "user_id")
    private Integer userId;

    // 构造函数
    public Project() {
    }

    // Getter 和 Setter 方法
    public Integer getFmeaId() {
        return fmeaId;
    }

    public void setFmeaId(Integer fmeaId) {
        this.fmeaId = fmeaId;
    }

    public String getFmeaCode() {
        return fmeaCode;
    }

    public void setFmeaCode(String fmeaCode) {
        this.fmeaCode = fmeaCode;
    }

    public String getFmeaName() {
        return fmeaName;
    }

    public void setFmeaName(String fmeaName) {
        this.fmeaName = fmeaName;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getLastVisitedTime() {
        return lastVisitedTime;
    }

    public void setLastVisitedTime(LocalDateTime lastVisitedTime) {
        this.lastVisitedTime = lastVisitedTime;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    @Override
    public String toString() {
        return "Project{" +
                "fmeaId=" + fmeaId +
                ", fmeaCode='" + fmeaCode + '\'' +
                ", fmeaName='" + fmeaName + '\'' +
                ", projectType='" + projectType + '\'' +
                ", projectStatus='" + projectStatus + '\'' +
                ", responsiblePerson='" + responsiblePerson + '\'' +
                ", PlanStartDate=" + PlanStartDate +
                ", createdAt=" + createdAt +
                ", lastVisitedTime=" + lastVisitedTime +
                ", userId=" + userId +
                '}';
    }
}