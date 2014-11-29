class BusinessTripApp {
    constructor() {
        this.currentTab = 'application';
        console.log('BusinessTripApp constructor called');
        this.init();
    }

    init() {
        console.log('BusinessTripApp init called');
        try {
            this.setupTabs();
            this.setupForms();
            this.setupActions();
            this.setupScheduleManagement();
            this.loadSavedData();
            
            // 检查容器是否存在
            setTimeout(() => {
                const appContainer = document.getElementById('app-schedule-container');
                const repContainer = document.getElementById('rep-schedule-container');
                console.log('Init check - app-schedule-container:', appContainer);
                console.log('Init check - rep-schedule-container:', repContainer);
            }, 500);
        } catch (error) {
            console.error('初始化错误:', error);
        }
    }

    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const forms = document.querySelectorAll('.form');

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

        this.disableCopyButton();
    }

    setupForms() {
        const applicationForm = document.getElementById('application-form');
        const reportForm = document.getElementById('report-form');

        this.setupFormListeners(applicationForm, 'application');
        this.setupFormListeners(reportForm, 'report');
        
        // 设置日期监听，自动生成行程
        this.setupDateListeners('application');
        this.setupDateListeners('report');
    }

    setupDateListeners(formType) {
        const form = document.getElementById(`${formType}-form`);
        const startDateInput = form.querySelector(`[name="startDate"]`);
        const endDateInput = form.querySelector(`[name="endDate"]`);

        if (startDateInput && endDateInput) {
            startDateInput.addEventListener('change', () => this.autoGenerateSchedule(formType));
            endDateInput.addEventListener('change', () => this.autoGenerateSchedule(formType));
        }
    }

    setupFormListeners(form, formType) {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.saveFormData(formType);
            });
            input.addEventListener('blur', () => {
                this.saveFormData(formType);
            });
        });
    }

    setupActions() {
        const generateBtn = document.getElementById('generate-btn');
        const clearBtn = document.getElementById('clear-btn');
        const copyBtn = document.getElementById('copy-btn');

        generateBtn.addEventListener('click', () => this.generatePreview());
        clearBtn.addEventListener('click', () => this.clearForm());
        copyBtn.addEventListener('click', () => this.copyToClipboard());
    }

    setupScheduleManagement() {
        // 移除手动添加按钮的事件监听
        // 现在行程是自动生成的
    }

    autoGenerateSchedule(formType) {
        const form = document.getElementById(`${formType}-form`);
        const startDateInput = form.querySelector(`[name="startDate"]`);
        const endDateInput = form.querySelector(`[name="endDate"]`);

        const startDate = startDateInput.value;
        const endDate = endDateInput.value;

        if (!startDate || !endDate) {
            return; // 日期未填写，不生成行程
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start > end) {
            return; // 出发日期晚于返回日期，不生成行程
        }

        // 计算日期范围
        const dateRange = [];
        let currentDate = new Date(start);
        
        while (currentDate <= end) {
            dateRange.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // 为每天生成上午和下午两个半天
        const scheduleData = [];
        dateRange.forEach(date => {
            const dateStr = date.toISOString().split('T')[0];
            scheduleData.push({
                date: dateStr,
                period: '上午',
                type: '',
                description: ''
            });
            scheduleData.push({
                date: dateStr,
                period: '下午',
                type: '',
                description: ''
            });
        });

        // 生成行程项
        this.generateScheduleItems(formType, scheduleData);
    }

    generateScheduleItems(formType, scheduleData) {
        const containerMap = {
            'application': 'app-schedule-container',
            'report': 'rep-schedule-container'
        };
        
        const containerId = containerMap[formType];
        const container = document.getElementById(containerId);
        
        if (!container) {
            console.error(`容器 ${containerId} 未找到`);
            return;
        }

        // 清空容器
        container.innerHTML = '';

        // 保存现有数据（如果有）
        const existingData = this.collectScheduleData(formType);

        // 生成新的行程项
        scheduleData.forEach((item, index) => {
            const scheduleItem = this.createScheduleItem(formType, index + 1, item, existingData);
            container.appendChild(scheduleItem);
        });

        this.showToast(`已自动生成 ${scheduleData.length} 个半天行程`, 'success');
    }

    createScheduleItem(formType, itemCount, itemData, existingData) {
        // 查找是否有对应的数据可以恢复
        const existingItem = existingData.find(data => 
            data.date === itemData.date && data.period === itemData.period
        );

        const type = existingItem ? existingItem.type : itemData.type;
        const description = existingItem ? existingItem.description : itemData.description;

        const scheduleItem = document.createElement('div');
        scheduleItem.className = 'schedule-item';
        scheduleItem.dataset.index = itemCount;
        scheduleItem.style.cssText = 'background: white; border: 1px solid #ddd; border-radius: 6px; padding: 15px; margin: 10px 0;';
        
        scheduleItem.innerHTML = `
            <div class="schedule-row" style="display: grid; grid-template-columns: 1fr 1fr 2fr; gap: 15px; align-items: start;">
                <div class="form-group">
                    <label style="display: block; margin-bottom: 8px; color: #333; font-weight: 500; font-size: 14px;">日期</label>
                    <input type="date" name="schedule_${itemCount}_date" value="${itemData.date}" readonly style="width: 100%; padding: 12px; border: 2px solid #e9ecef; border-radius: 6px; font-size: 14px; background: #f8f9fa;">
                </div>
                <div class="form-group">
                    <label style="display: block; margin-bottom: 8px; color: #333; font-weight: 500; font-size: 14px;">时间段</label>
                    <input type="text" name="schedule_${itemCount}_period" value="${itemData.period}" readonly style="width: 100%; padding: 12px; border: 2px solid #e9ecef; border-radius: 6px; font-size: 14px; background: #f8f9fa;">
                </div>
                <div class="form-group">
                    <label style="display: block; margin-bottom: 8px; color: #333; font-weight: 500; font-size: 14px;">出差类型 *</label>
                    <select name="schedule_${itemCount}_type" required style="width: 100%; padding: 12px; border: 2px solid #e9ecef; border-radius: 6px; font-size: 14px;">
                        <option value="">请选择</option>
                        <option value="客户拜访" ${type === '客户拜访' ? 'selected' : ''}>客户拜访</option>
                        <option value="会议参会" ${type === '会议参会' ? 'selected' : ''}>会议参会</option>
                        <option value="项目现场工作" ${type === '项目现场工作' ? 'selected' : ''}>项目现场工作</option>
                        <option value="培训学习" ${type === '培训学习' ? 'selected' : ''}>培训学习</option>
                        <option value="考察调研" ${type === '考察调研' ? 'selected' : ''}>考察调研</option>
                        <option value="其他" ${type === '其他' ? 'selected' : ''}>其他</option>
                    </select>
                </div>
            </div>
            <div class="form-group" style="margin-top: 15px;">
                <label style="display: block; margin-bottom: 8px; color: #333; font-weight: 500; font-size: 14px;">具体动作描述 *</label>
                <textarea name="schedule_${itemCount}_description" rows="3" required placeholder="请描述具体的工作内容和动作" style="width: 100%; padding: 12px; border: 2px solid #e9ecef; border-radius: 6px; font-size: 14px; font-family: inherit;">${description}</textarea>
            </div>
        `;

        // 添加事件监听
        const inputs = scheduleItem.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.saveFormData(formType);
            });
            input.addEventListener('blur', () => {
                this.saveFormData(formType);
            });
        });

        return scheduleItem;
    }

    collectScheduleData(formType) {
        const containerMap = {
            'application': 'app-schedule-container',
            'report': 'rep-schedule-container'
        };
        
        const containerId = containerMap[formType];
        const container = document.getElementById(containerId);
        
        if (!container) {
            return [];
        }

        const scheduleData = [];
        const items = container.querySelectorAll('.schedule-item');
        
        items.forEach(item => {
            const dateInput = item.querySelector('[name$="_date"]');
            const periodInput = item.querySelector('[name$="_period"]');
            const typeInput = item.querySelector('[name$="_type"]');
            const descInput = item.querySelector('[name$="_description"]');
            
            if (dateInput && periodInput) {
                scheduleData.push({
                    date: dateInput.value,
                    period: periodInput.value,
                    type: typeInput ? typeInput.value : '',
                    description: descInput ? descInput.value : ''
                });
            }
        });

        return scheduleData;
    }

    addScheduleItem(formType) {
        console.log('=== addScheduleItem 开始 ===');
        console.log('formType:', formType);
        console.log('当前标签页:', this.currentTab);
        
        // 修复容器ID映射问题
        const containerMap = {
            'application': 'app-schedule-container',
            'report': 'rep-schedule-container'
        };
        
        const containerId = containerMap[formType] || `${formType}-schedule-container`;
        console.log('查找容器ID:', containerId);
        
        const container = document.getElementById(containerId);
        console.log('容器元素:', container);
        console.log('容器类型:', container ? container.constructor.name : 'N/A');
        
        if (!container) {
            console.error(`❌ 容器 ${containerId} 未找到！`);
            
            // 列出页面上的所有容器
            const allContainers = document.querySelectorAll('[id$="-schedule-container"]');
            console.log('页面上所有schedule-container:', allContainers);
            
            this.showToast(`无法找到${formType === 'application' ? '申请' : '报告'}行程容器`, 'error');
            return;
        }
        
        console.log('✅ 容器找到成功！');
        console.log('容器当前内容:', container.innerHTML.substring(0, 100));
        
        // 清除容器中的初始提示文字
        const placeholder = container.querySelector('p[style*="color: #999"]');
        if (placeholder) {
            console.log('清除初始提示文字');
            placeholder.remove();
        }
        
        const itemCount = container.querySelectorAll('.schedule-item').length + 1;
        console.log('当前项目数量:', itemCount);
        
        const scheduleItem = document.createElement('div');
        scheduleItem.className = 'schedule-item';
        scheduleItem.dataset.index = itemCount;
        scheduleItem.style.cssText = 'background: white; border: 1px solid #ddd; border-radius: 6px; padding: 15px; margin: 10px 0;';
        
        scheduleItem.innerHTML = `
            <div class="schedule-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <span class="schedule-title" style="font-weight: 600; color: #333; font-size: 16px;">第 ${itemCount} 个半天</span>
                <button type="button" class="btn-remove" data-index="${itemCount}" style="background: #dc3545; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">删除</button>
            </div>
            <div class="schedule-row" style="display: grid; grid-template-columns: 1fr 1fr 2fr; gap: 15px; align-items: start;">
                <div class="form-group">
                    <label style="display: block; margin-bottom: 8px; color: #333; font-weight: 500; font-size: 14px;">日期 *</label>
                    <input type="date" name="schedule_${itemCount}_date" required style="width: 100%; padding: 12px; border: 2px solid #e9ecef; border-radius: 6px; font-size: 14px;">
                </div>
                <div class="form-group">
                    <label style="display: block; margin-bottom: 8px; color: #333; font-weight: 500; font-size: 14px;">时间段 *</label>
                    <select name="schedule_${itemCount}_period" required style="width: 100%; padding: 12px; border: 2px solid #e9ecef; border-radius: 6px; font-size: 14px;">
                        <option value="">请选择</option>
                        <option value="上午">上午</option>
                        <option value="下午">下午</option>
                    </select>
                </div>
                <div class="form-group">
                    <label style="display: block; margin-bottom: 8px; color: #333; font-weight: 500; font-size: 14px;">出差类型 *</label>
                    <select name="schedule_${itemCount}_type" required style="width: 100%; padding: 12px; border: 2px solid #e9ecef; border-radius: 6px; font-size: 14px;">
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
            <div class="form-group" style="margin-top: 15px;">
                <label style="display: block; margin-bottom: 8px; color: #333; font-weight: 500; font-size: 14px;">具体动作描述 *</label>
                <textarea name="schedule_${itemCount}_description" rows="3" required placeholder="请描述具体的工作内容和动作" style="width: 100%; padding: 12px; border: 2px solid #e9ecef; border-radius: 6px; font-size: 14px; font-family: inherit;"></textarea>
            </div>
        `;

        console.log('准备添加行程项目到容器');
        container.appendChild(scheduleItem);
        console.log('✅ 行程项目已添加');

        const removeBtn = scheduleItem.querySelector('.btn-remove');
        removeBtn.addEventListener('click', () => {
            container.removeChild(scheduleItem);
            this.updateScheduleTitles(container);
            this.saveFormData(formType);
        });

        const inputs = scheduleItem.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.saveFormData(formType);
            });
            input.addEventListener('blur', () => {
                this.saveFormData(formType);
            });
        });

        this.saveFormData(formType);
        this.showToast('已添加半天行程', 'success');
        console.log('=== addScheduleItem 完成 ===');
    }

    updateScheduleTitles(container) {
        const items = container.querySelectorAll('.schedule-item');
        items.forEach((item, index) => {
            const title = item.querySelector('.schedule-title');
            title.textContent = `第 ${index + 1} 个半天`;
            item.dataset.index = index + 1;
            
            const removeBtn = item.querySelector('.btn-remove');
            removeBtn.dataset.index = index + 1;
        });
    }

    generatePreview() {
        const formData = this.collectFormData();
        
        if (!this.validateFormData(formData)) {
            return;
        }

        let email;
        if (this.currentTab === 'application') {
            email = generateApplicationEmail(formData);
        } else {
            email = generateReportEmail(formData);
        }

        this.displayPreview(email);
        this.enableCopyButton();
        this.showToast('预览生成成功', 'success');
    }

    collectFormData() {
        const form = document.getElementById(`${this.currentTab}-form`);
        const formData = new FormData(form);
        const data = {};
        const scheduleItems = [];

        for (let [key, value] of formData.entries()) {
            if (key.startsWith('schedule_')) {
                const parts = key.split('_');
                const index = parseInt(parts[1]);
                const field = parts[2];
                
                if (!scheduleItems[index]) {
                    scheduleItems[index] = {};
                }
                scheduleItems[index][field] = value;
            } else {
                data[key] = value;
            }
        }

        // 重新组织行程数据
        const organizedScheduleItems = [];
        const containerMap = {
            'application': 'app-schedule-container',
            'report': 'rep-schedule-container'
        };
        
        const containerId = containerMap[this.currentTab];
        const container = document.getElementById(containerId);
        
        if (container) {
            const items = container.querySelectorAll('.schedule-item');
            items.forEach(item => {
                const dateInput = item.querySelector('[name$="_date"]');
                const periodInput = item.querySelector('[name$="_period"]');
                const typeInput = item.querySelector('[name$="_type"]');
                const descInput = item.querySelector('[name$="_description"]');
                
                if (dateInput && periodInput) {
                    organizedScheduleItems.push({
                        date: dateInput.value,
                        period: periodInput.value,
                        type: typeInput ? typeInput.value : '',
                        description: descInput ? descInput.value : ''
                    });
                }
            });
        }

        data.scheduleItems = organizedScheduleItems.filter(item => item !== undefined);

        return data;
    }

    validateFormData(data) {
        const requiredFields = this.getRequiredFields();
        
        for (const field of requiredFields) {
            if (!data[field] || data[field].trim() === '') {
                this.showToast(`请填写${this.getFieldLabel(field)}`, 'error');
                this.highlightField(field);
                return false;
            }
        }

        if (data.startDate && data.endDate) {
            const start = new Date(data.startDate);
            const end = new Date(data.endDate);
            
            if (start > end) {
                this.showToast('出发日期不能晚于返回日期', 'error');
                this.highlightField('startDate');
                this.highlightField('endDate');
                return false;
            }
        }

        if (!data.scheduleItems || data.scheduleItems.length === 0) {
            this.showToast('请至少添加一个半天行程', 'error');
            return false;
        }

        for (let i = 0; i < data.scheduleItems.length; i++) {
            const item = data.scheduleItems[i];
            if (!item.date || !item.period || !item.type || !item.description) {
                this.showToast(`第 ${i + 1} 个半天行程信息不完整`, 'error');
                return false;
            }
        }

        return true;
    }

    getRequiredFields() {
        if (this.currentTab === 'application') {
            return ['name', 'department', 'position', 'startDate', 'endDate', 'location', 'transport'];
        } else {
            return ['name', 'department', 'position', 'startDate', 'endDate', 'location', 'summary'];
        }
    }

    getFieldLabel(field) {
        const labels = {
            'name': '姓名',
            'department': '部门',
            'position': '职位',
            'startDate': '出发日期',
            'endDate': '返回日期',
            'location': '出差地点',
            'transport': '交通方式',
            'summary': '出差总结'
        };
        return labels[field] || field;
    }

    highlightField(field) {
        const form = document.getElementById(`${this.currentTab}-form`);
        const input = form.querySelector(`[name="${field}"]`);
        
        if (input) {
            input.style.borderColor = '#dc3545';
            input.focus();
            
            setTimeout(() => {
                input.style.borderColor = '';
            }, 3000);
        }
    }

    displayPreview(email) {
        const previewContent = document.getElementById('preview-content');
        previewContent.innerHTML = email.content;
    }

    enableCopyButton() {
        const copyBtn = document.getElementById('copy-btn');
        copyBtn.disabled = false;
    }

    disableCopyButton() {
        const copyBtn = document.getElementById('copy-btn');
        copyBtn.disabled = true;
    }

    async copyToClipboard() {
        const previewContent = document.getElementById('preview-content');
        
        try {
            // 获取完整的HTML内容
            const htmlContent = previewContent.innerHTML;
            
            // 创建带有完整样式的HTML
            const styledHtml = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                        th { background: #667eea; color: white; padding: 12px; text-align: left; font-weight: bold; }
                        td { padding: 12px; border: 1px solid #dee2e6; }
                        tr:nth-child(even) { background: #f8f9fa; }
                        h2, h3 { color: #333; }
                    </style>
                </head>
                <body>
                    ${htmlContent}
                </body>
                </html>
            `;
            
            if (navigator.clipboard && navigator.clipboard.write) {
                await navigator.clipboard.write([
                    new ClipboardItem({
                        'text/html': new Blob([styledHtml], { type: 'text/html' }),
                        'text/plain': new Blob([this.htmlToPlainText(htmlContent)], { type: 'text/plain' })
                    })
                ]);
                this.showToast('已复制完整表格格式到剪贴板', 'success');
            } else {
                this.fallbackCopy(styledHtml);
            }
        } catch (err) {
            console.error('复制失败:', err);
            this.fallbackCopy(previewContent.innerHTML);
        }
    }

    fallbackCopy(htmlContent) {
        const textContent = this.htmlToPlainText(htmlContent);
        
        const textarea = document.createElement('textarea');
        textarea.value = textContent;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        
        try {
            textarea.select();
            document.execCommand('copy');
            this.showToast('已复制到剪贴板', 'success');
        } catch (err) {
            this.showToast('复制失败，请手动复制', 'error');
        }
        
        document.body.removeChild(textarea);
    }

    htmlToPlainText(html) {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        
        const tables = temp.querySelectorAll('table');
        tables.forEach(table => {
            const rows = table.querySelectorAll('tr');
            rows.forEach(row => {
                const cells = row.querySelectorAll('td, th');
                const text = Array.from(cells).map(cell => cell.textContent.trim()).join(' | ');
                row.textContent = text;
            });
        });
        
        return temp.textContent.replace(/\n\s*\n/g, '\n\n').trim();
    }

    clearForm() {
        const form = document.getElementById(`${this.currentTab}-form`);
        form.reset();
        
        const container = document.getElementById(`${this.currentTab}-schedule-container`);
        container.innerHTML = '';
        
        this.clearPreview();
        this.disableCopyButton();
        this.clearSavedData(this.currentTab);
        this.showToast('表单已清空', 'info');
    }

    clearPreview() {
        const previewContent = document.getElementById('preview-content');
        previewContent.innerHTML = '<p class="placeholder">点击"生成预览"按钮查看生成的邮件内容</p>';
    }

    saveFormData(formType) {
        const form = document.getElementById(`${formType}-form`);
        const formData = new FormData(form);
        const data = {};

        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        try {
            localStorage.setItem(`businessTrip_${formType}`, JSON.stringify(data));
        } catch (err) {
            console.warn('无法保存到本地存储:', err);
        }
    }

    loadSavedData() {
        this.loadFormData('application');
        this.loadFormData('report');
    }

    loadFormData(formType) {
        try {
            const savedData = localStorage.getItem(`businessTrip_${formType}`);
            if (savedData) {
                const data = JSON.parse(savedData);
                const form = document.getElementById(`${formType}-form`);

                for (const [key, value] of Object.entries(data)) {
                    if (key !== 'scheduleItems') {
                        const input = form.querySelector(`[name="${key}"]`);
                        if (input) {
                            input.value = value;
                        }
                    }
                }

                // 如果有出发和返回日期，自动生成行程
                if (data.startDate && data.endDate) {
                    // 延迟执行，确保DOM已更新
                    setTimeout(() => {
                        this.autoGenerateSchedule(formType);
                        
                        // 恢复已保存的行程数据
                        if (data.scheduleItems && data.scheduleItems.length > 0) {
                            this.restoreScheduleData(formType, data.scheduleItems);
                        }
                    }, 100);
                }
            }
        } catch (err) {
            console.warn('无法加载本地存储数据:', err);
        }
    }

    restoreScheduleData(formType, scheduleItems) {
        const containerMap = {
            'application': 'app-schedule-container',
            'report': 'rep-schedule-container'
        };
        
        const containerId = containerMap[formType];
        const container = document.getElementById(containerId);
        
        if (!container) {
            return;
        }

        const items = container.querySelectorAll('.schedule-item');
        
        scheduleItems.forEach((savedItem, index) => {
            if (items[index]) {
                const typeInput = items[index].querySelector('[name$="_type"]');
                const descInput = items[index].querySelector('[name$="_description"]');
                
                if (typeInput && savedItem.type) {
                    typeInput.value = savedItem.type;
                }
                if (descInput && savedItem.description) {
                    descInput.value = savedItem.description;
                }
            }
        });
    }

    clearSavedData(formType) {
        try {
            localStorage.removeItem(`businessTrip_${formType}`);
        } catch (err) {
            console.warn('无法清除本地存储数据:', err);
        }
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.appInstance = new BusinessTripApp();
});