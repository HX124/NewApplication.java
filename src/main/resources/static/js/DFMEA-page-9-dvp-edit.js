// 全局变量
let isDVPEditing = false;
let originalDVPData = [];

function formatDate(dateString) {
    if (!dateString) return '';
    // 将YYYY-MM-DD转换为YYYY.MM.DD
    return dateString.replace(/-/g, '.');
}

// DVP编辑模式切换函数
function toggleDVPEditMode() {
    const editBtn = document.getElementById('dvp-edit-btn');
    const dvpTable = document.getElementById('dvp-table');
    const dvpTableBody = document.getElementById('dvp-table-body');
    const dvpHeader = document.getElementById('dvp-header');
    
    if (!isDVPEditing) {
        // 进入编辑模式
        saveOriginalDVPData();
        
        // 启用DVP表头编辑
        enableDVPHeaderEdit(dvpHeader);
        
        // 启用DVP表格内容编辑
        enableDVPTableEdit(dvpTable, dvpTableBody);
        
        // 更新按钮状态
        editBtn.innerHTML = '<i class="fas fa-save"></i> 保存';
        editBtn.classList.add('active');
        isDVPEditing = true;
        
        // 更新导出按钮状态
        updateExportButtonsState(true);
        
        // 显示编辑提示
        showDVPEditMessage('DVP表格已进入编辑模式', 'info');
        
    } else {
        // 退出编辑模式，保存数据
        saveDVPData();
        
        // 禁用DVP表头编辑
        disableDVPHeaderEdit(dvpHeader);
        
        // 禁用DVP表格内容编辑
        disableDVPTableEdit(dvpTable, dvpTableBody);
        
        // 更新按钮状态
        editBtn.innerHTML = '<i class="fas fa-edit"></i> 编辑';
        editBtn.classList.remove('active');
        isDVPEditing = false;
        
        // 更新导出按钮状态
        updateExportButtonsState(false);
        
        // 显示保存成功提示
        showDVPEditMessage('DVP表格数据已保存', 'success');
    }
}

// 保存原始DVP数据
function saveOriginalDVPData() {
    originalDVPData = [];
    const dvpTableBody = document.getElementById('dvp-table-body');
    const rows = dvpTableBody.querySelectorAll('tr');
    
    rows.forEach((row, rowIndex) => {
        const rowData = {};
        const cells = row.querySelectorAll('td');
        
        cells.forEach((cell, cellIndex) => {
            const header = document.querySelector(`#dvp-table thead th:nth-child(${cellIndex + 1})`);
            const columnName = header ? header.textContent : `col_${cellIndex}`;
            
            if (cellIndex === 0) {
                // 序号列
                rowData[columnName] = cell.textContent;
            } else if (cellIndex === 8) {
                // 试验状态列
                const statusSpan = cell.querySelector('.status-indicator');
                rowData[columnName] = statusSpan ? statusSpan.textContent : cell.textContent;
            } else {
                rowData[columnName] = cell.textContent;
            }
        });
        
        originalDVPData.push(rowData);
    });
}

// 启用DVP表头编辑 - 正确的写法
function enableDVPHeaderEdit(dvpHeader) {
    const headerItems = dvpHeader.querySelectorAll('.header-item');
    
    headerItems.forEach(headerItem => {
        const span = headerItem.querySelector('span');
        if (!span) return;
        
        const originalValue = span.textContent;
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'modal-input';
        input.value = originalValue;
        
        // 替换span为input
        span.parentNode.replaceChild(input, span);
    });
}

// 启用DVP表格内容编辑
function enableDVPTableEdit(dvpTable, dvpTableBody) {
    // 给表格添加编辑类
    dvpTable.classList.add('editable');
    
    const rows = dvpTableBody.querySelectorAll('tr');
    
    rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll('td');
        
        cells.forEach((cell, cellIndex) => {
            if (cellIndex === 0) {
                // 序号列 - 只读
                cell.classList.add('readonly-cell');
                return;
            }
            
            const originalValue = cell.textContent.trim();
            
            if (cellIndex === 7 || cellIndex === 10) {
                // 计划开始日期列和实际完成日期列 - 使用日期输入
                createDateInput(cell, originalValue);
            } else if (cellIndex === 8) {
                // 试验状态列 - 使用下拉选择
                createStatusSelect(cell, originalValue);
            } else if (cellIndex === 9) {
                // 实验报告列 - 普通文本输入
                createTextInput(cell, originalValue);
            } else {
                // 其他列 - 普通文本输入
                createTextInput(cell, originalValue);
            }
            
            cell.classList.add('editable-cell');
        });
    });
}

// 创建文本输入框
function createTextInput(cell, value) {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = value;
    input.className = 'modal-input';
    
    cell.innerHTML = '';
    cell.appendChild(input);
}

// 创建日期输入框
function createDateInput(cell, value) {
    const input = document.createElement('input');
    input.type = 'date';
    
    // 将 YYYY.MM.DD 转换为 YYYY-MM-DD
    if (value) {
        // 先去除可能的空格
        const trimmedValue = value.trim();
        if (trimmedValue.includes('.')) {
            input.value = trimmedValue.replace(/\./g, '-');
        } else if (trimmedValue.includes('-')) {
            input.value = trimmedValue; // 已经是YYYY-MM-DD格式
        } else if (trimmedValue !== '') {
            // 尝试解析其他格式
            try {
                const date = new Date(trimmedValue);
                if (!isNaN(date.getTime())) {
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    input.value = `${year}-${month}-${day}`;
                }
            } catch (e) {
                input.value = ''; // 解析失败，设为空
            }
        } else {
            input.value = ''; // 空字符串
        }
    } else {
        input.value = ''; // undefined或null
    }
    
    input.className = 'date-input';
    
    cell.innerHTML = '';
    cell.appendChild(input);
}

// 创建状态选择下拉框
function createStatusSelect(cell, value) {
    const select = document.createElement('select');
    select.className = 'status-select';
    
    // 状态选项
    const statusOptions = [
        '已完成',
        '进行中',
        '尚未开始',
        '计划中',
        '已取消'
    ];
    
    statusOptions.forEach(optionText => {
        const option = document.createElement('option');
        option.value = optionText;
        option.textContent = optionText;
        if (optionText === value) {
            option.selected = true;
        }
        select.appendChild(option);
    });
    
    cell.innerHTML = '';
    cell.appendChild(select);
}

// 保存DVP数据
// 简化版的saveDVPData函数
function saveDVPData() {
    const dvpTable = document.getElementById('dvp-table');
    const dvpTableBody = document.getElementById('dvp-table-body');
    
    // 保存表头数据
    saveDVPHeaderDataToGlobal();
    
    // 直接遍历并更新，但使用临时变量存储输入框值
    const rows = dvpTableBody.querySelectorAll('tr');
    
    rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll('td');
        const inputValues = []; // 临时存储每列的值
        
        // 第一步：先收集所有输入框的值
        cells.forEach((cell, cellIndex) => {
            if (cellIndex === 0) return;
            
            let value = '';
            if (cellIndex === 7 || cellIndex === 10) {
                // 日期输入框
                const input = cell.querySelector('input[type="date"]');
                value = input ? input.value : '';
            } else if (cellIndex === 8) {
                // 状态选择框
                const select = cell.querySelector('select');
                value = select ? select.value : '';
            } else {
                // 文本输入框
                const input = cell.querySelector('input[type="text"]');
                value = input ? input.value : '';
            }
            
            inputValues[cellIndex] = value;
        });
        
        // 第二步：用收集的值更新显示和全局数据
        cells.forEach((cell, cellIndex) => {
            if (cellIndex === 0) return;
            
            const value = inputValues[cellIndex] || '';
            
            // 更新显示
            updateCellDisplay(cell, cellIndex, value);
            
            // 更新全局数据
            if (window.dvpData && window.dvpData[rowIndex]) {
                updateDVPDataField(rowIndex, cellIndex, value);
            }
        });
    });
    
    dvpTable.classList.remove('editable');
}

// 保存DVP表头数据到全局变量
function saveDVPHeaderDataToGlobal() {
    const dvpHeader = document.getElementById('dvp-header');
    if (!dvpHeader) return;
    
    const headerItems = dvpHeader.querySelectorAll('.header-item');
    
    headerItems.forEach(headerItem => {
        const input = headerItem.querySelector('input.modal-input');
        if (input) {
            const value = input.value.trim();
            
            // 恢复为span显示
            const span = document.createElement('span');
            span.textContent = value;
            input.parentNode.replaceChild(span, input);
        }
    });
    
    // 重新从DOM获取最新的表头数据
    const newHeaderData = {};
    const updatedHeaderItems = dvpHeader.querySelectorAll('.header-item');
    
    updatedHeaderItems.forEach(item => {
        const span = item.querySelector('span');
        if (span) {
            const text = span.textContent;
            const parts = text.split('：');
            if (parts.length === 2) {
                const key = parts[0].trim();
                const value = parts[1].trim();
                newHeaderData[key] = value;
            }
        }
    });
    
    // 更新全局变量
    if (window.dvpHeaderData) {
        // 合并数据，确保所有字段都被更新
        Object.keys(newHeaderData).forEach(key => {
            window.dvpHeaderData[key] = newHeaderData[key];
        });
    } else {
        window.dvpHeaderData = newHeaderData;
    }
}

// 更新单元格显示
function updateCellDisplay(cell, cellIndex, value) {
    cell.innerHTML = '';
    cell.classList.remove('editable-cell');
    
    if (cellIndex === 8) {
        // 试验状态列 - 显示状态指示器
        const statusClass = getDVPStatusClass(value);
        const statusIndicator = `<span class="status-indicator status-${statusClass}">${value}</span>`;
        cell.innerHTML = statusIndicator;
        cell.style.textAlign = 'center';
    } else if (cellIndex === 7 || cellIndex === 10) {
        // 日期列 - 格式化显示 (计划开始日期和实际完成日期)
        const formattedDate = value ? formatDate(value) : '';
        cell.textContent = formattedDate;
        cell.style.textAlign = 'center';
    } else if (cellIndex === 6 || cellIndex === 9) {
        // 样品数量和实验报告列居中
        cell.textContent = value;
        cell.style.textAlign = 'center';
    } else {
        // 普通文本列左对齐
        cell.textContent = value;
        cell.style.textAlign = 'left';
    }
}

// 更新DVP数据数组
function updateDVPDataField(rowIndex, cellIndex, value) {
    const item = window.dvpData[rowIndex];
    if (!item) return;
    
    switch(cellIndex) {
        case 1: item.testItem = value; break;
        case 2: item.testName = value; break;
        case 3: item.testMethod = value; break;
        case 4: item.targetRequirement = value; break;
        case 5: item.testType = value; break;
        case 6: item.sampleQuantity = value; break;
        case 7: item.planStartDate = value; break;
        case 8: item.testStatus = value; break;
        case 9: item.testReport = value; break;
        case 10: item.actualFinishDate = value; break; // 新增
    }
}

// 更新导出按钮状态
function updateExportButtonsState(isEditing) {
    const excelBtn = document.querySelector('.action-btn.primary');
    const pdfBtn = document.querySelector('.action-btn.secondary');
    
    if (excelBtn && pdfBtn) {
        if (isEditing) {
            // 编辑状态下禁用导出按钮
            excelBtn.disabled = true;
            pdfBtn.disabled = true;
            excelBtn.style.opacity = '0.5';
            pdfBtn.style.opacity = '0.5';
            excelBtn.style.cursor = 'not-allowed';
            pdfBtn.style.cursor = 'not-allowed';
            excelBtn.title = '请先保存DVP修改后才能导出';
            pdfBtn.title = '请先保存DVP修改后才能导出';
        } else {
            // 非编辑状态下启用导出按钮
            excelBtn.disabled = false;
            pdfBtn.disabled = false;
            excelBtn.style.opacity = '1';
            pdfBtn.style.opacity = '1';
            excelBtn.style.cursor = 'pointer';
            pdfBtn.style.cursor = 'pointer';
            excelBtn.title = '导出Excel';
            pdfBtn.title = '导出PDF';
        }
    }
}

// 禁用DVP表头编辑
function disableDVPHeaderEdit(dvpHeader) {
    // 已经在保存时处理了
}

// 禁用DVP表格内容编辑
function disableDVPTableEdit(dvpTable, dvpTableBody) {
    dvpTable.classList.remove('editable');
    
    const rows = dvpTableBody.querySelectorAll('tr');
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        cells.forEach(cell => {
            cell.classList.remove('editable-cell');
        });
    });
}

// 显示DVP编辑相关消息
function showDVPEditMessage(message, type = 'info') {
    // 创建消息容器
    let container = document.querySelector('.message-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'message-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
        `;
        document.body.appendChild(container);
    }
    
    // 创建消息元素
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.dataset.id = Date.now();
    messageElement.style.cssText = `
        padding: 12px 16px;
        border-radius: 6px;
        background: ${type === 'success' ? '#d4edda' : 
                     type === 'error' ? '#f8d7da' : 
                     type === 'warning' ? '#fff3cd' : '#d1ecf1'};
        color: ${type === 'success' ? '#155724' : 
                type === 'error' ? '#721c24' : 
                type === 'warning' ? '#856404' : '#0c5460'};
        border: 1px solid ${type === 'success' ? '#c3e6cb' : 
                          type === 'error' ? '#f5c6cb' : 
                          type === 'warning' ? '#ffeaa7' : '#bee5eb'};
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 300px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        opacity: 0;
        transform: translateX(100px);
        transition: opacity 0.3s, transform 0.3s;
    `;
    
    let icon = '';
    switch (type) {
        case 'success': icon = 'fas fa-check-circle'; break;
        case 'error': icon = 'fas fa-exclamation-circle'; break;
        case 'info': icon = 'fas fa-info-circle'; break;
        case 'warning': icon = 'fas fa-exclamation-triangle'; break;
    }
    
    messageElement.innerHTML = `
        <i class="${icon}" style="font-size: 18px;"></i>
        <span style="flex: 1;">${message}</span>
        <button class="close-btn" onclick="this.parentElement.remove()" style="
            background: none;
            border: none;
            cursor: pointer;
            color: inherit;
            font-size: 16px;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
        ">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(messageElement);
    
    setTimeout(() => {
        messageElement.style.opacity = '1';
        messageElement.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.style.opacity = '0';
            messageElement.style.transform = 'translateX(100px)';
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.remove();
                }
            }, 300);
        }
    }, 3000);
}

// 初始化DVP编辑按钮
function initDVPEditButton() {
    const dvpEditBtn = document.getElementById('dvp-edit-btn');
    if (dvpEditBtn) {
        dvpEditBtn.style.display = 'none';
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initDVPEditButton();
    
    const originalSwitchView = window.switchView;
    if (originalSwitchView) {
        window.switchView = function(view) {
            originalSwitchView(view);
            
            const dvpEditBtn = document.getElementById('dvp-edit-btn');
            if (dvpEditBtn) {
                if (view === 'dvp') {
                    dvpEditBtn.style.display = 'flex';
                    // 更新导出按钮状态
                    updateExportButtonsState(isDVPEditing);
                } else {
                    dvpEditBtn.style.display = 'none';
                    // 其他视图下启用导出按钮
                    updateExportButtonsState(false);
                    if (isDVPEditing) {
                        isDVPEditing = false;
                        const btn = document.getElementById('dvp-edit-btn');
                        btn.innerHTML = '<i class="fas fa-edit"></i> 编辑';
                        btn.classList.remove('active');
                    }
                }
            }
        };
    }
});