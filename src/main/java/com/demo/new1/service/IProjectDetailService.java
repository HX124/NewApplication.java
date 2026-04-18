package com.demo.new1.service;

import com.demo.new1.pojo.ProjectDetail;
import com.demo.new1.pojo.dto.ProjectDetailDto;

public interface IProjectDetailService {
    
    // 保存页面数据
    ProjectDetail save(ProjectDetailDto detailDto);
    
    // 根据项目编号和页面类型查询
    ProjectDetail getByFmeaCodeAndPageType(String fmeaCode, Integer pageType);
}