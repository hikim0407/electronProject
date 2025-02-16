const path = window.electronAPI.getPath();

function loadPage(fileName, scriptFile, cssFile) {
    const contentDiv = document.getElementById('content');
    window.electronAPI.readFile(fileName).then(res => {
        contentDiv.innerHTML = res.data;

        // 기존 CSS 제거
        const existingCss = document.getElementById('dynamic-css');
        if (existingCss) existingCss.remove();

        // 새로운 CSS 추가
        if (cssFile) {
            const link = document.createElement('link');
            link.id = 'dynamic-css';
            link.rel = 'stylesheet';
            link.href = path.join(res.appPath, cssFile);
            document.head.appendChild(link);
        }

        // 기존 JS 제거
        const existingScript = document.getElementById('dynamic-script');
        if (existingScript) existingScript.remove();

        window.electronAPI.removeInterval();

        // 새로운 JS 추가
        if (scriptFile) {
            const script = document.createElement('script');
            script.id = 'dynamic-script';
            script.src = path.join(res.appPath, scriptFile);
            script.defer = true; // HTML 로드 후 실행
            document.body.appendChild(script);
        }
    });
}

// 버튼 클릭 시 HTML + CSS + JS 로드
document.getElementById('dashboard-btn').addEventListener('click', () => {
    loadPage('/dashboard/dashboard.html', '/dashboard/dashboard.js', '/dashboard/dashboard.css');
});

document.getElementById('settings-btn').addEventListener('click', () => {
    loadPage('/setting/setting.html', '/setting/setting.js', '/setting/setting.css');
});

loadPage('/dashboard/dashboard.html', '/dashboard/dashboard.js', '/dashboard/dashboard.css');