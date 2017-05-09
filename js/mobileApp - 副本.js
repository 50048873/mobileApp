/*!
 * mobileApp.js
 * by 50048873@qq.com 2017-05-02
**/

(function(window, $) { 
	//默认参数
	var defaults = { 
		animationTypes: 'slide', //其它值：fade
		animatedTime: 225,		//默认值
		errorPage: 'template/error.html'
	};

	//构建类
	function MobileApp(options) { 
		this.init(options);
	}

	//初始化应用
	MobileApp.prototype.init = function(options) { 
		this.baseUrl = location.href;
		this.prevIndex = 0;
		this.lookedPages = [];
		this.$body = $('body');

		$.extend(this, defaults, options);
		this.setAnimateTime(this.animatedTime);
		this.registerALink();
	};

	//根据用户传入参数设置动画时间
	MobileApp.prototype.setAnimateTime= function(animatedTime) { 
		if (this.animatedTime == defaults.animatedTime) return;
		var newTime = '.slideinfromright, .slideouttoleft, .slideouttoright, .slideinfromleft {-webkit-animation-duration: ' + animatedTime + 'ms;animation-duration: ' + animatedTime + 'ms;}';
		$('<style>' + newTime + '</style>').appendTo($('head'));
	};


	//判断用户点击是否过快
	MobileApp.prototype.tapIsTooFast = function(minTime) { 
		var prev = this.tapIsTooFast.opt.prev, 
			next = this.tapIsTooFast.opt.next, 
			times = this.tapIsTooFast.opt.times;

		if (times === 0) { 
			this.tapIsTooFast.opt.prev = new Date().getTime();
			this.tapIsTooFast.opt.times++;
		} else if (times === 1) { 
			this.tapIsTooFast.opt.next = new Date().getTime();
			this.tapIsTooFast.opt.times--;
		}

		if (prev && next) { 
			var diff = Math.abs(next - prev);
			return diff < minTime;
		}
	};

	MobileApp.prototype.tapIsTooFast.opt = { 
		prev: null,
		next: null,
		times: 0
	};

	//动画前进
	MobileApp.prototype.goNextPage = function(prevPage, nextPage) { 
		$(prevPage).addClass('slideouttoleft');
		$(nextPage).show().addClass('slideinfromright');
	};

	//动画返回
	MobileApp.prototype.goPrevPage = function(prevPage, nextPage) { 
		$(prevPage).addClass('slideouttoright');
		$(nextPage).show().addClass('slideinfromleft');
	};

	//清除动画类
	MobileApp.prototype.clearAnimateClass = function(prevPage, nextPage) { 
		var M = this;
		setTimeout(function() { 
			$(prevPage).hide().add(nextPage).removeClass('slideouttoleft slideinfromright slideouttoright slideinfromleft');
		}, M.animatedTime);
	};

	//移除无用的页面元素
	MobileApp.prototype.removeUnuseableEle = function(prevPage) { 
		var M = this;
		setTimeout(function() { 
			$(prevPage).remove();
		}, M.animatedTime);	
	};
	
	//获取点击的a标签所在的页面	
	MobileApp.prototype.getPrevPage = function(aEle) { 
		return $(aEle).parents('.page');
	};

	//设置页面的标题（title标签）
	MobileApp.prototype.setPageTitle = function(aEle, nextPage) { 
		var title = $(aEle).data('title') || $(nextPage).data('title') || $(nextPage).find('h1').text() || '国家电网';
		$('title').text(title);
		return title;
	};

	//注册页面中所有的a链接点击后的行为
	MobileApp.prototype.registerALink = function() { 
		var M = this;
		var animationTypes = M.animationTypes;
		M.$body.on('click', 'a', function(e) { 
			e.preventDefault();
			//点击过快禁用
			if (M.tapIsTooFast(M.animatedTime)) return;

			var href = $(this).attr('href'),
				rel = $(this).data('rel');
			var firstLetter = href.charAt(0);
			var aEle = this;
			
			
			if (firstLetter === '#') { //如果是锚链接

				/*
					var filepath = $(this).data('filepath');
					if (filepath) { 
						M.loadFile(filepath)
							.done(function(data, textStatus, jqXHR) { 
								$('.mask').fadeOut(200);
								$(href).html(data);
							})
							.fail(function(data, textStatus, jqXHR) { 
								M.loadErrorFile(data, aEle, M.errorPage);
							});
					}
				*/

				//切换页脚选中状态
				$(this).addClass('active').siblings().removeClass('active');

				//动画切换页面
				var nextIndex = $(this).index();
				var $pages = $('.page'),
					$prevPage = $pages.eq(M.prevIndex),
					$nextPage = $pages.eq(nextIndex);
				
				M.setPageTitle(aEle, $nextPage);

				//点击相同
				if (nextIndex === M.prevIndex) return;

				if (animationTypes === 'slide') { //slide动画
					if (nextIndex > M.prevIndex) { //前进
						M.goNextPage($prevPage, $nextPage);
					} else { //后退
						M.goPrevPage($prevPage, $nextPage);
					}
					M.clearAnimateClass($prevPage, $nextPage);
					
				} else if (animationTypes === 'fade') { //fade动画
					$prevPage.hide();
					$nextPage.fadeIn(M.animatedTime);
				}
				M.prevIndex = nextIndex;
			} else if (firstLetter !== 'j' && firstLetter !== '#')  { //如果是加载外部文件
				M.loadFile(href)
					.done(function(data, textStatus, jqXHR) { 
						M.simulateDelay(M.handleAjaxPage(data, aEle, href));
					})
					.fail(function(data, textStatus, jqXHR) { 
						M.loadErrorFile(data, aEle, M.errorPage);
					});
			} else if (rel === 'back') { 
				history.back();

				var $prevPage = M.getPrevPage(aEle);
				var $nextPage = M.lookedPages.pop();
				var title = M.setPageTitle(aEle, $nextPage);
				M.goPrevPage($prevPage, $nextPage);
				M.clearAnimateClass($prevPage, $nextPage);
				M.removeUnuseableEle($prevPage);
			} 
		
		});
	};

	MobileApp.prototype.loadErrorFile = function(data, aEle, href) { 
		var M = this;
		M.loadFile(href)
			.done(function(data, textStatus, jqXHR) { 
				M.simulateDelay(M.handleAjaxPage(data, aEle, href));
			})
			.fail(function(data, textStatus, jqXHR) { 
				throw ('请检查' + M.errorPage + '的路径是否正确');
			});
	};

	MobileApp.prototype.loadFile = function(href) { 
		var M = this;
		return $.ajax({ 
			url: M.baseUrl + href,
			beforeSend: function() { 
				$('.mask').fadeIn();
			}
		});
	};

	//异步加载页面的处理
	MobileApp.prototype.handleAjaxPage = function(data, aEle, href) { 
		var M = this;
		$('.mask').fadeOut(200);
		var $prevPage = M.getPrevPage(aEle);
		var $nextPage = $(data).appendTo(M.$body).attr('id', M.getUseablePageId());
		var title = M.setPageTitle(aEle, $nextPage);
		M.goNextPage($prevPage, $nextPage);
		M.clearAnimateClass($prevPage, $nextPage);
		M.pushState(title, M.getFilename(href), null);
		M.lookedPages.push($prevPage);
	};

	//模拟后台延时
	MobileApp.prototype.simulateDelay = function(fn) { 
		var time = Math.random() * 1000;
		setTimeout(fn, time);
	};

	//获取a链接中的文件名
	MobileApp.prototype.getFilename = function(href) { 
		var hasPath = href.indexOf('/') != -1;
		if (hasPath) { 
			return href.split('/').pop();
		}
	};

	//把地址栏加入history
	MobileApp.prototype.pushState = function(title, url, id) { 
		var state = {
			title: title,
			url: url,
			id: id
		};
		history.pushState(state, title, url);
	};

	//获取页面中最大的id值加1
	MobileApp.prototype.getUseablePageId = function() { 
		var $pages = $('.page');
		var ids = [];
		for (var i = 0, len = $pages.length; i < len; i++) { 
			var id = $pages.eq(i).attr('id');
			if (/\d/.test(id)) { 
				var num = id.replace(/\D/g,"") * 1;
				ids.push(num);
			}
		}
		return this.addId = 'page' + (Math.max.apply(null, ids) + 1);
	};

	return window.mobileApp = MobileApp;
})(window, jQuery);