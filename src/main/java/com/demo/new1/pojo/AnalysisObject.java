package com.demo.new1.pojo;


import jakarta.persistence.*;

@Entity
@Table(name = "tb_analysisObject")
public class AnalysisObject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "analysis_object_id")
    private String analysisObjectId;
    @Column(name = "analysis_object_function")
    private String analysisObjectFunction;
    @Column(name = "analysis_object_failure")
    private String analysisObjectFailure;
    @Column(name = "analysis_object_improve")
    private String analysisObjectImprove;
    @Column(name = "analysis_object_severity")
    private Integer analysisObjectSeverity;
    @Column(name = "analysis_object_occurrence")
    private Integer analysisObjectOccurrence;
    @Column(name = "analysis_object_detection")
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
        return "AnalysisObject{" +
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
