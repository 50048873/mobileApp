$(function() { 
	var baseUrl = location.href;
	var $body = $('body');

	$.extend({ 
		//网络连接失败提示
		m_noNetTip: function(targetEle) { 
			var html = '<div class="noNet zIndex-3">' +
							'<img id="refresh" src="img/error.png" alt="" />' +
							'<p>网络连接失败，点击刷新</p>' +
						'</div>';
			var $targetEle = $(targetEle);
			if ($targetEle.children('.noNet').length === 0) { 
				$(html).appendTo($targetEle);
			}
		},
		//异步加载文件，返回promise
		m_loadFile: function(href) { 
			return $.ajax({ 
					url: baseUrl + href,
					beforeSend: function(XMLHttpRequest) { 
						$('.loading').show();
					},
					success: function(data, textStatus, jqXHR) { 
						
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) { 
						
					},
					complete: function(XMLHttpRequest, textStatus) { 
						$('.loading').hide();
					}
				})
		}
	});

	//点击“发现”链接，异步加载“#page1”对应的内容数据
	$body.isLoaded = false;
	$body.on('click', function(e) { 
		var href = $(e.target).attr('href');
		if (href === '#page1') { 
			if ($body.isLoaded) return;
			$.m_loadFile('template/page11.html')
				.done(function(data, textStatus, jqXHR) { 
					$('#page1').html(data);
					$body.isLoaded = true;
				})
				.fail(function(XMLHttpRequest, textStatus, errorThrown) { 
					$.m_noNetTip('#page1');
					$('.noNet').show();
				});
		} else { 
			$('.noNet').hide();
		}
	});

	//点击网络错误提示图标刷新
	$body.on('click', '#refresh', function() { 
		$('.noNet').hide();
		$.m_loadFile('template/page1.html')
			.done(function(data, textStatus, jqXHR) { 
				$('#page1').html(data);
				$body.isLoaded = true;
			})
			.fail(function(XMLHttpRequest, textStatus, errorThrown) { 
				$.m_noNetTip('#page1');
				$('.noNet').show();
			});
	});

	//缓存模版页面
	$.m_loadFile('template/moban1.html')
		.done(function(data, textStatus, jqXHR) { 
			$body.data('template/moban1.html', data);
			//console.log($body.data('template/moban1.html'))
		})
		.fail(function(XMLHttpRequest, textStatus, errorThrown) { 
			console.log(textStatus)
		});


	

	/*$body.on('click', 'a', function() { 
		var href = $(this).attr('href');
		$.ajax({ 
			url: baseUrl + href,
			beforeSend: function() { 
				$('.loading').show();
			},
			success: function(data, textStatus, jqXHR) { 
				$('.loading').hide();
				console.log(data)
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
				console.log(textStatus)
			}
		})
	});*/
});