(function($) {
    $.factory_walkingDod = function() {
        var $factory = {};
        $factory.createDog = function(_data, _stage) {
            var _pdtObj = {};
            var _img = [
                "img/bg.jpg",
                "img/dog.png"
            ];
            var stage = _stage;
            _img[0].crossOrigin = _img[1].crossOrigin = 'Anonymous';
            var data = {
                images: ["images/dog.png"],
                frames: { width: 120, height: 100, regX: 60, regY: 50 },
                animations: {
                    stand: [0, 1, "stand", 0.2],
                    walk: {
                        frames: [0, 1, 2, 3, 4],
                        next: "walk",
                        speed: 0.2
                    }
                }
            };
            var spriteSheet = new createjs.SpriteSheet(data);
            var sprite = new createjs.Sprite(spriteSheet, "stand");
            var container = new createjs.Container();
            var shape = new createjs.Shape();
            stage.setBounds(0, 0, $common.Global.maxWidth, $common.Global.maxHeight);

            shape.graphics.beginFill("#ededed").drawRect(0, 0, stage.getBounds().width, stage.getBounds().height);

            shape.setBounds(0, 0, $common.Global.maxWidth, $common.Global.maxHeight);

            shape.setBounds(0, 0, window.outerWidth, window.outerHeight);
            sprite.setBounds(0, 0, 120, 100);
            stage.addChild(shape);
            container.addChild(sprite);
            console.log("window width,window height", $common.Global.maxWidth + "|" + $common.Global.maxHeight);
            stage.addEventListener("click", clickHandler);

            function clickHandler(event) {
                createjs.Tween.removeTweens(sprite);
                if (event.rawX > sprite.x) {
                    sprite.scaleX = 1;
                } else if (event.rawX < sprite.x) {
                    sprite.scaleX = -1; //为-1的时候可以转方向
                }
                console.log(event);
                console.log("sprite.x,sprite.y", sprite.x + "|" + sprite.x);
                console.log("rawV,rawY", event.rawX + "|" + event.rawY);
                createjs.Tween.get(sprite).to({ x: event.rawX, y: event.rawY }, 1000).call(tweenCompleteHandler);
                sprite.gotoAndPlay("walk");
            }

            function tweenCompleteHandler() {
                sprite.gotoAndPlay("stand");
            }
            _pdtObj.mc = container;
            return _pdtObj;
        };
        return $factory;
    };
})(jQuery);
