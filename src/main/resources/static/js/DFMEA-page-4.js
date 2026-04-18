// DFMEA-page-4.js

// 全局变量
let myChart;
let selectedNode = null;
let selectedRowData = null;
let isEditing = false;
let nextId = 12;
let customTooltip = null; // 将customTooltip提升为全局变量
let hoverTimer = null;

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

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
  // 激活第一个选项卡
  document.querySelectorAll('.tab-btn')[0].classList.add('active');
  createContextMenu();
  initChart();
  fillTable();
  
  const modal = document.getElementById('modal');
  if (modal) modal.style.display = 'none';
  
  // 修复：检查表单元素是否存在
  const elementForm = document.getElementById('element-form');
  if (elementForm) {
    elementForm.addEventListener('submit', function(e) {
      e.preventDefault();
      handleFormSubmit();
    });
  }
  
  // 清理可能存在的重复右键菜单
  const existingMenus = document.querySelectorAll('.context-menu');
  if (existingMenus.length > 1) {
    for (let i = 1; i < existingMenus.length; i++) {
      existingMenus[i].remove();
    }
  }
  
  // 新增：为content-box添加空白处右键监听（同时支持图表和表格视图）
  const contentBox = document.querySelector('.content-box');
  if (contentBox) {
    contentBox.addEventListener('contextmenu', function(e) {
      // 检查是否点击在空白处（不是图表节点、表格单元格或已有元素）
      const target = e.target;
      const isChartArea = target.closest('#chart-container');
      const isTableArea = target.closest('#table-section');
      const isTableCell = target.closest('#table-container td[data-id]');
      const isChartNode = target.closest('.echarts-for-react'); // ECharts节点
      
      // 检查是否是真正的空白处：
      // 1. 不在表格单元格上（有data-id的td）
      // 2. 不在图表节点上
      // 3. 当前没有选中的节点或行数据
      const isReallyBlank = !isTableCell && !isChartNode && 
                           !selectedNode && !selectedRowData;
      
      if (isReallyBlank && (isChartArea || isTableArea)) {
        e.preventDefault(); // 阻止浏览器默认右键菜单
        
        // 清除之前的选中
        selectedNode = null;
        selectedRowData = null;
        
        // 调用showContextMenu，标记为空白处
        showContextMenu(e, true);
      }
    });
  }
});

// 初始化图表
function initChart() {
  const dom = document.getElementById('chart-container');
  if (!dom) return;

  dom.innerHTML = '';
  dom.style.width = '100%';
  dom.style.height = '100%';
  
  if (myChart) {
    // 清理旧的图表实例
    try {
      myChart.dispose();
    } catch (e) {
      console.log('清理旧图表时出错:', e);
    }
    myChart = null;
  }

  myChart = echarts.init(dom);
  
  const treeData = convertToTreeData(testData, null);
  const option = getChartOption(treeData);
  
  // 禁用默认的tooltip
  option.tooltip = {
    show: false
  };
  
  myChart.setOption(option);
  
  // 创建自定义tooltip（如果不存在）
  if (!customTooltip) {
    createCustomTooltip();
  }
  
  // 绑定事件监听器
  bindChartEvents();
  
  // 窗口大小调整
  window.addEventListener('resize', function() {
    if (myChart) {
      myChart.resize();
    }
  });
  
  // 初始调整大小
  setTimeout(() => {
    if (myChart) {
      myChart.resize();
    }
  }, 100);
}

// 创建自定义tooltip
function createCustomTooltip() {
  // 清理可能已存在的tooltip
  if (customTooltip && customTooltip.parentNode) {
    customTooltip.parentNode.removeChild(customTooltip);
  }
  
  customTooltip = document.createElement('div');
  customTooltip.id = 'custom-tooltip';
  customTooltip.style.cssText = `
    position: fixed;
    background: rgba(113, 112, 112, 0.9);
    color: white;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 12px;
    z-index: 10000;
    pointer-events: none;
    display: none;
    max-width: 200px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    transition: opacity 0.2s;
  `;
  document.body.appendChild(customTooltip);
  return customTooltip;
}

// 显示自定义tooltip
function showCustomTooltip(content, x, y) {
  if (!customTooltip) {
    createCustomTooltip();
  }
  
  customTooltip.innerHTML = content;
  customTooltip.style.display = 'block';
  customTooltip.style.opacity = '1';
  
  // 定位tooltip，确保在可视区域内
  const tooltipWidth = customTooltip.offsetWidth;
  const tooltipHeight = customTooltip.offsetHeight;
  
  let posX = x + 10;
  let posY = y + 10;
  
  if (posX + tooltipWidth > window.innerWidth) {
    posX = x - tooltipWidth - 10;
  }
  if (posY + tooltipHeight > window.innerHeight) {
    posY = y - tooltipHeight - 10;
  }
  
  customTooltip.style.left = posX + 'px';
  customTooltip.style.top = posY + 'px';
}

// 隐藏自定义tooltip
function hideCustomTooltip() {
  if (customTooltip) {
    customTooltip.style.opacity = '0';
    setTimeout(() => {
      if (customTooltip) {
        customTooltip.style.display = 'none';
      }
    }, 200);
  }
}

// 绑定图表事件
function bindChartEvents() {
  if (!myChart) return;
  
  const dom = document.getElementById('chart-container');
  
  // 鼠标移入事件
  myChart.on('mouseover', { seriesIndex: 0 }, function(params) {
    if (hoverTimer) clearTimeout(hoverTimer);
    
    if (params.data && params.data.itemData) {
      const levelNames = ['系统', '子系统', '零件', '组件', '特性'];
      const levelName = levelNames[params.data.itemData.level - 1] || '未知';
      const content = `${params.data.name}<br/>ID: ${params.data.itemData.id}<br/>层级: ${levelName}`;
      
      // 获取事件位置
      const event = params.event && params.event.event ? params.event.event : window.event;
      const x = event ? event.clientX : 0;
      const y = event ? event.clientY : 0;
      
      showCustomTooltip(content, x, y);
      
      // 设置选中节点
      selectedNode = params.data.itemData;
      selectedRowData = null;
    }
  });
  
  // 鼠标移出事件
  myChart.on('mouseout', { seriesIndex: 0 }, function() {
    if (hoverTimer) clearTimeout(hoverTimer);
    hoverTimer = setTimeout(function() {
      hideCustomTooltip();
    }, 100);
  });
  
  // 图表容器鼠标移出事件
  if (dom) {
    dom.addEventListener('mouseleave', function() {
      if (hoverTimer) clearTimeout(hoverTimer);
      hideCustomTooltip();
    });
  }
  
  // 右键菜单事件
  myChart.on('contextmenu', { seriesIndex: 0 }, (params) => {
    if (params.event && params.event.event) {
      params.event.event.preventDefault();
    }
    
    hideCustomTooltip();
    if (params.data && params.data.itemData) {
      selectedNode = params.data.itemData;
      selectedRowData = null;
      
      // 获取事件位置
      const event = params.event && params.event.event ? params.event.event : window.event;
      showContextMenu(event, false); // 明确传递false，不是空白处
    }
  });
  
  // 点击节点时选中
  myChart.on('click', { seriesIndex: 0 }, (params) => {
    if (params.data && params.data.itemData) {
      selectedNode = params.data.itemData;
      selectedRowData = null;
    }
  });
}

// 数据转换
function convertToTreeData(items, parentId = null) {
  const nodes = items.filter(item => item.parent_id === parentId);
  if (nodes.length === 0) return [];
  
  return nodes.map(item => ({
    name: item.name,
    value: item.id,
    itemData: item,
    children: convertToTreeData(items, item.id),
    itemStyle: {
      color: ['#165DFF', '#00b42a', '#ff7d00'][item.level - 1] || '#999'
    }
  }));
}

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
        distance: 15,
        fontSize: 14,
        formatter: '{b}',
        width: 120
      },
      leaves: {
        label: {
          position: 'right',
          width: 120
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
  
  // 如果没有根元素，显示空表格
  if (rootElements.length === 0) {
    // 可以添加一行提示或保持空表格
    return;
  }
  
  // 处理每个根元素（上一较高级别）
  rootElements.forEach(rootElement => {
    // 获取该根元素下的二级元素（子系统级）
    const level2Elements = testData.filter(item => 
      item.parent_id === rootElement.id && item.level === 2
    );
    
    // 如果没有二级元素，只显示根元素行
    if (level2Elements.length === 0) {
      // 只显示根元素行，关注要素和下一级别都为空
      const rootRow = document.createElement('tr');
      rootRow.classList.add('parent-row');
      rootRow.innerHTML = `
        <td data-id="${rootElement.id}">${rootElement.name}</td>
        <td></td>
        <td></td>
      `;
      tableBody.appendChild(rootRow);
      return; // 继续处理下一个根元素
    }
    
    // 遍历每个二级元素（子系统级）
    level2Elements.forEach(subsystemElement => {
      // 1. 创建子系统行（上一较高级别=根元素，关注要素=子系统级，下一较低级别为空）
      const subsystemRow = document.createElement('tr');
      subsystemRow.classList.add('parent-row');
      subsystemRow.innerHTML = `
        <td data-id="${rootElement.id}">${rootElement.name}</td>
        <td data-id="${subsystemElement.id}">${subsystemElement.name}</td>
        <td></td>
      `;
      tableBody.appendChild(subsystemRow);
      
      // 2. 获取该子系统下的三级元素（零件级）
      const level3Elements = testData.filter(item => 
        item.parent_id === subsystemElement.id && item.level === 3
      );
      
      // 遍历每个三级元素（零件），生成空上级、空关注要素的行
      level3Elements.forEach(part => {
        const partRow = document.createElement('tr');
        partRow.innerHTML = `
          <td></td>
          <td></td>
          <td data-id="${part.id}">${part.name}</td>
        `;
        tableBody.appendChild(partRow);
      });
    });
  });
  
  // 表格右键事件（保持原有逻辑不变）
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
      showContextMenu(e, false);
    }
  });
}

// 右键菜单
function createContextMenu() {
  // 清理可能已存在的右键菜单
  const existingMenu = document.getElementById('context-menu');
  if (existingMenu && existingMenu.parentNode) {
    existingMenu.parentNode.removeChild(existingMenu);
  }
  
  const menu = document.createElement('div');
  menu.id = 'context-menu';
  menu.className = 'context-menu';
  menu.style.cssText = `
    position: fixed;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    z-index: 10001;
    display: none;
    min-width: 120px;
  `;
  
  menu.innerHTML = `
    <ul style="list-style:none;margin:0;padding:0;">
      <li onclick="handleAdd()" style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #eee;">
        <i class="fas fa-plus"></i> 新增
      </li>
      <li onclick="handleEdit()" style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #eee;">
        <i class="fas fa-edit"></i> 编辑
      </li>
      <li onclick="handleDelete()" style="padding: 8px 12px; cursor: pointer;">
        <i class="fas fa-trash"></i> 删除
      </li>
    </ul>
  `;
  
  // 添加悬停效果
  menu.addEventListener('mouseover', function(e) {
    if (e.target.tagName === 'LI') {
      e.target.style.backgroundColor = '#f5f5f5';
    }
  });
  
  menu.addEventListener('mouseout', function(e) {
    if (e.target.tagName === 'LI') {
      e.target.style.backgroundColor = '';
    }
  });
  
  document.body.appendChild(menu);
  
  // 点击其他地方隐藏菜单
  document.addEventListener('click', function(e) {
    if (menu && menu.style.display === 'block' && 
        !menu.contains(e.target) && 
        !e.target.classList.contains('context-menu')) {
      menu.style.display = 'none';
      
      // 重置菜单项显示状态
      const menuItems = menu.querySelectorAll('li');
      menuItems.forEach(item => {
        item.style.display = 'block';
      });
      
      // 重置选中状态
      selectedNode = null;
      selectedRowData = null;
    }
  });
}

function showContextMenu(event, isBlankArea = false) {
  const menu = document.getElementById('context-menu');
  if (!menu) {
    createContextMenu();
    return showContextMenu(event, isBlankArea);
  }
  
  // 阻止默认行为
  event.preventDefault();
  
  // 显示菜单前设置菜单项显示状态
  const menuItems = menu.querySelectorAll('li');
  if (isBlankArea) {
    // 空白处：只显示新增
    menuItems[0].style.display = 'block';
    menuItems[1].style.display = 'none';
    menuItems[2].style.display = 'none';
  } else {
    // 正常：显示全部
    menuItems.forEach(item => {
      item.style.display = 'block';
    });
  }
  
  // 隐藏菜单（先隐藏再显示以避免闪烁）
  menu.style.display = 'none';
  
  // 计算菜单位置
  const x = event.clientX || event.pageX;
  const y = event.clientY || event.pageY;
  
  menu.style.left = `${Math.min(x, window.innerWidth - 150)}px`;
  menu.style.top = `${Math.min(y, window.innerHeight - 120)}px`;
  menu.style.display = 'block';
}

// 核心功能
function handleAdd() {
  hideContextMenu();
  
  const data = selectedNode || selectedRowData;
  if (!data) {
    // 如果没有选中任何元素，允许添加根元素
    isEditing = false;
    openModalForAdd(null, 1); // 根元素，层级为1
    return;
  }
  
  isEditing = false;
  // 根据选中项设置默认层级
  const defaultLevel = Math.min(data.level + 1, 5); // 限制最大层级为5
  openModalForAdd(data, defaultLevel);
}

function handleEdit() {
  hideContextMenu();
  
  const data = selectedNode || selectedRowData;
  if (!data) {
    alert('请先选择要编辑的元素！');
    return;
  }
  
  isEditing = true;
  openModalForEdit(data);
}

// 打开新增模态框
function openModalForAdd(_, defaultLevel) {
  const modal = document.getElementById('modal');
  const modalContent = modal.querySelector('.modal-content');
  
  modalContent.innerHTML = `
    <div class="modal-header">
      <h3 class="modal-title">新增元素</h3>
      <button class="modal-close">&times;</button>
    </div>
    <form class="modal-form" id="element-form">
      <div class="form-item">
        <label class="form-label">产品/零件编号 <span class="form-required">*</span></label>
        <input type="text" class="form-input" id="element-id" value="${nextId++}" readonly>
        <div class="error-tip" id="idError">编号不能为空</div>
      </div>
      <div class="form-item">
        <label class="form-label">产品/零件名称 <span class="form-required">*</span></label>
        <input type="text" class="form-input" id="element-name" placeholder="请输入产品/零件名称">
        <div class="error-tip" id="nameError">名称不能为空</div>
      </div>
      <div class="form-item">
        <label class="form-label">产品/零件层级 <span class="form-required">*</span></label>
        <select class="form-select" id="element-level">
          <option value="">请选择层级</option>
          <option value="1" ${defaultLevel === 1 ? 'selected' : ''}>系统</option>
          <option value="2" ${defaultLevel === 2 ? 'selected' : ''}>子系统</option>
          <option value="3" ${defaultLevel === 3 ? 'selected' : ''}>零件</option>
        </select>
        <div class="error-tip" id="levelError">请选择层级</div>
      </div>
      <div class="modal-footer">
        <button type="button" class="modal-cancel">取消</button>
        <button type="submit" class="modal-submit">保存</button>
      </div>
    </form>
  `;
  
  // 重新绑定事件
  const closeBtn = modalContent.querySelector('.modal-close');
  const cancelBtn = modalContent.querySelector('.modal-cancel');
  const form = modalContent.querySelector('#element-form');
  
  closeBtn.onclick = cancelBtn.onclick = closeModal;
  form.onsubmit = function(e) {
    e.preventDefault();
    handleFormSubmit();
  };
  
  // 显示模态框
  modal.style.display = 'flex';
  
  // 异步设置焦点（避免跨域iframe问题）
  setTimeout(() => {
    const nameInput = document.getElementById('element-name');
    if (nameInput) {
      nameInput.focus();
    }
  }, 50);
}

// 打开编辑模态框
function openModalForEdit(data) {
  const modal = document.getElementById('modal');
  const modalContent = modal.querySelector('.modal-content');
  
  // 获取层级对应的中文名称
  const levelNames = ['系统', '子系统', '零件'];
  const levelName = levelNames[data.level - 1] || '未知';

  modalContent.innerHTML = `
    <div class="modal-header">
      <h3 class="modal-title">编辑元素</h3>
      <button class="modal-close">&times;</button>
    </div>
    <form class="modal-form" id="element-form">
      <div class="form-item">
        <label class="form-label">产品/零件编号 <span class="form-required">*</span></label>
        <input type="text" class="form-input" id="element-id" value="${data.id}" readonly>
        <div class="error-tip" id="idError">编号不能为空</div>
      </div>
      <div class="form-item">
        <label class="form-label">产品/零件名称 <span class="form-required">*</span></label>
        <input type="text" class="form-input" id="element-name" value="${data.name}" placeholder="请输入产品/零件名称">
        <div class="error-tip" id="nameError">名称不能为空</div>
      </div>
      <div class="form-item">
        <label class="form-label">产品/零件层级 <span class="form-required">*</span></label>
        <!-- 修改：使用只读输入框显示层级，而不是选择框 -->
        <input type="text" class="form-input" id="element-level-display" value="${levelName} (层级 ${data.level})" readonly>
        <!-- 添加一个隐藏的输入框来保存实际的层级值 -->
        <input type="hidden" id="element-level" value="${data.level}">
        <div class="error-tip" id="levelError">层级不可修改</div>
      </div>
      <div class="modal-footer">
        <button type="button" class="modal-cancel">取消</button>
        <button type="submit" class="modal-submit">保存</button>
      </div>
    </form>
  `;
  
  // 重新绑定事件
  const closeBtn = modalContent.querySelector('.modal-close');
  const cancelBtn = modalContent.querySelector('.modal-cancel');
  const form = modalContent.querySelector('#element-form');
  
  closeBtn.onclick = cancelBtn.onclick = closeModal;
  form.onsubmit = function(e) {
    e.preventDefault();
    handleFormSubmit();
  };
  
  // 显示模态框
  modal.style.display = 'flex';
  
  // 异步设置焦点（避免跨域iframe问题）
  setTimeout(() => {
    const nameInput = document.getElementById('element-name');
    if (nameInput) {
      nameInput.focus();
      // 可选：选中所有文本
      nameInput.select();
    }
  }, 50);
}

function handleFormSubmit() {
  const id = parseInt(document.getElementById('element-id').value);
  const name = document.getElementById('element-name').value.trim();
  
  // 表单验证
  if (!name) {
    alert('请输入名称！');
    return;
  }
  
  if (isEditing) {
    // 编辑现有元素 - 保持原始层级不变
    const index = testData.findIndex(item => item.id === id);
    if (index !== -1) {
      // 只更新名称，层级保持不变
      testData[index].name = name;
      // 注意：这里不修改 level 和 parent_id
    }
  } else {
    // 新增元素的逻辑保持不变
    const level = parseInt(document.getElementById('element-level').value);
    
    if (!level) {
      alert('请选择层级！');
      return;
    }
    
    let parent_id = null;
    const selectedData = selectedNode || selectedRowData;
    
    // 根据层级确定父级（新增逻辑保持不变）
    if (level === 1) {
      parent_id = null;
    } else if (level === 2) {
      if (selectedData && selectedData.level === 1) {
        parent_id = selectedData.id;
      } else {
        const rootElements = testData.filter(item => item.level === 1);
        if (rootElements.length > 0) {
          parent_id = rootElements[0].id;
        }
      }
    } else if (level === 3) {
      if (selectedData && selectedData.level === 2) {
        parent_id = selectedData.id;
      } else if (selectedData && selectedData.level === 3) {
        parent_id = selectedData.parent_id;
      }
    }
    
    if (testData.some(item => item.id === id)) {
      alert('ID已存在！');
      return;
    }
    
    testData.push({ 
      id, 
      name, 
      level, 
      parent_id 
    });
  }
  
  closeModal();
  refreshDisplay();
}


function handleDelete() {
  hideContextMenu();
  
  const data = selectedNode || selectedRowData;
  if (!data || !confirm('确认删除？此操作将删除该元素及其所有子元素！')) return;
  
  // 获取当前元素及其所有子元素的ID
  const idsToDelete = getElementAndChildrenIds(data.id);
  // 倒序删除（避免数组索引错乱）
  for (let i = testData.length - 1; i >= 0; i--) {
    if (idsToDelete.includes(testData[i].id)) testData.splice(i, 1);
  }
  
  // 重置选中状态（这里已经有了）
  selectedNode = null;
  selectedRowData = null;
  
  // 刷新视图（图表+表格）
  refreshDisplay();
}

// 隐藏右键菜单
function hideContextMenu() {
  const menu = document.getElementById('context-menu');
  if (menu && menu.style.display === 'block') {
    menu.style.display = 'none';
  }
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
  hideContextMenu();
}

function refreshDisplay() {
  // 更新图表
  if (myChart) {
    const currentOption = myChart.getOption();
    const treeData = convertToTreeData(testData, null);
    const newOption = getChartOption(treeData);
    
    // 保持当前视图状态（缩放、位置等）
    newOption.series[0].zoom = currentOption.series[0]?.zoom || 1;
    
    myChart.setOption(newOption);
  } else {
    initChart();
  }
  
  // 更新表格
  fillTable();
}

// 显示图表
function showChart() {
  document.getElementById('chart-section').classList.remove('hidden');
  document.getElementById('table-section').classList.add('hidden');
  
  // 更新选项卡状态
  const tabs = document.querySelectorAll('.tab-btn');
  tabs[0].classList.add('active');
  tabs[1].classList.remove('active');
  
  // 重置选中状态
  selectedNode = null;
  selectedRowData = null;
  
  refreshDisplay();
}

// 显示表格
function showTable() {
  document.getElementById('chart-section').classList.add('hidden');
  document.getElementById('table-section').classList.remove('hidden');
  
  // 更新选项卡状态
  const tabs = document.querySelectorAll('.tab-btn');
  tabs[0].classList.remove('active');
  tabs[1].classList.add('active');
  
  // 重置选中状态
  selectedNode = null;
  selectedRowData = null;
  
  fillTable();
}

// 导出数据（修改为导出PNG图片）
function exportData(btn) {
  if (!myChart) {
    alert('图表未初始化！');
    return;
  }
  
  // 保存原始HTML和状态
  const originalHTML = btn.innerHTML;
  
  // 更新按钮状态
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 正在生成图片...';
  btn.disabled = true;
  
  try {
    // 隐藏tooltip和右键菜单
    hideCustomTooltip();
    hideContextMenu();
    
    // 获取当前图表容器的DOM元素
    const chartContainer = document.getElementById('chart-container');
    
    if (!chartContainer) {
      throw new Error('图表容器未找到！');
    }
    
    // 保存原始样式
    const originalOverflow = chartContainer.style.overflow;
    const originalWidth = chartContainer.style.width;
    const originalHeight = chartContainer.style.height;
    
    // 临时调整容器样式以确保完整显示
    chartContainer.style.overflow = 'visible';
    
    // 计算完整树形结构所需的大小
    const treeData = convertToTreeData(testData, null);
    const maxDepth = getTreeDepth(treeData);
    const maxWidth = getTreeWidth(treeData);
    
    // 设置足够大的尺寸以确保完整显示
    const exportWidth = Math.max(1200, maxWidth * 200);
    const exportHeight = Math.max(800, maxDepth * 150);
    
    // 调整容器大小
    chartContainer.style.width = exportWidth + 'px';
    chartContainer.style.height = exportHeight + 'px';
    
    // 重新渲染图表以适应新尺寸
    if (myChart) {
      myChart.resize();
      
      // 暂时调整图表配置以确保完整显示
      const option = myChart.getOption();
      
      // 调整图表布局以显示全部内容
      option.series[0].left = '5%';
      option.series[0].right = '5%';
      option.series[0].top = '5%';
      option.series[0].bottom = '5%';
      option.series[0].zoom = 1; // 重置缩放
      
      // 禁用数据缩放以确保所有节点都可见
      option.dataZoom = [];
      
      // 确保所有节点标签可见
      option.series[0].label = {
        ...option.series[0].label,
        show: true,
        position: 'left',
        distance: 15,
        fontSize: 12,
        formatter: '{b}'
      };
      
      // 确保所有连接线可见
      option.series[0].lineStyle = {
        width: 2,
        color: '#aaa'
      };
      
      myChart.setOption(option);
    }
    
    // 等待图表重新渲染
    setTimeout(() => {
      // 使用ECharts自带的getDataURL方法导出高质量图片
      const dataURL = myChart.getDataURL({
        type: 'png',
        pixelRatio: 2, // 使用2倍像素比提高清晰度
        backgroundColor: '#ffffff', // 白色背景
        excludeComponents: [] // 导出所有组件
      });
      
      // 创建下载链接
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = `DFMEA-结构树-${new Date().getFullYear()}${(new Date().getMonth()+1).toString().padStart(2,'0')}${new Date().getDate().toString().padStart(2,'0')}.png`;
      
      // 触发下载
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // 恢复原始样式
      chartContainer.style.overflow = originalOverflow;
      chartContainer.style.width = originalWidth;
      chartContainer.style.height = originalHeight;
      
      // 重新调整图表大小
      if (myChart) {
        myChart.resize();
        // 恢复原始图表配置
        const originalOption = getChartOption(treeData);
        originalOption.series[0].zoom = 1; // 恢复默认缩放
        myChart.setOption(originalOption, true);
      }
      
      // 恢复按钮状态
      btn.innerHTML = '<i class="fas fa-check"></i> 已导出';
      
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
      }, 2000);
      
    }, 500); // 给图表足够时间重新渲染
    
  } catch (error) {
    console.error('导出图片失败:', error);
    alert('导出图片失败：' + error.message);
    
    // 恢复按钮状态
    btn.innerHTML = originalHTML;
    btn.disabled = false;
  }
}

// 辅助函数：获取树的最大深度
function getTreeDepth(treeData) {
  if (!treeData || treeData.length === 0) return 0;
  
  let maxDepth = 0;
  
  function traverse(node, depth) {
    maxDepth = Math.max(maxDepth, depth);
    
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => {
        traverse(child, depth + 1);
      });
    }
  }
  
  treeData.forEach(node => {
    traverse(node, 1);
  });
  
  return maxDepth;
}

// 辅助函数：获取树的最大宽度（节点数量）
function getTreeWidth(treeData) {
  if (!treeData || treeData.length === 0) return 0;
  
  let maxWidth = 0;
  const levelCounts = {};
  
  function traverse(node, level) {
    if (!levelCounts[level]) {
      levelCounts[level] = 0;
    }
    levelCounts[level]++;
    
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => {
        traverse(child, level + 1);
      });
    }
  }
  
  treeData.forEach(node => {
    traverse(node, 1);
  });
  
  // 找到最宽的一层
  for (const level in levelCounts) {
    maxWidth = Math.max(maxWidth, levelCounts[level]);
  }
  
  return maxWidth;
}

// 导出函数供外部访问
window.refreshDisplay = refreshDisplay;
window.testData = testData;
window.zoomChart = zoomChart;
window.resetZoom = resetZoom;