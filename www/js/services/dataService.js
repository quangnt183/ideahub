ideahub.
factory('userData', function () { //To use this data in multi template we need to put it in a service
	if (!localStorage.email) localStorage.email = "Guest";
    return {email: localStorage.email}
}).
factory('appData', function() {
	if (!localStorage.appData) localStorage.appData = '{"projects":[{"name": "Juninor Paramedic", "docs": [{"name": "Asset Request", "pages": [{"image": "img/tmp/01HOME.jpg"}]}]},{"name": "epub reader"}]}';
	return document.tmp2 = JSON.parse(localStorage.appData)
}).
factory('working', function(){
	return {};
});