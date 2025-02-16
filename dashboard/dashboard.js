async function initializeInputs() {
    const settings = await window.electronAPI.loadSettings();
    
    const year = settings.startDate.substr(0,4)
    const month = settings.startDate.substr(4,2);
    const day = settings.startDate.substr(6,2);
    document.getElementById('year').value = year;
    document.getElementById('month').value = month;
    document.getElementById('day').value = day;

    const now = new Date();
    const cYear = String(now.getFullYear());
    const cMonth = String(now.getMonth() + 1).padStart(2, '0');
    const cDay = String(now.getDate()).padStart(2, '0');

    document.getElementById('current-year').value = cYear;
    document.getElementById('current-month').value = cMonth;
    document.getElementById('current-day').value = cDay;

    document.getElementById('achieve').value = (new Date(`${cYear}-${cMonth}-${cDay}`) - new Date(`${year}-${month}-${day}`)) / (1000*60*60*24) + 1;

    const calc = Math.ceil(Number(document.getElementById('achieve').value) / Number(settings.multiple));
    document.getElementById('multiple').value = calc;
    document.getElementById('purpose').value = calc * settings.multiple;

    document.getElementById('station-name').value = settings.stationName;
}

// 현재 시간을 업데이트하는 함수
function updateTime() {
    if(document.getElementById('current-time') == null) return;
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('current-time').value = `${hours}:${minutes}`;
}

async function init() {
    await initializeInputs();
    updateTime();

    const timeUpdateInterval = setInterval(updateTime, 1000);
    window.electronAPI.registerInterval(timeUpdateInterval);
};

init();