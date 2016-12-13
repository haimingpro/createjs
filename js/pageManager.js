(function($) {
    $.pageManager = function() {
        var $page = {};
        var curPage, tarPage;
        var pageArr = [
            /* page0 start */
            {
                init: function() {
                    this.container.addChild($common.Control.create("bitmap", { img: Loader.getResult("bg_puzzle") }).set({ x: -145, y: 134 }));
                    this.childArr.push(new $.pageManager().sheet({ data: Data.static, frame: "bg_entrance" }));
                    this.childArr.push(new $.pageManager().sheet({ data: Data.static, frame: "slogan" }));
                    this.childArr.push(new $.pageManager().sheet({ data: Data.button, frame: "startGame" }));
                },
                checkIn: function() {
                	this.childObj.startGame.movieClip.addEventListener("click", function(evt) {
						//点击”开始挑战“按钮
						$common.dev.getNum(function(data){ //判断还有几次机会
							if(data.num>=1) JumpToLocal(1);
						});
						evt.remove();
					});
                },
                checkOut: function(_intoBack) {
                	//此处要清理掉本画面，否则进入下个画面了东西还在
                	_intoBack();
                }
            },
            /* page0 end */
            /* page1 start */
            {
                init: function() {


                },
                checkIn: function() {

                },
                checkOut: function(_intoBack) {

                }
            },
            /* page1 end */
            /* page2 start */
            {
                init: function() {

                },
                checkIn: function() {

                },
                checkOut: function(_intoBack) {

                }
            },
            /* page2 end */
            /* page3 start */
            {
                init: function() {},
                checkIn: function() {

                },
                checkOut: function(_intoBack) {}
            },
            /* page3 end */
        ];
        $page.methods = {
            init: function(_stage) {
                //生成页面容器
                if (pageArr.length > 0) {
                    for (var i = 0; i < pageArr.length; i++) {
                        pageArr[i].container = $common.Control.create("container");
                        pageArr[i].childArr = [];
                        pageArr[i].childObj = {};
                        pageArr[i].container.visible = false;
                        pageArr[i].init();
                        AddChildPage(pageArr[i]);
                        _stage.addChild(pageArr[i].container);
                    }
                }
                //跳转页面
                curPage = -1;
                JumpToLocal($common.homepage);
            }
        };

        function sheet(option) {
            var $sheet = option.dom ? $(option.dom) : $("<a></a>");
            $sheet.init = function() {
                var index = option.data.animations[option.frame];
                this.option = {};
                this.option.frame = option.frame;
                this.option.point = option.data.point[index];
                this.movieClip = $common.Control.create("sheet", { framerate: 30, images: [Loader.getResult(option.data.id)], frames: option.data.frames, animations: option.data.animations });
                this.movieClip.x = this.option.point.x;
                this.movieClip.y = this.option.point.y;
                this.movieClip.gotoAndStop(option.frame);
                if (option.isClick) this.setMousedown();
                this.frame = this.option.frame;
                return this;
            };
            $sheet.setDirection = function(obj) {
                var x = obj ? obj.x : option.data.x;
                var y = obj ? obj.y : option.data.y;
                this.movieClip.x = x;
                this.movieClip.y = y;
                return this;
            };
            $sheet.setMousedown = function() {
                this.movieClip.addEventListener("mousedown", function() { $sheet.click(); });
                return this;
            };
            $sheet.click = function() {
                this.trigger("click", [{ el: this, option: option }]);
            };
            $sheet.doAniCall = function(isIn, call) {
                $common.Control.tween(this.movieClip, this.option.point, isIn, call);
            };
            $sheet.init();
            return $sheet;
        }

        function popup(option) {
            var $popup = {};
            var tempPanel = null;
            //查看原图
            $popup.lastView = function(pra) {
                var content = $common.Control.create("container").set({ alpha: 1, x: 0, y: 0 });
                //puzzleCon
                var puzzleCon = $common.Control.create("container").set({ alpha: 0, x: 22, y: 1334 });
                var border = $common.Control.create("shape").set({ graphics: new createjs.Graphics().beginFill("#ff0000").drawRect(0, 0, 706, 768) });
                var puzzle = $common.Control.create("bitmap", { img: Loader.getResult("Bpuzzle0" + ($common.option.selectedId + 1) + "") }).set({ x: 10, y: 10 });
                puzzleCon.addChild(border, puzzle);
                //textCon
                var textCon = $common.Control.create("container").set({ alpha: 0, x: 0, y: -300 });
                //如果函数返回值为常规意义上的值类型（Number、String、Boolean）时，new函数将会返回一个该函数的实例对象，而如果函数返回一个引用类型（Object、Array、Function），则new函数与直接调用函数产生的结果等同。
                var backGame = new sheet({ data: Data.button, frame: "backGame" });
                var yellowB = $common.Control.create("shape").set({
                    x: 0,
                    y: 0,
                    graphics: new createjs.Graphics()
                        .beginBitmapFill(Loader.getResult("bg_yellow"), "repeat").drawRect(0, 0, 750, 287)
                });
                textCon.addChild(yellowB, backGame.movieClip);
                content.addChild(textCon, puzzleCon);
                option.stage.addChildAt(content, option.stage.numChildren);
                //tween
                createjs.Tween.get(textCon).to({ alpha: 1, y: 118 }, 500, createjs.Ease.sineInOut);
                createjs.Tween.get(puzzleCon).to({ alpha: 1, y: 305 }, 500, createjs.Ease.sineInOut);
                //event
                backGame.movieClip.addEventListener("mousedown", function() {
                    createjs.Tween.get(textCon).to({ alpha: 0, y: -300 }, 500, createjs.Ease.sineInOut);
                    createjs.Tween.get(puzzleCon).to({ alpha: 0, y: 1334 }, 500, createjs.Ease.sineInOut);
                });
            };
        }

        function loading() {
            var movieclip = $common.Control.create("container").set({ alpha: 0, x: 275, y: 510 });
            var loading = $common.Control.create("bitmap", { img: Loader.getResult("loading") }).set({ x: 10, y: 0, textAlign: "center" });
            var text = $common.Control.create("text", { text: "0", font: "bold 28px Microsoft YaHei", color: "#ff0000" }).set({ x: 155, y: -10, textAlign: "center" });
            var percentBorder = $common.Control.create("shape").set({ x: 0, y: 30, graphics: new createjs.Graphics().setStrokeStyle(3).beginStroke("#ff0000").drawRect(0, 0, 200, 21) });
            var percent = $common.Control.create("shape").set({ x: 5, y: 35, scaleX: 0, graphics: new createjs.Graphics().beginFill("#ff0000").drawRect(0, 0, 190, 11) });
            movieclip.addChild(loading, text, percentBorder, percent);
            createjs.Tween.get(movieclip).to({ alpha: 1, y: movieclip.y + 50 }, 500, createjs.Ease.sineInOut);
            return { movieClip: movieclip, text: text, percent: percent };
        }

        function JumpToLocal(_index) {
            if (_index < pageArr.length && _index != tarPage) {
                tarPage = _index;
                var _intoFun = function() {
                    $common.Control.ani.showAlpha(pageArr[tarPage].container);
                    DoSheetAni(pageArr[tarPage].childArr, true);
                    pageArr[tarPage].checkIn();
                    curPage = tarPage;
                };
                
                //_intoBack()执行的地方
                if(curPage >= 0){
                	pageArr[curPage].checkOut(function() {
                    //用于隐藏上一页上面的container中的所有元素，可选
                    _intoFun();
                });
                }else{
                	_intoFun();
                }
            }
        }

        function DoSheetAni(_childArr, _isIn) {
            for (var i = 0; i < _childArr.length; i++) {
                if (_childArr[i].doAniCall) _childArr[i].doAniCall(_isIn);
            }
        }

        function AddChildPage(_page) {
            for (var i = 0; i < _page.childArr.length; i++) {
                _page.container.addChild(_page.childArr[i].movieClip);
                _page.childObj[_page.childArr[i].frame] = _page.childArr[i];
            }
        }

        function clearChild(_childArr) {
            for (var i = 0; i < _childArr.length; i++) {
                _childArr[i].movieClip = null;
            }
        }
        $page.sheet = sheet;
        $page.popup = popup;
        $page.loading = loading;
        $page.JumpToLocal = JumpToLocal;
        $page.DoSheetAni = DoSheetAni;
        $page.clearChild = clearChild;
        return $page;
    };
})(jQuery);
