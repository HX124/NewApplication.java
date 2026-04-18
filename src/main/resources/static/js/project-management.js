// project-management.js
// FMEA项目管理公共函数

// 获取当前登录用户ID
window.getCurrentUserId = function() {
    const urlParams = new URLSearchParams(window.location.search);
    let userId = urlParams.get('userId');

    if (!userId && window.parent !== window) {
        try {
            const parentParams = new URLSearchParams(window.parent.location.search);
            userId = parentParams.get('userId');
        } catch(e) {
            console.log('无法从父页面获取userId');
        }
    }

    return userId ? parseInt(userId) : null;
};

// 表单验证
window.validateForm = function() {
    let isValid = true;
    const fmeaName = document.getElementById('fmeaName')?.value.trim();
    const projectType = document.getElementById('projectType')?.value;
    const projectStatus = document.getElementById('projectStatus')?.value;
    const responsiblePerson = document.getElementById('responsiblePerson')?.value.trim();
    const planStartDate = document.getElementById('planStartDate')?.value;

    document.querySelectorAll('.error-tip').forEach(tip => {
        tip.style.display = 'none';
    });

    if (!fmeaName) {
        document.getElementById('nameError').style.display = 'block';
        isValid = false;
    }

    if (!projectType) {
        document.getElementById('typeError').style.display = 'block';
        isValid = false;
    }

    if (!projectStatus) {
        document.getElementById('statusError').style.display = 'block';
        isValid = false;
    }

    if (!responsiblePerson) {
        document.getElementById('personError').style.display = 'block';
        isValid = false;
    }

    if (!planStartDate) {
        document.getElementById('dateError').style.display = 'block';
        isValid = false;
    }

    return isValid;
};

// 关闭弹窗
window.closeModal = function() {
    const modal = document.getElementById('projectModal');
    if (modal) modal.style.display = 'none';
};

// 从后端获取项目数据
window.fetchProjectsFromBackend = function(renderCallback) {
    const userId = window.getCurrentUserId();
    console.log('获取项目数据 - 用户ID:', userId);

    let url = 'http://localhost:8088/project/list';
    if (userId) {
        url = `http://localhost:8088/project/user/${userId}`;
    }

    fetch(url)
        .then(response => response.json())
        .then(result => {
            if (result.code === 200) {
                window.fmeaProjects = (result.data || []).map(project => ({
                    fmeaName: project.fmeaName,
                    fmeaCode: project.fmeaCode,
                    projectType: project.projectType,
                    projectStatus: project.projectStatus,
                    responsiblePerson: project.responsiblePerson,
                    planStartDate: project.planStartDate,
                    lastVisitedTime: project.lastVisitedTime,
                    createdAt: project.createdAt,
                    fmeaId: project.fmeaId
                }));

                if (typeof renderCallback === 'function') {
                    renderCallback();
                }
            } else {
                console.error('获取项目数据失败:', result.message);
                window.fmeaProjects = [];
                if (typeof renderCallback === 'function') {
                    renderCallback();
                }
            }
        })
        .catch(error => {
            console.error('请求后端失败:', error);
            window.fmeaProjects = [];
            if (typeof renderCallback === 'function') {
                renderCallback();
            }
        });
};

// 记录项目访问时间（后端调用）
window.recordProjectVisitBackend = function(fmeaId) {
    if (!fmeaId) return;

    fetch(`http://localhost:8088/project/visit/${fmeaId}`, {
        method: 'PUT'
    })
        .then(response => response.json())
        .then(result => {
            if (result.code === 200) {
                console.log('更新访问时间成功');
            }
        })
        .catch(error => {
            console.error('更新访问时间失败:', error);
        });
};

// 记录项目访问时间（本地存储）
window.recordProjectVisitLocal = function(project, storageKey) {
    if (!window.fmeaProjects) window.fmeaProjects = [];
    const index = window.fmeaProjects.findIndex(p => p.fmeaCode === project.fmeaCode);
    if (index !== -1) {
        window.fmeaProjects[index].lastVisitedTime = new Date().toISOString();
        localStorage.setItem(storageKey, JSON.stringify(window.fmeaProjects));
    }
};

// 预加载导出iframe
window.preloadExportFrame = function() {
    const iframe = document.getElementById('exportFrame');
    if (iframe) {
        iframe.src = 'DFMEA-page-9.html';
        iframe.onload = function() {
            window.exportFrameLoaded = true;
            console.log('导出iframe已加载完成');
        };
    }
};

// 打开导出格式选择弹窗
window.openExportModal = function(project) {
    window.currentExportProject = project;
    window.currentExportType = 'dfmea';

    document.querySelectorAll('.export-type-btn').forEach(btn => {
        if (btn.dataset.type === 'dfmea') {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    window.updateExportDesc();
    const modal = document.getElementById('exportModal');
    if (modal) modal.style.display = 'flex';
};

// 更新导出描述
window.updateExportDesc = function() {
    const typeNames = {
        'dfmea': 'DFMEA表格',
        'dvp': 'DVP表格',
        'characteristic': '特性清单'
    };

    const desc = typeNames[window.currentExportType] || 'DFMEA表格';
    const excelDesc = document.getElementById('excelDesc');
    const pdfDesc = document.getElementById('pdfDesc');

    if (excelDesc) excelDesc.textContent = `导出为.xlsx格式，包含${desc}`;
    if (pdfDesc) pdfDesc.textContent = `导出为.pdf格式，包含${desc}`;
};

// 关闭导出弹窗
window.closeExportModal = function() {
    const modal = document.getElementById('exportModal');
    if (modal) modal.style.display = 'none';
    window.currentExportProject = null;
};

// 显示导出加载提示
window.showExportLoading = function() {
    let loadingDiv = document.getElementById('exportLoading');
    if (!loadingDiv) {
        loadingDiv = document.createElement('div');
        loadingDiv.id = 'exportLoading';
        loadingDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 16px;
            z-index: 10001;
        `;
        loadingDiv.innerHTML = `
            <div class="spinner" style="
                border: 4px solid #f3f3f3;
                border-top: 4px solid #3498db;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 2s linear infinite;
                margin-bottom: 20px;
            "></div>
            <div>正在准备导出，请稍候...</div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
        document.body.appendChild(loadingDiv);
    } else {
        loadingDiv.style.display = 'flex';
    }
};

// 隐藏导出加载提示
window.hideExportLoading = function() {
    const loadingDiv = document.getElementById('exportLoading');
    if (loadingDiv) {
        loadingDiv.style.display = 'none';
    }
};

// 导出为Excel
window.exportToExcel = function(project, exportType, recordVisitCallback) {
    try {
        if (typeof recordVisitCallback === 'function') {
            recordVisitCallback(project);
        }

        window.showExportLoading();

        const iframe = document.getElementById('exportFrame');
        const iframeWindow = iframe.contentWindow;

        if (window.exportFrameLoaded && iframeWindow && iframeWindow.fmeaExportFunctions) {
            iframeWindow.fmeaExportFunctions.setProjectData(project);

            switch(exportType) {
                case 'dfmea': iframeWindow.fmeaExportFunctions.exportDFMEAExcel(); break;
                case 'dvp': iframeWindow.fmeaExportFunctions.exportDVPExcel(); break;
                case 'characteristic': iframeWindow.fmeaExportFunctions.exportCharacteristicExcel(); break;
                default: iframeWindow.fmeaExportFunctions.exportDFMEAExcel();
            }

            window.hideExportLoading();
            window.closeExportModal();
        } else {
            iframe.src = 'DFMEA-page-9.html';
            const checkInterval = setInterval(() => {
                if (iframe.contentWindow && iframe.contentWindow.fmeaExportFunctions) {
                    clearInterval(checkInterval);
                    iframe.contentWindow.fmeaExportFunctions.setProjectData(project);

                    switch(exportType) {
                        case 'dfmea': iframe.contentWindow.fmeaExportFunctions.exportDFMEAExcel(); break;
                        case 'dvp': iframe.contentWindow.fmeaExportFunctions.exportDVPExcel(); break;
                        case 'characteristic': iframe.contentWindow.fmeaExportFunctions.exportCharacteristicExcel(); break;
                        default: iframe.contentWindow.fmeaExportFunctions.exportDFMEAExcel();
                    }

                    window.hideExportLoading();
                    window.closeExportModal();
                }
            }, 100);

            setTimeout(() => {
                clearInterval(checkInterval);
                window.hideExportLoading();
                alert('导出页面加载超时，请重试！');
            }, 5000);
        }
    } catch (error) {
        console.error('Excel导出失败:', error);
        window.hideExportLoading();
        alert('Excel导出失败，请重试！');
        window.closeExportModal();
    }
};

// 导出为PDF
window.exportToPDF = function(project, exportType, recordVisitCallback) {
    try {
        if (typeof recordVisitCallback === 'function') {
            recordVisitCallback(project);
        }

        window.showExportLoading();

        const iframe = document.getElementById('exportFrame');
        const iframeWindow = iframe.contentWindow;

        if (window.exportFrameLoaded && iframeWindow && iframeWindow.fmeaExportFunctions) {
            iframeWindow.fmeaExportFunctions.setProjectData(project);

            switch(exportType) {
                case 'dfmea': iframeWindow.fmeaExportFunctions.exportDFMEAPDF(); break;
                case 'dvp': iframeWindow.fmeaExportFunctions.exportDVPPDF(); break;
                case 'characteristic': iframeWindow.fmeaExportFunctions.exportCharacteristicPDF(); break;
                default: iframeWindow.fmeaExportFunctions.exportDFMEAPDF();
            }

            window.hideExportLoading();
            window.closeExportModal();
        } else {
            iframe.src = 'DFMEA-page-9.html';
            const checkInterval = setInterval(() => {
                if (iframe.contentWindow && iframe.contentWindow.fmeaExportFunctions) {
                    clearInterval(checkInterval);
                    iframe.contentWindow.fmeaExportFunctions.setProjectData(project);

                    switch(exportType) {
                        case 'dfmea': iframe.contentWindow.fmeaExportFunctions.exportDFMEAPDF(); break;
                        case 'dvp': iframe.contentWindow.fmeaExportFunctions.exportDVPPDF(); break;
                        case 'characteristic': iframe.contentWindow.fmeaExportFunctions.exportCharacteristicPDF(); break;
                        default: iframe.contentWindow.fmeaExportFunctions.exportDFMEAPDF();
                    }

                    window.hideExportLoading();
                    window.closeExportModal();
                }
            }, 100);

            setTimeout(() => {
                clearInterval(checkInterval);
                window.hideExportLoading();
                alert('导出页面加载超时，请重试！');
            }, 5000);
        }
    } catch (error) {
        console.error('PDF导出失败:', error);
        window.hideExportLoading();
        alert('PDF导出失败，请重试！');
        window.closeExportModal();
    }
};

// 新增项目
window.addProject = function(callback) {
    const fmeaName = document.getElementById('fmeaName')?.value.trim();
    const projectType = document.getElementById('projectType')?.value;
    const projectStatus = document.getElementById('projectStatus')?.value;
    const responsiblePerson = document.getElementById('responsiblePerson')?.value.trim();
    const planStartDate = document.getElementById('planStartDate')?.value;
    const userId = window.getCurrentUserId();

    if (!fmeaName || !projectType || !projectStatus || !responsiblePerson || !planStartDate) {
        alert('表单信息不完整！');
        return false;
    }

    if (!userId) {
        alert('无法获取用户信息，请重新登录！');
        return false;
    }

    const projectData = {
        fmeaName: fmeaName,
        projectType: projectType,
        projectStatus: projectStatus,
        responsiblePerson: responsiblePerson,
        planStartDate: planStartDate,
        userId: userId
    };

    fetch('http://localhost:8088/project', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectData)
    })
        .then(response => response.json())
        .then(result => {
            if (result.code === 200) {
                if (typeof callback === 'function') {
                    callback(result.data);
                }
                window.closeModal();
                alert('FMEA项目新增成功！');
            } else {
                alert('新增失败：' + (result.message || '未知错误'));
            }
        })
        .catch(error => {
            console.error('新增项目失败:', error);
            alert('新增失败，请检查网络连接！');
        });

    return true;
};

// 编辑项目
window.updateProject = function(callback) {
    const fmeaId = document.getElementById('editFmeaCode')?.value;

    const projectData = {
        fmeaId: parseInt(fmeaId),
        fmeaName: document.getElementById('fmeaName')?.value.trim(),
        projectType: document.getElementById('projectType')?.value,
        projectStatus: document.getElementById('projectStatus')?.value,
        responsiblePerson: document.getElementById('responsiblePerson')?.value.trim(),
        planStartDate: document.getElementById('planStartDate')?.value
    };

    fetch('http://localhost:8088/project', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectData)
    })
        .then(response => response.json())
        .then(result => {
            if (result.code === 200) {
                if (typeof callback === 'function') {
                    callback();
                }
                window.closeModal();
                alert('FMEA项目编辑成功！');
            } else {
                alert('编辑失败：' + (result.message || '未知错误'));
            }
        })
        .catch(error => {
            console.error('编辑项目失败:', error);
            alert('编辑失败，请检查网络连接！');
        });

    return true;
};

// 删除单个项目
window.deleteProject = function(fmeaId, fmeaName, callback) {
    if (!fmeaId) return false;

    if (confirm(`确认删除FMEA项目【${fmeaName}】吗？删除后不可恢复！`)) {
        fetch(`http://localhost:8088/project/${fmeaId}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(result => {
                if (result.code === 200) {
                    if (typeof callback === 'function') {
                        callback();
                    }
                    alert(`FMEA项目【${fmeaName}】已成功删除！`);
                } else {
                    alert('删除失败：' + (result.message || '未知错误'));
                }
            })
            .catch(error => {
                console.error('删除项目失败:', error);
                alert('删除失败，请检查网络连接！');
            });
        return true;
    }
    return false;
};

// 初始化全局变量
window.fmeaProjects = [];
window.currentExportProject = null;
window.currentExportType = 'dfmea';
window.exportFrameLoaded = false;

console.log('project-management.js 已加载');