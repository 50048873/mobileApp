$(function() { 
	var baseUrl = location.href;
	$('.footer').on('click', '[href="#page1"]', function() { 
		$.ajax({ 
			url: baseUrl + 'template/page1.html',
			beforeSend: function() { 
				$('.loading').fadeIn();
			},
			success: function(data) { 
				$('.loading').fadeOut(200);
				$('#page1').html(data);
			}
		})
	});

	$('#test').on('click', function() { 
		console.log(baseUrl + 'json/a.json')
		$.ajax({ 
			url: baseUrl + 'json/a.json',
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
	});
});