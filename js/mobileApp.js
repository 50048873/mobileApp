/*!
 * mobileApp.js
 * by 50048873@qq.com 2017-05-02
**/

(function(window, $) { 
	//默认参数
	var defaults = { 
		animationTypes: 'slide', //其它值：fade
		animatedTime: 225,		//默认值
		errorPage: 'template/error.html',
		pageClass: '.page',
		rootFooterId: '#footer'
	};

	var anchorLink = /^#[a-z|A-Z|0-9|_|-]*/;
	var hrefLink = /^[a-z|A-Z|0-9|_|-|\/]+\.ht[m|ml]/;
	var baseUrl = location.href;
	var $body = $('body');

	//构建类
	var mobileApp = function (options) { 
		this.init(options);
	}

	mobileApp.extend = mobileApp.prototype.extend = function() {
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[ 0 ] || {},
			i = 1,
			length = arguments.length,
			deep = false;

		// Handle a deep copy situation
		if ( typeof target === "boolean" ) {
			deep = target;

			// Skip the boolean and the target
			target = arguments[ i ] || {};
			i++;
		}

		// Handle case when target is a string or something (possible in deep copy)
		if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
			target = {};
		}

		// Extend jQuery itself if only one argument is passed
		if ( i === length ) {
			target = this;
			i--;
		}

		for ( ; i < length; i++ ) {

			// Only deal with non-null/undefined values
			if ( ( options = arguments[ i ] ) != null ) {

				// Extend the base object
				for ( name in options ) {
					src = target[ name ];
					copy = options[ name ];

					// Prevent never-ending loop
					if ( target === copy ) {
						continue;
					}

					// Recurse if we're merging plain objects or arrays
					if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
						( copyIsArray = jQuery.isArray( copy ) ) ) ) {

						if ( copyIsArray ) {
							copyIsArray = false;
							clone = src && jQuery.isArray( src ) ? src : [];

						} else {
							clone = src && jQuery.isPlainObject( src ) ? src : {};
						}

						// Never move original objects, clone them
						target[ name ] = jQuery.extend( deep, clone, copy );

					// Don't bring in undefined values
					} else if ( copy !== undefined ) {
						target[ name ] = copy;
					}
				}
			}
		}

		// Return the modified object
		return target;
	};

	mobileApp.extend({ 
		//判断用户点击是否过快
		prev: null,
		next: null,
		times: 0,
		tapIsTooFast: function(minTime) { 
			var prev = this.prev, 
				next = this.next, 
				times = this.times;

			if (times === 0) { 
				this.prev = new Date().getTime();
				this.times++;
			} else if (times === 1) { 
				this.next = new Date().getTime();
				this.times--;
			}

			if (prev && next) { 
				var diff = Math.abs(next - prev);
				return diff < minTime;
			}
		},
		//检测网络
		isOnLine: function() { 
			return window.navigator.onLine;
		},
		//带遮罩的提示框
		maskDialog: function(obj) { 
			var str = '<div class="maskDialog">' + 
							'<div class="mask"></div>' + 
							'<div class="dialog">' + 
								'<div class="dialog-body">' + 
									'<h3>' + obj.title + '</h3>' + 
									'<p>' + obj.content + '</p>' + 
								'</div>' + 
								'<div class="dialog-footer">' + 
									'<button id="' + obj.footerLeftId + '">' + obj.footerLeftTxt + '</button>' + 
									'<button id="' + obj.footerLeftId + '">' + obj.footerRightTxt + '</button>' + 
								'</div>' + 
							'</div>' + 
						'</div>';
			$body.append(str);
		},
		//异步加载文件
		loadFile: function(href) { 
			return $.ajax({ 
				url: baseUrl + href,
				beforeSend: function() { 
					$('.loading').show();
				},
				complete: function(XMLHttpRequest, textStatus) { 
					$('.loading').hide();
				}
			});
		},
		//网络连接失败提示
		weakNetTip: function(targetEle) { 
			var html = '<div class="noNet zIndex-3">' +
							'<img id="refresh" src="img/error.png" alt="" />' +
							'<h3>网络不给力啊</h3>' +
							'<p>亲，请检查一下网络后再试试吧</p>' +
							'<p>点击图片重新加载</p>' +
						'</div>';
			var $targetEle = $(targetEle);
			if ($targetEle.children('.noNet').length === 0) { 
				$(html).appendTo($targetEle);
			}
		},
		//缓存模版页面
		templateCache: function(arr) { 
			if ($.isArray(arr)) { 
				for (var i = 0, len = arr.length; i < len; i++) { 
					var path = arr[i];
					$.ajax({ 
						url: baseUrl + path,
						beforeSend: function() { 
							
						},
						success: function(data, textStatus, jqXHR) { 
							$body.data(path, data);
						},
						error: function(XMLHttpRequest, textStatus, errorThrown) { 
							$.error(errorThrown + '. 请检查' + path + '的路径是否正确');
						},
						complete: function(XMLHttpRequest, textStatus) { 
							
						}
					});
				}
			} else { 
				$.error('你需要传入一个带文件路径的数组');
			}
		}
	});

	//初始化应用
	mobileApp.prototype.init = function(options) { 
		this.prevIndex = 0;
		this.lookedPages = [];
		$.extend(this, defaults, options);
		
		this.registerALink();
	};

	//动画前进
	mobileApp.prototype.goNextPage = function(prevPage, nextPage) { 
		$(prevPage).addClass('slideouttoleft');
		$(nextPage).show().addClass('slideinfromright');
	};

	//动画返回
	mobileApp.prototype.goPrevPage = function(prevPage, nextPage) { 
		$(prevPage).addClass('slideouttoright');
		$(nextPage).show().addClass('slideinfromleft');
	};

	//清除动画类
	mobileApp.prototype.clearAnimateClass = function(prevPage, nextPage) { 
		var M = this;
		setTimeout(function() { 
			$(prevPage).hide().add(nextPage).removeClass('slideouttoleft slideinfromright slideouttoright slideinfromleft');
		}, M.animatedTime);
	};

	//移除无用的页面元素
	mobileApp.prototype.removeUnuseableEle = function(prevPage) { 
		var M = this;
		setTimeout(function() { 
			$(prevPage).remove();
		}, M.animatedTime);	
	};
	
	//获取点击的a标签所在的页面	
	mobileApp.prototype.getPrevPage = function(aEle) { 
		var M = this;
		return $(aEle).parents(M.pageClass);
	};

	//设置页面的标题（title标签）
	mobileApp.prototype.setPageTitle = function(aEle, nextPage) { 
		var title = $(aEle).data('title') || $(nextPage).data('title') || '国家电网';
		$('title').text(title);
		return title;
	};

	//设置模版页面的头部内容
	mobileApp.prototype.setPageHeader = function(aEle, nextPage) { 
		var title = $(aEle).data('title') || '标题';
		var right = $(aEle).data('right');
		$(nextPage).find('h1').text(title);
		$(nextPage).find('.h-right').text(right);
	};

	//锚连接切换
	mobileApp.prototype.togglePage = function(aEle) { 
		var M = this;
		//切换页脚选中状态
		$(aEle).addClass('active').siblings().removeClass('active');

		//动画切换页面
		var nextIndex = $(aEle).index();
		var $pages = $(M.pageClass),
			$prevPage = $pages.eq(M.prevIndex),
			$nextPage = $pages.eq(nextIndex);
		
		M.setPageTitle(aEle, $nextPage);

		//点击相同
		if (nextIndex === M.prevIndex) return;

		if (M.animationTypes === 'slide') { //slide动画
			if (nextIndex > M.prevIndex) { //前进
				M.goNextPage($prevPage, $nextPage);
			} else { //后退
				M.goPrevPage($prevPage, $nextPage);
			}
			M.clearAnimateClass($prevPage, $nextPage);
			
		} else if (M.animationTypes === 'fade') { //fade动画
			$prevPage.hide();
			$nextPage.fadeIn(M.animatedTime);
		}
		M.prevIndex = nextIndex;
	};

	//注册页面中所有的a链接点击后的行为
	mobileApp.prototype.registerALink = function() { 
		var M = this;
		//var animationTypes = M.animationTypes;
		$body.on('click', 'a', function(e) { 
			e.preventDefault();
			//点击过快禁用
			if (mobileApp.tapIsTooFast(M.animatedTime)) return;

			var href = $(this).attr('href');
			var	rel = $(this).data('rel');
			var aEle = this;

			//如果是有效锚链接
			if (anchorLink.test(href) && ($(aEle).parent().parent()[0].tagName === 'BODY')) { 
				//切换页脚选中状态
				M.togglePage(aEle);
			} 

			//如果是加载外部文件
			else if (hrefLink.test(href))  { 
				if ($body.data(href)) { //如果已经缓存了
					M.handleAjaxPage($body.data(href), aEle, href);
				} else { 
					mobileApp.loadFile(href)
						.done(function(data, textStatus, jqXHR) { 
							M.handleAjaxPage(data, aEle, href);
						})
						.fail(function(data, textStatus, jqXHR) { 
							M.loadErrorPage(data, aEle, M.errorPage);
						});
				}
			} 

			//如果是返回
			else if (rel === 'back') { 
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

	//异步加载错误提示页面
	mobileApp.prototype.loadErrorPage = function(data, aEle, href) { 
		var M = this;
		mobileApp.loadFile(href)
			.done(function(data, textStatus, jqXHR) { 
				M.handleAjaxPage(data, aEle, href);
			})
			.fail(function(data, textStatus, jqXHR) { 
				$.error('请检查' + M.errorPage + '的路径是否正确');
			});
	};

	//异步加载页面的处理
	mobileApp.prototype.handleAjaxPage = function(data, aEle, href) { 
		var M = this;
		var $prevPage = M.getPrevPage(aEle);
		var $nextPage = $(data).appendTo($body).attr('id', M.getUseablePageId());
		var title = M.setPageTitle(aEle, $nextPage);
		M.setPageHeader(aEle, $nextPage);

		M.goNextPage($prevPage, $nextPage);
		M.clearAnimateClass($prevPage, $nextPage);
		M.pushState(title, M.getFilename(href), null);
		M.lookedPages.push($prevPage);
	};

	//获取a链接中的文件名
	mobileApp.prototype.getFilename = function(href) { 
		var hasPath = href.indexOf('/') != -1;
		if (hasPath) { 
			return href.split('/').pop();
		}
	};

	//把地址栏加入history
	mobileApp.prototype.pushState = function(title, url, id) { 
		var state = {
			title: title,
			url: url,
			id: id
		};
		history.pushState(state, title, url);
	};

	//获取页面中最大的id值加1
	mobileApp.prototype.getUseablePageId = function() { 
		var M = this;
		var $pages = $(M.pageClass);
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

	return window.ma = window.mobileApp = mobileApp;
})(window, jQuery);