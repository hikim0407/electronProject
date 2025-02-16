const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

// API 정의를 한 번만 수행
const electronAPI = {
    getAppPath: () => ipcRenderer.invoke('get-app-path'),
    readFile: (fileName) => {
        return new Promise((resolve, reject) => {
            ipcRenderer.invoke('get-app-path').then(appPath => {
                const filePath = path.join(appPath, fileName);
                fs.readFile(filePath, 'utf8', (err, data) => {
                    if (err) {
                        reject('Error loading file');
                    } else {
                        const result = {
                            "data": data,
                            "appPath": appPath,
                        };
                        resolve(result);
                    }
                });
            });
        });
    },
    getPath: () => {
        return path;
    },
    registerInterval: (interval) => ipcRenderer.invoke('register-interval', interval),
    removeInterval: () => ipcRenderer.invoke('remove-interval'),
    loadDashboard: () => ipcRenderer.invoke('load-dashboard'),
    loadSetting: () => ipcRenderer.invoke('load-setting'),
    loadSettings: () => ipcRenderer.invoke('load-settings'),
    saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
    alert: (message) => ipcRenderer.invoke('show-alert', message),
    loadStationInfo: () => {
        return {
            '1': [
                '계양역', '귤현역', '박촌역', '임학역', '계산역', 
                '경인교대입구역', '작전역', '갈산역', '부평구청역', 
                '부평시장역', '부평역', '동수역', '부평삼거리역',
                '간석오거리역', '인천시청역', '예술회관역', '인천터미널역',
                '문학경기장역', '선학역', '신연수역', '원인재역', '동춘역',
                '동막역', '캠퍼스타운역', '테크노파크역', '지식정보단지역',
                '인천대입구역', '센트럴파크역', '국제업무지구역'
            ],
            '2': [
                '검단오류', '왕길', '검단사거리', '마전', '완정', 
                '독정', '검암', '검바위', '아시아드경기장', '서구청',
                '가정', '가정중앙시장', '석남', '서부여성회관', '인천가좌',
                '가재울', '주안국가산단', '주안', '시민공원', '석바위시장',
                '인천시청', '석천사거리', '모래내시장', '만수', '남동구청',
                '인천대공원', '운연'
            ],
            '7': [
                '석남역', '산곡역', '부평구청역', '굴포천역', 
                '삼산체육관역', '상동역', '부천시청역', '신중동역', 
                '춘의역', '부천종합운동장역', '까치울역'
            ]
        };
    },
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);