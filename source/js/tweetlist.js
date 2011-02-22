TweetList.prototype = new EventDispatcher();
TweetList.constructor = TweetList;

function TweetList(URL)
{
	var INTERVAL	= 1000*5;
	
	var self	  = this;
	var model 	  = new TRModel(URL);
	var tweets	  = new Array();
	var rendered  = false;
	var timeout   = null;
	var lastID	  = null;
	var active	  = false;
	
	this.element  = null;
	this.show 	  = show;
	this.hide 	  = hide;
	this.id		  = URL;
	this.show	  = show;
	this.toString = toString;
	this.load	  = load;
	
	function load()
	{
		model.addEventListener("onDataChange", dataChanged);
		model.load();
	};
	
	
	function poll()
	{
		model.poll(lastID);
	}
	
	
	function dataChanged(e)
	{
		var data  = e.target.getData();
		var i 	  = 0;
		var total = data.length-1;
		var t;
		
		if(data.length-1 < 0) 
		{
			clearTimeout(timeout);
			//if(active) timeout = setTimeout(poll, INTERVAL);
			return false;
		}
		
		for(i;i<=total;i++)	
		{
			t = new Tweet();
			if(self.id == "viewerList") t.type = "viewer";
			t.setData(data[i]);
			tweets.push({tweet:t, id:i})
		};
		
		dispatchEvent('tweetListLoaded', self);
		
		lastID = data[0].order_id;
		clearTimeout(timeout);
		//if(active) timeout = setTimeout(poll, INTERVAL);
		
	};
	
	
	function show()
	{
		var html ='';
		var tweet;
		var total = tweets.length - 1;
		var delay = 300;
		var tweetObj;
		var i = 0;
		
		self.element.html('');
		
		for(i;i<=total;i++)	
		{
			tweet 	 = tweets[i].tweet;
			tweetObj = tweet.getHTML();
			tweetObj.stop().delay(delay*i).animate({opacity:1, top:0}, { duration:500, complete: function(){ $(this).css('filter', '');} });
			tweetObj.delay(i*delay).fadeIn(250);
			self.element.append(tweetObj);
		};

		if(self.id != "viewerList") self.element.insertAfter('#loadmore');
		if(self.id == "viewerList") $('#viewer-timeline').append(self.element);
		
		if(self.element) self.element.fadeIn(250, null, function(){dispatchEvent("onShowing", self);});
		active = true;
	};
	
	
	function hide()
	{
		active = false;
		if(self.element) self.element.fadeOut(250, null, 
			function()
			{ 
				$(".qtip").remove();
				self.element.detach();
				dispatchEvent("onHidden", self);
			});
	};

	
	
	
	function toString()
	{
		return "Tweetlist";
	};
	
	return this;
};