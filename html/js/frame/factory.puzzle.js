(function($) {
    $.factory_puzzle = function() {
        var $factory = {};
        $factory.createPuzzle = function(obj) {
            var _pdtObj = {};
            var data = {
                images: [obj.img.src],
                frames: { width: obj.img.width, height: obj.img.height, regX: 0, regY: 0 },
                animations: {}
            };
            data.images.crossOrigin = 'Anonymous';
            var spriteSheet = new createjs.SpriteSheet(data);
            var shape = new createjs.Shape();
            shape.graphics.beginFill("#fff").drawRect(0, 0, obj.img.width, obj.img.height);
            sprite = new createjs.Sprite(spriteSheet, "puzzle");
            var puzzleCon = new createjs.Container();
            puzzleCon.addChild(sprite);
            puzzleCon.addChild(shape);
            //创建具体拼图
            var imgPieces = [],
                selectBool = true, //单个移动开关
                moveSwitch = true, //整体事件大开关
                bitmap = new createjs.Bitmap(obj.img.src),
                range = [],
                imgId = 0,
                pWidth = obj.img.width,
                pHeight = obj.img.height,
                row = obj.widthCut,
                col = obj.heightCut,
                width = pWidth / row,
                height = pHeight / col;
            for (var o = 0; o < row; o++) { //竖向切
                for (var i = 0; i < col; i++) { //横向切
                    var clone = bitmap.clone();
                    var rect = new createjs.Rectangle(width * i, height * o, width, height);
                    clone.alpha = 0;
                    clone.sourceRect = rect;
                    range.push({ x: (width) * i, y: (height) * o });
                    imgPieces.push({ obj: clone, id: imgId++ });
                }
            }
            //重新排列x，y数据
            imgPieces.sort(function() {
                return 0.5 - Math.random();
            });
            for (var j = 0; j < range.length; j++) {
                imgPieces[j].x = range[j].x;
                imgPieces[j].y = range[j].y;
                createjs.Tween.get(imgPieces[j].obj).to({ alpha: 1, x: range[j].x, y: range[j].y }, 400, createjs.Ease.bounceOut);
            }
            for (var k = 0; k < imgPieces.length; k++) {
                puzzleCon.addChild(imgPieces[k].obj);
                moveImages({ obj: imgPieces[k].obj, id: imgPieces[k].id }); //绑定移动图片事件
            }

            //移动拼图
            function moveImages(parameter) {
                if (!parameter.obj) return false;
                //按下事件
                parameter.obj.addEventListener("mousedown", function(event) {
                    if (!selectBool) return false;
                    var _self = event.target;

                    selectBool = false; //点击的时候开启移动模式
                    puzzleCon.setChildIndex(_self, puzzleCon.numChildren - 1); //点击的时候设置当前图片的层级为最高

                    //记录点击时候的起始位置
                    sx = event.stageX; //鼠标x点触发的位置
                    sy = event.stageY; //鼠标y点触发的位置
                    ox = _self.x; //记录原始位置
                    oy = _self.y; //记录原始位置
                    fzmx = event.stageX - event.target.x;
                    fzmy = event.stageY - event.target.y;

                    //绑定事件
                    event.target.addEventListener('pressup', pressUp);
                    event.target.addEventListener('pressmove', pressMove, false);
                });
            }

            //松开事件
            function pressUp(event) {
                var _self = event.target,
                    xSpace = Math.floor(pWidth / col / 2) - 10,
                    ySpace = Math.floor(pHeight / row / 2) - 10;
                shadowUr(_self, false); //关闭阴影

                //当位移大于键值的时候交换顺序
                var exIndex = 0,
                    flag = null;
                for (var i = 0; i < imgPieces.length; i++) {
                    for (var j = 0; j < imgPieces.length; j++) {
                        if (_self == imgPieces[j].obj) {
                            exIndex = j;
                            exX = imgPieces[j].x;
                            exY = imgPieces[j].y;
                        }
                    }
                    if (_self.id !== imgPieces[i].obj.id) {
                        var objX = imgPieces[i].x,
                            objY = imgPieces[i].y;
                        if (Math.abs(objX - _self.x) < xSpace && Math.abs(objY - _self.y) < ySpace) {
                            flag = { oldIndex: exIndex, newIndex: i, x: Math.abs(objX - exX), y: Math.abs(objY - exY) };
                            break;
                        } else {
                            flag = { oldIndex: exIndex, newIndex: exIndex, x: Math.abs(objX - exX), y: Math.abs(objY - exY) };
                        }
                    }
                }
                //实行交换
                exchange(flag);

                //松开之后解除绑定事件
                event.target.removeEventListener('pressup', pressUp);
                event.target.removeEventListener('pressmove', pressMove);
            }

            //拖动图片
            function pressMove(event) {
                if (!moveSwitch) return false;
                var _self = event.target;
                //移动的时候加上阴影
                shadowUr(_self, true);
                //x轴方向
                if (event.stageX - fzmx < 0) {
                    _self.x = 0;
                } else if (event.stageX - fzmx + _self.getBounds().width > pWidth) {
                    _self.x = pWidth - _self.getBounds().width;
                } else {
                    _self.x = event.stageX - fzmx;
                }

                //y轴移动方向
                if (event.stageY - fzmy < 0) {
                    _self.y = 0;
                } else if (event.stageY - fzmy + _self.getBounds().height > pHeight) {
                    _self.y = pHeight - _self.getBounds().height;
                } else {
                    _self.y = event.stageY - fzmy;
                }
            }

            //交换顺序
            function exchange(obj) {
                //这边阐述了变量和对象之间的区别，变量赋值之后不会随着赋值点而改变，但是对象会！！！
                var oldObj = imgPieces[obj.oldIndex];
                var newObj = imgPieces[obj.newIndex];
                var x = oldObj.x,
                    y = oldObj.y,
                    _x = newObj.x,
                    _y = newObj.y;
                imgPieces.splice(obj.oldIndex, 1, newObj);
                imgPieces.splice(obj.newIndex, 1, oldObj);
                tween({ el: imgPieces[obj.oldIndex].obj, x: imgPieces[obj.newIndex].x, y: imgPieces[obj.newIndex].y });
                tween({ el: imgPieces[obj.newIndex].obj, x: imgPieces[obj.oldIndex].x, y: imgPieces[obj.oldIndex].y });
                imgPieces[obj.oldIndex].x = x;
                imgPieces[obj.oldIndex].y = y;
                imgPieces[obj.newIndex].x = _x;
                imgPieces[obj.newIndex].y = _y;

                //每次调换之后检测是否拼正确了,然后判断是否去下一页
                var pass = checkPass();
                if (pass) {
                    complete();
                }
            }

            function tween(parameter) {
                if (!parameter.el) return false;
                var _self = parameter.el,
                    _selfX = parameter.x || 0,
                    _selfY = parameter.y || 0;
                createjs.Tween.get(_self).to({ x: _selfX, y: _selfY }, 300).call(function() {
                    selectBool = true; //关闭拖动开关 
                });
            }

            function shadowUr(el, bool) {
                if (bool) {
                    el.shadow = new createjs.Shadow("rgba(0, 0, 0, .5)", 0, 0, 20);
                } else {
                    el.shadow = null;
                }
            }

            function checkPass() {
                var pass = true;
                for (var i = 0; i < imgPieces.length; i++) {
                    if (i !== imgPieces[i].id) {
                        pass = false;
                        break;
                    } else {
                        pass = true;
                    }
                }
                return pass;
            }

            function complete() {
                obj.callback();
            }
            _pdtObj.mc = puzzleCon;
            _pdtObj.moveImages = moveImages;
            _pdtObj.pressUp = pressUp;
            _pdtObj.pressMove = pressMove;
            _pdtObj.exchange = exchange;
            _pdtObj.tween = tween;
            _pdtObj.shadowUr = shadowUr;
            _pdtObj.checkPass = checkPass;
            _pdtObj.complete = complete;
            return _pdtObj;
        };
        return $factory;
    };
})(jQuery);
