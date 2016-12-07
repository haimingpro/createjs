(function($) {
	$.factory=(function(){
		var thisInstance;
		function Construct(){
			var $factory={};
			$factory.spriteBasic=function(_data){
				var _pdtObj={};
				var _img=$common.Loader.getResult(_data.id);
				_img.crossOrigin = 'Anonymous';
				var spriteSheet = new createjs.SpriteSheet({
					images: [_img], 
					frames: {regX:_img.width*0.5, regY:_img.height*0.5, width:_img.width, height:_img.height} 
				});
				var sprite = new createjs.Sprite(spriteSheet).set({x:_data.x, y:_data.y});
				_pdtObj.mc=sprite;
				return _pdtObj;
			};
			return $factory;
		};
		function getInstance(){
			if(thisInstance===undefined)thisInstance=new Construct();
			return thisInstance;
		};
		return {getInstance:getInstance};
	})();
})(jQuery);