function generateApplicationEmail(formData) {
    const subject = `出差申请 - ${formData.name} - ${formData.startDate}`;
    
    // 生成行程表格（包含所有列）
    let scheduleTable = '';
    if (formData.scheduleItems && formData.scheduleItems.length > 0) {
        scheduleTable = `
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <tr style="background: #667eea; color: white;">
                    <th style="padding: 12px; border: 1px solid #dee2e6; text-align: left;">日期</th>
                    <th style="padding: 12px; border: 1px solid #dee2e6; text-align: left;">时间段</th>
                    <th style="padding: 12px; border: 1px solid #dee2e6; text-align: left;">出差类型</th>
                    <th style="padding: 12px; border: 1px solid #dee2e6; text-align: left;">具体动作描述</th>
                </tr>
        `;
        
        formData.scheduleItems.forEach(item => {
            scheduleTable += `
                <tr>
                    <td style="padding: 12px; border: 1px solid #dee2e6;">${item.date}</td>
                    <td style="padding: 12px; border: 1px solid #dee2e6;">${item.period}</td>
                    <td style="padding: 12px; border: 1px solid #dee2e6;">${item.type}</td>
                    <td style="padding: 12px; border: 1px solid #dee2e6;">${item.description.replace(/\n/g, '<br>')}</td>
                </tr>
            `;
        });
        
        scheduleTable += `</table>`;
    }
    
    const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
            <h2 style="color: #333; text-align: center; border-bottom: 3px solid #667eea; padding-bottom: 15px; margin-bottom: 30px;">${subject}</h2>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <tr style="background: #667eea; color: white;">
                    <th colspan="4" style="padding: 15px; text-align: left; font-size: 18px;">基本信息</th>
                </tr>
                <tr>
                    <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold; width: 25%;">姓名</td>
                    <td style="padding: 12px; border: 1px solid #dee2e6;">${formData.name}</td>
                    <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold; width: 25%;">部门</td>
                    <td style="padding: 12px; border: 1px solid #dee2e6;">${formData.department}</td>
                </tr>
                <tr>
                    <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">职位</td>
                    <td style="padding: 12px; border: 1px solid #dee2e6;">${formData.position}</td>
                    <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">联系方式</td>
                    <td style="padding: 12px; border: 1px solid #dee2e6;">${formData.contact || ''}</td>
                </tr>
            </table>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <tr style="background: #667eea; color: white;">
                    <th colspan="4" style="padding: 15px; text-align: left; font-size: 18px;">出差安排</th>
                </tr>
                <tr>
                    <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold; width: 25%;">出发日期</td>
                    <td style="padding: 12px; border: 1px solid #dee2e6;">${formData.startDate}</td>
                    <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold; width: 25%;">返回日期</td>
                    <td style="padding: 12px; border: 1px solid #dee2e6;">${formData.endDate}</td>
                </tr>
                <tr>
                    <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">出差地点</td>
                    <td colspan="3" style="padding: 12px; border: 1px solid #dee2e6;">${formData.location}</td>
                </tr>
                <tr>
                    <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">交通方式</td>
                    <td colspan="3" style="padding: 12px; border: 1px solid #dee2e6;">${formData.transport}</td>
                </tr>
            </table>
            
            <h3 style="color: #333; margin-bottom: 15px; font-size: 18px;">出差行程安排</h3>
            ${scheduleTable}
        </div>
    `;

    return {
        subject: subject,
        content: emailContent.trim()
    };
}

function generateReportEmail(formData) {
    const subject = `出差报告 - ${formData.name} - ${formData.startDate}`;
    
    // 生成行程表格（包含所有列）
    let scheduleTable = '';
    if (formData.scheduleItems && formData.scheduleItems.length > 0) {
        scheduleTable = `
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <tr style="background: #667eea; color: white;">
                    <th style="padding: 12px; border: 1px solid #dee2e6; text-align: left;">日期</th>
                    <th style="padding: 12px; border: 1px solid #dee2e6; text-align: left;">时间段</th>
                    <th style="padding: 12px; border: 1px solid #dee2e6; text-align: left;">出差类型</th>
                    <th style="padding: 12px; border: 1px solid #dee2e6; text-align: left;">具体动作描述</th>
                </tr>
        `;
        
        formData.scheduleItems.forEach(item => {
            scheduleTable += `
                <tr>
                    <td style="padding: 12px; border: 1px solid #dee2e6;">${item.date}</td>
                    <td style="padding: 12px; border: 1px solid #dee2e6;">${item.period}</td>
                    <td style="padding: 12px; border: 1px solid #dee2e6;">${item.type}</td>
                    <td style="padding: 12px; border: 1px solid #dee2e6;">${item.description.replace(/\n/g, '<br>')}</td>
                </tr>
            `;
        });
        
        scheduleTable += `</table>`;
    }
    
    const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
            <h2 style="color: #333; text-align: center; border-bottom: 3px solid #667eea; padding-bottom: 15px; margin-bottom: 30px;">${subject}</h2>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <tr style="background: #667eea; color: white;">
                    <th colspan="4" style="padding: 15px; text-align: left; font-size: 18px;">基本信息</th>
                </tr>
                <tr>
                    <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold; width: 25%;">姓名</td>
                    <td style="padding: 12px; border: 1px solid #dee2e6;">${formData.name}</td>
                    <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold; width: 25%;">部门</td>
                    <td style="padding: 12px; border: 1px solid #dee2e6;">${formData.department}</td>
                </tr>
                <tr>
                    <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">职位</td>
                    <td style="padding: 12px; border: 1px solid #dee2e6;">${formData.position}</td>
                    <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">联系方式</td>
                    <td style="padding: 12px; border: 1px solid #dee2e6;">${formData.contact || ''}</td>
                </tr>
            </table>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <tr style="background: #667eea; color: white;">
                    <th colspan="4" style="padding: 15px; text-align: left; font-size: 18px;">出差信息</th>
                </tr>
                <tr>
                    <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold; width: 25%;">出发日期</td>
                    <td style="padding: 12px; border: 1px solid #dee2e6;">${formData.startDate}</td>
                    <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold; width: 25%;">返回日期</td>
                    <td style="padding: 12px; border: 1px solid #dee2e6;">${formData.endDate}</td>
                </tr>
                <tr>
                    <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">出差地点</td>
                    <td colspan="3" style="padding: 12px; border: 1px solid #dee2e6;">${formData.location}</td>
                </tr>
            </table>
            
            <h3 style="color: #333; margin-bottom: 15px; font-size: 18px;">出差行程回顾</h3>
            ${scheduleTable}
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <tr style="background: #667eea; color: white;">
                    <th colspan="1" style="padding: 15px; text-align: left; font-size: 18px;">出差总结</th>
                </tr>
                <tr>
                    <td style="padding: 15px; border: 1px solid #dee2e6;">${formData.summary.replace(/\n/g, '<br>')}</td>
                </tr>
            </table>
        </div>
    `;

    return {
        subject: subject,
        content: emailContent.trim()
    };
}