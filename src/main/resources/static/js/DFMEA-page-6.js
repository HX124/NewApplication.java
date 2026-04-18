// 全局变量
let myChart;
let selectedNode = null;
let selectedRowData = null;
let isEditing = false;
let isEditingFailure = false;
let nextId = 12;
let nextFailureId = 100;

// 测试数据 - 全局可访问
let testData = [
  { id: 1, name: "壳体", level: 1, parent_id: null },
  { id: 2, name: "控制部分", level: 2, parent_id: 1 },
  { id: 3, name: "充电口", level: 3, parent_id: 2 },
  { id: 4, name: "音源键", level: 3, parent_id: 2 },
  { id: 5, name: "耳机口", level: 3, parent_id: 2 },
  { id: 6, name: "电源键口", level: 3, parent_id: 2 },
  { id: 7, name: "装饰部分", level: 2, parent_id: 1 },
  { id: 8, name: "镜头", level: 3, parent_id: 7 },
  { id: 9, name: "扬声器口", level: 3, parent_id: 7 },
  { id: 10, name: "挂绳", level: 3, parent_id: 7 },
  { id: 11, name: "印花", level: 3, parent_id: 7 }
];

// 失效模式数据
let failureData = [
  { id: 101, element_id: 1, description: "无法固定手机机身，不美观", color: "#FF0000", status: "潜在的", category: "功能丧失" },
  { id: 102, element_id: 2, description: "不能保护手机按键和外部零件接入口", color: "#FF0000", status: "潜在的", category: "功能丧失" },
  { id: 103, element_id: 3, description: "厚度 < 2mm或 > 3mm,与充电接口距离为 < 1mm或 > 3mm", color: "#FF0000", status: "潜在的", category: "功能丧失" },
  { id: 104, element_id: 4, description: "小于或大于手机音量键尺寸", color: "#FF0000", status: "潜在的", category: "功能丧失" },
  { id: 105, element_id: 5, description: "与耳机插孔距离 < 1mm或 > 2mm", color: "#FF0000", status: "潜在的", category: "功能丧失" },
  { id: 106, element_id: 6, description: "尺寸小于手机电源键，坡度 > 15°", color: "#FF0000", status: "潜在的", category: "功能丧失" },
  { id: 107, element_id: 7, description: "无法固定手机机身，无法保护手机硬件，不美观", color: "#FF0000", status: "潜在的", category: "功能丧失" },
  { id: 108, element_id: 8, description: "尺寸与镜头不一致，遮挡镜头", color: "#FF0000", status: "潜在的", category: "功能丧失" },
  { id: 109, element_id: 9, description: "与扬声器口距离 > 1mm或堵塞扬声器口", color: "#FF0000", status: "潜在的", category: "功能丧失" },
  { id: 110, element_id: 10, description: "开裂，无法固定手机绳", color: "#FF0000", status: "潜在的", category: "功能丧失" },
  { id: 111, element_id: 11, description: "涂料不均匀，图案不清晰不完整，有色差", color: "#FF0000", status: "潜在的", category: "功能丧失" }
];

// 可选项定义
const STATUS_OPTIONS = ["潜在的", "已发生的"];
const CATEGORY_OPTIONS = ["功能丧失", "功能退化", "功能间歇", "部分功能丧失", "非预期功能", "功能超出范围", "功能延迟"];

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.edit-tabs button')[0].classList.add('active');
  createContextMenu();
  initChart();
  fillTable();
  
  const modal = document.getElementById('modal');
  if (modal) modal.style.display = 'none';

  document.getElementById('element-form').addEventListener('submit', function(e) {
    e.preventDefault();
    if (isEditingFailure) {
      handleFailureFormSubmit();
    }
  });
  
  // 初始化模态框事件
  initModalEvents();
});

// 初始化模态框事件
function initModalEvents() {
  const modal = document.getElementById('modal');
  if (!modal) return;
  
  // 关闭按钮事件
  const closeBtn = modal.querySelector('.modal-close');
  if (closeBtn) {
    closeBtn.onclick = function() {
      closeModal();
    };
  }
  
  // 取消按钮事件
  const cancelBtn = modal.querySelector('.btn.secondary');
  if (cancelBtn) {
    cancelBtn.onclick = function() {
      closeModal();
    };
  }
}

// 初始化图表
function initChart() {
  const dom = document.getElementById('chart-container');
  if (!dom) return;

  dom.style.width = '100%';
  dom.style.height = '600px';
  
  // 添加缩放控制按钮
  if (!dom.querySelector('.chart-controls')) {
    const controls = document.createElement('div');
    controls.className = 'chart-controls';
    controls.innerHTML = `
      <button title="放大" onclick="zoomChart(0.2)"><i class="fas fa-search-plus"></i></button>
      <button title="缩小" onclick="zoomChart(-0.2)"><i class="fas fa-search-minus"></i></button>
      <button title="重置" onclick="resetZoom()"><i class="fas fa-expand-arrows-alt"></i></button>
    `;
    dom.appendChild(controls);
  }
  
  if (myChart) myChart.dispose();

  myChart = echarts.init(dom);
  
  const treeData = convertToTreeData(testData, null);
  myChart.setOption(getChartOption(treeData));

  // 树图右键菜单事件
  myChart.on('contextmenu', { seriesIndex: 0 }, (params) => {
    if (params.data && params.data.itemData) {
      selectedNode = params.data.itemData;
      selectedRowData = null;
      showContextMenu(params.event);
    }
  });

  // 点击节点时选中
  myChart.on('click', { seriesIndex: 0 }, (params) => {
    if (params.data && params.data.itemData) {
      selectedNode = params.data.itemData;
      selectedRowData = null;
    }
  });

  // 自动调整图表大小
  setTimeout(() => {
    myChart.resize();
    // 移除有问题的 dispatchAction 调用
    // 使用 collapseAll 替代 treeExpandAndCollapse
  }, 100);

  window.addEventListener('resize', function() {
    myChart.resize();
  });
}

// 数据转换
function convertToTreeData(items, parentId = null) {
  const nodes = items.filter(item => item.parent_id === parentId);
  if (nodes.length === 0) return [];
  
  return nodes.map(item => {
    const failures = failureData.filter(f => f.element_id === item.id);
    
    return {
      name: item.name,
      value: item.id,
      itemData: item,
      children: convertToTreeData(items, item.id),
      itemStyle: {
        color: ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae'][item.level - 1] || '#999'
      },
      failures: failures
    };
  });
}

// 图表配置
function getChartOption(treeData) {
  return {
    series: [{
      id: '0',
      type: 'tree',
      data: treeData,
      orient: 'horizontal',
      left: '3%',
      right: '3%',
      top: '3%',
      bottom: '3%',
      symbolSize: 14,
      expandAndCollapse: true,
      initialTreeDepth: 5,
      lineStyle: {
        width: 2,
        color: '#aaa',
        curveness: 0
      },
      edgeShape: 'polyline',
      edgeForkPosition: '50%',
      label: {
        position: 'left',
        verticalAlign: 'middle',
        align: 'right',
        distance: 15,
        fontSize: 14,
        formatter: function(params) {
          const levelNames = ['系统', '子系统', '零件', '组件', '特性'];
          const levelName = levelNames[params.data.itemData.level - 1] || '未知';
          
          let label = params.name;
          
          // 在标签中显示失效模式（换行显示）
          if (params.data.failures && params.data.failures.length > 0) {
            params.data.failures.forEach(fail => {
              label += `\n{fail|• ${fail.description}}`;
            });
          }
          return label;
        },
        rich: {
          fail: {
            color: '#FF0000',
            fontSize: 12,
            lineHeight: 16,
            padding: [2, 0, 0, 10]
          }
        }
      },
      leaves: {
        label: {
          position: 'right',
          verticalAlign: 'middle',
          align: 'left',
          distance: 15,
          formatter: function(params) {
            let label = params.name;
            
            // 在叶子节点标签中显示失效模式
            if (params.data.failures && params.data.failures.length > 0) {
              params.data.failures.forEach(fail => {
                label += `\n{fail|• ${fail.description}}`;
              });
            }
            return label;
          },
          rich: {
            fail: {
              color: '#FF0000',
              fontSize: 12,
              lineHeight: 16,
              padding: [2, 0, 0, 10]
            }
          }
        }
      },
      emphasis: {
        itemStyle: {
          color: '#e6a23c'
        }
      },
      roam: true,
      scaleLimit: {
        min: 0.1,
        max: 5
      },
      zoom: 1
    }],
    dataZoom: [
      {
        type: 'inside',
        orient: 'horizontal',
        start: 0,
        end: 100,
        minValueSpan: 10,
        maxValueSpan: 100
      }
    ]
  };
}

// 缩放图表函数
function zoomChart(delta) {
  if (!myChart) return;
  
  const option = myChart.getOption();
  const currentZoom = option.series[0].zoom || 1;
  option.series[0].zoom = Math.max(0.1, Math.min(5, currentZoom + delta));
  myChart.setOption(option);
}

// 重置缩放
function resetZoom() {
  if (!myChart) return;
  
  const option = myChart.getOption();
  option.series[0].zoom = 1;
  myChart.setOption(option);
}

// 表格功能
function fillTable() {
  const tableBody = document.querySelector('#table-container tbody');
  if (!tableBody) return;
  
  tableBody.innerHTML = '';
  
  // 获取所有根元素（level=1，系统级）
  const rootElements = testData.filter(item => item.level === 1);
  
  // 处理每个根元素（上一较高级别）
  rootElements.forEach(rootElement => {
    // 获取该根元素下的二级元素（关注要素）
    const level2Elements = testData.filter(item => item.parent_id === rootElement.id);
    
    // 遍历每个二级元素（关注要素）
    level2Elements.forEach(focusElement => {
      // 1. 创建关注要素行（上一较高级别=根元素，关注要素=二级元素，下一较低级别为空）
      const focusRow = document.createElement('tr');
      focusRow.classList.add('parent-row');
      
      // 获取根元素的失效模式
      const rootFailures = failureData.filter(f => f.element_id === rootElement.id);
      let rootColumn = rootElement.name;
      if (rootFailures.length > 0) {
        rootColumn += `<div class="failure-text">${rootFailures.map(f => f.description).join('<br/>')}</div>`;
      }
      
      // 获取二级元素的失效模式
      const focusFailures = failureData.filter(f => f.element_id === focusElement.id);
      let focusColumn = focusElement.name;
      if (focusFailures.length > 0) {
        focusColumn += `<div class="failure-text">${focusFailures.map(f => f.description).join('<br/>')}</div>`;
      }
      
      focusRow.innerHTML = `
        <td data-id="${rootElement.id}">${rootColumn}</td>
        <td data-id="${focusElement.id}">${focusColumn}</td>
        <td></td>
      `;
      tableBody.appendChild(focusRow);
      
      // 2. 获取该关注要素下的三级元素（下一较低级别）
      const level3Elements = testData.filter(item => item.parent_id === focusElement.id);
      
      // 遍历每个三级元素，生成空上级、空关注要素的行
      level3Elements.forEach(child => {
        const childRow = document.createElement('tr');
        
        // 获取三级元素的失效模式
        const childFailures = failureData.filter(f => f.element_id === child.id);
        let childColumn = child.name;
        if (childFailures.length > 0) {
          childColumn += `<div class="failure-text">${childFailures.map(f => f.description).join('<br/>')}</div>`;
        }
        
        childRow.innerHTML = `
          <td></td>
          <td></td>
          <td data-id="${child.id}">${childColumn}</td>
        `;
        tableBody.appendChild(childRow);
      });
    });
  });
  
  // 修改表格右键事件
  tableBody.addEventListener('contextmenu', (e) => {
    const td = e.target.closest('td');
    if (!td || !td.dataset.id) return;
    
    e.preventDefault();
    
    // 清除之前选中的行
    document.querySelectorAll('#table-container tr.selected').forEach(el => {
      el.classList.remove('selected');
    });
    
    // 设置当前行为选中状态
    const row = td.closest('tr');
    row.classList.add('selected');
    
    // 设置选中数据
    const rowId = parseInt(td.dataset.id);
    const data = testData.find(item => item.id === rowId);
    
    if (data) {
      selectedRowData = data;
      selectedNode = null;
      showContextMenu(e);
    }
  });
}

// 右键菜单
function createContextMenu() {
  if (document.getElementById('context-menu')) return;
  
  const menu = document.createElement('div');
  menu.id = 'context-menu';
  menu.className = 'context-menu';
  menu.innerHTML = `
    <ul style="list-style:none;margin:0;padding:0;">
      <li onclick="handleAddFailure()"><i class="fas fa-plus-circle"></i> 新增失效</li>
      <li onclick="handleEdit()"><i class="fas fa-edit"></i> 编辑</li>
    </ul>
  `;
  document.body.appendChild(menu);
}

function showContextMenu(event) {
  const menu = document.getElementById('context-menu');
  if (!menu) return;
  
  // 获取原生事件对象
  const nativeEvent = event.event || event;
  
  // 阻止默认行为
  if (typeof nativeEvent.preventDefault === 'function') {
    nativeEvent.preventDefault();
  }
  
  // 隐藏菜单（先隐藏再显示以避免闪烁）
  menu.style.display = 'none';
  
  // 计算菜单位置
  const x = nativeEvent.clientX || nativeEvent.pageX;
  const y = nativeEvent.clientY || nativeEvent.pageY;
  
  menu.style.left = `${Math.min(x, window.innerWidth - 130)}px`;
  menu.style.top = `${Math.min(y, window.innerHeight - 100)}px`;
  menu.style.display = 'block';
  
  // 点击其他地方隐藏菜单
  const hideMenu = () => {
    menu.style.display = 'none';
    document.removeEventListener('click', hideMenu);
  };
  document.addEventListener('click', hideMenu);
}

// 核心功能 - 新增失效模式（使用失效库相同的弹窗样式）
function handleAddFailure() {
  const data = selectedNode || selectedRowData;
  if (!data) {
    alert('请先选择一个要素来添加失效模式！');
    return;
  }
  
  isEditing = false;
  isEditingFailure = true;
  
  // 获取模态框元素
  const modal = document.getElementById('modal');
  const modalContent = modal.querySelector('.modal-content');
  
  // 清空并重新构建模态框内容
  modalContent.innerHTML = `
    <div class="modal-header">
      <h3 class="modal-title" id="modalTitle">新增失效模式</h3>
      <button class="modal-close">&times;</button>
    </div>
    <form class="modal-form" id="failureForm">
      <div class="form-item">
        <label class="form-label">所属要素</label>
        <input type="text" class="form-input" id="elementName" value="${data.name}" readonly>
      </div>
      <div class="form-item">
        <label class="form-label">失效描述 <span class="form-required">*</span></label>
        <textarea class="form-textarea" id="failureDescription" placeholder="请输入失效的详细描述..."></textarea>
        <div class="error-tip" id="descriptionError">失效描述不能为空</div>
      </div>
      <div class="form-item">
        <label class="form-label">失效状态 <span class="form-required">*</span></label>
        <select class="form-select" id="failureStatus">
          <option value="">请选择失效状态</option>
          <option value="潜在的">潜在的</option>
          <option value="已发生的">已发生的</option>
        </select>
        <div class="error-tip" id="statusError">请选择失效状态</div>
      </div>
      <div class="form-item">
        <label class="form-label">失效分类 <span class="form-required">*</span></label>
        <select class="form-select" id="failureCategory">
          <option value="">请选择失效分类</option>
          <option value="功能丧失">功能丧失</option>
          <option value="功能退化">功能退化</option>
          <option value="功能间歇">功能间歇</option>
          <option value="部分功能丧失">部分功能丧失</option>
          <option value="非预期功能">非预期功能</option>
          <option value="功能超出范围">功能超出范围</option>
          <option value="功能延迟">功能延迟</option>
        </select>
        <div class="error-tip" id="categoryError">请选择失效分类</div>
      </div>
      <input type="hidden" id="selectedElementId" value="${data.id}">
      <input type="hidden" id="failureId" value="${nextFailureId++}">
      <div class="modal-footer">
        <button type="button" class="modal-cancel">取消</button>
        <button type="submit" class="modal-submit">保存</button>
      </div>
    </form>
  `;
  
  // 重新绑定事件
  const closeBtn = modalContent.querySelector('.modal-close');
  const cancelBtn = modalContent.querySelector('.modal-cancel');
  const form = modalContent.querySelector('#failureForm');
  
  closeBtn.onclick = function() {
    closeModal();
  };
  
  cancelBtn.onclick = function() {
    closeModal();
  };
  
  form.onsubmit = function(e) {
    e.preventDefault();
    handleFailureFormSubmit();
  };
  
  // 显示模态框
  modal.style.display = 'flex';
}

// 编辑失效模式
function handleEdit() {
  const data = selectedNode || selectedRowData;
  if (!data) {
    alert('请先选择要编辑的元素！');
    return;
  }
  
  // 这里data应该就是要素对象，直接获取ID和名称
  const elementId = data.id;
  const elementName = data.name;
  
  if (!elementId) {
    alert('未找到对应的要素！');
    return;
  }
  
  isEditing = true;
  isEditingFailure = true;
  
  // 获取该要素的失效模式
  const elementFailures = failureData.filter(item => item.element_id === elementId);
  
  // 获取模态框元素
  const modal = document.getElementById('modal');
  const modalContent = modal.querySelector('.modal-content');
  
  // 构建多行失效模式编辑表单
  let failureRows = '';
  
  // 如果有失效模式，显示现有失效模式，否则显示一个空行
  if (elementFailures.length > 0) {
    elementFailures.forEach((fail, index) => {
      failureRows += `
        <div class="failure-row" data-id="${fail.id}">
          <div class="failure-header">
            <label class="form-label">失效模式 ${index + 1}</label>
            <button type="button" class="delete-btn" data-id="${fail.id}">删除</button>
          </div>
          <div class="failure-content">
            <div class="failure-description">
              <label class="form-label">失效描述 <span class="form-required">*</span></label>
              <textarea class="form-textarea failure-desc" data-id="${fail.id}" required>${fail.description || ''}</textarea>
              <div class="error-tip description-error" style="display: none;">失效描述不能为空</div>
            </div>
            <div class="failure-details">
              <div class="form-item">
                <label class="form-label">失效状态 <span class="form-required">*</span></label>
                <select class="form-select failure-status" data-id="${fail.id}">
                  <option value="">请选择失效状态</option>
                  ${STATUS_OPTIONS.map(opt => 
                    `<option value="${opt}" ${fail.status === opt ? 'selected' : ''}>${opt}</option>`
                  ).join('')}
                </select>
                <div class="error-tip status-error" style="display: none;">请选择失效状态</div>
              </div>
              <div class="form-item">
                <label class="form-label">失效分类 <span class="form-required">*</span></label>
                <select class="form-select failure-category" data-id="${fail.id}">
                  <option value="">请选择失效分类</option>
                  ${CATEGORY_OPTIONS.map(opt => 
                    `<option value="${opt}" ${fail.category === opt ? 'selected' : ''}>${opt}</option>`
                  ).join('')}
                </select>
                <div class="error-tip category-error" style="display: none;">请选择失效分类</div>
              </div>
            </div>
          </div>
        </div>
      `;
    });
  } else {
    // 如果没有失效模式，显示一个空行
    const newId = nextFailureId++;
    failureRows = `
      <div class="failure-row" data-id="new-${newId}">
        <div class="failure-header">
          <label class="form-label">失效模式 1</label>
          <button type="button" class="delete-btn" data-id="new-${newId}">删除</button>
        </div>
        <div class="failure-content">
          <div class="failure-description">
            <label class="form-label">失效描述 <span class="form-required">*</span></label>
            <textarea class="form-textarea failure-desc" data-id="new-${newId}" placeholder="请输入失效的详细描述..."></textarea>
            <div class="error-tip description-error" style="display: none;">失效描述不能为空</div>
          </div>
          <div class="failure-details">
            <div class="form-item">
              <label class="form-label">失效状态 <span class="form-required">*</span></label>
              <select class="form-select failure-status" data-id="new-${newId}">
                <option value="">请选择失效状态</option>
                ${STATUS_OPTIONS.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
              </select>
              <div class="error-tip status-error" style="display: none;">请选择失效状态</div>
            </div>
            <div class="form-item">
              <label class="form-label">失效分类 <span class="form-required">*</span></label>
              <select class="form-select failure-category" data-id="new-${newId}">
                <option value="">请选择失效分类</option>
                ${CATEGORY_OPTIONS.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
              </select>
              <div class="error-tip category-error" style="display: none;">请选择失效分类</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  // 清空并重新构建模态框内容
  modalContent.innerHTML = `
    <div class="modal-header">
      <h3 class="modal-title" id="modalTitle">编辑失效模式</h3>
      <button class="modal-close">&times;</button>
    </div>
    <form class="modal-form" id="failureForm">
      <div class="form-item">
        <label class="form-label">所属要素</label>
        <input type="text" class="form-input" id="elementName" value="${elementName}" readonly>
      </div>
      <div id="failureRowsContainer">
        ${failureRows}
      </div>
      <div class="form-item">
        <button type="button" class="add-failure-btn" id="addFailureRowBtn">
          <i class="fas fa-plus mr-1"></i> 添加失效模式
        </button>
      </div>
      <input type="hidden" id="selectedElementId" value="${elementId}">
      <div class="modal-footer">
        <button type="button" class="modal-cancel">取消</button>
        <button type="submit" class="modal-submit">保存</button>
      </div>
    </form>
  `;
  
  // 绑定事件
  bindModalEvents(modalContent, elementId);
  
  // 显示模态框
  modal.style.display = 'flex';
}

// 绑定模态框事件
function bindModalEvents(modalContent, elementId) {
  const closeBtn = modalContent.querySelector('.modal-close');
  const cancelBtn = modalContent.querySelector('.modal-cancel');
  const form = modalContent.querySelector('#failureForm');
  const addBtn = modalContent.querySelector('#addFailureRowBtn');
  
  closeBtn.onclick = cancelBtn.onclick = closeModal;
  form.onsubmit = function(e) {
    e.preventDefault();
    handleFailureFormSubmit(elementId);
  };
  addBtn.onclick = addFailureRow;
  
  // 绑定所有现有的删除按钮事件
  bindAllDeleteButtons(modalContent);
}

// 绑定所有删除按钮事件
function bindAllDeleteButtons(container) {
  const deleteButtons = container.querySelectorAll('.delete-btn');
  deleteButtons.forEach(btn => {
    btn.onclick = function() {
      const failureId = this.getAttribute('data-id');
      if (confirm('确认删除这个失效模式吗？')) {
        // 从UI中删除
        const row = this.closest('.failure-row');
        row.remove();
        // 重新编号
        renumberFailureRows();
      }
    };
  });
}

// 添加失效模式行（编辑模式）
function addFailureRow() {
  const container = document.getElementById('failureRowsContainer');
  const rowCount = container.querySelectorAll('.failure-row').length;
  
  const newFailureId = nextFailureId++;
  const newRow = document.createElement('div');
  newRow.className = 'failure-row';
  newRow.setAttribute('data-id', newFailureId);
  
  newRow.innerHTML = `
    <div class="failure-header">
      <label class="form-label">失效模式 ${rowCount + 1}</label>
      <button type="button" class="delete-btn" data-id="${newFailureId}">删除</button>
    </div>
    <div class="failure-content">
      <div class="failure-description">
        <label class="form-label">失效描述 <span class="form-required">*</span></label>
        <textarea class="form-textarea failure-desc" data-id="${newFailureId}" required placeholder="请输入失效的详细描述..."></textarea>
        <div class="error-tip description-error" style="display: none;">失效描述不能为空</div>
      </div>
      <div class="failure-details">
        <div class="form-item">
          <label class="form-label">失效状态 <span class="form-required">*</span></label>
          <select class="form-select failure-status" data-id="${newFailureId}">
            <option value="">请选择失效状态</option>
            ${STATUS_OPTIONS.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
          </select>
          <div class="error-tip status-error" style="display: none;">请选择失效状态</div>
        </div>
        <div class="form-item">
          <label class="form-label">失效分类 <span class="form-required">*</span></label>
          <select class="form-select failure-category" data-id="${newFailureId}">
            <option value="">请选择失效分类</option>
            ${CATEGORY_OPTIONS.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
          </select>
          <div class="error-tip category-error" style="display: none;">请选择失效分类</div>
        </div>
      </div>
    </div>
  `;
  
  container.appendChild(newRow);
  
  // 直接绑定删除按钮事件（不依赖 modalContent）
  const deleteBtn = newRow.querySelector('.delete-btn');
  deleteBtn.onclick = function() {
    const failureId = this.getAttribute('data-id');
    if (confirm(`确认删除这个失效模式吗？`)) {
      // 从UI中删除
      const row = this.closest('.failure-row');
      row.remove();
      // 重新编号
      renumberFailureRows();
    }
  };
  // 添加失效模式行（编辑模式）修改后的末尾部分
  container.appendChild(newRow);

  // 重新绑定所有删除按钮
  bindAllDeleteButtons(container);
}

// 重新编号失效模式行
function renumberFailureRows() {
  const container = document.getElementById('failureRowsContainer');
  const rows = container.querySelectorAll('.failure-row');
  
  rows.forEach((row, index) => {
    const label = row.querySelector('.failure-header .form-label');
    if (label) {
      label.textContent = `失效模式 ${index + 1}`;
    }
  });
}

// 表单验证
function validateForm() {
  let isValid = true;
  const modalContent = document.querySelector('.modal-content');
  
  // 隐藏所有错误提示
  modalContent.querySelectorAll('.error-tip').forEach(tip => {
    tip.style.display = 'none';
  });
  
  if (!isEditing) {
    // 新增模式验证
    const failureDescription = document.getElementById('failureDescription');
    const failureStatus = document.getElementById('failureStatus');
    const failureCategory = document.getElementById('failureCategory');
    
    if (!failureDescription || !failureDescription.value.trim()) {
      document.getElementById('descriptionError').style.display = 'block';
      isValid = false;
    }
    
    if (!failureStatus || !failureStatus.value) {
      document.getElementById('statusError').style.display = 'block';
      isValid = false;
    }
    
    if (!failureCategory || !failureCategory.value) {
      document.getElementById('categoryError').style.display = 'block';
      isValid = false;
    }
  } else {
    // 编辑模式验证
    const failureRows = document.querySelectorAll('.failure-row');
    
    failureRows.forEach(row => {
      const descInput = row.querySelector('.failure-desc');
      const statusSelect = row.querySelector('.failure-status');
      const categorySelect = row.querySelector('.failure-category');
      
      const hasDescription = descInput && descInput.value.trim();
      const hasStatus = statusSelect && statusSelect.value;
      const hasCategory = categorySelect && categorySelect.value;
      
      // 部分填写的情况需要完整验证
      if (hasDescription || hasStatus || hasCategory) {
        if (!hasDescription) {
          const descError = row.querySelector('.failure-description .error-tip');
          if (descError) descError.style.display = 'block';
          isValid = false;
        }
        
        if (!hasStatus) {
          const statusError = row.querySelector('.failure-details .form-item:nth-child(1) .error-tip');
          if (statusError) statusError.style.display = 'block';
          isValid = false;
        }
        
        if (!hasCategory) {
          const categoryError = row.querySelector('.failure-details .form-item:nth-child(2) .error-tip');
          if (categoryError) categoryError.style.display = 'block';
          isValid = false;
        }
      }
      // 全部为空则跳过（允许空行）
    });
  }
  
  return isValid;
}

// 处理失效表单提交
function handleFailureFormSubmit(elementId) {
  if (!validateForm()) return;
  
  const selectedElementId = document.getElementById('selectedElementId')?.value || elementId;
  
  if (!isEditing) {
    // 新增失效模式
    const failureDescription = document.getElementById('failureDescription').value.trim();
    const failureStatus = document.getElementById('failureStatus').value;
    const failureCategory = document.getElementById('failureCategory').value;
    const failureId = parseInt(document.getElementById('failureId').value);
    
    failureData.push({ 
      id: failureId, 
      element_id: parseInt(selectedElementId),
      description: failureDescription, 
      color: "#FF0000",
      status: failureStatus,
      category: failureCategory
    });
    
    // 记录新增的失效模式ID，用于下一个新增
    nextFailureId = failureId + 1;
  } else {
    // 编辑失效模式：先删除旧的，再添加新的
    failureData = failureData.filter(f => f.element_id !== parseInt(selectedElementId));
    
    const failureRows = document.querySelectorAll('.failure-row');
    failureRows.forEach(row => {
      const failureIdAttr = row.getAttribute('data-id');
      const descInput = row.querySelector('.failure-desc');
      const statusSelect = row.querySelector('.failure-status');
      const categorySelect = row.querySelector('.failure-category');
      
      if (descInput && descInput.value.trim() && 
          statusSelect && statusSelect.value && 
          categorySelect && categorySelect.value) {
        
        const failureId = failureIdAttr.startsWith('new-') ? 
          nextFailureId++ : parseInt(failureIdAttr);
        
        failureData.push({ 
          id: failureId, 
          element_id: parseInt(selectedElementId),
          description: descInput.value.trim(), 
          color: "#FF0000",
          status: statusSelect.value,
          category: categorySelect.value
        });
      }
    });
  }
  
  closeModal();
  
  // 强制重新初始化图表和表格
  refreshDisplay();
}

function handleFormSubmit() {
  // 原有的结构元素编辑逻辑（如果需要的话）
  const id = parseInt(document.getElementById('element-id').value);
  const name = document.getElementById('element-name').value.trim();
  const level = parseInt(document.getElementById('element-level').value);
  
  if (!name) return alert('请输入名称！');
  
  if (isEditing) {
    const index = testData.findIndex(item => item.id === id);
    if (index !== -1) {
      testData[index].name = name;
      testData[index].level = level;
      
      if (level === 1) {
        testData[index].parent_id = null;
      }
    }
  } else {
    // ... 新增元素逻辑
  }
  
  closeModal();
  refreshDisplay();
}

// 辅助函数
function getElementAndChildrenIds(parentId) {
  const ids = [parentId];
  const children = testData.filter(item => item.parent_id === parentId);
  children.forEach(child => ids.push(...getElementAndChildrenIds(child.id)));
  return ids;
}

function closeModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'none';
  
  // 重置状态
  isEditing = false;
  isEditingFailure = false;
  
  // 恢复原始模态框结构（如有需要）
  const modalContent = modal.querySelector('.modal-content');
  modalContent.innerHTML = `
    <div class="modal-header">
      <h3 id="modal-title"></h3>
      <button class="modal-close" onclick="closeModal()">&times;</button>
    </div>
    <form id="element-form">
      <div class="modal-body">
        <!-- 表单内容由JS动态生成 -->
      </div>
      <div class="modal-footer">
        <button type="button" class="modal-cancel" onclick="closeModal()">取消</button>
        <button type="submit" class="modal-submit">确认</button>
      </div>
    </form>
  `;
  
  // 重新绑定表单提交事件
  const form = modal.querySelector('#element-form');
  form.onsubmit = function(e) {
    e.preventDefault();
    if (isEditingFailure) {
      handleFailureFormSubmit();
    }
  };
}

function refreshDisplay() {
  if (myChart) {
    myChart.dispose();
  }
  initChart();
  
  fillTable();
}

// 显示图表
function showChart() {
  document.getElementById('chart-section').classList.remove('hidden');
  document.getElementById('table-section').classList.add('hidden');
  document.querySelectorAll('.edit-tabs button')[0].classList.add('active');
  document.querySelectorAll('.edit-tabs button')[1].classList.remove('active');
  
  refreshDisplay();
}

// 显示表格
function showTable() {
  document.getElementById('chart-section').classList.add('hidden');
  document.getElementById('table-section').classList.remove('hidden');
  document.querySelectorAll('.edit-tabs button')[0].classList.remove('active');
  document.querySelectorAll('.edit-tabs button')[1].classList.add('active');
  
  fillTable();
}

// 导出数据
function exportData(btn) {
  const exportData = {
    timestamp: new Date().toISOString(),
    testData: testData,
    failureData: failureData
  };
  
  const dataStr = JSON.stringify(exportData, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = 'DFMEA-failure-data-' + new Date().getTime() + '.json';
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
  
  btn.innerHTML = '<i class="fas fa-check"></i> 已导出';
  setTimeout(() => btn.innerHTML = '<i class="fas fa-paper-plane"></i> 导出失效树', 2000);
}

// 导出函数供外部访问
window.refreshDisplay = refreshDisplay;
window.testData = testData;
window.failureData = failureData;
window.zoomChart = zoomChart;
window.resetZoom = resetZoom;
window.addFailureRow = addFailureRow;