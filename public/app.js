// Our app :)  
var app = angular.module("Brooklyn", []);

// Our Angular Directive
app.directive("ngbrooklynart", function(){
	return {
		controllerAs: "brooklynart",
		controller: ["$http", function RandCtrl($http){
			this.$http = $http;
			var self= this;		
			this.getArt = function(data) {
				$('.footer').fadeOut( "fast" );
				$('.about').fadeOut( "fast" );
				$('.error-message').fadeOut( "fast" );
				$('.related-artists').fadeOut( "fast" );
				$('.related-shows').fadeOut( "fast" );
				self.objects = [];
				self.artists =[];
				self.exhibitions =[];
				self.images =[];
				var query = {query:this.search};
				// our post request, passing our search them as the query
				self.$http.post("/Search", query)
				.then ( function successCallback(response) {
				// if there are no results, Jquery action
				if (parseInt(response.data.response.resultset[0]['$'].total) === 0){
					$('.error-message').fadeIn( "fast" );
				}
				// if there are results:	
				// push responses into arrays then rendered on client
					// check if there are objects
					if (response.data.response.resultset[0].items[0]['object']){
						var objects = response.data.response.resultset[0].items[0]['object'];
						for (var x=0; x<objects.length; x++) {
							var url = objects[x]['$'].uri;	
							var imageLink = objects[x]['images'][0]['image'][0]['$'].uri;
							var title = objects[x]['$'].title;
							var medium = objects[x]['$'].medium;
							var image = {url: url, link: imageLink, title: title, medium: medium};
							// check if each specific object is attributed to an artist or not
							var check = objects[x]['artists'];
							if (check) {
								var artist = check[0]['artist'][0]['$']['name'];							
								image.artist = artist;
							}
							// push to array
							self.images.push(image); 
						}	
					}
					// check if there are related artists
					 if (response.data.response.resultset[0].items[0]['artist']){
					 	var artists = response.data.response.resultset[0].items[0]['artist'];
					 	for (var a=0; a<artists.length; a++) {	
					 		var name = artists[a]['$'].name;
					 		var url = artists[a]['$'].uri;
					 		var artist = { name: name, url: url };
					 		self.artists.push(artist);
					 	}
						 $('.related-artists').fadeIn( "fast" );
					 }
					 // check if there are related exhibitions
					 if (response.data.response.resultset[0].items[0]['exhibition']) {
						var exhibitions = response.data.response.resultset[0].items[0]['exhibition'];
					 	for (var a=0; a<exhibitions.length; a++) {	
					 		var title = exhibitions[a]['$'].title;
					 		var url =  exhibitions[a]['$'].uri;
					 		var exhibition = { title:title, url: url };
					 		self.exhibitions.push(exhibition);
					 	}
					 	$('.related-shows').fadeIn( "fast" );
					};
						
				}, function errorCallback(response) {
					console.log("oops, there was an error :)");
				});
			}
			// refresh the page with some Jquery 
			var refresh = function(){
				$('.footer').fadeIn( "fast" );
				$('.about').fadeIn( "fast" );
				$('.related-artists').fadeOut( "fast" );
				$('.error-message').fadeOut( "fast" );
				$('.related-shows').fadeOut( "fast" );
			}
			this.restart = function(){
				refresh();
				self.objects = [];
				self.artists =[];
				self.exhibitions =[];
				self.images =[];
			}
		}]  // end of controller
	} //end of return object
}); // end of directive
