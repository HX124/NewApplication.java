package com.demo.new1.pojo.dto;

public class AnalysisObjectDto {
    private String analysisObjectId;
    private String analysisObjectFunction;
    private String analysisObjectFailure;
    private String analysisObjectImprove;
    private Integer analysisObjectSeverity;
    private Integer analysisObjectOccurrence;
    private Integer analysisObjectDetection;

    public String getAnalysisObjectId() {
        return analysisObjectId;
    }

    public void setAnalysisObjectId(String analysisObjectId) {
        this.analysisObjectId = analysisObjectId;
    }

    public String getAnalysisObjectFunction() {
        return analysisObjectFunction;
    }

    public void setAnalysisObjectFunction(String analysisObjectFunction) {
        this.analysisObjectFunction = analysisObjectFunction;
    }

    public String getAnalysisObjectFailure() {
        return analysisObjectFailure;
    }

    public void setAnalysisObjectFailure(String analysisObjectFailure) {
        this.analysisObjectFailure = analysisObjectFailure;
    }

    public String getAnalysisObjectImprove() {
        return analysisObjectImprove;
    }

    public void setAnalysisObjectImprove(String analysisObjectImprove) {
        this.analysisObjectImprove = analysisObjectImprove;
    }

    public Integer getAnalysisObjectSeverity() {
        return analysisObjectSeverity;
    }

    public void setAnalysisObjectSeverity(Integer analysisObjectSeverity) {
        this.analysisObjectSeverity = analysisObjectSeverity;
    }

    public Integer getAnalysisObjectOccurrence() {
        return analysisObjectOccurrence;
    }

    public void setAnalysisObjectOccurrence(Integer analysisObjectOccurrence) {
        this.analysisObjectOccurrence = analysisObjectOccurrence;
    }

    public Integer getAnalysisObjectDetection() {
        return analysisObjectDetection;
    }

    public void setAnalysisObjectDetection(Integer analysisObjectDetection) {
        this.analysisObjectDetection = analysisObjectDetection;
    }

    @Override
    public String toString() {
        return "AnalysisObjectDto{" +
                "analysisObjectId='" + analysisObjectId + '\'' +
                ", analysisObjectFunction='" + analysisObjectFunction + '\'' +
                ", analysisObjectFailure='" + analysisObjectFailure + '\'' +
                ", analysisObjectImprove='" + analysisObjectImprove + '\'' +
                ", analysisObjectSeverity=" + analysisObjectSeverity +
                ", analysisObjectOccurrence=" + analysisObjectOccurrence +
                ", analysisObjectDetection=" + analysisObjectDetection +
                '}';
    }
}
