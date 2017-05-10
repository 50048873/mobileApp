$(function() { 
	var baseUrl = location.href;
	var $body = $('body');

	//点击“发现”链接，异步加载“#page1”对应的内容数据
	$body.isLoaded = false;
	$body.on('click', function(e) { 
		var href = $(e.target).attr('href');
		if (href === '#page1') { 
			if ($body.isLoaded) return;
			ma.loadFile('template/page11.html')
				.done(function(data, textStatus, jqXHR) { 
					$('#page1').html(data);
					$body.isLoaded = true;
				})
				.fail(function(XMLHttpRequest, textStatus, errorThrown) { 
					ma.noNetTip('#page1');
					$('.noNet').show();
				});
		} else { 
			$('.noNet').hide();
		}
	});

	//点击网络错误提示图标刷新
	$body.on('click', '#refresh', function() { 
		$('.noNet').hide();
		ma.loadFile('template/page1.html')
			.done(function(data, textStatus, jqXHR) { 
				$('#page1').html(data);
				$body.isLoaded = true;
			})
			.fail(function(XMLHttpRequest, textStatus, errorThrown) { 
				ma.noNetTip('#page1');
				$('.noNet').show();
			});
	});

	ma.templateCache(['template/moban1.html']);

	//租房页面切换
	$('body').on('click', 'a', function() { 
		/*var _this = this;
		maInstance.togglePage(_this);*/
		if ($(this).parent().attr('id') === 'footer_zf') { 
			var index = $(this).index();
			$(this).addClass('active').siblings().removeClass('active');
			$(this).parent().siblings('.page').eq(index).fadeIn().siblings().not('.footer').hide();
		}
	});
});