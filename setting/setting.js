function dateFormat(date) {
    return `${date.substr(0,4)}-${date.substr(4,2)}-${date.substr(6,2)}`
};

async function init() {
    try {
        const settings = await window.electronAPI.loadSettings();
        document.getElementById('input1').value = settings.multiple || '';  // 배수
        document.getElementById('input2').value = dateFormat(settings.startDate) || ''; // 시작일
        document.getElementById('input3').value = settings.stationName || ''; // 역명
    } catch (error) {
        console.error('설정을 불러오는데 실패했습니다:', error);
    }
};

init();

document.getElementById('save-btn').addEventListener('click', async () => {
    const settings = {
        multiple: document.getElementById('input1').value,
        startDate: document.getElementById('input2').value.replaceAll("-", ""),
        stationName: document.getElementById('input3').value,
    };

    try {
        await window.electronAPI.saveSettings(settings);
        window.electronAPI.alert("설정이 저장되었습니다.").then(res => {
            
        });
        document.getElementById('input1').focus();
        document.getElementById('input1').blur();
    } catch (error) {
        console.error('설정 저장 실패:', error);
        alert('설정 저장에 실패했습니다.');
    }
});

document.getElementById('input1').addEventListener('input', function(e) {
    this.value = this.value.replace(/[^0-9]/g, '');
    
    if (this.value.length > 6) {
        this.value = this.value.slice(0, 6);
    }
});