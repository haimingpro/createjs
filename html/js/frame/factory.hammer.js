(function($) {
    $.factory_hammer = function() {
        var $factory = {};
        $factory.createHammer = function() {
            var _pdtObj = {};
            var _img = [
                "images/hammer.png"
            ];
            _img.crossOrigin = 'Anonymous';
            var data = {
                images: _img,
                frames: { width: 215, height: 230, regX: 215, regY: 230 },
                animations: {}
            };
            var spriteSheet = new createjs.SpriteSheet(data);
            var sprite = new createjs.Sprite(spriteSheet, "hammer");
            var container = new createjs.Container();
            container.addChild(sprite);
            sprite.x = 215/2;
            container.x = (document.body.clientWidth-215*2)/2;
            sprite.addEventListener("click", clickHandler);

            function clickHandler(event) {
                createjs.Tween.get(sprite, { loop: false }).to({ rotation: 20 }, 80).to({ rotation: 0 }, 80).to({ rotation: -20 }, 80).to({ rotation: 0 }, 80)
                    .to({ rotation: 20 }, 80).to({ rotation: 0 }, 80).to({ rotation: -10 }, 80)
                    .call(tweenCompleteHandler);
            }

            function tweenCompleteHandler() {
                sprite.gotoAndPlay("hammer");
            }
            _pdtObj.mc = container;
            return _pdtObj;
        };
        return $factory;
    };
})(jQuery);
