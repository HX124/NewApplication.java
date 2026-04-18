package com.demo.new1.pojo.dto;

public class ProjectDetailDto {
    private String fmeaCode;      // 项目编号
    private Integer pageType;      // 页面类型
    private Object content;        // 页面数据（可以是任意对象）

    public String getFmeaCode() {
        return fmeaCode;
    }

    public void setFmeaCode(String fmeaCode) {
        this.fmeaCode = fmeaCode;
    }

    public Integer getPageType() {
        return pageType;
    }

    public void setPageType(Integer pageType) {
        this.pageType = pageType;
    }

    public Object getContent() {
        return content;
    }

    public void setContent(Object content) {
        this.content = content;
    }

    @Override
    public String toString() {
        return "ProjectDetailDto{" +
                "fmeaCode='" + fmeaCode + '\'' +
                ", pageType=" + pageType +
                ", content=" + content +
                '}';
    }
}