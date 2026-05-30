package com.demo.new1.pojo.library;
import jakarta.persistence.*;

@Entity
@Table(name = "tb_preventive_measure")
public class PreventiveMeasure extends BaseLibraryEntity {

    @Column(name = "measure_code", unique = true)
    private String measureCode;

    @Column(name = "measure_description", columnDefinition = "TEXT")
    private String measureDescription;

    @Column(name = "category")
    private String category;

    public String getMeasureCode() { return measureCode; }
    public void setMeasureCode(String measureCode) { this.measureCode = measureCode; }

    public String getMeasureDescription() { return measureDescription; }
    public void setMeasureDescription(String measureDescription) { this.measureDescription = measureDescription; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

}
