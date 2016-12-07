(function($) {
    $.pageManager= function() {
        var $page = {};
		var curPage,tarPage;
		var myFactory;
		var pageArr=[
			/* << pageDemo
			{
				children:[
					{id:"alpha", x:375, y:100, ox:175}
				],
				readyEnter:function(){},
				checkIn:function(){},
				readyLeave:function(){},
				checkOut:function(){}
			}
			>> pageDemo */
			/* << page0 */
			{
				children:[
					{x:(759-320)/2, y:(1334-348)/4, ox:0, order:"createPuzzle", img:{src:"images/puzzle.jpg",width:320,height:348},widthCut:3,heightCut:3,callback:function(){alert(1)}},
				]
			}
			/* >> page0  */
			,
			/* << page1 */
			{
				children:[
					{id:"alpha", x:375, y:100, ox:175},
					{id:"shape", x:375, y:300, ox:575}
				]
			}
			/* >> page1 */
		];
        $page.methods = {
            init: function(_stage) {
				//初始化
				curPage=-1;
				myFactroy=new $.factory.getInstance();
				//生成页面容器
				if(pageArr.length>0){
					for(var i=0; i<pageArr.length; i++){
						var _pageClass=new Local_createPageClass(_stage, pageArr[i]);
						_pageClass.init();
						pageArr[i]=_pageClass;
					}
				}
				//进入首页
				Local_gotoPage($common.Global.startPage);
            }
        };
		function Local_createPageClass(_stage, _data){
			var pageClass={};
			var thisMain, childArr;
			pageClass.init=function(){
				childArr=[];
				//创建页面容器并隐藏
				thisMain=new createjs.Container();
				thisMain.visible=false;
				//生成页面元素
				for(var i=0; i<_data.children.length; i++){
					var _myChild={};
					$.each(_data.children[i], function(x,n){ _myChild[x]=n; });
					if(_myChild.order==undefined)_myChild.order="spriteBasic";
					if(_myChild.ox==undefined)_myChild.ox=_myChild.x;
					if(_myChild.oy==undefined)_myChild.oy=_myChild.y;
					if(_myChild.a==undefined)_myChild.a=1;
					if(_myChild.oa==undefined)_myChild.oa=0;
					if(_myChild.s==undefined)_myChild.s=1;
					if(_myChild.os==undefined)_myChild.os=1;
					if(_myChild.speed==undefined)_myChild.speed=300;
                    var _pdt = myFactroy[_myChild.order](_data.children[i],_stage);
					_myChild.pdt=_pdt;
					thisMain.addChild(_myChild.pdt.mc);
					childArr.push(_myChild);
				}
				_stage.addChild(thisMain);
			};
			pageClass.getMain=function(){return thisMain};
			var myExportFun={
				getChild:thisGetChildCall
			};
			function thisGetChildCall(_id){
				var _count=0;
				for(var i=0; i<childArr.length; i++){
					_count++;
					if(_id==childArr[i].id)return childArr[i].mc;
				}
				if(_count==childArr.length){
					if($common.Global.debug)console.log("ERRO can not find child of "+_id);
					return false;
				}
			};
			pageClass.readyEnter=function(_callback){ 
				if(_data.readyEnter)_data.readyEnter(myExportFun); 
				var _speedLength=0;
				for(var i=0; i<childArr.length; i++){
					if(_speedLength<childArr[i].speed)_speedLength=childArr[i].speed;
					//请求执行动画
					thisDoCheckInAni(childArr[i]);
				}
				setTimeout(function(){
					_callback.checkIn();
					thisCheckIn();
				}, _speedLength);
			};
			function thisCheckIn(){ if(_data.checkIn)_data.checkIn(myExportFun); };
			function thisDoCheckInAni(_option){
				//初始化位置
				_option.pdt.mc.x=_option.ox;
				_option.pdt.mc.y=_option.oy;
				_option.pdt.mc.alpha=_option.oa;
				_option.pdt.mc.scaleX=_option.os;
				_option.pdt.mc.scaleY=_option.os;
				//执行动画
				createjs.Tween.get(_option.pdt.mc).to({x:_option.x, y:_option.y, alpha:_option.a, scaleX:_option.s, scaleY:_option.s}, 300);
			}
			pageClass.readyLeave=function(_callback){ 
				if(_data.readyLeave)_data.readyLeave(myExportFun); 
				var _speedLength=300;
				for(var i=0; i<childArr.length; i++){
					if(_speedLength<childArr[i].speed)_speedLength=childArr[i].speed;
					//请求执行动画
					thisDoCheckOutAni(childArr[i]);
				}
				setTimeout(function(){
					thisCheckOut(_callback);
				}, _speedLength);
			};
			function thisCheckOut(_callback){
				if(_data.checkOut)_data.checkOut(myExportFun); 
				pageArr[curPage].getMain().visible=false;
				_callback();
			};
			function thisDoCheckOutAni(_option){
				//初始化位置
				_option.pdt.mc.x=_option.x;
				_option.pdt.mc.y=_option.y;
				_option.pdt.mc.alpha=_option.a;
				_option.pdt.mc.scaleX=_option.s;
				_option.pdt.mc.scaleY=_option.s;
				//执行动画
				createjs.Tween.get(_option.pdt.mc).to({x:_option.ox, y:_option.oy, alpha:_option.oa, scaleX:_option.os, scaleY:_option.os}, 300);
			}
			return pageClass;
		};
		function Local_gotoPage(_index){
			if(_index>=0 && _index<pageArr.length && _index!=tarPage){
				tarPage=_index;
				var thisDef=$.Deferred();
				var gotoPageFun=function(dtd){
					if(curPage>=0){
						pageArr[curPage].readyLeave(function(){dtd.resolve();});
					}else{
						dtd.resolve();
					}
					return dtd;
				};
				var callback={
					checkIn:function(){ curPage=tarPage; }
				}
				thisDef.promise(gotoPageFun);
				gotoPageFun(thisDef);
				gotoPageFun.then(function(){
					//创建目标页的进入许可
					pageArr[_index].readyEnter(callback);
					pageArr[_index].getMain().visible=true;
				});
			}else{
				if($common.Global.debug)console.log("ERRO 目标页码不在正确范围 "+_index+" (pageArr.length="+pageArr.length+") (tarPage="+tarPage+")");
			}
		};
        return $page;
    };
})(jQuery);