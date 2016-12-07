(function($) {
	$.controller=(function(){
		var thisInstance;
		function Construct(){
			var $controller={};
			
			return $controller;
		};
		function getInstance(){
			if(thisInstance===undefined)thisInstance=new Construct();
			return thisInstance;
		};
		return {getInstance:getInstance};
	})();
})(jQuery);