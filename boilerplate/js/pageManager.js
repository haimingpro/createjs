(function($) {
    $.pageManager= function() {
        var $page = {};
		var curPage,tarPage;
		var pageArr=[
			/* page0 start */
			{
				init:function(){
					
				},
				checkIn:function(){
					
				},
				checkOut:function(_intoBack){
					
				}
			},
			/* page0 end */
			/* page1 start */
			{
				init:function(){
					
					
				},
				checkIn:function(){
					
				},
				checkOut:function(_intoBack){
					
				}
			},
			/* page1 end */
			/* page2 start */
			{
				init:function(){
					
				},
				checkIn:function(){
					
				},
				checkOut:function(_intoBack){
					
				}
			},
			/* page2 end */
			/* page3 start */
			{
				init:function(){
				},
				checkIn:function(){		
					
				},
				checkOut:function(_intoBack){
				}
			},
			/* page3 end */
		];
        $page.methods = {
            init: function(_stage) {
				//生成页面容器
				if(pageArr.length>0){
					for(var i=0; i<pageArr.length; i++){
						pageArr[i].container=$common.Control.create("container");
						pageArr[i].childArr=[];
						pageArr[i].childObj={};
						pageArr[i].container.visible=false;
						pageArr[i].init();
						AddChildPage(pageArr[i]);
						_stage.addChild(pageArr[i].container);
					}
				}
				//跳转页面
				curPage=-1;
				JumpToLocal($common.homepage);
            }
        };
		function JumpToLocal(_index){
			if( _index<pageArr.length && _index!=tarPage){
				tarPage=_index;
				var _intoFun=function(){
					$common.Control.ani.showAlpha(pageArr[tarPage].container);
					DoSheetAni(pageArr[tarPage].childArr, true);
					pageArr[tarPage].checkIn();
					curPage=tarPage;
				};
				curPage>=0?pageArr[curPage].checkOut(function(){
					//用于隐藏上一页上面的container中的所有元素，可选
					_intoFun();
				}):_intoFun();
			}
		};
		function DoSheetAni(_childArr, _isIn){
			for(var i=0;i<_childArr.length;i++){
				if(_childArr[i].doAniCall)_childArr[i].doAniCall(_isIn);
			}
		};
		function AddChildPage(_page){
			for(var i=0;i<_page.childArr.length;i++){
				_page.container.addChild(_page.childArr[i].movieClip);
				_page.childObj[_page.childArr[i].frame]=_page.childArr[i];
			}
		}
		function clearChild(_childArr){
			for(var i=0;i<_childArr.length;i++){
				_childArr[i].movieClip =null;
			}
		}
        return $page;
    };
})(jQuery);