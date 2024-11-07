// 動畫管理模組
const AnimationModule = {
    // 數字跳動動畫
    animateNumber: function(element, start, end, duration = 1000) {
        if (typeof anime === 'undefined') {
            console.error('Anime.js is not loaded!');
            return;
        }

        element.textContent = start.toLocaleString();
        element.style.display = 'inline-block';

        const numberAnimation = anime.timeline({
            targets: element,
            duration: duration,
            easing: 'easeOutExpo'
        });

        numberAnimation
            .add({
                targets: { value: start },
                value: end,
                round: 1,
                duration: duration,
                update: function(anim) {
                    element.textContent = Math.floor(anim.animations[0].currentValue).toLocaleString();
                }
            })
            .add({
                translateY: [
                    { value: -20, duration: duration / 10 },
                    { value: 0, duration: duration / 10 }
                ],
                scale: [
                    { value: 1.2, duration: duration / 10 },
                    { value: 1, duration: duration / 10 }
                ],
                delay: anime.stagger(duration / 10),
                loop: Math.floor(duration / 200)
            }, 0)
            .add({
                scale: [1, 1.5, 1],
                duration: 500,
                easing: 'easeOutElastic(1, .5)',
                complete: function() {
                    element.style.transform = '';
                }
            });
    },

    // 彈跳效果
    addBounceEffect: function(element) {
        anime({
            targets: element,
            scale: [1, 1.2, 1],
            duration: 500,
            easing: 'easeOutElastic(1, .5)'
        });
    },

    // Confetti 效果
    showConfetti: function() {
        confetti({
            particleCount: 200,
            spread: 150,
            origin: { x: 0.5, y: 0 },
            gravity: 3,
            ticks: 100,
            startVelocity: 150,
            shapes: ["square"],
            colors: ["#FFD700", "#DAA520", "#B8860B", "#FFA500", "#F0E68C"],
            scalar: 3,
            zIndex: 100,
            angle: 90,
            drift: 1
        });

        setTimeout(() => {
            confetti({
                particleCount: 50,
                spread: 150,
                origin: { x: 0.4, y: 0 },
                gravity: 3,
                ticks: 100,
                startVelocity: 150,
                shapes: ["square"],
                colors: ["#FFD700", "#DAA520", "#B8860B", "#FFA500", "#F0E68C"],
                scalar: 3,
                zIndex: 100,
                angle: 85
            });
            confetti({
                particleCount: 50,
                spread: 150,
                origin: { x: 0.6, y: 0 },
                gravity: 3,
                ticks: 100,
                startVelocity: 150,
                shapes: ["square"],
                colors: ["#FFD700", "#DAA520", "#B8860B", "#FFA500", "#F0E68C"],
                scalar: 3,
                zIndex: 100,
                angle: 95
            });
        }, 1000);
    }
};