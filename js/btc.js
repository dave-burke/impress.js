(function ( document, window ) {
	'use strict';
	window.btc = function(impress){

		var stepEnterCallbacks = {}, stepLeaveCallbacks = {};

		document.addEventListener("impress:stepenter", function (event, step) {
			var stepId = event.target.id;
			//console.log('entered ', stepId);

			if(stepEnterCallbacks[stepId]){
				stepEnterCallbacks[stepId].forEach(function(callback){
					callback();
				});
			}
				
		});

		document.addEventListener("impress:stepleave", function (event, step) {
			var stepId = event.target.id;
			//console.log('left', stepId);
			if(stepLeaveCallbacks[stepId]){
				stepLeaveCallbacks[stepId].forEach(function(callback){
					callback();
				});
			}
		});

		function arrayify ( a ) {
			 return [].slice.call( a );
		}

		// `byId` returns element with given `id` - you probably have guessed that ;)
		function byId ( id ) {
			return document.getElementById(id);
		}
		
		// `$` returns first element for given CSS `selector` in the `context` of
		// the given element or whole document.
		function $( selector, context ) {
			context = context || document;
			return context.querySelector(selector);
		}
		
		// `$$` return an array of elements for given CSS `selector` in the `context` of
		// the given element or whole document.
		function $$( selector, context ) {
			context = context || document;
			return arrayify( context.querySelectorAll(selector) );
		}

		function highlight(el, color){ 
			switch(color){
				case 'r':
					el.classList.remove('hl-blue');
					if(!el.classList.contains('hl-red')){
						el.classList.add('hl-red');
					}
					break;
				case 'b':
					el.classList.remove('hl-red');
					if(!el.classList.contains('hl-blue')){
						el.classList.add('hl-blue');
					}
					break;
				default:
					el.classList.remove('hl-blue');
					el.classList.remove('hl-red');
					break;
			}
		}

		/* TEST FUNCTIONS */

		function hasClass(el, className){
			el = byId(el);
			return function(event){
				//console.log('Testing if ' + el.id + ' has class ' + className + '(' + el.classList + ')');
				var result = el.classList.contains(className);
				return result;
			};
		}

		function before(stepId){
			return function(event){
				var steps = $$('.step').map(function(stepDiv){
					return stepDiv.id;
				});
				var currentIndex = steps.indexOf(event.target.id);
				var testIndex = steps.indexOf(stepId);
				return currentIndex < testIndex;
			};
		}

		function after(stepId){
			return function(event){
				var steps = $$('.step').map(function(stepDiv){
					return stepDiv.id;
				});
				var currentIndex = steps.indexOf(event.target.id);
				var testIndex = steps.indexOf(stepId);
				return currentIndex > testIndex;
			};
		}

		function during(stepId){
			return function(event){
				return event.type === "impress:stepenter" && event.target.id === stepId;
			};
		}

		function allOf(){
			var argArr = Array.from(arguments);
			return function(event){
				return argArr.every(function(testFunc){
					return testFunc(event);
				});
			};
		}

		function anyOf(){
			var argArr = Array.from(arguments);
			return function(event){
				return argArr.some(function(testFunc){
					return testFunc(event);
				});
			};
		}

		function not(func){
			return function(){
				return !func();
			};
		}

		/* ACTION FUNCTIONS */
		function addClass(el, className){
			el = byId(el);
			return function(){
				if(!el.classList.contains(className)){
					el.classList.add(className);
				}
			};
		}

		function removeClass(el, className){
			el = byId(el);
			return function(){
				if(el.classList.contains(className)){
					el.classList.remove(className);
				}
			};
		}

		function nextStep(){
			return function(){
				impress.next();
			};
		}

		function animateNodes(config, autoAdvance){
			return function(){
				var i, j;

				for(i = 0; i < config.length; i++){
					for(j = 0; j < config[i].length; j++){
						var node = byId('node-' + i + j);
						var color = config[i][j];
						highlight(node, color);
					}
				}

				if(autoAdvance){
					impress.next();
				}
			};
		}

		function doAll(){
			var argArr = Array.from(arguments);
			return function(){
				return argArr.forEach(function(actionFunc){
					actionFunc();
				});
			};
		}

		/* CONFIGURATION FUNCTIONS */
		function when(testFunc, actionFunc, elseFunc){
			document.addEventListener('impress:stepenter', function(event){
				if(testFunc(event)){
					actionFunc(event);
				} else if(elseFunc) {
					elseFunc(event);
				}
			});
			document.addEventListener('impress:stepleave', function(event){
				if(testFunc(event)){
					actionFunc(event);
				} else if(elseFunc) {
					elseFunc(event);
				}
			});
		}

		when(during('wheel-overview'), nextStep());
		when(before('big-block-1'), addClass('big-block-1', 'hidden'), removeClass('big-block-1', 'hidden'));
		when(before('big-block-2'), addClass('big-block-2', 'hidden'), removeClass('big-block-2', 'hidden'));
		when(before('big-block-3'), addClass('big-block-3', 'hidden'), removeClass('big-block-3', 'hidden'));
		when(before('big-block-4'), addClass('big-block-4', 'hidden'), removeClass('big-block-4', 'hidden'));
		when(before('network-announce-1'), animateNodes([
				[' ',' ',' ',' ',' '],
				[' ',' ',' ',' ',' '],
				[' ',' ',' ',' ',' ']
			], false));
		when(during('network-announce-1'), animateNodes([
				[' ',' ',' ',' ',' '],
				[' ','r',' ',' ',' '],
				[' ',' ',' ',' ',' ']
			], true));
		when(during('network-announce-2'), animateNodes([
				['r','r','r',' ',' '],
				['r','r','r',' ',' '],
				['r','r','r',' ',' ']
			], true));
		when(during('network-announce-3'), animateNodes([
				['r','r','r','r',' '],
				['r','r','r','r',' '],
				['r','r','r','r',' ']
			], true));
		when(during('network-announce-4'), animateNodes([
				['r','r','r','r','r'],
				['r','r','r','r','r'],
				['r','r','r','r','r']
			], false));
		when(during('network-solve-1'), animateNodes([
				['r','r','r','b','r'],
				['r','r','r','r','r'],
				['r','r','r','r','r']
			], true));
		when(during('network-solve-2'), animateNodes([
				['r','r','b','b','b'],
				['r','r','b','b','b'],
				['r','r','r','r','r']
			], true));
		when(during('network-solve-3'), animateNodes([
				['r','b','b','b','b'],
				['r','b','b','b','b'],
				['r','b','b','b','b']
			], true));
		when(during('network-solve-4'), animateNodes([
				['b','b','b','b','b'],
				['b','b','b','b','b'],
				['b','b','b','b','b']
			], false));
		when(after('network-solve-4'), animateNodes([
				[' ',' ',' ',' ',' '],
				[' ',' ',' ',' ',' '],
				[' ',' ',' ',' ',' ']
			], false));
		when(after('network-solve-4'), addClass('verbose-blockchain', 'hidden'), removeClass('verbose-blockchain', 'hidden'));
		when(anyOf(
				before('network-overview'),
				during('hash-demo')),
			addClass('network-overview', 'hidden'), removeClass('network-overview', 'hidden'));
		when(during('hash-demo'), removeClass('hash-demo', 'hidden'), addClass('hash-demo', 'hidden'));
		when(before('block-view-prefork'), addClass('block-view-prefork', 'hidden'), removeClass('block-view-prefork', 'hidden'));
		when(after('block-view-prefork'), removeClass('fork','hidden'), addClass('fork', 'hidden'));

		/* Handle hash input */
		var hashInput = document.getElementById('hashInput');
		hashInput.addEventListener('keyup', function(e){
			//Don't change slides when typing in the input
			e.stopPropagation();
		});

		var hashForm = document.getElementById('hashForm');
		hashForm.addEventListener('submit', function(e){
			e.preventDefault();
			var input = document.getElementById('hashInput').value;
			var output = cryptofoo.md5(input);

			var list = document.getElementById('hashOutput');
			var listItem = document.createElement('li');
			var listItemText = document.createTextNode(output + '(' + input + ')');

			listItem.appendChild(listItemText);
			list.appendChild(listItem);
		});


		return {
			onStepEnter: function(stepId, callback){
				if(!stepEnterCallbacks.hasOwnProperty(stepId)){
					stepEnterCallbacks[stepId] = [];
				}
				stepEnterCallbacks[stepId].push(callback);
			},
			onStepLeave: function(stepId, callback){
				if(!stepLeaveCallbacks.hasOwnProperty(stepId)){
					stepLeaveCallbacks[stepId] = [];
				}
				stepLeaveCallbacks[stepId].push(callback);
			}
		};
	};
})(document, window);
