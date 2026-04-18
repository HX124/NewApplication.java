// 全局变量
let summaryData = [];
let dvpData = [];
let characteristicListData = [];
let currentView = 'dfmea'; // 默认显示
let dvpHeaderData = {}; // 新增：存储DVP表头数据

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function () {
    // 从页面4-8的数据中汇总信息
    initializeSummaryData();

    // 初始化DVP数据
    initializeDVPData();

    // 初始化特性清单数据
    initializeCharacteristicData();

    // 填充表格
    populateSummaryTable();
    populateDVPTable();
    populateCharacteristicTable();

    // 设置事件监听器
    setupEventListeners();
    
    // 初始化DVP表头数据
    initDVPHeaderData();
});

// 初始化DVP表头数据
function initDVPHeaderData() {
    dvpHeaderData = {
        '公司名称': '示例公司',
        '项目': '手机保护壳DVP&R',
        '设计地点': 'xx研发中心',
        '开始日期': '2024-01-15',
        '顾客名称': '手机制造商',
        '修订日期': '2024-02-28',
        '车型年/平台': '',
        '职能小组': '测试验证部',
        '系统/子系统/组件/部件': '手机保护壳系统',
        'DVP编号': 'DVP-2024-001',
        '责任人': '测试工程师',
        '保密级别': '内部使用'
    };
}

// 初始化汇总数据
function initializeSummaryData() {
    summaryData = [
        {
            id: 1,
            // 结构分析
            system: "壳体",
            subsystem: "控制部分",
            component: "充电口",

            // 功能分析
            higherLevelFunction: "保护和固定手机机身，修饰与美观",
            focusFunction: "保护手机按键和外部零件接入口",
            lowerLevelCharacteristic: "厚度为2~3mm，与充电接口距离为1~3mm",

            // 失效分析
            failureEffect: "无法固定手机机身，不美观",
            severity: 8,
            failureMode: "不能保护手机按键和外部零件接入口",
            failureCause: "厚度<2mm或>3mm，与充电接口距离<1mm或>3mm",

            // 风险分析
            preventiveControl: "采用数控机床进行生产",
            occurrence: 5,
            detectiveControl: "随机抽检：人工目检",
            detection: 8,
            ap: "H",
            specialCharacteristic: "重要特性",

            // 优化措施
            recommendedPreventive: "采用数控机床进行生产",
            recommendedDetective: "结构测试、硬度测试、耐摔测试",
            responsible: "黄x",
            targetDate: "2024.02.23",
            status: "尚未完成",
            actualDate: "",

            // 结果
            finalSeverity: 8,
            finalOccurrence: 5,
            finalDetection: 4,
            finalAP: "M"
        },
        {
            id: 2,
            // 结构分析
            system: "壳体",
            subsystem: "控制部分",
            component: "音源键",

            // 功能分析
            higherLevelFunction: "保护和固定手机机身，修饰与美观",
            focusFunction: "保护手机按键和外部零件接入口",
            lowerLevelCharacteristic: "与手机音量键尺寸一致",

            // 失效分析
            failureEffect: "无法固定手机机身，不美观",
            severity: 8,
            failureMode: "不能保护手机按键和外部零件接入口",
            failureCause: "小于或大于手机音量键尺寸",

            // 风险分析
            preventiveControl: "采用数控机床进行生产",
            occurrence: 4,
            detectiveControl: "随机抽检：人工目检",
            detection: 8,
            ap: "H",
            specialCharacteristic: "重要特性",

            // 优化措施
            recommendedPreventive: "采用数控机床进行生产",
            recommendedDetective: "结构测试、硬度测试、耐摔测试",
            responsible: "黄x",
            targetDate: "2024.02.23",
            status: "尚未完成",
            actualDate: "",

            // 结果
            finalSeverity: 8,
            finalOccurrence: 4,
            finalDetection: 4,
            finalAP: "M"
        },
        {
            id: 3,
            // 结构分析
            system: "壳体",
            subsystem: "控制部分",
            component: "耳机口",

            // 功能分析
            higherLevelFunction: "保护和固定手机机身，修饰与美观",
            focusFunction: "保护手机按键和外部零件接入口",
            lowerLevelCharacteristic: "与手机耳机插孔距离1~2mm",

            // 失效分析
            failureEffect: "无法固定手机机身，不美观",
            severity: 8,
            failureMode: "不能保护手机按键和外部零件接入口",
            failureCause: "与耳机插孔距离<1mm或>2mm",

            // 风险分析
            preventiveControl: "采用数控机床进行生产",
            occurrence: 5,
            detectiveControl: "随机抽检：人工目检",
            detection: 8,
            ap: "H",
            specialCharacteristic: "重要特性",

            // 优化措施
            recommendedPreventive: "采用数控机床进行生产",
            recommendedDetective: "结构测试、硬度测试、耐摔测试",
            responsible: "黄x",
            targetDate: "2024.02.23",
            status: "尚未完成",
            actualDate: "",

            // 结果
            finalSeverity: 8,
            finalOccurrence: 5,
            finalDetection: 4,
            finalAP: "M"
        },
        {
            id: 4,
            // 结构分析
            system: "壳体",
            subsystem: "控制部分",
            component: "电源键口",

            // 功能分析
            higherLevelFunction: "保护和固定手机机身，修饰与美观",
            focusFunction: "保护手机按键和外部零件接入口",
            lowerLevelCharacteristic: "尺寸匹配手机电源键，坡度≤15°",

            // 失效分析
            failureEffect: "无法固定手机机身，不美观",
            severity: 8,
            failureMode: "不能保护手机按键和外部零件接入口",
            failureCause: "尺寸小于手机电源键，坡度>15°",

            // 风险分析
            preventiveControl: "采用数控机床进行生产",
            occurrence: 4,
            detectiveControl: "随机抽检：人工目检",
            detection: 8,
            ap: "M",
            specialCharacteristic: "关键特性",

            // 优化措施
            recommendedPreventive: "采用数控机床进行生产",
            recommendedDetective: "结构测试、硬度测试、耐摔测试",
            responsible: "黄x",
            targetDate: "2024.02.23",
            status: "尚未完成",
            actualDate: "",

            // 结果
            finalSeverity: 8,
            finalOccurrence: 4,
            finalDetection: 4,
            finalAP: "M"
        },
        {
            id: 5,
            // 结构分析
            system: "壳体",
            subsystem: "装饰部分",
            component: "镜头",

            // 功能分析
            higherLevelFunction: "保护和固定手机机身，修饰与美观",
            focusFunction: "保护手机按键和外部零件接入口",
            lowerLevelCharacteristic: "尺寸与手机镜头匹配",

            // 失效分析
            failureEffect: "无法固定手机机身，无法保护手机硬件，不美观",
            severity: 8,
            failureMode: "无法固定手机机身，无法保护手机硬件，不美观",
            failureCause: "尺寸与镜头不一致，遮挡镜头",

            // 风险分析
            preventiveControl: "采用数控机床进行生产",
            occurrence: 5,
            detectiveControl: "随机抽检：人工目检",
            detection: 8,
            ap: "M",
            specialCharacteristic: "安全特性",

            // 优化措施
            recommendedPreventive: "采用数控机床进行生产",
            recommendedDetective: "结构测试、硬度测试、耐摔测试",
            responsible: "黄x",
            targetDate: "2024.02.23",
            status: "尚未完成",
            actualDate: "",

            // 结果
            finalSeverity: 8,
            finalOccurrence: 5,
            finalDetection: 4,
            finalAP: "M"
        },
        {
            id: 6,
            // 结构分析
            system: "壳体",
            subsystem: "装饰部分",
            component: "扬声器口",

            // 功能分析
            higherLevelFunction: "保护和固定手机机身，修饰与美观",
            focusFunction: "保护手机按键和外部零件接入口",
            lowerLevelCharacteristic: "与手机扬声器口距离≤1mm",

            // 失效分析
            failureEffect: "无法固定手机机身，无法保护手机硬件，不美观",
            severity: 8,
            failureMode: "无法固定手机机身，无法保护手机硬件，不美观",
            failureCause: "与扬声器口距离>1mm或堵塞扬声器口",

            // 风险分析
            preventiveControl: "采用数控机床进行生产",
            occurrence: 3,
            detectiveControl: "随机抽检：人工目检",
            detection: 8,
            ap: "H",
            specialCharacteristic: "外观特性",

            // 优化措施
            recommendedPreventive: "采用数控机床进行生产",
            recommendedDetective: "结构测试、硬度测试、耐摔测试",
            responsible: "黄x",
            targetDate: "2024.02.23",
            status: "尚未完成",
            actualDate: "",

            // 结果
            finalSeverity: 8,
            finalOccurrence: 3,
            finalDetection: 4,
            finalAP: "M"
        },
        {
            id: 7,
            // 结构分析
            system: "壳体",
            subsystem: "装饰部分",
            component: "挂绳",

            // 功能分析
            higherLevelFunction: "保护和固定手机机身，修饰与美观",
            focusFunction: "保护手机按键和外部零件接入口",
            lowerLevelCharacteristic: "绳孔尺寸3mm，承重≥2kg",

            // 失效分析
            failureEffect: "无法固定手机机身，无法保护手机硬件，不美观",
            severity: 8,
            failureMode: "无法固定手机机身，无法保护手机硬件，不美观",
            failureCause: "开裂，无法固定手机绳",

            // 风险分析
            preventiveControl: "采用数控机床进行生产",
            occurrence: 5,
            detectiveControl: "随机抽检：人工目检",
            detection: 8,
            ap: "H",
            specialCharacteristic: "",

            // 优化措施
            recommendedPreventive: "采用数控机床进行生产",
            recommendedDetective: "结构测试、硬度测试、耐摔测试",
            responsible: "黄x",
            targetDate: "2024.02.23",
            status: "尚未完成",
            actualDate: "",

            // 结果
            finalSeverity: 8,
            finalOccurrence: 5,
            finalDetection: 4,
            finalAP: "M"
        },
        {
            id: 8,
            // 结构分析
            system: "壳体",
            subsystem: "装饰部分",
            component: "印花",

            // 功能分析
            higherLevelFunction: "保护和固定手机机身，修饰与美观",
            focusFunction: "保护手机按键和外部零件接入口",
            lowerLevelCharacteristic: "涂料厚度0.1mm，图案清晰完整",

            // 失效分析
            failureEffect: "无法固定手机机身，无法保护手机硬件，不美观",
            severity: 8,
            failureMode: "无法固定手机机身，无法保护手机硬件，不美观",
            failureCause: "涂料不均匀，图案不清晰不完整，有色差",

            // 风险分析
            preventiveControl: "采用数控机床进行生产",
            occurrence: 6,
            detectiveControl: "随机抽检：人工目检",
            detection: 8,
            ap: "H",
            specialCharacteristic: "",

            // 优化措施
            recommendedPreventive: "采用数控机床进行生产",
            recommendedDetective: "生产线末逐个检验：光学检查外表测试",
            responsible: "黄x",
            targetDate: "2024.02.23",
            status: "尚未完成",
            actualDate: "",

            // 结果
            finalSeverity: 8,
            finalOccurrence: 6,
            finalDetection: 4,
            finalAP: "H"
        }
    ];
}

// 初始化DVP数据
function initializeDVPData() {
    dvpData = [
        {
            id: 1,
            testItem: "结构强度测试",
            testName: "壳体结构强度验证",
            testMethod: "GB/T 2423.5-2019",
            targetRequirement: "承受10次1米跌落无损坏",
            testType: "破坏性测试",
            sampleQuantity: "5pcs",
            planStartDate: "2024.02.01",
            testStatus: "已完成",
            testReport: "STR-2024-001",
            actualFinishDate: "2024.02.15" // 新增字段，在实验报告之后
        },
        {
            id: 2,
            testItem: "尺寸精度测试",
            testName: "开口尺寸精度验证",
            testMethod: "三坐标测量",
            targetRequirement: "尺寸公差±0.1mm",
            testType: "非破坏性测试",
            sampleQuantity: "10pcs",
            planStartDate: "2024.02.10",
            testStatus: "进行中",
            testReport: "DIM-2024-001",
            actualFinishDate: "" // 还未完成
        },
        {
            id: 3,
            testItem: "表面处理测试",
            testName: "涂层附着力验证",
            testMethod: "GB/T 9286-2021",
            targetRequirement: "百格测试0-1级",
            testType: "破坏性测试",
            sampleQuantity: "3pcs",
            planStartDate: "2024.02.15",
            testStatus: "尚未开始",
            testReport: "",
            actualFinishDate: "" // 还未开始
        },
        {
            id: 4,
            testItem: "环境适应性测试",
            testName: "高温高湿测试",
            testMethod: "GB/T 2423.3-2016",
            targetRequirement: "85°C/85%RH 240h无异常",
            testType: "老化测试",
            sampleQuantity: "3pcs",
            planStartDate: "2024.02.20",
            testStatus: "尚未开始",
            testReport: "",
            actualFinishDate: "" // 还未开始
        },
        {
            id: 5,
            testItem: "功能性测试",
            testName: "按键功能验证",
            testMethod: "按键寿命测试机",
            targetRequirement: "10000次按压无故障",
            testType: "寿命测试",
            sampleQuantity: "3pcs",
            planStartDate: "2024.02.25",
            testStatus: "计划中",
            testReport: "",
            actualFinishDate: "" // 计划中
        },
        {
            id: 6,
            testItem: "材料性能测试",
            testName: "材料硬度测试",
            testMethod: "邵氏硬度计",
            targetRequirement: "邵氏硬度80-85A",
            testType: "材料测试",
            sampleQuantity: "5pcs",
            planStartDate: "2024.03.01",
            testStatus: "计划中",
            testReport: "",
            actualFinishDate: "" // 计划中
        },
        {
            id: 7,
            testItem: "装配测试",
            testName: "手机装配兼容性",
            testMethod: "实际装配测试",
            targetRequirement: "装配顺畅无干涉",
            testType: "兼容性测试",
            sampleQuantity: "10pcs",
            planStartDate: "2024.03.05",
            testStatus: "尚未开始",
            testReport: "",
            actualFinishDate: "" // 还未开始
        }
    ];
}

// 初始化特性清单数据
function initializeCharacteristicData() {
    characteristicListData = [
        {
            id: 1,
            component: "充电口",
            charNum: "C001",
            description: "接口尺寸Φ3.5mm",
            classification: "关键特性",
            subsystem: "控制部分",
            system: "壳体",
            remarks: ""
        },
        {
            id: 2,
            component: "充电口",
            charNum: "C002",
            description: "充电功率18W",
            classification: "重要特性",
            subsystem: "控制部分",
            system: "壳体",
            remarks: ""
        },
        {
            id: 3,
            component: "音源键",
            charNum: "C003",
            description: "按键行程1.5mm",
            classification: "一般特性",
            subsystem: "控制部分",
            system: "壳体",
            remarks: ""
        },
        {
            id: 4,
            component: "耳机口",
            charNum: "C004",
            description: "插拔力5-20N",
            classification: "重要特性",
            subsystem: "控制部分",
            system: "壳体",
            remarks: "符合人体工学"
        },
        {
            id: 5,
            component: "电源键口",
            charNum: "C005",
            description: "按键寿命10万次",
            classification: "关键特性",
            subsystem: "控制部分",
            system: "壳体",
            remarks: ""
        },
        {
            id: 6,
            component: "镜头",
            charNum: "C006",
            description: "焦距f=35mm",
            classification: "重要特性",
            subsystem: "装饰部分",
            system: "壳体",
            remarks: "高清拍摄"
        },
        {
            id: 7,
            component: "扬声器口",
            charNum: "C007",
            description: "频率响应20-20kHz",
            classification: "一般特性",
            subsystem: "装饰部分",
            system: "壳体",
            remarks: ""
        },
        {
            id: 8,
            component: "挂绳",
            charNum: "C008",
            description: "绳径3mm",
            classification: "一般特性",
            subsystem: "装饰部分",
            system: "壳体",
            remarks: "承重≥2kg"
        },
        {
            id: 9,
            component: "印花",
            charNum: "C009",
            description: "厚度0.1mm",
            classification: "一般特性",
            subsystem: "装饰部分",
            system: "壳体",
            remarks: "防水防刮"
        }
    ];
}

// ==================== 表格填充函数 ====================
// 填充汇总表格
function populateSummaryTable() {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';

    summaryData.forEach((item, index) => {
        const row = document.createElement('tr');

        // 获取AP等级对应的CSS类
        const apClass = `ap-${item.ap}`;
        const finalApClass = `ap-${item.finalAP}`;

        // 格式化日期
        const targetDateFormatted = item.targetDate ? formatDate(item.targetDate) : '';
        const actualDateFormatted = item.actualDate ? formatDate(item.actualDate) : '';

        // 构建状态指示器
        let statusIndicator = '';
        if (item.status) {
            const statusClass = getStatusClass(item.status);
            statusIndicator = `<span class="status-indicator status-${statusClass}">${item.status}</span>`;
        }

        // 构建表格行HTML
        row.innerHTML = `
            <!-- 序号列 -->
            <td>${item.id}</td>
            
            <!-- 结构分析列 -->
            <td>${item.system || ''}</td>
            <td>${item.subsystem || ''}</td>
            <td>${item.component || ''}</td>
            
            <!-- 功能分析列 -->
            <td>${item.higherLevelFunction || ''}</td>
            <td>${item.focusFunction || ''}</td>
            <td>${item.lowerLevelCharacteristic || ''}</td>
            
            <!-- 失效分析列 -->
            <td>${item.failureEffect || ''}</td>
            <td class="rating-cell">${item.severity || ''}</td>
            <td>${item.failureMode || ''}</td>
            <td>${item.failureCause || ''}</td>
            
            <!-- 风险分析列 -->
            <td>${item.preventiveControl || ''}</td>
            <td class="rating-cell">${item.occurrence || ''}</td>
            <td>${item.detectiveControl || ''}</td>
            <td class="rating-cell">${item.detection || ''}</td>
            <td class="ap-cell ${apClass}">${item.ap || ''}</td>
            <td>${item.specialCharacteristic || ''}</td>
            
            <!-- 优化列 -->
            <td>${item.recommendedPreventive || ''}</td>
            <td>${item.recommendedDetective || ''}</td>
            <td class="responsible-cell">${item.responsible || ''}</td>
            <td class="date-cell">${targetDateFormatted}</td>
            <td class="date-cell">${statusIndicator}</td>
            <td class="date-cell">${actualDateFormatted}</td>
            <td class="rating-cell">${item.finalSeverity || ''}</td>
            <td class="rating-cell">${item.finalOccurrence || ''}</td>
            <td class="rating-cell">${item.finalDetection || ''}</td>
            <td class="ap-cell ${finalApClass}">${item.finalAP || ''}</td>
            <td>${item.remarks || ''}</td>
        `;

        tableBody.appendChild(row);
    });
}

// 填充DVP表格
function populateDVPTable() {
    const tableBody = document.getElementById('dvp-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    dvpData.forEach((item, index) => {
        const row = document.createElement('tr');

        // 构建状态指示器
        let statusIndicator = '';
        if (item.testStatus) {
            const statusClass = getDVPStatusClass(item.testStatus);
            statusIndicator = `<span class="status-indicator status-${statusClass}">${item.testStatus}</span>`;
        }

        // 格式化日期
        const planStartDateFormatted = item.planStartDate ? formatDate(item.planStartDate) : '';
        const actualFinishDateFormatted = item.actualFinishDate ? formatDate(item.actualFinishDate) : '';

        // 构建表格行HTML - 注意列的顺序：实际完成日期在实验报告之后
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.testItem || ''}</td>
            <td>${item.testName || ''}</td>
            <td>${item.testMethod || ''}</td>
            <td>${item.targetRequirement || ''}</td>
            <td>${item.testType || ''}</td>
            <td style="text-align: center;">${item.sampleQuantity || ''}</td>
            <td style="text-align: center;">${planStartDateFormatted}</td>
            <td style="text-align: center;">${statusIndicator}</td>
            <td style="text-align: center;">${item.testReport || ''}</td>
            <td style="text-align: center;">${actualFinishDateFormatted}</td>
        `;

        tableBody.appendChild(row);
    });
}

// 填充特性清单表格
function populateCharacteristicTable() {
    const tableBody = document.getElementById('characteristic-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    characteristicListData.forEach((item, index) => {
        const row = document.createElement('tr');

        // 构建表格行HTML
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.component || ''}</td>
            <td style="text-align: center; font-weight: bold;">${item.charNum || ''}</td>
            <td>${item.description || ''}</td>
            <td style="text-align: center;">${item.classification || ''}</td>
            <td>${item.subsystem || ''}</td>
            <td>${item.system || ''}</td>
            <td>${item.remarks || ''}</td>
        `;

        tableBody.appendChild(row);
    });
}

// ==================== 视图切换函数 ====================
// 切换视图
function switchView(view) {
    currentView = view;

    // 更新标签按钮状态
    const dfmeaTab = document.getElementById('dfmea-tab');
    const dvpTab = document.getElementById('dvp-tab');
    const characteristicTab = document.getElementById('characteristic-tab');

    // 重置所有标签状态
    dfmeaTab.classList.remove('active');
    dvpTab.classList.remove('active');
    characteristicTab.classList.remove('active');

    // 隐藏所有内容
    document.getElementById('dfmea-header').style.display = 'none';
    document.getElementById('dfmea-table-container').style.display = 'none';
    document.getElementById('dfmea-footer').style.display = 'none';

    document.getElementById('dvp-header').style.display = 'none';
    document.getElementById('dvp-table-container').style.display = 'none';
    document.getElementById('dvp-footer').style.display = 'none';

    document.getElementById('characteristic-table-container').style.display = 'none';
    document.getElementById('characteristic-footer').style.display = 'none';

    // 显示/隐藏DVP编辑按钮
    const dvpEditBtn = document.getElementById('dvp-edit-btn');
    
    // 根据选择的视图显示相应内容
    if (view === 'dfmea') {
        dfmeaTab.classList.add('active');
        if (dvpEditBtn) dvpEditBtn.style.display = 'none';

        document.getElementById('dfmea-header').style.display = 'block';
        document.getElementById('dfmea-table-container').style.display = 'block';
        document.getElementById('dfmea-footer').style.display = 'block';

    } else if (view === 'dvp') {
        dvpTab.classList.add('active');
        if (dvpEditBtn) dvpEditBtn.style.display = 'flex';

        document.getElementById('dvp-header').style.display = 'block';
        document.getElementById('dvp-table-container').style.display = 'block';
        document.getElementById('dvp-footer').style.display = 'block';

    } else if (view === 'characteristic') {
        characteristicTab.classList.add('active');
        if (dvpEditBtn) dvpEditBtn.style.display = 'none';

        document.getElementById('characteristic-table-container').style.display = 'block';
        document.getElementById('characteristic-footer').style.display = 'block';
    }
}

// ==================== 工具函数 ====================
// 格式化日期
function formatDate(dateString) {
    if (!dateString) return '';
    // 将各种格式的日期统一为yyyy.mm.dd
    return dateString.replace(/-/g, '.').replace(/\//g, '.');
}

// 获取状态类
function getStatusClass(status) {
    const statusClassMap = {
        '不执行': 'not-executed',
        '尚未确认': 'not-confirmed',
        '尚未决策': 'not-decided',
        '尚未完成': 'not-completed',
        '已完成': 'completed',
        '进行中': 'in-progress',
        '已取消': 'cancelled',
        '尚未执行': 'not-executed'
    };
    return statusClassMap[status] || 'default';
}

// 获取DVP状态类
function getDVPStatusClass(status) {
    const statusClassMap = {
        '已完成': 'completed',
        '进行中': 'in-progress',
        '尚未开始': 'not-executed',
        '计划中': 'not-confirmed'
    };
    return statusClassMap[status] || 'default';
}

// 获取AP颜色
function getAPColor(apValue) {
    switch(apValue) {
        case 'H': return '#ff0000'; // 红色
        case 'M': return '#ffa500'; // 橙色
        case 'L': return '#00b050'; // 绿色
        default: return '#000000'; // 黑色
    }
}

// ==================== 事件监听器 ====================
// 设置事件监听器
function setupEventListeners() {
    // 添加键盘快捷键
    document.addEventListener('keydown', function (e) {
        // Ctrl+E 导出Excel
        if (e.ctrlKey && e.key === 'e') {
            e.preventDefault();
            exportToExcel();
        }
        // Ctrl+P 导出PDF
        if (e.ctrlKey && e.key === 'p') {
            e.preventDefault();
            exportToPDF();
        }
    });
}

// ==================== 导出警告对话框 ====================
// 显示保存警告对话框
function showSaveWarning(type) {
    // 创建模态框
    const modal = document.createElement('div');
    modal.className = 'save-warning-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 8px;
        max-width: 450px;
        text-align: center;
        box-shadow: 0 2px 20px rgba(0,0,0,0.3);
    `;
    
    modalContent.innerHTML = `
        <div style="margin-bottom: 20px;">
            <i class="fas fa-exclamation-triangle" style="color: #ff9800; font-size: 48px; margin-bottom: 15px;"></i>
            <h3 style="margin: 0 0 10px 0; color: #333; font-size: 18px;">保存后才能导出</h3>
            <p style="color: #666; margin: 0 0 5px 0; font-size: 14px;">DVP表格当前处于编辑状态，必须先保存更改才能导出。</p>
            <p style="color: #999; margin: 0; font-size: 12px;">请先点击"保存"按钮保存修改，然后再次尝试导出。</p>
        </div>
        <div style="display: flex; justify-content: center; gap: 15px; margin-top: 25px;">
            <button id="close-warning" style="
                padding: 10px 25px;
                background: #f5f5f5;
                border: 1px solid #ddd;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: background 0.3s;
            ">关闭</button>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // 添加事件监听
    modalContent.querySelector('#close-warning').onclick = () => {
        document.body.removeChild(modal);
    };
    
    // 点击模态框背景关闭
    modal.onclick = (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    };
    
    // 不再提供"保存并导出"按钮，完全阻止导出
    return false;
}

// ==================== 数据获取函数 ====================
// 从DOM获取当前DVP表格数据
function getCurrentDVPDataFromDOM() {
    const currentData = [];
    const tableBody = document.getElementById('dvp-table-body');
    
    if (!tableBody) {
        return dvpData;
    }
    
    const rows = tableBody.querySelectorAll('tr');
    
    rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll('td');
        const rowData = {};
        
        cells.forEach((cell, cellIndex) => {
            let cellValue = '';
            
            if (cellIndex === 0) {
                // 序号列
                cellValue = cell.textContent.trim();
                rowData.id = parseInt(cellValue) || rowIndex + 1;
            } else if (cellIndex === 1) {
                // 试验项目
                cellValue = cell.textContent.trim();
                rowData.testItem = cellValue;
            } else if (cellIndex === 2) {
                // 试验名称
                cellValue = cell.textContent.trim();
                rowData.testName = cellValue;
            } else if (cellIndex === 3) {
                // 试验方法
                cellValue = cell.textContent.trim();
                rowData.testMethod = cellValue;
            } else if (cellIndex === 4) {
                // 目标要求
                cellValue = cell.textContent.trim();
                rowData.targetRequirement = cellValue;
            } else if (cellIndex === 5) {
                // 实验类型
                cellValue = cell.textContent.trim();
                rowData.testType = cellValue;
            } else if (cellIndex === 6) {
                // 样品数量
                cellValue = cell.textContent.trim();
                rowData.sampleQuantity = cellValue;
            } else if (cellIndex === 7) {
                // 计划开始日期
                cellValue = cell.textContent.trim();
                rowData.planStartDate = cellValue;
            } else if (cellIndex === 8) {
                // 试验状态
                const statusSpan = cell.querySelector('.status-indicator');
                cellValue = statusSpan ? statusSpan.textContent.trim() : cell.textContent.trim();
                rowData.testStatus = cellValue;
            } else if (cellIndex === 9) {
                // 实验报告
                cellValue = cell.textContent.trim();
                rowData.testReport = cellValue;
            } else if (cellIndex === 10) {
                // 实际完成日期
                cellValue = cell.textContent.trim();
                rowData.actualFinishDate = cellValue;
            }
        });
        
        currentData.push(rowData);
    });
    
    return currentData;
}

// 获取当前DVP表头数据
function getCurrentDVPHeaderData() {
    const headerData = {};
    const dvpHeader = document.getElementById('dvp-header');
    
    if (!dvpHeader) {
        console.warn('DVP表头元素未找到，返回默认数据');
        return dvpHeaderData || {
            '公司名称': '示例公司',
            '项目': '手机保护壳DVP&R',
            '设计地点': 'xx研发中心',
            '开始日期': '2024-01-15',
            '顾客名称': '手机制造商',
            '修订日期': '2024-02-28',
            '车型年/平台': '',
            '职能小组': '测试验证部',
            '系统/子系统/组件/部件': '手机保护壳系统',
            'DVP编号': 'DVP-2024-001',
            '责任人': '测试工程师',
            '保密级别': '内部使用'
        };
    }
    
    const headerItems = dvpHeader.querySelectorAll('.header-item');
    
    headerItems.forEach(item => {
        // 查找label和span元素
        const labelElement = item.querySelector('label');
        let spanElement = item.querySelector('span');
        
        // 如果找不到span，可能是因为还在编辑模式（input元素）
        if (!spanElement) {
            const inputElement = item.querySelector('input');
            if (inputElement && labelElement) {
                // 从input获取值
                const keyMatch = labelElement.textContent.trim().match(/^([^：]+)/);
                if (keyMatch) {
                    const key = keyMatch[1].trim();
                    headerData[key] = inputElement.value.trim();
                }
                return;
            }
        }
        
        if (labelElement && spanElement) {
            const labelText = labelElement.textContent.trim();
            const spanText = spanElement.textContent.trim();
            
            // 从label文本中提取键名（去掉冒号）
            const keyMatch = labelText.match(/^([^：]+)/);
            if (keyMatch) {
                const key = keyMatch[1].trim();
                headerData[key] = spanText;
            }
        }
    });
    
    console.log('从DOM获取的DVP表头数据:', headerData);
    return headerData;
}

// ==================== Excel导出函数 ====================
// 导出到Excel
function exportToExcel() {
    // 检查是否是DVP视图且在编辑模式
    if (currentView === 'dvp' && window.isDVPEditing === true) {
        showSaveWarning('excel');
        return; // 直接返回，不执行导出
    }
    
    if (currentView === 'dfmea') {
        exportDFMEAExcel();
    } else if (currentView === 'dvp') {
        exportDVPExcel();
    } else if (currentView === 'characteristic') {
        exportCharacteristicExcel();
    }
}

// 导出DFMEA Excel
function exportDFMEAExcel() {
    try {
        // 创建工作簿
        const wb = XLSX.utils.book_new();

        // 准备数据 - 完全匹配提供的表格格式
        const wsData = [];

        // 第1行：空行
        wsData.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);

        // 第2行：DFMEA标题（A2:AC2合并）
        wsData.push(['', 'DFMEA汇总报告', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);

        // 第3行：表头信息（初始留空，后面会填充）
        wsData.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);

        // 第4行：表头信息
        wsData.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);

        // 第5行：表头信息
        wsData.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);

        // 第6行：表头信息
        wsData.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);

        // 第7行：分析区域标题
        wsData.push([
            '', '结构分析', '', '', '功能分析', '', '', '失效分析', '', '', '', '风险分析', '', '', '', '', '', '优化', '', '', '', '', '', '', '', '', '', ''
        ]);

        // 第8行：具体列标题
        const headerRow = [
            '', '序号', '系统', '子系统', '零部件',
            '上一较高级别要素的功能', '关注要素功能和产品特性', '下一较低级别要素或特性',
            '对于上一较高级别要素和/或最终用户的失效影响（FE）', '失效影响的严重度（S）',
            '关注要素的失效模式（FM）', '下一较低级别要素的失效起因（FC）',
            '对失效起因的当前预防控制（PC）', '失效起因的频度（O）',
            '对失效起因或失效模式的当前探测控制（DC）', '失效起因/失效模式的探测度（D）',
            'AP(行动优先级)', '特殊特性', '建议的预防措施', '建议的探测措施',
            '负责人', '目标完成日期', '措施状态', '实际完成日期',
            '严重度（S）', '发生度（O）', '探测度（D）', 'AP', '备注'
        ];
        wsData.push(headerRow);

        // 添加数据行（从第9行开始）
        summaryData.forEach(item => {
            const row = [
                '', // 第一列留空
                item.id,
                item.system,
                item.subsystem,
                item.component,
                item.higherLevelFunction,
                item.focusFunction,
                item.lowerLevelCharacteristic,
                item.failureEffect,
                item.severity,
                item.failureMode,
                item.failureCause,
                item.preventiveControl,
                item.occurrence,
                item.detectiveControl,
                item.detection,
                item.ap,
                item.specialCharacteristic || '',
                item.recommendedPreventive,
                item.recommendedDetective,
                item.responsible,
                item.targetDate,
                item.status,
                item.actualDate || '',
                item.finalSeverity,
                item.finalOccurrence,
                item.finalDetection,
                item.finalAP,
                item.remarks || '',
            ];
            wsData.push(row);
        });

        // 创建工作表
        const ws = XLSX.utils.aoa_to_sheet(wsData);

        // 设置合并单元格 - 完全按照要求的合并规则
        const merges = [
            // 第2行：DFMEA标题合并（A2:AC2）
            {s: {r: 1, c: 1}, e: {r: 1, c: 28}},

            // 第3行合并（公司信息行）
            // B3:E3（4列）= "公司名称"
            {s: {r: 2, c: 1}, e: {r: 2, c: 4}},
            // F3:L3（7列）= "示例公司"
            {s: {r: 2, c: 5}, e: {r: 2, c: 11}},
            // M3单独1列 = "项目"
            // N3:R3（5列）= "手机保护壳DFMEA分析"
            {s: {r: 2, c: 13}, e: {r: 2, c: 17}},
            // S3:U3（3列）= "系统/子系统/组件/部件"
            {s: {r: 2, c: 18}, e: {r: 2, c: 20}},
            // V3:AC3（8列）= "手机保护壳系统"
            {s: {r: 2, c: 21}, e: {r: 2, c: 28}},

            // 第4行合并（设计地点行）
            // B4:E4（4列）= "设计地点"
            {s: {r: 3, c: 1}, e: {r: 3, c: 4}},
            // F4:L4（7列）= "xx研发中心"
            {s: {r: 3, c: 5}, e: {r: 3, c: 11}},
            // M4单独1列 = "开始日期"
            // N4:R4（5列）= "2024-01-15"
            {s: {r: 3, c: 13}, e: {r: 3, c: 17}},
            // S4:U4（3列）= "DFMEA编号"
            {s: {r: 3, c: 18}, e: {r: 3, c: 20}},
            // V4:AC4（8列）= "DFMEA-2024-001"
            {s: {r: 3, c: 21}, e: {r: 3, c: 28}},

            // 第5行合并（顾客信息行）
            // B5:E5（4列）= "顾客名称"
            {s: {r: 4, c: 1}, e: {r: 4, c: 4}},
            // F5:L5（7列）= "手机制造商"
            {s: {r: 4, c: 5}, e: {r: 4, c: 11}},
            // M5单独1列 = "修订日期"
            // N5:R5（5列）= "2024-02-28"
            {s: {r: 4, c: 13}, e: {r: 4, c: 17}},
            // S5:U5（3列）= "责任人"
            {s: {r: 4, c: 18}, e: {r: 4, c: 20}},
            // V5:AC5（8列）= "张三"
            {s: {r: 4, c: 21}, e: {r: 4, c: 28}},

            // 第6行合并（车型信息行）
            // B6:E6（4列）= "车型年/平台"
            {s: {r: 5, c: 1}, e: {r: 5, c: 4}},
            // F6:L6（7列）= ""（空）
            {s: {r: 5, c: 5}, e: {r: 5, c: 11}},
            // M6单独1列 = "职能小组"
            // N6:R6（5列）= "产品设计部"
            {s: {r: 5, c: 13}, e: {r: 5, c: 17}},
            // S6:U6（3列）= "保密级别"
            {s: {r: 5, c: 18}, e: {r: 5, c: 20}},
            // V6:AC6（8列）= "内部使用"
            {s: {r: 5, c: 21}, e: {r: 5, c: 28}},

            // 第7行：分析区域标题合并
            // 结构分析：B7:D7（3列）
            {s: {r: 6, c: 1}, e: {r: 6, c: 3}},
            // 功能分析：E7:G7（3列）
            {s: {r: 6, c: 4}, e: {r: 6, c: 6}},
            // 失效分析：H7:K7（4列）
            {s: {r: 6, c: 7}, e: {r: 6, c: 10}},
            // 风险分析：L7:Q7（6列）
            {s: {r: 6, c: 11}, e: {r: 6, c: 16}},
            // 优化：R7:AC7（18列）
            {s: {r: 6, c: 17}, e: {r: 6, c: 28}},
        ];

        ws['!merges'] = merges;

        // 设置列宽
        const colWidths = [
            {wch: 2},   // A列留空
            {wch: 5},   // B列：序号
            {wch: 8},   // C列：系统
            {wch: 8},   // D列：子系统
            {wch: 10},  // E列：零部件
            {wch: 15},  // F列：上一较高级别要素的功能
            {wch: 15},  // G列：关注要素功能和产品特性
            {wch: 12},  // H列：下一较低级别要素或特性
            {wch: 20},  // I列：失效影响
            {wch: 8},   // J列：S
            {wch: 15},  // K列：FM
            {wch: 15},  // L列：FC
            {wch: 18},  // M列：PC
            {wch: 8},   // N列：O
            {wch: 18},  // O列：DC
            {wch: 8},   // P列：D
            {wch: 10},  // Q列：AP
            {wch: 10},  // R列：特殊特性
            {wch: 15},  // S列：建议的预防措施
            {wch: 15},  // T列：建议的探测措施
            {wch: 8},   // U列：负责人
            {wch: 12},  // V列：目标完成日期
            {wch: 10},  // W列：措施状态
            {wch: 12},  // X列：实际完成日期
            {wch: 8},   // Y列：严重度（S）
            {wch: 8},   // Z列：发生度（O）
            {wch: 8},   // AA列：探测度（D）
            {wch: 5},   // AB列：AP
            {wch: 10}   // AC列：备注
        ];
        ws['!cols'] = colWidths;

        // 设置单元格样式
        // 为所有单元格添加边框
        const range = XLSX.utils.decode_range(ws['!ref']);
        for (let R = range.s.r; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cellAddress = XLSX.utils.encode_cell({r: R, c: C});
                if (!ws[cellAddress]) ws[cellAddress] = {};
                ws[cellAddress].s = ws[cellAddress].s || {};

                // 添加边框
                ws[cellAddress].s.border = {
                    top: {style: "thin", color: {rgb: "000000"}},
                    right: {style: "thin", color: {rgb: "000000"}},
                    bottom: {style: "thin", color: {rgb: "000000"}},
                    left: {style: "thin", color: {rgb: "000000"}}
                };

                // 默认居中对齐
                ws[cellAddress].s.alignment = ws[cellAddress].s.alignment || {
                    horizontal: "center",
                    vertical: "center",
                    wrapText: true
                };
            }
        }

        // 第2行：DFMEA标题样式（A2:AC2合并）
        for (let c = 1; c <= 28; c++) {
            const cellAddress = XLSX.utils.encode_cell({r: 1, c: c});
            if (ws[cellAddress]) {
                ws[cellAddress].s = {
                    ...ws[cellAddress].s,
                    font: {bold: true, sz: 16, color: {rgb: "000000"}},
                    alignment: {horizontal: 'center', vertical: 'center'}
                };
            }
        }

        // 正确填充表头数据 - 按照分栏格式
        // 第3行：
        const companyLabelCell = XLSX.utils.encode_cell({r: 2, c: 1}); // B3 - 公司名称
        if (ws[companyLabelCell]) {
            ws[companyLabelCell].v = "公司名称";
        }

        const companyValueCell = XLSX.utils.encode_cell({r: 2, c: 5}); // F3 - 示例公司
        if (ws[companyValueCell]) {
            ws[companyValueCell].v = "示例公司";
        }

        const projectLabelCell = XLSX.utils.encode_cell({r: 2, c: 12}); // M3 - 项目
        if (ws[projectLabelCell]) {
            ws[projectLabelCell].v = "项目";
        }

        const projectValueCell = XLSX.utils.encode_cell({r: 2, c: 13}); // N3 - 手机保护壳DFMEA分析
        if (ws[projectValueCell]) {
            ws[projectValueCell].v = "手机保护壳DFMEA分析";
        }

        const systemLabelCell = XLSX.utils.encode_cell({r: 2, c: 18}); // S3 - 系统/子系统/组件/部件
        if (ws[systemLabelCell]) {
            ws[systemLabelCell].v = "系统/子系统/组件/部件";
        }

        const systemValueCell = XLSX.utils.encode_cell({r: 2, c: 21}); // V3 - 手机保护壳系统
        if (ws[systemValueCell]) {
            ws[systemValueCell].v = "手机保护壳系统";
        }

        // 第4行：
        const locationLabelCell = XLSX.utils.encode_cell({r: 3, c: 1}); // B4 - 设计地点
        if (ws[locationLabelCell]) {
            ws[locationLabelCell].v = "设计地点";
        }

        const locationValueCell = XLSX.utils.encode_cell({r: 3, c: 5}); // F4 - xx研发中心
        if (ws[locationValueCell]) {
            ws[locationValueCell].v = "xx研发中心";
        }

        const startDateLabelCell = XLSX.utils.encode_cell({r: 3, c: 12}); // M4 - 开始日期
        if (ws[startDateLabelCell]) {
            ws[startDateLabelCell].v = "开始日期";
        }

        const startDateValueCell = XLSX.utils.encode_cell({r: 3, c: 13}); // N4 - 2024-01-15
        if (ws[startDateValueCell]) {
            ws[startDateValueCell].v = "2024-01-15";
        }

        const dfmeaNumLabelCell = XLSX.utils.encode_cell({r: 3, c: 18}); // S4 - DFMEA编号
        if (ws[dfmeaNumLabelCell]) {
            ws[dfmeaNumLabelCell].v = "DFMEA编号";
        }

        const dfmeaNumValueCell = XLSX.utils.encode_cell({r: 3, c: 21}); // V4 - DFMEA-2024-001
        if (ws[dfmeaNumValueCell]) {
            ws[dfmeaNumValueCell].v = "DFMEA-2024-001";
        }

        // 第5行：
        const customerLabelCell = XLSX.utils.encode_cell({r: 4, c: 1}); // B5 - 顾客名称
        if (ws[customerLabelCell]) {
            ws[customerLabelCell].v = "顾客名称";
        }

        const customerValueCell = XLSX.utils.encode_cell({r: 4, c: 5}); // F5 - 手机制造商
        if (ws[customerValueCell]) {
            ws[customerValueCell].v = "手机制造商";
        }

        const reviseDateLabelCell = XLSX.utils.encode_cell({r: 4, c: 12}); // M5 - 修订日期
        if (ws[reviseDateLabelCell]) {
            ws[reviseDateLabelCell].v = "修订日期";
        }

        const reviseDateValueCell = XLSX.utils.encode_cell({r: 4, c: 13}); // N5 - 2024-02-28
        if (ws[reviseDateValueCell]) {
            ws[reviseDateValueCell].v = "2024-02-28";
        }

        const responsibleLabelCell = XLSX.utils.encode_cell({r: 4, c: 18}); // S5 - 责任人
        if (ws[responsibleLabelCell]) {
            ws[responsibleLabelCell].v = "责任人";
        }

        const responsibleValueCell = XLSX.utils.encode_cell({r: 4, c: 21}); // V5 - 张三
        if (ws[responsibleValueCell]) {
            ws[responsibleValueCell].v = "张三";
        }

        // 第6行：
        const platformLabelCell = XLSX.utils.encode_cell({r: 5, c: 1}); // B6 - 车型年/平台
        if (ws[platformLabelCell]) {
            ws[platformLabelCell].v = "车型年/平台";
        }

        const platformValueCell = XLSX.utils.encode_cell({r: 5, c: 5}); // F6 - 空
        if (ws[platformValueCell]) {
            ws[platformValueCell].v = "";
        }

        const groupLabelCell = XLSX.utils.encode_cell({r: 5, c: 12}); // M6 - 职能小组
        if (ws[groupLabelCell]) {
            ws[groupLabelCell].v = "职能小组";
        }

        const groupValueCell = XLSX.utils.encode_cell({r: 5, c: 13}); // N6 - 产品设计部
        if (ws[groupValueCell]) {
            ws[groupValueCell].v = "产品设计部";
        }

        const securityLabelCell = XLSX.utils.encode_cell({r: 5, c: 18}); // S6 - 保密级别
        if (ws[securityLabelCell]) {
            ws[securityLabelCell].v = "保密级别";
        }

        const securityValueCell = XLSX.utils.encode_cell({r: 5, c: 21}); // V6 - 内部使用
        if (ws[securityValueCell]) {
            ws[securityValueCell].v = "内部使用";
        }

        // 第3-6行：表头信息样式 - 所有内容居中对齐
        for (let r = 2; r <= 5; r++) {
            for (let c = 1; c <= 28; c++) {
                const cellAddress = XLSX.utils.encode_cell({r: r, c: c});
                if (ws[cellAddress]) {
                    ws[cellAddress].s = {
                        ...ws[cellAddress].s,
                        font: {bold: true, sz: 10},
                        alignment: {horizontal: 'center', vertical: 'center'}
                    };
                }
            }
        }

        // 第7行：分析区域标题样式 - 居中对齐
        for (let c = 1; c <= 28; c++) {
            const cellAddress = XLSX.utils.encode_cell({r: 6, c: c});
            if (ws[cellAddress]) {
                ws[cellAddress].s = {
                    ...ws[cellAddress].s,
                    font: {bold: true, sz: 12, color: {rgb: "000000"}},
                    alignment: {horizontal: 'center', vertical: 'center'},
                    fill: {
                        fgColor: {rgb: "D9E1F2"},
                        patternType: "solid"
                    }
                };
            }
        }

        // 第8行：具体列标题样式 - 居中对齐
        for (let c = 1; c <= 28; c++) {
            const cellAddress = XLSX.utils.encode_cell({r: 7, c: c});
            if (ws[cellAddress]) {
                ws[cellAddress].s = {
                    ...ws[cellAddress].s,
                    font: {bold: true, sz: 10, color: {rgb: "000000"}},
                    alignment: {horizontal: 'center', vertical: 'center', wrapText: true},
                    fill: {
                        fgColor: {rgb: "E2EFDA"},
                        patternType: "solid"
                    }
                };
            }
        }

        // 数据行样式（从第9行开始）
        const dataStartRow = 8;
        for (let r = dataStartRow; r < dataStartRow + summaryData.length; r++) {
            // 序号列样式
            const cellId = XLSX.utils.encode_cell({r: r, c: 1}); // B列
            if (ws[cellId]) {
                ws[cellId].s = {
                    ...ws[cellId].s,
                    font: {bold: true, sz: 10},
                    alignment: {horizontal: 'center', vertical: 'center'}
                };
            }

            // 特殊特性列样式（R列，第17列）
            const cellSpecial = XLSX.utils.encode_cell({r: r, c: 17});
            if (ws[cellSpecial]) {
                ws[cellSpecial].s = {
                    ...ws[cellSpecial].s,
                    font: {bold: true, sz: 10},
                    alignment: {horizontal: 'center', vertical: 'center'}
                };
            }

            // 负责人列样式（U列，第20列）
            const cellResponsible = XLSX.utils.encode_cell({r: r, c: 20});
            if (ws[cellResponsible]) {
                ws[cellResponsible].s = {
                    ...ws[cellResponsible].s,
                    font: {bold: true, sz: 10},
                    alignment: {horizontal: 'center', vertical: 'center'}
                };
            }

            // 目标完成日期列样式（V列，第21列）
            const cellTargetDate = XLSX.utils.encode_cell({r: r, c: 21});
            if (ws[cellTargetDate]) {
                ws[cellTargetDate].s = {
                    ...ws[cellTargetDate].s,
                    font: {bold: false, sz: 10},
                    alignment: {horizontal: 'center', vertical: 'center'}
                };
            }

            // 措施状态列样式（W列，第22列）
            const cellStatus = XLSX.utils.encode_cell({r: r, c: 22});
            if (ws[cellStatus]) {
                ws[cellStatus].s = {
                    ...ws[cellStatus].s,
                    font: {bold: true, sz: 10},
                    alignment: {horizontal: 'center', vertical: 'center'}
                };
            }

            // 实际完成日期列样式（X列，第23列）
            const cellActualDate = XLSX.utils.encode_cell({r: r, c: 23});
            if (ws[cellActualDate]) {
                ws[cellActualDate].s = {
                    ...ws[cellActualDate].s,
                    font: {bold: false, sz: 10},
                    alignment: {horizontal: 'center', vertical: 'center'}
                };
            }

            // AP列样式（原始AP，Q列，第16列）
            const cellAP = XLSX.utils.encode_cell({r: r, c: 16});
            if (ws[cellAP] && ws[cellAP].v) {
                const apValue = ws[cellAP].v;
                let apColor = "000000";
                if (apValue === 'H') apColor = "FF0000"; // 红色
                else if (apValue === 'M') apColor = "FFA500"; // 橙色
                else if (apValue === 'L') apColor = "00B050"; // 绿色

                ws[cellAP].s = {
                    ...ws[cellAP].s,
                    font: {bold: true, sz: 11, color: {rgb: apColor}},
                    alignment: {horizontal: 'center', vertical: 'center'}
                };
            }

            // 最终AP列样式（AB列，第27列）
            const cellFinalAP = XLSX.utils.encode_cell({r: r, c: 27});
            if (ws[cellFinalAP] && ws[cellFinalAP].v) {
                const apValue = ws[cellFinalAP].v;
                let apColor = "000000";
                if (apValue === 'H') apColor = "FF0000";
                else if (apValue === 'M') apColor = "FFA500";
                else if (apValue === 'L') apColor = "00B050";

                ws[cellFinalAP].s = {
                    ...ws[cellFinalAP].s,
                    font: {bold: true, sz: 11, color: {rgb: apColor}},
                    alignment: {horizontal: 'center', vertical: 'center'}
                };
            }

            // 数字评分列样式（S、O、D列）
            const scoreCols = [9, 13, 15, 24, 25, 26]; // J、N、P、Y、Z、AA列
            scoreCols.forEach(colIndex => {
                const cellScore = XLSX.utils.encode_cell({r: r, c: colIndex});
                if (ws[cellScore]) {
                    ws[cellScore].s = {
                        ...ws[cellScore].s,
                        font: {bold: true, sz: 10},
                        alignment: {horizontal: 'center', vertical: 'center'}
                    };
                }
            });

            // 备注列样式（AC列，第28列）
            const cellRemarks = XLSX.utils.encode_cell({r: r, c: 28});
            if (ws[cellRemarks]) {
                ws[cellRemarks].s = {
                    ...ws[cellRemarks].s,
                    font: {bold: false, sz: 9},
                    alignment: {horizontal: 'left', vertical: 'center'}
                };
            }

            // 文本内容列左对齐（系统、子系统、零部件等）
            const textCols = [2, 3, 4, 5, 6, 7, 10, 11, 12, 14, 18, 19]; // C、D、E、F、G、H、K、L、M、O、S、T列
            textCols.forEach(colIndex => {
                const cellText = XLSX.utils.encode_cell({r: r, c: colIndex});
                if (ws[cellText]) {
                    ws[cellText].s = {
                        ...ws[cellText].s,
                        alignment: {horizontal: 'left', vertical: 'center', wrapText: true}
                    };
                }
            });
        }

        // 设置行高
        if (!ws['!rows']) ws['!rows'] = [];
        // 标题行高
        for (let r = 0; r <= 7; r++) {
            ws['!rows'][r] = {hpt: 25}; // 较高行高适合标题
        }
        // 数据行高
        for (let r = 8; r < 8 + summaryData.length; r++) {
            ws['!rows'][r] = {hpt: 20}; // 数据行高
        }

        // 设置工作表名称
        XLSX.utils.book_append_sheet(wb, ws, "DFMEA汇总");

        // 生成文件名
        const fileName = `DFMEA汇总_${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}.xlsx`;

        // 导出文件
        XLSX.writeFile(wb, fileName);

        // 显示导出成功消息
        showExportSuccess("DFMEA Excel文件已生成并开始下载！");

    } catch (error) {
        console.error('导出DFMEA Excel失败:', error);
        alert('导出DFMEA Excel文件时出错：' + error.message);
    }
}

// 导出DVP Excel
function exportDVPExcel() {
    try {
        // 从DOM获取最新数据
        const currentDVPData = getCurrentDVPDataFromDOM();
        const headerData = getCurrentDVPHeaderData(); // 使用最新的表头数据
        
        // 创建工作簿
        const wb = XLSX.utils.book_new();

        // 准备数据
        const wsData = [];

        // 添加表头信息行
        wsData.push(['设计验证计划(DVP)']);
        wsData.push([]);

        // 添加页面头部信息 - 使用实际表头数据（编辑后的数据）
        wsData.push(['公司名称：', headerData['公司名称'] || '示例公司', '', '', '', '', '', '项目：', headerData['项目'] || '手机保护壳DVP&R']);
        wsData.push(['设计地点：', headerData['设计地点'] || 'xx研发中心', '', '', '', '', '', '开始日期：', headerData['开始日期'] || '2024-01-15']);
        wsData.push(['顾客名称：', headerData['顾客名称'] || '手机制造商', '', '', '', '', '', '修订日期：', headerData['修订日期'] || '2024-02-28']);
        wsData.push(['车型年/平台：', headerData['车型年/平台'] || '', '', '', '', '', '', '职能小组：', headerData['职能小组'] || '测试验证部']);
        wsData.push(['系统/子系统/组件/部件：', headerData['系统/子系统/组件/部件'] || '手机保护壳系统', '', '', '', '', '', 'DVP编号：', headerData['DVP编号'] || 'DVP-2024-001']);
        wsData.push(['责任人：', headerData['责任人'] || '测试工程师', '', '', '', '', '', '保密级别：', headerData['保密级别'] || '内部使用']);
        wsData.push([]);

        // 添加第一行表头（区域标题）
        const regionRow = [
            '', // 序号列上方留空
            '试验信息', '试验信息', '试验信息', '试验信息', '试验信息',
            '计划安排', '计划安排', '计划安排', '计划安排', '计划安排'
        ];
        wsData.push(regionRow);

        // 添加第二行表头（列标题）- 现在有11列
        const headerRow = [
            '序号',
            '试验项目', '试验名称', '试验方法', '目标要求', '实验类型',
            '样品数量', '计划开始日期', '试验状态', '实验报告', '实际完成日期'
        ];
        wsData.push(headerRow);

        // 添加数据行
        currentDVPData.forEach(item => {
            const row = [
                item.id,
                item.testItem || '',
                item.testName || '',
                item.testMethod || '',
                item.targetRequirement || '',
                item.testType || '',
                item.sampleQuantity || '',
                item.planStartDate || '',
                item.testStatus || '',
                item.testReport || '',
                item.actualFinishDate || ''
            ];
            wsData.push(row);
        });

        // 创建工作表
        const ws = XLSX.utils.aoa_to_sheet(wsData);

        // 设置合并单元格 - 更新合并范围
        const merges = [
            // 第2行标题合并（A1:K1）
            {s: {r: 0, c: 0}, e: {r: 0, c: 10}},
            
            // 第3-8行表头信息合并
            {s: {r: 2, c: 1}, e: {r: 2, c: 2}},
            {s: {r: 2, c: 8}, e: {r: 2, c: 9}},
            
            {s: {r: 3, c: 1}, e: {r: 3, c: 2}},
            {s: {r: 3, c: 8}, e: {r: 3, c: 9}},
            
            {s: {r: 4, c: 1}, e: {r: 4, c: 2}},
            {s: {r: 4, c: 8}, e: {r: 4, c: 9}},
            
            {s: {r: 5, c: 1}, e: {r: 5, c: 2}},
            {s: {r: 5, c: 8}, e: {r: 5, c: 9}},
            
            {s: {r: 6, c: 1}, e: {r: 6, c: 2}},
            {s: {r: 6, c: 8}, e: {r: 6, c: 9}},
            
            {s: {r: 7, c: 1}, e: {r: 7, c: 2}},
            {s: {r: 7, c: 8}, e: {r: 7, c: 9}},
            
            // 试验信息区域合并（B9:F9）
            {s: {r: 9, c: 1}, e: {r: 9, c: 5}},
            // 计划安排区域合并（G9:K9）
            {s: {r: 9, c: 6}, e: {r: 9, c: 10}}
        ];

        ws['!merges'] = merges;

        // 设置列宽 - 调整为11列
        const colWidths = [
            {wch: 5},   // 序号
            {wch: 15},  // 试验项目
            {wch: 20},  // 试验名称
            {wch: 20},  // 试验方法
            {wch: 20},  // 目标要求
            {wch: 12},  // 实验类型
            {wch: 10},  // 样品数量
            {wch: 12},  // 计划开始日期
            {wch: 12},  // 试验状态
            {wch: 15},  // 实验报告
            {wch: 12}   // 实际完成日期
        ];
        ws['!cols'] = colWidths;

        // 设置表头样式
        const firstHeaderRowIndex = 9; // 区域标题行
        const secondHeaderRowIndex = 10; // 列标题行

        // 标题样式（第1行）
        for (let col = 0; col <= 10; col++) {
            const cellAddress = XLSX.utils.encode_cell({r: 0, c: col});
            if (ws[cellAddress]) {
                ws[cellAddress].s = {
                    font: {bold: true, sz: 16},
                    alignment: {horizontal: 'center', vertical: 'center'}
                };
            }
        }

        // 表头信息样式（第3-8行）
        for (let r = 2; r <= 7; r++) {
            for (let c = 0; c <= 10; c++) {
                const cellAddress = XLSX.utils.encode_cell({r: r, c: c});
                if (ws[cellAddress]) {
                    ws[cellAddress].s = {
                        font: {bold: true, sz: 11},
                        alignment: {horizontal: 'left', vertical: 'center'}
                    };
                }
            }
        }

        // 第一行表头样式（区域标题）
        for (let col = 1; col <= 10; col++) {
            const cellAddress = XLSX.utils.encode_cell({r: firstHeaderRowIndex, c: col});
            if (ws[cellAddress]) {
                ws[cellAddress].s = {
                    font: {bold: true, sz: 12},
                    alignment: {horizontal: 'center', vertical: 'center'},
                    fill: {fgColor: {rgb: "D9E1F2"}, patternType: "solid"}
                };
            }
        }

        // 第二行表头样式（列标题）
        for (let col = 0; col <= 10; col++) {
            const cellAddress = XLSX.utils.encode_cell({r: secondHeaderRowIndex, c: col});
            if (ws[cellAddress]) {
                ws[cellAddress].s = {
                    font: {bold: true, sz: 11},
                    alignment: {horizontal: 'center', vertical: 'center'},
                    fill: {fgColor: {rgb: "E2EFDA"}, patternType: "solid"}
                };
            }
        }

        // 数据行样式
        for (let i = 0; i < currentDVPData.length; i++) {
            const rowIndex = secondHeaderRowIndex + 1 + i;
            
            // 序号列样式
            const idCell = XLSX.utils.encode_cell({r: rowIndex, c: 0});
            if (ws[idCell]) {
                ws[idCell].s = {
                    font: {bold: true, sz: 10},
                    alignment: {horizontal: 'center', vertical: 'center'}
                };
            }
            
            // 试验状态列特殊样式
            const statusCell = XLSX.utils.encode_cell({r: rowIndex, c: 8});
            if (ws[statusCell]) {
                ws[statusCell].s = {
                    font: {bold: true, sz: 10},
                    alignment: {horizontal: 'center', vertical: 'center'}
                };
            }
            
            // 样品数量、日期列居中
            const sampleCell = XLSX.utils.encode_cell({r: rowIndex, c: 6});
            const planDateCell = XLSX.utils.encode_cell({r: rowIndex, c: 7});
            const actualDateCell = XLSX.utils.encode_cell({r: rowIndex, c: 10});
            const reportCell = XLSX.utils.encode_cell({r: rowIndex, c: 9});
            
            [sampleCell, planDateCell, actualDateCell, reportCell].forEach(cell => {
                if (ws[cell]) {
                    ws[cell].s = {
                        ...ws[cell].s,
                        alignment: {horizontal: 'center', vertical: 'center'}
                    };
                }
            });
        }

        // 为所有单元格添加边框
        const range = XLSX.utils.decode_range(ws['!ref']);
        for (let R = range.s.r; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cellAddress = XLSX.utils.encode_cell({r: R, c: C});
                if (!ws[cellAddress]) ws[cellAddress] = {};
                ws[cellAddress].s = ws[cellAddress].s || {};
                
                ws[cellAddress].s.border = {
                    top: {style: "thin", color: {rgb: "000000"}},
                    right: {style: "thin", color: {rgb: "000000"}},
                    bottom: {style: "thin", color: {rgb: "000000"}},
                    left: {style: "thin", color: {rgb: "000000"}}
                };
            }
        }

        // 设置工作表名称
        XLSX.utils.book_append_sheet(wb, ws, "DVP");

        // 生成文件名
        const fileName = `DVP_${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}.xlsx`;

        // 导出文件
        XLSX.writeFile(wb, fileName);

        // 显示导出成功消息
        showExportSuccess("DVP Excel文件已生成并开始下载！");

    } catch (error) {
        console.error('导出DVP Excel失败:', error);
        alert('导出DVP Excel文件时出错：' + error.message);
    }
}

// 导出特性清单Excel
function exportCharacteristicExcel() {
    try {
        // 创建工作簿
        const wb = XLSX.utils.book_new();

        // 准备数据
        const wsData = [];

        // 添加标题行
        wsData.push(['特性清单']);
        wsData.push([]);

        // 添加表头信息（简化版）
        wsData.push(['项目：', '手机保护壳特性清单', '', '', '', '', '日期：', new Date().toLocaleDateString()]);
        wsData.push([]);

        // 添加第一行表头（区域标题）
        const regionRow = [
            '', // 序号列上方留空
            '零件信息', '零件信息', '零件信息',
            '特性信息', '特性信息', '特性信息', '特性信息'
        ];
        wsData.push(regionRow);

        // 添加第二行表头（列标题）
        const headerRow = [
            '序号',
            '零件名称', '所属子系统', '所属系统',
            '特性编号', '特性描述', '特性分类', '备注'
        ];
        wsData.push(headerRow);

        // 添加数据行
        characteristicListData.forEach(item => {
            const row = [
                item.id,
                item.component,
                item.subsystem,
                item.system,
                item.charNum,
                item.description,
                item.classification,
                item.remarks
            ];
            wsData.push(row);
        });

        // 创建工作表
        const ws = XLSX.utils.aoa_to_sheet(wsData);

        // 设置合并单元格
        const merges = [
            // 零件信息区域合并
            {
                s: {r: wsData.length - characteristicListData.length - 2, c: 1},
                e: {r: wsData.length - characteristicListData.length - 2, c: 3}
            },

            // 特性信息区域合并
            {
                s: {r: wsData.length - characteristicListData.length - 2, c: 4},
                e: {r: wsData.length - characteristicListData.length - 2, c: 7}
            }
        ];

        ws['!merges'] = merges;

        // 设置列宽
        const colWidths = [
            {wch: 5},   // 序号
            {wch: 12},  // 零件名称
            {wch: 12},  // 所属子系统
            {wch: 12},  // 所属系统
            {wch: 10},  // 特性编号
            {wch: 20},  // 特性描述
            {wch: 12},  // 特性分类
            {wch: 15}   // 备注
        ];
        ws['!cols'] = colWidths;

        // 设置表头样式
        const firstHeaderRowIndex = wsData.length - characteristicListData.length - 2;
        const secondHeaderRowIndex = firstHeaderRowIndex + 1;

        // 第一行表头样式
        for (let col = 1; col <= 7; col++) {
            const cellAddress = XLSX.utils.encode_cell({r: firstHeaderRowIndex, c: col});
            if (ws[cellAddress]) {
                ws[cellAddress].s = {
                    font: {bold: true, sz: 11},
                    alignment: {horizontal: 'center', vertical: 'center'},
                    fill: {fgColor: {rgb: "D9E1F2"}}
                };
            }
        }

        // 第二行表头样式
        for (let col = 0; col <= 7; col++) {
            const cellAddress = XLSX.utils.encode_cell({r: secondHeaderRowIndex, c: col});
            if (ws[cellAddress]) {
                ws[cellAddress].s = {
                    font: {bold: true, sz: 10},
                    alignment: {horizontal: 'center', vertical: 'center'},
                    fill: {fgColor: {rgb: "E2EFDA"}}
                };
            }
        }

        // 设置工作表名称
        XLSX.utils.book_append_sheet(wb, ws, "特性清单");

        // 生成文件名
        const fileName = `特性清单_${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}.xlsx`;

        // 导出文件
        XLSX.writeFile(wb, fileName);

        // 显示导出成功消息
        showExportSuccess("特性清单 Excel文件已生成并开始下载！");

    } catch (error) {
        console.error('导出特性清单 Excel失败:', error);
        alert('导出特性清单 Excel文件时出错：' + error.message);
    }
}

// ==================== PDF导出函数 ====================
// 导出到PDF
function exportToPDF() {
    // 检查是否是DVP视图且在编辑模式
    if (currentView === 'dvp' && window.isDVPEditing === true) {
        showSaveWarning('pdf');
        return; // 直接返回，不执行导出
    }
    
    if (currentView === 'dfmea') {
        exportDFMEAPDF();
    } else if (currentView === 'dvp') {
        exportDVPPDF();
    } else if (currentView === 'characteristic') {
        exportCharacteristicPDF();
    }
}

// 导出DFMEA PDF
function exportDFMEAPDF() {
    try {
        const exportBtn = document.querySelector('.action-btn.secondary');
        const originalHtml = exportBtn.innerHTML;
        exportBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> 正在生成PDF...`;
        exportBtn.disabled = true;

        // 创建优化的导出元素
        const tempElement = createPDFExportElement('dfmea');
        document.body.appendChild(tempElement);

        // 获取元素的精确尺寸
        const elementWidth = tempElement.offsetWidth;
        const elementHeight = tempElement.offsetHeight;

        // 等待渲染完成
        setTimeout(() => {
            html2canvas(tempElement, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                width: elementWidth,
                height: elementHeight,
                windowWidth: elementWidth,
                windowHeight: elementHeight,
                allowTaint: true,
                removeContainer: true
            }).then(canvas => {
                // 移除临时元素
                document.body.removeChild(tempElement);

                // 创建PDF
                const {jsPDF} = window.jspdf;
                const pdf = new jsPDF('l', 'mm', 'a4'); // 横向A4

                const imgData = canvas.toDataURL('image/jpeg', 1.0);

                // PDF页面尺寸
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();

                // 图片尺寸
                const imgWidth = canvas.width;
                const imgHeight = canvas.height;

                // 计算缩放比例 - 留出边距
                const margin = 10; // 边距
                const contentWidth = pdfWidth - 2 * margin;
                const contentHeight = pdfHeight - 2 * margin;

                const widthRatio = contentWidth / imgWidth;
                const heightRatio = contentHeight / imgHeight;
                const scaleRatio = Math.min(widthRatio, heightRatio);

                // 缩放后的尺寸
                const scaledWidth = imgWidth * scaleRatio;
                const scaledHeight = imgHeight * scaleRatio;

                // 居中显示
                const x = (pdfWidth - scaledWidth) / 2;
                const y = (pdfHeight - scaledHeight) / 2;

                pdf.addImage(imgData, 'JPEG', x, y, scaledWidth, scaledHeight);

                // 保存PDF
                const fileName = `DFMEA汇总_${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}.pdf`;
                pdf.save(fileName);

                // 恢复按钮状态
                exportBtn.innerHTML = originalHtml;
                exportBtn.disabled = false;

                // 显示成功消息
                showExportSuccess("DFMEA PDF文件已生成！");

            }).catch(error => {
                // 确保临时元素被移除
                if (tempElement.parentNode) {
                    document.body.removeChild(tempElement);
                }
                console.error('生成PDF失败:', error);
                exportBtn.innerHTML = originalHtml;
                exportBtn.disabled = false;
                alert('生成PDF文件时出错：' + error.message);
            });
        }, 500); // 给足够的时间渲染

    } catch (error) {
        console.error('导出PDF失败:', error);
        alert('导出PDF文件时出错：' + error.message);
    }
}

// 导出DVP PDF
function exportDVPPDF() {
    try {
        const exportBtn = document.querySelector('.action-btn.secondary');
        const originalHtml = exportBtn.innerHTML;
        exportBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> 正在生成PDF...`;
        exportBtn.disabled = true;

        // 创建优化的DVP导出元素
        const tempElement = createDVPExportElement();
        document.body.appendChild(tempElement);

        const elementWidth = tempElement.offsetWidth;
        const elementHeight = tempElement.offsetHeight;

        setTimeout(() => {
            html2canvas(tempElement, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                width: elementWidth,
                height: elementHeight,
                windowWidth: elementWidth,
                windowHeight: elementHeight,
                allowTaint: true,
                removeContainer: true
            }).then(canvas => {
                document.body.removeChild(tempElement);

                const {jsPDF} = window.jspdf;
                const pdf = new jsPDF('l', 'mm', 'a4');

                const imgData = canvas.toDataURL('image/jpeg', 1.0);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();

                const imgWidth = canvas.width;
                const imgHeight = canvas.height;

                const margin = 10;
                const contentWidth = pdfWidth - 2 * margin;
                const contentHeight = pdfHeight - 2 * margin;

                const widthRatio = contentWidth / imgWidth;
                const heightRatio = contentHeight / imgHeight;
                const scaleRatio = Math.min(widthRatio, heightRatio);

                const scaledWidth = imgWidth * scaleRatio;
                const scaledHeight = imgHeight * scaleRatio;

                const x = (pdfWidth - scaledWidth) / 2;
                const y = (pdfHeight - scaledHeight) / 2;

                pdf.addImage(imgData, 'JPEG', x, y, scaledWidth, scaledHeight);

                const fileName = `DVP_${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}.pdf`;
                pdf.save(fileName);

                exportBtn.innerHTML = originalHtml;
                exportBtn.disabled = false;
                showExportSuccess("DVP PDF文件已生成！");

            }).catch(error => {
                if (tempElement.parentNode) {
                    document.body.removeChild(tempElement);
                }
                console.error('生成PDF失败:', error);
                exportBtn.innerHTML = originalHtml;
                exportBtn.disabled = false;
                alert('生成PDF文件时出错：' + error.message);
            });
        }, 500);

    } catch (error) {
        console.error('导出PDF失败:', error);
        alert('导出PDF文件时出错：' + error.message);
    }
}

// 导出特性清单 PDF
function exportCharacteristicPDF() {
    try {
        const exportBtn = document.querySelector('.action-btn.secondary');
        const originalHtml = exportBtn.innerHTML;
        exportBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> 正在生成PDF...`;
        exportBtn.disabled = true;

        // 创建优化的导出元素
        const tempElement = createCharacteristicPDFExportElement();
        document.body.appendChild(tempElement);

        // 获取元素的精确尺寸
        const elementWidth = tempElement.offsetWidth;
        const elementHeight = tempElement.offsetHeight;

        // 等待渲染完成
        setTimeout(() => {
            html2canvas(tempElement, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                width: elementWidth,
                height: elementHeight,
                windowWidth: elementWidth,
                windowHeight: elementHeight,
                allowTaint: true,
                removeContainer: true
            }).then(canvas => {
                // 移除临时元素
                document.body.removeChild(tempElement);

                // 创建PDF
                const {jsPDF} = window.jspdf;
                const pdf = new jsPDF('l', 'mm', 'a4'); // 横向A4

                const imgData = canvas.toDataURL('image/jpeg', 1.0);

                // PDF页面尺寸
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();

                // 图片尺寸
                const imgWidth = canvas.width;
                const imgHeight = canvas.height;

                // 计算缩放比例 - 留出边距
                const margin = 10; // 边距
                const contentWidth = pdfWidth - 2 * margin;
                const contentHeight = pdfHeight - 2 * margin;

                const widthRatio = contentWidth / imgWidth;
                const heightRatio = contentHeight / imgHeight;
                const scaleRatio = Math.min(widthRatio, heightRatio);

                // 缩放后的尺寸
                const scaledWidth = imgWidth * scaleRatio;
                const scaledHeight = imgHeight * scaleRatio;

                // 居中显示
                const x = (pdfWidth - scaledWidth) / 2;
                const y = (pdfHeight - scaledHeight) / 2;

                pdf.addImage(imgData, 'JPEG', x, y, scaledWidth, scaledHeight);

                // 保存PDF
                const fileName = `特性清单_${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}.pdf`;
                pdf.save(fileName);

                // 恢复按钮状态
                exportBtn.innerHTML = originalHtml;
                exportBtn.disabled = false;

                // 显示成功消息
                showExportSuccess("特性清单 PDF文件已生成！");

            }).catch(error => {
                // 确保临时元素被移除
                if (tempElement.parentNode) {
                    document.body.removeChild(tempElement);
                }
                console.error('生成PDF失败:', error);
                exportBtn.innerHTML = originalHtml;
                exportBtn.disabled = false;
                alert('生成PDF文件时出错：' + error.message);
            });
        }, 500);

    } catch (error) {
        console.error('导出PDF失败:', error);
        alert('导出PDF文件时出错：' + error.message);
    }
}

// ==================== PDF导出元素创建函数 ====================
// 创建用于PDF导出的优化元素
function createPDFExportElement(type) {
    if (type === 'dfmea') {
        return createDFMEAExportElement();
    } else if (type === 'dvp') {
        return createDVPExportElement();
    }
    return null;
}

// 创建DFMEA导出元素
function createDFMEAExportElement() {
    // 创建临时容器
    const tempContainer = document.createElement('div');
    tempContainer.id = 'pdf-export-container';
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '-9999px';
    tempContainer.style.width = '800px'; // 固定宽度，便于控制
    tempContainer.style.backgroundColor = 'white';
    tempContainer.style.padding = '15px';
    tempContainer.style.boxSizing = 'border-box';
    tempContainer.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    tempContainer.style.display = 'block'; // 使用block布局确保顺序
    tempContainer.style.lineHeight = '1.4';

    // 先创建表头部分
    const headerSection = document.createElement('div');
    headerSection.style.marginBottom = '20px';
    headerSection.style.order = '1';

    // 创建DFMEA表头
    const headerHtml = `
        <div style="text-align: center; margin-bottom: 10px; font-size: 14px; font-weight: bold;">
            DFMEA汇总报告
        </div>
        <div style="display: table; width: 100%; border-collapse: collapse; font-size: 10px;">
            <div style="display: table-row;">
                <div style="display: table-cell; width: 30%; padding: 3px 5px; border: none;">
                    <span style="font-weight: bold;">公司名称：</span>示例公司
                </div>
                <div style="display: table-cell; width: 30%; padding: 3px 5px; border: none;">
                    <span style="font-weight: bold;">项目：</span>手机保护壳DFMEA分析
                </div>
            </div>
            <div style="display: table-row;">
                <div style="display: table-cell; width: 30%; padding: 3px 5px; border: none;">
                    <span style="font-weight: bold;">设计地点：</span>xx研发中心
                </div>
                <div style="display: table-cell; width: 30%; padding: 3px 5px; border: none;">
                    <span style="font-weight: bold;">开始日期：</span>2024-01-15
                </div>
            </div>
            <div style="display: table-row;">
                <div style="display: table-cell; width: 30%; padding: 3px 5px; border: none;">
                    <span style="font-weight: bold;">顾客名称：</span>手机制造商
                </div>
                <div style="display: table-cell; width: 30%; padding: 3px 5px; border: none;">
                    <span style="font-weight: bold;">修订日期：</span>2024-02-28
                </div>
            </div>
            <div style="display: table-row;">
                <div style="display: table-cell; width: 30%; padding: 3px 5px; border: none;">
                    <span style="font-weight: bold;">车型年/平台：</span>
                </div>
                <div style="display: table-cell; width: 30%; padding: 3px 5px; border: none;">
                    <span style="font-weight: bold;">职能小组：</span>产品设计部
                </div>
            </div>
            <div style="display: table-row;">
                <div style="display: table-cell; width: 30%; padding: 3px 5px; border: none;">
                    <span style="font-weight: bold;">系统/子系统/组件/部件：</span>手机保护壳系统
                </div>
                <div style="display: table-cell; width: 30%; padding: 3px 5px; border: none;">
                    <span style="font-weight: bold;">DFMEA编号：</span>DFMEA-2024-001
                </div>
            </div>
            <div style="display: table-row;">
                <div style="display: table-cell; width: 30%; padding: 3px 5px; border: none;">
                    <span style="font-weight: bold;">责任人：</span>张三
                </div>
                <div style="display: table-cell; width: 30%; padding: 3px 5px; border: none;">
                    <span style="font-weight: bold;">保密级别：</span>内部使用
                </div>
            </div>
        </div>
    `;
    headerSection.innerHTML = headerHtml;

    // 创建表格容器
    const tableContainer = document.createElement('div');
    tableContainer.style.order = '2';
    tableContainer.style.overflow = 'visible';
    tableContainer.style.width = '100%';
    tableContainer.style.fontSize = '8px';

    // 创建优化后的表格
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.tableLayout = 'fixed'; // 使用固定布局，便于控制列宽
    table.style.fontSize = '8px';

    // 创建表头
    const thead = document.createElement('thead');

    // 第一行表头（区域标题）
    const regionRow = document.createElement('tr');
    regionRow.innerHTML = `
        <td colspan="4" style="text-align: center; font-weight: bold; padding: 4px; border: 1px solid #333; background-color: #f2f2f2;">
            结构分析
        </td>
        <td colspan="3" style="text-align: center; font-weight: bold; padding: 4px; border: 1px solid #333; background-color: #f2f2f2;">
            功能分析
        </td>
        <td colspan="4" style="text-align: center; font-weight: bold; padding: 4px; border: 1px solid #333; background-color: #f2f2f2;">
            失效分析
        </td>
        <td colspan="6" style="text-align: center; font-weight: bold; padding: 4px; border: 1px solid #333; background-color: #f2f2f2;">
            风险分析
        </td>
        <td colspan="11" style="text-align: center; font-weight: bold; padding: 4px; border: 1px solid #333; background-color: #f2f2f2;">
            优化
        </td>
    `;
    thead.appendChild(regionRow);

    // 第二行表头（列标题）
    const headerRow = document.createElement('tr');

    // 设置列宽 - 根据内容调整
    const columnWidths = [
        '20px',  // 序号列 (很窄)
        '40px',  // 系统
        '40px',  // 子系统
        '50px',  // 零部件
        '60px',  // 上一级功能
        '60px',  // 关注要素功能
        '60px',  // 下一级特性
        '70px',  // 失效影响
        '25px',  // S (评分列，窄)
        '60px',  // 失效模式
        '60px',  // 失效起因
        '70px',  // 预防控制
        '25px',  // O (评分列，窄)
        '70px',  // 探测控制
        '25px',  // D (评分列，窄)
        '25px',  // AP
        '40px',  // 特殊特性
        '70px',  // 建议预防
        '70px',  // 建议探测
        '30px',  // 负责人
        '50px',  // 目标日期
        '50px',  // 措施状态
        '50px',  // 实际日期
        '25px',  // 最终S (评分列，窄)
        '25px',  // 最终O (评分列，窄)
        '25px',  // 最终D (评分列，窄)
        '25px',  // 最终AP
        '60px',  // 备注
    ];

    // 列标题文本
    const columnTitles = [
        '序号', '系统', '子系统', '零部件',
        '上一较高级别要素的功能', '关注要素功能和产品特性', '下一较低级别要素或特性',
        '对于上一较高级别要素和/或最终用户的失效影响（FE）', 'S', '关注要素的失效模式（FM）', '下一较低级别要素的失效起因（FC）',
        '对失效起因的当前预防控制（PC）', 'O', '对失效起因或失效模式的当前探测控制（DC）', 'D', 'AP', '特殊特性',
        '优化预防措施', '优化探测措施', '负责人', '目标完成日期', '措施状态', '实际完成日期', 'S', 'O', 'D', 'AP', '备注'
    ];

    headerRow.innerHTML = columnTitles.map((title, index) => {
        const width = columnWidths[index] || '50px';
        let style = `padding: 3px 2px; border: 1px solid #333; text-align: center; font-weight: bold; background-color: #f2f2f2; width: ${width}; min-width: ${width}; max-width: ${width}; font-size: 7px; line-height: 1.1; word-wrap: break-word;`;

        // 特殊列样式调整
        if (index === 0) style += 'font-weight: bold;';
        if ([8, 12, 14, 15, 24, 25, 26, 27].includes(index)) { // 评分列和AP列
            style += 'font-weight: bold;';
        }

        return `<td style="${style}">${title}</td>`;
    }).join('');

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // 创建数据行
    const tbody = document.createElement('tbody');

    summaryData.forEach(item => {
        const row = document.createElement('tr');

        // 格式化日期
        const targetDateFormatted = item.targetDate ? formatDate(item.targetDate) : '';
        const actualDateFormatted = item.actualDate ? formatDate(item.actualDate) : '';

        // 构建状态指示器
        let statusIndicator = item.status || '';

        // 获取AP颜色
        const apColor = getAPColor(item.ap);
        const finalApColor = getAPColor(item.finalAP);

        const rowData = [
            item.id,
            item.system || '',
            item.subsystem || '',
            item.component || '',
            item.higherLevelFunction || '',
            item.focusFunction || '',
            item.lowerLevelCharacteristic || '',
            item.failureEffect || '',
            item.severity || '',
            item.failureMode || '',
            item.failureCause || '',
            item.preventiveControl || '',
            item.occurrence || '',
            item.detectiveControl || '',
            item.detection || '',
            item.ap || '',
            item.specialCharacteristic || '',
            item.recommendedPreventive || '',
            item.recommendedDetective || '',
            item.responsible || '',
            targetDateFormatted,
            statusIndicator,
            actualDateFormatted,
            item.finalSeverity || '',
            item.finalOccurrence || '',
            item.finalDetection || '',
            item.finalAP || '',
            item.remarks || '',
        ];

        row.innerHTML = rowData.map((cell, index) => {
            const width = columnWidths[index] || '50px';
            let style = `padding: 3px 2px; border: 1px solid #333; width: ${width}; min-width: ${width}; max-width: ${width}; font-size: 7px; line-height: 1.1; word-wrap: break-word;`;

            // 设置对齐方式
            if (index === 0 || [8, 12, 14, 24, 25, 26].includes(index)) { // 序号和评分列居中
                style += 'text-align: center; font-weight: bold;';
            } else if ([15, 27].includes(index)) { // AP列
                style += 'text-align: center; font-weight: bold;';
            } else if ([19, 21, 22].includes(index)) { // 日期列居中
                style += 'text-align: center;';
            } else {
                style += 'text-align: left;';
            }

            // AP列颜色
            if (index === 15 && item.ap) {
                style += `color: ${apColor};`;
            }
            if (index === 27 && item.finalAP) {
                style += `color: ${finalApColor};`;
            }

            return `<td style="${style}">${cell}</td>`;
        }).join('');

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    tableContainer.appendChild(table);

    // 添加到容器中 - 确保表头在上，表格在下
    tempContainer.appendChild(headerSection);
    tempContainer.appendChild(tableContainer);

    return tempContainer;
}

// 创建DVP导出元素
function createDVPExportElement() {
    // 创建临时容器
    const tempContainer = document.createElement('div');
    tempContainer.id = 'dvp-pdf-export-container';
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '-9999px';
    tempContainer.style.width = '800px'; // 固定宽度
    tempContainer.style.backgroundColor = 'white';
    tempContainer.style.padding = '15px';
    tempContainer.style.boxSizing = 'border-box';
    tempContainer.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    tempContainer.style.display = 'block';
    tempContainer.style.lineHeight = '1.4';

    // 创建表头部分
    const headerSection = document.createElement('div');
    headerSection.style.marginBottom = '20px';
    headerSection.style.order = '1';

    // 从DOM获取最新的DVP表头数据
    const headerData = getCurrentDVPHeaderData();
    
    // 创建DVP表头
    const headerHtml = `
        <div style="text-align: center; margin-bottom: 10px; font-size: 14px; font-weight: bold;">
            设计验证计划(DVP)
        </div>
        <div style="display: table; width: 100%; border-collapse: collapse; font-size: 10px;">
            <div style="display: table-row;">
                <div style="display: table-cell; width: 30%; padding: 3px 5px; border: none;">
                    <span style="font-weight: bold;">公司名称：</span>${headerData['公司名称'] || '示例公司'}
                </div>
                <div style="display: table-cell; width: 30%; padding: 3px 5px; border: none;">
                    <span style="font-weight: bold;">项目：</span>${headerData['项目'] || '手机保护壳DVP&R'}
                </div>
            </div>
            <div style="display: table-row;">
                <div style="display: table-cell; width: 30%; padding: 3px 5px; border: none;">
                    <span style="font-weight: bold;">设计地点：</span>${headerData['设计地点'] || 'xx研发中心'}
                </div>
                <div style="display: table-cell; width: 30%; padding: 3px 5px; border: none;">
                    <span style="font-weight: bold;">开始日期：</span>${headerData['开始日期'] || '2024-01-15'}
                </div>
            </div>
            <div style="display: table-row;">
                <div style="display: table-cell; width: 30%; padding: 3px 5px; border: none;">
                    <span style="font-weight: bold;">顾客名称：</span>${headerData['顾客名称'] || '手机制造商'}
                </div>
                <div style="display: table-cell; width: 30%; padding: 3px 5px; border: none;">
                    <span style="font-weight: bold;">修订日期：</span>${headerData['修订日期'] || '2024-02-28'}
                </div>
            </div>
            <div style="display: table-row;">
                <div style="display: table-cell; width: 30%; padding: 3px 5px; border: none;">
                    <span style="font-weight: bold;">车型年/平台：</span>${headerData['车型年/平台'] || ''}
                </div>
                <div style="display: table-cell; width: 30%; padding: 3px 5px; border: none;">
                    <span style="font-weight: bold;">职能小组：</span>${headerData['职能小组'] || '测试验证部'}
                </div>
            </div>
            <div style="display: table-row;">
                <div style="display: table-cell; width: 30%; padding: 3px 5px; border: none;">
                    <span style="font-weight: bold;">系统/子系统/组件/部件：</span>${headerData['系统/子系统/组件/部件'] || '手机保护壳系统'}
                </div>
                <div style="display: table-cell; width: 30%; padding: 3px 5px; border: none;">
                    <span style="font-weight: bold;">DVP编号：</span>${headerData['DVP编号'] || 'DVP-2024-001'}
                </div>
            </div>
            <div style="display: table-row;">
                <div style="display: table-cell; width: 30%; padding: 3px 5px; border: none;">
                    <span style="font-weight: bold;">责任人：</span>${headerData['责任人'] || '测试工程师'}
                </div>
                <div style="display: table-cell; width: 30%; padding: 3px 5px; border: none;">
                    <span style="font-weight: bold;">保密级别：</span>${headerData['保密级别'] || '内部使用'}
                </div>
            </div>
        </div>
    `;
    headerSection.innerHTML = headerHtml;

    // 创建表格容器
    const tableContainer = document.createElement('div');
    tableContainer.style.order = '2';
    tableContainer.style.overflow = 'visible';
    tableContainer.style.width = '100%';
    tableContainer.style.fontSize = '9px';

    // 创建表格
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.tableLayout = 'fixed';
    table.style.fontSize = '9px';

    // 表头
    const thead = document.createElement('thead');
    
    // 第一行表头：区域标题
    const regionRow = document.createElement('tr');
    regionRow.innerHTML = `
        <td colspan="5" style="text-align: center; font-weight: bold; padding: 4px; border: 1px solid #333; background-color: #f2f2f2;">
            试验信息
        </td>
        <td colspan="6" style="text-align: center; font-weight: bold; padding: 4px; border: 1px solid #333; background-color: #f2f2f2;">
            计划安排
        </td>
    `;
    thead.appendChild(regionRow);
    
    // 第二行表头：列标题
    const headerRow = document.createElement('tr');

    // 列宽设置 - 优化列宽分布
    const columnWidths = [
        '25px',   // 序号
        '70px',   // 试验项目
        '90px',   // 试验名称
        '90px',   // 试验方法
        '90px',   // 目标要求
        '60px',   // 实验类型
        '50px',   // 样品数量
        '65px',   // 计划开始日期
        '65px',   // 试验状态
        '70px',   // 实验报告
        '65px'    // 实际完成日期
    ];

    const columnTitles = [
        '序号', '试验项目', '试验名称', '试验方法', '目标要求',
        '实验类型', '样品数量', '计划开始日期', '试验状态', '实验报告', '实际完成日期'
    ];

    headerRow.innerHTML = columnTitles.map((title, index) => {
        const width = columnWidths[index];
        const style = `padding: 4px 3px; border: 1px solid #333; text-align: center; font-weight: bold; background-color: #f2f2f2; width: ${width}; min-width: ${width}; max-width: ${width}; font-size: 8px; line-height: 1.2;`;
        return `<td style="${style}">${title}</td>`;
    }).join('');

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // 数据行
    const tbody = document.createElement('tbody');
    const currentDVPData = getCurrentDVPDataFromDOM();
    
    currentDVPData.forEach(item => {
        const row = document.createElement('tr');
        
        // 格式化日期
        const planStartDateFormatted = item.planStartDate ? formatDate(item.PlanStartDate) : '';
        const actualFinishDateFormatted = item.actualFinishDate ? formatDate(item.actualFinishDate) : '';

        const rowData = [
            item.id,
            item.testItem || '',
            item.testName || '',
            item.testMethod || '',
            item.targetRequirement || '',
            item.testType || '',
            item.sampleQuantity || '',
            planStartDateFormatted,
            item.testStatus || '',
            item.testReport || '',
            actualFinishDateFormatted || ''
        ];

        row.innerHTML = rowData.map((cell, index) => {
            const width = columnWidths[index];
            let style = `padding: 3px 2px; border: 1px solid #333; width: ${width}; min-width: ${width}; max-width: ${width}; font-size: 8px; line-height: 1.2;`;

            // 设置对齐方式
            if (index === 0 || index === 6 || index === 7 || index === 9 || index === 10) {
                // 序号、样品数量、日期列居中
                style += 'text-align: center;';
            } else if (index === 8) {
                // 试验状态列居中加粗
                style += 'text-align: center; font-weight: bold;';
            } else {
                style += 'text-align: left;';
            }

            return `<td style="${style}">${cell}</td>`;
        }).join('');

        tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    tableContainer.appendChild(table);

    // 添加到容器中
    tempContainer.appendChild(headerSection);
    tempContainer.appendChild(tableContainer);

    return tempContainer;
}

// 创建特性清单PDF导出元素
function createCharacteristicPDFExportElement() {
    // 创建临时容器
    const tempContainer = document.createElement('div');
    tempContainer.id = 'characteristic-pdf-export-container';
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '-9999px';
    tempContainer.style.width = '800px';
    tempContainer.style.backgroundColor = 'white';
    tempContainer.style.padding = '15px';
    tempContainer.style.boxSizing = 'border-box';
    tempContainer.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    tempContainer.style.display = 'block';
    tempContainer.style.lineHeight = '1.4';

    // 创建表头部分
    const headerSection = document.createElement('div');
    headerSection.style.marginBottom = '20px';
    headerSection.style.order = '1';

    const headerHtml = `
        <div style="text-align: center; margin-bottom: 10px; font-size: 14px; font-weight: bold;">
            特性清单
        </div>
        <div style="display: table; width: 100%; border-collapse: collapse; font-size: 10px;">
            <div style="display: table-row;">
                <div style="display: table-cell; width: 30%; padding: 3px 5px; border: none;">
                    <span style="font-weight: bold;">公司名称：</span>示例公司
                </div>
                <div style="display: table-cell; width: 30%; padding: 3px 5px; border: none;">
                    <span style="font-weight: bold;">项目：</span>手机保护壳特性清单
                </div>
            </div>
            <div style="display: table-row;">
                <div style="display: table-cell; width: 30%; padding: 3px 5px; border: none;">
                    <span style="font-weight: bold;">设计地点：</span>xx研发中心
                </div>
                <div style="display: table-cell; width: 30%; padding: 3px 5px; border: none;">
                    <span style="font-weight: bold;">更新日期：</span>${new Date().toLocaleDateString()}
                </div>
            </div>
        </div>
    `;
    headerSection.innerHTML = headerHtml;

    // 创建表格容器
    const tableContainer = document.createElement('div');
    tableContainer.style.order = '2';
    tableContainer.style.overflow = 'visible';
    tableContainer.style.width = '100%';
    tableContainer.style.fontSize = '9px';

    // 创建表格
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.tableLayout = 'fixed';
    table.style.fontSize = '9px';

    // 表头
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    // 列宽设置
    const columnWidths = [
        '25px',   // 序号
        '80px',   // 零件名称
        '80px',   // 特性编号
        '120px',  // 特性描述
        '70px',   // 特性分类
        '80px',   // 所属子系统
        '80px',   // 所属系统
        '100px'   // 备注
    ];

    const columnTitles = [
        '序号', '零件名称', '特性编号', '特性描述',
        '特性分类', '所属子系统', '所属系统', '备注'
    ];

    headerRow.innerHTML = columnTitles.map((title, index) => {
        const width = columnWidths[index];
        const style = `padding: 4px 3px; border: 1px solid #333; text-align: center; font-weight: bold; background-color: #f2f2f2; width: ${width}; min-width: ${width}; max-width: ${width}; font-size: 8px; line-height: 1.2;`;
        return `<td style="${style}">${title}</td>`;
    }).join('');

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // 数据行
    const tbody = document.createElement('tbody');

    characteristicListData.forEach(item => {
        const row = document.createElement('tr');

        const rowData = [
            item.id,
            item.component || '',
            item.charNum || '',
            item.description || '',
            item.classification || '',
            item.subsystem || '',
            item.system || '',
            item.remarks || ''
        ];

        row.innerHTML = rowData.map((cell, index) => {
            const width = columnWidths[index];
            let style = `padding: 3px 2px; border: 1px solid #333; width: ${width}; min-width: ${width}; max-width: ${width}; font-size: 8px; line-height: 1.2;`;

            // 设置对齐方式
            if (index === 0 || index === 2 || index === 4) {
                style += 'text-align: center;';
            } else {
                style += 'text-align: left;';
            }

            // 特性分类单元格特殊样式 - 只加粗
            if (index === 4) {
                style += 'font-weight: bold;';
            }

            return `<td style="${style}">${cell}</td>`;
        }).join('');

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    tableContainer.appendChild(table);

    // 添加到容器中
    tempContainer.appendChild(headerSection);
    tempContainer.appendChild(tableContainer);

    return tempContainer;
}

// ==================== 工具函数 ====================
// 显示导出成功消息
function showExportSuccess(message) {
    // 在实际使用中，这里可以添加toast提示
    console.log('导出成功:', message);
}

// ==================== 全局导出函数 ====================
// 全局导出函数
window.fmeaExportFunctions = {
    exportDFMEAExcel: function() {
        exportToExcel();
    },
    exportDFMEAPDF: function() {
        exportToPDF();
    },
    exportDVPExcel: function() {
        // 切换到 DVP 视图
        switchView('dvp');
        // 等待视图切换完成
        setTimeout(() => {
            exportDVPExcel();
        }, 300);
    },
    exportDVPPDF: function() {
        // 切换到 DVP 视图
        switchView('dvp');
        // 等待视图切换完成
        setTimeout(() => {
            exportDVPPDF();
        }, 300);
    },
    exportCharacteristicExcel: function() {
        // 切换到特性清单视图
        switchView('characteristic');
        // 等待视图切换完成
        setTimeout(() => {
            exportCharacteristicExcel();
        }, 300);
    },
    exportCharacteristicPDF: function() {
        // 切换到特性清单视图
        switchView('characteristic');
        // 等待视图切换完成
        setTimeout(() => {
            exportCharacteristicPDF();
        }, 300);
    },
    // 设置项目数据
    setProjectData: function(projectData) {
        // 设置DFMEA页眉信息
        if (projectData.fmeaName) {
            document.getElementById('project-name').textContent = projectData.fmeaName;
        }
        if (projectData.fmeaCode) {
            document.getElementById('dfmea-code').textContent = projectData.fmeaCode;
        }
        if (projectData.responsiblePerson) {
            document.getElementById('responsible-person').textContent = projectData.responsiblePerson;
        }

        // 设置DVP页眉信息
        if (projectData.fmeaName) {
            document.getElementById('dvp-project-name').textContent = projectData.fmeaName + " DVP&R";
        }
        if (projectData.fmeaCode) {
            document.getElementById('dvp-id').textContent = "DVP-" + projectData.fmeaCode;
        }
        if (projectData.responsiblePerson) {
            document.getElementById('dvp-responsible-person').textContent = projectData.responsiblePerson;
        }

        return true;
    }
};

// 自动切换到DFMEA视图
setTimeout(() => {
    switchView('dfmea');
}, 100);

// 确保全局变量可访问
window.getDVPStatusClass = getDVPStatusClass;
window.formatDate = formatDate;
window.dvpData = dvpData;