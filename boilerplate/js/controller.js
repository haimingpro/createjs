(function($) {
	$.controller=function(){
		var $control={}
		$control.tween=function(_mc,_data,isIn,_callBack){
			_mc.visible=true;
			var obj={mc:_mc,data:_data},ease=createjs.Ease.sineInOut,time=500,alpha=0,rota=0,scale=1;
			if(isIn){
				if(obj.data.easeIn){ease=obj.data.easeIn;};
				if(obj.data.alpha){alpha=obj.data.alpha;}
				if(obj.data.rota){rota=obj.data.rota;}
				if(obj.data.scale){scale=obj.data.scale;}
				obj.mc.set({x:obj.data.oX||obj.data.x,alpha:alpha,y:obj.data.oY||obj.data.y,rotation:rota,scaleX:scale,scaleY:scale});
				createjs.Tween.get(obj.mc).wait(obj.data.delayIn).to({x:obj.data.x, y:obj.data.y, alpha:1},time,ease).call(function(){if(_callBack)_callBack();});
			}else{
				if(obj.data.easeOut){ease=obj.data.easeOut;time=500;}
				if(obj.data.alpha){alpha=obj.data.alpha;}
				if(obj.data.scale){scale=obj.data.scale;}
				createjs.Tween.get(obj.mc).wait(obj.data.delayOut).to({x:obj.data.oX||obj.data.x, y:obj.data.oY||obj.data.y, alpha:0},time,ease).call(function(){if(_callBack)_callBack();});
			}
        };
		$control.ani={
			/*basic reserve animate*/
			showAlpha:function(_obj,callBack){
				_obj.alpha=0;
				_obj.visible=true;
				createjs.Tween.get(_obj,{override:true}).to({alpha:1},300,createjs.Ease.sineInOut).call(function(){if(callBack)callBack();});
			},
			hideAlpha:function(_obj,callBack){
				_obj.alpha=1;
				createjs.Tween.get(_obj,{override:true}).to({alpha:0,y:_obj.y+50},500,createjs.Ease.sineInOut).call(function(){if(callBack)callBack();_obj.visible=false;});
			},
			dropDown:function(_obj){
				createjs.Tween.get(_obj,{override:true}).to({y:_obj.y+80,alpha:1},800,createjs.Ease.sineInOut);
			},
			startMove:function(_obj,parameter){
				if(parameter.targetX){
					createjs.Tween.get(_obj,{loop: true},true).to({x:parameter.targetX}, parameter.time);
				}else{
					createjs.Tween.get(_obj,{loop: true},true).to({y:parameter.targetY}, parameter.time);
				}
			}
		}
		$control.system={
			load:function(manifest,parameter){
				var _loaderNum=0;
				var _loader=new createjs.LoadQueue(false);
				if(parameter.sound){createjs.Sound.alternateExtensions = ["mp3"];_loader.installPlugin(createjs.Sound);}
				_loader.addEventListener("complete", function(event){if(parameter.COMPLETE)parameter.COMPLETE(event);if(parameter.ENTER_FRAME){createjs.Ticker.addEventListener("tick", function(event){parameter.ENTER_FRAME(event);});}});
				_loader.addEventListener("error", function(event){if(parameter.ERROR)parameter.ERROR(event);});
				_loader.addEventListener("fileload", function(event){_loaderNum++;event.percent=Math.floor(_loaderNum/manifest.length*100);if(parameter.PROGRESS)parameter.PROGRESS(event);});
				if(parameter.file)_loader.loadManifest(manifest,true,parameter.file);else _loader.loadManifest(manifest);
				Loader=_loader;
			},
			timer:function(){
				if($control.system.toTimer){window.clearInterval($control.system.toTimer);};
				$control.system.toTimer=window.setInterval(function(){},time);
			},
			timerOut:function(parameter){
				if($control.system.toTimerout){window.clearTimeout($control.system.toTimerout);};
				$control.system.toTimerout=window.setTimeout(function(){if(parameter.complete)parameter.complete();},parameter.time);
			},
			removeTimerOut:function(){if($control.system.toTimerout){window.clearTimeout($control.system.toTimerout);};},
			resetScreen:function(parameter){
				var stage=parameter.stage,angle=parameter.angle||0,width=$(window).width(),height=$(window).height(),maxWidth=parameter.maxWidth,maxHeight=parameter.maxHeight;
				var rotate=this.setViewport(stage,angle),sacle=0;
				if(rotate){
				   sacle=this.getWidthScale(width,height,maxWidth,maxHeight);
				   stage.main.x=(width-maxWidth*sacle)/2;
				   stage.main.y=0;
			   }else{
				   sacle=this.getHeightScale(width,height,maxWidth,maxHeight);
				   stage.main.x=(width-maxHeight*sacle)/2;
				   stage.main.y=(maxWidth*sacle-height)/2+height;
			   }
			   stage.main.scaleX = stage.main.scaleY =sacle;
			},
			setViewport:function(stage,angle){
				var deg=angle==0?-90:0;
				if(!this.getViewport()){deg=angle==0?0:-90;}
				stage.main.rotation=deg;
				if(angle==0){return deg!=0?false:true;}else{return deg<0?false:true;}
			},
			getViewport:function(){
				return $(window).width()>$(window).height();
			},
			getWidthScale:function(width,height,maxWidth,maxHeight){
				return Math.max(width/maxWidth,height/maxHeight);
			},
			getHeightScale:function(width,height,maxWidth,maxHeight){
				return Math.max(height/maxWidth,width/maxHeight);
			},
			//取得数组中的某个组件
            getMovieClip:function(key,arr){
                for(var i=0;i<arr.length;i++){
                    if(key==arr[i].key){return arr[i];}
                }
                return null;
            }
		}/*$control.system End*/
		$control.doArrAni=function(_isIn, _arr){
			for(var i=0;i<_arr.length;i++){
				if(_arr[i].doAniCall)_arr[i].doAniCall(_isIn);
			}
		};
		$control.create=function(key,data){
			if(key=="sheet")return new createjs.Sprite(new createjs.SpriteSheet(data));
			if(key=="shape")return new createjs.Shape();
			if(key=="shapeFill"){var shapeFill=new createjs.Shape();shapeFill.graphics.beginBitmapFill(data.loader.getResult(data.img)).drawRect(data.x||0, data.y||0, data.width||data.loader.getResult(data.img).width, data.height||data.loader.getResult(data.img).height); return shapeFill;};
			if(key=="bitmap")return new createjs.Bitmap(data.img);
			if(key=="text")return new createjs.Text(data.text||"", data.font||"20px Arial", data.color||"#000");
			if(key=="container")return new createjs.Container();
			if(key=="dom")return new createjs.DOMElement(data.dom);
			if(key=="textField"){var input=document.createElement("input");if(data.className){input.className=data.className;};document.getElementById(data.content).appendChild(input);input.canvas=this.creat("dom",{dom:input});return input;}
		};
		return $control;
	}
})(jQuery);