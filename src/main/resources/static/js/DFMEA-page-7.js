// 全局变量
let selectedRowId = null;
let currentPreventiveIndex = null;
let currentDetectiveIndex = null;
let isNewPreventive = false;
let isNewDetective = false;

// 模拟页面6的数据结构（包含层级关系）
const page6StructureData = [
    // 第一行：上一较高级别=壳体，关注要素=控制部分
    {
        fe: "壳体",
        fm: "控制部分",
        fc: "充电口"
    },
    {
        fe: "壳体",
        fm: "控制部分",
        fc: "音源键"
    },
    {
        fe: "壳体",
        fm: "控制部分",
        fc: "耳机口"
    },
    {
        fe: "壳体",
        fm: "控制部分",
        fc: "电源键口"
    },
    // 第二行：上一较高级别=壳体，关注要素=装饰部分
    {
        fe: "壳体",
        fm: "装饰部分",
        fc: "镜头"
    },
    {
        fe: "壳体",
        fm: "装饰部分",
        fc: "扬声器口"
    },
    {
        fe: "壳体",
        fm: "装饰部分",
        fc: "挂绳"
    },
    {
        fe: "壳体",
        fm: "装饰部分",
        fc: "印花"
    }
];

const failureModes = {
    "壳体": ["无法固定手机机身，无法保护手机硬件，不美观"],
    "控制部分": ["不能保护手机按键和外部零件接入口"],
    "充电口": ["厚度 < 2mm或 > 3mm,与充电接口距离为 < 1mm或 > 3mm"],
    "音源键": ["小于或大于手机音量键尺寸"],
    "耳机口": ["与耳机插孔距离 < 1mm或 > 2mm"],
    "电源键口": ["尺寸小于手机电源键，坡度 > 15°"],
    "装饰部分": ["无法固定手机机身，无法保护手机硬件，不美观"],
    "镜头": ["尺寸与镜头不一致，遮挡镜头"],
    "扬声器口": ["与扬声器口距离 > 1mm或堵塞扬声器口"],
    "挂绳": ["开裂，无法固定手机绳"],
    "印花": ["涂料不均匀，图案不清晰不完整，有色差"]
};

let failureDataFromPage6 = [];

// 风险分析数据（模拟数据库）
let riskAnalysisData = [
    // 充电口
    {
        pc: "采用数控机床进行生产",
        o: 5,
        pcStatus: "已完成",
        dc: "随机抽检：人工目检",
        d: 8,
        dcStatus: "已完成",
        ap: "H",
        special: "重要特性"
    },
    // 音源键
    {
        pc: "采用数控机床进行生产",
        o: 4,
        pcStatus: "已完成",
        dc: "随机抽检：人工目检",
        d: 8,
        dcStatus: "已完成",
        ap: "H",
        special: "重要特性"
    },
    // 耳机口
    {
        pc: "采用数控机床进行生产",
        o: 5,
        pcStatus: "已完成",
        dc: "随机抽检：人工目检",
        d: 8,
        dcStatus: "已完成",
        ap: "H",
        special: "重要特性"
    },
    // 电源键口
    {
        pc: "采用数控机床进行生产",
        o: 4,
        pcStatus: "已完成",
        dc: "随机抽检：人工目检",
        d: 8,
        dcStatus: "已完成",
        ap: "M",
        special: ""
    },
    // 镜头
    {
        pc: "采用数控机床进行生产",
        o: 5,
        pcStatus: "已完成",
        dc: "随机抽检：人工目检",
        d: 8,
        dcStatus: "已完成",
        ap: "M",
        special: ""
    },
    // 扬声器口
    {
        pc: "采用数控机床进行生产",
        o: 3,
        pcStatus: "已完成",
        dc: "随机抽检：人工目检",
        d: 8,
        dcStatus: "已完成",
        ap: "H",
        special: ""
    },
    // 挂绳
    {
        pc: "采用数控机床进行生产",
        o: 5,
        pcStatus: "已完成",
        dc: "随机抽检：人工目检",
        d: 8,
        dcStatus: "已完成",
        ap: "H",
        special: ""
    },
    // 印花
    {
        pc: "采用数控机床进行生产",
        o: 6,
        pcStatus: "已完成",
        dc: "随机抽检：人工目检",
        d: 8,
        dcStatus: "已完成",
        ap: "H",
        special: ""
    }
];

// 在页面加载时初始化标准内容
document.addEventListener('DOMContentLoaded', function() {
    // 生成完整的失效数据
    generateFailureData();
    refreshTable();
    setupEventListeners();
    
    // 初始化标准内容
    initializeStandardContents();
});

// 初始化标准内容函数
function initializeStandardContents() {
    // 严重度标准
    const severityStandard = [
        {score: 10, level: "非常高", desc: "影响到手机的使用和操作安全，使用人员的健康状况。"},
        {score: 9, level: "", desc: "不符合法规。"},
        {score: 8, level: "高", desc: "在预期使用寿命内，失去正常使用所必需的手机壳的主要功能。"},
        {score: 7, level: "", desc: "在预期使用寿命内，降低正常使用所必需的手机壳的主要功能。"},
        {score: 6, level: "中", desc: "失去手机壳次要功能"},
        {score: 5, level: "", desc: "降低手机壳次要功能"},
        {score: 4, level: "", desc: "外观、粗糙度或触感令人感觉非常不舒服。"},
        {score: 3, level: "低", desc: "外观、粗糙度或触感令人感觉中度不舒服。"},
        {score: 2, level: "", desc: "外观、粗糙度或触感令人感觉略微不舒服。"},
        {score: 1, level: "非常低", desc: "没有可觉察到的影响。"}
    ];
    
    // 频度标准
    const occurrenceStandard = [
        {score: 10, level: "极高", desc: "在无操作经验和/或在运行条件不可控制的情况下的任何地方对新技术的首次应用。没有对产品进行验证和/或确认的经验不存在标准，且尚未确定最佳实践。预防控制不能预测使用现场绩效或不存在预防控制。"},
        {score: 9, level: "非常高", desc: "在公司内首次应用具有技术创新或材料的设计。新应用，或工作周期/运行条件有改变。没有对产品进行验证和/或确认的经验。预防控制不是针对确定特定要求的性能。"},
        {score: 8, level: "高", desc: "在新应用内首次使用具备创新技术的设计产品或材料。新应用，或工作周期/运行条件有改变。没有对产品进行验证和/可确认的经验。极少存在现有标准和最佳实践，不能直接用于该设计产品。预防控制不能可靠地反映使用现场绩效。"},
        {score: 7, level: "", desc: "根据相似技术和材料的新型设计。新应用，或工作周期/运行条件有改变。没有对产品进行验证和/或确认的经验。"},
        {score: 6, level: "", desc: "应用现有技术和材料，与之前设计相似。类似应用，工作周期或运行条件有改变。之前的测试或使用现场经验。存在标准和设计规则，但不足以确保不会出现失效起因。预防控制提供了预防失效起因的部分能力。"},
        {score: 5, level: "中", desc: "应用成熟技术和材料，与之前设计相比有细节上的变化。类似的应用、工作周期或运行条件。之前的测试或使用现场经验，或为具有与失效相关测试经验的新设计。在之前设计中所学到的与解决设计问题相关的教训。在本设计中对最佳实践进行再评估，但尚未经过验证。预防控制能够发现与失效起因相关的产品缺陷，并提供部分性能指标。"},
        {score: 4, level: "", desc: "与短期现场使用暴露几乎相同的设计。类似应用，工作周期或运行条件有细微变化。之前测试或使用现场经验。"},
        {score: 3, level: "低", desc: "对已知设计(相同应用，在工作周期或操作条件方面)和测试或类似运行条件下的现场经验的细微变化或成功完成测试程序的新设计。"},
        {score: 2, level: "非常低", desc: "与长期现场暴露几乎相同的设计。相同应用，具备类似的工作周期或运行条件。在类似运行条件下的测试或使用现场经验。考虑到之前设计的经验教训并对其具备充足的信心，设计预计符合标准和最佳实践。预防控制能够发现与失效起因相关的产品缺陷，并显示出对设计符合性的信心。"},
        {score: 1, level: "极低", desc: "失效通过预防控制消除，通过设计失效起因不可能发生。"}
    ];
    
    // 探测度标准
    const detectionStandard = [
        {score: 10, level: "非常低", desc: "尚未制定测试过程。", method: "尚未确定测试方法"},
        {score: 9, level: "", desc: "没有为探测失效模式或失效起因而特别地设计测试方法。", method: "通过/不通过测试、失效测试、老化测试"},
        {score: 8, level: "低", desc: "新测试方法，尚未经过验证。", method: "通过/不通过测试、失效测试、老化测试"},
        {score: 7, level: "", desc: "已经验证的测试方法，该方法用于功能性验证或性能、质量、可靠性以及耐久性确认；测试计划时间在产品开发周期内较迟，如果测试失败将导致重新设计、重新开模具导致生产延迟。", method: "通过/不通过测试"},
        {score: 6, level: "中", desc: "", method: "失效测试"},
        {score: 5, level: "", desc: "", method: "老化测试"},
        {score: 4, level: "高", desc: "已经验证的测试方法，该方法用于功能性验证或性能、质量、可靠性以及耐久性确认;计划时间充分，可以在开始生产之前修改生产工装。", method: "通过/不通过测试"},
        {score: 3, level: "", desc: "", method: "失效测试"},
        {score: 2, level: "", desc: "", method: "老化测试"},
        {score: 1, level: "非常高", desc: "之前测试证明不会出现失效模式或失效起因，或者探测方法经过实践验证总是能够探测到失效模式或失效起因。", method: ""}
    ];
    
    // 生成标准HTML
    generateStandardHTML('severity-standard-content', severityStandard, '严重度(S)');
    generateStandardHTML('preventive-standard-content', occurrenceStandard, '频度(O)');
    generateStandardHTML('detective-standard-content', detectionStandard, '探测度(D)');
}

// 生成标准HTML函数
function generateStandardHTML(elementId, standards, title) {
    const container = document.getElementById(elementId);
    if (!container) return;

    let html = ``;

    standards.forEach(item => {
        html += `<div class="standard-item">
            <strong>${item.score}分${item.level ? ` - ${item.level}` : ''}</strong>
            <em>${item.desc}</em>
            ${item.method ? `<em>探测方法: ${item.method}</em>` : ''}
        </div>`;
    });
    
    container.innerHTML = html;
}

// 生成失效数据
function generateFailureData() {
    failureDataFromPage6 = [];
    
    page6StructureData.forEach(item => {
        const fe = item.fe;
        const fm = item.fm;
        const fc = item.fc;
        
        // 构建失效影响
        let feText = "";
        let feSeverity = 0;
        
        if (fe) {
            const feFailures = failureModes[fe] || [];
            feText = formatElementWithFailure(fe, feFailures);
            feSeverity = calculateSeverity(fe);
        }
        
        // 构建失效模式
        let fmText = "";
        if (fm) {
            const fmFailures = failureModes[fm] || [];
            fmText = formatElementWithFailure(fm, fmFailures);
        }
        
        // 构建失效起因
        let fcText = "";
        if (fc) {
            const fcFailures = failureModes[fc] || [];
            fcText = formatElementWithFailure(fc, fcFailures);
        }
        
        failureDataFromPage6.push({
            fe: feText,
            s: feSeverity,
            fm: fmText,
            fc: fcText,
            elementName: fe || fm || fc
        });
    });
}

// 格式化元素和失效模式（要素黑色，失效模式红色）
function formatElementWithFailure(elementName, failures) {
    if (!elementName) return "";
    
    if (failures.length === 0) {
        return elementName;
    }
    
    // 要素名称（黑色） + 失效模式（红色）
    let formatted = `<span class="element-name">${elementName}</span>`;
    
    failures.forEach(failure => {
        formatted += `<br/><span class="failure-mode">${failure}</span>`;
    });
    
    return formatted;
}

// 计算严重度
function calculateSeverity(elementName) {
    const severityMap = {
        "壳体": 8,
        "控制部分": 8,
        "装饰部分": 8,
        "充电口": 8,
        "音源键": 8,
        "耳机口": 8,
        "电源键口": 8,
        "镜头": 8,
        "扬声器口": 8,
        "挂绳": 8,
        "印花": 8
    };
    
    return severityMap[elementName] || 5;
}

// 设置事件监听器
function setupEventListeners() {
    // 右键菜单隐藏
    document.addEventListener('click', function(e) {
        if (!e.target.closest('#context-menu')) {
            document.getElementById('context-menu').style.display = 'none';
        }
    });
    
    // 预防措施表单提交
    document.getElementById('preventive-form').addEventListener('submit', function(e) {
        e.preventDefault();
        handlePreventiveFormSubmit();
    });
    
    // 探测措施表单提交
    document.getElementById('detective-form').addEventListener('submit', function(e) {
        e.preventDefault();
        handleDetectiveFormSubmit();
    });
    
    // 严重度表单提交
    document.getElementById('severity-form').addEventListener('submit', function(e) {
        e.preventDefault();
        handleSeverityFormSubmit();
    });
}

// 刷新表格
function refreshTable() {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';
    
    // 合并数据
    const combinedData = [];
    const dataLength = Math.max(failureDataFromPage6.length, riskAnalysisData.length);
    
    for (let i = 0; i < dataLength; i++) {
        const failure = failureDataFromPage6[i] || {
            fe: "",
            s: "",
            fm: "",
            fc: "",
            elementName: ""
        };
        
        const risk = riskAnalysisData[i] || getDefaultRiskData();
        
        combinedData.push({
            ...failure,
            ...risk,
            rowIndex: i
        });
    }
    
    // 填充表格
    combinedData.forEach((item, index) => {
        const row = document.createElement('tr');
        row.dataset.id = index;

        // 获取AP等级对应的CSS类
        const apClass = `ap-${item.ap}`;
        
        // 构建预防措施单元格内容，包含状态
        let pcCellContent = item.pc || '暂无预防措施';
        if (item.pcStatus) {
            pcCellContent += `<br/><span class="status-indicator status-${getStatusClass(item.pcStatus)}" title="措施状态: ${item.pcStatus}">${item.pcStatus}</span>`;
        }
        
        // 构建探测措施单元格内容，包含状态
        let dcCellContent = item.dc || '暂无探测措施';
        if (item.dcStatus) {
            dcCellContent += `<br/><span class="status-indicator status-${getStatusClass(item.dcStatus)}" title="措施状态: ${item.dcStatus}">${item.dcStatus}</span>`;
        }

        // 构建表格行HTML
        row.innerHTML = `
            <!-- 失效分析部分 -->
            <td>${item.fe || ''}</td>
            <td class="rating-cell">${item.s || ''}</td>
            <td>${item.fm || ''}</td>
            <td>${item.fc || ''}</td>
            
            <!-- 风险分析部分 -->
            <td>${pcCellContent}</td>
            <td class="rating-cell">${item.o || ''}</td>
            <td>${dcCellContent}</td>
            <td class="rating-cell">${item.d || ''}</td>
            <td class="ap-cell ${apClass}">${item.ap || ''}</td>
            <td class="special-char">${item.special || ''}</td>
        `;
        
        // 添加右键事件
        row.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            
            // 清除之前选中的行
            document.querySelectorAll('#table-body tr.selected').forEach(el => {
                el.classList.remove('selected');
            });
            
            // 设置当前行为选中状态
            row.classList.add('selected');
            selectedRowId = index;
            
            // 显示右键菜单
            showContextMenu(e);
        });
        
        tableBody.appendChild(row);
    });
}

function getStatusClass(status) {
    const statusClassMap = {
        '不执行': 'not-executed',
        '尚未确认': 'not-confirmed',
        '尚未决策': 'not-decided',
        '尚未完成': 'not-completed',
        '已完成': 'completed'
    };
    return statusClassMap[status] || 'default';
}

// 获取默认风险数据
function getDefaultRiskData() {
    return {
        pc: "",
        o: null,
        pcStatus: "", 
        dc: "",
        d: null,
        dcStatus: "", 
        ap: "",
        special: ""
    };
}

// 显示右键菜单
function showContextMenu(event) {
    const menu = document.getElementById('context-menu');
    if (!menu) return;
    
    // 获取点击的单元格
    const clickedCell = event.target.closest('td');
    if (!clickedCell) return;
    
    // 获取单元格所在的列索引
    const cellIndex = clickedCell.cellIndex;
    const row = clickedCell.closest('tr');
    if (!row) return;
    
    // 隐藏菜单（先隐藏再显示以避免闪烁）
    menu.style.display = 'none';
    
    // 根据列索引设置菜单内容
    const menuContent = document.getElementById('context-menu-content');
    menuContent.innerHTML = '';
    
    // 失效分析列（1-4列）：显示"编辑严重度"
    if (cellIndex >= 0 && cellIndex <= 3) {
        const severityItem = document.createElement('div');
        severityItem.className = 'context-menu-item';
        severityItem.innerHTML = '<i class="fas fa-exclamation-triangle"></i> 编辑严重度';
        severityItem.onclick = handleEditSeverity;
        menuContent.appendChild(severityItem);
    }
    // 风险分析列的前4列（5-8列）：显示"编辑预防措施"和"编辑探测措施"
    else if (cellIndex >= 4 && cellIndex <= 7) {
        // 预防措施项
        const preventiveItem = document.createElement('div');
        preventiveItem.className = 'context-menu-item';
        preventiveItem.innerHTML = '<i class="fas fa-shield-alt"></i> 编辑预防措施（频度）';
        preventiveItem.onclick = handleEditPreventiveControl;
        menuContent.appendChild(preventiveItem);
        
        // 探测措施项
        const detectiveItem = document.createElement('div');
        detectiveItem.className = 'context-menu-item';
        detectiveItem.innerHTML = '<i class="fas fa-search"></i> 编辑探测措施（探测度）';
        detectiveItem.onclick = handleEditDetectiveControl;
        menuContent.appendChild(detectiveItem);
    }
    else{return;}
    
    // 计算菜单位置
    const x = event.clientX;
    const y = event.clientY;
    
    menu.style.left = `${Math.min(x, window.innerWidth - 200)}px`;
    menu.style.top = `${Math.min(y, window.innerHeight - 200)}px`;
    menu.style.display = 'block';
}

// 处理编辑预防措施
function handleEditPreventiveControl() {
    if (selectedRowId === null) {
        alert('请先选择一行！');
        return;
    }
    
    isNewPreventive = false;
    currentPreventiveIndex = selectedRowId;
    
    const modal = document.getElementById('preventive-modal');
    const form = document.getElementById('preventive-form');
    
    form.reset();
    
    // 填充当前数据
    const currentData = riskAnalysisData[selectedRowId];
    if (currentData) {
        document.getElementById('pc-description').value = currentData.pc || '';
        document.getElementById('pc-occurrence').value = currentData.o || '';
        document.getElementById('pc-status').value = currentData.pcStatus || ''; 
    } else {
        document.getElementById('pc-description').value = '';
        document.getElementById('pc-occurrence').value = '';
        document.getElementById('pc-status').value = ''; 
    }
    
    modal.style.display = 'flex';
}

// 处理编辑探测措施
function handleEditDetectiveControl() {
    if (selectedRowId === null) {
        alert('请先选择一行！');
        return;
    }
    
    isNewDetective = false;
    currentDetectiveIndex = selectedRowId;
    
    const modal = document.getElementById('detective-modal');
    const form = document.getElementById('detective-form');
    
    form.reset();
    
    // 填充当前数据
    const currentData = riskAnalysisData[selectedRowId];
    if (currentData) {
        document.getElementById('dc-description').value = currentData.dc || '';
        document.getElementById('dc-detection').value = currentData.d || '';
        document.getElementById('dc-status').value = currentData.dcStatus || '';
    } else {
        document.getElementById('dc-description').value = '';
        document.getElementById('dc-detection').value = '';
        document.getElementById('dc-status').value = '';
    }
    
    modal.style.display = 'flex';
}

// 处理编辑严重度
function handleEditSeverity() {
    if (selectedRowId === null) {
        alert('请先选择一行！');
        return;
    }
    
    const modal = document.getElementById('severity-modal');
    const form = document.getElementById('severity-form');
    
    form.reset();
    
    // 填充当前数据
    const currentData = failureDataFromPage6[selectedRowId];
    if (currentData) {
        // 填充系统失效影响（FE）
        document.getElementById('fe-description').value = getFailureEffectText(currentData.fe);
        document.getElementById('severity-level').value = currentData.s || '';
    } else {
        document.getElementById('fe-description').value = '';
        document.getElementById('severity-level').value = '';
    }
    
    modal.style.display = 'flex';
}

// 从HTML中提取纯文本的失效影响内容
function getFailureEffectText(htmlContent) {
    if (!htmlContent) return '';
    
    // 创建临时元素来解析HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    // 获取所有文本节点
    let text = '';
    const elements = tempDiv.querySelectorAll('.element-name, .failure-mode');
    
    elements.forEach(element => {
        if (element.classList.contains('element-name')) {
            text += element.textContent + '\n';
        } else if (element.classList.contains('failure-mode')) {
            text += '  ' + element.textContent + '\n';
        }
    });
    
    // 如果没有找到特定的类，直接获取文本内容
    if (!text.trim()) {
        text = tempDiv.textContent;
    }
    
    return text.trim();
}

// 计算AP值
function calculateAP(s, o, d) {
    // 确定S的分组
    let sGroup;
    if (s >= 9) sGroup = "10-9";
    else if (s >= 7) sGroup = "8-7";
    else if (s >= 4) sGroup = "6-4";
    else if (s >= 2) sGroup = "3-2";
    else sGroup = "1";
    
    // 确定D的分组
    let dGroup;
    if (d >= 8) dGroup = "10-8";
    else if (d >= 6) dGroup = "7-6";
    else if (d >= 4) dGroup = "5-4";
    else if (d >= 2) dGroup = "3-2";
    else dGroup = "1";
    
    // 确定O的分组
    let oGroup;
    if (o >= 7) oGroup = "10-7";
    else if (o >= 5) oGroup = "6-5";
    else if (o >= 2) oGroup = "4-2";
    else oGroup = "1";
    return getAP(sGroup, dGroup, oGroup);
}

function getAP(sGroup, dGroup, oGroup) {
    const APMap = {
        // O组: "10-7" 对应表格第一行
        "10-7": {
            // S组和D组的组合作为键
            "10-9|10-8": "H",
            "10-9|7-6": "H",
            "10-9|5-4": "H",
            "10-9|3-2": "H",
            "10-9|1": "H",
            
            "8-7|10-8": "H",
            "8-7|7-6": "H",
            "8-7|5-4": "H",
            "8-7|3-2": "M",
            "8-7|1": "L",
            
            "6-4|10-8": "H",
            "6-4|7-6": "H",
            "6-4|5-4": "M",
            "6-4|3-2": "L",
            "6-4|1": "L",
            
            "3-2|10-8": "M",
            "3-2|7-6": "M",
            "3-2|5-4": "L",
            "3-2|3-2": "L",
            "3-2|1": "L",
            
            "1|10-8": "L",
            "1|7-6": "L",
            "1|5-4": "L",
            "1|3-2": "L",
            "1|1": "L"
        },
        
        // O组: "6-5" 对应表格第二行
        "6-5": {
            "10-9|10-8": "H",
            "10-9|7-6": "H",
            "10-9|5-4": "H",
            "10-9|3-2": "H",
            "10-9|1": "H",
            
            "8-7|10-8": "H",
            "8-7|7-6": "H",
            "8-7|5-4": "M",
            "8-7|3-2": "M",
            "8-7|1": "L",
            
            "6-4|10-8": "H",
            "6-4|7-6": "M",
            "6-4|5-4": "M",
            "6-4|3-2": "L",
            "6-4|1": "L",
            
            "3-2|10-8": "M",
            "3-2|7-6": "M",
            "3-2|5-4": "L",
            "3-2|3-2": "L",
            "3-2|1": "L",
            
            "1|10-8": "L",
            "1|7-6": "L",
            "1|5-4": "L",
            "1|3-2": "L",
            "1|1": "L"
        },
        
        // O组: "4-2" 对应表格第三行
        "4-2": {
            "10-9|10-8": "H",
            "10-9|7-6": "H",
            "10-9|5-4": "H",
            "10-9|3-2": "H",
            "10-9|1": "L",
            
            "8-7|10-8": "H",
            "8-7|7-6": "H",
            "8-7|5-4": "M",
            "8-7|3-2": "L",
            "8-7|1": "L",
            
            "6-4|10-8": "M",
            "6-4|7-6": "M",
            "6-4|5-4": "M",
            "6-4|3-2": "L",
            "6-4|1": "L",
            
            "3-2|10-8": "M",
            "3-2|7-6": "M",
            "3-2|5-4": "L",
            "3-2|3-2": "L",
            "3-2|1": "L",
            
            "1|10-8": "L",
            "1|7-6": "L",
            "1|5-4": "L",
            "1|3-2": "L",
            "1|1": "L"
        },
        
        // O组: "1" 对应表格第四行
        "1": {
            "10-9|10-8": "H",
            "10-9|7-6": "H",
            "10-9|5-4": "M",
            "10-9|3-2": "L",
            "10-9|1": "L",
            
            "8-7|10-8": "H",
            "8-7|7-6": "M",
            "8-7|5-4": "M",
            "8-7|3-2": "L",
            "8-7|1": "L",
            
            "6-4|10-8": "M",
            "6-4|7-6": "M",
            "6-4|5-4": "L",
            "6-4|3-2": "L",
            "6-4|1": "L",
            
            "3-2|10-8": "L",
            "3-2|7-6": "L",
            "3-2|5-4": "L",
            "3-2|3-2": "L",
            "3-2|1": "L",
            
            "1|10-8": "L",
            "1|7-6": "L",
            "1|5-4": "L",
            "1|3-2": "L",
            "1|1": "L"
        }
    };
    
    // 构建组合键：S组|D组
    const sdKey = `${sGroup}|${dGroup}`;
    
    // 获取对应O组的映射表
    const oMap = APMap[oGroup];
    if (oMap && sdKey in oMap) {
        return oMap[sdKey];
    }
    
    // 如果没有找到精确匹配，使用通用逻辑
    console.warn(`未找到精确匹配: S=${sGroup}, D=${dGroup}, O=${oGroup}`);
    
    // 通用逻辑：根据你描述的规则
    if (sGroup === "10-9" && dGroup === "10-8" && oGroup === "10-7") {
        return "H";
    }
    
    // 默认返回L
    return "L";
}

// 处理预防措施表单提交
function handlePreventiveFormSubmit() {
    const description = document.getElementById('pc-description').value.trim();
    const occurrence = parseInt(document.getElementById('pc-occurrence').value);
    const status = document.getElementById('pc-status').value;
    
    if (!description) {
        alert('请输入预防措施描述！');
        return;
    }
    
    if (!occurrence) {
        alert('请选择频度等级！');
        return;
    }
    
    // 更新数据
    if (!riskAnalysisData[currentPreventiveIndex]) {
        riskAnalysisData[currentPreventiveIndex] = getDefaultRiskData();
    }
    
    riskAnalysisData[currentPreventiveIndex].pc = description;
    riskAnalysisData[currentPreventiveIndex].o = occurrence;
    riskAnalysisData[currentPreventiveIndex].pcStatus = status;
    
    // 重新计算AP值（如果S和D已填写）
    const failureData = failureDataFromPage6[currentPreventiveIndex];
    if (failureData && riskAnalysisData[currentPreventiveIndex].d) {
        const ap = calculateAP(
            failureData.s,
            riskAnalysisData[currentPreventiveIndex].o,
            riskAnalysisData[currentPreventiveIndex].d
        );
        riskAnalysisData[currentPreventiveIndex].ap = ap;
    }
    
    closePreventiveModal();
    refreshTable();
}

// 处理探测措施表单提交
function handleDetectiveFormSubmit() {
    const description = document.getElementById('dc-description').value.trim();
    const detection = parseInt(document.getElementById('dc-detection').value);
    const status = document.getElementById('dc-status').value;
    
    if (!description) {
        alert('请输入探测措施描述！');
        return;
    }
    
    if (!detection) {
        alert('请选择探测度等级！');
        return;
    }
    
    // 更新数据
    if (!riskAnalysisData[currentDetectiveIndex]) {
        riskAnalysisData[currentDetectiveIndex] = getDefaultRiskData();
    }
    
    riskAnalysisData[currentDetectiveIndex].dc = description;
    riskAnalysisData[currentDetectiveIndex].d = detection;
    riskAnalysisData[currentDetectiveIndex].dcStatus = status;
    
    // 重新计算AP值（如果S和O已填写）
    const failureData = failureDataFromPage6[currentDetectiveIndex];
    if (failureData && riskAnalysisData[currentDetectiveIndex].o) {
        const ap = calculateAP(
            failureData.s,
            riskAnalysisData[currentDetectiveIndex].o,
            riskAnalysisData[currentDetectiveIndex].d
        );
        riskAnalysisData[currentDetectiveIndex].ap = ap;
    }
    
    closeDetectiveModal();
    refreshTable();
}

// 处理严重度表单提交
function handleSeverityFormSubmit() {
    const severity = parseInt(document.getElementById('severity-level').value);
    
    if (!severity) {
        alert('请选择严重度等级！');
        return;
    }
    
    // 更新数据
    if (!failureDataFromPage6[selectedRowId]) {
        const elementName = page6StructureData[selectedRowId]?.fe || 
                           page6StructureData[selectedRowId]?.fm || 
                           page6StructureData[selectedRowId]?.fc || "";
        failureDataFromPage6[selectedRowId] = {
            fe: "",
            s: severity,
            fm: "",
            fc: "",
            elementName: elementName
        };
    } else {
        failureDataFromPage6[selectedRowId].s = severity;
    }
    
    // 重新计算AP值（如果O和D已填写）
    const riskData = riskAnalysisData[selectedRowId];
    if (riskData && riskData.o && riskData.d) {
        const ap = calculateAP(severity, riskData.o, riskData.d);
        riskData.ap = ap;
    }
    
    closeSeverityModal();
    refreshTable();
}

// 关闭模态框
function closePreventiveModal() {
    document.getElementById('preventive-modal').style.display = 'none';
}

function closeDetectiveModal() {
    document.getElementById('detective-modal').style.display = 'none';
}

function closeSeverityModal() {
    document.getElementById('severity-modal').style.display = 'none';
}

function editStandard(standardType) {
    // 关闭当前模态框
    switch(standardType) {
        case 'severity':
            closeSeverityModal();
            break;
        case 'occurrence':
            closePreventiveModal();
            break;
        case 'detection':
            closeDetectiveModal();
            break;
    }
    
    // 提示用户（实际应该跳转到编辑页面）
    alert(`即将跳转到编辑${getStandardName(standardType)}标准的页面`);
    
    // 这里可以添加页面跳转逻辑
    // window.location.href = `edit-standard.html?type=${standardType}`;
}

// 获取标准名称
function getStandardName(standardType) {
    const nameMap = {
        'severity': '严重度(S)',
        'occurrence': '频度(O)',
        'detection': '探测度(D)'
    };
    return nameMap[standardType] || '标准';
}

// 导出数据
function exportData() {
    const exportData = {
        timestamp: new Date().toISOString(),
        page6StructureData: page6StructureData,
        failureModes: failureModes,
        failureData: failureDataFromPage6,
        riskAnalysisData: riskAnalysisData
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'DFMEA-analysis-' + new Date().getTime() + '.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    // 提示导出成功
    const exportBtn = document.querySelector('.action-btn.primary');
    const originalHtml = exportBtn.innerHTML;
    exportBtn.innerHTML = '<i class="fas fa-check"></i> 已导出';
    setTimeout(() => {
        exportBtn.innerHTML = originalHtml;
    }, 2000);
}