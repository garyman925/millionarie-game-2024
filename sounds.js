// 音效管理模組
const SoundManager = {
    // 音效實例
    sounds: {
        hero_bgm: new Howl({
            src: ['sounds/hero-bgm.mp3'],
            loop: true,
            volume: 0.3
        }),
        main_bgm: new Howl({
            src: ['sounds/main-bgm.mp3'],
            loop: true,
            volume: 0.3
        }),
        start_bgm: new Howl({
            src: ['sounds/start-bgm.mp3'],
            volume: 0.3
        }),
        correct: new Howl({
            src: ['sounds/correct.mp3'],
            volume: 0.8
        }), 
        wrong: new Howl({
            src: ['sounds/wrong.mp3'],
            volume: 0.8
        }),
        level_up: new Howl({
            src: ['sounds/start-bgm.mp3'],
            volume: 0.8
        }),
        final_bgm: new Howl({
            src: ['sounds/final-answer.mp3'],
            volume: 0.8
        })
    },

    // 控制方法
    playBGM: function() {
        this.sounds.hero_bgm.play();
    },

    stopBGM: function() {
        this.sounds.hero_bgm.stop();
    },

    playStartBGM: function() {
        this.sounds.start_bgm.play();
    },

    playMainBGM: function() {
        this.sounds.main_bgm.play();
    },

    playCorrect: function() {
        this.sounds.correct.play();
    },

    playWrong: function() {
        this.sounds.wrong.play();
    },
    playLevelUp: function() {
        this.sounds.level_up.play();
    },
    playFinalBGM: function() {
        this.sounds.final_bgm.play();
    },

    // 全局音量控制
    setVolume: function(volume) {
        Object.values(this.sounds).forEach(sound => {
            sound.volume(volume);
        });
    },

    // 靜音控制
    mute: function() {
        Object.values(this.sounds).forEach(sound => {
            sound._volume = sound.volume();
            sound.volume(0);
        });
    },

    unmute: function() {
        Object.values(this.sounds).forEach(sound => {
            sound.volume(sound._volume || 1);
        });
    }
}; 