var $common;
$(function(){
	$common=new $.createNew();
	$common.methods.init();
});
/*
data:20161118
author:kAMiLl
*/
(function($) {
    $.createNew= function() {
        var $createNew = {};
		var myStage, myLoading, myFactroy;
        $createNew.methods={
            init: function(){
				$common.Global={
					maxWidth:750,
					maxHeight:1334,
					setScreen:0, //竖屏0横屏1
					startPage:0, //初始页
					debug:true,
					fileRoot:"images/",
					ldMaterial:[{src:"loading.png",id:"loading"}],
					mainMaterial:[
						{src:"alpha.png",id:"alpha"},
						{src:"shape.jpg",id:"shape"}
					]
				};
				//初始化
				$common.Page=new $.pageManager();
				myFactroy=$.factory.getInstance();
				//加载工厂
				var _demoExtends=new $.factory_demo();
				var _amyExtends=new $.factory_puzzle();
				$common.methods.buildFactory(myFactroy, [_demoExtends, _amyExtends]);
				myStage=Local_createStage("myCanvas");
                //设置显示器
				Local_resetScreen();
				$(window).bind("resize",function(){Local_resetScreen();});
				//加载Loading界面
				$common.methods.loadLoading();
            },
			/* init >> */
			loadLoading:function(){
				Local_loadFile({
					config:$common.Global.ldMaterial,
					complete:function(event){
						myLoading=Local_createLoading();
						//临时放置loading在stage上
						myStage.addChild(myLoading.movieClip);
						$common.methods.loadMain();
					},enterFrame:function(event){myStage.update(event);}
                });
			},
			/* loadLoading >> */
			loadMain:function(){
				Local_loadFile({
					config:$common.Global.mainMaterial,
					progress:function(num){
						myLoading.text.text="... "+num+"% ...";
					},complete:function(event){
						createjs.Tween.get(myLoading.movieClip,{override:true}).to({alpha:0},300,createjs.Ease.sineInOut).call(function(){
							//删除loading
							myStage.removeChild(myLoading.movieClip);
							//加载完成,进入pageManager
							$common.Page.methods.init(myStage);
						});
					}
				});
			},
			/* loadMain >> */
			buildFactory:function(_obj, _arr){
				for(var i=0; i<_arr.length; i++){
					$.each(_arr[i], function(k, v){
						if(_obj[k]===undefined){
							_obj[k]=v;
						}else{
							if($common.Global.debug)console.log("ERRO the "+k+" already in myFactroy");
						}
					});
				}
			}
			/* buildFactory >> */
        };
		function Local_createStage(_id){
			var _canvas=document.createElement("canvas");
			document.getElementById(_id).appendChild(_canvas);
			createjs.Ticker.timingMode = createjs.Ticker.RAF;
			createjs.Ticker.setFPS(30);
			var _stage=new createjs.Stage(_canvas);
			createjs.Touch.enable(_stage, true);
			_stage.canvas.width=$common.Global.maxWidth;
			_stage.canvas.height=$common.Global.maxHeight;
			_stage.main=new createjs.DOMElement(document.getElementById(_id));
			_stage.addChild(_stage.main);
			return _stage;
		};
		function Local_resetScreen(){
			var _stage=myStage;
			var _angle=$common.Global.setScreen;
			var _width=$(window).width();
			var _height=$(window).height();
			var _maxWidth=$common.Global.maxWidth;
			var _maxHeight=$common.Global.maxHeight;	
			//旋转
			var _rotate;
			var _deg=_angle==0?-90:0;
			if(!($(window).width()>$(window).height())){_deg=_angle==0?0:-90;}
			_stage.main.rotation=_deg;
			if(_angle==0){_rotate=_deg!=0?false:true;}else{_rotate=_deg<0?false:true;}
			//缩放
			var _sacle;
			if(_rotate){
				_sacle=Math.max(_width/_maxWidth,_height/_maxHeight);
				_stage.main.x=(_width-_maxWidth*_sacle)/2;
				_stage.main.y=0;
		   }else{
				_sacle=Math.max(_height/_maxWidth,_width/_maxHeight);
				_stage.main.x=(_width-_maxHeight*_sacle)/2;
				_stage.main.y=(_maxWidth*_sacle-_height)/2+_height;
		   }
		   _stage.main.scaleX = _stage.main.scaleY =_sacle;
		};
		function Local_loadFile(_option){
			var _loaderNum=0;
			var _fileRoot=$common.Global.fileRoot;
			var _loader=new createjs.LoadQueue(false);
			_loader.addEventListener("complete", function(event){if(_option.complete)_option.complete(event);if(_option.enterFrame){createjs.Ticker.addEventListener("tick", function(event){_option.enterFrame(event);});}});
			_loader.addEventListener("error", function(event){if(_option.error)_option.error(event);});
			_loader.addEventListener("fileload", function(event){
				_loaderNum++; 
				event.percent=Math.floor(_loaderNum/_option.config.length*100); 
				if(_option.progress)_option.progress(event.percent);
			});
			_loader.loadManifest(_option.config, true, _fileRoot);
			$common.Loader=_loader;
		};
		function Local_createLoading(){
			var _mc=new createjs.Container();
			var animation=myFactroy.spriteBasic({id:"loading", x:375, y:500});
			_mc.addChild(animation.mc);
			var _text=new createjs.Text("...", "28px Arial", "#FFF").set({x:375, y:590, textAlign:"center"});
			_mc.addChild(_text);
			return {movieClip:_mc, text:_text};
		};
        //接口
        $createNew.dev={
            //模拟接口
            getFrontDev:function(_obj, _callback){
                try{getFrontDev(_obj, _callback);}catch(e){
					console.log("模拟开发获取了前端给到的参数-->")
					console.log(_obj);
					console.log("开发并返回给前端结果-->")
					var _result="success";
					_callback({result:_result});
				};
            }
			/* getFrontDev >> */
        };
		$createNew.pro={
			getFrontPro:function(_obj){
                try{getFrontPro(_obj);}catch(e){
					console.log("前端取得了结果-->")
					console.log(_obj);
				};
            }
			/* getFrontPro >> */
		};
        return $createNew;
    };
})(jQuery);