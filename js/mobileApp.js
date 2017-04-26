(function(window, $) { 
	function MobileApp() { 
		this.animatedTime = 225;
		this.homePageId = '#homePage';
	}

	MobileApp.prototype.init = function(title, url, id) { 
		this.changePage();
		this.registerPopstate();
	};

	MobileApp.prototype.pushState = function(title, url, id) { 
		var state = {
			title: title,
			url: url,
			id: id
		};
		history.pushState(state, title, url);
	};

	MobileApp.prototype.changePage = function() { 
		var _this = this;
		$('body').on('click', 'a', function(e) { 
			e.preventDefault();
			_this.pushState(document.title, this.href, $(this).attr('href'));
			_this.goPage(this);
		});
	};

	MobileApp.prototype.goPage = function() { 
		var _this = this;
		var hash = location.hash;
		if (hash == _this.homePageId) { //首页
			$(_this.homePageId).show().addClass('slideinfromleft');
			$('[id^="page"]:visible').addClass('slideouttoright');
		} else { 
			$(hash).show().addClass('slideinfromright');
			$(_this.homePageId).addClass('slideouttoleft');
		}
		setTimeout(function() { 
			if (hash == _this.homePageId) { 
				$('[id^="page"]:visible').hide();
			} else { 
				$(_this.homePageId).hide();
			}
			
			$('.page').removeClass('slideouttoright slideinfromleft slideouttoleft slideinfromright');
		}, _this.animatedTime);
	};

	MobileApp.prototype.registerPopstate = function() { 
		var _this = this;
		
		window.addEventListener('popstate', function(e) { 
			_this.goPage();
		}, false);
	};

	return window.mobileApp = MobileApp;
})(window, jQuery);