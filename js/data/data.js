Data = (function() {
    var $data = {};
    //素材根路径
    $data.file = "images/";
    //拼图宽度配置
    $data.mc = [{}];
    //页面所用到的素材
    $data.loading = [{ src: "loading.png", id: "loading" }];
    $data.material = [
		{src:"bg_puzzle.png",id:"bg_puzzle"},{src:"bg_yellow.jpg",id:"bg_yellow"},
		{src:"bottom_puzzle.png",id:"bottom_puzzle"},
		{src:"static.png",id:"static"},
		{src:"button.png",id:"button"},
		{src:"bg.mp3",id:"bgSound"}
    ];
    //初始化素材数据
    $data.static = {
        id: "static",
        point: [
            {x:0,y:700,oY:-100,delayIn:0},
            {x:73,y:228,oY:-100,delayIn:300,easeIn:createjs.Ease.bounceOut},
            {x:50,y:23,oY:-100,delayIn:0,easeIn:createjs.Ease.bounceOut},
            {x:677,y:30,oY:-100,delayIn:100},
            {x:677,y:30,oY:0,delayIn:0},
            {x:240,y:195,oY:0,delayIn:500},
            {x:50,y:194,oY:-100,delayIn:0},
            {x:319,y:162,oY:-100,delayIn:500},
            {x:276,y:64,oY:0,delayIn:0},
            {x:51,y:118,oY:0,delayIn:0},
            {x:154,y:220,oY:0,delayIn:0},
            {x:191,y:162,oY:0,delayIn:0},
            {x:191,y:162,oY:0,delayIn:0}
        ],
        frames: [
            [0, 277, 750, 263],
            [0, 0, 595, 274],
            [626, 0, 125, 59],
            [626, 82, 45, 45],
            [690, 82, 45, 45],
            [0, 560, 271, 38],
            [0, 608, 502, 37],
            [310, 560, 113, 37],
            [443, 560, 128, 30],
            [0, 669, 598, 57],
            [0, 746, 373, 357],
            [443, 746, 304, 67],
            [443, 826, 304, 67]
        ],
        animations: { bg_entrance: 0, slogan: 1, logo: 2, openMusic: 3, closeMusic: 4, text_choseTit: 5, text_countdown: 6, text_count: 7, text_instruc: 8, text_introd: 9, img_instruc: 10, text_success: 11, text_fail: 12 }
    };
    $data.button = {
        id: "button",
        point: [
            {x:175,y:575,oX:-100,delayIn:500},
            {x:175,y:683,oX:850,delayIn:600},
            {x:175,y:1050,oY:1334+100,delayIn:1500},
            {x:182,y:616,oY:0,delayIn:0},
            {x:144,y:356,oY:0,delayIn:0},
            {x:144,y:463,oY:0,delayIn:0},
            {x:255,y:62,oY:-100,delayIn:500}
        ],
        frames: [
            [0, 0, 400, 85],
            [0, 95, 400, 95],
            [0, 190, 400, 85],
            [40, 552, 320, 85],
            [0, 285, 400, 85],
            [0, 380, 400, 85],
            [80, 475, 240, 67]
        ],
        animations: { startGame: 0, viewPrizes: 1, nextGame: 2, beginGame: 3, btnInvite: 4, btnView: 5, backGame: 6 }
    };
    return $data;
})();
