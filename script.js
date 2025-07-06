const wheelCanvas = document.getElementById('wheelCanvas');
const spinButton = document.getElementById('spinButton');
const resultDiv = document.getElementById('result');
const ctx = wheelCanvas.getContext('2d');

// 初始數據 (未來會從用戶輸入獲取)
let segments = [
    { text: '玩家 A', color: '#FFD700' },
    { text: '玩家 B', color: '#ADFF2F' },
    { text: '玩家 C', color: '#87CEEB' },
    { text: '玩家 D', color: '#FF6347' }
];

const PI2 = Math.PI * 2;
const centerX = wheelCanvas.width / 2;
const centerY = wheelCanvas.height / 2;
const radius = Math.min(centerX, centerY) - 10; // 留一點邊距

function drawWheel() {
    ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
    let startAngle = 0;
    const arc = PI2 / segments.length;

    segments.forEach((segment, i) => {
        const endAngle = startAngle + arc;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.lineTo(centerX, centerY);
        ctx.closePath();
        ctx.fillStyle = segment.color;
        ctx.fill();

        // 繪製文字
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + arc / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#000';
        ctx.font = '20px Arial';
        ctx.fillText(segment.text, radius - 10, 0);
        ctx.restore();

        startAngle = endAngle;
    });
}

let currentRotation = 0;
let spinSpeed = 0;
let targetRotation = 0;
let spinning = false;

function animateSpin() {
    if (!spinning) return;

    currentRotation += spinSpeed;
    currentRotation %= PI2; // 保持在 0 到 2PI 之間

    // 減速
    spinSpeed *= 0.98; // 減速係數

    // 如果速度非常慢，停止轉動
    if (spinSpeed < 0.001) {
        spinning = false;
        spinSpeed = 0;
        displayResult();
        return;
    }

    ctx.save();
    ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
    ctx.translate(centerX, centerY);
    ctx.rotate(currentRotation);
    ctx.translate(-centerX, -centerY);
    drawWheel();
    ctx.restore();

    requestAnimationFrame(animateSpin);
}

function displayResult() {
    // 計算指針指向哪個分格
    const normalizedRotation = (PI2 - currentRotation) % PI2; // 歸一化到 0-2PI
    const segmentAngle = PI2 / segments.length;
    const winningIndex = Math.floor(normalizedRotation / segmentAngle);
    resultDiv.textContent = `恭喜！${segments[winningIndex].text} 中獎！`;
}

spinButton.addEventListener('click', () => {
    if (spinning) return;

    spinning = true;
    spinSpeed = Math.random() * 0.1 + 0.05; // 初始速度
    targetRotation = PI2 * (5 + Math.random() * 5); // 至少轉 5 圈
    
    // 調整初始旋轉，讓指針指向隨機位置
    currentRotation = Math.random() * PI2;

    resultDiv.textContent = '';
    animateSpin();
});

// 初始繪製轉盤
drawWheel();
