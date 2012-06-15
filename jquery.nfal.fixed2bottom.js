 /*!
 * NFAL Fixed to Bottom  - jQuery Plugin
 *
 * Copyright 2012, Near Future Arts Lab Co.,Ltd.
 * Released under the MIT License.
 *
 * Version: 0.2.1 (15/06/2012)
 */
(function ($) {
	$.fn.fixed2bottom = function(options) {
		var opts = $.extend({}, $.fn.fixed2bottom.defaults, options);

		if (!window.console){
			window.console = {
				log: function(){}
			};
		}
		var debug = function (str) {
            if (opts.debugMode) console.log(str);
		};

		var $window		= $(window),
			$document	= $(document);

		var positionfixed = true,
			ua = navigator.userAgent,
			ios = /iphone|ipod|ipad/i.test(ua),
			android = /android/i.test(ua),
			ie6 = /MSIE 6/i.test(ua);
		if(ios || android || ie6){
			positionfixed = false;
		}


		return this.each(function () {
			var $this			= $(this),
				fixedClass		= opts.fixedClass,
				absoluteClass	= opts.absoluteClass,
				offsetTop		= opts.offsetTop,
				$footer			= $(opts.footerTarget),
				footerOffsetTop	= 0,
				footerHeight	= 0,
				marginBtm		= opts.marginBottom,
				liquid			= opts.liquidLayout,
				defaWidth		= $this.width(),
				pare			= $this.parent(),
				pareWidth		= $this.parent().width();

			var footerHeightGet = function () {
				footerOffsetTop	= $footer.offset().top;
				footerHeight	= $footer.outerHeight(true);
				marginBtm = footerHeight + opts.marginBottom;
			};
			var pareWidthGet = function(){
				pareWidth = $this.parent().width();
			};


			if(liquid){
				if(opts.footerTarget !== null ){
					footerHeightGet();
					$window.bind('resize', footerHeightGet);
				}
				$window.bind('resize', pareWidthGet);
			}else if(opts.footerTarget !== null ){
				footerHeightGet();
			}


			if(offsetTop == 'auto'){
				offsetTop = $this.offset().top;
			}


			var adjust = function(){
				debug('marginBtm:'+ marginBtm);
				if($window.height() + $window.scrollTop() < offsetTop + $this.outerHeight(true)){
					debug('#A static');
					$this.removeClass(fixedClass).removeClass(absoluteClass);
					$this.css({
						position:'static',
						top:'auto',
						bottom:'auto',
						width:defaWidth+'px'
					});
					if(liquid){
						$this.css({
							width:pareWidth+'px'
						});
					}
				}else if($window.height() + $window.scrollTop() > $document.height() - marginBtm){
					debug('#B absolute(bottom end)');
					$this.removeClass(fixedClass).addClass(absoluteClass);
					$this.css({
						position:'absolute',
						top:footerOffsetTop - $this.outerHeight(true) + footerHeight - marginBtm + 'px',
						bottom:'auto',
						width:pareWidth+'px'
					});
				}else {
					debug('#C fixed');
					$this.addClass(fixedClass).removeClass(absoluteClass);
					if(positionfixed){
						$this.css({
							position:'fixed',
							top:'auto',
							bottom:opts.marginBottom,
							width:pareWidth+'px'
						});
					}else{
						$this.css({
							position:'absolute',
							left:0,
							top:$window.height() - $this.outerHeight(true) - opts.marginBottom + $window.scrollTop() + pare.offset().top + 'px',
							bottom:'auto',
							width:pareWidth+'px'
						});
					}
				}
			};
			adjust();
			$window.bind('scroll resize', adjust);
		});
		
	};
	$.fn.fixed2bottom.defaults = {
		debugMode		: false,	//デバッグモード
		offsetTop		: 'auto',	//基本的にautoのままで使用
		footerTarget	: null,		//フッターに被せないようにする場合は、ここにフッターを指定
		marginBottom	: 0,		//対象エレメントの下に空けるマージン値
		liquidLayout	: false,	//リキッドレイアウトの場合はtrue
		fixedClass		: 'f2t_scrolling',	//スクロール中に追加されるクラス名
		absoluteClass	: 'f2t_bottomEnd'	//下端までスクロールされた時に追加されるクラス名
	};

})(jQuery);