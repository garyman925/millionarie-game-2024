class SpriteAnimation {
    constructor(spritesheet, data, options = {}) {
        this.spritesheet = new Image();
        this.spritesheet.src = spritesheet;
        this.data = data;
        this.currentFrame = 0;
        this.frameNames = Object.keys(data.frames).sort();
        this.frameCount = this.frameNames.length;
        this.animationSpeed = 100;
        this.options = {
            position: options.position || 'custom',
            top: options.top || '0',
            left: options.left || '0',
            width: options.width || '300px',
            height: options.height || 'auto',
            zIndex: options.zIndex || '10'
        };
    }

    createCanvas(container) {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.spritesheet.onload = () => {
            const firstFrameName = this.frameNames[0];
            const firstFrame = this.data.frames[firstFrameName];
            
            this.canvas.width = firstFrame.sourceSize.w;
            this.canvas.height = firstFrame.sourceSize.h;
            
            this.canvas.style.position = 'absolute';
            
            this.canvas.style.top = this.options.top;
            this.canvas.style.left = this.options.left;
            
            if (this.options.position === 'center') {
                this.canvas.style.transform = 'translate(-50%, -50%)';
            } else {
                this.canvas.style.transform = this.options.transform || 'none';
            }
            
            this.canvas.style.width = this.options.width;
            this.canvas.style.height = this.options.height;
            this.canvas.style.zIndex = this.options.zIndex;
            
            this.start();
        };
        
        container.appendChild(this.canvas);
    }

    animate() {
        if (!this.canvas || !this.spritesheet.complete) return;

        const frameName = this.frameNames[this.currentFrame];
        const frame = this.data.frames[frameName];
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(
            this.spritesheet,
            frame.frame.x,
            frame.frame.y,
            frame.frame.w,
            frame.frame.h,
            frame.spriteSourceSize.x,
            frame.spriteSourceSize.y,
            frame.frame.w,
            frame.frame.h
        );

        this.currentFrame = (this.currentFrame + 1) % this.frameCount;
    }

    start() {
        if (this.interval) {
            clearInterval(this.interval);
        }
        this.interval = setInterval(() => this.animate(), this.animationSpeed);
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
} 