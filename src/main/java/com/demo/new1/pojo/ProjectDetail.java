package com.demo.new1.pojo;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Table(name = "tb_project_detail")
@Entity
public class ProjectDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "detail_id")
    private Integer detailId;

    @Column(name = "fmea_id")
    private Integer fmeaId;

    @Column(name = "page_type")
    private Integer pageType;

    @Column(name = "content_json", columnDefinition = "json")
    private String contentJson;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Getter 和 Setter
    public Integer getDetailId() {
        return detailId;
    }

    public void setDetailId(Integer detailId) {
        this.detailId = detailId;
    }

    public Integer getFmeaId() {
        return fmeaId;
    }

    public void setFmeaId(Integer fmeaId) {
        this.fmeaId = fmeaId;
    }

    public Integer getPageType() {
        return pageType;
    }

    public void setPageType(Integer pageType) {
        this.pageType = pageType;
    }

    public String getContentJson() {
        return contentJson;
    }

    public void setContentJson(String contentJson) {
        this.contentJson = contentJson;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "ProjectDetail{" +
                "detailId=" + detailId +
                ", fmeaId=" + fmeaId +
                ", pageType=" + pageType +
                ", contentJson='" + contentJson + '\'' +
                ", updatedAt=" + updatedAt +
                ", createdAt=" + createdAt +
                '}';
    }
}