/*
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
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
					el.classList.remove('hl-green');
					if(!el.classList.contains('hl-red')){
						el.classList.add('hl-red');
					}
					break;
				case 'b':
					el.classList.remove('hl-red');
					el.classList.remove('hl-green');
					if(!el.classList.contains('hl-blue')){
						el.classList.add('hl-blue');
					}
					break;
				case 'g':
					el.classList.remove('hl-red');
					el.classList.remove('hl-blue');
					if(!el.classList.contains('hl-green')){
						el.classList.add('hl-green');
					}
					break;
				default:
					el.classList.remove('hl-blue');
					el.classList.remove('hl-red');
					el.classList.remove('hl-green');
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
			return function(event){
				return !func(event);
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

		function setText(el, text){
			el = byId(el);
			return function(){
				el.innerHTML = text;
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
		}

		when(during('wheel-overview'), nextStep());
		when(before('alice-sig-view'), addClass('alice-sig', 'hidden'), removeClass('alice-sig', 'hidden'));
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
			], false));
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
			], false));
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
				allOf(after('network-solve-4'), not(after('mine-demo')))),
			addClass('network-overview', 'hidden'), removeClass('network-overview', 'hidden'));
		when(during('hash-demo'), removeClass('hash-demo', 'hidden'), addClass('hash-demo', 'hidden'));
		when(during('hash-demo'), addClass('hash-demo', 'above'), removeClass('hash-demo', 'above'));
		when(during('mine-demo'), removeClass('mine-demo', 'hidden'), addClass('mine-demo', 'hidden'));
		when(during('mine-demo'), addClass('mine-demo', 'above'), removeClass('mine-demo', 'above'));
		when(before('block-view-prefork'), addClass('block-view-prefork', 'hidden'), removeClass('block-view-prefork', 'hidden'));
		when(after('block-view-fork'), removeClass('fork','hidden'), addClass('fork', 'hidden'));
		when(after('block-view-postfork'), removeClass('fork-branch', 'hidden'), addClass('fork-branch', 'hidden'));
		when(allOf(
				after('block-view-fork'), 
				before('block-view-postfork3')),
			doAll(
				addClass('block5a', 'hl-red'),
				addClass('block5b', 'hl-blue')),
			doAll(
				removeClass('block5a', 'hl-red'),
				removeClass('block5b', 'hl-blue'))); 
		when(after('block-view-prefork'), animateNodes([
				['b',' ',' ',' ',' '],
				[' ',' ',' ',' ',' '],
				[' ',' ',' ','r',' ']
			], false));
		when(after('block-view-fork'), animateNodes([
				['b','b','b','r','r'],
				['b','b','r','r','r'],
				['b','b','r','r','r']
			], false));
		when(after('block-view-postfork'), animateNodes([
				['b','b','b','r','r'],
				['b','b','g','r','r'],
				['b','b','r','r','r']
			], false));
		when(after('block-view-postfork2'), animateNodes([
				['g','g','g','g','g'],
				['g','g','g','g','g'],
				['g','g','g','g','g']
			], false));
		when(after('block-view-postfork2'), addClass('block5b-container', 'hidden'), removeClass('block5b-container', 'hidden'));
		when(after('block-view-postfork3'), addClass('fork', 'aligned-fork'), removeClass('fork', 'aligned-fork'));
		when(after('block-view-postfork3'), addClass('fork-branch', 'aligned-fork'), removeClass('fork-branch', 'aligned-fork'));
		when(after('block-view-postfork3'), setText('block5a', '5'), setText('block5a', '5A'));
		when(after('block-view-postfork3'), setText('block6a', '6'), setText('block6a', '6A'));
		when(before('block-view-postfork4'), addClass('arrow45', 'hidden'), removeClass('arrow45', 'hidden'));
		when(after('block-view-postfork3'), animateNodes([
				[' ',' ',' ',' ',' '],
				[' ',' ',' ',' ',' '],
				[' ',' ',' ',' ',' ']
			], false));

		/* Handle hash input */
		var hashInput = byId('hashInput');
		hashInput.addEventListener('keyup', function(e){
			//Don't change slides when typing in the input
			e.stopPropagation();
		});

		var hashForm = byId('hashForm');
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

		function testSolution(input, solution, difficulty){
			difficulty = difficulty || 2;
			byId('mineSolution').innerHTML = solution;
			var result = cryptofoo.md5(input + solution);
			byId('mineResult').innerHTML = result;
			if(!result.startsWith('0'.repeat(difficulty))){
				window.setTimeout(function(){
					solution++;
					testSolution(input, solution, difficulty);
				}, 1);
			}
		}

		var mineForm = byId('mineForm');
		mineForm.addEventListener('submit', function(e){
			e.preventDefault();
			var input = byId('prev-block').innerHTML;
			input += $$('#transaction-list li').map(function(it){ 
				return it.innerHTML;
			});
			var difficulty = byId('mineDifficulty').value;

			testSolution(input, 0, difficulty);
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
