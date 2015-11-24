window.BTC = (function ( document, window ) {
	'use strict';

	var stepEnterCallbacks = {}, stepLeaveCallbacks = {};

	document.addEventListener("impress:stepenter", function (event, step) {
		var stepId = event.target.id;
		console.log('entered ', stepId);

		if(stepEnterCallbacks[stepId]){
			stepEnterCallbacks[stepId].forEach(function(callback){
				callback();
			});
		}
			
	});

	document.addEventListener("impress:stepleave", function (event, step) {
		console.log('left', event.target.id);
	});

	return {
		onStepEnter: function(stepId, callback){
			if(!stepEnterCallbacks.hasOwnProperty(stepId)){
				stepEnterCallbacks[stepId] = [];
			}
			stepEnterCallbacks[stepId].push(callback);
		},
		onStepLeave: function(stepId, callback){
		},
		
	};
})(document, window);
	
