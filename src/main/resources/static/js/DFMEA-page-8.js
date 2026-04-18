// 全局变量
let selectedRowId = null;
let currentPreventiveIndex = null;
let currentDetectiveIndex = null;
let currentCompleteIndex = null;
let severityDataFromPage7 = [];
let riskAnalysisData = [];

const sheet4Data = [
    {
        pc: "采用数控机床进行生产",
        o: 5,
        dc: "结构测试、硬度测试、耐摔测试",
        d: 4,
        ap: "M",
        responsible: "黄x",
        targetDate: "2024-02-23",
        status: "尚未执行",
        actualCompleteDate: ""
    },
    {
        pc: "采用数控机床进行生产",
        o: 4,
        dc: "结构测试、硬度测试、耐摔测试",
        d: 4,
        ap: "M",
        responsible: "黄x",
        targetDate: "2024-02-23",
        status: "尚未执行",
        actualCompleteDate: ""
    },
    {
        pc: "采用数控机床进行生产",
        o: 5,
        dc: "结构测试、硬度测试、耐摔测试",
        d: 4,
        ap: "M",
        responsible: "黄x",
        targetDate: "2024-02-23",
        status: "尚未执行",
        actualCompleteDate: ""
    },
    {
        pc: "采用数控机床进行生产",
        o: 4,
        dc: "结构测试、硬度测试、耐摔测试",
        d: 4,
        ap: "M",
        responsible: "黄x",
        targetDate: "2024-02-23",
        status: "尚未执行",
        actualCompleteDate: ""
    },
    {
        pc: "采用数控机床进行生产",
        o: 4,
        dc: "结构测试、硬度测试、耐摔测试",
        d: 4,
        ap: "M",
        responsible: "黄x",
        targetDate: "2024-02-23",
        status: "尚未执行",
        actualCompleteDate: ""
    },
    {
        pc: "采用数控机床进行生产",
        o: 3,
        dc: "结构测试、硬度测试、耐摔测试",
        d: 4,
        ap: "M",
        responsible: "黄x",
        targetDate: "2024-02-23",
        status: "尚未执行",
        actualCompleteDate: ""
    },
    {
        pc: "采用数控机床进行生产",
        o: 5,
        dc: "结构测试、硬度测试、耐摔测试",
        d: 4,
        ap: "M",
        responsible: "黄x",
        targetDate: "2024-02-23",
        status: "尚未执行",
        actualCompleteDate: ""
    },
    {
        pc: "采用数控机床进行生产",
        o: 6,
        dc: "生产线末逐个检验：光学检查外表测试",
        d: 4,
        ap: "H",
        responsible: "黄x",
        targetDate: "2024-02-23",
        status: "尚未执行",
        actualCompleteDate: ""
    }
];

// 模拟从页面7数据库读取严重度数据
function loadSeverityFromDatabase() {
    // 这里应该是从数据库或本地存储读取页面7输入的严重度数据
    // 为了演示，我们使用一个模拟数据
    return [8, 8, 8, 8, 8, 8, 8, 8]; // 8行数据，每行严重度都是8
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    // 加载严重度数据
    severityDataFromPage7 = loadSeverityFromDatabase();
    
    // 初始化风险分析数据
    riskAnalysisData = [...sheet4Data];
    
    // 更新所有AP值
    updateAllAPValues();
    
    // 刷新表格
    refreshTable();
    setupEventListeners();
    
    // 初始化标准内容
    initializeStandardContents();
});

// 初始化标准内容函数
function initializeStandardContents() {
    // 频度标准
    const occurrenceStandard = [
        {score: 10, level: "几乎必然", desc: "港口多尘环境，未有效过滤，导致润滑污染，引起持续的磨粒磨损。"},
        {score: 9, level: "极高", desc: "润滑管理不当，导致齿面胶合或轴承异常磨损频发。"},
        {score: 8, level: "高", desc: "轴端密封失效，导致港口潮湿空气、盐雾进入，加速腐蚀与磨损。"},
        {score: 7, level: "中等偏高", desc: "频繁起吊冲击载荷，超出设计余量，导致传动轴疲劳裂纹萌生或轮齿过载断裂风险增加。"},
        {score: 6, level: "中等", desc: "安装对中不良长期存在，导致传动轴弯曲变形及轴承偏载磨损。"},
        {score: 5, level: "中等偏低", desc: "轴承保持架结构性损坏，在长期运行后显现。"},
        {score: 4, level: "低", desc: "箱体铸造内部缺陷在交变应力下扩展为疲劳裂纹。"},
        {score: 3, level: "极低", desc: "材料本身存在极端罕见的原始缺陷，导致早期轮齿断裂失效。"},
        {score: 2, level: "几乎不可能", desc: "在规范操作和完好维护下，发生箱体结构开裂。"},
        {score: 1, level: "不可能", desc: "设计、制造、安装、维护全流程受控下，发生传动轴疲劳断裂。"}
    ];
    
    // 探测度标准
    const detectionStandard = [
        {score: 10, level: "几乎无法检测", desc: "箱体内部铸造缺陷在扩展为表面裂纹前。"},
        {score: 9, level: "极难检测", desc: "传动轴内部微观疲劳裂纹的萌生阶段（长度<1mm）。"},
        {score: 8, level: "较难检测", desc: "齿面胶合的初始阶段，未引起明显振动或温度变化时。"},
        {score: 7, level: "中等难度检测", desc: "轴承保持架的早期轻微变形或裂纹。"},
        {score: 6, level: "需专项检测", desc: "传动轴轻微弯曲变形，需激光对中仪检测。"},
        {score: 5, level: "常规检测可发现", desc: "轮齿断裂失效，通过日常停机目视检查或振动冲击信号可发现。"},
        {score: 4, level: "自动监测覆盖", desc: "润滑油粘度下降或污染，通过在线油液监测传感器可预警。"},
        {score: 3, level: "实时报警系统", desc: "轴承温度异常升高或整体振动值超标，通过设备状态监测系统实时报警。"},
        {score: 2, level: "多重冗余检测", desc: "箱体连接螺栓松动，可通过定期扭矩检查与振动分析交叉验证。"},
        {score: 1, level: "失效自锁机制", desc: "设计上，当发生极端过载时，安全离合器打滑，防止轮齿或轴断裂。"}
    ];
    
    // 生成标准HTML
    generateStandardHTML('preventive-standard-content', occurrenceStandard, '更新频度(O)');
    generateStandardHTML('detective-standard-content', detectionStandard, '更新探测度(D)');
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
        </div>`;
    });
    
    container.innerHTML = html;
}

// 在 setupEventListeners 函数中添加这个监听器
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
    
    // 完成措施表单提交
    document.getElementById('complete-form').addEventListener('submit', function(e) {
        e.preventDefault();
        handleCompleteFormSubmit();
    });
    
    // 监听措施状态变化，显示/隐藏完成日期字段
    document.getElementById('complete-status').addEventListener('change', function() {
        const isCompleted = this.value === '已完成';
        const dateContainer = document.getElementById('complete-date-container');
        const dateInput = document.getElementById('actual-complete-date');
        
        if (dateContainer) {
            dateContainer.style.display = isCompleted ? 'block' : 'none';
            if (dateInput) {
                dateInput.required = isCompleted;
            }
        }
    });
}

// 刷新表格
function refreshTable() {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';
    
    riskAnalysisData.forEach((item, index) => {
        const row = document.createElement('tr');
        row.dataset.id = index;

        // 获取AP等级对应的CSS类
        const apClass = `ap-${item.ap}`;
        
        // 格式化日期
        const targetDateFormatted = item.targetDate ? formatDate(item.targetDate) : '';
        const actualDateFormatted = item.actualCompleteDate ? formatDate(item.actualCompleteDate) : '';
        // 构建表格行HTML
        row.innerHTML = `
            <td>${item.pc || '暂无预防措施'}</td>
            <td class="rating-cell">${item.o || ''}</td>
            <td>${item.dc || '暂无探测措施'}</td>
            <td class="rating-cell">${item.d || ''}</td>
            <td class="ap-cell ${apClass}">${item.ap || ''}</td>
            <td class="rating-cell">${severityDataFromPage7[index] || ''}</td>
            <td class="responsible-cell">${item.responsible || ''}</td>
            <td class="date-cell">${targetDateFormatted}</td>
            <td class="date-cell">
                <span class="status-indicator status-${getStatusClass(item.status)}">${item.status || ''}</span>
            </td>
            <td class="date-cell">
                ${actualDateFormatted}
            </td>
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

// 格式化日期（yyyy-mm-dd -> yyyy.mm.dd）
function formatDate(dateString) {
    if (!dateString) return '';
    return dateString.replace(/-/g, '.');
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

// 显示右键菜单
function showContextMenu(event) {
    const menu = document.getElementById('context-menu');
    if (!menu) return;
    
    // 获取点击的行
    const row = event.target.closest('tr');
    if (!row) return;
    
    // 清除之前选中的行
    document.querySelectorAll('#table-body tr.selected').forEach(el => {
        el.classList.remove('selected');
    });
    
    // 设置当前行为选中状态
    row.classList.add('selected');
    
    // 获取行的索引（从数据集获取）
    selectedRowId = parseInt(row.dataset.id);
    
    // 隐藏菜单（先隐藏再显示以避免闪烁）
    menu.style.display = 'none';
    
    // 根据列索引设置菜单内容
    const menuContent = document.getElementById('context-menu-content');
    menuContent.innerHTML = '';

    // 编辑预防措施
    const preventiveItem = document.createElement('div');
    preventiveItem.className = 'context-menu-item';
    preventiveItem.innerHTML = '<i class="fas fa-shield-alt"></i> 编辑预防措施（频度）';
    preventiveItem.onclick = handleEditPreventiveControl;
    menuContent.appendChild(preventiveItem);
    
    // 编辑探测措施
    const detectiveItem = document.createElement('div');
    detectiveItem.className = 'context-menu-item';
    detectiveItem.innerHTML = '<i class="fas fa-search"></i> 编辑探测措施（探测度）';
    detectiveItem.onclick = handleEditDetectiveControl;
    menuContent.appendChild(detectiveItem);
    
    // 完成措施
    const completeItem = document.createElement('div');
    completeItem.className = 'context-menu-item';
    completeItem.innerHTML = '<i class="fas fa-check-circle"></i> 措施状态';
    completeItem.onclick = handleCompleteMeasures;
    menuContent.appendChild(completeItem);
    
    // 如果菜单有内容，显示菜单
    if (menuContent.children.length > 0) {
        // 计算菜单位置
        const x = event.clientX;
        const y = event.clientY;
        
        menu.style.left = `${Math.min(x, window.innerWidth - 200)}px`;
        menu.style.top = `${Math.min(y, window.innerHeight - 200)}px`;
        menu.style.display = 'block';
    }
}

// 处理编辑预防措施
function handleEditPreventiveControl() {
    if (selectedRowId === null) {
        alert('请先选择一行！');
        return;
    }
    
    currentPreventiveIndex = selectedRowId;
    
    const modal = document.getElementById('preventive-modal');
    const form = document.getElementById('preventive-form');
    
    form.reset();
    
    // 填充当前数据
    const currentData = riskAnalysisData[selectedRowId];
    if (currentData) {
        document.getElementById('pc-description').value = currentData.pc || '';
        document.getElementById('pc-occurrence').value = currentData.o || '';
        document.getElementById('pc-responsible').value = currentData.responsible || '';
        document.getElementById('pc-target-date').value = currentData.targetDate || '';
    }
    
    modal.style.display = 'flex';
}

// 处理编辑探测措施
function handleEditDetectiveControl() {
    if (selectedRowId === null) {
        alert('请先选择一行！');
        return;
    }
    
    currentDetectiveIndex = selectedRowId;
    
    const modal = document.getElementById('detective-modal');
    const form = document.getElementById('detective-form');
    
    form.reset();
    
    // 填充当前数据
    const currentData = riskAnalysisData[selectedRowId];
    if (currentData) {
        document.getElementById('dc-description').value = currentData.dc || '';
        document.getElementById('dc-detection').value = currentData.d || '';
        document.getElementById('dc-responsible').value = currentData.responsible || '';
        document.getElementById('dc-target-date').value = currentData.targetDate || '';
    }
    
    modal.style.display = 'flex';
}

// 处理完成措施
function handleCompleteMeasures() {
    if (selectedRowId === null) {
        alert('请先选择一行！');
        return;
    }
    
    currentCompleteIndex = selectedRowId;
    
    const modal = document.getElementById('complete-modal');
    const form = document.getElementById('complete-form');
    
    form.reset();
    
    // 填充当前数据
    const currentData = riskAnalysisData[selectedRowId];
    if (currentData) {
        document.getElementById('complete-status').value = currentData.status || '';
        if (currentData.actualCompleteDate) {
            // 只设置日期，不要时间
            document.getElementById('actual-complete-date').value = currentData.actualCompleteDate.split('T')[0];
        }
    }
    
    // 触发change事件以正确显示/隐藏日期字段
    const statusSelect = document.getElementById('complete-status');
    if (statusSelect) {
        const event = new Event('change');
        statusSelect.dispatchEvent(event);
    }
    
    modal.style.display = 'flex';
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
        "10-7": {
            "10-9|10-8": "H", "10-9|7-6": "H", "10-9|5-4": "H", "10-9|3-2": "H", "10-9|1": "H",
            "8-7|10-8": "H", "8-7|7-6": "H", "8-7|5-4": "H", "8-7|3-2": "M", "8-7|1": "L",
            "6-4|10-8": "H", "6-4|7-6": "H", "6-4|5-4": "M", "6-4|3-2": "L", "6-4|1": "L",
            "3-2|10-8": "M", "3-2|7-6": "M", "3-2|5-4": "L", "3-2|3-2": "L", "3-2|1": "L",
            "1|10-8": "L", "1|7-6": "L", "1|5-4": "L", "1|3-2": "L", "1|1": "L"
        },
        "6-5": {
            "10-9|10-8": "H", "10-9|7-6": "H", "10-9|5-4": "H", "10-9|3-2": "H", "10-9|1": "H",
            "8-7|10-8": "H", "8-7|7-6": "H", "8-7|5-4": "M", "8-7|3-2": "M", "8-7|1": "L",
            "6-4|10-8": "H", "6-4|7-6": "M", "6-4|5-4": "M", "6-4|3-2": "L", "6-4|1": "L",
            "3-2|10-8": "M", "3-2|7-6": "M", "3-2|5-4": "L", "3-2|3-2": "L", "3-2|1": "L",
            "1|10-8": "L", "1|7-6": "L", "1|5-4": "L", "1|3-2": "L", "1|1": "L"
        },
        "4-2": {
            "10-9|10-8": "H", "10-9|7-6": "H", "10-9|5-4": "H", "10-9|3-2": "H", "10-9|1": "L",
            "8-7|10-8": "H", "8-7|7-6": "H", "8-7|5-4": "M", "8-7|3-2": "L", "8-7|1": "L",
            "6-4|10-8": "M", "6-4|7-6": "M", "6-4|5-4": "M", "6-4|3-2": "L", "6-4|1": "L",
            "3-2|10-8": "M", "3-2|7-6": "M", "3-2|5-4": "L", "3-2|3-2": "L", "3-2|1": "L",
            "1|10-8": "L", "1|7-6": "L", "1|5-4": "L", "1|3-2": "L", "1|1": "L"
        },
        "1": {
            "10-9|10-8": "H", "10-9|7-6": "H", "10-9|5-4": "M", "10-9|3-2": "L", "10-9|1": "L",
            "8-7|10-8": "H", "8-7|7-6": "M", "8-7|5-4": "M", "8-7|3-2": "L", "8-7|1": "L",
            "6-4|10-8": "M", "6-4|7-6": "M", "6-4|5-4": "L", "6-4|3-2": "L", "6-4|1": "L",
            "3-2|10-8": "L", "3-2|7-6": "L", "3-2|5-4": "L", "3-2|3-2": "L", "3-2|1": "L",
            "1|10-8": "L", "1|7-6": "L", "1|5-4": "L", "1|3-2": "L", "1|1": "L"
        }
    };
    
    const sdKey = `${sGroup}|${dGroup}`;
    const oMap = APMap[oGroup];
    if (oMap && sdKey in oMap) {
        return oMap[sdKey];
    }
    
    return "L";
}

// 更新所有AP值
function updateAllAPValues() {
    riskAnalysisData.forEach((item, index) => {
        const s = severityDataFromPage7[index] || 0;
        const o = item.o || 0;
        const d = item.d || 0;
        
        if (s > 0 && o > 0 && d > 0) {
            item.ap = calculateAP(s, o, d);
        }
    });
}

// 处理预防措施表单提交
function handlePreventiveFormSubmit() {
    const description = document.getElementById('pc-description').value.trim();
    const occurrence = parseInt(document.getElementById('pc-occurrence').value);
    const responsible = document.getElementById('pc-responsible').value.trim();
    const targetDate = document.getElementById('pc-target-date').value;
    
    if (!description) {
        alert('请输入预防措施描述！');
        return;
    }
    
    if (!occurrence) {
        alert('请选择频度等级！');
        return;
    }
    
    if (!responsible) {
        alert('请输入负责人！');
        return;
    }
    
    if (!targetDate) {
        alert('请选择目标日期！');
        return;
    }
    
    // 更新数据
    if (!riskAnalysisData[currentPreventiveIndex]) {
        riskAnalysisData[currentPreventiveIndex] = getDefaultData();
    }
    
    riskAnalysisData[currentPreventiveIndex].pc = description;
    riskAnalysisData[currentPreventiveIndex].o = occurrence;
    riskAnalysisData[currentPreventiveIndex].responsible = responsible;
    riskAnalysisData[currentPreventiveIndex].targetDate = targetDate;
    
    // 重新计算AP值
    const s = severityDataFromPage7[currentPreventiveIndex] || 0;
    const d = riskAnalysisData[currentPreventiveIndex].d || 0;
    if (s > 0 && occurrence > 0 && d > 0) {
        riskAnalysisData[currentPreventiveIndex].ap = calculateAP(s, occurrence, d);
    }
    
    closePreventiveModal();
    refreshTable();
}

// 处理探测措施表单提交
function handleDetectiveFormSubmit() {
    const description = document.getElementById('dc-description').value.trim();
    const detection = parseInt(document.getElementById('dc-detection').value);
    const responsible = document.getElementById('dc-responsible').value.trim();
    const targetDate = document.getElementById('dc-target-date').value;
    
    if (!description) {
        alert('请输入探测措施描述！');
        return;
    }
    
    if (!detection) {
        alert('请选择探测度等级！');
        return;
    }
    
    if (!responsible) {
        alert('请输入负责人！');
        return;
    }
    
    if (!targetDate) {
        alert('请选择目标日期！');
        return;
    }
    
    // 更新数据
    if (!riskAnalysisData[currentDetectiveIndex]) {
        riskAnalysisData[currentDetectiveIndex] = getDefaultData();
    }
    
    riskAnalysisData[currentDetectiveIndex].dc = description;
    riskAnalysisData[currentDetectiveIndex].d = detection;
    riskAnalysisData[currentDetectiveIndex].responsible = responsible;
    riskAnalysisData[currentDetectiveIndex].targetDate = targetDate;
    
    // 重新计算AP值
    const s = severityDataFromPage7[currentDetectiveIndex] || 0;
    const o = riskAnalysisData[currentDetectiveIndex].o || 0;
    if (s > 0 && o > 0 && detection > 0) {
        riskAnalysisData[currentDetectiveIndex].ap = calculateAP(s, o, detection);
    }
    
    closeDetectiveModal();
    refreshTable();
}

// 处理完成措施表单提交
function handleCompleteFormSubmit() {
    const status = document.getElementById('complete-status').value;
    const actualCompleteDate = document.getElementById('actual-complete-date').value;
    
    if (!status) {
        alert('请选择措施状态！');
        return;
    }
    
    // 如果状态是"已完成"，则必须填写完成日期
    if (status === '已完成') {
        if (!actualCompleteDate) {
            alert('措施状态为"已完成"时，必须填写完成日期！');
            return;
        }
    }
    
    // 更新数据
    riskAnalysisData[currentCompleteIndex].status = status;
    
    // 只有当有日期时才更新，避免将空字符串存入
    if (actualCompleteDate) {
        riskAnalysisData[currentCompleteIndex].actualCompleteDate = actualCompleteDate;
    } else {
        // 如果状态不是"已完成"，清除日期
        riskAnalysisData[currentCompleteIndex].actualCompleteDate = "";
    }
    
    closeCompleteModal();
    refreshTable();
}

// 获取默认数据
function getDefaultData() {
    return {
        pc: "",
        o: null,
        dc: "",
        d: null,
        ap: "",
        responsible: "",
        targetDate: "",
        status: "",
        actualCompleteDate: ""
    };
}

// 关闭模态框
function closePreventiveModal() {
    document.getElementById('preventive-modal').style.display = 'none';
}

function closeDetectiveModal() {
    document.getElementById('detective-modal').style.display = 'none';
}

function closeCompleteModal() {
    document.getElementById('complete-modal').style.display = 'none';
}

function editStandard(standardType) {
    alert(`即将跳转到编辑${getStandardName(standardType)}标准的页面`);
}

// 获取标准名称
function getStandardName(standardType) {
    const nameMap = {
        'occurrence': '频度(O)',
        'detection': '探测度(D)'
    };
    return nameMap[standardType] || '标准';
}

// 导出数据
function exportData() {
    const exportData = {
        timestamp: new Date().toISOString(),
        severityData: severityDataFromPage7,
        riskAnalysisData: riskAnalysisData
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'DFMEA-page8-analysis-' + new Date().getTime() + '.json';
    
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