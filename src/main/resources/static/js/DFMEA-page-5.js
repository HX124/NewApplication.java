// 全局变量
let myChart;
let selectedNode = null;
let selectedRowData = null;
let isEditing = false;
let isEditingFunction = false;
let isEditingCharacteristic = false;
let nextId = 12;
let nextFuncId = 100;
let nextCharId = 200;
let customTooltip = null;
let hoverTimer = null;

// 扩展测试数据 - 包含功能要求和特性
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

// 功能要求数据 - 所有层级都可以添加
let functionData = [
  { id: 101, element_id: 1, description: "提供结构支撑和保护内部元件", color: "#32CD32" },
  { id: 102, element_id: 2, description: "控制设备各项操作功能", color: "#32CD32" },
  { id: 103, element_id: 3, description: "支持Type-C快速充电", color: "#32CD32" },
  { id: 104, element_id: 4, description: "调节音量大小", color: "#32CD32" },
  { id: 105, element_id: 5, description: "3.5mm音频接口", color: "#32CD32" },
  { id: 106, element_id: 6, description: "开关机控制", color: "#32CD32" },
  { id: 107, element_id: 7, description: "提升产品美观度和用户体验", color: "#32CD32" },
  { id: 108, element_id: 8, description: "支持1080P拍摄", color: "#32CD32" },
  { id: 109, element_id: 9, description: "立体声输出", color: "#32CD32" },
  { id: 110, element_id: 10, description: "承重能力≥2kg", color: "#32CD32" },
  { id: 111, element_id: 11, description: "防水防刮花", color: "#32CD32" }
];

// 特性数据 - 添加特性分类
let characteristicData = [
  { id: 201, element_id: 3, char_num: "C001", description: "接口尺寸Φ3.5mm", class: "关键特性" },
  { id: 202, element_id: 3, char_num: "C002", description: "充电功率18W", class: "重要特性" },
  { id: 203, element_id: 4, char_num: "C003", description: "按键行程1.5mm", class: "一般特性" },
  { id: 204, element_id: 5, char_num: "C004", description: "插拔力5-20N", class: "重要特性" },
  { id: 205, element_id: 6, char_num: "C005", description: "按键寿命10万次", class: "关键特性" },
  { id: 206, element_id: 8, char_num: "C006", description: "焦距f=35mm", class: "重要特性" },
  { id: 207, element_id: 9, char_num: "C007", description: "频率响应20-20kHz", class: "一般特性" },
  { id: 208, element_id: 10, char_num: "C008", description: "绳径3mm", class: "一般特性" },
  { id: 209, element_id: 11, char_num: "C009", description: "厚度0.1mm", class: "一般特性" }
];

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.edit-tabs button')[0].classList.add('active');
  createContextMenu();
  initChart();
  fillTableFun();
  fillTableCha();
  
  const modal = document.getElementById('modal');
  if (modal) modal.style.display = 'none';
  
  document.getElementById('element-form').addEventListener('submit', function(e) {
    e.preventDefault();
    if (isEditingFunction) {
      handleFunctionFormSubmit();
    } else if (isEditingCharacteristic) {
      handleCharacteristicFormSubmit();
    } else {
      handleFormSubmit();
    }
  });
  
  document.getElementById('characteristic-form').addEventListener('submit', function(e) {
    e.preventDefault();
    handleCharacteristicFormSubmit();
  });

  // 特性类型变化事件
  document.getElementById('char-type').addEventListener('change', toggleQuantitativeFields);

  // 添加窗口大小变化时的图表重绘
  window.addEventListener('resize', function() {
    if (myChart) {
      myChart.resize();
    }
  });
});

// 初始化图表
function initChart() {
  const dom = document.getElementById('chart-container');
  if (!dom) return;

  // 清理容器，确保没有残留元素
  dom.innerHTML = '';
  dom.style.width = '100%';
  dom.style.height = '100%';
  
  if (myChart) {
    myChart.dispose();
    myChart = null;
  }

  myChart = echarts.init(dom);
  
  const treeData = convertToTreeData(testData, null);
  const option = getChartOption(treeData);
  
  // 禁用默认的tooltip
  option.tooltip = {
    show: false // 完全禁用ECharts的tooltip
  };
  
  myChart.setOption(option);
  
  // 创建自定义tooltip
  let customTooltip = null;
  let hoverTimer = null;
  
  function createCustomTooltip() {
    if (customTooltip) return customTooltip;
    
    customTooltip = document.createElement('div');
    customTooltip.style.cssText = `
      position: absolute;
      background: rgba(113, 112, 112, 0.7);
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      z-index: 1000;
      pointer-events: none;
      display: none;
      max-width: 200px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(customTooltip);
    return customTooltip;
  }
  
  function showCustomTooltip(content, x, y) {
    const tooltip = createCustomTooltip();
    tooltip.innerHTML = content;
    tooltip.style.display = 'block';
    
    // 定位tooltip，确保在可视区域内
    const tooltipWidth = tooltip.offsetWidth;
    const tooltipHeight = tooltip.offsetHeight;
    
    let posX = x + 10;
    let posY = y + 10;
    
    if (posX + tooltipWidth > window.innerWidth) {
      posX = x - tooltipWidth - 10;
    }
    if (posY + tooltipHeight > window.innerHeight) {
      posY = y - tooltipHeight - 10;
    }
    
    tooltip.style.left = posX + 'px';
    tooltip.style.top = posY + 'px';
  }
  
  function hideCustomTooltip() {
    if (customTooltip) {
      customTooltip.style.display = 'none';
    }
  }
  
  // 监听鼠标事件
  myChart.on('mouseover', { seriesIndex: 0 }, function(params) {
    clearTimeout(hoverTimer);
    
    if (params.data && params.data.itemData) {
      const levelNames = ['系统', '子系统', '零件', '组件', '特性'];
      const levelName = levelNames[params.data.itemData.level - 1] || '未知';
      
      let tooltipContent = `${params.data.name}<br/>ID: ${params.data.itemData.id}<br/>层级: ${levelName}`;
      
      if (params.data.functions && params.data.functions.length > 0) {
        tooltipContent += '<br/><br/>功能要求:';
        params.data.functions.forEach(func => {
          tooltipContent += `<br/>• <span style="color:#32CD32">${func.description}</span>`;
        });
      }
      
      // 获取事件位置
      const event = params.event && params.event.event ? params.event.event : window.event;
      const x = event ? event.clientX : 0;
      const y = event ? event.clientY : 0;
      
      showCustomTooltip(tooltipContent, x, y);
      
      // 设置选中节点
      selectedNode = params.data.itemData;
      selectedRowData = null;
    }
  });
  
  myChart.on('mouseout', { seriesIndex: 0 }, function() {
    hoverTimer = setTimeout(function() {
      hideCustomTooltip();
    }, 100);
  });
  
  // 全局鼠标移出事件
  dom.addEventListener('mouseleave', function() {
    hideCustomTooltip();
  });
  
  // 右键菜单事件
  myChart.on('contextmenu', { seriesIndex: 0 }, (params) => {
    hideCustomTooltip();
    if (params.data && params.data.itemData) {
      selectedNode = params.data.itemData;
      selectedRowData = null;
      showContextMenu(params.event);
    }
  });
  
  // 点击节点时选中
  myChart.on('click', { seriesIndex: 0 }, (params) => {
    hideCustomTooltip();
    if (params.data && params.data.itemData) {
      selectedNode = params.data.itemData;
      selectedRowData = null;
    }
  });
  
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

function convertToTreeData(items, parentId = null) {
  const nodes = items.filter(item => item.parent_id === parentId);
  if (nodes.length === 0) return [];
  
  return nodes.map(item => {
    const functions = functionData.filter(f => f.element_id === item.id);
    
    return {
      name: item.name,
      value: item.id,
      itemData: item,
      children: convertToTreeData(items, item.id),
      itemStyle: {
        color: ['#165DFF', '#00b42a', '#ff7d00'][item.level - 1] || '#999'
      },
      functions: functions
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
          
          let label = `${params.name}`;
          
          // 在标签中显示功能要求（换行显示）
          if (params.data.functions && params.data.functions.length > 0) {
            params.data.functions.forEach(func => {
              label += `\n{func|• ${func.description}}`;
            });
          }
          return label;
        },
        rich: {
          func: {
            color: '#32CD32',
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
            let label = `${params.name}`;
            
            // 在叶子节点标签中显示功能要求
            if (params.data.functions && params.data.functions.length > 0) {
              params.data.functions.forEach(func => {
                label += `\n{func|• ${func.description}}`;
              });
            }
            return label;
          },
          rich: {
            func: {
              color: '#32CD32',
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

function refreshDisplay() {
  // 如果图表存在，先销毁
  if (myChart) {
    try {
      myChart.dispose();
    } catch (e) {
      console.log('销毁图表时出错:', e);
    }
    myChart = null;
  }
  
  // 重新初始化图表
  initChart();
  
  // 更新表格
  fillTableFun();
  fillTableCha();
}

// 填充功能关系表
function fillTableFun() {
  const tableBody = document.querySelector('#tablefun-container tbody');
  if (!tableBody) return;
  
  tableBody.innerHTML = '';
  
  // 获取所有根元素（level=1）
  const rootElements = testData.filter(item => item.level === 1);
  
  rootElements.forEach(rootElement => {
    // 查找根元素的功能要求
    const rootFunctions = functionData.filter(f => f.element_id === rootElement.id);
    
    // 获取根元素的二级元素
    const level2Elements = testData.filter(item => item.parent_id === rootElement.id);
    
    level2Elements.forEach(level2Element => {
      // 查找二级元素的功能要求
      const level2Functions = functionData.filter(f => f.element_id === level2Element.id);
      
      // 获取二级元素的三级元素
      const level3Elements = testData.filter(item => item.parent_id === level2Element.id);
      
      // 构建第一行：显示根元素和二级元素，第三列为空
      const firstRow = document.createElement('tr');
      firstRow.classList.add('parent-row');
      
      // 构建第一列：根元素+功能要求
      let firstColumn = rootElement.name;
      if (rootFunctions.length > 0) {
        firstColumn += `<div class="function-text">${rootFunctions.map(f => f.description).join('<br/>')}</div>`;
      }
      
      // 构建第二列：二级元素+功能要求
      let secondColumn = level2Element.name;
      if (level2Functions.length > 0) {
        secondColumn += `<div class="function-text">${level2Functions.map(f => f.description).join('<br/>')}</div>`;
      }
      
      firstRow.innerHTML = `
        <td data-id="${rootElement.id}">${firstColumn}</td>
        <td data-id="${level2Element.id}">${secondColumn}</td>
        <td></td>
      `;
      tableBody.appendChild(firstRow);
      
      // 为每个三级元素创建行（只填充第三列）
      level3Elements.forEach(level3Element => {
        const level3Functions = functionData.filter(f => f.element_id === level3Element.id);
        
        const row = document.createElement('tr');
        
        let thirdColumn = level3Element.name;
        if (level3Functions.length > 0) {
          thirdColumn += `<div class="function-text">${level3Functions.map(f => f.description).join('<br/>')}</div>`;
        }
        
        row.innerHTML = `
          <td></td>
          <td></td>
          <td data-id="${level3Element.id}">${thirdColumn}</td>
        `;
        tableBody.appendChild(row);
      });
    });
  });
  
  // 表格右键事件
  tableBody.addEventListener('contextmenu', (e) => {
    const td = e.target.closest('td');
    if (!td || !td.dataset.id) return;
    
    e.preventDefault();
    
    document.querySelectorAll('#tablefun-container tr.selected').forEach(el => {
      el.classList.remove('selected');
    });
    
    const row = td.closest('tr');
    row.classList.add('selected');
    
    const rowId = parseInt(td.dataset.id);
    const element = testData.find(item => item.id === rowId);
    
    if (element) {
      element.fromTableFun = true;
      selectedRowData = element;
      selectedNode = null;
      showContextMenu(e);
    }
  });
}

// 填充特性清单
function fillTableCha() {
  const tableBody = document.querySelector('#tablecha-container tbody');
  if (!tableBody) return;
  
  tableBody.innerHTML = '';
  
  // 获取所有零件级别的元素（level=3）
  const partElements = testData.filter(item => item.level === 3);
  
  partElements.forEach(part => {
    // 查找该零件的特性
    const characteristics = characteristicData.filter(c => c.element_id === part.id);
    
    if (characteristics.length > 0) {
      characteristics.forEach((char, index) => {
        const row = document.createElement('tr');
        row.dataset.id = char.id;
        row.dataset.type = 'characteristic';
        
        if (index === 0) {
          row.innerHTML = `
            <td>${part.name}</td>
            <td>${char.char_num}</td>
            <td>${char.description}</td>
            <td><span class="special-class-tag ${char.class === '关键特性' ? 'critical' : 
                                                 char.class === '重要特性' ? 'major' : 
                                                 char.class === '安全特性' ? 'safety' : 'general'}">
                ${char.class || '一般特性'}
              </span></td>
          `;
        } else {
          row.innerHTML = `
            <td></td>
            <td>${char.char_num}</td>
            <td>${char.description}</td>
            <td><span class="special-class-tag ${char.class === '关键特性' ? 'critical' : 
                                                 char.class === '重要特性' ? 'major' : 
                                                 char.class === '安全特性' ? 'safety' : 'general'}">
                ${char.class || '一般特性'}
              </span></td>
          `;
        }
        
        tableBody.appendChild(row);
      });
    } else {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${part.name}</td>
        <td></td>
        <td></td>
        <td></td>
      `;
      tableBody.appendChild(row);
    }
  });
  
  // 表格右键事件
  tableBody.addEventListener('contextmenu', (e) => {
    const row = e.target.closest('tr');
    if (!row) return;
    
    e.preventDefault();
    
    document.querySelectorAll('#tablecha-container tr.selected').forEach(el => {
      el.classList.remove('selected');
    });
    
    row.classList.add('selected');
    
    const rowId = parseInt(row.dataset.id);
    const type = row.dataset.type;
    
    if (type === 'characteristic') {
      const char = characteristicData.find(item => item.id === rowId);
      if (char) {
        selectedRowData = {
          id: char.id,
          name: char.description,
          type: 'characteristic',
          element_id: char.element_id,
          char_num: char.char_num,
          class: char.class
        };
        selectedNode = null;
        showContextMenu(e);
      }
    } else {
      // 如果点击的是零件行（第一列有内容的行）
      const partNameCell = row.querySelector('td:first-child');
      if (partNameCell && partNameCell.textContent.trim()) {
        // 查找对应的零件元素
        const partName = partNameCell.textContent.trim();
        const partElement = testData.find(item => item.name === partName && item.level === 3);
        
        if (partElement) {
          selectedRowData = {
            id: partElement.id,
            name: partElement.name,
            level: partElement.level
          };
          selectedNode = null;
          showContextMenu(e);
        }
      }
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
      <li onclick="handleAddFun()"><i class="fas fa-plus-circle"></i> 新增功能</li>
      <li onclick="handleAddCha()"><i class="fas fa-plus-square"></i> 新增特性</li>
      <li onclick="handleEdit()"><i class="fas fa-edit"></i> 编辑功能</li>
    </ul>
  `;
  document.body.appendChild(menu);
}

// 显示右键菜单
function showContextMenu(event) {
  const menu = document.getElementById('context-menu');
  if (!menu) return;
  
  const nativeEvent = event.event || event;
  
  if (typeof nativeEvent.preventDefault === 'function') {
    nativeEvent.preventDefault();
  }
  
  menu.style.display = 'none';
  
  // 获取当前活动视图
  const isChartView = !document.getElementById('chart-section').classList.contains('hidden');
  const isTableView = !document.getElementById('tablefun-section').classList.contains('hidden');
  const isCharacteristicView = !document.getElementById('tablecha-section').classList.contains('hidden');
  
  // 获取当前选中的元素数据
  let currentData = selectedNode || selectedRowData;
  let isPartLevel = false;
  
  // 如果在功能关系表视图中，需要从行数据中获取层级信息
  if (isTableView && currentData && currentData.fromTableFun) {
    const element = testData.find(item => item.id === currentData.id);
    if (element) {
      currentData = element;
      isPartLevel = element.level === 3;
    }
  } else if (isChartView) {
    if (currentData && !currentData.type) {
      isPartLevel = currentData.level === 3;
    }
  } else if (isTableView) {
    if (currentData && !currentData.type) {
      isPartLevel = currentData.level === 3;
    }
  }
  
  // 根据当前视图和选中元素类型，动态设置菜单项显示/隐藏
  const menuItems = menu.querySelectorAll('li');
  
  // 默认显示所有菜单项
  menuItems.forEach(item => {
    item.style.display = 'block';
  });
  
  // 查找菜单项
  const addFunctionItem = menuItems[0];
  const addCharacteristicItem = menuItems[1];
    
  // 在功能关系表视图中
  if (isTableView) {
    if (addCharacteristicItem) {
      if (isPartLevel) {
        addCharacteristicItem.style.display = 'block';
      } else {
        addCharacteristicItem.style.display = 'none';
      }
    }
    
    if (currentData && !currentData.type) {
      if (currentData.level === 1 || currentData.level === 2) {
        if (addCharacteristicItem) {
          addCharacteristicItem.style.display = 'none';
        }
      }
    }
  } else if (isChartView) {
    if (addCharacteristicItem) {
      if (isPartLevel) {
        addCharacteristicItem.style.display = 'block';
      } else {
        addCharacteristicItem.style.display = 'none';
      }
    }
  } else if (isCharacteristicView) {
    // 在特性清单视图中，总是显示新增特性选项
    if (addCharacteristicItem) {
      // 如果当前选中的是特性行，则允许新增特性
      if (selectedRowData && selectedRowData.type === 'characteristic') {
        addCharacteristicItem.style.display = 'block';
      }
      // 如果选中的是零件行（特性清单中的第一行）
      else if (selectedRowData && !selectedRowData.type) {
        addCharacteristicItem.style.display = 'block';
      }
      // 如果什么都没有选中，也显示
      else {
        addCharacteristicItem.style.display = 'block';
      }
    }
    
    // 在特性清单中隐藏新增功能选项
    if (addFunctionItem) {
      addFunctionItem.style.display = 'none';
    }
  }
  
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

// 打开特性弹窗
function openCharacteristicModal(type, characteristic = null, elementId = null) {
  const modal = document.getElementById('characteristic-modal');
  const modalTitle = document.getElementById('characteristic-modal-title');
  
  // 重置表单
  document.getElementById('characteristic-form').reset();
  
  // 初始化定量字段显示
  toggleQuantitativeFields();
  
  // 设置选中的元素ID
  if (elementId) {
    document.getElementById('selected-element-id').value = elementId;
  }
  
  if (type === 'add') {
    modalTitle.textContent = '新增特性';
    document.getElementById('char-id').value = nextCharId++;
    document.getElementById('char-code').removeAttribute('readonly');
  } else if (type === 'edit') {
    modalTitle.textContent = '编辑特性';
    document.getElementById('char-id').value = characteristic.id;
    document.getElementById('char-code').value = characteristic.char_num;
    document.getElementById('char-code').setAttribute('readonly', true);
    document.getElementById('char-name').value = getCharacteristicName(characteristic.description);
    document.getElementById('char-type').value = getCharacteristicType(characteristic.description);
    document.getElementById('char-class').value = characteristic.class || '一般特性';
    document.getElementById('char-symbol').value = '';
    document.getElementById('qualitative-spec').value = characteristic.description;
    
    // 根据类型显示/隐藏定量字段
    toggleQuantitativeFields();
  }
  
  modal.style.display = 'flex';
}

// 关闭特性弹窗
function closeCharacteristicModal() {
  document.getElementById('characteristic-modal').style.display = 'none';
}

// 根据特性类型显示/隐藏定量字段
function toggleQuantitativeFields() {
  const type = document.getElementById('char-type').value;
  const quantitativeFields = document.getElementById('quantitative-fields');
  
  if (type === '定量') {
    quantitativeFields.style.display = 'block';
  } else {
    quantitativeFields.style.display = 'none';
  }
}

// 从描述中提取特性名称
function getCharacteristicName(description) {
  if (!description) return '';
  // 简单提取：取第一个非数字字符前的部分
  const match = description.match(/^[^\d]+/);
  return match ? match[0].trim() : description;
}

// 判断特性类型
function getCharacteristicType(description) {
  if (!description) return '定性';
  // 如果有数字和单位，可能是定量
  const hasNumber = /\d/.test(description);
  const hasUnit = /(mm|kg|°C|N|W|kHz|Hz|V|A|次)/i.test(description);
  return hasNumber && hasUnit ? '定量' : '定性';
}

// 核心功能
// 修复新增功能要求
function handleAddFun() {
  const data = selectedNode || selectedRowData;
  if (!data) {
    alert('请先选择一个要素来添加功能要求！');
    return;
  }
  
  isEditing = false;
  isEditingFunction = true;
  isEditingCharacteristic = false;
  
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modal-title');
  modalTitle.textContent = '新增功能要求';
  
  // 构建功能行
  const functionRows = `
    <div class="function-row" data-index="0" data-id="new-0">
      <div class="function-row-header">
        <label class="form-label">功能描述 1</label>
      </div>
      <div class="function-content">
        <div class="function-description">
          <textarea class="form-textarea function-textarea function-desc" data-id="new-0" placeholder="请输入功能描述" required></textarea>
          <div class="error-tip" id="descError-new-0" style="display: none;">功能描述不能为空</div>
        </div>
      </div>
    </div>
  `;

  const modalBody = document.querySelector('.modal-body');
  modalBody.innerHTML = `
    <div class="modal-form">
      <input type="hidden" id="selected-element-id" value="${data.id}">
      
      <div class="form-item">
        <label class="form-label">所属要素</label>
        <input type="text" class="form-input" id="element-parent" value="${data.name}" readonly>
      </div>
      
      <div class="form-row-container" id="function-rows-container">
        ${functionRows}
      </div>
      
      <div class="form-item">
        <button type="button" class="add-function-btn" id="add-function-btn">
          <i>+</i> 添加功能要求
        </button>
      </div>
    </div>
  `;
  
  modal.style.display = 'flex';

  // 绑定事件
  setTimeout(() => {
    // 为容器添加事件委托
    const container = document.getElementById('function-rows-container');
    if (container) {
      container.addEventListener('click', function(e) {
        // 检查是否点击了删除按钮
        if (e.target && e.target.classList.contains('delete-btn')) {
          const index = parseInt(e.target.getAttribute('data-index'));
          deleteFunctionRow(index);
        }
      });
    }
    
    const addBtn = document.getElementById('add-function-btn');
    if (addBtn) {
      addBtn.onclick = null; // 清除旧的
      addBtn.addEventListener('click', addFunctionRow);
    }
  }, 100);
}

// 新增特性
function handleAddCha() {
  // 判断当前是否在特性清单视图中
  const isCharacteristicView = !document.getElementById('tablecha-section').classList.contains('hidden');
  
  let data = selectedNode || selectedRowData;
  
  if (isCharacteristicView) {
    // 在特性清单视图中，特别处理
    if (!data) {
      // 如果没有选中任何行，显示提示让用户选择或直接允许添加
      const partElements = testData.filter(item => item.level === 3);
      if (partElements.length > 0) {
        // 如果有零件，让用户选择要添加特性的零件
        let partOptions = partElements.map(part => 
          `<option value="${part.id}">${part.name}</option>`
        ).join('');
        
        isEditing = false;
        isEditingFunction = false;
        isEditingCharacteristic = true;
        
        const modal = document.getElementById('modal');
        document.getElementById('modal-title').textContent = '新增特性 - 选择零件';
        
        const modalBody = document.querySelector('.modal-body');
        modalBody.innerHTML = `
          <table class="modal-table">
            <tr>
              <th style="width: 100px;">选择零件</th>
              <th style="width: 80px;">特性编号</th>
              <th>特性描述</th>
              <th style="width: 100px;">特性分类</th>
            </tr>
            <tr>
              <td>
                <select id="selected-part" class="modal-input" required>
                  <option value="">请选择零件</option>
                  ${partOptions}
                </select>
              </td>
              <td><input type="text" id="char-num" class="modal-input" required placeholder="如：C001"></td>
              <td>
                <textarea id="char-desc" class="modal-textarea" required placeholder="如：接口尺寸Φ3.5mm" oninput="autoResizeTextarea(this)"></textarea>
              </td>
              <td>
                <select id="char-class" class="modal-input" required>
                  <option value="">请选择分类</option>
                  <option value="安全特性">安全特性</option>
                  <option value="关键特性">关键特性</option>
                  <option value="重要特性">重要特性</option>
                  <option value="一般特性">一般特性</option>
                </select>
              </td>
            </tr>
          </table>
          <input type="hidden" id="element-level" value="characteristic">
          <input type="hidden" id="element-id" value="${nextCharId++}">
        `;
        
        modal.style.display = 'flex';
        return; // 提前返回，不执行下面的代码
      }
    }
  }
  
  if (!data) {
    alert('请先选择一个零件来添加特性！');
    return;
  }
  
  // 如果是特性清单视图且选中的是特性行，我们需要找到对应的零件
  if (isCharacteristicView && data.type === 'characteristic') {
    // 从特性数据中查找对应的零件
    const char = characteristicData.find(item => item.id === data.id);
    if (char) {
      const partElement = testData.find(item => item.id === char.element_id);
      if (partElement) {
        data = partElement;
      }
    }
  }
  
  // 确保是零件级别
  if (data.level !== 3) {
    alert('只能为零件添加特性！');
    return;
  }

  openCharacteristicModal('add', null, data.id);
}

// 编辑功能要求
function handleEdit() {
  const data = selectedNode || selectedRowData;
  if (!data) {
    alert('请先选择要编辑的元素！');
    return;
  }
  
  // 判断是否要编辑功能要求
  if (!data.type || data.type !== 'characteristic') {
    let elementId;
    let elementName;
    
    if (data.type === 'function') {
      const func = functionData.find(item => item.id === data.id);
      if (func) {
        elementId = func.element_id;
        const element = testData.find(item => item.id === elementId);
        elementName = element ? element.name : '';
      }
    } else {
      elementId = data.id;
      elementName = data.name;
    }
    
    if (!elementId) {
      alert('未找到对应的要素！');
      return;
    }
    
    const elementFunctions = functionData.filter(item => item.element_id === elementId);
    
    isEditing = true;
    isEditingFunction = true;
    isEditingCharacteristic = false;
    
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    modalTitle.textContent = '编辑功能要求';
    
    let functionRows = '';
    let rowCount = 1;
    if (elementFunctions.length > 0) {
      elementFunctions.forEach((func) => {
        // 所有行都显示删除按钮
        const showDeleteButton = `<button type="button" class="delete-btn" data-index="${rowCount-1}">删除</button>`;
        
        functionRows += `
          <div class="function-row" data-index="${rowCount-1}" data-id="${func.id}">
            <div class="function-row-header">
              <label class="form-label">功能描述 ${rowCount}</label>
              ${showDeleteButton}
            </div>
            <div class="function-content">
              <div class="function-description">
                <textarea class="form-textarea function-textarea function-desc" data-id="${func.id}" placeholder="请输入功能描述" required>${func.description}</textarea>
                <div class="error-tip" id="descError-${func.id}" style="display: none;">功能描述不能为空</div>
              </div>
            </div>
          </div>
        `;
        rowCount++;
      });
    } else {
      // 如果没有功能要求，创建一个空行（也显示删除按钮）
      const showDeleteButton = `<button type="button" class="delete-btn" data-index="0">删除</button>`;
      
      functionRows = `
        <div class="function-row" data-index="0" data-id="new-0">
          <div class="function-row-header">
            <label class="form-label">功能描述 1</label>
            ${showDeleteButton}
          </div>
          <div class="function-content">
            <div class="function-description">
              <textarea class="form-textarea function-textarea function-desc" data-id="new-0" placeholder="请输入功能描述" required></textarea>
              <div class="error-tip" id="descError-new-0" style="display: none;">功能描述不能为空</div>
            </div>
          </div>
        </div>
      `;
    }

    const modalBody = document.querySelector('.modal-body');
    modalBody.innerHTML = `
      <div class="modal-form">
        <input type="hidden" id="selected-element-id" value="${elementId}">
        
        <div class="form-item">
          <label class="form-label">所属要素</label>
          <input type="text" class="form-input" id="element-parent" value="${elementName}" readonly>
        </div>
        
        <div class="form-row-container" id="function-rows-container">
          ${functionRows}
        </div>
        
        <div class="form-item">
          <button type="button" class="add-function-btn" id="add-function-btn">
            <i>+</i> 添加功能要求
          </button>
        </div>
      </div>
    `;
  
    modal.style.display = 'flex';

    // 使用事件委托来处理删除按钮点击
    setTimeout(() => {
      // 为容器添加事件委托
      const container = document.getElementById('function-rows-container');
      if (container) {
        container.addEventListener('click', function(e) {
          // 检查是否点击了删除按钮
          if (e.target && e.target.classList.contains('delete-btn')) {
            const index = parseInt(e.target.getAttribute('data-index'));
            deleteFunctionRow(index);
          }
        });
      }
    
      // 为添加按钮绑定事件
      const addBtn = document.getElementById('add-function-btn');
      if (addBtn) {
        addBtn.onclick = null; // 清除旧的
        addBtn.addEventListener('click', addFunctionRow);
      }
    }, 100);
  } else if (data.type === 'characteristic') {
    const char = characteristicData.find(item => item.id === data.id);
    if (!char) return;
    
    openCharacteristicModal('edit', char, char.element_id);
  }
}

// 添加功能要求行的函数
function addFunctionRow() {
  const container = document.getElementById('function-rows-container');
  if (!container) return;
  
  const rows = container.querySelectorAll('.function-row');
  const newIndex = rows.length;
  const newRowId = `new-${Date.now()}-${newIndex}`;
  
  // 新增行始终显示删除按钮
  const newRowHtml = `
    <div class="function-row" data-index="${newIndex}" data-id="${newRowId}">
      <div class="function-row-header">
        <label class="form-label">功能描述 ${newIndex + 1}</label>
        <button type="button" class="delete-btn" data-index="${newIndex}">删除</button>
      </div>
      <div class="function-content">
        <div class="function-description">
          <textarea class="form-textarea function-textarea function-desc" data-id="${newRowId}" placeholder="请输入功能描述" required></textarea>
          <div class="error-tip" id="descError-${newRowId}" style="display: none;">功能描述不能为空</div>
        </div>
      </div>
    </div>
  `;
  
  container.insertAdjacentHTML('beforeend', newRowHtml);
  
  // 自动聚焦到新增的文本框
  const newTextarea = container.querySelector(`.function-row[data-index="${newIndex}"] .function-desc`);
  if (newTextarea) {
    newTextarea.focus();
  }
}

// 删除功能要求行的函数
function deleteFunctionRow(index) {
  if (!confirm('确定删除这个功能要求吗？')) {
    return;
  }
  
  const container = document.getElementById('function-rows-container');
  if (!container) return;
  
  // 找到对应行的元素
  const rowToDelete = container.querySelector(`.function-row[data-index="${index}"]`);
  
  if (rowToDelete) {
    // 直接删除整个 function-row 元素
    rowToDelete.remove();
    
    // 重新获取所有剩余的行
    const remainingRows = container.querySelectorAll('.function-row');
    
    // 重新编号所有行
    remainingRows.forEach((row, newIndex) => {
      // 更新 data-index 属性
      row.setAttribute('data-index', newIndex);
      
      // 更新标签文本
      const label = row.querySelector('.function-row-header .form-label');
      if (label) {
        label.textContent = `功能描述 ${newIndex + 1}`;
      }
      
      // 更新删除按钮的 data-index
      const deleteBtn = row.querySelector('.delete-btn');
      if (deleteBtn) {
        deleteBtn.setAttribute('data-index', newIndex);
      }
    });
  }
}

// 自动调整textarea高度
function autoResizeTextarea(textarea) {
  // 重置高度以获取正确的scrollHeight
  textarea.style.height = 'auto';
  // 设置新高度，但不能超过300px
  textarea.style.height = Math.min(textarea.scrollHeight, 300) + 'px';
}

// 修复功能要求表单提交
function handleFunctionFormSubmit() {
  const elementId = parseInt(document.getElementById('selected-element-id').value);
  
  if (isEditing) {
    // 编辑功能要求
    const functionRows = document.querySelectorAll('.function-row');
    
    // 获取当前元素的所有功能要求ID
    const existingFunctionIds = functionData
      .filter(f => f.element_id === elementId)
      .map(f => f.id);
    
    const updatedFunctionIds = [];
    const errors = [];
    
    // 检查所有文本域
    functionRows.forEach(row => {
      const textarea = row.querySelector('.function-desc');
      if (textarea && !textarea.value.trim()) {
        errors.push(`功能描述 ${row.getAttribute('data-index') + 1} 不能为空`);
      }
    });
    
    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }
    
    // 处理每个功能行
    functionRows.forEach(row => {
      const funcIdAttr = row.getAttribute('data-id');
      const descInput = row.querySelector('.function-desc');
      
      if (descInput && descInput.value.trim()) {
        let funcId;
        
        if (funcIdAttr.startsWith('new-')) {
          // 新增的功能要求
          funcId = nextFuncId++;
        } else {
          // 编辑的功能要求
          funcId = parseInt(funcIdAttr);
        }
        
        updatedFunctionIds.push(funcId);
        
        // 查找是否已存在
        const existingIndex = functionData.findIndex(f => f.id === funcId);
        
        if (existingIndex !== -1) {
          // 更新现有功能要求
          functionData[existingIndex] = {
            id: funcId,
            element_id: elementId,
            description: descInput.value.trim(),
            color: "#32CD32"
          };
        } else {
          // 新增功能要求
          functionData.push({
            id: funcId,
            element_id: elementId,
            description: descInput.value.trim(),
            color: "#32CD32"
          });
        }
      }
    });
    
    // 删除在界面上已删除的功能要求
    const functionsToDelete = existingFunctionIds.filter(id => !updatedFunctionIds.includes(id));
    functionData = functionData.filter(f => !functionsToDelete.includes(f.id));
    
    // 清理已删除的ID记录
    if (window.deletedFunctions) {
      window.deletedFunctions.forEach(id => {
        const index = functionData.findIndex(f => f.id === id);
        if (index !== -1) {
          functionData.splice(index, 1);
        }
      });
      window.deletedFunctions = [];
    }
    
  } else {
    // 新增功能要求
    const functionRows = document.querySelectorAll('.function-row');
    const errors = [];
    
    // 检查是否有功能描述
    functionRows.forEach(row => {
      const textarea = row.querySelector('.function-desc');
      if (!textarea || !textarea.value.trim()) {
        errors.push(`功能描述不能为空`);
      }
    });
    
    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }
    
    // 处理每个功能行
    functionRows.forEach(row => {
      const descInput = row.querySelector('.function-desc');
      if (descInput && descInput.value.trim()) {
        const functionId = nextFuncId++;
        
        functionData.push({ 
          id: functionId, 
          element_id: elementId,
          description: descInput.value.trim(), 
          color: "#32CD32"
        });
      }
    });
  }
  
  closeModal();
  refreshDisplay();
}

// 特性表单提交处理
function handleCharacteristicFormSubmit() {
  const id = parseInt(document.getElementById('char-id').value);
  const charNum = document.getElementById('char-code').value.trim();
  const elementId = parseInt(document.getElementById('selected-element-id').value);
  const charType = document.getElementById('char-type').value;
  const charClass = document.getElementById('char-class').value;
  const charSymbol = document.getElementById('char-symbol').value.trim();
  const qualitativeSpec = document.getElementById('qualitative-spec').value.trim();
  
  // 构建特性描述
  let description = qualitativeSpec;
  
  if (charType === '定量') {
    const baselineValue = document.getElementById('baseline-value').value;
    const lowerLimit = document.getElementById('lower-limit').value;
    const upperLimit = document.getElementById('upper-limit').value;
    const unit = document.getElementById('unit').value.trim();
    
    if (lowerLimit && upperLimit) {
      description = `${lowerLimit}-${upperLimit}${unit}`;
    } else if (baselineValue) {
      description = `${baselineValue}${unit}`;
    }
  }
  
  // 检查必填项
  if (!charNum || !description || !charClass || !elementId) {
    alert('请填写所有必填项！');
    return false;
  }
  
  // 检查编号是否重复（新增时）
  const isEdit = characteristicData.some(item => item.id === id);
  if (!isEdit && characteristicData.some(item => item.char_num === charNum)) {
    alert('特性编号已存在！');
    return false;
  }
  
  if (isEdit) {
    // 编辑现有特性
    const index = characteristicData.findIndex(item => item.id === id);
    if (index !== -1) {
      characteristicData[index] = {
        ...characteristicData[index],
        char_num: charNum,
        description: description,
        class: charClass,
        specialSymbol: charSymbol
      };
    }
  } else {
    // 新增特性
    characteristicData.push({ 
      id: id, 
      element_id: elementId,
      char_num: charNum,
      description: description,
      class: charClass,
      specialSymbol: charSymbol
    });
  }
  
  closeCharacteristicModal();
  refreshDisplay();
  return false;
}

function handleFormSubmit() {
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
    let parentId = null;
    
    if (selectedNode || selectedRowData) {
      const selectedData = selectedNode || selectedRowData;
      if (level > 1) {
        if (level === selectedData.level + 1) {
          parentId = selectedData.id;
        } else {
          let currentParent = selectedData;
          while (currentParent && currentParent.level >= level) {
            currentParent = testData.find(item => item.id === currentParent.parent_id);
          }
          parentId = currentParent ? currentParent.id : null;
        }
      }
    } else {
      if (level !== 1) {
        alert('新增根元素必须是系统级（层级1）！');
        return;
      }
      parentId = null;
    }
    
    if (testData.some(item => item.id === id)) return alert('ID已存在！');
    
    testData.push({ 
      id, 
      name, 
      level, 
      parent_id: parentId 
    });
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
  isEditingFunction = false;
  isEditingCharacteristic = false;
  
  // 清空删除函数记录
  if (window.deletedFunctions) {
    window.deletedFunctions = [];
  }
}

// 显示图表
function showChart() {
  document.getElementById('chart-section').classList.remove('hidden');
  document.getElementById('tablefun-section').classList.add('hidden');
  document.getElementById('tablecha-section').classList.add('hidden');
  document.querySelectorAll('.edit-tabs button')[0].classList.add('active');
  document.querySelectorAll('.edit-tabs button')[1].classList.remove('active');
  document.querySelectorAll('.edit-tabs button')[2].classList.remove('active');
  refreshDisplay();
}

// 显示功能关系表
function showTableFun() {
  document.getElementById('chart-section').classList.add('hidden');
  document.getElementById('tablefun-section').classList.remove('hidden');
  document.getElementById('tablecha-section').classList.add('hidden');
  document.querySelectorAll('.edit-tabs button')[0].classList.remove('active');
  document.querySelectorAll('.edit-tabs button')[1].classList.add('active');
  document.querySelectorAll('.edit-tabs button')[2].classList.remove('active');
  fillTableFun();
}

// 显示特性清单
function showTableCha() {
  document.getElementById('chart-section').classList.add('hidden');
  document.getElementById('tablefun-section').classList.add('hidden');
  document.getElementById('tablecha-section').classList.remove('hidden');
  document.querySelectorAll('.edit-tabs button')[0].classList.remove('active');
  document.querySelectorAll('.edit-tabs button')[1].classList.remove('active');
  document.querySelectorAll('.edit-tabs button')[2].classList.add('active');  
  fillTableCha();
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

// 导出数据（修改为导出PNG图片）
function exportData(btn) {
  if (!myChart) {
    alert('图表未初始化！');
    return;
  }
  
  const originalHTML = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 正在生成图片...';
  btn.disabled = true;
  
  const chartContainer = document.getElementById('chart-container');
  if (!chartContainer) {
    alert('图表容器未找到！');
    btn.innerHTML = originalHTML;
    btn.disabled = false;
    return;
  }
  
  // 保存原始尺寸
  const originalWidth = chartContainer.style.width;
  const originalHeight = chartContainer.style.height;
  
  try {
    // 获取树形数据
    const treeData = convertToTreeData(testData, null);
    
    // 计算显示完整树所需尺寸
    const maxDepth = getTreeDepth(treeData);
    const maxWidth = getTreeWidth(treeData);
    
    // 设置足够大的画布尺寸
    const neededWidth = Math.max(2500, maxWidth * 400);
    const neededHeight = Math.max(1500, maxDepth * 250);
    
    // 临时调整容器和图表尺寸
    chartContainer.style.width = neededWidth + 'px';
    chartContainer.style.height = neededHeight + 'px';
    
    myChart.resize();
    
    // 调整图表选项以完整显示
    const option = myChart.getOption();
    
    // 保存原始配置
    const originalOption = JSON.parse(JSON.stringify(option));
    
    // 增大标签区域，确保功能要求完全显示
    option.series[0].label.width = 350;
    option.series[0].leaves.label.width = 350;
    
    // 调整布局边距
    option.series[0].left = '3%';
    option.series[0].right = '3%';
    option.series[0].top = '3%';
    option.series[0].bottom = '3%';
    
    // 确保标签显示所有内容
    option.series[0].label.formatter = function(params) {
      let label = params.name;
      if (params.data.functions && params.data.functions.length > 0) {
        params.data.functions.forEach(func => {
          label += `\n{func|• ${func.description}}`;
        });
      }
      return label;
    };
    
    option.series[0].leaves.label.formatter = function(params) {
      let label = params.name;
      if (params.data.functions && params.data.functions.length > 0) {
        params.data.functions.forEach(func => {
          label += `\n{func|• ${func.description}}`;
        });
      }
      return label;
    };
    
    // 禁用数据缩放，显示完整树
    option.dataZoom = [];
    option.series[0].zoom = 1;
    
    myChart.setOption(option, true);
    
    // 等待渲染完成
    setTimeout(() => {
      myChart.resize();
      
      setTimeout(() => {
        // 导出高质量图片
        const dataURL = myChart.getDataURL({
          type: 'png',
          pixelRatio: 2,
          backgroundColor: '#ffffff'
        });
        
        // 下载图片
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = `DFMEA功能树-完整视图-${new Date().toISOString().slice(0,10)}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // 恢复原始设置
        chartContainer.style.width = originalWidth;
        chartContainer.style.height = originalHeight;
        
        myChart.resize();
        myChart.setOption(originalOption, true);
        
        btn.innerHTML = '<i class="fas fa-check"></i> 已导出';
        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.disabled = false;
        }, 1500);
        
      }, 500);
    }, 500);
    
  } catch (error) {
    console.error('导出失败:', error);
    alert('导出失败：' + error.message);
    
    // 恢复设置
    chartContainer.style.width = originalWidth;
    chartContainer.style.height = originalHeight;
    if (myChart) myChart.resize();
    
    btn.innerHTML = originalHTML;
    btn.disabled = false;
  }
}

// 导出函数供外部访问
window.refreshDisplay = refreshDisplay;
window.testData = testData;
window.functionData = functionData;
window.characteristicData = characteristicData;
window.zoomChart = zoomChart;
window.resetZoom = resetZoom;
window.addFunctionRow = addFunctionRow;
window.deleteFunctionRow = deleteFunctionRow;
window.autoResizeTextarea = autoResizeTextarea;