class SpriteAnimation {
    constructor(spritesheet, data) {
        this.spritesheet = new Image();
        this.spritesheet.src = spritesheet;
        this.data = data;
        this.currentFrame = 0;
        this.frameCount = data.frames.length;
        this.animationSpeed = 100; // 每幀持續時間（毫秒）
    }

    createCanvas(container) {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = this.data.frames[0].frame.w;
        this.canvas.height = this.data.frames[0].frame.h;
        container.appendChild(this.canvas);
        
        // 設置 canvas 的樣式
        this.canvas.style.position = 'absolute';
        this.canvas.style.bottom = '20px';
        this.canvas.style.right = '20px';
    }

    animate() {
        if (!this.canvas) return;

        const frame = this.data.frames[this.currentFrame];
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(
            this.spritesheet,
            frame.frame.x,
            frame.frame.y,
            frame.frame.w,
            frame.frame.h,
            0,
            0,
            frame.frame.w,
            frame.frame.h
        );

        this.currentFrame = (this.currentFrame + 1) % this.frameCount;
    }

    start() {
        this.interval = setInterval(() => this.animate(), this.animationSpeed);
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
} 