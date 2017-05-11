$(function() { 
	var $body = $('body');

	//检测有没有网络
	if (ma.isOnLine() === false) { 
		/*ma.maskDialog({ 
			title: '提示',
			content: '检测到当前无网络，请设置网络连接',
			footerLeftId: 'cancel',
			footerLeftTxt: '取消',
			footerLeftId: 'setup',
			footerRightTxt: '立即设置'
		});*/
		var $maskDialog = $('.maskDialog');
		$maskDialog.fadeIn();
		$body.on('click', function(e) { 
			if ($(e.target).attr('id') === 'cancel') { 
				$maskDialog.fadeOut()
			}
			if ($(e.target).attr('id') === 'setup') { 
				$maskDialog.fadeOut()
			}
		})
	}

	//点击“发现”链接，异步加载“#page1”对应的内容数据
	$body.isLoaded = false;
	$body.on('click', 'a', function(e) { 
		var href = $(this).attr('href');
		if (href === '#page1') { 
			if ($body.isLoaded) return;
			ma.loadFile('template/page11.html')
				.done(function(data, textStatus, jqXHR) { 
					$('#page1').html(data);
					$body.isLoaded = true;
				})
				.fail(function(XMLHttpRequest, textStatus, errorThrown) { 
					ma.weakNetTip('#page1');
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
				ma.weakNetTip('#page1');
				$('.noNet').show();
			});
	});

	//缓存模版页面
	ma.templateCache(['template/moban1.html']);

	//租房页面切换
	$('body').on('click', 'a', function() { 
		if ($(this).parent().attr('id') === 'footer_zf') { 
			var index = $(this).index();
			$(this).addClass('active').siblings().removeClass('active');
			$(this).parent().siblings('.page').eq(index).fadeIn().siblings().not('.footer').fadeOut();
		}
	});

});