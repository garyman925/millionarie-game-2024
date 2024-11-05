// 動畫管理模組
const AnimationManager = {
    // 跳動數字動畫
    animateNumber: function(element, start, end, duration = 1000) {
        // 確保 anime.js 已載入
        if (typeof anime === 'undefined') {
            console.error('Anime.js is not loaded!');
            return;
        }

        // 設置初始值
        element.textContent = start.toLocaleString();

        // 創建數字變化動畫
        anime({
            targets: { value: start },
            value: end,
            duration: duration,
            easing: 'easeOutExpo',
            round: 1,
            update: function(anim) {
                element.textContent = Math.floor(anim.animations[0].currentValue).toLocaleString();
            },
            complete: function() {
                // 確保最終數字正確
                element.textContent = end.toLocaleString();
                
                // 創建獨立的放大動畫
                const scaleAnimation = anime({
                    targets: element,
                    keyframes: [
                        {scale: 1},
                        {scale: 1.5},
                        {scale: 1}
                    ],
                    duration: 500,
                    easing: 'easeOutElastic(1, .5)',
                    update: function(anim) {
                        requestAnimationFrame(() => {
                            element.style.display = 'inline-block'; // 確保 transform 生效
                            element.style.transform = `scale(${anim.animations[0].currentValue})`;
                        });
                    },
                    complete: function() {
                        element.style.transform = '';
                    }
                });
            }
        });
    },

    // 添加彈跳效果
    addBounceEffect: function(element) {
        anime({
            targets: element,
            scale: [1, 1.2, 1],
            duration: 500,
            easing: 'easeOutElastic(1, .5)'
        });
    }
}; 