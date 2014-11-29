// 简化版本的JavaScript，专注于解决添加行程问题

class SimpleBusinessTripApp {
    constructor() {
        this.currentTab = 'application';
        console.log('SimpleBusinessTripApp 初始化');
        this.init();
    }

    init() {
        console.log('开始初始化...');
        this.setupTabs();
        this.setupActions();
        console.log('初始化完成');
    }

    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tab = button.dataset.tab;
                this.switchTab(tab);
            });
        });
    }

    switchTab(tab) {
        this.currentTab = tab;
        
        const tabButtons = document.querySelectorAll('.tab-btn');
        const forms = document.querySelectorAll('.form');

        tabButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.tab === tab);
        });

        forms.forEach(form => {
            form.classList.toggle('active', form.id === `${tab}-form`);
        });
    }

    setupActions() {
        // 生成按钮
        const generateBtn = document.getElementById('generate-btn');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                alert('生成功能待实现');
            });
        }

        // 清空按钮
        const clearBtn = document.getElementById('clear-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (confirm('确定要清空表单吗？')) {
                    document.getElementById(`${this.currentTab}-form`).reset();
                }
            });
        }
    }
}

// 全局添加行程函数
window.addAppSchedule = function() {
    console.log('addAppSchedule 被调用');
    addScheduleItem('application');
};

window.addRepSchedule = function() {
    console.log('addRepSchedule 被调用');
    addScheduleItem('report');
};

// 核心添加行程函数
function addScheduleItem(formType) {
    console.log('addScheduleItem 开始，类型:', formType);
    
    const containerId = `${formType}-schedule-container`;
    console.log('查找容器ID:', containerId);
    
    // 直接通过document.getElementById查找
    const container = document.getElementById(containerId);
    console.log('容器结果:', container);
    
    if (!container) {
        console.error('容器未找到！');
        alert('无法找到行程容器，请检查页面是否正确加载');
        return;
    }
    
    console.log('容器找到成功！');
    
    // 清除初始提示
    const placeholder = container.querySelector('p[style*="color: #999"]');
    if (placeholder) {
        placeholder.remove();
    }
    
    const itemCount = container.querySelectorAll('.schedule-item').length + 1;
    console.log('当前项目数:', itemCount);
    
    // 创建行程项
    const scheduleItem = document.createElement('div');
    scheduleItem.className = 'schedule-item';
    scheduleItem.dataset.index = itemCount;
    scheduleItem.style.cssText = 'background: white; border: 1px solid #ddd; border-radius: 6px; padding: 15px; margin: 10px 0;';
    
    scheduleItem.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <strong style="font-size: 16px; color: #333;">第 ${itemCount} 个半天</strong>
            <button type="button" onclick="removeScheduleItem(this, '${formType}')" style="background: #dc3545; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">删除</button>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr 2fr; gap: 15px; margin-bottom: 15px;">
            <div>
                <label style="display: block; margin-bottom: 5px; font-weight: 500;">日期 *</label>
                <input type="date" name="schedule_${itemCount}_date" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            <div>
                <label style="display: block; margin-bottom: 5px; font-weight: 500;">时间段 *</label>
                <select name="schedule_${itemCount}_period" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    <option value="">请选择</option>
                    <option value="上午">上午</option>
                    <option value="下午">下午</option>
                </select>
            </div>
            <div>
                <label style="display: block; margin-bottom: 5px; font-weight: 500;">出差类型 *</label>
                <select name="schedule_${itemCount}_type" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    <option value="">请选择</option>
                    <option value="客户拜访">客户拜访</option>
                    <option value="会议参会">会议参会</option>
                    <option value="项目现场工作">项目现场工作</option>
                    <option value="培训学习">培训学习</option>
                    <option value="考察调研">考察调研</option>
                    <option value="其他">其他</option>
                </select>
            </div>
        </div>
        <div>
            <label style="display: block; margin-bottom: 5px; font-weight: 500;">具体动作描述 *</label>
            <textarea name="schedule_${itemCount}_description" rows="3" required placeholder="请描述具体的工作内容和动作" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"></textarea>
        </div>
    `;
    
    container.appendChild(scheduleItem);
    console.log('行程项添加成功！');
}

// 全局删除函数
window.removeScheduleItem = function(button, formType) {
    const item = button.closest('.schedule-item');
    const container = document.getElementById(`${formType}-schedule-container`);
    container.removeChild(item);
    updateScheduleNumbers(container);
};

function updateScheduleNumbers(container) {
    const items = container.querySelectorAll('.schedule-item');
    items.forEach((item, index) => {
        const title = item.querySelector('strong');
        title.textContent = '第 ' + (index + 1) + ' 个半天';
    });
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM 加载完成');
    
    try {
        window.appInstance = new SimpleBusinessTripApp();
        console.log('应用实例创建成功');
    } catch (error) {
        console.error('应用初始化错误:', error);
    }
    
    // 延迟检查
    setTimeout(() => {
        console.log('=== 状态检查 ===');
        console.log('window.appInstance:', window.appInstance);
        console.log('window.addAppSchedule:', typeof window.addAppSchedule);
        console.log('window.addRepSchedule:', typeof window.addRepSchedule);
        
        const appContainer = document.getElementById('app-schedule-container');
        const repContainer = document.getElementById('rep-schedule-container');
        console.log('app-schedule-container:', appContainer);
        console.log('rep-schedule-container:', repContainer);
    }, 500);
});