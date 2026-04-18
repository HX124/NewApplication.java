// 从URL获取项目编号
function getProjectCode() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('code');
}

// 页面加载时记录
document.addEventListener('DOMContentLoaded', function() {
    const projectCode = getProjectCode();
    if (projectCode) {
        console.log('当前项目编号:', projectCode);
    }
});

// 测试数据
const testData = [
    { id: 1, name: "壳体", level: 1, parent_id: null },
    { id: 2, name: "控制部分", level: 2, parent_id: 1 },
    { id: 3, name: "充电口", level: 3, parent_id: 2 },
    { id: 4, name: "音源键", level: 3, parent_id: 2 },
    { id: 5, name: "耳机口", level: 3, parent_id: 2 },
    { id: 6, name: "电源键口", level: 3, parent_id: 2 },
    { id: 7, name: "装饰部分", level: 2, parent_id: 1 },
    { id: 8, name: "镜头", level: 2, parent_id: 7 },
    { id: 9, name: "扬声器口", level: 2, parent_id: 7 },
    { id: 10, name: "挂绳", level: 2, parent_id: 7 },
    { id: 11, name: "印花", level: 2, parent_id: 7 }
];

let selectedRow = null;
let categoriesData = JSON.parse(JSON.stringify(testData));

document.addEventListener('DOMContentLoaded', function () {
    loadData();

    document.addEventListener('click', () => {
        document.getElementById('contextMenu').style.display = 'none';
    });
});

function loadData() {
    renderTable();
}

function renderTable() {
    const tbody = document.querySelector('#categoryTable tbody');
    const iframe = document.getElementById('iframe');
    const currentPage = iframe.src.match(/DFMEA-page-(\d+)\.html/);

    if (currentPage) {
        const pageNum = parseInt(currentPage[1]);
        if (pageNum >= 4 && pageNum <= 8) {
            if (!tbody) {
                console.warn('找不到 #categoryTable tbody 元素');
                return;
            }

            tbody.innerHTML = '';
            const tree = buildTree(categoriesData, null, true);
            renderTree(tree, tbody, 0, true);

            document.querySelectorAll('.toggle-icon').forEach(icon => {
                icon.addEventListener('click', function() {
                    const rowId = this.parentNode.parentNode.dataset.id;
                    toggleChildren(rowId);
                });
            });
        } else {
            return;
        }
    }
}

function buildTree(items, parentId = null, isRootLevel = false) {
    return items
        .filter(item => item.parent_id == parentId)
        .map(item => {
            const children = buildTree(items, item.id);
            if (children.length > 0) {
                item.children = children;
                item._expanded = isRootLevel;
            }
            return item;
        });
}

function renderTree(tree, parentElement, level, parentExpanded = true) {
    tree.forEach((item, index) => {
        const hasChildren = item.children && item.children.length > 0;
        const row = document.createElement('tr');
        row.dataset.id = item.id;
        row.dataset.level = item.level;
        row.dataset.parentId = item.parent_id || '';
        row.style.display = parentExpanded ? '' : 'none';

        let indent = '';
        for (let i = 0; i < level; i++) {
            indent += '&nbsp;&nbsp;&nbsp;&nbsp;';
        }
        const toggleIcon = hasChildren ?
            `<span class="toggle-icon">${item._expanded ? '−' : '+'}</span>` :
            '<span style="width:10px;display:inline-block;"></span>';
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${indent}${toggleIcon}${item.name}</td>
        `;

        row.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            selectedRow = row;
            const menu = document.getElementById('contextMenu');
            menu.innerHTML = '';

            if (item.level === 1) {
                const btn = document.createElement('button');
                btn.textContent = '添加二级分类';
                btn.onclick = () => addCategory(2);
                menu.appendChild(btn);
            } else if (item.level === 2) {
                const btn = document.createElement('button');
                btn.textContent = '添加三级分类';
                btn.onclick = () => addCategory(3);
                menu.appendChild(btn);
            }

            const hr = document.createElement('hr');
            menu.appendChild(hr);

            const editBtn = document.createElement('button');
            editBtn.textContent = '编辑';
            editBtn.onclick = editCategory;
            menu.appendChild(editBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '删除';
            deleteBtn.onclick = deleteCategory;
            menu.appendChild(deleteBtn);

            menu.style.display = 'block';
            menu.style.left = `${e.pageX}px`;
            menu.style.top = `${e.pageY}px`;
        });

        parentElement.appendChild(row);

        if (hasChildren) {
            renderTree(item.children, parentElement, level + 1, item._expanded && parentExpanded);
        }
    });
}

function toggleChildren(parentId) {
    const parentRow = document.querySelector(`tr[data-id="${parentId}"]`);
    const toggleIcon = parentRow.querySelector('.toggle-icon');
    if (!toggleIcon) return;

    const category = findCategoryById(parentId);
    if (category) {
        category._expanded = !category._expanded;
        toggleIcon.textContent = category._expanded ? '−' : '+';

        const children = document.querySelectorAll(`tr[data-parent-id="${parentId}"]`);
        children.forEach(child => {
            if (child.dataset.parentId === parentId) {
                child.style.display = category._expanded ? '' : 'none';

                if (category._expanded) {
                    const childId = child.dataset.id;
                    const childCategory = findCategoryById(childId);
                    if (childCategory && childCategory._expanded) {
                        showChildrenRecursively(childId);
                    }
                }
            }
        });
    }
}

function showChildrenRecursively(parentId) {
    const children = document.querySelectorAll(`tr[data-parent-id="${parentId}"]`);
    children.forEach(child => {
        child.style.display = '';
        const childId = child.dataset.id;
        const childCategory = findCategoryById(childId);
        if (childCategory && childCategory._expanded) {
            showChildrenRecursively(childId);
        }
    });
}

function findCategoryById(id) {
    const stack = [...categoriesData];
    while (stack.length) {
        const item = stack.pop();
        if (item.id == id) return item;
        if (item.children) stack.push(...item.children);
    }
    return null;
}

function addCategory(level) {
    const menu = document.getElementById('contextMenu');
    menu.style.display = 'none';

    let parentId = null;
    if (level > 1 && selectedRow) {
        if (selectedRow.dataset.level < level) {
            parentId = selectedRow.dataset.id;
        } else {
            alert('只能选择上级分类作为父级');
            return;
        }
    }

    const name = prompt(`请输入${level}级分类名称:`);
    if (!name) return;

    const newId = Math.max(0, ...categoriesData.map(item => item.id)) + 1;
    const newCategory = {
        id: newId,
        name: name,
        level: level,
        parent_id: parentId ? parseInt(parentId) : null,
        _expanded: false
    };
    categoriesData.push(newCategory);

    if (parentId) {
        const parentCategory = findCategoryById(parentId);
        if (parentCategory) {
            parentCategory._expanded = true;
        }
    }

    renderTable();
}

function editCategory() {
    if (!selectedRow) return;

    const id = selectedRow.dataset.id;
    const category = findCategoryById(id);
    if (!category) return;

    const newName = prompt('请输入新名称:', category.name);
    if (!newName || newName === category.name) return;

    category.name = newName;
    renderTable();
}

function deleteCategory() {
    if (!selectedRow || !confirm('确定要删除这个分类及其所有子分类吗？')) return;

    const id = parseInt(selectedRow.dataset.id);

    categoriesData = categoriesData.filter(item =>
        item.id !== id && item.parent_id !== id && !isDescendant(id, item)
    );
    renderTable();
}

function isDescendant(parentId, item) {
    if (!item.parent_id) return false;
    if (item.parent_id === parentId) return true;
    const parent = findCategoryById(item.parent_id);
    return parent ? isDescendant(parentId, parent) : false;
}

function changeContent(menuIndex) {
    let menuItems = document.querySelectorAll('.menu-item');
    let iframe = document.getElementById('iframe');

    menuItems.forEach(button => {
        button.classList.remove('active');
    });

    const buttonIndex = menuIndex - 3;
    if (buttonIndex >= 0 && buttonIndex < menuItems.length) {
        menuItems[buttonIndex].classList.add('active');
    }

    const projectCode = getProjectCode();

    if (projectCode) {
        iframe.src = 'DFMEA-page-' + menuIndex + '.html?code=' + projectCode;
    } else {
        iframe.src = 'DFMEA-page-' + menuIndex + '.html';
    }
}