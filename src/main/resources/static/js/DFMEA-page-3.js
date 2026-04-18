// DFMEA-page-3.js

// 从URL获取项目编号
function getProjectCodeFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('code');
}

// 全局变量
let isEditing = false;
let originalFormData = {};
let currentProjectCode = null;
let currentProjectId = null;

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    // 获取项目编号
    currentProjectCode = getProjectCodeFromUrl();

    // 如果有项目编号，从后端加载数据
    if (currentProjectCode) {
        loadProjectDataFromBackend(currentProjectCode);
    } else {
        initializeFormData();
    }

    // 设置表单禁用状态
    disableForm();

    // 设置事件监听器
    setupEventListeners();

    // 初始化按钮状态
    updateButtonStates();

    showMessage('欢迎使用DFMEA策划与准备系统', 'info');
});

// 从后端加载项目数据
function loadProjectDataFromBackend(projectCode) {
    fetch(`http://localhost:8088/project/code/${projectCode}`)
        .then(response => response.json())
        .then(result => {
            if (result.code === 200 && result.data) {
                const project = result.data;
                currentProjectId = project.fmeaId;
                fillFormWithProjectData(project);
                loadPageDataFromBackend(projectCode);
            } else {
                setDefaultFormData();
                showMessage('未找到项目数据，使用默认值', 'warning');
            }
        })
        .catch(error => {
            console.error('请求后端失败:', error);
            setDefaultFormData();
            showMessage('加载项目数据失败，使用默认值', 'error');
        });
}

// 从后端加载页面3的保存数据
function loadPageDataFromBackend(projectCode) {
    fetch(`http://localhost:8088/project/detail/${projectCode}/3`)
        .then(response => response.json())
        .then(result => {
            if (result.code === 200 && result.data) {
                const pageData = result.data;
                fillFormWithPageData(pageData);
                showMessage('已加载该项目的策划数据', 'info');
            } else {
                setDefaultPlanningData();
            }
        })
        .catch(error => {
            console.error('加载页面数据失败:', error);
            setDefaultPlanningData();
        });
}

// 填充表单数据（来自tb_project）
function fillFormWithProjectData(project) {
    document.getElementById('fmea-code').value = project.fmeaCode || '';
    document.getElementById('fmea-name').value = project.fmeaName || '';
    document.getElementById('project-name').value = project.fmeaName || '';
    document.getElementById('responsible-person').value = project.responsiblePerson || '';
    if (project.planStartDate) {
        document.getElementById('plan-start-date').value = project.planStartDate;
    }
}

// 填充表单数据（来自tb_project_detail）
function fillFormWithPageData(pageData) {
    if (pageData.companyName) {
        document.getElementById('company-name').value = pageData.companyName;
    }
    if (pageData.endDate) {
        document.getElementById('end-date').value = pageData.endDate;
    }
    if (pageData.coordinator) {
        document.getElementById('coordinator').value = pageData.coordinator;
    }
    if (pageData.confidentialityLevel) {
        document.getElementById('confidentiality-level').value = pageData.confidentialityLevel;
    }
    if (pageData.coreTeam) {
        document.getElementById('core-team').value = pageData.coreTeam;
    }
    if (pageData.extendedTeam) {
        document.getElementById('extended-team').value = pageData.extendedTeam;
    }
    if (pageData.customer) {
        document.getElementById('customer').value = pageData.customer;
    }
    if (pageData.customerRequirements) {
        document.getElementById('customer-requirements').value = pageData.customerRequirements;
    }
    if (pageData.projectAttachments) {
        document.getElementById('project-attachments').value = pageData.projectAttachments;
    }
    if (pageData.phoneNumber) {
        document.getElementById('phone-number').value = pageData.phoneNumber;
    }
    if (pageData.notes) {
        document.getElementById('notes').value = pageData.notes;
    }
}

// 初始化表单数据
function initializeFormData() {
    let projectCode = getProjectCodeFromUrl();

    if (!projectCode && window.parent) {
        try {
            const parentUrlParams = new URLSearchParams(window.parent.location.search);
            projectCode = parentUrlParams.get('code');
        } catch (e) {
            console.log('无法访问父页面URL', e);
        }
    }

    if (!projectCode) {
        showMessage('无法获取项目编号', 'error');
        setDefaultFormData();
        return;
    }

    fetch(`http://localhost:8088/project/detail/${projectCode}/3`)
        .then(response => response.json())
        .then(data => {
            if (data.code === 200 && data.data) {
                const formData = data.data;
                Object.keys(formData).forEach(key => {
                    const element = document.getElementById(key);
                    if (element) {
                        element.value = formData[key];
                    }
                });
                showMessage('已加载项目数据', 'info');
            } else {
                setDefaultFormData();
            }
        })
        .catch(error => {
            console.error('加载数据失败:', error);
            setDefaultFormData();
        });
}

// 设置默认策划数据
function setDefaultPlanningData() {
    const today = new Date();
    const oneYearLater = new Date();
    oneYearLater.setFullYear(today.getFullYear() + 1);

    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    if (!document.getElementById('end-date').value) {
        document.getElementById('end-date').value = formatDate(oneYearLater);
    }
    if (!document.getElementById('coordinator').value) {
        document.getElementById('coordinator').value = '李四';
    }
    if (!document.getElementById('confidentiality-level').value) {
        document.getElementById('confidentiality-level').value = '内部用途';
    }
    if (!document.getElementById('core-team').value) {
        document.getElementById('core-team').value = '产品设计部,质量保证部';
    }
    if (!document.getElementById('extended-team').value) {
        document.getElementById('extended-team').value = '生产部,采购部,测试部';
    }
    if (!document.getElementById('customer').value) {
        document.getElementById('customer').value = '手机制造商';
    }
    if (!document.getElementById('phone-number').value) {
        document.getElementById('phone-number').value = '13800138000';
    }
    if (!document.getElementById('notes').value) {
        document.getElementById('notes').value = '手机保护壳设计阶段的DFMEA分析';
    }
}

// 设置默认表单数据
function setDefaultFormData() {
    const today = new Date();
    const oneYearLater = new Date();
    oneYearLater.setFullYear(today.getFullYear() + 1);

    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    document.getElementById('fmea-code').value = `DF-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}-001`;
    document.getElementById('fmea-name').value = '手机保护壳DFMEA分析';
    document.getElementById('project-name').value = '手机保护壳项目';
    document.getElementById('responsible-person').value = '张三';
    document.getElementById('company-name').value = '示例公司';
    document.getElementById('plan-start-date').value = formatDate(today);
    document.getElementById('end-date').value = formatDate(oneYearLater);
    document.getElementById('coordinator').value = '李四';
    document.getElementById('confidentiality-level').value = '内部用途';
    document.getElementById('core-team').value = '产品设计部,质量保证部';
    document.getElementById('extended-team').value = '生产部,采购部,测试部';
    document.getElementById('customer').value = '手机制造商';
    document.getElementById('phone-number').value = '13800138000';
    document.getElementById('notes').value = '手机保护壳设计阶段的DFMEA分析';
}

// 编辑表单函数
function editForm() {
    if (isEditing) {
        showMessage('当前已处于编辑模式', 'info');
        return;
    }

    saveOriginalFormData();
    enableForm();
    isEditing = true;
    showMessage('已进入编辑模式，现在可以修改表单内容', 'success');
    updateButtonStates();
}

// 保存表单函数
function saveForm() {
    if (!isEditing) {
        showMessage('请先进入编辑模式', 'warning');
        return;
    }

    if (!validateForm()) {
        return;
    }

    let projectCode = getProjectCodeFromUrl();

    if (!projectCode && window.parent) {
        try {
            const parentUrlParams = new URLSearchParams(window.parent.location.search);
            projectCode = parentUrlParams.get('code');
        } catch (e) {
            console.log('无法访问父页面URL', e);
        }
    }

    if (!projectCode) {
        showMessage('无法获取项目编号，保存失败', 'error');
        return;
    }

    const formData = collectFormData();

    fetch(`http://localhost:8088/project/detail/save`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            fmeaCode: projectCode,
            pageType: 3,
            content: formData
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.code === 200) {
                disableForm();
                isEditing = false;
                showMessage('表单数据已成功保存', 'success');
                updateButtonStates();
            } else {
                showMessage('保存失败：' + (data.message || '未知错误'), 'error');
            }
        })
        .catch(error => {
            console.error('保存失败:', error);
            showMessage('保存失败，请检查网络连接', 'error');
        });
}

// 收集表单数据
function collectFormData() {
    const formData = {};
    const inputElements = document.querySelectorAll('.page-header input, .page-header select');
    inputElements.forEach(element => {
        if (element.id) {
            formData[element.id] = element.value;
        }
    });
    return formData;
}

// 保存原始表单数据
function saveOriginalFormData() {
    originalFormData = collectFormData();
}

// 验证表单
function validateForm() {
    const requiredFields = [
        'fmea-code',
        'fmea-name',
        'project-name',
        'responsible-person',
        'company-name',
        'plan-start-date',
        'end-date'
    ];

    for (const fieldId of requiredFields) {
        const element = document.getElementById(fieldId);
        if (!element.value.trim()) {
            element.focus();
            element.style.borderColor = '#f53f3f';

            const fieldName = element.previousElementSibling?.textContent.replace('：', '') || fieldId;
            showMessage(`请填写"${fieldName}"字段`, 'error');

            setTimeout(() => {
                element.style.borderColor = '#dcdfe6';
            }, 3000);

            return false;
        }
    }

    const startDate = new Date(document.getElementById('plan-start-date').value);
    const endDate = new Date(document.getElementById('end-date').value);

    if (endDate < startDate) {
        const endDateInput = document.getElementById('end-date');
        endDateInput.focus();
        endDateInput.style.borderColor = '#f53f3f';
        showMessage('结束日期不能早于开始日期', 'error');

        setTimeout(() => {
            endDateInput.style.borderColor = '#dcdfe6';
        }, 3000);

        return false;
    }

    return true;
}

// 启用表单（但FMEA编号保持禁用）
function enableForm() {
    const inputs = document.querySelectorAll('.page-header input, .page-header select');
    inputs.forEach(input => {
        // FMEA编号始终禁用
        if (input.id === 'fmea-code') {
            input.disabled = true;
        } else {
            input.disabled = false;
            input.classList.add('editing');
        }
    });
}

// 禁用表单
function disableForm() {
    const inputs = document.querySelectorAll('.page-header input, .page-header select');
    inputs.forEach(input => {
        input.disabled = true;
        input.classList.remove('editing');
    });
}

// 更新按钮状态
function updateButtonStates() {
    const editBtn = document.querySelector('.action-btn.primary');
    const saveBtn = document.querySelector('.action-btn.secondary');

    if (isEditing) {
        editBtn.innerHTML = '<i class="fas fa-edit"></i> 编辑中...';
        editBtn.style.backgroundColor = '#ff7d00';
        saveBtn.disabled = false;
    } else {
        editBtn.innerHTML = '<i class="fas fa-edit"></i> 编辑';
        editBtn.style.backgroundColor = '#165DFF';
        saveBtn.disabled = true;
    }
}

// 显示消息
function showMessage(message, type = 'info') {
    let container = document.querySelector('.message-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'message-container';
        document.body.appendChild(container);
    }

    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.dataset.id = Date.now();

    let icon = '';
    switch (type) {
        case 'success':
            icon = 'fas fa-check-circle';
            break;
        case 'error':
            icon = 'fas fa-exclamation-circle';
            break;
        case 'info':
            icon = 'fas fa-info-circle';
            break;
        case 'warning':
            icon = 'fas fa-exclamation-triangle';
            break;
    }

    messageElement.innerHTML = `
        <i class="${icon} icon"></i>
        <span class="content">${message}</span>
        <button class="close-btn" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    container.appendChild(messageElement);

    setTimeout(() => {
        messageElement.classList.add('show');
    }, 10);

    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.remove();
        }
    }, 3000);
}

// 设置事件监听器
function setupEventListeners() {
    const startDateInput = document.getElementById('plan-start-date');
    const endDateInput = document.getElementById('end-date');

    startDateInput.addEventListener('change', function() {
        endDateInput.min = this.value;
    });

    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'e') {
            e.preventDefault();
            editForm();
        }
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            saveForm();
        }
    });
}