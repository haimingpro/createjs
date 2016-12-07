var $common=null;
$(function(){$common=new $.createNew(); $common.methods.init();});

(function($) {
    $.createNew= function() {
        var $createNew = {};
		var myStage, myLoading;
        $createNew.methods = {
            init: function() {
				$common.maxWidth=750;
				$common.maxHeight=1334;
				$common.setScreen=0; //竖屏0横屏1
				$common.homepage=0;//初始页
				//夸页面需要使用到的全局变量
				$common.option = {
					selectedId:null,
					selectedImg:null,
					result:null,
					eventBtn:new Array(),
					leftTime:0,
					level:1
				}; 
				//初始化主类
				$common.Page=new $.pageManager();
				$common.Control=new $.controller();
				 //初始化"Canvas舞台"
				myStage=$common.methods.createStage("game",{width:$common.maxWidth, height:$common.maxHeight});
                //设置显示器
                $common.methods.resize();
                $(window).bind("resize",function(){$common.methods.resize();});
                //加载Loading界面
				$common.methods.loadFile({config:Data.loading,
					complete:function(event){
						myLoading=new $.movieclip().artwork();
						//临时放置loading在stage上
						myStage.addChild(myLoading.movieClip);
						Loader=null;
						$common.methods.loadMain();
					},enterFrame:function(event){
                        //更新舞台
                        myStage.update(event);
                    }
                });
            },
			//加载主界面
			loadMain:function(){
				$common.methods.loadFile({config:Data.material,sound:true,progress:function(num){
						myLoading.text.text=num+"%";
						myLoading.percent.scaleX=num/100;
					},complete:function(event){
						myLoading.text.text=100+"%";
						$common.Control.ani.hideAlpha(myLoading.movieClip, function(){
							//赶紧删除loading还stage一个清白
							myStage.removeChild(myLoading.movieClip);
							//初始化完成,进入pageManager
							$common.Page.methods.init(myStage);
							//初始化弹层
							$common.PopupClass=new $.popup({stage:myStage});
						});
					}
				});
			},
            //加载各种资源 ，可包含img,js,以及xml,json等数据格式
            loadFile:function(option){
                var _loader=$common.Control.system.load(option.config,{
                    //是否配置音乐， 目前creatjs音乐对iphone不自动播放
                    sound:option.sound||false,
                    //素材文件路径
                    file:Data.file,
                    //加载完成
                    COMPLETE:function(event){if(option.complete)option.complete(event);return;},
                    //加载中...
                    PROGRESS:function(event){if(option.progress)option.progress(event.percent);},
                    //加载完成后，循环执行
                    ENTER_FRAME:function(event){if(option.enterFrame)option.enterFrame(event);},
                    //加载失败
                    ERROR:function(event){}
                });
            },
			createStage:function(_id, _parameter){
				var canvas=document.createElement("canvas");
				document.getElementById(_id).appendChild(canvas);
				createjs.Ticker.timingMode = createjs.Ticker.RAF;
				createjs.Ticker.setFPS(_parameter.FPS||30);
				var stage=new createjs.Stage(canvas);
				createjs.Touch.enable(stage, true);
				stage.canvas.width=_parameter.width;
				stage.canvas.height=_parameter.height;
				stage.main=$common.Control.create("dom",{dom:document.getElementById(_id)});
				stage.addChild(stage.main);
				return stage;
			},
             //窗口变化监听
            resize:function(){
				$common.Control.system.resetScreen({
					stage:myStage,
					angle:$common.setScreen,
					maxWidth:$common.maxWidth,
					maxHeight:$common.maxHeight
				});
            }
        };
		
        //接口
        $createNew.dev={
            //获取玩游戏次数
            getNum:function(callback){
                try{getNum(callback);}catch(e){callback({num:Math.ceil(Math.random()*2)});};
            }
        };
        return $createNew;
    };
})(jQuery);


