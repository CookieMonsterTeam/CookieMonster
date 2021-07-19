/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 877:
/***/ (function(module) {

/**
 * jscolor - JavaScript Color Picker
 *
 * @link    http://jscolor.com
 * @license For open source use: GPLv3
 *          For commercial use: JSColor Commercial License
 * @author  Jan Odvarko - East Desire
 *
 * See usage examples at http://jscolor.com/examples/
 */


(function (global, factory) {

	'use strict';

	if ( true && typeof module.exports === 'object') {
		// Export jscolor as a module
		module.exports = global.document ?
			factory (global) :
			function (win) {
				if (!win.document) {
					throw new Error('jscolor needs a window with document');
				}
				return factory(win);
			}
		return;
	}

	// Default use (no module export)
	factory(global);

})(typeof window !== 'undefined' ? window : this, function (window) { // BEGIN factory

// BEGIN jscolor code


'use strict';


var jscolor = (function () { // BEGIN jscolor

var jsc = {


	initialized : false,

	instances : [], // created instances of jscolor

	readyQueue : [], // functions waiting to be called after init


	register : function () {
		if (typeof window !== 'undefined' && window.document) {
			window.document.addEventListener('DOMContentLoaded', jsc.pub.init, false);
		}
	},


	installBySelector : function (selector, rootNode) {
		rootNode = rootNode ? jsc.node(rootNode) : window.document;
		if (!rootNode) {
			throw new Error('Missing root node');
		}

		var elms = rootNode.querySelectorAll(selector);

		// for backward compatibility with DEPRECATED installation/configuration using className
		var matchClass = new RegExp('(^|\\s)(' + jsc.pub.lookupClass + ')(\\s*(\\{[^}]*\\})|\\s|$)', 'i');

		for (var i = 0; i < elms.length; i += 1) {

			if (elms[i].jscolor && elms[i].jscolor instanceof jsc.pub) {
				continue; // jscolor already installed on this element
			}

			if (elms[i].type !== undefined && elms[i].type.toLowerCase() == 'color' && jsc.isColorAttrSupported) {
				continue; // skips inputs of type 'color' if supported by the browser
			}

			var dataOpts, m;

			if (
				(dataOpts = jsc.getDataAttr(elms[i], 'jscolor')) !== null ||
				(elms[i].className && (m = elms[i].className.match(matchClass))) // installation using className (DEPRECATED)
			) {
				var targetElm = elms[i];

				var optsStr = '';
				if (dataOpts !== null) {
					optsStr = dataOpts;

				} else if (m) { // installation using className (DEPRECATED)
					console.warn('Installation using class name is DEPRECATED. Use data-jscolor="" attribute instead.' + jsc.docsRef);
					if (m[4]) {
						optsStr = m[4];
					}
				}

				var opts = null;
				if (optsStr.trim()) {
					try {
						opts = jsc.parseOptionsStr(optsStr);
					} catch (e) {
						console.warn(e + '\n' + optsStr);
					}
				}

				try {
					new jsc.pub(targetElm, opts);
				} catch (e) {
					console.warn(e);
				}
			}
		}
	},


	parseOptionsStr : function (str) {
		var opts = null;

		try {
			opts = JSON.parse(str);

		} catch (eParse) {
			if (!jsc.pub.looseJSON) {
				throw new Error('Could not parse jscolor options as JSON: ' + eParse);
			} else {
				// loose JSON syntax is enabled -> try to evaluate the options string as JavaScript object
				try {
					opts = (new Function ('var opts = (' + str + '); return typeof opts === "object" ? opts : {};'))();
				} catch (eEval) {
					throw new Error('Could not evaluate jscolor options: ' + eEval);
				}
			}
		}
		return opts;
	},


	getInstances : function () {
		var inst = [];
		for (var i = 0; i < jsc.instances.length; i += 1) {
			// if the targetElement still exists, the instance is considered "alive"
			if (jsc.instances[i] && jsc.instances[i].targetElement) {
				inst.push(jsc.instances[i]);
			}
		}
		return inst;
	},


	createEl : function (tagName) {
		var el = window.document.createElement(tagName);
		jsc.setData(el, 'gui', true);
		return el;
	},


	node : function (nodeOrSelector) {
		if (!nodeOrSelector) {
			return null;
		}

		if (typeof nodeOrSelector === 'string') {
			// query selector
			var sel = nodeOrSelector;
			var el = null;
			try {
				el = window.document.querySelector(sel);
			} catch (e) {
				console.warn(e);
				return null;
			}
			if (!el) {
				console.warn('No element matches the selector: %s', sel);
			}
			return el;
		}

		if (jsc.isNode(nodeOrSelector)) {
			// DOM node
			return nodeOrSelector;
		}

		console.warn('Invalid node of type %s: %s', typeof nodeOrSelector, nodeOrSelector);
		return null;
	},


	// See https://stackoverflow.com/questions/384286/
	isNode : function (val) {
		if (typeof Node === 'object') {
			return val instanceof Node;
		}
		return val && typeof val === 'object' && typeof val.nodeType === 'number' && typeof val.nodeName === 'string';
	},


	nodeName : function (node) {
		if (node && node.nodeName) {
			return node.nodeName.toLowerCase();
		}
		return false;
	},


	removeChildren : function (node) {
		while (node.firstChild) {
			node.removeChild(node.firstChild);
		}
	},


	isTextInput : function (el) {
		return el && jsc.nodeName(el) === 'input' && el.type.toLowerCase() === 'text';
	},


	isButton : function (el) {
		if (!el) {
			return false;
		}
		var n = jsc.nodeName(el);
		return (
			(n === 'button') ||
			(n === 'input' && ['button', 'submit', 'reset'].indexOf(el.type.toLowerCase()) > -1)
		);
	},


	isButtonEmpty : function (el) {
		switch (jsc.nodeName(el)) {
			case 'input': return (!el.value || el.value.trim() === '');
			case 'button': return (el.textContent.trim() === '');
		}
		return null; // could not determine element's text
	},


	// See https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
	isPassiveEventSupported : (function () {
		var supported = false;

		try {
			var opts = Object.defineProperty({}, 'passive', {
				get: function () { supported = true; }
			});
			window.addEventListener('testPassive', null, opts);
			window.removeEventListener('testPassive', null, opts);
		} catch (e) {}

		return supported;
	})(),


	isColorAttrSupported : (function () {
		var elm = window.document.createElement('input');
		if (elm.setAttribute) {
			elm.setAttribute('type', 'color');
			if (elm.type.toLowerCase() == 'color') {
				return true;
			}
		}
		return false;
	})(),


	dataProp : '_data_jscolor',


	// usage:
	//   setData(obj, prop, value)
	//   setData(obj, {prop:value, ...})
	//
	setData : function () {
		var obj = arguments[0];

		if (arguments.length === 3) {
			// setting a single property
			var data = obj.hasOwnProperty(jsc.dataProp) ? obj[jsc.dataProp] : (obj[jsc.dataProp] = {});
			var prop = arguments[1];
			var value = arguments[2];

			data[prop] = value;
			return true;

		} else if (arguments.length === 2 && typeof arguments[1] === 'object') {
			// setting multiple properties
			var data = obj.hasOwnProperty(jsc.dataProp) ? obj[jsc.dataProp] : (obj[jsc.dataProp] = {});
			var map = arguments[1];

			for (var prop in map) {
				if (map.hasOwnProperty(prop)) {
					data[prop] = map[prop];
				}
			}
			return true;
		}

		throw new Error('Invalid arguments');
	},


	// usage:
	//   removeData(obj, prop, [prop...])
	//
	removeData : function () {
		var obj = arguments[0];
		if (!obj.hasOwnProperty(jsc.dataProp)) {
			return true; // data object does not exist
		}
		for (var i = 1; i < arguments.length; i += 1) {
			var prop = arguments[i];
			delete obj[jsc.dataProp][prop];
		}
		return true;
	},


	getData : function (obj, prop, setDefault) {
		if (!obj.hasOwnProperty(jsc.dataProp)) {
			// data object does not exist
			if (setDefault !== undefined) {
				obj[jsc.dataProp] = {}; // create data object
			} else {
				return undefined; // no value to return
			}
		}
		var data = obj[jsc.dataProp];

		if (!data.hasOwnProperty(prop) && setDefault !== undefined) {
			data[prop] = setDefault;
		}
		return data[prop];
	},


	getDataAttr : function (el, name) {
		var attrName = 'data-' + name;
		var attrValue = el.getAttribute(attrName);
		return attrValue;
	},


	setDataAttr : function (el, name, value) {
		var attrName = 'data-' + name;
		el.setAttribute(attrName, value);
	},


	_attachedGroupEvents : {},


	attachGroupEvent : function (groupName, el, evnt, func) {
		if (!jsc._attachedGroupEvents.hasOwnProperty(groupName)) {
			jsc._attachedGroupEvents[groupName] = [];
		}
		jsc._attachedGroupEvents[groupName].push([el, evnt, func]);
		el.addEventListener(evnt, func, false);
	},


	detachGroupEvents : function (groupName) {
		if (jsc._attachedGroupEvents.hasOwnProperty(groupName)) {
			for (var i = 0; i < jsc._attachedGroupEvents[groupName].length; i += 1) {
				var evt = jsc._attachedGroupEvents[groupName][i];
				evt[0].removeEventListener(evt[1], evt[2], false);
			}
			delete jsc._attachedGroupEvents[groupName];
		}
	},


	preventDefault : function (e) {
		if (e.preventDefault) { e.preventDefault(); }
		e.returnValue = false;
	},


	captureTarget : function (target) {
		// IE
		if (target.setCapture) {
			jsc._capturedTarget = target;
			jsc._capturedTarget.setCapture();
		}
	},


	releaseTarget : function () {
		// IE
		if (jsc._capturedTarget) {
			jsc._capturedTarget.releaseCapture();
			jsc._capturedTarget = null;
		}
	},


	triggerEvent : function (el, eventName, bubbles, cancelable) {
		if (!el) {
			return;
		}

		var ev = null;

		if (typeof Event === 'function') {
			ev = new Event(eventName, {
				bubbles: bubbles,
				cancelable: cancelable
			});
		} else {
			// IE
			ev = window.document.createEvent('Event');
			ev.initEvent(eventName, bubbles, cancelable);
		}

		if (!ev) {
			return false;
		}

		// so that we know that the event was triggered internally
		jsc.setData(ev, 'internal', true);

		el.dispatchEvent(ev);
		return true;
	},


	triggerInputEvent : function (el, eventName, bubbles, cancelable) {
		if (!el) {
			return;
		}
		if (jsc.isTextInput(el)) {
			jsc.triggerEvent(el, eventName, bubbles, cancelable);
		}
	},


	eventKey : function (ev) {
		var keys = {
			9: 'Tab',
			13: 'Enter',
			27: 'Escape',
		};
		if (typeof ev.code === 'string') {
			return ev.code;
		} else if (ev.keyCode !== undefined && keys.hasOwnProperty(ev.keyCode)) {
			return keys[ev.keyCode];
		}
		return null;
	},


	strList : function (str) {
		if (!str) {
			return [];
		}
		return str.replace(/^\s+|\s+$/g, '').split(/\s+/);
	},


	// The className parameter (str) can only contain a single class name
	hasClass : function (elm, className) {
		if (!className) {
			return false;
		}
		if (elm.classList !== undefined) {
			return elm.classList.contains(className);
		}
		// polyfill
		return -1 != (' ' + elm.className.replace(/\s+/g, ' ') + ' ').indexOf(' ' + className + ' ');
	},


	// The className parameter (str) can contain multiple class names separated by whitespace
	addClass : function (elm, className) {
		var classNames = jsc.strList(className);

		if (elm.classList !== undefined) {
			for (var i = 0; i < classNames.length; i += 1) {
				elm.classList.add(classNames[i]);
			}
			return;
		}
		// polyfill
		for (var i = 0; i < classNames.length; i += 1) {
			if (!jsc.hasClass(elm, classNames[i])) {
				elm.className += (elm.className ? ' ' : '') + classNames[i];
			}
		}
	},


	// The className parameter (str) can contain multiple class names separated by whitespace
	removeClass : function (elm, className) {
		var classNames = jsc.strList(className);

		if (elm.classList !== undefined) {
			for (var i = 0; i < classNames.length; i += 1) {
				elm.classList.remove(classNames[i]);
			}
			return;
		}
		// polyfill
		for (var i = 0; i < classNames.length; i += 1) {
			var repl = new RegExp(
				'^\\s*' + classNames[i] + '\\s*|' +
				'\\s*' + classNames[i] + '\\s*$|' +
				'\\s+' + classNames[i] + '(\\s+)',
				'g'
			);
			elm.className = elm.className.replace(repl, '$1');
		}
	},


	getCompStyle : function (elm) {
		var compStyle = window.getComputedStyle ? window.getComputedStyle(elm) : elm.currentStyle;

		// Note: In Firefox, getComputedStyle returns null in a hidden iframe,
		// that's why we need to check if the returned value is non-empty
		if (!compStyle) {
			return {};
		}
		return compStyle;
	},


	// Note:
	//   Setting a property to NULL reverts it to the state before it was first set
	//   with the 'reversible' flag enabled
	//
	setStyle : function (elm, styles, important, reversible) {
		// using '' for standard priority (IE10 apparently doesn't like value undefined)
		var priority = important ? 'important' : '';
		var origStyle = null;

		for (var prop in styles) {
			if (styles.hasOwnProperty(prop)) {
				var setVal = null;

				if (styles[prop] === null) {
					// reverting a property value

					if (!origStyle) {
						// get the original style object, but dont't try to create it if it doesn't exist
						origStyle = jsc.getData(elm, 'origStyle');
					}
					if (origStyle && origStyle.hasOwnProperty(prop)) {
						// we have property's original value -> use it
						setVal = origStyle[prop];
					}

				} else {
					// setting a property value

					if (reversible) {
						if (!origStyle) {
							// get the original style object and if it doesn't exist, create it
							origStyle = jsc.getData(elm, 'origStyle', {});
						}
						if (!origStyle.hasOwnProperty(prop)) {
							// original property value not yet stored -> store it
							origStyle[prop] = elm.style[prop];
						}
					}
					setVal = styles[prop];
				}

				if (setVal !== null) {
					elm.style.setProperty(prop, setVal, priority);
				}
			}
		}
	},


	hexColor : function (r, g, b) {
		return '#' + (
			('0' + Math.round(r).toString(16)).substr(-2) +
			('0' + Math.round(g).toString(16)).substr(-2) +
			('0' + Math.round(b).toString(16)).substr(-2)
		).toUpperCase();
	},


	hexaColor : function (r, g, b, a) {
		return '#' + (
			('0' + Math.round(r).toString(16)).substr(-2) +
			('0' + Math.round(g).toString(16)).substr(-2) +
			('0' + Math.round(b).toString(16)).substr(-2) +
			('0' + Math.round(a * 255).toString(16)).substr(-2)
		).toUpperCase();
	},


	rgbColor : function (r, g, b) {
		return 'rgb(' +
			Math.round(r) + ',' +
			Math.round(g) + ',' +
			Math.round(b) +
		')';
	},


	rgbaColor : function (r, g, b, a) {
		return 'rgba(' +
			Math.round(r) + ',' +
			Math.round(g) + ',' +
			Math.round(b) + ',' +
			(Math.round((a===undefined || a===null ? 1 : a) * 100) / 100) +
		')';
	},


	linearGradient : (function () {

		function getFuncName () {
			var stdName = 'linear-gradient';
			var prefixes = ['', '-webkit-', '-moz-', '-o-', '-ms-'];
			var helper = window.document.createElement('div');

			for (var i = 0; i < prefixes.length; i += 1) {
				var tryFunc = prefixes[i] + stdName;
				var tryVal = tryFunc + '(to right, rgba(0,0,0,0), rgba(0,0,0,0))';

				helper.style.background = tryVal;
				if (helper.style.background) { // CSS background successfully set -> function name is supported
					return tryFunc;
				}
			}
			return stdName; // fallback to standard 'linear-gradient' without vendor prefix
		}

		var funcName = getFuncName();

		return function () {
			return funcName + '(' + Array.prototype.join.call(arguments, ', ') + ')';
		};

	})(),


	setBorderRadius : function (elm, value) {
		jsc.setStyle(elm, {'border-radius' : value || '0'});
	},


	setBoxShadow : function (elm, value) {
		jsc.setStyle(elm, {'box-shadow': value || 'none'});
	},


	getElementPos : function (e, relativeToViewport) {
		var x=0, y=0;
		var rect = e.getBoundingClientRect();
		x = rect.left;
		y = rect.top;
		if (!relativeToViewport) {
			var viewPos = jsc.getViewPos();
			x += viewPos[0];
			y += viewPos[1];
		}
		return [x, y];
	},


	getElementSize : function (e) {
		return [e.offsetWidth, e.offsetHeight];
	},


	// get pointer's X/Y coordinates relative to viewport
	getAbsPointerPos : function (e) {
		var x = 0, y = 0;
		if (typeof e.changedTouches !== 'undefined' && e.changedTouches.length) {
			// touch devices
			x = e.changedTouches[0].clientX;
			y = e.changedTouches[0].clientY;
		} else if (typeof e.clientX === 'number') {
			x = e.clientX;
			y = e.clientY;
		}
		return { x: x, y: y };
	},


	// get pointer's X/Y coordinates relative to target element
	getRelPointerPos : function (e) {
		var target = e.target || e.srcElement;
		var targetRect = target.getBoundingClientRect();

		var x = 0, y = 0;

		var clientX = 0, clientY = 0;
		if (typeof e.changedTouches !== 'undefined' && e.changedTouches.length) {
			// touch devices
			clientX = e.changedTouches[0].clientX;
			clientY = e.changedTouches[0].clientY;
		} else if (typeof e.clientX === 'number') {
			clientX = e.clientX;
			clientY = e.clientY;
		}

		x = clientX - targetRect.left;
		y = clientY - targetRect.top;
		return { x: x, y: y };
	},


	getViewPos : function () {
		var doc = window.document.documentElement;
		return [
			(window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0),
			(window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)
		];
	},


	getViewSize : function () {
		var doc = window.document.documentElement;
		return [
			(window.innerWidth || doc.clientWidth),
			(window.innerHeight || doc.clientHeight),
		];
	},


	// r: 0-255
	// g: 0-255
	// b: 0-255
	//
	// returns: [ 0-360, 0-100, 0-100 ]
	//
	RGB_HSV : function (r, g, b) {
		r /= 255;
		g /= 255;
		b /= 255;
		var n = Math.min(Math.min(r,g),b);
		var v = Math.max(Math.max(r,g),b);
		var m = v - n;
		if (m === 0) { return [ null, 0, 100 * v ]; }
		var h = r===n ? 3+(b-g)/m : (g===n ? 5+(r-b)/m : 1+(g-r)/m);
		return [
			60 * (h===6?0:h),
			100 * (m/v),
			100 * v
		];
	},


	// h: 0-360
	// s: 0-100
	// v: 0-100
	//
	// returns: [ 0-255, 0-255, 0-255 ]
	//
	HSV_RGB : function (h, s, v) {
		var u = 255 * (v / 100);

		if (h === null) {
			return [ u, u, u ];
		}

		h /= 60;
		s /= 100;

		var i = Math.floor(h);
		var f = i%2 ? h-i : 1-(h-i);
		var m = u * (1 - s);
		var n = u * (1 - s * f);
		switch (i) {
			case 6:
			case 0: return [u,n,m];
			case 1: return [n,u,m];
			case 2: return [m,u,n];
			case 3: return [m,n,u];
			case 4: return [n,m,u];
			case 5: return [u,m,n];
		}
	},


	parseColorString : function (str) {
		var ret = {
			rgba: null,
			format: null // 'hex' | 'hexa' | 'rgb' | 'rgba'
		};

		var m;

		if (m = str.match(/^\W*([0-9A-F]{3,8})\W*$/i)) {
			// HEX notation

			if (m[1].length === 8) {
				// 8-char notation (= with alpha)
				ret.format = 'hexa';
				ret.rgba = [
					parseInt(m[1].substr(0,2),16),
					parseInt(m[1].substr(2,2),16),
					parseInt(m[1].substr(4,2),16),
					parseInt(m[1].substr(6,2),16) / 255
				];

			} else if (m[1].length === 6) {
				// 6-char notation
				ret.format = 'hex';
				ret.rgba = [
					parseInt(m[1].substr(0,2),16),
					parseInt(m[1].substr(2,2),16),
					parseInt(m[1].substr(4,2),16),
					null
				];

			} else if (m[1].length === 3) {
				// 3-char notation
				ret.format = 'hex';
				ret.rgba = [
					parseInt(m[1].charAt(0) + m[1].charAt(0),16),
					parseInt(m[1].charAt(1) + m[1].charAt(1),16),
					parseInt(m[1].charAt(2) + m[1].charAt(2),16),
					null
				];

			} else {
				return false;
			}

			return ret;
		}

		if (m = str.match(/^\W*rgba?\(([^)]*)\)\W*$/i)) {
			// rgb(...) or rgba(...) notation

			var par = m[1].split(',');
			var re = /^\s*(\d+|\d*\.\d+|\d+\.\d*)\s*$/;
			var mR, mG, mB, mA;
			if (
				par.length >= 3 &&
				(mR = par[0].match(re)) &&
				(mG = par[1].match(re)) &&
				(mB = par[2].match(re))
			) {
				ret.format = 'rgb';
				ret.rgba = [
					parseFloat(mR[1]) || 0,
					parseFloat(mG[1]) || 0,
					parseFloat(mB[1]) || 0,
					null
				];

				if (
					par.length >= 4 &&
					(mA = par[3].match(re))
				) {
					ret.format = 'rgba';
					ret.rgba[3] = parseFloat(mA[1]) || 0;
				}
				return ret;
			}
		}

		return false;
	},


	parsePaletteValue : function (mixed) {
		var vals = [];

		if (typeof mixed === 'string') { // input is a string of space separated color values
			// rgb() and rgba() may contain spaces too, so let's find all color values by regex
			mixed.replace(/#[0-9A-F]{3}([0-9A-F]{3})?|rgba?\(([^)]*)\)/ig, function (val) {
				vals.push(val);
			});
		} else if (Array.isArray(mixed)) { // input is an array of color values
			vals = mixed;
		}

		// convert all values into uniform color format

		var colors = [];

		for (var i = 0; i < vals.length; i++) {
			var color = jsc.parseColorString(vals[i]);
			if (color) {
				colors.push(color);
			}
		}

		return colors;
	},


	containsTranparentColor : function (colors) {
		for (var i = 0; i < colors.length; i++) {
			var a = colors[i].rgba[3];
			if (a !== null && a < 1.0) {
				return true;
			}
		}
		return false;
	},


	isAlphaFormat : function (format) {
		switch (format.toLowerCase()) {
		case 'hexa':
		case 'rgba':
			return true;
		}
		return false;
	},


	// Canvas scaling for retina displays
	//
	// adapted from https://www.html5rocks.com/en/tutorials/canvas/hidpi/
	//
	scaleCanvasForHighDPR : function (canvas) {
		var dpr = window.devicePixelRatio || 1;
		canvas.width *= dpr;
		canvas.height *= dpr;
		var ctx = canvas.getContext('2d');
		ctx.scale(dpr, dpr);
	},


	genColorPreviewCanvas : function (color, separatorPos, specWidth, scaleForHighDPR) {

		var sepW = Math.round(jsc.pub.previewSeparator.length);
		var sqSize = jsc.pub.chessboardSize;
		var sqColor1 = jsc.pub.chessboardColor1;
		var sqColor2 = jsc.pub.chessboardColor2;

		var cWidth = specWidth ? specWidth : sqSize * 2;
		var cHeight = sqSize * 2;

		var canvas = jsc.createEl('canvas');
		var ctx = canvas.getContext('2d');

		canvas.width = cWidth;
		canvas.height = cHeight;
		if (scaleForHighDPR) {
			jsc.scaleCanvasForHighDPR(canvas);
		}

		// transparency chessboard - background
		ctx.fillStyle = sqColor1;
		ctx.fillRect(0, 0, cWidth, cHeight);

		// transparency chessboard - squares
		ctx.fillStyle = sqColor2;
		for (var x = 0; x < cWidth; x += sqSize * 2) {
			ctx.fillRect(x, 0, sqSize, sqSize);
			ctx.fillRect(x + sqSize, sqSize, sqSize, sqSize);
		}

		if (color) {
			// actual color in foreground
			ctx.fillStyle = color;
			ctx.fillRect(0, 0, cWidth, cHeight);
		}

		var start = null;
		switch (separatorPos) {
			case 'left':
				start = 0;
				ctx.clearRect(0, 0, sepW/2, cHeight);
				break;
			case 'right':
				start = cWidth - sepW;
				ctx.clearRect(cWidth - (sepW/2), 0, sepW/2, cHeight);
				break;
		}
		if (start !== null) {
			ctx.lineWidth = 1;
			for (var i = 0; i < jsc.pub.previewSeparator.length; i += 1) {
				ctx.beginPath();
				ctx.strokeStyle = jsc.pub.previewSeparator[i];
				ctx.moveTo(0.5 + start + i, 0);
				ctx.lineTo(0.5 + start + i, cHeight);
				ctx.stroke();
			}
		}

		return {
			canvas: canvas,
			width: cWidth,
			height: cHeight,
		};
	},


	// if position or width is not set => fill the entire element (0%-100%)
	genColorPreviewGradient : function (color, position, width) {
		var params = [];

		if (position && width) {
			params = [
				'to ' + {'left':'right', 'right':'left'}[position],
				color + ' 0%',
				color + ' ' + width + 'px',
				'rgba(0,0,0,0) ' + (width + 1) + 'px',
				'rgba(0,0,0,0) 100%',
			];
		} else {
			params = [
				'to right',
				color + ' 0%',
				color + ' 100%',
			];
		}

		return jsc.linearGradient.apply(this, params);
	},


	redrawPosition : function () {

		if (!jsc.picker || !jsc.picker.owner) {
			return; // picker is not shown
		}

		var thisObj = jsc.picker.owner;

		var tp, vp;

		if (thisObj.fixed) {
			// Fixed elements are positioned relative to viewport,
			// therefore we can ignore the scroll offset
			tp = jsc.getElementPos(thisObj.targetElement, true); // target pos
			vp = [0, 0]; // view pos
		} else {
			tp = jsc.getElementPos(thisObj.targetElement); // target pos
			vp = jsc.getViewPos(); // view pos
		}

		var ts = jsc.getElementSize(thisObj.targetElement); // target size
		var vs = jsc.getViewSize(); // view size
		var pd = jsc.getPickerDims(thisObj);
		var ps = [pd.borderW, pd.borderH]; // picker outer size
		var a, b, c;
		switch (thisObj.position.toLowerCase()) {
			case 'left': a=1; b=0; c=-1; break;
			case 'right':a=1; b=0; c=1; break;
			case 'top':  a=0; b=1; c=-1; break;
			default:     a=0; b=1; c=1; break;
		}
		var l = (ts[b]+ps[b])/2;

		// compute picker position
		if (!thisObj.smartPosition) {
			var pp = [
				tp[a],
				tp[b]+ts[b]-l+l*c
			];
		} else {
			var pp = [
				-vp[a]+tp[a]+ps[a] > vs[a] ?
					(-vp[a]+tp[a]+ts[a]/2 > vs[a]/2 && tp[a]+ts[a]-ps[a] >= 0 ? tp[a]+ts[a]-ps[a] : tp[a]) :
					tp[a],
				-vp[b]+tp[b]+ts[b]+ps[b]-l+l*c > vs[b] ?
					(-vp[b]+tp[b]+ts[b]/2 > vs[b]/2 && tp[b]+ts[b]-l-l*c >= 0 ? tp[b]+ts[b]-l-l*c : tp[b]+ts[b]-l+l*c) :
					(tp[b]+ts[b]-l+l*c >= 0 ? tp[b]+ts[b]-l+l*c : tp[b]+ts[b]-l-l*c)
			];
		}

		var x = pp[a];
		var y = pp[b];
		var positionValue = thisObj.fixed ? 'fixed' : 'absolute';
		var contractShadow =
			(pp[0] + ps[0] > tp[0] || pp[0] < tp[0] + ts[0]) &&
			(pp[1] + ps[1] < tp[1] + ts[1]);

		jsc._drawPosition(thisObj, x, y, positionValue, contractShadow);
	},


	_drawPosition : function (thisObj, x, y, positionValue, contractShadow) {
		var vShadow = contractShadow ? 0 : thisObj.shadowBlur; // px

		jsc.picker.wrap.style.position = positionValue;
		jsc.picker.wrap.style.left = x + 'px';
		jsc.picker.wrap.style.top = y + 'px';

		jsc.setBoxShadow(
			jsc.picker.boxS,
			thisObj.shadow ?
				new jsc.BoxShadow(0, vShadow, thisObj.shadowBlur, 0, thisObj.shadowColor) :
				null);
	},


	getPickerDims : function (thisObj) {
		var w = 2 * thisObj.controlBorderWidth + thisObj.width;
		var h = 2 * thisObj.controlBorderWidth + thisObj.height;

		var sliderSpace = 2 * thisObj.controlBorderWidth + 2 * jsc.getControlPadding(thisObj) + thisObj.sliderSize;

		if (jsc.getSliderChannel(thisObj)) {
			w += sliderSpace;
		}
		if (thisObj.hasAlphaChannel()) {
			w += sliderSpace;
		}

		var pal = jsc.getPaletteDims(thisObj, w);

		if (pal.height) {
			h += pal.height + thisObj.padding;
		}
		if (thisObj.closeButton) {
			h += 2 * thisObj.controlBorderWidth + thisObj.padding + thisObj.buttonHeight;
		}

		var pW = w + (2 * thisObj.padding);
		var pH = h + (2 * thisObj.padding);

		return {
			contentW: w,
			contentH: h,
			paddedW: pW,
			paddedH: pH,
			borderW: pW + (2 * thisObj.borderWidth),
			borderH: pH + (2 * thisObj.borderWidth),
			palette: pal,
		};
	},


	getPaletteDims : function (thisObj, width) {
		var cols = 0, rows = 0, cellW = 0, cellH = 0, height = 0;
		var sampleCount = thisObj._palette ? thisObj._palette.length : 0;

		if (sampleCount) {
			cols = thisObj.paletteCols;
			rows = cols > 0 ? Math.ceil(sampleCount / cols) : 0;

			// color sample's dimensions (includes border)
			cellW = Math.max(1, Math.floor((width - ((cols - 1) * thisObj.paletteSpacing)) / cols));
			cellH = thisObj.paletteHeight ? Math.min(thisObj.paletteHeight, cellW) : cellW;
		}

		if (rows) {
			height =
				rows * cellH +
				(rows - 1) * thisObj.paletteSpacing;
		}

		return {
			cols: cols,
			rows: rows,
			cellW: cellW,
			cellH: cellH,
			width: width,
			height: height,
		};
	},


	getControlPadding : function (thisObj) {
		return Math.max(
			thisObj.padding / 2,
			(2 * thisObj.pointerBorderWidth + thisObj.pointerThickness) - thisObj.controlBorderWidth
		);
	},


	getPadYChannel : function (thisObj) {
		switch (thisObj.mode.charAt(1).toLowerCase()) {
			case 'v': return 'v'; break;
		}
		return 's';
	},


	getSliderChannel : function (thisObj) {
		if (thisObj.mode.length > 2) {
			switch (thisObj.mode.charAt(2).toLowerCase()) {
				case 's': return 's'; break;
				case 'v': return 'v'; break;
			}
		}
		return null;
	},


	// calls function specified in picker's property
	triggerCallback : function (thisObj, prop) {
		if (!thisObj[prop]) {
			return; // callback func not specified
		}
		var callback = null;

		if (typeof thisObj[prop] === 'string') {
			// string with code
			try {
				callback = new Function (thisObj[prop]);
			} catch (e) {
				console.error(e);
			}
		} else {
			// function
			callback = thisObj[prop];
		}

		if (callback) {
			callback.call(thisObj);
		}
	},


	// Triggers a color change related event(s) on all picker instances.
	// It is possible to specify multiple events separated with a space.
	triggerGlobal : function (eventNames) {
		var inst = jsc.getInstances();
		for (var i = 0; i < inst.length; i += 1) {
			inst[i].trigger(eventNames);
		}
	},


	_pointerMoveEvent : {
		mouse: 'mousemove',
		touch: 'touchmove'
	},
	_pointerEndEvent : {
		mouse: 'mouseup',
		touch: 'touchend'
	},


	_pointerOrigin : null,
	_capturedTarget : null,


	onDocumentKeyUp : function (e) {
		if (['Tab', 'Escape'].indexOf(jsc.eventKey(e)) !== -1) {
			if (jsc.picker && jsc.picker.owner) {
				jsc.picker.owner.tryHide();
			}
		}
	},


	onWindowResize : function (e) {
		jsc.redrawPosition();
	},


	onWindowScroll : function (e) {
		jsc.redrawPosition();
	},


	onParentScroll : function (e) {
		// hide the picker when one of the parent elements is scrolled
		if (jsc.picker && jsc.picker.owner) {
			jsc.picker.owner.tryHide();
		}
	},


	onDocumentMouseDown : function (e) {
		var target = e.target || e.srcElement;

		if (target.jscolor && target.jscolor instanceof jsc.pub) { // clicked targetElement -> show picker
			if (target.jscolor.showOnClick && !target.disabled) {
				target.jscolor.show();
			}
		} else if (jsc.getData(target, 'gui')) { // clicked jscolor's GUI element
			var control = jsc.getData(target, 'control');
			if (control) {
				// jscolor's control
				jsc.onControlPointerStart(e, target, jsc.getData(target, 'control'), 'mouse');
			}
		} else {
			// mouse is outside the picker's controls -> hide the color picker!
			if (jsc.picker && jsc.picker.owner) {
				jsc.picker.owner.tryHide();
			}
		}
	},


	onPickerTouchStart : function (e) {
		var target = e.target || e.srcElement;

		if (jsc.getData(target, 'control')) {
			jsc.onControlPointerStart(e, target, jsc.getData(target, 'control'), 'touch');
		}
	},


	onControlPointerStart : function (e, target, controlName, pointerType) {
		var thisObj = jsc.getData(target, 'instance');

		jsc.preventDefault(e);
		jsc.captureTarget(target);

		var registerDragEvents = function (doc, offset) {
			jsc.attachGroupEvent('drag', doc, jsc._pointerMoveEvent[pointerType],
				jsc.onDocumentPointerMove(e, target, controlName, pointerType, offset));
			jsc.attachGroupEvent('drag', doc, jsc._pointerEndEvent[pointerType],
				jsc.onDocumentPointerEnd(e, target, controlName, pointerType));
		};

		registerDragEvents(window.document, [0, 0]);

		if (window.parent && window.frameElement) {
			var rect = window.frameElement.getBoundingClientRect();
			var ofs = [-rect.left, -rect.top];
			registerDragEvents(window.parent.window.document, ofs);
		}

		var abs = jsc.getAbsPointerPos(e);
		var rel = jsc.getRelPointerPos(e);
		jsc._pointerOrigin = {
			x: abs.x - rel.x,
			y: abs.y - rel.y
		};

		switch (controlName) {
		case 'pad':
			// if the value slider is at the bottom, move it up
			if (jsc.getSliderChannel(thisObj) === 'v' && thisObj.channels.v === 0) {
				thisObj.fromHSVA(null, null, 100, null);
			}
			jsc.setPad(thisObj, e, 0, 0);
			break;

		case 'sld':
			jsc.setSld(thisObj, e, 0);
			break;

		case 'asld':
			jsc.setASld(thisObj, e, 0);
			break;
		}
		thisObj.trigger('input');
	},


	onDocumentPointerMove : function (e, target, controlName, pointerType, offset) {
		return function (e) {
			var thisObj = jsc.getData(target, 'instance');
			switch (controlName) {
			case 'pad':
				jsc.setPad(thisObj, e, offset[0], offset[1]);
				break;

			case 'sld':
				jsc.setSld(thisObj, e, offset[1]);
				break;

			case 'asld':
				jsc.setASld(thisObj, e, offset[1]);
				break;
			}
			thisObj.trigger('input');
		}
	},


	onDocumentPointerEnd : function (e, target, controlName, pointerType) {
		return function (e) {
			var thisObj = jsc.getData(target, 'instance');
			jsc.detachGroupEvents('drag');
			jsc.releaseTarget();

			// Always trigger changes AFTER detaching outstanding mouse handlers,
			// in case some color change that occured in user-defined onChange/onInput handler
			// intruded into current mouse events
			thisObj.trigger('input');
			thisObj.trigger('change');
		};
	},


	onPaletteSampleClick : function (e) {
		var target = e.currentTarget;
		var thisObj = jsc.getData(target, 'instance');
		var color = jsc.getData(target, 'color');

		// when format is flexible, use the original format of this color sample
		if (thisObj.format.toLowerCase() === 'any') {
			thisObj._setFormat(color.format); // adapt format
			if (!jsc.isAlphaFormat(thisObj.getFormat())) {
				color.rgba[3] = 1.0; // when switching to a format that doesn't support alpha, set full opacity
			}
		}

		// if this color doesn't specify alpha, use alpha of 1.0 (if applicable)
		if (color.rgba[3] === null) {
			if (thisObj.paletteSetsAlpha === true || (thisObj.paletteSetsAlpha === 'auto' && thisObj._paletteHasTransparency)) {
				color.rgba[3] = 1.0;
			}
		}

		thisObj.fromRGBA.apply(thisObj, color.rgba);

		thisObj.trigger('input');
		thisObj.trigger('change');

		if (thisObj.hideOnPaletteClick) {
			thisObj.hide();
		}
	},


	setPad : function (thisObj, e, ofsX, ofsY) {
		var pointerAbs = jsc.getAbsPointerPos(e);
		var x = ofsX + pointerAbs.x - jsc._pointerOrigin.x - thisObj.padding - thisObj.controlBorderWidth;
		var y = ofsY + pointerAbs.y - jsc._pointerOrigin.y - thisObj.padding - thisObj.controlBorderWidth;

		var xVal = x * (360 / (thisObj.width - 1));
		var yVal = 100 - (y * (100 / (thisObj.height - 1)));

		switch (jsc.getPadYChannel(thisObj)) {
		case 's': thisObj.fromHSVA(xVal, yVal, null, null); break;
		case 'v': thisObj.fromHSVA(xVal, null, yVal, null); break;
		}
	},


	setSld : function (thisObj, e, ofsY) {
		var pointerAbs = jsc.getAbsPointerPos(e);
		var y = ofsY + pointerAbs.y - jsc._pointerOrigin.y - thisObj.padding - thisObj.controlBorderWidth;
		var yVal = 100 - (y * (100 / (thisObj.height - 1)));

		switch (jsc.getSliderChannel(thisObj)) {
		case 's': thisObj.fromHSVA(null, yVal, null, null); break;
		case 'v': thisObj.fromHSVA(null, null, yVal, null); break;
		}
	},


	setASld : function (thisObj, e, ofsY) {
		var pointerAbs = jsc.getAbsPointerPos(e);
		var y = ofsY + pointerAbs.y - jsc._pointerOrigin.y - thisObj.padding - thisObj.controlBorderWidth;
		var yVal = 1.0 - (y * (1.0 / (thisObj.height - 1)));

		if (yVal < 1.0) {
			// if format is flexible and the current format doesn't support alpha, switch to a suitable one
			var fmt = thisObj.getFormat();
			if (thisObj.format.toLowerCase() === 'any' && !jsc.isAlphaFormat(fmt)) {
				thisObj._setFormat(fmt === 'hex' ? 'hexa' : 'rgba');
			}
		}

		thisObj.fromHSVA(null, null, null, yVal);
	},


	createPadCanvas : function () {

		var ret = {
			elm: null,
			draw: null
		};

		var canvas = jsc.createEl('canvas');
		var ctx = canvas.getContext('2d');

		var drawFunc = function (width, height, type) {
			canvas.width = width;
			canvas.height = height;

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			var hGrad = ctx.createLinearGradient(0, 0, canvas.width, 0);
			hGrad.addColorStop(0 / 6, '#F00');
			hGrad.addColorStop(1 / 6, '#FF0');
			hGrad.addColorStop(2 / 6, '#0F0');
			hGrad.addColorStop(3 / 6, '#0FF');
			hGrad.addColorStop(4 / 6, '#00F');
			hGrad.addColorStop(5 / 6, '#F0F');
			hGrad.addColorStop(6 / 6, '#F00');

			ctx.fillStyle = hGrad;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			var vGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
			switch (type.toLowerCase()) {
			case 's':
				vGrad.addColorStop(0, 'rgba(255,255,255,0)');
				vGrad.addColorStop(1, 'rgba(255,255,255,1)');
				break;
			case 'v':
				vGrad.addColorStop(0, 'rgba(0,0,0,0)');
				vGrad.addColorStop(1, 'rgba(0,0,0,1)');
				break;
			}
			ctx.fillStyle = vGrad;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		};

		ret.elm = canvas;
		ret.draw = drawFunc;

		return ret;
	},


	createSliderGradient : function () {

		var ret = {
			elm: null,
			draw: null
		};

		var canvas = jsc.createEl('canvas');
		var ctx = canvas.getContext('2d');

		var drawFunc = function (width, height, color1, color2) {
			canvas.width = width;
			canvas.height = height;

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			var grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
			grad.addColorStop(0, color1);
			grad.addColorStop(1, color2);

			ctx.fillStyle = grad;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		};

		ret.elm = canvas;
		ret.draw = drawFunc;

		return ret;
	},


	createASliderGradient : function () {

		var ret = {
			elm: null,
			draw: null
		};

		var canvas = jsc.createEl('canvas');
		var ctx = canvas.getContext('2d');

		var drawFunc = function (width, height, color) {
			canvas.width = width;
			canvas.height = height;

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			var sqSize = canvas.width / 2;
			var sqColor1 = jsc.pub.chessboardColor1;
			var sqColor2 = jsc.pub.chessboardColor2;

			// dark gray background
			ctx.fillStyle = sqColor1;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			if (sqSize > 0) { // to avoid infinite loop
				for (var y = 0; y < canvas.height; y += sqSize * 2) {
					// light gray squares
					ctx.fillStyle = sqColor2;
					ctx.fillRect(0, y, sqSize, sqSize);
					ctx.fillRect(sqSize, y + sqSize, sqSize, sqSize);
				}
			}

			var grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
			grad.addColorStop(0, color);
			grad.addColorStop(1, 'rgba(0,0,0,0)');

			ctx.fillStyle = grad;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		};

		ret.elm = canvas;
		ret.draw = drawFunc;

		return ret;
	},


	BoxShadow : (function () {
		var BoxShadow = function (hShadow, vShadow, blur, spread, color, inset) {
			this.hShadow = hShadow;
			this.vShadow = vShadow;
			this.blur = blur;
			this.spread = spread;
			this.color = color;
			this.inset = !!inset;
		};

		BoxShadow.prototype.toString = function () {
			var vals = [
				Math.round(this.hShadow) + 'px',
				Math.round(this.vShadow) + 'px',
				Math.round(this.blur) + 'px',
				Math.round(this.spread) + 'px',
				this.color
			];
			if (this.inset) {
				vals.push('inset');
			}
			return vals.join(' ');
		};

		return BoxShadow;
	})(),


	flags : {
		leaveValue : 1 << 0,
		leaveAlpha : 1 << 1,
		leavePreview : 1 << 2,
	},


	enumOpts : {
		format: ['auto', 'any', 'hex', 'hexa', 'rgb', 'rgba'],
		previewPosition: ['left', 'right'],
		mode: ['hsv', 'hvs', 'hs', 'hv'],
		position: ['left', 'right', 'top', 'bottom'],
		alphaChannel: ['auto', true, false],
		paletteSetsAlpha: ['auto', true, false],
	},


	deprecatedOpts : {
		// <old_option>: <new_option>  (<new_option> can be null)
		'styleElement': 'previewElement',
		'onFineChange': 'onInput',
		'overwriteImportant': 'forceStyle',
		'closable': 'closeButton',
		'insetWidth': 'controlBorderWidth',
		'insetColor': 'controlBorderColor',
		'refine': null,
	},


	docsRef : ' ' + 'See https://jscolor.com/docs/',


	//
	// Usage:
	// var myPicker = new JSColor(<targetElement> [, <options>])
	//
	// (constructor is accessible via both 'jscolor' and 'JSColor' name)
	//

	pub : function (targetElement, opts) {

		var THIS = this;

		if (!opts) {
			opts = {};
		}

		this.channels = {
			r: 255, // red [0-255]
			g: 255, // green [0-255]
			b: 255, // blue [0-255]
			h: 0, // hue [0-360]
			s: 0, // saturation [0-100]
			v: 100, // value (brightness) [0-100]
			a: 1.0, // alpha (opacity) [0.0 - 1.0]
		};

		// General options
		//
		this.format = 'auto'; // 'auto' | 'any' | 'hex' | 'hexa' | 'rgb' | 'rgba' - Format of the input/output value
		this.value = undefined; // INITIAL color value in any supported format. To change it later, use method fromString(), fromHSVA(), fromRGBA() or channel()
		this.alpha = undefined; // INITIAL alpha value. To change it later, call method channel('A', <value>)
		this.onChange = undefined; // called when color changes. Value can be either a function or a string with JS code.
		this.onInput = undefined; // called repeatedly as the color is being changed, e.g. while dragging a slider. Value can be either a function or a string with JS code.
		this.valueElement = undefined; // element that will be used to display and input the color value
		this.alphaElement = undefined; // element that will be used to display and input the alpha (opacity) value
		this.previewElement = undefined; // element that will preview the picked color using CSS background
		this.previewPosition = 'left'; // 'left' | 'right' - position of the color preview in previewElement
		this.previewSize = 32; // (px) width of the color preview displayed in previewElement
		this.previewPadding = 8; // (px) space between color preview and content of the previewElement
		this.required = true; // whether the associated text input must always contain a color value. If false, the input can be left empty.
		this.hash = true; // whether to prefix the HEX color code with # symbol (only applicable for HEX format)
		this.uppercase = true; // whether to show the HEX color code in upper case (only applicable for HEX format)
		this.forceStyle = true; // whether to overwrite CSS style of the previewElement using !important flag

		// Color Picker options
		//
		this.width = 181; // width of the color spectrum (in px)
		this.height = 101; // height of the color spectrum (in px)
		this.mode = 'HSV'; // 'HSV' | 'HVS' | 'HS' | 'HV' - layout of the color picker controls
		this.alphaChannel = 'auto'; // 'auto' | true | false - if alpha channel is enabled, the alpha slider will be visible. If 'auto', it will be determined according to color format
		this.position = 'bottom'; // 'left' | 'right' | 'top' | 'bottom' - position relative to the target element
		this.smartPosition = true; // automatically change picker position when there is not enough space for it
		this.showOnClick = true; // whether to show the picker when user clicks its target element
		this.hideOnLeave = true; // whether to automatically hide the picker when user leaves its target element (e.g. upon clicking the document)
		this.palette = []; // colors to be displayed in the palette, specified as an array or a string of space separated color values (in any supported format)
		this.paletteCols = 10; // number of columns in the palette
		this.paletteSetsAlpha = 'auto'; // 'auto' | true | false - if true, palette colors that don't specify alpha will set alpha to 1.0
		this.paletteHeight = 16; // maximum height (px) of a row in the palette
		this.paletteSpacing = 4; // distance (px) between color samples in the palette
		this.hideOnPaletteClick = false; // when set to true, clicking the palette will also hide the color picker
		this.sliderSize = 16; // px
		this.crossSize = 8; // px
		this.closeButton = false; // whether to display the Close button
		this.closeText = 'Close';
		this.buttonColor = 'rgba(0,0,0,1)'; // CSS color
		this.buttonHeight = 18; // px
		this.padding = 12; // px
		this.backgroundColor = 'rgba(255,255,255,1)'; // CSS color
		this.borderWidth = 1; // px
		this.borderColor = 'rgba(187,187,187,1)'; // CSS color
		this.borderRadius = 8; // px
		this.controlBorderWidth = 1; // px
		this.controlBorderColor = 'rgba(187,187,187,1)'; // CSS color
		this.shadow = true; // whether to display a shadow
		this.shadowBlur = 15; // px
		this.shadowColor = 'rgba(0,0,0,0.2)'; // CSS color
		this.pointerColor = 'rgba(76,76,76,1)'; // CSS color
		this.pointerBorderWidth = 1; // px
		this.pointerBorderColor = 'rgba(255,255,255,1)'; // CSS color
		this.pointerThickness = 2; // px
		this.zIndex = 5000;
		this.container = undefined; // where to append the color picker (BODY element by default)

		// Experimental
		//
		this.minS = 0; // min allowed saturation (0 - 100)
		this.maxS = 100; // max allowed saturation (0 - 100)
		this.minV = 0; // min allowed value (brightness) (0 - 100)
		this.maxV = 100; // max allowed value (brightness) (0 - 100)
		this.minA = 0.0; // min allowed alpha (opacity) (0.0 - 1.0)
		this.maxA = 1.0; // max allowed alpha (opacity) (0.0 - 1.0)


		// Getter: option(name)
		// Setter: option(name, value)
		//         option({name:value, ...})
		//
		this.option = function () {
			if (!arguments.length) {
				throw new Error('No option specified');
			}

			if (arguments.length === 1 && typeof arguments[0] === 'string') {
				// getting a single option
				try {
					return getOption(arguments[0]);
				} catch (e) {
					console.warn(e);
				}
				return false;

			} else if (arguments.length >= 2 && typeof arguments[0] === 'string') {
				// setting a single option
				try {
					if (!setOption(arguments[0], arguments[1])) {
						return false;
					}
				} catch (e) {
					console.warn(e);
					return false;
				}
				this.redraw(); // immediately redraws the picker, if it's displayed
				this.exposeColor(); // in case some preview-related or format-related option was changed
				return true;

			} else if (arguments.length === 1 && typeof arguments[0] === 'object') {
				// setting multiple options
				var opts = arguments[0];
				var success = true;
				for (var opt in opts) {
					if (opts.hasOwnProperty(opt)) {
						try {
							if (!setOption(opt, opts[opt])) {
								success = false;
							}
						} catch (e) {
							console.warn(e);
							success = false;
						}
					}
				}
				this.redraw(); // immediately redraws the picker, if it's displayed
				this.exposeColor(); // in case some preview-related or format-related option was changed
				return success;
			}

			throw new Error('Invalid arguments');
		}


		// Getter: channel(name)
		// Setter: channel(name, value)
		//
		this.channel = function (name, value) {
			if (typeof name !== 'string') {
				throw new Error('Invalid value for channel name: ' + name);
			}

			if (value === undefined) {
				// getting channel value
				if (!this.channels.hasOwnProperty(name.toLowerCase())) {
					console.warn('Getting unknown channel: ' + name);
					return false;
				}
				return this.channels[name.toLowerCase()];

			} else {
				// setting channel value
				var res = false;
				switch (name.toLowerCase()) {
					case 'r': res = this.fromRGBA(value, null, null, null); break;
					case 'g': res = this.fromRGBA(null, value, null, null); break;
					case 'b': res = this.fromRGBA(null, null, value, null); break;
					case 'h': res = this.fromHSVA(value, null, null, null); break;
					case 's': res = this.fromHSVA(null, value, null, null); break;
					case 'v': res = this.fromHSVA(null, null, value, null); break;
					case 'a': res = this.fromHSVA(null, null, null, value); break;
					default:
						console.warn('Setting unknown channel: ' + name);
						return false;
				}
				if (res) {
					this.redraw(); // immediately redraws the picker, if it's displayed
					return true;
				}
			}

			return false;
		}


		// Triggers given input event(s) by:
		// - executing on<Event> callback specified as picker's option
		// - triggering standard DOM event listeners attached to the value element
		//
		// It is possible to specify multiple events separated with a space.
		//
		this.trigger = function (eventNames) {
			var evs = jsc.strList(eventNames);
			for (var i = 0; i < evs.length; i += 1) {
				var ev = evs[i].toLowerCase();

				// trigger a callback
				var callbackProp = null;
				switch (ev) {
					case 'input': callbackProp = 'onInput'; break;
					case 'change': callbackProp = 'onChange'; break;
				}
				if (callbackProp) {
					jsc.triggerCallback(this, callbackProp);
				}

				// trigger standard DOM event listeners on the value element
				jsc.triggerInputEvent(this.valueElement, ev, true, true);
			}
		};


		// h: 0-360
		// s: 0-100
		// v: 0-100
		// a: 0.0-1.0
		//
		this.fromHSVA = function (h, s, v, a, flags) { // null = don't change
			if (h === undefined) { h = null; }
			if (s === undefined) { s = null; }
			if (v === undefined) { v = null; }
			if (a === undefined) { a = null; }

			if (h !== null) {
				if (isNaN(h)) { return false; }
				this.channels.h = Math.max(0, Math.min(360, h));
			}
			if (s !== null) {
				if (isNaN(s)) { return false; }
				this.channels.s = Math.max(0, Math.min(100, this.maxS, s), this.minS);
			}
			if (v !== null) {
				if (isNaN(v)) { return false; }
				this.channels.v = Math.max(0, Math.min(100, this.maxV, v), this.minV);
			}
			if (a !== null) {
				if (isNaN(a)) { return false; }
				this.channels.a = this.hasAlphaChannel() ?
					Math.max(0, Math.min(1, this.maxA, a), this.minA) :
					1.0; // if alpha channel is disabled, the color should stay 100% opaque
			}

			var rgb = jsc.HSV_RGB(
				this.channels.h,
				this.channels.s,
				this.channels.v
			);
			this.channels.r = rgb[0];
			this.channels.g = rgb[1];
			this.channels.b = rgb[2];

			this.exposeColor(flags);
			return true;
		};


		// r: 0-255
		// g: 0-255
		// b: 0-255
		// a: 0.0-1.0
		//
		this.fromRGBA = function (r, g, b, a, flags) { // null = don't change
			if (r === undefined) { r = null; }
			if (g === undefined) { g = null; }
			if (b === undefined) { b = null; }
			if (a === undefined) { a = null; }

			if (r !== null) {
				if (isNaN(r)) { return false; }
				r = Math.max(0, Math.min(255, r));
			}
			if (g !== null) {
				if (isNaN(g)) { return false; }
				g = Math.max(0, Math.min(255, g));
			}
			if (b !== null) {
				if (isNaN(b)) { return false; }
				b = Math.max(0, Math.min(255, b));
			}
			if (a !== null) {
				if (isNaN(a)) { return false; }
				this.channels.a = this.hasAlphaChannel() ?
					Math.max(0, Math.min(1, this.maxA, a), this.minA) :
					1.0; // if alpha channel is disabled, the color should stay 100% opaque
			}

			var hsv = jsc.RGB_HSV(
				r===null ? this.channels.r : r,
				g===null ? this.channels.g : g,
				b===null ? this.channels.b : b
			);
			if (hsv[0] !== null) {
				this.channels.h = Math.max(0, Math.min(360, hsv[0]));
			}
			if (hsv[2] !== 0) { // fully black color stays black through entire saturation range, so let's not change saturation
				this.channels.s = Math.max(0, this.minS, Math.min(100, this.maxS, hsv[1]));
			}
			this.channels.v = Math.max(0, this.minV, Math.min(100, this.maxV, hsv[2]));

			// update RGB according to final HSV, as some values might be trimmed
			var rgb = jsc.HSV_RGB(this.channels.h, this.channels.s, this.channels.v);
			this.channels.r = rgb[0];
			this.channels.g = rgb[1];
			this.channels.b = rgb[2];

			this.exposeColor(flags);
			return true;
		};


		// DEPRECATED. Use .fromHSVA() instead
		//
		this.fromHSV = function (h, s, v, flags) {
			console.warn('fromHSV() method is DEPRECATED. Using fromHSVA() instead.' + jsc.docsRef);
			return this.fromHSVA(h, s, v, null, flags);
		};


		// DEPRECATED. Use .fromRGBA() instead
		//
		this.fromRGB = function (r, g, b, flags) {
			console.warn('fromRGB() method is DEPRECATED. Using fromRGBA() instead.' + jsc.docsRef);
			return this.fromRGBA(r, g, b, null, flags);
		};


		this.fromString = function (str, flags) {
			if (!this.required && str.trim() === '') {
				// setting empty string to an optional color input
				this.setPreviewElementBg(null);
				this.setValueElementValue('');
				return true;
			}

			var color = jsc.parseColorString(str);
			if (!color) {
				return false; // could not parse
			}
			if (this.format.toLowerCase() === 'any') {
				this._setFormat(color.format); // adapt format
				if (!jsc.isAlphaFormat(this.getFormat())) {
					color.rgba[3] = 1.0; // when switching to a format that doesn't support alpha, set full opacity
				}
			}
			this.fromRGBA(
				color.rgba[0],
				color.rgba[1],
				color.rgba[2],
				color.rgba[3],
				flags
			);
			return true;
		};


		this.toString = function (format) {
			if (format === undefined) {
				format = this.getFormat(); // format not specified -> use the current format
			}
			switch (format.toLowerCase()) {
				case 'hex': return this.toHEXString(); break;
				case 'hexa': return this.toHEXAString(); break;
				case 'rgb': return this.toRGBString(); break;
				case 'rgba': return this.toRGBAString(); break;
			}
			return false;
		};


		this.toHEXString = function () {
			return jsc.hexColor(
				this.channels.r,
				this.channels.g,
				this.channels.b
			);
		};


		this.toHEXAString = function () {
			return jsc.hexaColor(
				this.channels.r,
				this.channels.g,
				this.channels.b,
				this.channels.a
			);
		};


		this.toRGBString = function () {
			return jsc.rgbColor(
				this.channels.r,
				this.channels.g,
				this.channels.b
			);
		};


		this.toRGBAString = function () {
			return jsc.rgbaColor(
				this.channels.r,
				this.channels.g,
				this.channels.b,
				this.channels.a
			);
		};


		this.toGrayscale = function () {
			return (
				0.213 * this.channels.r +
				0.715 * this.channels.g +
				0.072 * this.channels.b
			);
		};


		this.toCanvas = function () {
			return jsc.genColorPreviewCanvas(this.toRGBAString()).canvas;
		};


		this.toDataURL = function () {
			return this.toCanvas().toDataURL();
		};


		this.toBackground = function () {
			return jsc.pub.background(this.toRGBAString());
		};


		this.isLight = function () {
			return this.toGrayscale() > 255 / 2;
		};


		this.hide = function () {
			if (isPickerOwner()) {
				detachPicker();
			}
		};


		this.show = function () {
			drawPicker();
		};


		this.redraw = function () {
			if (isPickerOwner()) {
				drawPicker();
			}
		};


		this.getFormat = function () {
			return this._currentFormat;
		};


		this._setFormat = function (format) {
			this._currentFormat = format.toLowerCase();
		};


		this.hasAlphaChannel = function () {
			if (this.alphaChannel === 'auto') {
				return (
					this.format.toLowerCase() === 'any' || // format can change on the fly (e.g. from hex to rgba), so let's consider the alpha channel enabled
					jsc.isAlphaFormat(this.getFormat()) || // the current format supports alpha channel
					this.alpha !== undefined || // initial alpha value is set, so we're working with alpha channel
					this.alphaElement !== undefined // the alpha value is redirected, so we're working with alpha channel
				);
			}

			return this.alphaChannel; // the alpha channel is explicitly set
		};


		this.processValueInput = function (str) {
			if (!this.fromString(str)) {
				// could not parse the color value - let's just expose the current color
				this.exposeColor();
			}
		};


		this.processAlphaInput = function (str) {
			if (!this.fromHSVA(null, null, null, parseFloat(str))) {
				// could not parse the alpha value - let's just expose the current color
				this.exposeColor();
			}
		};


		this.exposeColor = function (flags) {
			var colorStr = this.toString();
			var fmt = this.getFormat();

			// reflect current color in data- attribute
			jsc.setDataAttr(this.targetElement, 'current-color', colorStr);

			if (!(flags & jsc.flags.leaveValue) && this.valueElement) {
				if (fmt === 'hex' || fmt === 'hexa') {
					if (!this.uppercase) { colorStr = colorStr.toLowerCase(); }
					if (!this.hash) { colorStr = colorStr.replace(/^#/, ''); }
				}
				this.setValueElementValue(colorStr);
			}

			if (!(flags & jsc.flags.leaveAlpha) && this.alphaElement) {
				var alphaVal = Math.round(this.channels.a * 100) / 100;
				this.setAlphaElementValue(alphaVal);
			}

			if (!(flags & jsc.flags.leavePreview) && this.previewElement) {
				var previewPos = null; // 'left' | 'right' (null -> fill the entire element)

				if (
					jsc.isTextInput(this.previewElement) || // text input
					(jsc.isButton(this.previewElement) && !jsc.isButtonEmpty(this.previewElement)) // button with text
				) {
					previewPos = this.previewPosition;
				}

				this.setPreviewElementBg(this.toRGBAString());
			}

			if (isPickerOwner()) {
				redrawPad();
				redrawSld();
				redrawASld();
			}
		};


		this.setPreviewElementBg = function (color) {
			if (!this.previewElement) {
				return;
			}

			var position = null; // color preview position:  null | 'left' | 'right'
			var width = null; // color preview width:  px | null = fill the entire element
			if (
				jsc.isTextInput(this.previewElement) || // text input
				(jsc.isButton(this.previewElement) && !jsc.isButtonEmpty(this.previewElement)) // button with text
			) {
				position = this.previewPosition;
				width = this.previewSize;
			}

			var backgrounds = [];

			if (!color) {
				// there is no color preview to display -> let's remove any previous background image
				backgrounds.push({
					image: 'none',
					position: 'left top',
					size: 'auto',
					repeat: 'no-repeat',
					origin: 'padding-box',
				});
			} else {
				// CSS gradient for background color preview
				backgrounds.push({
					image: jsc.genColorPreviewGradient(
						color,
						position,
						width ? width - jsc.pub.previewSeparator.length : null
					),
					position: 'left top',
					size: 'auto',
					repeat: position ? 'repeat-y' : 'repeat',
					origin: 'padding-box',
				});

				// data URL of generated PNG image with a gray transparency chessboard
				var preview = jsc.genColorPreviewCanvas(
					'rgba(0,0,0,0)',
					position ? {'left':'right', 'right':'left'}[position] : null,
					width,
					true
				);
				backgrounds.push({
					image: 'url(\'' + preview.canvas.toDataURL() + '\')',
					position: (position || 'left') + ' top',
					size: preview.width + 'px ' + preview.height + 'px',
					repeat: position ? 'repeat-y' : 'repeat',
					origin: 'padding-box',
				});
			}

			var bg = {
				image: [],
				position: [],
				size: [],
				repeat: [],
				origin: [],
			};
			for (var i = 0; i < backgrounds.length; i += 1) {
				bg.image.push(backgrounds[i].image);
				bg.position.push(backgrounds[i].position);
				bg.size.push(backgrounds[i].size);
				bg.repeat.push(backgrounds[i].repeat);
				bg.origin.push(backgrounds[i].origin);
			}

			// set previewElement's background-images
			var sty = {
				'background-image': bg.image.join(', '),
				'background-position': bg.position.join(', '),
				'background-size': bg.size.join(', '),
				'background-repeat': bg.repeat.join(', '),
				'background-origin': bg.origin.join(', '),
			};
			jsc.setStyle(this.previewElement, sty, this.forceStyle);


			// set/restore previewElement's padding
			var padding = {
				left: null,
				right: null,
			};
			if (position) {
				padding[position] = (this.previewSize + this.previewPadding) + 'px';
			}

			var sty = {
				'padding-left': padding.left,
				'padding-right': padding.right,
			};
			jsc.setStyle(this.previewElement, sty, this.forceStyle, true);
		};


		this.setValueElementValue = function (str) {
			if (this.valueElement) {
				if (jsc.nodeName(this.valueElement) === 'input') {
					this.valueElement.value = str;
				} else {
					this.valueElement.innerHTML = str;
				}
			}
		};


		this.setAlphaElementValue = function (str) {
			if (this.alphaElement) {
				if (jsc.nodeName(this.alphaElement) === 'input') {
					this.alphaElement.value = str;
				} else {
					this.alphaElement.innerHTML = str;
				}
			}
		};


		this._processParentElementsInDOM = function () {
			if (this._parentElementsProcessed) { return; }
			this._parentElementsProcessed = true;

			var elm = this.targetElement;
			do {
				// If the target element or one of its parent nodes has fixed position,
				// then use fixed positioning instead
				var compStyle = jsc.getCompStyle(elm);
				if (compStyle.position && compStyle.position.toLowerCase() === 'fixed') {
					this.fixed = true;
				}

				if (elm !== this.targetElement) {
					// Ensure to attach onParentScroll only once to each parent element
					// (multiple targetElements can share the same parent nodes)
					//
					// Note: It's not just offsetParents that can be scrollable,
					// that's why we loop through all parent nodes
					if (!jsc.getData(elm, 'hasScrollListener')) {
						elm.addEventListener('scroll', jsc.onParentScroll, false);
						jsc.setData(elm, 'hasScrollListener', true);
					}
				}
			} while ((elm = elm.parentNode) && jsc.nodeName(elm) !== 'body');
		};


		this.tryHide = function () {
			if (this.hideOnLeave) {
				this.hide();
			}
		};


		this.set__palette = function (val) {
			this.palette = val;
			this._palette = jsc.parsePaletteValue(val);
			this._paletteHasTransparency = jsc.containsTranparentColor(this._palette);
		};


		function setOption (option, value) {
			if (typeof option !== 'string') {
				throw new Error('Invalid value for option name: ' + option);
			}

			// enum option
			if (jsc.enumOpts.hasOwnProperty(option)) {
				if (typeof value === 'string') { // enum string values are case insensitive
					value = value.toLowerCase();
				}
				if (jsc.enumOpts[option].indexOf(value) === -1) {
					throw new Error('Option \'' + option + '\' has invalid value: ' + value);
				}
			}

			// deprecated option
			if (jsc.deprecatedOpts.hasOwnProperty(option)) {
				var oldOpt = option;
				var newOpt = jsc.deprecatedOpts[option];
				if (newOpt) {
					// if we have a new name for this option, let's log a warning and use the new name
					console.warn('Option \'%s\' is DEPRECATED, using \'%s\' instead.' + jsc.docsRef, oldOpt, newOpt);
					option = newOpt;
				} else {
					// new name not available for the option
					throw new Error('Option \'' + option + '\' is DEPRECATED');
				}
			}

			var setter = 'set__' + option;

			if (typeof THIS[setter] === 'function') { // a setter exists for this option
				THIS[setter](value);
				return true;

			} else if (option in THIS) { // option exists as a property
				THIS[option] = value;
				return true;
			}

			throw new Error('Unrecognized configuration option: ' + option);
		}


		function getOption (option) {
			if (typeof option !== 'string') {
				throw new Error('Invalid value for option name: ' + option);
			}

			// deprecated option
			if (jsc.deprecatedOpts.hasOwnProperty(option)) {
				var oldOpt = option;
				var newOpt = jsc.deprecatedOpts[option];
				if (newOpt) {
					// if we have a new name for this option, let's log a warning and use the new name
					console.warn('Option \'%s\' is DEPRECATED, using \'%s\' instead.' + jsc.docsRef, oldOpt, newOpt);
					option = newOpt;
				} else {
					// new name not available for the option
					throw new Error('Option \'' + option + '\' is DEPRECATED');
				}
			}

			var getter = 'get__' + option;

			if (typeof THIS[getter] === 'function') { // a getter exists for this option
				return THIS[getter](value);

			} else if (option in THIS) { // option exists as a property
				return THIS[option];
			}

			throw new Error('Unrecognized configuration option: ' + option);
		}


		function detachPicker () {
			jsc.removeClass(THIS.targetElement, jsc.pub.activeClassName);
			jsc.picker.wrap.parentNode.removeChild(jsc.picker.wrap);
			delete jsc.picker.owner;
		}


		function drawPicker () {

			// At this point, when drawing the picker, we know what the parent elements are
			// and we can do all related DOM operations, such as registering events on them
			// or checking their positioning
			THIS._processParentElementsInDOM();

			if (!jsc.picker) {
				jsc.picker = {
					owner: null, // owner picker instance
					wrap : jsc.createEl('div'),
					box : jsc.createEl('div'),
					boxS : jsc.createEl('div'), // shadow area
					boxB : jsc.createEl('div'), // border
					pad : jsc.createEl('div'),
					padB : jsc.createEl('div'), // border
					padM : jsc.createEl('div'), // mouse/touch area
					padCanvas : jsc.createPadCanvas(),
					cross : jsc.createEl('div'),
					crossBY : jsc.createEl('div'), // border Y
					crossBX : jsc.createEl('div'), // border X
					crossLY : jsc.createEl('div'), // line Y
					crossLX : jsc.createEl('div'), // line X
					sld : jsc.createEl('div'), // slider
					sldB : jsc.createEl('div'), // border
					sldM : jsc.createEl('div'), // mouse/touch area
					sldGrad : jsc.createSliderGradient(),
					sldPtrS : jsc.createEl('div'), // slider pointer spacer
					sldPtrIB : jsc.createEl('div'), // slider pointer inner border
					sldPtrMB : jsc.createEl('div'), // slider pointer middle border
					sldPtrOB : jsc.createEl('div'), // slider pointer outer border
					asld : jsc.createEl('div'), // alpha slider
					asldB : jsc.createEl('div'), // border
					asldM : jsc.createEl('div'), // mouse/touch area
					asldGrad : jsc.createASliderGradient(),
					asldPtrS : jsc.createEl('div'), // slider pointer spacer
					asldPtrIB : jsc.createEl('div'), // slider pointer inner border
					asldPtrMB : jsc.createEl('div'), // slider pointer middle border
					asldPtrOB : jsc.createEl('div'), // slider pointer outer border
					pal : jsc.createEl('div'), // palette
					btn : jsc.createEl('div'),
					btnT : jsc.createEl('span'), // text
				};

				jsc.picker.pad.appendChild(jsc.picker.padCanvas.elm);
				jsc.picker.padB.appendChild(jsc.picker.pad);
				jsc.picker.cross.appendChild(jsc.picker.crossBY);
				jsc.picker.cross.appendChild(jsc.picker.crossBX);
				jsc.picker.cross.appendChild(jsc.picker.crossLY);
				jsc.picker.cross.appendChild(jsc.picker.crossLX);
				jsc.picker.padB.appendChild(jsc.picker.cross);
				jsc.picker.box.appendChild(jsc.picker.padB);
				jsc.picker.box.appendChild(jsc.picker.padM);

				jsc.picker.sld.appendChild(jsc.picker.sldGrad.elm);
				jsc.picker.sldB.appendChild(jsc.picker.sld);
				jsc.picker.sldB.appendChild(jsc.picker.sldPtrOB);
				jsc.picker.sldPtrOB.appendChild(jsc.picker.sldPtrMB);
				jsc.picker.sldPtrMB.appendChild(jsc.picker.sldPtrIB);
				jsc.picker.sldPtrIB.appendChild(jsc.picker.sldPtrS);
				jsc.picker.box.appendChild(jsc.picker.sldB);
				jsc.picker.box.appendChild(jsc.picker.sldM);

				jsc.picker.asld.appendChild(jsc.picker.asldGrad.elm);
				jsc.picker.asldB.appendChild(jsc.picker.asld);
				jsc.picker.asldB.appendChild(jsc.picker.asldPtrOB);
				jsc.picker.asldPtrOB.appendChild(jsc.picker.asldPtrMB);
				jsc.picker.asldPtrMB.appendChild(jsc.picker.asldPtrIB);
				jsc.picker.asldPtrIB.appendChild(jsc.picker.asldPtrS);
				jsc.picker.box.appendChild(jsc.picker.asldB);
				jsc.picker.box.appendChild(jsc.picker.asldM);

				jsc.picker.box.appendChild(jsc.picker.pal);

				jsc.picker.btn.appendChild(jsc.picker.btnT);
				jsc.picker.box.appendChild(jsc.picker.btn);

				jsc.picker.boxB.appendChild(jsc.picker.box);
				jsc.picker.wrap.appendChild(jsc.picker.boxS);
				jsc.picker.wrap.appendChild(jsc.picker.boxB);

				jsc.picker.wrap.addEventListener('touchstart', jsc.onPickerTouchStart,
					jsc.isPassiveEventSupported ? {passive: false} : false);
			}

			var p = jsc.picker;

			var displaySlider = !!jsc.getSliderChannel(THIS);
			var displayAlphaSlider = THIS.hasAlphaChannel();
			var pickerDims = jsc.getPickerDims(THIS);
			var crossOuterSize = (2 * THIS.pointerBorderWidth + THIS.pointerThickness + 2 * THIS.crossSize);
			var controlPadding = jsc.getControlPadding(THIS);
			var borderRadius = Math.min(
				THIS.borderRadius,
				Math.round(THIS.padding * Math.PI)); // px
			var padCursor = 'crosshair';

			// wrap
			p.wrap.className = 'jscolor-picker-wrap';
			p.wrap.style.clear = 'both';
			p.wrap.style.width = pickerDims.borderW + 'px';
			p.wrap.style.height = pickerDims.borderH + 'px';
			p.wrap.style.zIndex = THIS.zIndex;

			// picker
			p.box.className = 'jscolor-picker';
			p.box.style.width = pickerDims.paddedW + 'px';
			p.box.style.height = pickerDims.paddedH + 'px';
			p.box.style.position = 'relative';

			// picker shadow
			p.boxS.className = 'jscolor-picker-shadow';
			p.boxS.style.position = 'absolute';
			p.boxS.style.left = '0';
			p.boxS.style.top = '0';
			p.boxS.style.width = '100%';
			p.boxS.style.height = '100%';
			jsc.setBorderRadius(p.boxS, borderRadius + 'px');

			// picker border
			p.boxB.className = 'jscolor-picker-border';
			p.boxB.style.position = 'relative';
			p.boxB.style.border = THIS.borderWidth + 'px solid';
			p.boxB.style.borderColor = THIS.borderColor;
			p.boxB.style.background = THIS.backgroundColor;
			jsc.setBorderRadius(p.boxB, borderRadius + 'px');

			// IE hack:
			// If the element is transparent, IE will trigger the event on the elements under it,
			// e.g. on Canvas or on elements with border
			p.padM.style.background = 'rgba(255,0,0,.2)';
			p.sldM.style.background = 'rgba(0,255,0,.2)';
			p.asldM.style.background = 'rgba(0,0,255,.2)';

			p.padM.style.opacity =
			p.sldM.style.opacity =
			p.asldM.style.opacity =
				'0';

			// pad
			p.pad.style.position = 'relative';
			p.pad.style.width = THIS.width + 'px';
			p.pad.style.height = THIS.height + 'px';

			// pad - color spectrum (HSV and HVS)
			p.padCanvas.draw(THIS.width, THIS.height, jsc.getPadYChannel(THIS));

			// pad border
			p.padB.style.position = 'absolute';
			p.padB.style.left = THIS.padding + 'px';
			p.padB.style.top = THIS.padding + 'px';
			p.padB.style.border = THIS.controlBorderWidth + 'px solid';
			p.padB.style.borderColor = THIS.controlBorderColor;

			// pad mouse area
			p.padM.style.position = 'absolute';
			p.padM.style.left = 0 + 'px';
			p.padM.style.top = 0 + 'px';
			p.padM.style.width = (THIS.padding + 2 * THIS.controlBorderWidth + THIS.width + controlPadding) + 'px';
			p.padM.style.height = (2 * THIS.controlBorderWidth + 2 * THIS.padding + THIS.height) + 'px';
			p.padM.style.cursor = padCursor;
			jsc.setData(p.padM, {
				instance: THIS,
				control: 'pad',
			})

			// pad cross
			p.cross.style.position = 'absolute';
			p.cross.style.left =
			p.cross.style.top =
				'0';
			p.cross.style.width =
			p.cross.style.height =
				crossOuterSize + 'px';

			// pad cross border Y and X
			p.crossBY.style.position =
			p.crossBX.style.position =
				'absolute';
			p.crossBY.style.background =
			p.crossBX.style.background =
				THIS.pointerBorderColor;
			p.crossBY.style.width =
			p.crossBX.style.height =
				(2 * THIS.pointerBorderWidth + THIS.pointerThickness) + 'px';
			p.crossBY.style.height =
			p.crossBX.style.width =
				crossOuterSize + 'px';
			p.crossBY.style.left =
			p.crossBX.style.top =
				(Math.floor(crossOuterSize / 2) - Math.floor(THIS.pointerThickness / 2) - THIS.pointerBorderWidth) + 'px';
			p.crossBY.style.top =
			p.crossBX.style.left =
				'0';

			// pad cross line Y and X
			p.crossLY.style.position =
			p.crossLX.style.position =
				'absolute';
			p.crossLY.style.background =
			p.crossLX.style.background =
				THIS.pointerColor;
			p.crossLY.style.height =
			p.crossLX.style.width =
				(crossOuterSize - 2 * THIS.pointerBorderWidth) + 'px';
			p.crossLY.style.width =
			p.crossLX.style.height =
				THIS.pointerThickness + 'px';
			p.crossLY.style.left =
			p.crossLX.style.top =
				(Math.floor(crossOuterSize / 2) - Math.floor(THIS.pointerThickness / 2)) + 'px';
			p.crossLY.style.top =
			p.crossLX.style.left =
				THIS.pointerBorderWidth + 'px';


			// slider
			p.sld.style.overflow = 'hidden';
			p.sld.style.width = THIS.sliderSize + 'px';
			p.sld.style.height = THIS.height + 'px';

			// slider gradient
			p.sldGrad.draw(THIS.sliderSize, THIS.height, '#000', '#000');

			// slider border
			p.sldB.style.display = displaySlider ? 'block' : 'none';
			p.sldB.style.position = 'absolute';
			p.sldB.style.left = (THIS.padding + THIS.width + 2 * THIS.controlBorderWidth + 2 * controlPadding) + 'px';
			p.sldB.style.top = THIS.padding + 'px';
			p.sldB.style.border = THIS.controlBorderWidth + 'px solid';
			p.sldB.style.borderColor = THIS.controlBorderColor;

			// slider mouse area
			p.sldM.style.display = displaySlider ? 'block' : 'none';
			p.sldM.style.position = 'absolute';
			p.sldM.style.left = (THIS.padding + THIS.width + 2 * THIS.controlBorderWidth + controlPadding) + 'px';
			p.sldM.style.top = 0 + 'px';
			p.sldM.style.width = (
					(THIS.sliderSize + 2 * controlPadding + 2 * THIS.controlBorderWidth) +
					(displayAlphaSlider ? 0 : Math.max(0, THIS.padding - controlPadding)) // remaining padding to the right edge
				) + 'px';
			p.sldM.style.height = (2 * THIS.controlBorderWidth + 2 * THIS.padding + THIS.height) + 'px';
			p.sldM.style.cursor = 'default';
			jsc.setData(p.sldM, {
				instance: THIS,
				control: 'sld',
			});

			// slider pointer inner and outer border
			p.sldPtrIB.style.border =
			p.sldPtrOB.style.border =
				THIS.pointerBorderWidth + 'px solid ' + THIS.pointerBorderColor;

			// slider pointer outer border
			p.sldPtrOB.style.position = 'absolute';
			p.sldPtrOB.style.left = -(2 * THIS.pointerBorderWidth + THIS.pointerThickness) + 'px';
			p.sldPtrOB.style.top = '0';

			// slider pointer middle border
			p.sldPtrMB.style.border = THIS.pointerThickness + 'px solid ' + THIS.pointerColor;

			// slider pointer spacer
			p.sldPtrS.style.width = THIS.sliderSize + 'px';
			p.sldPtrS.style.height = jsc.pub.sliderInnerSpace + 'px';


			// alpha slider
			p.asld.style.overflow = 'hidden';
			p.asld.style.width = THIS.sliderSize + 'px';
			p.asld.style.height = THIS.height + 'px';

			// alpha slider gradient
			p.asldGrad.draw(THIS.sliderSize, THIS.height, '#000');

			// alpha slider border
			p.asldB.style.display = displayAlphaSlider ? 'block' : 'none';
			p.asldB.style.position = 'absolute';
			p.asldB.style.left = (
					(THIS.padding + THIS.width + 2 * THIS.controlBorderWidth + controlPadding) +
					(displaySlider ? (THIS.sliderSize + 3 * controlPadding + 2 * THIS.controlBorderWidth) : 0)
				) + 'px';
			p.asldB.style.top = THIS.padding + 'px';
			p.asldB.style.border = THIS.controlBorderWidth + 'px solid';
			p.asldB.style.borderColor = THIS.controlBorderColor;

			// alpha slider mouse area
			p.asldM.style.display = displayAlphaSlider ? 'block' : 'none';
			p.asldM.style.position = 'absolute';
			p.asldM.style.left = (
					(THIS.padding + THIS.width + 2 * THIS.controlBorderWidth + controlPadding) +
					(displaySlider ? (THIS.sliderSize + 2 * controlPadding + 2 * THIS.controlBorderWidth) : 0)
				) + 'px';
			p.asldM.style.top = 0 + 'px';
			p.asldM.style.width = (
					(THIS.sliderSize + 2 * controlPadding + 2 * THIS.controlBorderWidth) +
					Math.max(0, THIS.padding - controlPadding) // remaining padding to the right edge
				) + 'px';
			p.asldM.style.height = (2 * THIS.controlBorderWidth + 2 * THIS.padding + THIS.height) + 'px';
			p.asldM.style.cursor = 'default';
			jsc.setData(p.asldM, {
				instance: THIS,
				control: 'asld',
			})

			// alpha slider pointer inner and outer border
			p.asldPtrIB.style.border =
			p.asldPtrOB.style.border =
				THIS.pointerBorderWidth + 'px solid ' + THIS.pointerBorderColor;

			// alpha slider pointer outer border
			p.asldPtrOB.style.position = 'absolute';
			p.asldPtrOB.style.left = -(2 * THIS.pointerBorderWidth + THIS.pointerThickness) + 'px';
			p.asldPtrOB.style.top = '0';

			// alpha slider pointer middle border
			p.asldPtrMB.style.border = THIS.pointerThickness + 'px solid ' + THIS.pointerColor;

			// alpha slider pointer spacer
			p.asldPtrS.style.width = THIS.sliderSize + 'px';
			p.asldPtrS.style.height = jsc.pub.sliderInnerSpace + 'px';


			// palette
			p.pal.className = 'jscolor-palette';
			p.pal.style.display = pickerDims.palette.rows ? 'block' : 'none';
			p.pal.style.position = 'absolute';
			p.pal.style.left = THIS.padding + 'px';
			p.pal.style.top = (2 * THIS.controlBorderWidth + 2 * THIS.padding + THIS.height) + 'px';

			// palette's color samples

			p.pal.innerHTML = '';

			var chessboard = jsc.genColorPreviewCanvas('rgba(0,0,0,0)');

			var si = 0; // color sample's index
			for (var r = 0; r < pickerDims.palette.rows; r++) {
				for (var c = 0; c < pickerDims.palette.cols && si < THIS._palette.length; c++, si++) {
					var sampleColor = THIS._palette[si];
					var sampleCssColor = jsc.rgbaColor.apply(null, sampleColor.rgba);

					var sc = jsc.createEl('div'); // color sample's color
					sc.style.width = (pickerDims.palette.cellW - 2 * THIS.controlBorderWidth) + 'px';
					sc.style.height = (pickerDims.palette.cellH - 2 * THIS.controlBorderWidth) + 'px';
					sc.style.backgroundColor = sampleCssColor;

					var sw = jsc.createEl('div'); // color sample's wrap
					sw.className = 'jscolor-palette-sample';
					sw.style.display = 'block';
					sw.style.position = 'absolute';
					sw.style.left = (
							pickerDims.palette.cols <= 1 ? 0 :
							Math.round(10 * (c * ((pickerDims.contentW - pickerDims.palette.cellW) / (pickerDims.palette.cols - 1)))) / 10
						) + 'px';
					sw.style.top = (r * (pickerDims.palette.cellH + THIS.paletteSpacing)) + 'px';
					sw.style.border = THIS.controlBorderWidth + 'px solid';
					sw.style.borderColor = THIS.controlBorderColor;
					sw.style.cursor = 'pointer';
					if (sampleColor.rgba[3] !== null && sampleColor.rgba[3] < 1.0) { // only create chessboard background if the sample has transparency
						sw.style.backgroundImage = 'url(\'' + chessboard.canvas.toDataURL() + '\')';
						sw.style.backgroundRepeat = 'repeat';
						sw.style.backgroundPosition = 'center center';
					}
					jsc.setData(sw, {
						instance: THIS,
						control: 'palette-sample',
						color: sampleColor,
					})
					sw.addEventListener('click', jsc.onPaletteSampleClick, false);
					sw.appendChild(sc);
					p.pal.appendChild(sw);
				}
			}


			// the Close button
			function setBtnBorder () {
				var insetColors = THIS.controlBorderColor.split(/\s+/);
				var outsetColor = insetColors.length < 2 ? insetColors[0] : insetColors[1] + ' ' + insetColors[0] + ' ' + insetColors[0] + ' ' + insetColors[1];
				p.btn.style.borderColor = outsetColor;
			}
			var btnPadding = 15; // px
			p.btn.className = 'jscolor-btn-close';
			p.btn.style.display = THIS.closeButton ? 'block' : 'none';
			p.btn.style.position = 'absolute';
			p.btn.style.left = THIS.padding + 'px';
			p.btn.style.bottom = THIS.padding + 'px';
			p.btn.style.padding = '0 ' + btnPadding + 'px';
			p.btn.style.maxWidth = (pickerDims.contentW - 2 * THIS.controlBorderWidth - 2 * btnPadding) + 'px';
			p.btn.style.overflow = 'hidden';
			p.btn.style.height = THIS.buttonHeight + 'px';
			p.btn.style.whiteSpace = 'nowrap';
			p.btn.style.border = THIS.controlBorderWidth + 'px solid';
			setBtnBorder();
			p.btn.style.color = THIS.buttonColor;
			p.btn.style.font = '12px sans-serif';
			p.btn.style.textAlign = 'center';
			p.btn.style.cursor = 'pointer';
			p.btn.onmousedown = function () {
				THIS.hide();
			};
			p.btnT.style.lineHeight = THIS.buttonHeight + 'px';
			p.btnT.innerHTML = '';
			p.btnT.appendChild(window.document.createTextNode(THIS.closeText));

			// reposition the pointers
			redrawPad();
			redrawSld();
			redrawASld();

			// If we are changing the owner without first closing the picker,
			// make sure to first deal with the old owner
			if (jsc.picker.owner && jsc.picker.owner !== THIS) {
				jsc.removeClass(jsc.picker.owner.targetElement, jsc.pub.activeClassName);
			}

			// Set a new picker owner
			jsc.picker.owner = THIS;

			// The redrawPosition() method needs picker.owner to be set, that's why we call it here,
			// after setting the owner
			if (THIS.container === window.document.body) {
				jsc.redrawPosition();
			} else {
				jsc._drawPosition(THIS, 0, 0, 'relative', false);
			}

			if (p.wrap.parentNode !== THIS.container) {
				THIS.container.appendChild(p.wrap);
			}

			jsc.addClass(THIS.targetElement, jsc.pub.activeClassName);
		}


		function redrawPad () {
			// redraw the pad pointer
			var yChannel = jsc.getPadYChannel(THIS);
			var x = Math.round((THIS.channels.h / 360) * (THIS.width - 1));
			var y = Math.round((1 - THIS.channels[yChannel] / 100) * (THIS.height - 1));
			var crossOuterSize = (2 * THIS.pointerBorderWidth + THIS.pointerThickness + 2 * THIS.crossSize);
			var ofs = -Math.floor(crossOuterSize / 2);
			jsc.picker.cross.style.left = (x + ofs) + 'px';
			jsc.picker.cross.style.top = (y + ofs) + 'px';

			// redraw the slider
			switch (jsc.getSliderChannel(THIS)) {
			case 's':
				var rgb1 = jsc.HSV_RGB(THIS.channels.h, 100, THIS.channels.v);
				var rgb2 = jsc.HSV_RGB(THIS.channels.h, 0, THIS.channels.v);
				var color1 = 'rgb(' +
					Math.round(rgb1[0]) + ',' +
					Math.round(rgb1[1]) + ',' +
					Math.round(rgb1[2]) + ')';
				var color2 = 'rgb(' +
					Math.round(rgb2[0]) + ',' +
					Math.round(rgb2[1]) + ',' +
					Math.round(rgb2[2]) + ')';
				jsc.picker.sldGrad.draw(THIS.sliderSize, THIS.height, color1, color2);
				break;
			case 'v':
				var rgb = jsc.HSV_RGB(THIS.channels.h, THIS.channels.s, 100);
				var color1 = 'rgb(' +
					Math.round(rgb[0]) + ',' +
					Math.round(rgb[1]) + ',' +
					Math.round(rgb[2]) + ')';
				var color2 = '#000';
				jsc.picker.sldGrad.draw(THIS.sliderSize, THIS.height, color1, color2);
				break;
			}

			// redraw the alpha slider
			jsc.picker.asldGrad.draw(THIS.sliderSize, THIS.height, THIS.toHEXString());
		}


		function redrawSld () {
			var sldChannel = jsc.getSliderChannel(THIS);
			if (sldChannel) {
				// redraw the slider pointer
				var y = Math.round((1 - THIS.channels[sldChannel] / 100) * (THIS.height - 1));
				jsc.picker.sldPtrOB.style.top = (y - (2 * THIS.pointerBorderWidth + THIS.pointerThickness) - Math.floor(jsc.pub.sliderInnerSpace / 2)) + 'px';
			}

			// redraw the alpha slider
			jsc.picker.asldGrad.draw(THIS.sliderSize, THIS.height, THIS.toHEXString());
		}


		function redrawASld () {
			var y = Math.round((1 - THIS.channels.a) * (THIS.height - 1));
			jsc.picker.asldPtrOB.style.top = (y - (2 * THIS.pointerBorderWidth + THIS.pointerThickness) - Math.floor(jsc.pub.sliderInnerSpace / 2)) + 'px';
		}


		function isPickerOwner () {
			return jsc.picker && jsc.picker.owner === THIS;
		}


		function onValueKeyDown (ev) {
			if (jsc.eventKey(ev) === 'Enter') {
				if (THIS.valueElement) {
					THIS.processValueInput(THIS.valueElement.value);
				}
				THIS.tryHide();
			}
		}


		function onAlphaKeyDown (ev) {
			if (jsc.eventKey(ev) === 'Enter') {
				if (THIS.alphaElement) {
					THIS.processAlphaInput(THIS.alphaElement.value);
				}
				THIS.tryHide();
			}
		}


		function onValueChange (ev) {
			if (jsc.getData(ev, 'internal')) {
				return; // skip if the event was internally triggered by jscolor
			}

			var oldVal = THIS.valueElement.value;

			THIS.processValueInput(THIS.valueElement.value); // this might change the value

			jsc.triggerCallback(THIS, 'onChange');

			if (THIS.valueElement.value !== oldVal) {
				// value was additionally changed -> let's trigger the change event again, even though it was natively dispatched
				jsc.triggerInputEvent(THIS.valueElement, 'change', true, true);
			}
		}


		function onAlphaChange (ev) {
			if (jsc.getData(ev, 'internal')) {
				return; // skip if the event was internally triggered by jscolor
			}

			var oldVal = THIS.alphaElement.value;

			THIS.processAlphaInput(THIS.alphaElement.value); // this might change the value

			jsc.triggerCallback(THIS, 'onChange');

			// triggering valueElement's onChange (because changing alpha changes the entire color, e.g. with rgba format)
			jsc.triggerInputEvent(THIS.valueElement, 'change', true, true);

			if (THIS.alphaElement.value !== oldVal) {
				// value was additionally changed -> let's trigger the change event again, even though it was natively dispatched
				jsc.triggerInputEvent(THIS.alphaElement, 'change', true, true);
			}
		}


		function onValueInput (ev) {
			if (jsc.getData(ev, 'internal')) {
				return; // skip if the event was internally triggered by jscolor
			}

			if (THIS.valueElement) {
				THIS.fromString(THIS.valueElement.value, jsc.flags.leaveValue);
			}

			jsc.triggerCallback(THIS, 'onInput');

			// triggering valueElement's onInput
			// (not needed, it was dispatched normally by the browser)
		}


		function onAlphaInput (ev) {
			if (jsc.getData(ev, 'internal')) {
				return; // skip if the event was internally triggered by jscolor
			}

			if (THIS.alphaElement) {
				THIS.fromHSVA(null, null, null, parseFloat(THIS.alphaElement.value), jsc.flags.leaveAlpha);
			}

			jsc.triggerCallback(THIS, 'onInput');

			// triggering valueElement's onInput (because changing alpha changes the entire color, e.g. with rgba format)
			jsc.triggerInputEvent(THIS.valueElement, 'input', true, true);
		}


		// let's process the DEPRECATED 'options' property (this will be later removed)
		if (jsc.pub.options) {
			// let's set custom default options, if specified
			for (var opt in jsc.pub.options) {
				if (jsc.pub.options.hasOwnProperty(opt)) {
					try {
						setOption(opt, jsc.pub.options[opt]);
					} catch (e) {
						console.warn(e);
					}
				}
			}
		}


		// let's apply configuration presets
		//
		var presetsArr = [];

		if (opts.preset) {
			if (typeof opts.preset === 'string') {
				presetsArr = opts.preset.split(/\s+/);
			} else if (Array.isArray(opts.preset)) {
				presetsArr = opts.preset.slice(); // slice() to clone
			} else {
				console.warn('Unrecognized preset value');
			}
		}

		// always use the 'default' preset. If it's not listed, append it to the end.
		if (presetsArr.indexOf('default') === -1) {
			presetsArr.push('default');
		}

		// let's apply the presets in reverse order, so that should there be any overlapping options,
		// the formerly listed preset will override the latter
		for (var i = presetsArr.length - 1; i >= 0; i -= 1) {
			var pres = presetsArr[i];
			if (!pres) {
				continue; // preset is empty string
			}
			if (!jsc.pub.presets.hasOwnProperty(pres)) {
				console.warn('Unknown preset: %s', pres);
				continue;
			}
			for (var opt in jsc.pub.presets[pres]) {
				if (jsc.pub.presets[pres].hasOwnProperty(opt)) {
					try {
						setOption(opt, jsc.pub.presets[pres][opt]);
					} catch (e) {
						console.warn(e);
					}
				}
			}
		}


		// let's set specific options for this color picker
		var nonProperties = [
			// these options won't be set as instance properties
			'preset',
		];
		for (var opt in opts) {
			if (opts.hasOwnProperty(opt)) {
				if (nonProperties.indexOf(opt) === -1) {
					try {
						setOption(opt, opts[opt]);
					} catch (e) {
						console.warn(e);
					}
				}
			}
		}


		//
		// Install the color picker on chosen element(s)
		//


		// Determine picker's container element
		if (this.container === undefined) {
			this.container = window.document.body; // default container is BODY element

		} else { // explicitly set to custom element
			this.container = jsc.node(this.container);
		}

		if (!this.container) {
			throw new Error('Cannot instantiate color picker without a container element');
		}


		// Fetch the target element
		this.targetElement = jsc.node(targetElement);

		if (!this.targetElement) {
			// temporarily customized error message to help with migrating from versions prior to 2.2
			if (typeof targetElement === 'string' && /^[a-zA-Z][\w:.-]*$/.test(targetElement)) {
				// targetElement looks like valid ID
				var possiblyId = targetElement;
				throw new Error('If \'' + possiblyId + '\' is supposed to be an ID, please use \'#' + possiblyId + '\' or any valid CSS selector.');
			}

			throw new Error('Cannot instantiate color picker without a target element');
		}

		if (this.targetElement.jscolor && this.targetElement.jscolor instanceof jsc.pub) {
			throw new Error('Color picker already installed on this element');
		}


		// link this instance with the target element
		this.targetElement.jscolor = this;
		jsc.addClass(this.targetElement, jsc.pub.className);

		// register this instance
		jsc.instances.push(this);


		// if target is BUTTON
		if (jsc.isButton(this.targetElement)) {

			if (this.targetElement.type.toLowerCase() !== 'button') {
				// on buttons, always force type to be 'button', e.g. in situations the target <button> has no type
				// and thus defaults to 'submit' and would submit the form when clicked
				this.targetElement.type = 'button';
			}

			if (jsc.isButtonEmpty(this.targetElement)) { // empty button
				// it is important to clear element's contents first.
				// if we're re-instantiating color pickers on DOM that has been modified by changing page's innerHTML,
				// we would keep adding more non-breaking spaces to element's content (because element's contents survive
				// innerHTML changes, but picker instances don't)
				jsc.removeChildren(this.targetElement);

				// let's insert a non-breaking space
				this.targetElement.appendChild(window.document.createTextNode('\xa0'));

				// set min-width = previewSize, if not already greater
				var compStyle = jsc.getCompStyle(this.targetElement);
				var currMinWidth = parseFloat(compStyle['min-width']) || 0;
				if (currMinWidth < this.previewSize) {
					jsc.setStyle(this.targetElement, {
						'min-width': this.previewSize + 'px',
					}, this.forceStyle);
				}
			}
		}

		// Determine the value element
		if (this.valueElement === undefined) {
			if (jsc.isTextInput(this.targetElement)) {
				// for text inputs, default valueElement is targetElement
				this.valueElement = this.targetElement;
			} else {
				// leave it undefined
			}

		} else if (this.valueElement === null) { // explicitly set to null
			// leave it null

		} else { // explicitly set to custom element
			this.valueElement = jsc.node(this.valueElement);
		}

		// Determine the alpha element
		if (this.alphaElement) {
			this.alphaElement = jsc.node(this.alphaElement);
		}

		// Determine the preview element
		if (this.previewElement === undefined) {
			this.previewElement = this.targetElement; // default previewElement is targetElement

		} else if (this.previewElement === null) { // explicitly set to null
			// leave it null

		} else { // explicitly set to custom element
			this.previewElement = jsc.node(this.previewElement);
		}

		// valueElement
		if (this.valueElement && jsc.isTextInput(this.valueElement)) {

			// If the value element has onInput event already set, we need to detach it and attach AFTER our listener.
			// otherwise the picker instance would still contain the old color when accessed from the onInput handler.
			var valueElementOrigEvents = {
				onInput: this.valueElement.oninput
			};
			this.valueElement.oninput = null;

			this.valueElement.addEventListener('keydown', onValueKeyDown, false);
			this.valueElement.addEventListener('change', onValueChange, false);
			this.valueElement.addEventListener('input', onValueInput, false);
			// the original event listener must be attached AFTER our handler (to let it first set picker's color)
			if (valueElementOrigEvents.onInput) {
				this.valueElement.addEventListener('input', valueElementOrigEvents.onInput, false);
			}

			this.valueElement.setAttribute('autocomplete', 'off');
			this.valueElement.setAttribute('autocorrect', 'off');
			this.valueElement.setAttribute('autocapitalize', 'off');
			this.valueElement.setAttribute('spellcheck', false);
		}

		// alphaElement
		if (this.alphaElement && jsc.isTextInput(this.alphaElement)) {
			this.alphaElement.addEventListener('keydown', onAlphaKeyDown, false);
			this.alphaElement.addEventListener('change', onAlphaChange, false);
			this.alphaElement.addEventListener('input', onAlphaInput, false);

			this.alphaElement.setAttribute('autocomplete', 'off');
			this.alphaElement.setAttribute('autocorrect', 'off');
			this.alphaElement.setAttribute('autocapitalize', 'off');
			this.alphaElement.setAttribute('spellcheck', false);
		}

		// determine initial color value
		//
		var initValue = 'FFFFFF';

		if (this.value !== undefined) {
			initValue = this.value; // get initial color from the 'value' property
		} else if (this.valueElement && this.valueElement.value !== undefined) {
			initValue = this.valueElement.value; // get initial color from valueElement's value
		}

		// determine initial alpha value
		//
		var initAlpha = undefined;

		if (this.alpha !== undefined) {
			initAlpha = (''+this.alpha); // get initial alpha value from the 'alpha' property
		} else if (this.alphaElement && this.alphaElement.value !== undefined) {
			initAlpha = this.alphaElement.value; // get initial color from alphaElement's value
		}

		// determine current format based on the initial color value
		//
		this._currentFormat = null;

		if (['auto', 'any'].indexOf(this.format.toLowerCase()) > -1) {
			// format is 'auto' or 'any' -> let's auto-detect current format
			var color = jsc.parseColorString(initValue);
			this._currentFormat = color ? color.format : 'hex';
		} else {
			// format is specified
			this._currentFormat = this.format.toLowerCase();
		}


		// let's parse the initial color value and expose color's preview
		this.processValueInput(initValue);

		// let's also parse and expose the initial alpha value, if any
		//
		// Note: If the initial color value contains alpha value in it (e.g. in rgba format),
		// this will overwrite it. So we should only process alpha input if there was any initial
		// alpha explicitly set, otherwise we could needlessly lose initial value's alpha
		if (initAlpha !== undefined) {
			this.processAlphaInput(initAlpha);
		}

	}

};


//================================
// Public properties and methods
//================================

//
// These will be publicly available via jscolor.<name> and JSColor.<name>
//


// class that will be set to elements having jscolor installed on them
jsc.pub.className = 'jscolor';


// class that will be set to elements having jscolor active on them
jsc.pub.activeClassName = 'jscolor-active';


// whether to try to parse the options string by evaluating it using 'new Function()'
// in case it could not be parsed with JSON.parse()
jsc.pub.looseJSON = true;


// presets
jsc.pub.presets = {};

// built-in presets
jsc.pub.presets['default'] = {}; // baseline for customization

jsc.pub.presets['light'] = { // default color scheme
	backgroundColor: 'rgba(255,255,255,1)',
	controlBorderColor: 'rgba(187,187,187,1)',
	buttonColor: 'rgba(0,0,0,1)',
};
jsc.pub.presets['dark'] = {
	backgroundColor: 'rgba(51,51,51,1)',
	controlBorderColor: 'rgba(153,153,153,1)',
	buttonColor: 'rgba(240,240,240,1)',
};

jsc.pub.presets['small'] = { width:101, height:101, padding:10, sliderSize:14, paletteCols:8 };
jsc.pub.presets['medium'] = { width:181, height:101, padding:12, sliderSize:16, paletteCols:10 }; // default size
jsc.pub.presets['large'] = { width:271, height:151, padding:12, sliderSize:24, paletteCols:15 };

jsc.pub.presets['thin'] = { borderWidth:1, controlBorderWidth:1, pointerBorderWidth:1 }; // default thickness
jsc.pub.presets['thick'] = { borderWidth:2, controlBorderWidth:2, pointerBorderWidth:2 };


// size of space in the sliders
jsc.pub.sliderInnerSpace = 3; // px

// transparency chessboard
jsc.pub.chessboardSize = 8; // px
jsc.pub.chessboardColor1 = '#666666';
jsc.pub.chessboardColor2 = '#999999';

// preview separator
jsc.pub.previewSeparator = ['rgba(255,255,255,.65)', 'rgba(128,128,128,.65)'];


// Initializes jscolor
jsc.pub.init = function () {
	if (jsc.initialized) {
		return;
	}

	// attach some necessary handlers
	window.document.addEventListener('mousedown', jsc.onDocumentMouseDown, false);
	window.document.addEventListener('keyup', jsc.onDocumentKeyUp, false);
	window.addEventListener('resize', jsc.onWindowResize, false);
	window.addEventListener('scroll', jsc.onWindowScroll, false);

	// install jscolor on current DOM
	jsc.pub.install();

	jsc.initialized = true;

	// call functions waiting in the queue
	while (jsc.readyQueue.length) {
		var func = jsc.readyQueue.shift();
		func();
	}
};


// Installs jscolor on current DOM tree
jsc.pub.install = function (rootNode) {
	var success = true;

	try {
		jsc.installBySelector('[data-jscolor]', rootNode);
	} catch (e) {
		success = false;
		console.warn(e);
	}

	// for backward compatibility with DEPRECATED installation using class name
	if (jsc.pub.lookupClass) {
		try {
			jsc.installBySelector(
				(
					'input.' + jsc.pub.lookupClass + ', ' +
					'button.' + jsc.pub.lookupClass
				),
				rootNode
			);
		} catch (e) {}
	}

	return success;
};


// Registers function to be called as soon as jscolor is initialized (or immediately, if it already is).
//
jsc.pub.ready = function (func) {
	if (typeof func !== 'function') {
		console.warn('Passed value is not a function');
		return false;
	}

	if (jsc.initialized) {
		func();
	} else {
		jsc.readyQueue.push(func);
	}
	return true;
};


// Triggers given input event(s) (e.g. 'input' or 'change') on all color pickers.
//
// It is possible to specify multiple events separated with a space.
// If called before jscolor is initialized, then the events will be triggered after initialization.
//
jsc.pub.trigger = function (eventNames) {
	var triggerNow = function () {
		jsc.triggerGlobal(eventNames);
	};

	if (jsc.initialized) {
		triggerNow();
	} else {
		jsc.pub.ready(triggerNow);
	}
};


// Hides current color picker box
jsc.pub.hide = function () {
	if (jsc.picker && jsc.picker.owner) {
		jsc.picker.owner.hide();
	}
};


// Returns a data URL of a gray chessboard image that indicates transparency
jsc.pub.chessboard = function (color) {
	if (!color) {
		color = 'rgba(0,0,0,0)';
	}
	var preview = jsc.genColorPreviewCanvas(color);
	return preview.canvas.toDataURL();
};


// Returns a data URL of a gray chessboard image that indicates transparency
jsc.pub.background = function (color) {
	var backgrounds = [];

	// CSS gradient for background color preview
	backgrounds.push(jsc.genColorPreviewGradient(color));

	// data URL of generated PNG image with a gray transparency chessboard
	var preview = jsc.genColorPreviewCanvas();
	backgrounds.push([
		'url(\'' + preview.canvas.toDataURL() + '\')',
		'left top',
		'repeat',
	].join(' '));

	return backgrounds.join(', ');
};


//
// DEPRECATED properties and methods
//


// DEPRECATED. Use jscolor.presets.default instead.
//
// Custom default options for all color pickers, e.g. { hash: true, width: 300 }
jsc.pub.options = {};


// DEPRECATED. Use data-jscolor attribute instead, which installs jscolor on given element.
//
// By default, we'll search for all elements with class="jscolor" and install a color picker on them.
//
// You can change what class name will be looked for by setting the property jscolor.lookupClass
// anywhere in your HTML document. To completely disable the automatic lookup, set it to null.
//
jsc.pub.lookupClass = 'jscolor';


// DEPRECATED. Use data-jscolor attribute instead, which installs jscolor on given element.
//
// Install jscolor on all elements that have the specified class name
jsc.pub.installByClassName = function () {
	console.error('jscolor.installByClassName() is DEPRECATED. Use data-jscolor="" attribute instead of a class name.' + jsc.docsRef);
	return false;
};


jsc.register();


return jsc.pub;


})(); // END jscolor


if (typeof window.jscolor === 'undefined') {
	window.jscolor = window.JSColor = jscolor;
}


// END jscolor code

return jscolor;

}); // END factory


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";

;// CONCATENATED MODULE: ./node_modules/@cookiemonsterteam/cookiemonsterframework/src/frameworkDataObject/draw/drawLoop.js
/**
 * Main draw loop
 */
function drawLoop() {}

;// CONCATENATED MODULE: ./node_modules/@cookiemonsterteam/cookiemonsterframework/src/frameworkDataObject/data/modInfo.js
/**
 * Short description of the mod
 */
const modDescription = `<a href="https://github.com/CookieMonsterTeam" target="blank">Cookie Monster Team</a>
offers a suite of tools to enhance your game experience.</br>
Originally known from our work on the Cookie Monster add-on we are now expanding and working on new tools within the Cookie Monster Mod Family.</br>
Keep an eye on our GitHub to see future work or use it to report bugs or feature requests!</br>
`;

/* harmony default export */ const modInfo = (modDescription);

;// CONCATENATED MODULE: ./node_modules/@cookiemonsterteam/cookiemonsterframework/src/saveDataFunctions/saveFramework.js
/**
 * This function saves the settings and headers within the Framework without saving any of the other save-data
 * This allows saving in between the autosave intervals
 */
function saveFramework() {
  Object.keys(Game.mods.cookieMonsterFramework.saveData).forEach((modName) => {
    const modSaveString = JSON.stringify(Game.mods.cookieMonsterFramework.saveData[modName]);

    const cookieClickerSaveString = b64_to_utf8(
      unescape(localStorage.getItem('CookieClickerGame')).split('!END!')[0],
    );
    const pattern = new RegExp(`${modName}.*(;|$)`);
    const modSave = cookieClickerSaveString.match(pattern);
    if (modSave !== null) {
      const newSaveString = cookieClickerSaveString.replace(
        modSave[0],
        `${modName}:${modSaveString}`,
      );
      localStorage.setItem('CookieClickerGame', escape(`${utf8_to_b64(newSaveString)}!END!`));
    }
  });
}

;// CONCATENATED MODULE: ./node_modules/@cookiemonsterteam/cookiemonsterframework/src/menuFunctions/toggleHeader.js


/**
 * This function toggles header options by incrementing them with 1 and handling changes
 * It is called by the onclick event of the +/- next to headers
 * @param 	{string}	config	The name of the header
 */
function toggleHeader(modName, headerName) {
  if (
    typeof Game.mods.cookieMonsterFramework.saveData[modName].headers[headerName] === 'undefined'
  ) {
    Game.mods.cookieMonsterFramework.saveData[modName].headers[headerName] = 1;
  }
  switch (Game.mods.cookieMonsterFramework.saveData[modName].headers[headerName]) {
    case 0:
      Game.mods.cookieMonsterFramework.saveData[modName].headers[headerName] = 1;
      break;
    default:
      Game.mods.cookieMonsterFramework.saveData[modName].headers[headerName] = 0;
      break;
  }
  saveFramework();
}

;// CONCATENATED MODULE: ./node_modules/@cookiemonsterteam/cookiemonsterframework/src/frameworkDataObject/menuSections/info/createFrameworkInfoMenuSection.js


/**
 * Add things to the Info menu
 * @returns {object}  frameworkInfoDiv  Subsection to which other mods can add their info sections
 */
function createFrameworkInfoMenuSection() {
  const frameworkInfoDiv = document.createElement('div');
  frameworkInfoDiv.className = 'subsection';
  frameworkInfoDiv.id = 'cookieMonsterFrameworkMenuSection';

  const titleDiv = document.createElement('div');
  titleDiv.className = 'title';
  titleDiv.innerHTML = 'Cookie Monster Mod Family';

  const buttonSpan = document.createElement('span');
  buttonSpan.style.cursor = 'pointer';
  buttonSpan.style.display = 'inline-block';
  buttonSpan.style.height = '14px';
  buttonSpan.style.width = '14px';
  buttonSpan.style.borderRadius = '7px';
  buttonSpan.style.textAlign = 'center';
  buttonSpan.style.backgroundColor = '#C0C0C0';
  buttonSpan.style.color = 'black';
  buttonSpan.style.fontSize = '13px';
  buttonSpan.style.verticalAlign = 'middle';
  buttonSpan.textContent = Game.mods.cookieMonsterFramework.saveData.cookieMonsterFramework.headers
    .infoMenu
    ? '-'
    : '+';
  buttonSpan.onclick = function () {
    toggleHeader('cookieMonsterFramework', 'infoMenu');
    Game.UpdateMenu();
  };
  titleDiv.appendChild(buttonSpan);

  frameworkInfoDiv.appendChild(titleDiv);

  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterFramework.headers.infoMenu) {
    const descriptionDiv = document.createElement('div');
    descriptionDiv.className = 'listing';
    descriptionDiv.innerHTML = modInfo;
    frameworkInfoDiv.appendChild(descriptionDiv);
  }

  return frameworkInfoDiv;
}

;// CONCATENATED MODULE: ./node_modules/@cookiemonsterteam/cookiemonsterframework/src/frameworkDataObject/menuSections/info/addInfoMenuSection.js

/**
 * Add things to the Info menu
 * The listeners.infoMenu objects contains functions which create <div>'s to add to the menu section
 */
function addInfoMenuSection() {
  const menu = l('menu').children[1];
  menu.insertBefore(createFrameworkInfoMenuSection(), menu.children[1]);

  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterFramework.headers.infoMenu) {
    const listeners = Game.mods.cookieMonsterFramework.listeners.infoMenu;
    for (let i = 0; i < listeners.length; i++) {
      l('cookieMonsterFrameworkMenuSection').appendChild(listeners[i]());
    }
  }
}

;// CONCATENATED MODULE: ./node_modules/@cookiemonsterteam/cookiemonsterframework/src/frameworkDataObject/menuSections/options/addOptionsMenuSection.js


/**
 * Add things to the Options menu
 */
function addOptionsMenuSection() {
  const modOptionsDiv = document.createElement('div');
  modOptionsDiv.className = 'subsection';
  modOptionsDiv.id = 'cookieMonsterOptionsDiv';

  const titleDiv = document.createElement('div');
  titleDiv.className = 'title';
  titleDiv.innerHTML = 'Cookie Monster Mod Family';

  const buttonSpan = document.createElement('span');
  buttonSpan.style.cursor = 'pointer';
  buttonSpan.style.display = 'inline-block';
  buttonSpan.style.height = '14px';
  buttonSpan.style.width = '14px';
  buttonSpan.style.borderRadius = '7px';
  buttonSpan.style.textAlign = 'center';
  buttonSpan.style.backgroundColor = '#C0C0C0';
  buttonSpan.style.color = 'black';
  buttonSpan.style.fontSize = '13px';
  buttonSpan.style.verticalAlign = 'middle';
  buttonSpan.textContent = Game.mods.cookieMonsterFramework.saveData.cookieMonsterFramework.headers
    .optionsMenu
    ? '-'
    : '+';
  buttonSpan.onclick = function () {
    toggleHeader('cookieMonsterFramework', 'optionsMenu');
    Game.UpdateMenu();
  };
  titleDiv.appendChild(buttonSpan);

  modOptionsDiv.appendChild(titleDiv);

  const subMenuLength = l('menu').children[2].children.length - 1;
  l('menu').children[2].insertBefore(modOptionsDiv, l('menu').children[2].children[subMenuLength]);
}

;// CONCATENATED MODULE: ./node_modules/@cookiemonsterteam/cookiemonsterframework/src/frameworkDataObject/menuSections/addMenu.js



/**
 * Call the function to add a Menu based on the current menu
 * @param {MutationObserver}  The observer object that is listening to DOM-changes of id='menu'
 */
function addMenu(_, observer) {
  // Disconnect observer to avoid infinite loop
  observer.disconnect();

  if (Game.onMenu === 'log') {
    addInfoMenuSection();
  } else if (Game.onMenu === 'prefs') {
    addOptionsMenuSection();
  }

  // Reconnect observer to monitor changes
  observer.observe(document.getElementById('menu'), {
    attributes: true,
    childList: true,
    subtree: true,
  });
}

;// CONCATENATED MODULE: ./node_modules/@cookiemonsterteam/cookiemonsterframework/src/frameworkDataObject/init.js



/**
 * This creates a init function for the CM object. Per Game code/comments:
 * "this function is called as soon as the mod is registered
 * declare hooks here"
 * It starts the further initialization of CookieMonster and registers hooks
 */
function init() {
  // Create Data object in global scope
  window.cookieMonsterFrameworkData = {};

  // Create MutationObserver for menu sections
  const observer = new MutationObserver(addMenu);
  observer.observe(document.getElementById('menu'), {
    attributes: true,
    childList: true,
    subtree: true,
  });

  // Register hooks
  Game.registerHook('draw', drawLoop);
}

;// CONCATENATED MODULE: ./node_modules/@cookiemonsterteam/cookiemonsterframework/src/saveDataFunctions/createSaveDataObject.js
/**
 * Creates the save data object to be stored
 * @param   {object}    saveData      The loaded save data
 * @param   {object}    settingsData  The data containing default values of settings
 * @param   {object}    headersData   The data containing default values of headers
 */
function createSaveDataObject(saveData, settingsData, headersData) {
  const modSaveData = {};

  const settingsObject = {};
  Object.keys(settingsData).forEach((i) => {
    if (typeof saveData.settings === 'undefined' || typeof saveData.settings[i] === 'undefined') {
      settingsObject[i] = settingsData[i].defaultValue; // eslint-disable-line prefer-destructuring
    } else {
      settingsObject[i] = saveData.settings[i];
    }
  });
  modSaveData.settings = settingsObject;

  const headersObject = {};
  Object.keys(headersData).forEach((i) => {
    if (typeof saveData.headers === 'undefined' || typeof saveData.headers[i] === 'undefined') {
      headersObject[i] = headersData[i];
    } else {
      headersObject[i] = saveData.headers[i];
    }
  });
  modSaveData.headers = headersObject;

  Object.keys(saveData).forEach((key) => {
    if (key !== 'settings' && key !== 'headers') {
      modSaveData[key] = saveData[key];
    }
  });
  return modSaveData;
}

;// CONCATENATED MODULE: ./node_modules/@cookiemonsterteam/cookiemonsterframework/src/saveDataFunctions/loadMod.js



/**
 * Load the data from a save-file into a mod
 * @param   {string}    modName       The name of the mode to be saved
 * @param   {string}    saveData      JSON-string of the save data
 * @param   {object}    settingsData  The data containing default values of settings
 * @param   {object}    headersData   The data containing default values of headers
 * @param   {Function}  logicLoop     The logic-loop of the mod
 */
function loadMod(modName, saveData, settingsData, headersData, logicLoop) {
  const saveDataObject = JSON.parse(saveData);
  Game.mods.cookieMonsterFramework.saveData[modName] = createSaveDataObject(
    saveDataObject,
    settingsData,
    headersData,
  );
  saveFramework();
  logicLoop();
  Object.keys(Game.mods.cookieMonsterFramework.saveData[modName].settings).forEach((i) => {
    if (typeof settingsData[i].func !== 'undefined') {
      settingsData[i].func();
    }
  });
  Game.UpdateMenu();
}

;// CONCATENATED MODULE: ./node_modules/@cookiemonsterteam/cookiemonsterframework/src/frameworkDataObject/data/headers.js
/** This includes all headers of the Cookie Monster Framework and their relevant data */
const headers = { infoMenu: 1, optionsMenu: 1 };
/* harmony default export */ const data_headers = (headers);

;// CONCATENATED MODULE: ./node_modules/@cookiemonsterteam/cookiemonsterframework/src/frameworkDataObject/data/settings.js
/** This includes all options of the Cookie Monster Framework and their relevant data */
const settings = {};
/* harmony default export */ const data_settings = (settings);

;// CONCATENATED MODULE: ./node_modules/@cookiemonsterteam/cookiemonsterframework/src/frameworkDataObject/logic/logicLoop.js
/**
 * Main logic loop
 */
function logicLoop() {}

;// CONCATENATED MODULE: ./node_modules/@cookiemonsterteam/cookiemonsterframework/src/frameworkDataObject/load.js





/**
 * This creates a load function to the CM object. Per Game code/comments:
 * "do stuff with the string data you saved previously"
 * @param   {string}    JSON string of save-data
 */
function load(str) {
  loadMod('cookieMonsterFramework', str, data_settings, data_headers, logicLoop);
}

;// CONCATENATED MODULE: ./node_modules/@cookiemonsterteam/cookiemonsterframework/src/frameworkDataObject/save.js
/**
 * This creates a save function to the CM object. Per Game code/comments:
 * "use this to store persistent data associated with your mod
 * return 'a string to be saved';"
 * @returns {string}    The data to be saved
 */
function save() {
  return JSON.stringify(Game.mods.cookieMonsterFramework.saveData.cookieMonsterFramework);
}

;// CONCATENATED MODULE: ./node_modules/@cookiemonsterteam/cookiemonsterframework/src/frameworkDataObject/cookieMonsterFramework.js




/** The mod object to be registered with the Modding API */
const cookieMonsterFramework = {
  init: init,
  load: load,
  save: save,
  listeners: {
    infoMenu: [],
  },
  saveData: { cookieMonsterFramework: { headers: {}, settings: {} } },
};

/* harmony default export */ const frameworkDataObject_cookieMonsterFramework = (cookieMonsterFramework);

;// CONCATENATED MODULE: ./node_modules/@cookiemonsterteam/cookiemonsterframework/src/initFunctions/initModFramework.js


/** Check if Cookie Monster Mod Framework has been loaded yet and if not, does so */
function initModFramework() {
  if (typeof cookieMonsterFrameworkData === 'undefined') {
    Game.registerMod('cookieMonsterFramework', frameworkDataObject_cookieMonsterFramework);
  }
}

;// CONCATENATED MODULE: ./node_modules/@cookiemonsterteam/cookiemonsterframework/src/initFunctions/registerMod.js
/**
 * Adds the mod to the saveData object to store Settings and Headers
 */
function registerMod(modName) {
  Game.mods.cookieMonsterFramework.saveData[modName] = { settings: {}, headers: {} };
}

;// CONCATENATED MODULE: ./node_modules/@cookiemonsterteam/cookiemonsterframework/src/menuFunctions/createInfoListing.js
/**
 * Returns a subsection for the mod to add listings/info to
 * @param   {string}  listingHTML   The innerHTML of the listing
 * @returns {object}  listingDiv    Div of the subseciont
 */
function createInfoListing(listingHTML) {
  const listingDiv = document.createElement('div');
  listingDiv.className = 'listing';
  listingDiv.innerHTML = listingHTML;
  return listingDiv;
}

;// CONCATENATED MODULE: ./node_modules/@cookiemonsterteam/cookiemonsterframework/src/menuFunctions/createModMenuSection.js


/**
 * Returns a subsection for the mod to add listings/info to
 * @param   {string}  modName         The name of the mod (i.e., CookieMonster)
 * @param   {string}  modDisplayName  Display name of the mod (i.e., Cookie Monster)
 * @param   {string}  menuName        Name of the menu (i.e., Info, Options)
 * @returns {object}  modSectionDiv   Div of the subseciont
 */
function createModMenuSection(modName, modDisplayName, menuName) {
  const modSectionDiv = document.createElement('div');
  modSectionDiv.className = 'subsection';
  modSectionDiv.id = `${modName}MenuSection`;

  const titleDiv = document.createElement('div');
  titleDiv.className = 'title';
  titleDiv.style.fontSize = '18px';
  titleDiv.innerHTML = modDisplayName;

  const buttonSpan = document.createElement('span'); // Creates the +/- button
  buttonSpan.style.cursor = 'pointer';
  buttonSpan.style.display = 'inline-block';
  buttonSpan.style.height = '14px';
  buttonSpan.style.width = '14px';
  buttonSpan.style.borderRadius = '7px';
  buttonSpan.style.textAlign = 'center';
  buttonSpan.style.backgroundColor = '#C0C0C0';
  buttonSpan.style.color = 'black';
  buttonSpan.style.fontSize = '13px';
  buttonSpan.style.verticalAlign = 'middle';
  buttonSpan.textContent = Game.mods.cookieMonsterFramework.saveData[modName].headers[menuName]
    ? '-'
    : '+';
  buttonSpan.onclick = function () {
    toggleHeader(modName, menuName);
    Game.UpdateMenu();
  };

  titleDiv.appendChild(buttonSpan);

  modSectionDiv.appendChild(titleDiv);

  return modSectionDiv;
}

;// CONCATENATED MODULE: ./node_modules/@cookiemonsterteam/cookiemonsterframework/src/index.js








const initFunctions = {
  initModFramework: initModFramework,
  registerMod: registerMod,
};
const menuFunctions = {
  createInfoListing: createInfoListing,
  createModMenuSection: createModMenuSection,
  toggleHeader: toggleHeader,
};
const optionFunctions = {};

const saveFunctions = {
  loadMod: loadMod,
  saveFramework: saveFramework,
};

;// CONCATENATED MODULE: ./src/Data/Moddata.ts
/** Data related directly to Cookie Monster */
const VersionMajor = '2.031';
const VersionMinor = '9';
/** Information about Cookie Monster to be displayed in the info section */
const ModDescription = `<a href="https://github.com/CookieMonsterTeam/CookieMonster" target="blank">Cookie Monster</a>
 offers a wide range of tools and statistics to enhance your game experience.
 It is not a cheat interface – although it does offer helpers for golden cookies and such, everything can be toggled off at will to only leave how much information you want.</br>
 Progess on new updates and all previous release notes can be found on the GitHub page linked above!</br>
 Please also report any bugs you may find over there!</br>
 `;
/** Latest releasenotes of Cookie Monster to be displayed in the info section */
const LatestReleaseNotes = `This update implements the following functions:</br>
- HOTFIX: Fixed the possibility of clicking Golden Cookies multiple times with autoclickers</br>
- For developers: we now expose some data calculated by Cookie Monster to the global scope. You can access it through the CookieMonsterData object</br>
- The column with the most optimal building now has a green coloured indicator whenever colour coding is turned on</br>
- The current season in the seasons statistics section is now displayed with green text for easier identification</br>
- New option to show a timer bar that counts down till next autosave</br>
- New option to sort buildings based on the "cost till next achievement"</br>
- Added extra information about achievements in statistics page</br>
</br>
This update fixes the following bugs:</br>
- Fixed a bug where ignoring certain buildings in rare cases did not create a "most optimal building"</br>
- Fixed some issues related to "left till achievement"</br>
- Fixed some cases where upgrades and buildings were not correctly sorted</br>
- Fixed the tooltip of "Pop all normal wrinklers" displaying an incorrect reward when Shiny's are present</br>
`;

;// CONCATENATED MODULE: ./src/Config/Toggles/ToggleWrinklerButtons.js
/**
 * This function updates the display setting of the two objects created by CM.Disp.CreateWrinklerButtons()
 * It is called by changes in CM.Options.WrinklerButtons
 */
function ToggleWrinklerButtons() {
  if (
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.WrinklerButtons &&
    Game.elderWrath
  ) {
    l('PopAllNormalWrinklerButton').style.display = '';
    l('PopFattestWrinklerButton').style.display = '';
  } else {
    l('PopAllNormalWrinklerButton').style.display = 'none';
    l('PopFattestWrinklerButton').style.display = 'none';
  }
}

;// CONCATENATED MODULE: ./src/Data/Scales.ts
/** Data related directly to the scales used by Cookie Monster */
/** Array of abbreviations used in the "Metric" scale */
const metric = ['', '', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
/** Array of abbreviations used in the "Short" scale */
const shortScale = [
    '',
    '',
    'M',
    'B',
    'Tr',
    'Quadr',
    'Quint',
    'Sext',
    'Sept',
    'Oct',
    'Non',
    'Dec',
    'Undec',
    'Duodec',
    'Tredec',
    'Quattuordec',
    'Quindec',
    'Sexdec',
    'Septendec',
    'Octodec',
    'Novemdec',
    'Vigint',
    'Unvigint',
    'Duovigint',
    'Trevigint',
    'Quattuorvigint',
];
/** Array of abbreviations used in the "Abbreviated Short" scale */
const shortScaleAbbreviated = [
    '',
    'K',
    'M',
    'B',
    'T',
    'Qa',
    'Qi',
    'Sx',
    'Sp',
    'Oc',
    'No',
    'De',
    'UDe',
    'DDe',
    'TDe',
    'QaDe',
    'QiDe',
    'SxDe',
    'SpDe',
    'ODe',
    'NDe',
    'Vi',
    'UVi',
    'DVi',
    'TVi',
    'QaVi',
    'QiVi',
    'SxVi',
    'SpVi',
    'OVi',
    'NVi',
    'Tr',
    'UTr',
    'DTr',
    'TTr',
    'QaTr',
    'QiTr',
    'SxTr',
    'SpTr',
    'OTr',
    'NTr',
    'Qaa',
    'UQa',
    'DQa',
    'TQa',
    'QaQa',
    'QiQa',
    'SxQa',
    'SpQa',
    'OQa',
    'NQa',
    'Qia',
    'UQi',
    'DQi',
    'TQi',
    'QaQi',
    'QiQi',
    'SxQi',
    'SpQi',
    'OQi',
    'NQi',
    'Sxa',
    'USx',
    'DSx',
    'TSx',
    'QaSx',
    'QiSx',
    'SxSx',
    'SpSx',
    'OSx',
    'NSx',
    'Spa',
    'USp',
    'DSp',
    'TSp',
    'QaSp',
    'QiSp',
    'SxSp',
    'SpSp',
    'OSp',
    'NSp',
    'Oco',
    'UOc',
    'DOc',
    'TOc',
    'QaOc',
    'QiOc',
    'SxOc',
    'SpOc',
    'OOc',
    'NOc',
    'Noa',
    'UNo',
    'DNo',
    'TNo',
    'QaNo',
    'QiNo',
    'SxNo',
    'SpNo',
    'ONo',
    'NNo',
    'Ct',
    'UCt',
];

;// CONCATENATED MODULE: ./src/Main/VariablesAndData.js
let LastModCount;
let TooltipBuildBackup = []; // eslint-disable-line prefer-const
let TooltipLumpBackup;
let TooltipGrimoireBackup = []; // eslint-disable-line prefer-const
let TooltipUpgradeBackup = []; // eslint-disable-line prefer-const
let BackupGrimoireLaunch;
let BackupGrimoireLaunchMod;
let BackupGrimoireDraw;
let HasReplaceNativeGrimoireLaunch;
let HasReplaceNativeGrimoireDraw;
let LoadMinigames;
let BackupFunctions = {}; // eslint-disable-line prefer-const

let LastSeasonPopupState;
let LastTickerFortuneState;
let LastGardenNextStep;
let LastGoldenCookieState;
let LastSpawnedGoldenCookieState;
let LastMagicBarFull;
let CurrSpawnedGoldenCookieState;
let LastWrinklerCount;

/** Stores the date at Game.CalculateGains for God Cyclius
 */
let CycliusDateAtBeginLoop = Date.now(); // eslint-disable-line prefer-const

/** Stores the date at Game.CalculateGains for the Century egg
 */
let CenturyDateAtBeginLoop = Date.now(); // eslint-disable-line prefer-const

;// CONCATENATED MODULE: ./src/Disp/BeautifyAndFormatting/Beautify.js
/** General functions to format or beautify strings */




/**
 * This function returns formats number based on the Scale setting
 * @param	{number}	num		Number to be beautified
 * @param 	{any}		floats 	Used in some scenario's by CM.Backup.Beautify (Game's original function)
 * @param	{number}	forced	Used to force (type 3) in certains cases
 * @returns	{string}			Formatted number
 */
function Beautify_Beautify(num, floats, forced) {
  const decimals =
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.ScaleDecimals + 1;
  if (num === Infinity) {
    return 'Infinity';
  }
  if (typeof num === 'undefined') {
    return '0';
  }
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.Scale === 0) {
    return BackupFunctions.Beautify(num, floats);
  }
  if (Number.isFinite(num)) {
    if (num < 0) {
      return `-${Beautify_Beautify(Math.abs(num))}`;
    }
    let answer = '';
    if (num === 0) {
      return num.toString();
    }
    if (
      num > 0.001 &&
      num < Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.ScaleCutoff
    ) {
      if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.ScaleSeparator)
        answer = num.toLocaleString('nl');
      else answer = num.toLocaleString('en');
      return answer;
    }
    if (
      (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.Scale === 4 &&
        !forced) ||
      forced === 4
    ) {
      // Scientific notation, 123456789 => 1.235E+8
      answer = num.toExponential(decimals).toString().replace('e', 'E');
    } else {
      const exponential = num.toExponential().toString();
      const AmountOfTenPowerThree = Math.floor(exponential.slice(exponential.indexOf('e') + 1) / 3);
      answer = (num / Number(`1e${AmountOfTenPowerThree * 3}`)).toFixed(decimals);
      // answer is now "xxx.xx" (e.g., 123456789 would be 123.46)
      if (
        (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.Scale === 1 &&
          !forced) ||
        forced === 1
      ) {
        // Metric scale, 123456789 => 123.457 M
        if (num >= 0.01 && num < Number(`1e${metric.length * 3}`)) {
          answer += ` ${metric[AmountOfTenPowerThree]}`;
        } else answer = Beautify_Beautify(num, 0, 4); // If number is too large or little, revert to scientific notation
      } else if (
        (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.Scale === 2 &&
          !forced) ||
        forced === 2
      ) {
        // Short scale, 123456789 => 123.457 M
        if (num >= 0.01 && num < Number(`1e${shortScale.length * 3}`)) {
          answer += ` ${shortScale[AmountOfTenPowerThree]}`;
        } else answer = Beautify_Beautify(num, 0, 4); // If number is too large or little, revert to scientific notation
      } else if (
        (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.Scale === 3 &&
          !forced) ||
        forced === 3
      ) {
        // Short scale, 123456789 => 123.457 M
        if (num >= 0.01 && num < Number(`1e${shortScaleAbbreviated.length * 3}`)) {
          answer += ` ${shortScaleAbbreviated[AmountOfTenPowerThree]}`;
        } else answer = Beautify_Beautify(num, 0, 4); // If number is too large or little, revert to scientific notation
      } else if (
        (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.Scale === 5 &&
          !forced) ||
        forced === 5
      ) {
        // Engineering notation, 123456789 => 123.457E+6
        answer += `E${AmountOfTenPowerThree * 3}`;
      }
    }
    if (answer === '') {
      // eslint-disable-next-line no-console
      console.log(`Could not beautify number with Cookie Monster Beautify: ${num}`);
      answer = BackupFunctions.Beautify(num, floats);
    }
    if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.ScaleSeparator)
      answer = answer.replace('.', ',');
    return answer;
  }
  console.log(`Could not beautify number with Cookie Monster Beautify: ${num}`); // eslint-disable-line no-console
  return BackupFunctions.Beautify(num, floats);
}

;// CONCATENATED MODULE: ./src/Cache/VariablesAndData.js
/* eslint-disable prefer-const */

let CacheDragonAura = 0;
let CacheDragonAura2 = 0;
let CacheLastDragonLevel = 0;
let CacheCostDragonUpgrade = 0;
let CacheLucky = 0;
let CacheLuckyReward = 0;
let CacheLuckyWrathReward = 0;
let CacheLuckyFrenzy = 0;
let CacheLuckyRewardFrenzy = 0;
let CacheLuckyWrathRewardFrenzy = 0;
let CacheConjure = 0;
let CacheConjureReward = 0;
let CacheEdifice = 0;
let CacheEdificeBuilding = 0;
let CacheNoGoldSwitchCookiesPS = 0;
let CacheDragonsFortuneMultAdjustment = 1;
let CacheGoldenCookiesMult = 1;
let CacheWrathCookiesMult = 1;

let CacheHCPerSecond = 0;

let CacheCentEgg = 0;
let CacheSeaSpec = 0;
let CacheLastChoEgg = 0;

let CacheObjects1 = {};
let CacheObjects10 = {};
let CacheObjects100 = {};
let CacheObjectsNextAchievement = {};

let CacheWrinklersTotal = 0;
let CacheWrinklersNormal = 0;
let CacheWrinklersFattest = [0, null];

let CacheCurrWrinklerCPSMult = 0;
let CacheCurrWrinklerCount = 0;

let CacheUpgrades = {};

let CacheAverageClicks = {};
let CacheAverageCookiesFromClicks;

let CacheMissingUpgrades = {};
let CacheMissingUpgradesPrestige = {};
let CacheMissingUpgradesCookies = {};

let CacheChainRequired = 0;
let CacheChainRequiredNext = 0;
let CacheChainMaxReward = [];
let CacheChainWrathRequired = 0;
let CacheChainWrathRequiredNext = 0;
let CacheChainWrathMaxReward = [];
let CacheChainFrenzyRequired = 0;
let CacheChainFrenzyRequiredNext = 0;
let CacheChainFrenzyMaxReward = [];
let CacheChainFrenzyWrathRequired = 0;
let CacheChainFrenzyWrathRequiredNext = 0;
let CacheChainFrenzyWrathMaxReward = [];

let CacheRealCookiesEarned = 0;
let CacheAvgCPSWithChoEgg = 0;

let CacheSpawnedGoldenShimmer = {};
let CacheSeasonPopShimmer = {};

let CacheTimeTillNextPrestige = 0;

/** Stores lowest PP value */
let CacheMinPP = 0;
/** Stores lowest PP value category */
let CacheMinPPBulk = 0;
/** Stores all PP values of all buildings for all buy settings (1, 10, 100) */
let CachePPArray = [];

let CacheGoldenShimmersByID = {};

let CacheSellForChoEgg = 0;

let CookiesDiff;
let WrinkDiff;
let WrinkFattestDiff;
let ChoEggDiff;
let ClicksDiff;
let HeavenlyChipsDiff;

let CacheLastCPSCheck;
let CacheLastCookies;
let CacheLastWrinkCookies;
let CacheLastWrinkFattestCookies;
let CacheLastClicks;

let CacheAverageGainBank;
let CacheAverageGainWrink;
let CacheAverageGainWrinkFattest;
let CacheAverageGainChoEgg;
let CacheAverageCPS;

let CacheLastHeavenlyCheck;
let CacheLastHeavenlyChips;

let CacheDoRemakeBuildPrices;

let CacheHadBuildAura;

/** Store the CPS effect of each god if it was put into each slot */
let CacheGods = {
  0: [0, 0, 0],
  1: [0, 0, 0],
  2: [0, 0, 0],
  3: [0, 0, 0],
  4: [0, 0, 0],
  5: [0, 0, 0],
  6: [0, 0, 0],
  7: [0, 0, 0],
  8: [0, 0, 0],
  9: [0, 0, 0],
  10: [0, 0, 0],
};

;// CONCATENATED MODULE: ./src/Sim/VariablesAndData.js
/** All variables used by simulation functions */

let SimObjects = []; // eslint-disable-line prefer-const
let SimUpgrades = []; // eslint-disable-line prefer-const
let SimAchievements = []; // eslint-disable-line prefer-const
let SimBuildingsOwned;
let SimUpgradesOwned;
let SimPledges;
let SimAchievementsOwned;
let SimHeavenlyPower;
let SimPrestige;
let SimDragonAura;
let SimDragonAura2;
let SimGod1;
let SimGod2;
let SimGod3;
let SimDoSims;
let SimEffs;
let SimCookiesPs;
let SimCookiesPsRaw;

;// CONCATENATED MODULE: ./src/Sim/ReplacedGameFunctions/SimAuraMult.js


/**
 * This functions creates functions similarly to Game.auraMult but checks Sim Data instead of Game Data
 */
function SimAuraMult(what) {
  let n = 0;
  if (
    Game.dragonAuras[SimDragonAura].name === what ||
    Game.dragonAuras[SimDragonAura2].name === what
  )
    n = 1;
  if (
    Game.dragonAuras[SimDragonAura].name === 'Reality Bending' ||
    Game.dragonAuras[SimDragonAura2].name === 'Reality Bending'
  )
    n += 0.1;
  return n;
}

;// CONCATENATED MODULE: ./src/Sim/ReplacedGameFunctions/SimGetSellMultiplier.js


/**
 * This function calculates the sell multiplier based on current "sim data"
 * It is called by CM.Sim.BuildingSell()
 * @returns {number}	giveBack	The multiplier
 */
function SimGetSellMultiplier() {
  let giveBack = 0.25;
  giveBack *= 1 + SimAuraMult('Earth Shatterer');
  return giveBack;
}

;// CONCATENATED MODULE: ./src/Sim/ReplacedGameFunctions/SimEff.js


/**
 * This functions creates functions similarly to Game.Eff but checks Sim Data instead of Game Data
 */
function SimEff(name, def) {
  if (typeof SimEffs[name] === 'undefined') {
    return typeof def === 'undefined' ? 1 : def;
  }
  return SimEffs[name];
}

;// CONCATENATED MODULE: ./src/Sim/ReplacedGameFunctions/SimHas.js


/**
 * This functions creates functions similarly to Game.Has but checks Sim Data instead of Game Data
 */
function SimHas(what) {
  const it = SimUpgrades[what];
  if (Game.ascensionMode === 1 && (it.pool === 'prestige' || it.tier === 'fortune')) return 0;
  return it ? it.bought : 0;
}

;// CONCATENATED MODULE: ./src/Sim/ReplacedGameFunctions/SimHasGod.js


/**
 * This function checks for the current God level in the sim data
 * It functions similarly to Game.hasGod()
 * @param	{string}	what	Name of the achievement
 */
function SimHasGod(what) {
  if (Game.hasGod) {
    if (SimObjects.Temple.minigame === undefined) {
      SimObjects.Temple.minigame = Game.Objects.Temple.minigame;
    }
    const god = SimObjects.Temple.minigame.gods[what];
    if (SimGod1 === god.id) {
      return 1;
    }
    if (SimGod2 === god.id) {
      return 2;
    }
    if (SimGod3 === god.id) {
      return 3;
    }
  }
  return false;
}

;// CONCATENATED MODULE: ./src/Sim/ReplacedGameFunctions/SimModifyBuidlingPrice.js






/**
 * This function calculates the sell price of a building based on current "sim data"
 * @param	{string}	building	Name of the building
 * @param	{number}	price		Current price of building
 * @returns {number}	ModifiedPrice		The modified building price
 */
function SimModifyBuildingPrice(building, price) {
  let ModifiedPrice = price;
  if (SimHas('Season savings')) ModifiedPrice *= 0.99;
  if (SimHas("Santa's dominion")) ModifiedPrice *= 0.99;
  if (SimHas('Faberge egg')) ModifiedPrice *= 0.99;
  if (SimHas('Divine discount')) ModifiedPrice *= 0.99;
  if (SimHas('Fortune #100')) ModifiedPrice *= 0.99;
  // if (SimHasAura('Fierce Hoarder')) ModifiedPrice *= 0.98;
  ModifiedPrice *= 1 - SimAuraMult('Fierce Hoarder') * 0.02;
  if (Game.hasBuff('Everything must go')) ModifiedPrice *= 0.95;
  if (Game.hasBuff('Crafty pixies')) ModifiedPrice *= 0.98;
  if (Game.hasBuff('Nasty goblins')) ModifiedPrice *= 1.02;
  if (building.fortune && SimHas(building.fortune.name)) ModifiedPrice *= 0.93;
  ModifiedPrice *= SimEff('buildingCost');
  if (SimObjects.Temple.minigameLoaded) {
    const godLvl = SimHasGod('creation');
    if (godLvl === 1) ModifiedPrice *= 0.93;
    else if (godLvl === 2) ModifiedPrice *= 0.95;
    else if (godLvl === 3) ModifiedPrice *= 0.98;
  }
  return ModifiedPrice;
}

;// CONCATENATED MODULE: ./src/Sim/SimulationEvents/SellBuilding.js



/**
 * This function calculates the cookies returned for selling a building
 * Base Game does not do this correctly
 * @param	{string}	build		Name of the building
 * @param	{number}	basePrice	Base Price of building
 * @param	{number}	start		Starting amount of building
 * @param	{number}	free		Free amount of building
 * @param	{number}	increase	Increase of building
 * @param	{number}	noSim		1 of 0 depending on if function is called from CM.Sim
 * @returns {number}	moni		Total price gained
 */
function BuildingSell(build, basePrice, start, free, amount, noSim) {
  // Calculate money gains from selling buildings
  // If noSim is set, use Game methods to compute price instead of Sim ones.
  const noSimRes = typeof noSim === 'undefined' ? 0 : noSim;
  let toChange = amount;
  let startingAmount = start;
  let moni = 0;
  if (amount === -1) toChange = startingAmount;
  if (!amount) toChange = Game.buyBulk;
  for (let i = 0; i < toChange; i++) {
    let price = basePrice * Game.priceIncrease ** Math.max(0, startingAmount - free);
    price = noSimRes
      ? Game.modifyBuildingPrice(build, price)
      : SimModifyBuildingPrice(build, price);
    price = Math.ceil(price);
    const giveBack = noSimRes ? build.getSellMultiplier() : SimGetSellMultiplier();
    price = Math.floor(price * giveBack);
    if (startingAmount > 0) {
      moni += price;
      startingAmount -= 1;
    }
  }
  return moni;
}

;// CONCATENATED MODULE: ./src/Disp/VariablesAndData.js
/**
 * Section: Variables used in Disp functions */

let DispCSS;

/**
 * These are variables used to create DOM object names and id (e.g., 'CMTextTooltip)
 */
const ColourTextPre = 'CMText';
const ColourBackPre = 'CMBack';
const ColourBorderPre = 'CMBorder';

/**
 * These are variables which can be set in the options by the user to standardize colours throughout CookieMonster
 */
const ColourBlue = 'Blue';
const ColourGreen = 'Green';
const ColourYellow = 'Yellow';
const ColourOrange = 'Orange';
const ColourRed = 'Red';
const ColourPurple = 'Purple';
const ColourGray = 'Gray';
const ColourPink = 'Pink';
const ColourBrown = 'Brown';
const ColoursOrdering = [
  ColourBlue,
  ColourGreen,
  ColourYellow,
  ColourOrange,
  ColourRed,
  ColourPurple,
  ColourPink,
  ColourBrown,
  ColourGray,
];

/**
 * This list is used to make some very basic tooltips.
 * It is used by CM.Main.DelayInit() in the call of CM.Disp.CreateSimpleTooltip()
 * @item	{string}	placeholder
 * @item	{string}	text
 * @item	{string}	minWidth
 */
const TooltipText = [
  ['GoldCookTooltipPlaceholder', 'Calculated with Golden Switch off', '200px'],
  [
    'GoldCookDragonsFortuneTooltipPlaceholder',
    'Calculated with Golden Switch off and at least one golden cookie on-screen',
    '240px',
  ],
  [
    'PrestMaxTooltipPlaceholder',
    'The MAX prestige is calculated with the cookies gained from popping all wrinklers with Skruuia god in Diamond slot, selling all stock market goods, selling all buildings with Earth Shatterer and Reality Bending auras, and buying Chocolate egg',
    '320px',
  ],
  [
    'NextPrestTooltipPlaceholder',
    'Calculated with cookies gained from wrinklers and Chocolate egg',
    '200px',
  ],
  [
    'HeavenChipMaxTooltipPlaceholder',
    'The MAX heavenly chips is calculated with the cookies gained from popping all wrinklers with Skruuia god in Diamond slot, selling all stock market goods, selling all buildings with Earth Shatterer and Reality Bending auras, and buying Chocolate egg',
    '330px',
  ],
  [
    'ResetTooltipPlaceholder',
    'The bonus income you would get from new prestige levels unlocked at 100% of its potential and from ascension achievements if you have the same buildings/upgrades after reset',
    '370px',
  ],
  [
    'ChoEggTooltipPlaceholder',
    'The amount of cookies you would get from popping all wrinklers with Skruuia god in Diamond slot, selling all stock market goods, selling all buildings with Earth Shatterer and Reality Bending auras, and then buying Chocolate egg',
    '300px',
  ],
  ['ChainNextLevelPlaceholder', 'Cheated cookies might break this formula', '250px'],
  [
    'FavouriteSettingPlaceholder',
    "Click to set this setting as favourite and show it in 'favourite' settings at the top of the Cookie Monster Settings",
    '250px',
  ],
];
const SimpleTooltipElements = {};

/**
 * These are variables used by the functions that create tooltips for wrinklers
 * See CM.Disp.CheckWrinklerTooltip(), CM.Disp.UpdateWrinklerTooltip() and CM.Main.AddWrinklerAreaDetect()
 */
let TooltipWrinklerArea = 0; // eslint-disable-line prefer-const
let TooltipWrinkler = -1; // eslint-disable-line prefer-const

/**
 * This array is used to store whether a Wrinkler tooltip is being shown or not
 * [i] = 1 means tooltip is being shown, [i] = 0 means hidden
 * It is used by CM.Disp.CheckWrinklerTooltip() and CM.Main.AddWrinklerAreaDetect()
 */
let TooltipWrinklerBeingShown = []; // eslint-disable-line prefer-const

let CMLastAscendState;
let CMSayTime = function () {}; // eslint-disable-line prefer-const

/**
 * These are variables used to create various displays when the game is loaded on the "sell all" screen
 */
let LastTargetBotBar = 1; // eslint-disable-line prefer-const
let LastTargetBuildings = 1; // eslint-disable-line prefer-const
let LastTargetTooltipBuilding = 1; // eslint-disable-line prefer-const

/**
 * These arrays are used in the stats page to show
 * average cookies per {CM.Disp.cookieTimes/CM.Disp.clickTimes} seconds
 */
const CookieTimes = [10, 15, 30, 60, 300, 600, 900, 1800];
const ClickTimes = [1, 5, 10, 15, 30];

/**
 * This array is used to give certain timers specific colours
 */
const BuffColours = {
  Frenzy: ColourYellow,
  'Dragon Harvest': ColourBrown,
  'Elder frenzy': ColourGreen,
  Clot: ColourRed,
  'Click frenzy': ColourBlue,
  Dragonflight: ColourPink,
};

/**
 * This array is used to track GC timers
 */
let GCTimers = {}; // eslint-disable-line prefer-const

/**
 * Used to store the number of cookies to be displayed in the tab-title
 */
let Title = ''; // eslint-disable-line prefer-const

let TooltipPrice;
let TooltipBonusIncome;
let TooltipType;
let TooltipName;
let TooltipBonusMouse;

let LastAscendState;
let LastNumberOfTimers;

/**
 * This stores the names of settings shown in the favourites section
 */
let FavouriteSettings = []; // eslint-disable-line prefer-const

;// CONCATENATED MODULE: ./src/Disp/BuildingsUpgrades/Buildings.js





/**
 * Section: Functions related to right column of the screen (buildings/upgrades)

/**
 * This function adjusts some things in the column of buildings.
 * It colours them, helps display the correct sell-price and shuffles the order when CM.Options.SortBuildings is set
 * The function is called by CM.Disp.Draw(), CM.Disp.UpdateColours() & CM.Disp.RefreshScale()
 * And by changes in CM.Options.BuildColour, CM.Options.SortBuild & CM.Data.Config.BulkBuildColour
 */
function UpdateBuildings() {
  let target = Game.buyBulk;
  if (Game.buyMode === 1) {
    LastTargetBuildings = target;
  } else {
    target = LastTargetBuildings;
  }
  if (target === 1) target = CacheObjects1;
  else if (target === 10) target = CacheObjects10;
  else if (target === 100) target = CacheObjects100;

  // Remove colour if applied
  l(`storeBulk1`).style.removeProperty('color');
  l(`storeBulk10`).style.removeProperty('color');
  l(`storeBulk100`).style.removeProperty('color');

  if (Game.buyMode === 1) {
    if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.BuildColour === 1) {
      Object.keys(target).forEach((i) => {
        l(`productPrice${Game.Objects[i].id}`).style.color =
          Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings[
            `Colour${target[i].color}`
          ];
      });
      l(`storeBulk${CacheMinPPBulk}`).style.color =
        Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.ColourGreen;
    } else {
      Object.keys(Game.Objects).forEach((i) => {
        l(`productPrice${Game.Objects[i].id}`).style.removeProperty('color');
      });
    }
  } else if (Game.buyMode === -1) {
    Object.keys(CacheObjects1).forEach((i) => {
      const o = Game.Objects[i];
      l(`productPrice${o.id}`).style.color = '';
      /*
       * Fix sell price displayed in the object in the store.
       *
       * The buildings sell price displayed by the game itself (without any mod) is incorrect.
       * The following line of code fixes this issue, and can be safely removed when the game gets fixed.
       *
       * This issue is extensively detailed here: https://github.com/Aktanusa/CookieMonster/issues/359#issuecomment-735658262
       */
      l(`productPrice${o.id}`).innerHTML = Beautify_Beautify(
        BuildingSell(o, o.basePrice, o.amount, o.free, Game.buyBulk, 1),
      );
    });
  }

  // Build array of pointers and sort according to the user's configured sort option.
  // This regulates sorting of buildings.
  let arr;
  if (
    Game.buyMode !== 1 ||
    !Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.SortBuildings
  ) {
    arr = Object.keys(CacheObjects1).map((k) => {
      const o = {};
      o.name = k;
      o.id = Game.Objects[k].id;
      return o;
    });
    // Sort using default order.
    arr.sort((a, b) => a.id - b.id);
  } else if (
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.SortBuildings === 1
  ) {
    arr = Object.keys(CacheObjects1).map((k) => {
      const o = {};
      o.name = k;
      o.pp = CacheObjects1[k].pp;
      o.color = CacheObjects1[k].color;
      return o;
    });
    // Sort by pp colour group, then by pp.
    arr.sort((a, b) =>
      ColoursOrdering.indexOf(a.color) === ColoursOrdering.indexOf(b.color)
        ? a.pp - b.pp
        : ColoursOrdering.indexOf(a.color) - ColoursOrdering.indexOf(b.color),
    );
  } else if (
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.SortBuildings === 2
  ) {
    arr = Object.keys(target).map((k) => {
      const o = {};
      o.name = k;
      o.pp = target[k].pp;
      o.color = target[k].color;
      return o;
    });
    // Sort by pp colour group, then by pp.
    arr.sort((a, b) =>
      ColoursOrdering.indexOf(a.color) === ColoursOrdering.indexOf(b.color)
        ? a.pp - b.pp
        : ColoursOrdering.indexOf(a.color) - ColoursOrdering.indexOf(b.color),
    );
  } else if (
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.SortBuildings === 3
  ) {
    arr = Object.keys(CacheObjectsNextAchievement).map((k) => {
      const o = {};
      o.name = k;
      o.id = Game.Objects[k].id;
      o.amountUntilNext = CacheObjectsNextAchievement[k].AmountNeeded;
      o.priceUntilNext = CacheObjectsNextAchievement[k].price;
      return o;
    });
    // First, sort using default order.
    arr.sort((a, b) => a.id - b.id);
    // Sort by price until next achievement.
    // Buildings that aren't within 100 of an achievement are placed at the end, still in
    // default order relative to each other because sort() is guaranteed stable.
    arr.sort(
      (a, b) =>
        (a.amountUntilNext !== 101 ? a.priceUntilNext : Infinity) -
        (b.amountUntilNext !== 101 ? b.priceUntilNext : Infinity),
    );
  }

  // Use array index (+2) as the grid row number.
  // (grid rows are 1-based indexing, and row 1 is the bulk buy/sell options)
  for (let x = 0; x < arr.length; x++) {
    Game.Objects[arr[x].name].l.style.gridRow = `${x + 2}/${x + 2}`;
  }
}

;// CONCATENATED MODULE: ./src/Disp/BuildingsUpgrades/UpdateUpgradeSectionsHeight.js
/**
 * This function toggles the upgrade to be always expanded
 * It is called by a change in CM.Options.ToolWarnPos
 * and upon creation of the warning tooltip by CM.Disp.UpdateTooltipWarnings()
 */
function UpdateUpgradeSectionsHeight() {
  Object.values(document.getElementsByClassName('storeSection')).forEach((section) => {
    if (
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.UpgradesNeverCollapse ||
      section.id === 'products'
    ) {
      section.style.height = 'auto'; // eslint-disable-line no-param-reassign
    } else if (section.id === 'vaultUpgrades') {
      section.style.height = ''; // eslint-disable-line no-param-reassign
      section.style.minHeight = '0px'; // eslint-disable-line no-param-reassign
    } else if (section.id === 'upgrades') {
      section.style.height = ''; // eslint-disable-line no-param-reassign
      if (section.className.includes('hasMenu')) {
        section.style.minHeight = '82px'; // eslint-disable-line no-param-reassign
      } else {
        section.style.minHeight = '60px'; // eslint-disable-line no-param-reassign
      }
    } else {
      section.style.height = ''; // eslint-disable-line no-param-reassign
      section.style.minHeight = '60px'; // eslint-disable-line no-param-reassign
    }
  });
}

;// CONCATENATED MODULE: ./src/Disp/BuildingsUpgrades/Upgrades.js



/**
 * This function adjusts some things in the upgrades section
 * It colours them and shuffles the order when CM.Options.SortBuildings is set
 * The function is called by CM.Disp.Draw(), CM.Disp.ToggleUpgradeBarAndColour & CM.Disp.RefreshScale()
 * And by changes in CM.Options.SortUpgrades
 */
function UpdateUpgrades() {
  // This counts the amount of upgrades for each pp group and updates the Upgrade Bar
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.UpBarColour > 0) {
    let blue = 0;
    let green = 0;
    let yellow = 0;
    let orange = 0;
    let red = 0;
    let purple = 0;
    let gray = 0;

    Object.keys(Game.UpgradesInStore).forEach((i) => {
      const me = Game.UpgradesInStore[i];
      let addedColour = false;
      for (let j = 0; j < l(`upgrade${i}`).childNodes.length; j += 1) {
        if (l(`upgrade${i}`).childNodes[j].className.indexOf(ColourBackPre) !== -1) {
          l(`upgrade${i}`).childNodes[j].className = ColourBackPre + CacheUpgrades[me.name].color;
          addedColour = true;
          break;
        }
      }
      if (!addedColour) {
        const div = document.createElement('div');
        div.style.width = '10px';
        div.style.height = '10px';
        div.className = ColourBackPre + CacheUpgrades[me.name].color;
        l(`upgrade${i}`).appendChild(div);
      }
      if (CacheUpgrades[me.name].color === ColourBlue) blue += 1;
      else if (CacheUpgrades[me.name].color === ColourGreen) green += 1;
      else if (CacheUpgrades[me.name].color === ColourYellow) yellow += 1;
      else if (CacheUpgrades[me.name].color === ColourOrange) orange += 1;
      else if (CacheUpgrades[me.name].color === ColourRed) red += 1;
      else if (CacheUpgrades[me.name].color === ColourPurple) purple += 1;
      else if (CacheUpgrades[me.name].color === ColourGray) gray += 1;
    });

    l('CMUpgradeBarBlue').textContent = blue;
    l('CMUpgradeBarGreen').textContent = green;
    l('CMUpgradeBarYellow').textContent = yellow;
    l('CMUpgradeBarOrange').textContent = orange;
    l('CMUpgradeBarRed').textContent = red;
    l('CMUpgradeBarPurple').textContent = purple;
    l('CMUpgradeBarGray').textContent = gray;
  }

  const arr = [];
  // Build array of pointers, sort by pp, set flex positions
  // This regulates sorting of upgrades
  for (let x = 0; x < Game.UpgradesInStore.length; x += 1) {
    const o = {};
    o.name = Game.UpgradesInStore[x].name;
    o.price = Game.UpgradesInStore[x].basePrice;
    o.pp = CacheUpgrades[o.name].pp;
    o.color = CacheUpgrades[o.name].color;
    arr.push(o);
  }

  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.SortUpgrades) {
    // Sort by pp colour group, then by pp.
    arr.sort((a, b) =>
      ColoursOrdering.indexOf(a.color) === ColoursOrdering.indexOf(b.color)
        ? a.pp - b.pp
        : ColoursOrdering.indexOf(a.color) - ColoursOrdering.indexOf(b.color),
    );
  } else {
    arr.sort((a, b) => a.price - b.price);
  }

  const nameChecker = function (arr2, upgrade) {
    return arr2.findIndex((e) => e.name === upgrade.name);
  };
  for (let x = 0; x < Game.UpgradesInStore.length; x += 1) {
    l(`upgrade${x}`).style.order = nameChecker(arr, Game.UpgradesInStore[x]) + 1;
  }
}

;// CONCATENATED MODULE: ./src/Disp/BeautifyAndFormatting/FormatTime.js
/**
 * This function returns time as a string depending on TimeFormat setting
 * @param  	{number} 	time		Time to be formatted
 * @param  	{number}	longFormat 	1 or 0
 * @returns	{string}				Formatted time
 */
function FormatTime(time, longFormat) {
  let formattedTime = time;
  if (time === Infinity) return time;
  if (time < 0) return 'Negative time period';
  formattedTime = Math.ceil(time);
  const y = Math.floor(formattedTime / 31536000);
  const d = Math.floor((formattedTime % 31536000) / 86400);
  const h = Math.floor(((formattedTime % 31536000) % 86400) / 3600);
  const m = Math.floor((((formattedTime % 31536000) % 86400) % 3600) / 60);
  const s = Math.floor((((formattedTime % 31536000) % 86400) % 3600) % 60);
  let str = '';
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TimeFormat) {
    if (formattedTime > 3155760000) return 'XX:XX:XX:XX:XX';
    str += `${(y < 10 ? '0' : '') + y}:`;
    str += `${(d < 10 ? '0' : '') + d}:`;
    str += `${(h < 10 ? '0' : '') + h}:`;
    str += `${(m < 10 ? '0' : '') + m}:`;
    str += (s < 10 ? '0' : '') + s;
  } else {
    if (formattedTime > 777600000) return longFormat ? 'Over 9000 days!' : '>9000d';
    str +=
      y > 0
        ? `${y + (longFormat ? (y === 1 ? ' year' : ' years') : 'y')}, ` // eslint-disable-line no-nested-ternary
        : '';
    if (str.length > 0 || d > 0)
      str += `${d + (longFormat ? (d === 1 ? ' day' : ' days') : 'd')}, `; // eslint-disable-line no-nested-ternary
    if (str.length > 0 || h > 0)
      str += `${h + (longFormat ? (h === 1 ? ' hour' : ' hours') : 'h')}, `; // eslint-disable-line no-nested-ternary
    if (str.length > 0 || m > 0)
      str += `${m + (longFormat ? (m === 1 ? ' minute' : ' minutes') : 'm')}, `; // eslint-disable-line no-nested-ternary
    str += s + (longFormat ? (s === 1 ? ' second' : ' seconds') : 's'); // eslint-disable-line no-nested-ternary
  }
  return str;
}

;// CONCATENATED MODULE: ./src/Disp/BeautifyAndFormatting/GetTimeColour.js



/**
 * This function returns the color to be used for time-strings
 * @param	{number}			time			Time to be coloured
 * @returns {{string, string}}	{text, color}	Both the formatted time and color as strings in an array
 */
function GetTimeColour(time) {
  let color;
  let text;
  if (time <= 0) {
    if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TimeFormat)
      text = '00:00:00:00:00';
    else text = 'Done!';
    color = ColourGreen;
  } else {
    text = FormatTime(time);
    if (time > 300) color = ColourRed;
    else if (time > 60) color = ColourOrange;
    else color = ColourYellow;
  }
  return { text, color };
}

;// CONCATENATED MODULE: ./src/Disp/HelperFunctions/GetCPS.js


/**
 * This function returns the cps as either current or average CPS depending on CM.Options.CPSMode
 * @returns	{number}	The average or current cps
 */
function GetCPS() {
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.CPSMode) {
    return CacheAverageCPS;
  }
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.CalcWrink === 0) {
    return Game.cookiesPs * (1 - Game.cpsSucked);
  }
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.CalcWrink === 1) {
    return Game.cookiesPs * (CacheCurrWrinklerCPSMult + (1 - CacheCurrWrinklerCount * 0.05));
  }
  if (CacheWrinklersFattest[1] !== null)
    if (
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.CalcWrink === 2 &&
      Game.wrinklers[CacheWrinklersFattest[1]].type === 1
    ) {
      return (
        Game.cookiesPs *
        ((CacheCurrWrinklerCPSMult * 3) / CacheCurrWrinklerCount +
          (1 - CacheCurrWrinklerCount * 0.05))
      );
    }
  return (
    Game.cookiesPs *
    (CacheCurrWrinklerCPSMult / CacheCurrWrinklerCount + (1 - CacheCurrWrinklerCount * 0.05))
  );
}

;// CONCATENATED MODULE: ./src/Disp/HelperFunctions/GetWrinkConfigBank.js


/**
 * This function returns the total amount stored in the Wrinkler Bank
 * as calculated by  CM.Cache.CacheWrinklers() if CM.Options.CalcWrink is set
 * @returns	{number}	0 or the amount of cookies stored (CM.Cache.WrinklersTotal)
 */
function GetWrinkConfigBank() {
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.CalcWrink === 1) {
    return CacheWrinklersTotal;
  }
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.CalcWrink === 2) {
    return CacheWrinklersFattest[0];
  }
  return 0;
}

;// CONCATENATED MODULE: ./src/Disp/InfoBars/CreateDOMElements.js
/** Functions to create various DOM elements used by the Bars */



/**
 * This function creates an indivudual timer for the timer bar
 * @param	{string}					id					An id to identify the timer
 * @param	{string}					name				The title of the timer
 * @param	[{{string}, {string}}, ...]	bars ([id, color])	The id and colours of individual parts of the timer
 */
function CreateTimer(id, name, bars) {
  const timerBar = document.createElement('div');
  timerBar.id = id;
  timerBar.style.height = '12px';
  timerBar.style.margin = '0px 10px';
  timerBar.style.position = 'relative';

  const div = document.createElement('div');
  div.style.width = '100%';
  div.style.height = '10px';
  div.style.margin = 'auto';
  div.style.position = 'absolute';
  div.style.left = '0px';
  div.style.top = '0px';
  div.style.right = '0px';
  div.style.bottom = '0px';

  const type = document.createElement('span');
  type.style.display = 'inline-block';
  type.style.textAlign = 'right';
  type.style.fontSize = '10px';
  type.style.width = '108px';
  type.style.marginRight = '5px';
  type.style.verticalAlign = 'text-top';
  type.textContent = name;
  div.appendChild(type);

  for (let i = 0; i < bars.length; i++) {
    const colorBar = document.createElement('span');
    colorBar.id = bars[i].id;
    colorBar.style.display = 'inline-block';
    colorBar.style.height = '10px';
    colorBar.style.verticalAlign = 'text-top';
    colorBar.style.textAlign = 'center';
    if (bars.length - 1 === i) {
      colorBar.style.borderTopRightRadius = '10px';
      colorBar.style.borderBottomRightRadius = '10px';
    }
    if (typeof bars[i].color !== 'undefined') {
      colorBar.className = ColourBackPre + bars[i].color;
    }
    div.appendChild(colorBar);
  }

  const timer = document.createElement('span');
  timer.id = `${id}Time`;
  timer.style.marginLeft = '5px';
  timer.style.verticalAlign = 'text-top';
  div.appendChild(timer);

  timerBar.appendChild(div);

  return timerBar;
}

/**
 * This function extends the bottom bar (created by CM.Disp.CreateBotBar) with a column for the given building.
 * @param	{string}	buildingName	Objectname to be added (e.g., "Cursor")
 */
function CreateBotBarBuildingColumn(buildingName) {
  if (l('CMBotBar') !== null) {
    const type = l('CMBotBar').firstChild.firstChild.childNodes[0];
    const bonus = l('CMBotBar').firstChild.firstChild.childNodes[1];
    const pp = l('CMBotBar').firstChild.firstChild.childNodes[2];
    const time = l('CMBotBar').firstChild.firstChild.childNodes[3];

    const i = buildingName;
    const header = type.appendChild(document.createElement('td'));
    header.appendChild(
      document.createTextNode(`${i.indexOf(' ') !== -1 ? i.substring(0, i.indexOf(' ')) : i} (`),
    );

    const span = header.appendChild(document.createElement('span'));
    span.className = ColourTextPre + ColourBlue;

    header.appendChild(document.createTextNode(')'));
    type.lastChild.style.paddingLeft = '8px';
    bonus.appendChild(document.createElement('td'));
    bonus.lastChild.style.paddingLeft = '8px';
    pp.appendChild(document.createElement('td'));
    pp.lastChild.style.paddingLeft = '8px';
    time.appendChild(document.createElement('td'));
    time.lastChild.style.paddingLeft = '2px';
  }
}

;// CONCATENATED MODULE: ./src/Disp/InfoBars/BottomBar.js
/** Functions related to the Bottom Bar */












/**
 * This function creates the bottom bar and appends it to l('wrapper')
 */
function CreateBotBar() {
  const BotBar = document.createElement('div');
  BotBar.id = 'CMBotBar';
  BotBar.style.height = '69px';
  BotBar.style.width = '100%';
  BotBar.style.position = 'absolute';
  BotBar.style.display = 'none';
  BotBar.style.backgroundColor = '#262224';
  BotBar.style.backgroundImage = 'linear-gradient(to bottom, #4d4548, #000000)';
  BotBar.style.borderTop = '1px solid black';
  BotBar.style.overflow = 'auto';
  BotBar.style.textShadow = '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black';

  const table = BotBar.appendChild(document.createElement('table'));
  table.style.width = '100%';
  table.style.textAlign = 'center';
  table.style.whiteSpace = 'nowrap';
  const tbody = table.appendChild(document.createElement('tbody'));

  const firstCol = function (text, color) {
    const td = document.createElement('td');
    td.style.textAlign = 'right';
    td.className = ColourTextPre + color;
    td.textContent = text;
    return td;
  };
  const type = tbody.appendChild(document.createElement('tr'));
  type.style.fontWeight = 'bold';
  type.appendChild(firstCol(`CM ${VersionMajor}.${VersionMinor}`, ColourYellow));
  const bonus = tbody.appendChild(document.createElement('tr'));
  bonus.appendChild(firstCol('Bonus Income', ColourBlue));
  const pp = tbody.appendChild(document.createElement('tr'));
  pp.appendChild(firstCol('Payback Period', ColourBlue));
  const time = tbody.appendChild(document.createElement('tr'));
  time.appendChild(firstCol('Time Left', ColourBlue));

  l('wrapper').appendChild(BotBar);

  Object.keys(Game.Objects).forEach((i) => {
    CreateBotBarBuildingColumn(i);
  });
}

/**
 * This function updates the bonus-, pp-, and time-rows in the the bottom bar
 */
function UpdateBotBar() {
  if (
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.BotBar === 1 &&
    CacheObjects1 &&
    Game.buyMode === 1
  ) {
    let count = 0;
    Object.keys(CacheObjects1).forEach((i) => {
      let target = Game.buyBulk;
      if (Game.buyMode === 1) {
        LastTargetBotBar = target;
      } else {
        target = LastTargetBotBar;
      }
      if (target === 1) target = CacheObjects1;
      if (target === 10) target = CacheObjects10;
      if (target === 100) target = CacheObjects100;
      count += 1;
      l('CMBotBar').firstChild.firstChild.childNodes[0].childNodes[
        count
      ].childNodes[1].textContent = Game.Objects[i].amount;
      l('CMBotBar').firstChild.firstChild.childNodes[1].childNodes[count].textContent = Beautify_Beautify(
        target[i].bonus,
        2,
      );
      l('CMBotBar').firstChild.firstChild.childNodes[2].childNodes[count].className =
        ColourTextPre + target[i].color;
      let PPString;
      if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.PPDisplayTime)
        PPString = FormatTime(Math.round(target[i].pp));
      else PPString = Beautify_Beautify(Math.round(target[i].pp), 2);
      l('CMBotBar').firstChild.firstChild.childNodes[2].childNodes[count].textContent = PPString;
      const timeColour = GetTimeColour(
        (Game.Objects[i].bulkPrice - (Game.cookies + GetWrinkConfigBank())) / GetCPS(),
      );
      l('CMBotBar').firstChild.firstChild.childNodes[3].childNodes[count].className =
        ColourTextPre + timeColour.color;
      if (timeColour.text === 'Done!' && Game.cookies < Game.Objects[i].bulkPrice) {
        l('CMBotBar').firstChild.firstChild.childNodes[3].childNodes[
          count
        ].textContent = `${timeColour.text} (with Wrink)`;
      } else
        l('CMBotBar').firstChild.firstChild.childNodes[3].childNodes[count].textContent =
          timeColour.text;
    });
  }
}

;// CONCATENATED MODULE: ./src/Disp/HelperFunctions/UpdateBackground.js
/**
 * This function sets the size of the background of the full game and the left column
 * depending on whether certain abrs are activated
 * It is called by CM.Disp.UpdateAscendState() and CM.Disp.UpdateBotTimerBarPosition()
 */
function UpdateBackground() {
  Game.Background.canvas.width = Game.Background.canvas.parentNode.offsetWidth;
  Game.Background.canvas.height = Game.Background.canvas.parentNode.offsetHeight;
  Game.LeftBackground.canvas.width = Game.LeftBackground.canvas.parentNode.offsetWidth;
  Game.LeftBackground.canvas.height = Game.LeftBackground.canvas.parentNode.offsetHeight;
  Game.DrawBackground();
}

;// CONCATENATED MODULE: ./src/Config/SpecificToggles.js
/** Called by the "func" of individual settings */



/**
 * This function changes the position of both the bottom and timer bar
 */
function UpdateBotTimerBarPosition() {
  if (
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.BotBar === 1 &&
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TimerBar === 1 &&
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TimerBarPos === 1
  ) {
    l('CMBotBar').style.bottom = l('CMTimerBar').style.height;
    l('game').style.bottom = `${Number(l('CMTimerBar').style.height.replace('px', '')) + 70}px`;
  } else if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.BotBar === 1) {
    l('CMBotBar').style.bottom = '0px';
    l('game').style.bottom = '70px';
  } else if (
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TimerBar === 1 &&
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TimerBarPos === 1
  ) {
    l('game').style.bottom = l('CMTimerBar').style.height;
  } else {
    // No bars
    l('game').style.bottom = '0px';
  }

  if (
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TimerBar === 1 &&
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TimerBarPos === 0
  ) {
    l('sectionLeft').style.top = l('CMTimerBar').style.height;
  } else {
    l('sectionLeft').style.top = '';
  }

  UpdateBackground();
}

/**
 * This function changes the visibility of the timer bar
 */
function ToggleTimerBar() {
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TimerBar === 1)
    l('CMTimerBar').style.display = '';
  else l('CMTimerBar').style.display = 'none';
  UpdateBotTimerBarPosition();
}

/**
 * This function changes the position of the timer bar
 */
function ToggleTimerBarPos() {
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TimerBarPos === 0) {
    l('CMTimerBar').style.width = '30%';
    l('CMTimerBar').style.bottom = '';
    l('game').insertBefore(l('CMTimerBar'), l('sectionLeft'));
  } else {
    l('CMTimerBar').style.width = '100%';
    l('CMTimerBar').style.bottom = '0px';
    l('wrapper').appendChild(l('CMTimerBar'));
  }
  UpdateBotTimerBarPosition();
}

;// CONCATENATED MODULE: ./src/Disp/InfoBars/TimerBar.js
/** Functions related to the Timer Bar */





/**
 * This function creates the TimerBar and appends it to l('wrapper')
 */
function CreateTimerBar() {
  const TimerBar = document.createElement('div');
  TimerBar.id = 'CMTimerBar';
  TimerBar.style.position = 'absolute';
  TimerBar.style.display = 'none';
  TimerBar.style.height = '0px';
  TimerBar.style.fontSize = '10px';
  TimerBar.style.fontWeight = 'bold';
  TimerBar.style.backgroundColor = 'black';

  // Create standard Autosave bar
  const CMTimerBarAutosave = CreateTimer('CMTimerBarAutosave', 'Autosave', [
    { id: 'CMTimerBarAutosaveBar', color: ColourPurple },
  ]);
  TimerBar.appendChild(CMTimerBarAutosave);

  // Create standard Golden Cookie bar
  const CMTimerBarGC = CreateTimer('CMTimerBarGC', 'Next Cookie', [
    { id: 'CMTimerBarGCMinBar', color: ColourGray },
    { id: 'CMTimerBarGCBar', color: ColourPurple },
  ]);
  TimerBar.appendChild(CMTimerBarGC);

  // Create standard Reindeer bar
  const CMTimerBarRen = CreateTimer('CMTimerBarRen', 'Next Reindeer', [
    { id: 'CMTimerBarRenMinBar', color: ColourGray },
    { id: 'CMTimerBarRenBar', color: ColourOrange },
  ]);
  TimerBar.appendChild(CMTimerBarRen);
  const TimerBarBuffTimers = document.createElement('div');
  TimerBarBuffTimers.id = 'CMTimerBarBuffTimers';
  TimerBar.appendChild(TimerBarBuffTimers);

  l('wrapper').appendChild(TimerBar);
}

/**
 * This function updates indivudual timers in the timer bar
 */
function UpdateTimerBar() {
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TimerBar === 1) {
    // label width: 113, timer width: 30, div margin: 20
    const maxWidthTwoBar = l('CMTimerBar').offsetWidth - 163;
    // label width: 113, div margin: 20, calculate timer width at runtime
    const maxWidthOneBar = l('CMTimerBar').offsetWidth - 133;
    let numberOfTimers = 0;

    if (
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.AutosaveTimerBar &&
      Game.prefs.autosave
    ) {
      const timeTillNextAutosave =
        (Game.fps * 60 - (Game.OnAscend ? 0 : Game.T % (Game.fps * 60))) / Game.fps;
      l('CMTimerBarAutosave').style.display = '';
      l('CMTimerBarAutosaveBar').style.width = `${Math.round(
        (timeTillNextAutosave *
          (maxWidthOneBar - Math.ceil(timeTillNextAutosave).toString().length * 8)) /
          60,
      )}px`;
      if (
        Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TimerBarOverlay >= 1
      ) {
        l('CMTimerBarAutosaveBar').textContent = Math.ceil(timeTillNextAutosave);
      } else l('CMTimerBarAutosaveBar').textContent = '';
      l('CMTimerBarAutosaveTime').textContent = Math.ceil(timeTillNextAutosave);
      numberOfTimers += 1;
    } else l('CMTimerBarAutosave').style.display = 'none';

    // Regulates visibility of Golden Cookie timer
    if (Game.shimmerTypes.golden.spawned === 0 && !Game.Has('Golden switch [off]')) {
      l('CMTimerBarGC').style.display = '';
      l('CMTimerBarGCMinBar').style.width = `${Math.round(
        (Math.max(0, Game.shimmerTypes.golden.minTime - Game.shimmerTypes.golden.time) *
          maxWidthTwoBar) /
          Game.shimmerTypes.golden.maxTime,
      )}px`;
      if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TimerBarOverlay >= 1)
        l('CMTimerBarGCMinBar').textContent = Math.ceil(
          (Game.shimmerTypes.golden.minTime - Game.shimmerTypes.golden.time) / Game.fps,
        );
      else l('CMTimerBarGCMinBar').textContent = '';
      if (Game.shimmerTypes.golden.minTime === Game.shimmerTypes.golden.maxTime) {
        l('CMTimerBarGCMinBar').style.borderTopRightRadius = '10px';
        l('CMTimerBarGCMinBar').style.borderBottomRightRadius = '10px';
      } else {
        l('CMTimerBarGCMinBar').style.borderTopRightRadius = '';
        l('CMTimerBarGCMinBar').style.borderBottomRightRadius = '';
      }
      l('CMTimerBarGCBar').style.width = `${Math.round(
        (Math.min(
          Game.shimmerTypes.golden.maxTime - Game.shimmerTypes.golden.minTime,
          Game.shimmerTypes.golden.maxTime - Game.shimmerTypes.golden.time,
        ) *
          maxWidthTwoBar) /
          Game.shimmerTypes.golden.maxTime,
      )}px`;
      if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TimerBarOverlay >= 1)
        l('CMTimerBarGCBar').textContent = Math.ceil(
          Math.min(
            Game.shimmerTypes.golden.maxTime - Game.shimmerTypes.golden.minTime,
            Game.shimmerTypes.golden.maxTime - Game.shimmerTypes.golden.time,
          ) / Game.fps,
        );
      else l('CMTimerBarGCBar').textContent = '';
      l('CMTimerBarGCTime').textContent = Math.ceil(
        (Game.shimmerTypes.golden.maxTime - Game.shimmerTypes.golden.time) / Game.fps,
      );
      numberOfTimers += 1;
    } else l('CMTimerBarGC').style.display = 'none';

    // Regulates visibility of Reindeer timer
    if (Game.season === 'christmas' && Game.shimmerTypes.reindeer.spawned === 0) {
      l('CMTimerBarRen').style.display = '';
      l('CMTimerBarRenMinBar').style.width = `${Math.round(
        (Math.max(0, Game.shimmerTypes.reindeer.minTime - Game.shimmerTypes.reindeer.time) *
          maxWidthTwoBar) /
          Game.shimmerTypes.reindeer.maxTime,
      )}px`;
      if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TimerBarOverlay >= 1)
        l('CMTimerBarRenMinBar').textContent = Math.ceil(
          (Game.shimmerTypes.reindeer.minTime - Game.shimmerTypes.reindeer.time) / Game.fps,
        );
      else l('CMTimerBarRenMinBar').textContent = '';
      l('CMTimerBarRenBar').style.width = `${Math.round(
        (Math.min(
          Game.shimmerTypes.reindeer.maxTime - Game.shimmerTypes.reindeer.minTime,
          Game.shimmerTypes.reindeer.maxTime - Game.shimmerTypes.reindeer.time,
        ) *
          maxWidthTwoBar) /
          Game.shimmerTypes.reindeer.maxTime,
      )}px`;
      if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TimerBarOverlay >= 1)
        l('CMTimerBarRenBar').textContent = Math.ceil(
          Math.min(
            Game.shimmerTypes.reindeer.maxTime - Game.shimmerTypes.reindeer.minTime,
            Game.shimmerTypes.reindeer.maxTime - Game.shimmerTypes.reindeer.time,
          ) / Game.fps,
        );
      else l('CMTimerBarRenBar').textContent = '';
      l('CMTimerBarRenTime').textContent = Math.ceil(
        (Game.shimmerTypes.reindeer.maxTime - Game.shimmerTypes.reindeer.time) / Game.fps,
      );
      numberOfTimers += 1;
    } else {
      l('CMTimerBarRen').style.display = 'none';
    }

    // On every frame all buff-timers are deleted and re-created
    const BuffTimerBars = {};
    l('CMTimerBarBuffTimers').innerHTML = '';
    Object.keys(Game.buffs).forEach((i) => {
      if (Game.buffs[i]) {
        const timer = CreateTimer(Game.buffs[i].name, Game.buffs[i].name, [
          { id: `${Game.buffs[i].name}Bar` },
        ]);
        timer.style.display = '';
        let classColour = '';
        // Gives specific timers specific colors
        if (typeof BuffColours[Game.buffs[i].name] !== 'undefined') {
          classColour = BuffColours[Game.buffs[i].name];
        } else classColour = ColourPurple;
        timer.lastChild.children[1].className = ColourBackPre + classColour;
        timer.lastChild.children[1].style.color = 'black';
        if (
          Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TimerBarOverlay === 2
        )
          timer.lastChild.children[1].textContent = `${Math.round(
            100 * (Game.buffs[i].time / Game.buffs[i].maxTime),
          )}%`;
        else timer.lastChild.children[1].textContent = '';
        timer.lastChild.children[1].style.width = `${Math.round(
          (Game.buffs[i].time *
            (maxWidthOneBar - Math.ceil(Game.buffs[i].time / Game.fps).toString().length * 8)) /
            Game.buffs[i].maxTime,
        )}px`;
        timer.lastChild.children[2].textContent = Math.ceil(Game.buffs[i].time / Game.fps);
        numberOfTimers += 1;
        BuffTimerBars[Game.buffs[i].name] = timer;
      }
    });
    Object.keys(BuffTimerBars).forEach((i) => {
      l('CMTimerBarBuffTimers').appendChild(BuffTimerBars[i]);
    });

    if (numberOfTimers !== 0) {
      l('CMTimerBar').style.height = `${numberOfTimers * 12 + 2}px`;
    }
    if (LastNumberOfTimers !== numberOfTimers) {
      LastNumberOfTimers = numberOfTimers;
      UpdateBotTimerBarPosition();
    }
  }
}

;// CONCATENATED MODULE: ./src/Disp/MenuSections/Refreshmenu.js
/**
 * This function refreshes the stats page, CM.Options.UpStats determines the rate at which that happens
 * It is called by CM.Disp.Draw()
 */
function RefreshMenu() {
  if (
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.UpStats &&
    Game.onMenu === 'stats' &&
    (Game.drawT - 1) % (Game.fps * 5) !== 0 &&
    (Game.drawT - 1) % Game.fps === 0
  )
    Game.UpdateMenu();
}

;// CONCATENATED MODULE: ./src/Cache/Dragon/CacheDragonAuras.js
 // eslint-disable-line no-unused-vars

/**
 * This functions caches the currently selected Dragon Auras
 */
function CacheDragonAuras() {
  CacheDragonAura = Game.dragonAura;
  CacheDragonAura2 = Game.dragonAura2;
}

;// CONCATENATED MODULE: ./src/Sim/InitializeData/InitAchievement.js
/**
 * This function constructs an object with the static properties of an achievement
 * @param	{string}	achievementName	Name of the Achievement
 * @returns {Object}	you				The static object
 */
function InitAchievement(achievementName) {
  const me = Game.Achievements[achievementName];
  const you = {};
  you.name = me.name;
  return you;
}

;// CONCATENATED MODULE: ./src/Sim/ReplacedGameFunctions/SimGetTieredCpsMult.js



/**
 * This functions creates functions similarly to Game.GetTieredCpsMult but checks Sim Data instead of Game Data
 */
function SimGetTieredCpsMult(me) {
  let mult = 1;
  Object.keys(me.tieredUpgrades).forEach((i) => {
    if (!Game.Tiers[me.tieredUpgrades[i].tier].special && SimHas(me.tieredUpgrades[i].name))
      mult *= 2;
  });
  Object.keys(me.synergies).forEach((i) => {
    if (SimHas(me.synergies[i].name)) {
      const syn = me.synergies[i];
      if (syn.buildingTie1.name === me.name) mult *= 1 + 0.05 * syn.buildingTie2.amount;
      else if (syn.buildingTie2.name === me.name) mult *= 1 + 0.001 * syn.buildingTie1.amount;
    }
  });
  if (me.fortune && SimHas(me.fortune.name)) mult *= 1.07;
  if (me.grandma && SimHas(me.grandma.name))
    mult *= 1 + SimObjects.Grandma.amount * 0.01 * (1 / (me.id - 1));
  if (typeof me.tieredUpgrades.misfortune === 'object') {
    if (me.vanilla === 1 && SimHas(me.tieredUpgrades.misfortune.name)) {
      switch (Game.elderWrath) {
        default:
          mult *= 1;
          break;
        case 1:
          mult *= 1.02;
          break;
        case 2:
          mult *= 1.04;
          break;
        case 3:
          mult *= 1.06;
          break;
      }
    }
  }
  return mult;
}

;// CONCATENATED MODULE: ./src/Sim/InitializeData/InitialBuildingData.js






/**
 * This function constructs an object with the static properties of a building,
 * but with a 'cps' method changed to check sim data
 *
 * @param	{string}	buildingName	Name of the building
 * @returns {Object}	you				The static object
 */
function InitialBuildingData(buildingName) {
  const me = Game.Objects[buildingName];
  const you = {};
  if (me.name === 'Cursor') {
    you.cps = function (it) {
      let add = 0;
      if (SimHas('Thousand fingers')) add += 0.1;
      if (SimHas('Million fingers')) add *= 5;
      if (SimHas('Billion fingers')) add *= 10;
      if (SimHas('Trillion fingers')) add *= 20;
      if (SimHas('Quadrillion fingers')) add *= 20;
      if (SimHas('Quintillion fingers')) add *= 20;
      if (SimHas('Sextillion fingers')) add *= 20;
      if (SimHas('Septillion fingers')) add *= 20;
      if (SimHas('Octillion fingers')) add *= 20;
      if (SimHas('Nonillion fingers')) add *= 20;
      let mult = 1;
      let num = 0;
      Object.keys(SimObjects).forEach((i) => {
        if (SimObjects[i].name !== 'Cursor') num += SimObjects[i].amount;
      });
      add *= num;
      mult *= SimGetTieredCpsMult(it);
      mult *= Game.magicCpS('Cursor');
      mult *= SimEff('cursorCps');
      return (
        Game.ComputeCps(
          0.1,
          SimHas('Reinforced index finger') +
            SimHas('Carpal tunnel prevention cream') +
            SimHas('Ambidextrous'),
          add,
        ) * mult
      );
    };
  } else if (me.name === 'Grandma') {
    you.cps = function (it) {
      let mult = 1;
      Object.keys(Game.GrandmaSynergies).forEach((i) => {
        if (SimHas(Game.GrandmaSynergies[i])) mult *= 2;
      });
      if (SimHas('Bingo center/Research facility')) mult *= 4;
      if (SimHas('Ritual rolling pins')) mult *= 2;
      if (SimHas('Naughty list')) mult *= 2;

      if (SimHas('Elderwort biscuits')) mult *= 1.02;

      mult *= SimEff('grandmaCps');

      if (SimHas('Cat ladies')) {
        for (let i = 0; i < Game.UpgradesByPool.kitten.length; i++) {
          if (SimHas(Game.UpgradesByPool.kitten[i].name)) mult *= 1.29;
        }
      }

      mult *= SimGetTieredCpsMult(it);

      let add = 0;
      if (SimHas('One mind')) add += SimObjects.Grandma.amount * 0.02;
      if (SimHas('Communal brainsweep')) add += SimObjects.Grandma.amount * 0.02;
      if (SimHas('Elder Pact')) add += SimObjects.Portal.amount * 0.05;

      let num = 0;
      Object.keys(SimObjects).forEach((i) => {
        if (SimObjects[i].name !== 'Grandma') num += SimObjects[i].amount;
      });
      // if (Game.hasAura('Elder Battalion')) mult*=1+0.01*num;
      mult *= 1 + SimAuraMult('Elder Battalion') * 0.01 * num;

      mult *= Game.magicCpS(me.name);

      return (me.baseCps + add) * mult;
    };
  } else {
    you.cps = function (it) {
      let mult = 1;
      mult *= SimGetTieredCpsMult(it);
      mult *= Game.magicCpS(it.name);
      return it.baseCPS * mult;
    };
  }

  // Below is needed for above eval, specifically for the GetTieredCpsMult function
  you.baseCps = me.baseCps;
  you.name = me.name;
  you.tieredUpgrades = me.tieredUpgrades;
  you.synergies = me.synergies;
  you.fortune = me.fortune;
  you.grandma = me.grandma;
  you.baseCPS = me.baseCps;
  you.id = me.id;
  you.vanilla = me.vanilla;
  return you;
}

;// CONCATENATED MODULE: ./src/Sim/InitializeData/InitUpgrade.js




/**
 * This function constructs an object with the static properties of an upgrade
 * @param	{string}	upgradeName		Name of the Upgrade
 * @returns {Object}	you				The static object
 */
function InitUpgrade(upgradeName) {
  const me = Game.Upgrades[upgradeName];
  const you = {};
  // Some upgrades have a function for .power (notably the valentine cookies)
  you.power = me.power;
  if (typeof you.power === 'function') {
    if (me.name === 'Sugar crystal cookies') {
      you.power = function () {
        let n = 5;
        Object.keys(SimObjects).forEach((i) => {
          if (SimObjects[i].level >= 10) n += 1;
        });
        return n;
      };
    } else {
      you.power = function () {
        let pow = 2;
        if (SimHas('Starlove')) pow = 3;
        if (Game.hasGod) {
          const godLvl = SimHasGod('seasons');
          if (godLvl === 1) pow *= 1.3;
          else if (godLvl === 2) pow *= 1.2;
          else if (godLvl === 3) pow *= 1.1;
        }
        return pow;
      };
    }
  }
  you.pool = me.pool;
  you.name = me.name;
  return you;
}

;// CONCATENATED MODULE: ./src/Sim/SimulationData/CopyData.js








/**
 * This function copies all relevant data and therefore sets a new iteration of the "sim data"
 * It is called at the start of any function that simulates certain behaviour or actions
 */
function CopyData() {
  // Other variables
  SimUpgradesOwned = Game.UpgradesOwned;
  SimPledges = Game.pledges;
  SimAchievementsOwned = Game.AchievementsOwned;
  SimHeavenlyPower = Game.heavenlyPower;
  SimPrestige = Game.prestige;

  // Buildings
  Object.keys(Game.Objects).forEach((i) => {
    const me = Game.Objects[i];
    let you = SimObjects[i];
    if (you === undefined) {
      // New building!
      SimObjects[i] = InitialBuildingData(i);
      you = SimObjects[i];
      CreateBotBarBuildingColumn(i); // Add new building to the bottom bar
    }
    you.amount = me.amount;
    you.level = me.level;
    you.totalCookies = me.totalCookies;
    you.basePrice = me.basePrice;
    you.free = me.free;
    if (me.minigameLoaded) {
      if (me.name === 'Temple') {
        SimGod1 = me.minigame.slot[0];
        SimGod2 = me.minigame.slot[1];
        SimGod3 = me.minigame.slot[2];
      }
      you.minigameLoaded = me.minigameLoaded;
      you.minigame = me.minigame;
    }
    SimObjects[i] = you;
  });

  // Upgrades
  Object.keys(Game.Upgrades).forEach((i) => {
    const me = Game.Upgrades[i];
    let you = SimUpgrades[i];
    if (you === undefined) {
      SimUpgrades[i] = InitUpgrade(i);
      you = SimUpgrades[i];
    }
    you.bought = me.bought;
    SimUpgrades[i] = you;
  });

  // Achievements
  Object.keys(Game.Achievements).forEach((i) => {
    const me = Game.Achievements[i];
    let you = SimAchievements[i];
    if (you === undefined) {
      SimAchievements[i] = InitAchievement(i);
      you = SimAchievements[i];
    }
    you.won = me.won;
    SimAchievements[i] = you;
  });

  // Auras
  CacheDragonAuras();
  SimDragonAura = CacheDragonAura;
  SimDragonAura2 = CacheDragonAura2;
}

;// CONCATENATED MODULE: ./src/Disp/Tooltips/CreateTooltip.js


/** Creates various sections of tooltips */

/**
 * This function creates a tooltipBox object which contains all CookieMonster added tooltip information.
 * @returns {object}	div		An object containing the stylized box
 */
function TooltipCreateTooltipBox() {
  l('tooltip').firstChild.style.paddingBottom = '4px'; // Sets padding on base-tooltip
  const tooltipBox = document.createElement('div');
  tooltipBox.style.border = '1px solid';
  tooltipBox.style.padding = '4px';
  tooltipBox.style.margin = '0px -4px';
  tooltipBox.id = 'CMTooltipBorder';
  tooltipBox.className = ColourTextPre + ColourGray;
  return tooltipBox;
}

/**
 * This function creates a header object for tooltips.
 * @param	{string}	text	Title of header
 * @returns {object}	div		An object containing the stylized header
 */
function TooltipCreateHeader(text) {
  const div = document.createElement('div');
  div.style.fontWeight = 'bold';
  div.id = `${text}Title`;
  div.className = ColourTextPre + ColourBlue;
  div.textContent = text;
  return div;
}

/**
 * This function creates the tooltip objectm for warnings
 * The object is also removed by CM.Disp.UpdateTooltipWarnings() when type is 's' or 'g'
 * @returns {object}	TooltipWarn	The Warnings-tooltip object
 */
function TooltipCreateWarningSection() {
  const TooltipWarn = document.createElement('div');
  TooltipWarn.style.position = 'absolute';
  TooltipWarn.style.display = 'block';
  TooltipWarn.style.left = 'auto';
  TooltipWarn.style.bottom = 'auto';
  TooltipWarn.id = 'CMDispTooltipWarningParent';

  const create = function (boxId, color, labelTextFront, labelTextBack, deficitId) {
    const box = document.createElement('div');
    box.id = boxId;
    box.style.display = 'none';
    box.style.transition = 'opacity 0.1s ease-out';
    box.className = ColourBorderPre + color;
    box.style.padding = '2px';
    box.style.background = '#000 url(img/darkNoise.png)';
    const labelDiv = document.createElement('div');
    box.appendChild(labelDiv);
    const labelSpan = document.createElement('span');
    labelSpan.className = ColourTextPre + color;
    labelSpan.style.fontWeight = 'bold';
    labelSpan.textContent = labelTextFront;
    labelDiv.appendChild(labelSpan);
    labelDiv.appendChild(document.createTextNode(labelTextBack));
    const deficitDiv = document.createElement('div');
    box.appendChild(deficitDiv);
    const deficitSpan = document.createElement('span');
    deficitSpan.id = deficitId;
    deficitDiv.appendChild(document.createTextNode('Deficit: '));
    deficitDiv.appendChild(deficitSpan);
    return box;
  };

  TooltipWarn.appendChild(
    create(
      'CMDispTooltipWarnLucky',
      ColourRed,
      'Warning: ',
      'Purchase of this item will put you under the number of Cookies required for "Lucky!"',
      'CMDispTooltipWarnLuckyText',
    ),
  );
  TooltipWarn.firstChild.style.marginBottom = '4px';
  TooltipWarn.appendChild(
    create(
      'CMDispTooltipWarnLuckyFrenzy',
      ColourYellow,
      'Warning: ',
      'Purchase of this item will put you under the number of Cookies required for "Lucky!" (Frenzy)',
      'CMDispTooltipWarnLuckyFrenzyText',
    ),
  );
  TooltipWarn.lastChild.style.marginBottom = '4px';
  TooltipWarn.appendChild(
    create(
      'CMDispTooltipWarnConjure',
      ColourPurple,
      'Warning: ',
      'Purchase of this item will put you under the number of Cookies required for "Conjure Baked Goods"',
      'CMDispTooltipWarnConjureText',
    ),
  );
  TooltipWarn.lastChild.style.marginBottom = '4px';
  TooltipWarn.appendChild(
    create(
      'CMDispTooltipWarnConjureFrenzy',
      ColourPurple,
      'Warning: ',
      'Purchase of this item will put you under the number of Cookies required for "Conjure Baked Goods" (Frenzy)',
      'CMDispTooltipWarnConjureFrenzyText',
    ),
  );
  TooltipWarn.lastChild.style.marginBottom = '4px';
  TooltipWarn.appendChild(
    create(
      'CMDispTooltipWarnEdifice',
      ColourPurple,
      'Warning: ',
      'Purchase of this item will put you under the number of Cookies needed for "Spontaneous Edifice" to possibly give you your most expensive building"',
      'CMDispTooltipWarnEdificeText',
    ),
  );
  TooltipWarn.lastChild.style.marginBottom = '4px';
  TooltipWarn.appendChild(
    create(
      'CMDispTooltipWarnUser',
      ColourRed,
      'Warning: ',
      `Purchase of this item will put you under the number of Cookies equal to ${Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.ToolWarnUser} seconds of CPS`,
      'CMDispTooltipWarnUserText',
    ),
  );

  return TooltipWarn;
}

/**
 * This function appends the sections for Bonus Income, PP and Time left (to achiev) to the tooltip-object
 * The actual data is added by the Update-functions themselves
 * @param	{object}	tooltip		Object of a TooltipBox, normally created by a call to CM.Disp.TooltipCreateTooltipBox()
 */
function TooltipCreateCalculationSection(tooltip) {
  tooltip.appendChild(TooltipCreateHeader('Bonus Income'));
  const income = document.createElement('div');
  income.style.marginBottom = '4px';
  income.style.color = 'white';
  income.id = 'CMTooltipIncome';
  tooltip.appendChild(income);

  tooltip.appendChild(TooltipCreateHeader('Bonus Cookies per Click'));
  tooltip.lastChild.style.display = 'none'; // eslint-disable-line no-param-reassign
  const click = document.createElement('div');
  click.style.marginBottom = '4px';
  click.style.color = 'white';
  click.style.display = 'none';
  click.id = 'CMTooltipCookiePerClick';
  tooltip.appendChild(click);

  tooltip.appendChild(TooltipCreateHeader('Payback Period'));
  const pp = document.createElement('div');
  pp.style.marginBottom = '4px';
  pp.id = 'CMTooltipPP';
  tooltip.appendChild(pp);

  tooltip.appendChild(TooltipCreateHeader('Time Left'));
  const time = document.createElement('div');
  time.id = 'CMTooltipTime';
  tooltip.appendChild(time);

  if (TooltipType === 'b') {
    tooltip.appendChild(TooltipCreateHeader('Production left till next achievement'));
    tooltip.lastChild.id = 'CMTooltipProductionLeftHeader'; // eslint-disable-line no-param-reassign
    const production = document.createElement('div');
    production.id = 'CMTooltipProductionLeft';
    tooltip.appendChild(production);
  }
  if (TooltipType === 'b') {
    tooltip.appendChild(TooltipCreateHeader('Buildings (price / PP) left till next achievement'));
    tooltip.lastChild.id = 'CMTooltipNextAchievementHeader'; // eslint-disable-line no-param-reassign
    const production = document.createElement('div');
    production.id = 'CMTooltipNextAchievement';
    tooltip.appendChild(production);
  }
}

;// CONCATENATED MODULE: ./src/Cache/PP/ColourOfPP.js




/**
 * This functions return the colour assosciated with the given pp value
 * It is called by CM.Cache.CacheBuildingsPP(), CM.Cache.CacheBuildingsBulkPP() and CM.Cache.CacheUpgradePP()
 * @params	{object}	obj		The obj of which the pp value should be checked
 * @params	{number}	price	The price of the object
 * @returns {string}	color	The colour assosciated with the pp value
 */
function ColourOfPP(me, price) {
  let color = '';
  // Colour based on PP
  if (me.pp <= 0 || me.pp === Infinity) color = ColourGray;
  else if (me.pp < CacheMinPP) color = ColourBlue;
  else if (me.pp === CacheMinPP) color = ColourGreen;
  else if (me.pp < CachePPArray[10][0]) color = ColourYellow;
  else if (me.pp < CachePPArray[20][0]) color = ColourOrange;
  else if (me.pp < CachePPArray[30][0]) color = ColourRed;
  else color = ColourPurple;

  // Colour based on price in terms of CPS
  if (
    Number(
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.PPSecondsLowerLimit,
    ) !== 0
  ) {
    if (
      price / GetCPS() <
      Number(
        Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.PPSecondsLowerLimit,
      )
    )
      color = ColourBlue;
  }
  // Colour based on being able to purchase
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.PPOnlyConsiderBuyable) {
    if (price - Game.cookies > 0) color = ColourRed;
  }
  return color;
}

;// CONCATENATED MODULE: ./src/Cache/CPS/GetCPSBuffMult.js
/**
 * This function returns the current CPS buff
 * @returns {number}	mult	The multiplier
 */
function GetCPSBuffMult() {
  let mult = 1;
  Object.keys(Game.buffs).forEach((i) => {
    if (typeof Game.buffs[i].multCpS !== 'undefined') mult *= Game.buffs[i].multCpS;
  });
  return mult;
}

;// CONCATENATED MODULE: ./src/Sim/ReplacedGameFunctions/SimGetHeavenlyMultiplier.js




/**
 * This functions creates functions similarly to Game.GetHeavenlyMultiplier but checks Sim Data instead of Game Data
 */
function SimGetHeavenlyMultiplier() {
  let heavenlyMult = 0;
  if (SimHas('Heavenly chip secret')) heavenlyMult += 0.05;
  if (SimHas('Heavenly cookie stand')) heavenlyMult += 0.2;
  if (SimHas('Heavenly bakery')) heavenlyMult += 0.25;
  if (SimHas('Heavenly confectionery')) heavenlyMult += 0.25;
  if (SimHas('Heavenly key')) heavenlyMult += 0.25;
  // if (SimHasAura('Dragon God')) heavenlyMult*=1.05;
  heavenlyMult *= 1 + SimAuraMult('Dragon God') * 0.05;
  if (SimHas('Lucky digit')) heavenlyMult *= 1.01;
  if (SimHas('Lucky number')) heavenlyMult *= 1.01;
  if (SimHas('Lucky payout')) heavenlyMult *= 1.01;
  if (Game.hasGod) {
    const godLvl = SimHasGod('creation');
    if (godLvl === 1) heavenlyMult *= 0.7;
    else if (godLvl === 2) heavenlyMult *= 0.8;
    else if (godLvl === 3) heavenlyMult *= 0.9;
  }
  return heavenlyMult;
}

;// CONCATENATED MODULE: ./src/Sim/SimulationData/SimWin.js
 // eslint-disable-line no-unused-vars

/**
 * This function "wins" an achievement in the current sim data
 * It functions similarly to Game.Win()
 * It is not created by CM.Sim.CreateSimFunctions() in order to avoid spamming pop-ups upon winning
 * @param	{string}	what	Name of the achievement
 */
function SimWin(what) {
  if (SimAchievements[what]) {
    if (SimAchievements[what].won === 0) {
      SimAchievements[what].won = 1;
      if (Game.Achievements[what].pool !== 'shadow') SimAchievementsOwned += 1;
    }
  }
}

;// CONCATENATED MODULE: ./src/Sim/Calculations/CalculateGains.js











/**
 * This function calculates the CPS of the current "sim data"
 * It is similar to Game.CalculateGains()
 * It is called at the start of any function that simulates certain behaviour or actions
 * @global	{number}	CM.Sim.cookiesPs	The CPS of the current sim data
 */
function CalculateGains() {
  SimCookiesPs = 0;
  let mult = 1;
  // Include minigame effects
  const effs = {};
  Object.keys(Game.Objects).forEach((i) => {
    if (Game.Objects[i].minigameLoaded && Game.Objects[i].minigame.effs) {
      const myEffs = Game.Objects[i].minigame.effs;
      Object.keys(myEffs).forEach((ii) => {
        if (effs[ii]) effs[ii] *= myEffs[ii];
        else effs[ii] = myEffs[ii];
      });
    }
  });
  SimEffs = effs;

  if (Game.ascensionMode !== 1)
    mult += parseFloat(SimPrestige) * 0.01 * SimHeavenlyPower * SimGetHeavenlyMultiplier();

  mult *= SimEff('cps');

  if (SimHas('Heralds') && Game.ascensionMode !== 1) mult *= 1 + 0.01 * Game.heralds;

  Object.keys(Game.cookieUpgrades).forEach((i) => {
    const me = Game.cookieUpgrades[i];
    if (SimHas(me.name)) {
      // Some upgrades have a functio as .power (notably the valentine cookies)
      // CM.Sim.InitialBuildingData has changed to use CM.Sim.Has instead of Game.Has etc.
      // Therefore this call is to the .power of the Sim.Object
      if (typeof me.power === 'function') {
        mult *= 1 + SimUpgrades[me.name].power(SimUpgrades[me.name]) * 0.01;
      } else mult *= 1 + me.power * 0.01;
    }
  });

  if (SimHas('Specialized chocolate chips')) mult *= 1.01;
  if (SimHas('Designer cocoa beans')) mult *= 1.02;
  if (SimHas('Underworld ovens')) mult *= 1.03;
  if (SimHas('Exotic nuts')) mult *= 1.04;
  if (SimHas('Arcane sugar')) mult *= 1.05;

  if (SimHas('Increased merriness')) mult *= 1.15;
  if (SimHas('Improved jolliness')) mult *= 1.15;
  if (SimHas('A lump of coal')) mult *= 1.01;
  if (SimHas('An itchy sweater')) mult *= 1.01;
  if (SimHas("Santa's dominion")) mult *= 1.2;

  if (SimHas('Fortune #100')) mult *= 1.01;
  if (SimHas('Fortune #101')) mult *= 1.07;

  if (SimHas('Dragon scale')) mult *= 1.03;

  // Check effect of chosen Gods
  let buildMult = 1;
  if (SimHasGod) {
    let godLvl = SimHasGod('asceticism');
    if (godLvl === 1) mult *= 1.15;
    else if (godLvl === 2) mult *= 1.1;
    else if (godLvl === 3) mult *= 1.05;

    godLvl = SimHasGod('ages');
    if (godLvl === 1)
      mult *= 1 + 0.15 * Math.sin((CycliusDateAtBeginLoop / 1000 / (60 * 60 * 3)) * Math.PI * 2);
    else if (godLvl === 2)
      mult *= 1 + 0.15 * Math.sin((CycliusDateAtBeginLoop / 1000 / (60 * 60 * 12)) * Math.PI * 2);
    else if (godLvl === 3)
      mult *= 1 + 0.15 * Math.sin((CycliusDateAtBeginLoop / 1000 / (60 * 60 * 24)) * Math.PI * 2);

    godLvl = SimHasGod('decadence');
    if (godLvl === 1) buildMult *= 0.93;
    else if (godLvl === 2) buildMult *= 0.95;
    else if (godLvl === 3) buildMult *= 0.98;

    godLvl = SimHasGod('industry');
    if (godLvl === 1) buildMult *= 1.1;
    else if (godLvl === 2) buildMult *= 1.06;
    else if (godLvl === 3) buildMult *= 1.03;

    godLvl = SimHasGod('labor');
    if (godLvl === 1) buildMult *= 0.97;
    else if (godLvl === 2) buildMult *= 0.98;
    else if (godLvl === 3) buildMult *= 0.99;
  }

  if (SimHas("Santa's legacy")) mult *= 1 + (Game.santaLevel + 1) * 0.03;

  const milkProgress = SimAchievementsOwned / 25;
  let milkMult = 1;
  if (SimHas("Santa's milk and cookies")) milkMult *= 1.05;
  // if (CM.Sim.hasAura('Breath of Milk')) milkMult *= 1.05;
  milkMult *= 1 + SimAuraMult('Breath of Milk') * 0.05;
  if (SimHasGod) {
    const godLvl = SimHasGod('mother');
    if (godLvl === 1) milkMult *= 1.1;
    else if (godLvl === 2) milkMult *= 1.05;
    else if (godLvl === 3) milkMult *= 1.03;
  }
  milkMult *= SimEff('milk');

  let catMult = 1;

  if (SimHas('Kitten helpers')) catMult *= 1 + milkProgress * 0.1 * milkMult;
  if (SimHas('Kitten workers')) catMult *= 1 + milkProgress * 0.125 * milkMult;
  if (SimHas('Kitten engineers')) catMult *= 1 + milkProgress * 0.15 * milkMult;
  if (SimHas('Kitten overseers')) catMult *= 1 + milkProgress * 0.175 * milkMult;
  if (SimHas('Kitten managers')) catMult *= 1 + milkProgress * 0.2 * milkMult;
  if (SimHas('Kitten accountants')) catMult *= 1 + milkProgress * 0.2 * milkMult;
  if (SimHas('Kitten specialists')) catMult *= 1 + milkProgress * 0.2 * milkMult;
  if (SimHas('Kitten experts')) catMult *= 1 + milkProgress * 0.2 * milkMult;
  if (SimHas('Kitten consultants')) catMult *= 1 + milkProgress * 0.2 * milkMult;
  if (SimHas('Kitten assistants to the regional manager'))
    catMult *= 1 + milkProgress * 0.175 * milkMult;
  if (SimHas('Kitten marketeers')) catMult *= 1 + milkProgress * 0.15 * milkMult;
  if (SimHas('Kitten analysts')) catMult *= 1 + milkProgress * 0.125 * milkMult;
  if (SimHas('Kitten executives')) catMult *= 1 + milkProgress * 0.115 * milkMult;
  if (SimHas('Kitten angels')) catMult *= 1 + milkProgress * 0.1 * milkMult;
  if (SimHas('Fortune #103')) catMult *= 1 + milkProgress * 0.05 * milkMult;

  Object.keys(SimObjects).forEach((i) => {
    const me = SimObjects[i];
    let storedCps = me.cps(me);
    if (Game.ascensionMode !== 1) storedCps *= (1 + me.level * 0.01) * buildMult;
    if (me.name === 'Grandma' && SimHas('Milkhelp&reg; lactose intolerance relief tablets'))
      storedCps *= 1 + 0.05 * milkProgress * milkMult;
    SimCookiesPs += me.amount * storedCps;
  });

  if (SimHas('"egg"')) SimCookiesPs += 9; // "egg"

  mult *= catMult;

  let eggMult = 1;
  if (SimHas('Chicken egg')) eggMult *= 1.01;
  if (SimHas('Duck egg')) eggMult *= 1.01;
  if (SimHas('Turkey egg')) eggMult *= 1.01;
  if (SimHas('Quail egg')) eggMult *= 1.01;
  if (SimHas('Robin egg')) eggMult *= 1.01;
  if (SimHas('Ostrich egg')) eggMult *= 1.01;
  if (SimHas('Cassowary egg')) eggMult *= 1.01;
  if (SimHas('Salmon roe')) eggMult *= 1.01;
  if (SimHas('Frogspawn')) eggMult *= 1.01;
  if (SimHas('Shark egg')) eggMult *= 1.01;
  if (SimHas('Turtle egg')) eggMult *= 1.01;
  if (SimHas('Ant larva')) eggMult *= 1.01;
  if (SimHas('Century egg')) {
    // The boost increases a little every day, with diminishing returns up to +10% on the 100th day
    let day =
      (Math.floor((CenturyDateAtBeginLoop - Game.startDate) / 1000 / 10) * 10) / 60 / 60 / 24;
    day = Math.min(day, 100);
    // Sets a Cache value to be displayed in the Stats page, could be moved...
    CacheCentEgg = 1 + (1 - (1 - day / 100) ** 3) * 0.1;
    eggMult *= CacheCentEgg;
  }
  mult *= eggMult;

  if (SimHas('Sugar baking')) mult *= 1 + Math.min(100, Game.lumps) * 0.01;

  // if (CM.Sim.hasAura('Radiant Appetite')) mult *= 2;
  mult *= 1 + SimAuraMult('Radiant Appetite');

  const rawCookiesPs = SimCookiesPs * mult;
  Object.keys(Game.CpsAchievements).forEach((i) => {
    if (rawCookiesPs >= Game.CpsAchievements[i].threshold) SimWin(Game.CpsAchievements[i].name);
  });

  SimCookiesPsRaw = rawCookiesPs;

  const { n } = Game.shimmerTypes.golden;
  const auraMult = SimAuraMult("Dragon's Fortune");
  for (let i = 0; i < n; i++) {
    mult *= 1 + auraMult * 1.23;
  }

  const name = Game.bakeryName.toLowerCase();
  if (name === 'orteil') mult *= 0.99;
  else if (name === 'ortiel') mult *= 0.98;

  if (SimHas('Elder Covenant')) mult *= 0.95;

  if (SimHas('Golden switch [off]')) {
    let goldenSwitchMult = 1.5;
    if (SimHas('Residual luck')) {
      const upgrades = Game.goldenCookieUpgrades;
      Object.keys(upgrades).forEach((i) => {
        if (SimHas(upgrades[i])) goldenSwitchMult += 0.1;
      });
    }
    mult *= goldenSwitchMult;
  }
  if (SimHas('Shimmering veil [off]')) {
    let veilMult = 0.5;
    if (SimHas('Reinforced membrane')) veilMult += 0.1;
    mult *= 1 + veilMult;
  }

  if (SimHas('Magic shenanigans')) mult *= 1000;
  if (SimHas('Occult obstruction')) mult *= 0;

  SimCookiesPs = Game.runModHookOnValue('cps', SimCookiesPs);

  mult *= GetCPSBuffMult();

  SimCookiesPs *= mult;

  // if (Game.hasBuff('Cursed finger')) Game.cookiesPs = 0;
}

;// CONCATENATED MODULE: ./src/Data/Gamedata.ts
/** Data copied directly from the game */
/** Array of the names of all fortune cookies obtainable from the ticker */
const Fortunes = [
    'Fortune #001',
    'Fortune #002',
    'Fortune #003',
    'Fortune #004',
    'Fortune #005',
    'Fortune #006',
    'Fortune #007',
    'Fortune #008',
    'Fortune #009',
    'Fortune #010',
    'Fortune #011',
    'Fortune #012',
    'Fortune #013',
    'Fortune #014',
    'Fortune #015',
    'Fortune #016',
    'Fortune #017',
    'Fortune #018',
    'Fortune #100',
    'Fortune #101',
    'Fortune #102',
    'Fortune #103',
    'Fortune #104',
];
/** Array of the names of all Halloween cookies */
const HalloCookies = [
    'Skull cookies',
    'Ghost cookies',
    'Bat cookies',
    'Slime cookies',
    'Pumpkin cookies',
    'Eyeball cookies',
    'Spider cookies',
];
/** Array of the names of all Christmas cookies */
const ChristCookies = [
    'Christmas tree biscuits',
    'Snowflake biscuits',
    'Snowman biscuits',
    'Holly biscuits',
    'Candy cane biscuits',
    'Bell biscuits',
    'Present biscuits',
];
/** Array of the names of all Valentine cookies */
const ValCookies = [
    'Pure heart biscuits',
    'Ardent heart biscuits',
    'Sour heart biscuits',
    'Weeping heart biscuits',
    'Golden heart biscuits',
    'Eternal heart biscuits',
    'Prism heart biscuits',
];
/** Array of the names of all plant drops */
const PlantDrops = [
    'Elderwort biscuits',
    'Bakeberry cookies',
    'Duketater cookies',
    'Green yeast digestives',
    'Wheat slims',
    'Fern tea',
    'Ichor syrup',
];
/** All possible effects plants and other items can have with a display-title */
const Effects = {
    buildingCost: 'Building prices',
    click: 'Cookies per click',
    cps: 'Total CPS',
    cursorCps: 'Cursor CPS',
    goldenCookieDur: 'Golden cookie duration',
    goldenCookieEffDur: 'Golden cookie effect duration',
    goldenCookieFreq: 'Golden cookie frequency',
    goldenCookieGain: 'Golden cookie gains',
    grandmaCps: 'Grandma CPS',
    itemDrops: 'Random item drop chance',
    milk: 'Effect from milk',
    reindeerDur: 'Reindeer duration',
    reindeerFreq: 'Reindeer frequency',
    reindeerGain: 'Reindeer gains',
    upgradeCost: 'Upgrade prices',
    wrathCookieDur: 'Wrath cookie duration',
    wrathCookieEffDur: 'Wrath cookie effect duration',
    wrathCookieFreq: 'Wrath cookie frequency',
    wrathCookieGain: 'Wrath cookie gains',
    wrinklerEat: 'Wrinkler ',
    wrinklerSpawn: 'Wrinkler spawn frequency',
};

;// CONCATENATED MODULE: ./src/Sim/ReplacedGameFunctions/SimHasAchiev.js


/**
 * This functions creates functions similarly to Game.HasAchiev but checks Sim Data instead of Game Data
 */
function SimHasAchiev(what) {
  return SimAchievements[what] ? SimAchievements[what].won : 0;
}

;// CONCATENATED MODULE: ./src/Sim/Calculations/CheckOtherAchiev.js






/**
 * This function calculates if any special achievements have been obtained
 * If so it SimWin()'s them and the caller function will know to recall CM.Sim.CalculateGains()
 * It is called at the end of any functions that simulates certain behaviour
 */
function CheckOtherAchiev() {
  let grandmas = 0;
  Object.keys(Game.GrandmaSynergies).forEach((i) => {
    if (SimHas(Game.GrandmaSynergies[i])) grandmas += 1;
  });
  if (!SimHasAchiev('Elder') && grandmas >= 7) SimWin('Elder');
  if (!SimHasAchiev('Veteran') && grandmas >= 14) SimWin('Veteran');

  let buildingsOwned = 0;
  let mathematician = 1;
  let base10 = 1;
  let minAmount = 100000;
  Object.keys(SimObjects).forEach((i) => {
    buildingsOwned += SimObjects[i].amount;
    minAmount = Math.min(SimObjects[i].amount, minAmount);
    if (!SimHasAchiev('Mathematician')) {
      if (
        SimObjects[i].amount <
        Math.min(128, 2 ** (Game.ObjectsById.length - Game.Objects[i].id - 1))
      )
        mathematician = 0;
    }
    if (!SimHasAchiev('Base 10')) {
      if (SimObjects[i].amount < (Game.ObjectsById.length - Game.Objects[i].id) * 10) base10 = 0;
    }
  });
  if (minAmount >= 1) SimWin('One with everything');
  if (mathematician === 1) SimWin('Mathematician');
  if (base10 === 1) SimWin('Base 10');
  if (minAmount >= 100) SimWin('Centennial');
  if (minAmount >= 150) SimWin('Centennial and a half');
  if (minAmount >= 200) SimWin('Bicentennial');
  if (minAmount >= 250) SimWin('Bicentennial and a half');
  if (minAmount >= 300) SimWin('Tricentennial');
  if (minAmount >= 350) SimWin('Tricentennial and a half');
  if (minAmount >= 400) SimWin('Quadricentennial');
  if (minAmount >= 450) SimWin('Quadricentennial and a half');
  if (minAmount >= 500) SimWin('Quincentennial');
  if (minAmount >= 550) SimWin('Quincentennial and a half');
  if (minAmount >= 600) SimWin('Sexcentennial');

  if (buildingsOwned >= 100) SimWin('Builder');
  if (buildingsOwned >= 500) SimWin('Architect');
  if (buildingsOwned >= 1000) SimWin('Engineer');
  if (buildingsOwned >= 2000) SimWin('Lord of Constructs');
  if (buildingsOwned >= 4000) SimWin('Grand design');
  if (buildingsOwned >= 8000) SimWin('Ecumenopolis');

  if (SimUpgradesOwned >= 20) SimWin('Enhancer');
  if (SimUpgradesOwned >= 50) SimWin('Augmenter');
  if (SimUpgradesOwned >= 100) SimWin('Upgrader');
  if (SimUpgradesOwned >= 200) SimWin('Lord of Progress');
  if (SimUpgradesOwned >= 300) SimWin('The full picture');
  if (SimUpgradesOwned >= 400) SimWin("When there's nothing left to add");

  if (buildingsOwned >= 4000 && SimUpgradesOwned >= 300) SimWin('Polymath');
  if (buildingsOwned >= 8000 && SimUpgradesOwned >= 400) SimWin('Renaissance baker');

  if (SimObjects.Cursor.amount + SimObjects.Grandma.amount >= 777) SimWin('The elder scrolls');

  let hasAllHalloCook = true;
  Object.keys(HalloCookies).forEach((i) => {
    if (!SimHas(HalloCookies[i])) hasAllHalloCook = false;
  });
  if (hasAllHalloCook) SimWin('Spooky cookies');

  let hasAllChristCook = true;
  Object.keys(ChristCookies).forEach((i) => {
    if (!SimHas(ChristCookies[i])) hasAllChristCook = false;
  });
  if (hasAllChristCook) SimWin('Let it snow');

  if (SimHas('Fortune cookies')) {
    const list = Game.Tiers.fortune.upgrades;
    let fortunes = 0;
    Object.keys(list).forEach((i) => {
      if (SimHas(list[i].name)) fortunes += 1;
    });
    if (fortunes >= list.length) SimWin('O Fortuna');
  }
}

;// CONCATENATED MODULE: ./src/Sim/SimulationEvents/BuyBuildingBonusIncome.js






/**
 * This function calculates the bonus income of buying a building
 * It is called by CM.Cache.CacheBuildingIncome()
 * @param	{string}	building	The name of the building to be bought
 * @param	{number}	amount		The amount to be bought
 * @returns {number}				The bonus income of the building
 */
function BuyBuildingsBonusIncome(building, amount) {
  CopyData();
  SimObjects[building].amount += amount;
  const me = SimObjects[building];

  if (building === 'Cursor') {
    if (me.amount >= 1) SimWin('Click');
    if (me.amount >= 2) SimWin('Double-click');
    if (me.amount >= 50) SimWin('Mouse wheel');
    if (me.amount >= 100) SimWin('Of Mice and Men');
    if (me.amount >= 200) SimWin('The Digital');
    if (me.amount >= 300) SimWin('Extreme polydactyly');
    if (me.amount >= 400) SimWin('Dr. T');
    if (me.amount >= 500) SimWin('Thumbs, phalanges, metacarpals');
    if (me.amount >= 600) SimWin('With her finger and her thumb');
    if (me.amount >= 700) SimWin('Gotta hand it to you');
    if (me.amount >= 800) SimWin("The devil's workshop");
  } else {
    Object.keys(Game.Objects[me.name].tieredAchievs).forEach((j) => {
      if (me.amount >= Game.Tiers[Game.Objects[me.name].tieredAchievs[j].tier].achievUnlock) {
        SimWin(Game.Objects[me.name].tieredAchievs[j].name);
      }
    });
  }

  const lastAchievementsOwned = SimAchievementsOwned;

  CalculateGains();

  CheckOtherAchiev();

  if (lastAchievementsOwned !== SimAchievementsOwned) {
    CalculateGains();
  }

  return SimCookiesPs - Game.cookiesPs;
}

;// CONCATENATED MODULE: ./src/Disp/Tooltips/TypesOfTooltips/Building.js













/**
 * This function adds extra info to the Building tooltips
 */
function Building() {
  if (
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TooltipBuildUpgrade === 1 &&
    Game.buyMode === 1
  ) {
    const tooltipBox = l('CMTooltipBorder');
    TooltipCreateCalculationSection(tooltipBox);

    let target;
    if (Game.buyMode === 1) {
      LastTargetTooltipBuilding = target;
    } else {
      target = LastTargetTooltipBuilding;
    }
    if (Game.buyBulk === 1) target = CacheObjects1;
    else if (Game.buyBulk === 10) target = CacheObjects10;
    else if (Game.buyBulk === 100) target = CacheObjects100;

    TooltipPrice = Game.Objects[TooltipName].bulkPrice;
    TooltipBonusIncome = target[TooltipName].bonus;

    if (
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TooltipBuildUpgrade ===
        1 &&
      Game.buyMode === 1
    ) {
      l('CMTooltipIncome').textContent = Beautify_Beautify(TooltipBonusIncome, 2);
      const increase = Math.round((TooltipBonusIncome / Game.cookiesPs) * 10000);
      if (Number.isFinite(increase) && increase !== 0) {
        l('CMTooltipIncome').textContent += ` (${increase / 100}% of income)`;
      } else {
        l('CMTooltipIncome').textContent += ` (<0${
          Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.ScaleSeparator
            ? ','
            : '.'
        }01% of income)`;
      }
      l('CMTooltipBorder').className = ColourTextPre + target[TooltipName].color;
      if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.PPDisplayTime)
        l('CMTooltipPP').textContent = FormatTime(target[TooltipName].pp);
      else l('CMTooltipPP').textContent = Beautify_Beautify(target[TooltipName].pp, 2);
      l('CMTooltipPP').className = ColourTextPre + target[TooltipName].color;
      const timeColour = GetTimeColour(
        (TooltipPrice - (Game.cookies + GetWrinkConfigBank())) / GetCPS(),
      );
      l('CMTooltipTime').textContent = timeColour.text;
      if (timeColour.text === 'Done!' && Game.cookies < target[TooltipName].price) {
        l('CMTooltipTime').textContent = `${timeColour.text} (with Wrink)`;
      } else l('CMTooltipTime').textContent = timeColour.text;
      l('CMTooltipTime').className = ColourTextPre + timeColour.color;
    }

    // Add "production left till next achievement"-bar
    l('CMTooltipProductionLeftHeader').style.display = 'none';
    l('CMTooltipTime').style.marginBottom = '0px';

    // eslint-disable-next-line no-restricted-syntax
    for (const i of Object.keys(Game.Objects[TooltipName].productionAchievs)) {
      if (!Game.HasAchiev(Game.Objects[TooltipName].productionAchievs[i].achiev.name)) {
        const nextProductionAchiev = Game.Objects[TooltipName].productionAchievs[i];
        l('CMTooltipTime').style.marginBottom = '4px';
        l('CMTooltipProductionLeftHeader').style.display = '';
        l('CMTooltipProductionLeft').className = `ProdAchievement${TooltipName}`;
        l('CMTooltipProductionLeft').textContent = Beautify_Beautify(
          nextProductionAchiev.pow - SimObjects[TooltipName].totalCookies,
          15,
        );
        l('CMTooltipProductionLeft').style.color = 'white';
        break;
      }
    }

    const ObjectsTillNext = CacheObjectsNextAchievement[TooltipName];
    if (ObjectsTillNext.AmountNeeded < 101) {
      l('CMTooltipProductionLeft').style.marginBottom = '4px';
      l('CMTooltipNextAchievementHeader').style.display = '';

      let PPOfAmount;
      if (Game.cookiesPs) {
        PPOfAmount =
          Math.max(ObjectsTillNext.price - (Game.cookies + GetWrinkConfigBank()), 0) /
            Game.cookiesPs +
          ObjectsTillNext.price /
            BuyBuildingsBonusIncome(TooltipName, ObjectsTillNext.AmountNeeded);
      } else
        PPOfAmount =
          ObjectsTillNext.price /
          BuyBuildingsBonusIncome(TooltipName, ObjectsTillNext.AmountNeeded);

      l('CMTooltipNextAchievement').textContent = `${Beautify_Beautify(
        ObjectsTillNext.AmountNeeded,
      )} / ${Beautify_Beautify(ObjectsTillNext.price)} / `;
      l('CMTooltipNextAchievement').style.color = 'white';
      const PPFrag = document.createElement('span');
      if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.PPDisplayTime)
        PPFrag.textContent = FormatTime(PPOfAmount);
      else PPFrag.textContent = Beautify_Beautify(PPOfAmount);
      PPFrag.className = ColourTextPre + ColourOfPP({ pp: PPOfAmount }, ObjectsTillNext.price);
      l('CMTooltipNextAchievement').appendChild(PPFrag);
    } else {
      l('CMTooltipNextAchievementHeader').style.display = 'none';
      l('CMTooltipProductionLeft').style.marginBottom = '0px';
    }
  } else l('CMTooltipArea').style.display = 'none';
}

;// CONCATENATED MODULE: ./src/Disp/Tooltips/TypesOfTooltips/GardenPlots.js




/**
 * This function adds extra info to the Garden plots tooltips
 * It adds to the additional information to l('CMTooltipArea')
 */
function GardenPlots() {
  const { minigame } = Game.Objects.Farm;
  if (
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TooltipPlots &&
    minigame.plot[TooltipName[1]][TooltipName[0]][0] !== 0
  ) {
    const mature =
      minigame.plot[TooltipName[1]][TooltipName[0]][1] >
      minigame.plantsById[minigame.plot[TooltipName[1]][TooltipName[0]][0] - 1].mature;
    const plantName =
      minigame.plantsById[minigame.plot[TooltipName[1]][TooltipName[0]][0] - 1].name;
    l('CMTooltipBorder').appendChild(TooltipCreateHeader('Reward (Current / Maximum)'));
    const reward = document.createElement('div');
    reward.id = 'CMTooltipPlantReward';
    l('CMTooltipBorder').appendChild(reward);
    if (plantName === 'Bakeberry') {
      l('CMTooltipPlantReward').textContent = `${
        mature ? Beautify_Beautify(Math.min(Game.cookies * 0.03, Game.cookiesPs * 60 * 30)) : '0'
      } / ${Beautify_Beautify(Game.cookiesPs * 60 * 30)}`;
    } else if (plantName === 'Chocoroot' || plantName === 'White chocoroot') {
      l('CMTooltipPlantReward').textContent = `${
        mature ? Beautify_Beautify(Math.min(Game.cookies * 0.03, Game.cookiesPs * 60 * 3)) : '0'
      } / ${Beautify_Beautify(Game.cookiesPs * 60 * 3)}`;
    } else if (plantName === 'Queenbeet') {
      l('CMTooltipPlantReward').textContent = `${
        mature ? Beautify_Beautify(Math.min(Game.cookies * 0.04, Game.cookiesPs * 60 * 60)) : '0'
      } / ${Beautify_Beautify(Game.cookiesPs * 60 * 60)}`;
    } else if (plantName === 'Duketater') {
      l('CMTooltipPlantReward').textContent = `${
        mature ? Beautify_Beautify(Math.min(Game.cookies * 0.08, Game.cookiesPs * 60 * 120)) : '0'
      } / ${Beautify_Beautify(Game.cookiesPs * 60 * 120)}`;
    } else l('CMTooltipArea').style.display = 'none';
  } else l('CMTooltipArea').style.display = 'none';
}

;// CONCATENATED MODULE: ./src/Disp/HelperFunctions/CalculateGrimoireRefillTime.js
/**
 * This function calculates the time it takes to reach a certain magic level
 * @param	{number}	currentMagic		The current magic level
 * @param	{number}	maxMagic			The user's max magic level
 * @param	{number}	targetMagic			The target magic level
 * @returns	{number}	count / Game.fps	The time it takes to reach targetMagic
 */
function CalculateGrimoireRefillTime(currentMagic, maxMagic, targetMagic) {
  let magic = currentMagic;
  let count = 0;
  while (magic < targetMagic) {
    magic += Math.max(0.002, (magic / Math.max(maxMagic, 100)) ** 0.5) * 0.002;
    count += 1;
  }
  return count / Game.fps;
}

;// CONCATENATED MODULE: ./src/Disp/Tooltips/TypesOfTooltips/Grimoire.js









/**
 * This function adds extra info to the Grimoire tooltips
 * It adds to the additional information to l('CMTooltipArea')
 */
function Grimoire() {
  const { minigame } = Game.Objects['Wizard tower'];
  const spellCost = minigame.getSpellCost(minigame.spellsById[TooltipName]);

  if (
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TooltipGrim === 1 &&
    spellCost <= minigame.magicM
  ) {
    const tooltipBox = l('CMTooltipBorder');

    // Time left till enough magic for spell
    tooltipBox.appendChild(TooltipCreateHeader('Time Left'));
    const time = document.createElement('div');
    time.id = 'CMTooltipTime';
    tooltipBox.appendChild(time);
    const timeColour = GetTimeColour(
      CalculateGrimoireRefillTime(minigame.magic, minigame.magicM, spellCost),
    );
    time.textContent = timeColour.text;
    time.className = ColourTextPre + timeColour.color;

    // Time left untill magic spent is recovered
    if (spellCost <= minigame.magic) {
      tooltipBox.appendChild(TooltipCreateHeader('Recover Time'));
      const recover = document.createElement('div');
      recover.id = 'CMTooltipRecover';
      tooltipBox.appendChild(recover);
      const recoverColour = GetTimeColour(
        CalculateGrimoireRefillTime(
          Math.max(0, minigame.magic - spellCost),
          minigame.magicM,
          minigame.magic,
        ),
      );
      recover.textContent = recoverColour.text;
      recover.className = ColourTextPre + recoverColour.color;
    }

    // Extra information on cookies gained when spell is Conjure Baked Goods (Name === 0)
    if (TooltipName === '0') {
      tooltipBox.appendChild(TooltipCreateHeader('Cookies to be gained/lost'));
      const conjure = document.createElement('div');
      conjure.id = 'x';
      tooltipBox.appendChild(conjure);
      const reward = document.createElement('span');
      reward.style.color = '#33FF00';
      reward.textContent = Beautify_Beautify(
        Math.min(
          (Game.cookies + GetWrinkConfigBank()) * 0.15,
          CacheNoGoldSwitchCookiesPS * 60 * 30,
        ),
        2,
      );
      conjure.appendChild(reward);
      const seperator = document.createElement('span');
      seperator.textContent = ' / ';
      conjure.appendChild(seperator);
      const loss = document.createElement('span');
      loss.style.color = 'red';
      loss.textContent = Beautify_Beautify(CacheNoGoldSwitchCookiesPS * 60 * 15, 2);
      conjure.appendChild(loss);
    }

    l('CMTooltipArea').appendChild(tooltipBox);
  } else l('CMTooltipArea').style.display = 'none';
}

;// CONCATENATED MODULE: ./src/Disp/Tooltips/TypesOfTooltips/HarvestAll.js



/**
 * This function adds extra info to the Garden Harvest All tooltip
 * It is called when the Harvest All tooltip is created or refreshed by CM.Disp.UpdateTooltip()
 * It adds to the additional information to l('CMTooltipArea')
 */
function HarvestAll() {
  const { minigame } = Game.Objects.Farm;
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TooltipLump) {
    l('CMTooltipBorder').appendChild(TooltipCreateHeader('Cookies gained from harvesting:'));
    let totalGain = 0;
    let mortal = 0;
    if (Game.keys[16] && Game.keys[17]) mortal = 1;
    for (let y = 0; y < 6; y++) {
      for (let x = 0; x < 6; x++) {
        if (minigame.plot[y][x][0] >= 1) {
          const tile = minigame.plot[y][x];
          const me = minigame.plantsById[tile[0] - 1];
          const plantName = me.name;

          let count = true;
          if (mortal && me.immortal) count = false;
          if (tile[1] < me.matureBase) count = false;
          if (count && plantName === 'Bakeberry') {
            totalGain += Math.min(Game.cookies * 0.03, Game.cookiesPs * 60 * 30);
          } else if ((count && plantName === 'Chocoroot') || plantName === 'White chocoroot') {
            totalGain += Math.min(Game.cookies * 0.03, Game.cookiesPs * 60 * 3);
          } else if (count && plantName === 'Queenbeet') {
            totalGain += Math.min(Game.cookies * 0.04, Game.cookiesPs * 60 * 60);
          } else if (count && plantName === 'Duketater') {
            totalGain += Math.min(Game.cookies * 0.08, Game.cookiesPs * 60 * 120);
          }
        }
      }
    }
    l('CMTooltipBorder').appendChild(document.createTextNode(Beautify_Beautify(totalGain)));
  } else l('CMTooltipArea').style.display = 'none';
}

;// CONCATENATED MODULE: ./src/Disp/Tooltips/TypesOfTooltips/PantheonGods.js





/**
 * This function adds extra info to the Pantheon Gods tooltip
 * It is called when the Harvest All tooltip is created or refreshed by CM.Disp.UpdateTooltip()
 * It adds to the additional information to l('CMTooltipArea')
 */
function PantheonGods() {
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TooltipPantheon === 1) {
    const tooltipBox = l('CMTooltipBorder');
    let GodID;
    if (TooltipType === 'pas') GodID = TooltipName[1];
    else GodID = TooltipName;

    // Time left till enough magic for spell
    tooltipBox.appendChild(TooltipCreateHeader('Effect in position 1:'));
    const cps1 = document.createElement('div');
    cps1.id = 'CMPantheonTooltipPosition1';
    if (CacheGods[GodID][0] !== 0) {
      cps1.textContent = Beautify_Beautify(CacheGods[GodID][0]);
      const increase = Math.round((CacheGods[GodID][0] / Game.cookiesPs) * 10000);
      if (Number.isFinite(increase) && increase !== 0) {
        cps1.textContent += ` (${increase / 100}% of income)`;
      } else {
        cps1.textContent += ` (<0${
          Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.ScaleSeparator
            ? ','
            : '.'
        }01% of income)`;
      }
    } else cps1.textContent = 'No effect to CPS';
    tooltipBox.appendChild(cps1);

    tooltipBox.appendChild(TooltipCreateHeader('Effect in position 2:'));
    const cps2 = document.createElement('div');
    cps2.id = 'CMPantheonTooltipPosition2';
    if (CacheGods[GodID][1] !== 0) {
      cps2.textContent = Beautify_Beautify(CacheGods[GodID][1]);
      const increase = Math.round((CacheGods[GodID][1] / Game.cookiesPs) * 10000);
      if (Number.isFinite(increase) && increase !== 0) {
        cps2.textContent += ` (${increase / 100}% of income)`;
      } else {
        cps2.textContent += ` (<0${
          Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.ScaleSeparator
            ? ','
            : '.'
        }01% of income)`;
      }
    } else cps2.textContent = 'No effect to CPS';
    tooltipBox.appendChild(cps2);

    tooltipBox.appendChild(TooltipCreateHeader('Effect in position 3:'));
    const cps3 = document.createElement('div');
    cps3.id = 'CMPantheonTooltipPosition2';
    if (CacheGods[GodID][2] !== 0) {
      cps3.textContent = Beautify_Beautify(CacheGods[GodID][2]);
      const increase = Math.round((CacheGods[GodID][2] / Game.cookiesPs) * 10000);
      if (Number.isFinite(increase) && increase !== 0) {
        cps3.textContent += ` (${increase / 100}% of income)`;
      } else {
        cps3.textContent += ` (<0${
          Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.ScaleSeparator
            ? ','
            : '.'
        }01% of income)`;
      }
    } else cps3.textContent = 'No effect to CPS';
    tooltipBox.appendChild(cps3);

    l('CMTooltipArea').appendChild(tooltipBox);
  } else l('CMTooltipArea').style.display = 'none';
}

;// CONCATENATED MODULE: ./src/Disp/HelperFunctions/GetLumpColour.js


/**
 * This function returns Name and Colour as object for sugar lump type that is given as input param.
 * It is called by CM.Disp.UpdateTooltipSugarLump()
 * @param 	{string} 				type 			Sugar Lump Type.
 * @returns {{string}, {string}}	text, color		An array containing the text and display-color of the sugar lump
 */
function GetLumpColour(type) {
  if (type === 0) {
    return { text: 'Normal', color: ColourGray };
  }
  if (type === 1) {
    return { text: 'Bifurcated', color: ColourGreen };
  }
  if (type === 2) {
    return { text: 'Golden', color: ColourYellow };
  }
  if (type === 3) {
    return { text: 'Meaty', color: ColourOrange };
  }
  if (type === 4) {
    return { text: 'Caramelized', color: ColourPurple };
  }
  return { text: 'Unknown Sugar Lump', color: ColourRed };
}

;// CONCATENATED MODULE: ./src/Disp/Tooltips/TypesOfTooltips/SugarLump.js



/**
 * This function adds extra info to the Sugar Lump tooltip
 * It adds to the additional information to l('CMTooltipArea')
 */
function SugarLump() {
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TooltipLump === 1) {
    const tooltipBox = l('CMTooltipBorder');

    tooltipBox.appendChild(TooltipCreateHeader('Current Sugar Lump'));

    const lumpType = document.createElement('div');
    lumpType.id = 'CMTooltipTime';
    tooltipBox.appendChild(lumpType);
    const lumpColour = GetLumpColour(Game.lumpCurrentType);
    lumpType.textContent = lumpColour.text;
    lumpType.className = ColourTextPre + lumpColour.color;
  } else l('CMTooltipArea').style.display = 'none';
}

;// CONCATENATED MODULE: ./src/Disp/Tooltips/TypesOfTooltips/Upgrade.js










/**
 * This function adds extra info to the Upgrade tooltips
 */
function Upgrade() {
  const tooltipBox = l('CMTooltipBorder');
  TooltipCreateCalculationSection(tooltipBox);

  TooltipBonusIncome = CacheUpgrades[Game.UpgradesInStore[TooltipName].name].bonus;
  TooltipPrice = Game.Upgrades[Game.UpgradesInStore[TooltipName].name].getPrice();
  TooltipBonusMouse = CacheUpgrades[Game.UpgradesInStore[TooltipName].name].bonusMouse;

  if (
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TooltipBuildUpgrade === 1
  ) {
    l('CMTooltipIncome').textContent = Beautify_Beautify(TooltipBonusIncome, 2);
    const increase = Math.round((TooltipBonusIncome / Game.cookiesPs) * 10000);
    // Don't display certain parts of tooltip if not applicable
    if (l('CMTooltipIncome').textContent === '0') {
      l('Bonus IncomeTitle').style.display = 'none';
      l('CMTooltipIncome').style.display = 'none';
      l('Payback PeriodTitle').style.display = 'none';
      l('CMTooltipPP').style.display = 'none';
    } else {
      if (Number.isFinite(increase) && increase !== 0) {
        l('CMTooltipIncome').textContent += ` (${increase / 100}% of income)`;
      } else {
        l('CMTooltipIncome').textContent += ` (<0${
          Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.ScaleSeparator
            ? ','
            : '.'
        }01% of income)`;
      }
      l('CMTooltipBorder').className =
        ColourTextPre + CacheUpgrades[Game.UpgradesInStore[TooltipName].name].color;
    }

    // If clicking power upgrade
    if (TooltipBonusMouse) {
      l('CMTooltipCookiePerClick').textContent = Beautify_Beautify(TooltipBonusMouse);
      l('CMTooltipCookiePerClick').style.display = 'block';
      l('CMTooltipCookiePerClick').previousSibling.style.display = 'block';
    }
    // If only a clicking power upgrade change PP to click-based period
    if (!TooltipBonusIncome && TooltipBonusMouse) {
      l('CMTooltipPP').textContent = `${Beautify_Beautify(TooltipPrice / TooltipBonusMouse)} Clicks`;
      l('CMTooltipPP').style.color = 'white';
      l('Payback PeriodTitle').style.display = 'block';
      l('CMTooltipPP').style.display = 'block';
    } else {
      if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.PPDisplayTime)
        l('CMTooltipPP').textContent = FormatTime(
          CacheUpgrades[Game.UpgradesInStore[TooltipName].name].pp,
        );
      else
        l('CMTooltipPP').textContent = Beautify_Beautify(
          CacheUpgrades[Game.UpgradesInStore[TooltipName].name].pp,
          2,
        );
      l('CMTooltipPP').className =
        ColourTextPre + CacheUpgrades[Game.UpgradesInStore[TooltipName].name].color;
    }
    const timeColour = GetTimeColour(
      (TooltipPrice - (Game.cookies + GetWrinkConfigBank())) / GetCPS(),
    );
    l('CMTooltipTime').textContent = timeColour.text;
    if (
      timeColour.text === 'Done!' &&
      Game.cookies < Game.UpgradesInStore[TooltipName].getPrice()
    ) {
      l('CMTooltipTime').textContent = `${timeColour.text} (with Wrink)`;
    } else l('CMTooltipTime').textContent = timeColour.text;
    l('CMTooltipTime').className = ColourTextPre + timeColour.color;

    // Add extra info to Chocolate egg tooltip
    if (Game.UpgradesInStore[TooltipName].name === 'Chocolate egg') {
      l('CMTooltipBorder').lastChild.style.marginBottom = '4px';
      l('CMTooltipBorder').appendChild(
        TooltipCreateHeader('Cookies to be gained (Currently/Max)'),
      );
      const chocolate = document.createElement('div');
      chocolate.style.color = 'white';
      chocolate.textContent = `${Beautify_Beautify(Game.cookies * 0.05)} / ${Beautify_Beautify(CacheLastChoEgg)}`;
      l('CMTooltipBorder').appendChild(chocolate);
    }
  } else l('CMTooltipArea').style.display = 'none';
}

;// CONCATENATED MODULE: ./src/Config/Toggles/ToggleToolWarnPos.js
/**
 * This function toggles the position of the warnings created by CM.Disp.TooltipCreateWarningSection()
 * It is called by a change in CM.Options.ToolWarnPos
 * and upon creation of the warning tooltip by CM.Disp.UpdateTooltipWarnings()
 */
function ToggleToolWarnPos() {
  if (l('CMDispTooltipWarningParent') !== null) {
    if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.ToolWarnPos === 0) {
      l('CMDispTooltipWarningParent').style.top = 'auto';
      l('CMDispTooltipWarningParent').style.margin = '4px -4px';
      l('CMDispTooltipWarningParent').style.padding = '3px 4px';
    } else {
      l('CMDispTooltipWarningParent').style.right = 'auto';
      l('CMDispTooltipWarningParent').style.margin = '4px';
      l('CMDispTooltipWarningParent').style.padding = '4px 3px';
    }
  }
}

;// CONCATENATED MODULE: ./src/Disp/Tooltips/TypesOfTooltips/Warnings.js










/**
 * This function updates the warnings section of the building and upgrade tooltips
 */
function Warnings() {
  if (TooltipType === 'b' || TooltipType === 'u') {
    if (document.getElementById('CMDispTooltipWarningParent') === null) {
      l('tooltipAnchor').appendChild(TooltipCreateWarningSection());
      ToggleToolWarnPos();
    }

    if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.ToolWarnPos === 0)
      l('CMDispTooltipWarningParent').style.right = '0px';
    else l('CMDispTooltipWarningParent').style.top = `${l('tooltip').offsetHeight}px`;

    l('CMDispTooltipWarningParent').style.width = `${l('tooltip').offsetWidth - 6}px`;

    const amount = Game.cookies + GetWrinkConfigBank() - TooltipPrice;
    const bonusIncomeUsed = Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings
      .ToolWarnBon
      ? TooltipBonusIncome
      : 0;
    let limitLucky = CacheLucky;
    if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.ToolWarnBon === 1) {
      let bonusNoFren = TooltipBonusIncome;
      bonusNoFren /= GetCPSBuffMult();
      limitLucky += (bonusNoFren * 60 * 15) / 0.15;
    }

    if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.ToolWarnLucky === 1) {
      if (amount < limitLucky && (TooltipType !== 'b' || Game.buyMode === 1)) {
        l('CMDispTooltipWarnLucky').style.display = '';
        l('CMDispTooltipWarnLuckyText').textContent = `${Beautify_Beautify(
          limitLucky - amount,
        )} (${FormatTime((limitLucky - amount) / (GetCPS() + bonusIncomeUsed))})`;
      } else l('CMDispTooltipWarnLucky').style.display = 'none';
    } else l('CMDispTooltipWarnLucky').style.display = 'none';

    if (
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.ToolWarnLuckyFrenzy === 1
    ) {
      const limitLuckyFrenzy = limitLucky * 7;
      if (amount < limitLuckyFrenzy && (TooltipType !== 'b' || Game.buyMode === 1)) {
        l('CMDispTooltipWarnLuckyFrenzy').style.display = '';
        l('CMDispTooltipWarnLuckyFrenzyText').textContent = `${Beautify_Beautify(
          limitLuckyFrenzy - amount,
        )} (${FormatTime((limitLuckyFrenzy - amount) / (GetCPS() + bonusIncomeUsed))})`;
      } else l('CMDispTooltipWarnLuckyFrenzy').style.display = 'none';
    } else l('CMDispTooltipWarnLuckyFrenzy').style.display = 'none';

    if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.ToolWarnConjure === 1) {
      const limitConjure = limitLucky * 2;
      if (amount < limitConjure && (TooltipType !== 'b' || Game.buyMode === 1)) {
        l('CMDispTooltipWarnConjure').style.display = '';
        l('CMDispTooltipWarnConjureText').textContent = `${Beautify_Beautify(
          limitConjure - amount,
        )} (${FormatTime((limitConjure - amount) / (GetCPS() + bonusIncomeUsed))})`;
      } else l('CMDispTooltipWarnConjure').style.display = 'none';
    } else l('CMDispTooltipWarnConjure').style.display = 'none';

    if (
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.ToolWarnConjureFrenzy ===
      1
    ) {
      const limitConjureFrenzy = limitLucky * 2 * 7;
      if (amount < limitConjureFrenzy && (TooltipType !== 'b' || Game.buyMode === 1)) {
        l('CMDispTooltipWarnConjureFrenzy').style.display = '';
        l('CMDispTooltipWarnConjureFrenzyText').textContent = `${Beautify_Beautify(
          limitConjureFrenzy - amount,
        )} (${FormatTime((limitConjureFrenzy - amount) / (GetCPS() + bonusIncomeUsed))})`;
      } else l('CMDispTooltipWarnConjureFrenzy').style.display = 'none';
    } else l('CMDispTooltipWarnConjureFrenzy').style.display = 'none';

    if (
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.ToolWarnEdifice === 1 &&
      Game.Objects['Wizard tower'].minigameLoaded
    ) {
      if (CacheEdifice && amount < CacheEdifice && (TooltipType !== 'b' || Game.buyMode === 1)) {
        l('CMDispTooltipWarnEdifice').style.display = '';
        l('CMDispTooltipWarnEdificeText').textContent = `${Beautify_Beautify(
          CacheEdifice - amount,
        )} (${FormatTime((CacheEdifice - amount) / (GetCPS() + bonusIncomeUsed))})`;
      } else l('CMDispTooltipWarnEdifice').style.display = 'none';
    } else l('CMDispTooltipWarnEdifice').style.display = 'none';

    if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.ToolWarnUser > 0) {
      if (
        amount <
          Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.ToolWarnUser *
            GetCPS() &&
        (TooltipType !== 'b' || Game.buyMode === 1)
      ) {
        l('CMDispTooltipWarnUser').style.display = '';
        // Need to update tooltip text dynamically
        l(
          'CMDispTooltipWarnUser',
        ).children[0].textContent = `Purchase of this item will put you under the number of Cookies equal to ${Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.ToolWarnUser} seconds of CPS`;
        l('CMDispTooltipWarnUserText').textContent = `${Beautify_Beautify(
          Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.ToolWarnUser *
            GetCPS() -
            amount,
        )} (${FormatTime(
          (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.ToolWarnUser *
            GetCPS() -
            amount) /
            (GetCPS() + bonusIncomeUsed),
        )})`;
      } else l('CMDispTooltipWarnUser').style.display = 'none';
    } else l('CMDispTooltipWarnUser').style.display = 'none';
  } else if (l('CMDispTooltipWarningParent') !== null) {
    l('CMDispTooltipWarningParent').remove();
  }
}

;// CONCATENATED MODULE: ./src/Disp/Tooltips/TypesOfTooltips/WrinklerButton.js





/**
 * This function adds extra info to the wrinkler button tooltip
 * It adds to the additional information to l('CMTooltipArea')
 */
function WrinklerButton() {
  l('tooltip').innerHTML = '';
  l('tooltip').appendChild(TooltipCreateHeader('Reward:'));

  const WrinklerReward = document.createElement('div');
  WrinklerReward.id = 'CMWrinklerReward';
  if (TooltipName === 'PopAllNormal') {
    WrinklerReward.textContent = Beautify_Beautify(CacheWrinklersNormal);
  } else if (TooltipName === 'PopFattest') {
    WrinklerReward.textContent = Beautify_Beautify(CacheWrinklersFattest[0]);
  }

  l('tooltip').appendChild(WrinklerReward);
}

;// CONCATENATED MODULE: ./src/Disp/Tooltips/UpdateTooltips.js













/**
 * This function updates the sections of the tooltips created by CookieMonster
 */
function UpdateTooltips() {
  CopyData();
  if (l('tooltipAnchor').style.display !== 'none' && l('CMTooltipArea')) {
    l('CMTooltipArea').innerHTML = '';
    const tooltipBox = TooltipCreateTooltipBox();
    l('CMTooltipArea').appendChild(tooltipBox);

    if (TooltipType === 'b') {
      Building();
    } else if (TooltipType === 'u') {
      Upgrade();
    } else if (TooltipType === 's') {
      SugarLump();
    } else if (TooltipType === 'g') {
      Grimoire();
    } else if (TooltipType === 'p') {
      GardenPlots();
    } else if (TooltipType === 'ha') {
      HarvestAll();
    } else if (TooltipType === 'wb') {
      WrinklerButton();
    } else if (TooltipType === 'pag' || (TooltipType === 'pas' && TooltipName[1] !== -1)) {
      PantheonGods();
    }
    Warnings();
  } else if (l('CMTooltipArea') === null) {
    // Remove warnings if its a basic tooltip
    if (l('CMDispTooltipWarningParent') !== null) {
      l('CMDispTooltipWarningParent').remove();
    }
  }
}

;// CONCATENATED MODULE: ./src/Disp/Tooltips/WrinklerTooltips.js




/**
 * This function checks and create a tooltip for the wrinklers
 * It is called by CM.Disp.Draw()
 * As wrinklers are not appended to the DOM we us a different system than for other tooltips
 */
function CheckWrinklerTooltip() {
  if (
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TooltipWrink === 1 &&
    TooltipWrinklerArea === 1
  ) {
    // Latter is set by CM.Main.AddWrinklerAreaDetect
    let showingTooltip = false;
    Object.keys(Game.wrinklers).forEach((i) => {
      const me = Game.wrinklers[i];
      if (me.phase > 0 && me.selected) {
        showingTooltip = true;
        if (TooltipWrinklerBeingShown[i] === 0 || TooltipWrinklerBeingShown[i] === undefined) {
          const placeholder = document.createElement('div');
          const wrinkler = document.createElement('div');
          wrinkler.style.minWidth = '120px';
          wrinkler.style.marginBottom = '4px';
          const div = document.createElement('div');
          div.style.textAlign = 'center';
          div.id = 'CMTooltipWrinkler';
          wrinkler.appendChild(div);
          placeholder.appendChild(wrinkler);
          Game.tooltip.draw(this, escape(placeholder.innerHTML));
          TooltipWrinkler = i;
          TooltipWrinklerBeingShown[i] = 1;
        }
      } else {
        TooltipWrinklerBeingShown[i] = 0;
      }
    });
    if (!showingTooltip) {
      Game.tooltip.hide();
    }
  }
}

/**
 * This function updates the amount to be displayed by the wrinkler tooltip created by CM.Disp.CheckWrinklerTooltip()
 * It is called by CM.Disp.Draw()
 * As wrinklers are not appended to the DOM we us a different system than for other tooltips
 */
function UpdateWrinklerTooltip() {
  if (
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TooltipWrink === 1 &&
    l('CMTooltipWrinkler') !== null
  ) {
    let { sucked } = Game.wrinklers[TooltipWrinkler];
    let toSuck = 1.1;
    if (Game.Has('Sacrilegious corruption')) toSuck *= 1.05;
    if (Game.wrinklers[TooltipWrinkler].type === 1) toSuck *= 3; // Shiny wrinklers
    sucked *= toSuck;
    if (Game.Has('Wrinklerspawn')) sucked *= 1.05;
    if (SimObjects.Temple.minigameLoaded) {
      const godLvl = Game.hasGod('scorn');
      if (godLvl === 1) sucked *= 1.15;
      else if (godLvl === 2) sucked *= 1.1;
      else if (godLvl === 3) sucked *= 1.05;
    }
    l('CMTooltipWrinkler').textContent = Beautify_Beautify(sucked);
  }
}

;// CONCATENATED MODULE: ./src/Disp/DrawHook.js











/**
 * This function handles all custom drawing for the Game.Draw() function.
 * It is hooked on 'draw' by CM.RegisterHooks()
 */
function CMDrawHook() {
  // Draw autosave timer in stats menu, this must be done here to make it count down correctly
  if (
    Game.prefs.autosave &&
    Game.drawT % 10 === 0 && // with autosave ON and every 10 ticks
    Game.onMenu === 'stats' &&
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.Stats // while being on the stats menu only
  ) {
    const timer = document.getElementById('CMStatsAutosaveTimer');
    if (timer) {
      timer.innerText = Game.sayTime(Game.fps * 60 - (Game.T % (Game.fps * 60)), 4);
    }
  }

  // Update colors
  UpdateBuildings();
  UpdateUpgrades();
  UpdateUpgradeSectionsHeight();

  // Redraw timers
  UpdateTimerBar();

  // Update Bottom Bar
  UpdateBotBar();

  // Update Tooltip
  UpdateTooltips();

  // Update Wrinkler Tooltip
  CheckWrinklerTooltip();
  UpdateWrinklerTooltip();

  // Change menu refresh interval
  RefreshMenu();

  // Update display of wrinkler buttons, this checks if Elder Pledge has been bought and if they should be disabled
  ToggleWrinklerButtons();

  // Replace Cookies counter because Orteil uses very weird code to "pad" it...
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.Scale) {
    let str = l('cookies').innerHTML.replace(/.*(?=<br>)/i, Beautify_Beautify(Game.cookies));
    if (Game.prefs.monospace) str = `<span class="monospace">${str}</span>`;
    l('cookies').innerHTML = str;
  }
}

;// CONCATENATED MODULE: ./src/Main/ClickHook.js


function CMClickHook() {
  // Add cookies from click to array that stores average
  CacheAverageCookiesFromClicks.addLatest(Game.computedMouseCps);
}

;// CONCATENATED MODULE: ./src/Cache/CPS/AverageQueue.js



/**
 * @class
 * @classdesc 	This is a class used to store values used to calculate average over time (mostly cps)
 * @var			{number}				maxLength	The maximum length of the value-storage
 * @var			{[]}					queue		The values stored
 * @method		addLatest(newValue)		Appends newValue to the value storage
 * @method		calcAverage(timePeriod)	Returns the average over the specified timeperiod
 */
class CMAvgQueue {
  constructor(maxLength) {
    this.maxLength = maxLength;
    this.queue = [];
  }

  addLatest(newValue) {
    if (this.queue.push(newValue) > this.maxLength) {
      this.queue.shift();
    }
  }

  /**
   * This functions returns the average of the values in the queue
   * @param 	{number}	timePeriod	The period in seconds to computer average over
   * @returns {number}	ret			The average
   */
  calcAverage(timePeriod) {
    let time = timePeriod;
    if (time > this.maxLength) time = this.maxLength;
    if (time > this.queue.length) time = this.queue.length;
    let ret = 0;
    for (let i = this.queue.length - 1; i >= 0 && i > this.queue.length - 1 - time; i--) {
      ret += this.queue[i];
    }
    if (ret === 0) {
      return 0;
    }
    return ret / time;
  }

  calcSum(timePeriod) {
    let time = timePeriod;
    if (time > this.maxLength) time = this.maxLength;
    if (time > this.queue.length) time = this.queue.length;
    if (time === 0) return 0;
    return this.queue.slice(-time).reduce((a, b) => a + b, 0);
  }
}

/**
 * This functions caches creates the CMAvgQueue used by CM.Cache.CacheAvgCPS() to calculate CPS
 * Called by CM.Cache.InitCache()
 */
function InitCookiesDiff() {
  CookiesDiff = new CMAvgQueue(CookieTimes[CookieTimes.length - 1]);
  WrinkDiff = new CMAvgQueue(CookieTimes[CookieTimes.length - 1]);
  WrinkFattestDiff = new CMAvgQueue(CookieTimes[CookieTimes.length - 1]);
  ChoEggDiff = new CMAvgQueue(CookieTimes[CookieTimes.length - 1]);
  ClicksDiff = new CMAvgQueue(ClickTimes[ClickTimes.length - 1]);
}

;// CONCATENATED MODULE: ./src/Cache/CPS/CPS.js



/**
 * This functions caches two variables related average CPS and Clicks
 * It is called by CM.Cache.LoopCache()
 * @global	{number}	CM.Cache.RealCookiesEarned	Cookies earned including the Chocolate Egg
 * @global	{number}	CM.Cache.AvgCPS				Average cookies over time-period as defined by AvgCPSHist
 * @global	{number}	CM.Cache.AverageClicks		Average cookies from clicking over time-period as defined by AvgClicksHist
 * @global	{number}	CM.Cache.AvgCPSChoEgg		Average cookies from combination of normal CPS and average Chocolate Cookie CPS
 */
function CacheAvgCPS() {
  const currDate = Math.floor(Date.now() / 1000);
  // Only calculate every new second
  if ((Game.T / Game.fps) % 1 === 0) {
    let choEggTotal = Game.cookies + CacheSellForChoEgg;
    if (Game.cpsSucked > 0) choEggTotal += CacheWrinklersTotal;
    CacheRealCookiesEarned = Math.max(Game.cookiesEarned, choEggTotal);
    choEggTotal *= 0.05;

    // Add recent gains to AvgQueue's
    const timeDiff = currDate - CacheLastCPSCheck;
    const bankDiffAvg = Math.max(0, Game.cookies - CacheLastCookies) / timeDiff;
    const wrinkDiffAvg = Math.max(0, CacheWrinklersTotal - CacheLastWrinkCookies) / timeDiff;
    const wrinkFattestDiffAvg =
      Math.max(0, CacheWrinklersFattest[0] - CacheLastWrinkFattestCookies) / timeDiff;
    const choEggDiffAvg = Math.max(0, choEggTotal - CacheLastChoEgg) / timeDiff;
    const clicksDiffAvg = (Game.cookieClicks - CacheLastClicks) / timeDiff;
    for (let i = 0; i < timeDiff; i++) {
      CookiesDiff.addLatest(bankDiffAvg);
      WrinkDiff.addLatest(wrinkDiffAvg);
      WrinkFattestDiff.addLatest(wrinkFattestDiffAvg);
      ChoEggDiff.addLatest(choEggDiffAvg);
      ClicksDiff.addLatest(clicksDiffAvg);
    }

    // Store current data for next loop
    CacheLastCPSCheck = currDate;
    CacheLastCookies = Game.cookies;
    CacheLastWrinkCookies = CacheWrinklersTotal;
    CacheLastWrinkFattestCookies = CacheWrinklersFattest[0];
    CacheLastChoEgg = choEggTotal;
    CacheLastClicks = Game.cookieClicks;

    // Get average gain over period of cpsLength seconds
    const cpsLength =
      CookieTimes[Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.AvgCPSHist];
    CacheAverageGainBank = CookiesDiff.calcAverage(cpsLength);
    CacheAverageGainWrink = WrinkDiff.calcAverage(cpsLength);
    CacheAverageGainWrinkFattest = WrinkFattestDiff.calcAverage(cpsLength);
    CacheAverageGainChoEgg = ChoEggDiff.calcAverage(cpsLength);
    CacheAverageCPS = CacheAverageGainBank;
    if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.CalcWrink === 1)
      CacheAverageCPS += CacheAverageGainWrink;
    if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.CalcWrink === 2)
      CacheAverageCPS += CacheAverageGainWrinkFattest;

    const choEgg = Game.HasUnlocked('Chocolate egg') && !Game.Has('Chocolate egg');

    if (
      choEgg ||
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.CalcWrink === 0
    ) {
      CacheAvgCPSWithChoEgg =
        CacheAverageGainBank + CacheAverageGainWrink + (choEgg ? CacheAverageGainChoEgg : 0);
    } else CacheAvgCPSWithChoEgg = CacheAverageCPS;

    // eslint-disable-next-line no-unused-vars
    CacheAverageClicks = ClicksDiff.calcAverage(
      ClickTimes[Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.AvgClicksHist],
    );
  }
}

;// CONCATENATED MODULE: ./src/Sim/SimulationEvents/BuyBuilding.js
/**
 * This function calculates the total price for buying "increase" of a building
 * @param	{string}	build		Name of the building
 * @param	{number}	basePrice	Base Price of building
 * @param	{number}	start		Starting amount of building
 * @param	{number}	free		Free amount of building
 * @param	{number}	increase	Increase of building
 * @returns {number}	moni		Total price
 */
function BuildingGetPrice(build, basePrice, start, free, increase) {
  let partialPrice = 0;
  for (let i = Math.max(0, start); i < Math.max(0, start + increase); i++) {
    partialPrice += Game.priceIncrease ** Math.max(0, i - free);
  }
  let price = basePrice * partialPrice;
  price = Game.modifyBuildingPrice(Game.Objects[build], price);
  return Math.ceil(price);
}

;// CONCATENATED MODULE: ./src/Cache/PP/Building.js






/**
 * This functions caches the buildings of bulk-buy mode when PP is compared against optimal single-purchase building
 * It saves all date in CM.Cache.Objects...
 * It is called by CM.Cache.CacheBuildingsPP()
 */
function CacheColour(target, amount) {
  Object.keys(target).forEach((i) => {
    if (
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.PPRigidelMode &&
      amount === 1
    ) {
      target[i].color = ColourGray; // eslint-disable-line no-param-reassign
      return;
    }
    // eslint-disable-next-line no-param-reassign
    target[i].color = ColourOfPP(
      target[i],
      BuildingGetPrice(
        i,
        Game.Objects[i].basePrice,
        Game.Objects[i].amount,
        Game.Objects[i].free,
        amount,
      ),
    );
    // Colour based on excluding certain top-buildings
    for (
      let j = 0;
      j < Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.PPExcludeTop;
      j++
    ) {
      if (target[i].pp === CachePPArray[j][0]) target[i].color = ColourGray; // eslint-disable-line no-param-reassign
    }
  });
}

function CachePP(target, amount) {
  Object.keys(target).forEach((i) => {
    const price = BuildingGetPrice(
      i,
      Game.Objects[i].basePrice,
      Game.Objects[i].amount,
      Game.Objects[i].free,
      amount,
    );
    if (Game.cookiesPs) {
      target[i].pp = // eslint-disable-line no-param-reassign
        Math.max(price - (Game.cookies + GetWrinkConfigBank()), 0) / Game.cookiesPs +
        price / target[i].bonus;
    } else target[i].pp = price / target[i].bonus; // eslint-disable-line no-param-reassign
    if (
      !(
        Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.PPRigidelMode &&
        amount === 1
      )
    )
      CachePPArray.push([target[i].pp, amount, price]);
  });
}

/**
 * This functions caches the PP of each building it saves all date in CM.Cache.Objects...
 * It is called by CM.Cache.CachePP()
 */
function CacheBuildingsPP() {
  CacheMinPP = Infinity;
  CachePPArray = [];
  if (
    typeof Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.PPExcludeTop ===
    'undefined'
  )
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.PPExcludeTop = 0; // Otherwise breaks during initialization

  // Calculate PP and colors
  CachePP(CacheObjects1, 1);
  CachePP(CacheObjects10, 10);
  CachePP(CacheObjects100, 100);

  // Set CM.Cache.min to best non-excluded buidliung
  CachePPArray.sort((a, b) => a[0] - b[0]);
  let indexOfMin = Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.PPExcludeTop;
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.PPOnlyConsiderBuyable) {
    while (CachePPArray[indexOfMin][2] > Game.cookies) {
      indexOfMin += 1;
      if (CachePPArray.length === indexOfMin + 1) {
        break;
      }
    }
  }
  CacheMinPP = CachePPArray[indexOfMin][0];
  CacheMinPPBulk = CachePPArray[indexOfMin][1];

  CacheColour(CacheObjects1, 1);
  CacheColour(CacheObjects10, 10);
  CacheColour(CacheObjects100, 100);
}

;// CONCATENATED MODULE: ./src/Cache/PP/Upgrade.js




/**
 * This functions caches the PP of each building it saves all date in CM.Cache.Upgrades
 * It is called by CM.Cache.CachePP()
 */
function CacheUpgradePP() {
  Object.keys(CacheUpgrades).forEach((i) => {
    if (Game.cookiesPs) {
      CacheUpgrades[i].pp =
        Math.max(Game.Upgrades[i].getPrice() - (Game.cookies + GetWrinkConfigBank()), 0) /
          Game.cookiesPs +
        Game.Upgrades[i].getPrice() / CacheUpgrades[i].bonus;
    } else CacheUpgrades[i].pp = Game.Upgrades[i].getPrice() / CacheUpgrades[i].bonus;
    if (Number.isNaN(CacheUpgrades[i].pp)) CacheUpgrades[i].pp = Infinity;

    CacheUpgrades[i].color = ColourOfPP(CacheUpgrades[i], Game.Upgrades[i].getPrice());
  });
}

;// CONCATENATED MODULE: ./src/Cache/PP/PP.js
/**
 * Section: Functions related to caching PP */





/**
 * This functions caches the PP of each building and upgrade and stores it in the cache
 * It is called by CM.Cache.LoopCache() and CM.Cache.InitCache()
 */
function PP_CachePP() {
  CacheBuildingsPP();
  CacheUpgradePP();
  window.CookieMonsterData.Objects1 = JSON.parse(JSON.stringify(CacheObjects1));
  window.CookieMonsterData.Objects10 = JSON.parse(JSON.stringify(CacheObjects10));
  window.CookieMonsterData.Objects100 = JSON.parse(JSON.stringify(CacheObjects100));
  window.CookieMonsterData.Upgrades = [];
  Object.entries(CacheUpgrades).forEach((i) => {
    window.CookieMonsterData.Upgrades[i[0]] = JSON.parse(JSON.stringify(i[1]));
  });
}

;// CONCATENATED MODULE: ./src/Sim/SimulationEvents/BuyUpgrades.js










/**
 * This function calculates the cookies per click
 * It is called by CM.Sim.BuyUpgradesBonusIncome() when an upgrades has no bonus-income (and is thus a clicking-upgrade)
 * @returns	{number}	out	The clicking power
 */
function MouseCps() {
  let add = 0;
  if (SimHas('Thousand fingers')) add += 0.1;
  if (SimHas('Million fingers')) add *= 5;
  if (SimHas('Billion fingers')) add *= 10;
  if (SimHas('Trillion fingers')) add *= 20;
  if (SimHas('Quadrillion fingers')) add *= 20;
  if (SimHas('Quintillion fingers')) add *= 20;
  if (SimHas('Sextillion fingers')) add *= 20;
  if (SimHas('Septillion fingers')) add *= 20;
  if (SimHas('Octillion fingers')) add *= 20;
  if (SimHas('Nonillion fingers')) add *= 20;
  let num = 0;
  Object.keys(SimObjects).forEach((i) => {
    num += SimObjects[i].amount;
  });
  num -= SimObjects.Cursor.amount;
  add *= num;

  // Can use SimCookiesPs as function is always called after CM.Sim.CalculateGains()
  if (SimHas('Plastic mouse')) add += SimCookiesPs * 0.01;
  if (SimHas('Iron mouse')) add += SimCookiesPs * 0.01;
  if (SimHas('Titanium mouse')) add += SimCookiesPs * 0.01;
  if (SimHas('Adamantium mouse')) add += SimCookiesPs * 0.01;
  if (SimHas('Unobtainium mouse')) add += SimCookiesPs * 0.01;
  if (SimHas('Eludium mouse')) add += SimCookiesPs * 0.01;
  if (SimHas('Wishalloy mouse')) add += SimCookiesPs * 0.01;
  if (SimHas('Fantasteel mouse')) add += SimCookiesPs * 0.01;
  if (SimHas('Nevercrack mouse')) add += SimCookiesPs * 0.01;
  if (SimHas('Armythril mouse')) add += SimCookiesPs * 0.01;
  if (SimHas('Technobsidian mouse')) add += SimCookiesPs * 0.01;
  if (SimHas('Plasmarble mouse')) add += SimCookiesPs * 0.01;
  if (SimHas('Miraculite mouse')) add += SimCookiesPs * 0.01;

  if (SimHas('Fortune #104')) add += SimCookiesPs * 0.01;

  let mult = 1;
  if (SimHas("Santa's helpers")) mult *= 1.1;
  if (SimHas('Cookie egg')) mult *= 1.1;
  if (SimHas('Halo gloves')) mult *= 1.1;
  if (SimHas('Dragon claw')) mult *= 1.03;

  if (SimHas('Aura gloves')) {
    mult *= 1 + 0.05 * Math.min(Game.Objects.Cursor.level, SimHas('Luminous gloves') ? 20 : 10);
  }

  mult *= SimEff('click');
  if (SimObjects.Temple.minigameLoaded) {
    if (SimHasGod) {
      const godLvl = SimHasGod('labor');
      if (godLvl === 1) mult *= 1.15;
      else if (godLvl === 2) mult *= 1.1;
      else if (godLvl === 3) mult *= 1.05;
    }
  }

  Object.keys(Game.buffs).forEach((i) => {
    if (typeof Game.buffs[i].multClick !== 'undefined') mult *= Game.buffs[i].multClick;
  });

  // if (CM.Sim.auraMult('Dragon Cursor')) mult*=1.05;
  mult *= 1 + SimAuraMult('Dragon Cursor') * 0.05;

  // No need to make this function a CM function
  let out =
    mult *
    Game.ComputeCps(
      1,
      SimHas('Reinforced index finger') +
        SimHas('Carpal tunnel prevention cream') +
        SimHas('Ambidextrous'),
      add,
    );

  out = Game.runModHookOnValue('cookiesPerClick', out);

  if (Game.hasBuff('Cursed finger')) out = Game.buffs['Cursed finger'].power;

  return out;
}

/**
 * This function calculates the bonus income of buying a building
 * It is called by CM.Cache.CacheBuildingIncome()
 * @param	{string}				building	The name of the upgrade to be bought
 * @returns {[{number, number}]}				The bonus income of the upgrade and the difference in MouseCPS
 */
function BuyUpgradesBonusIncome(upgrade) {
  if (
    Game.Upgrades[upgrade].pool === 'toggle' ||
    (Game.Upgrades[upgrade].bought === 0 &&
      Game.Upgrades[upgrade].unlocked &&
      Game.Upgrades[upgrade].pool !== 'prestige')
  ) {
    CopyData();
    if (SimUpgrades[upgrade].name === 'Shimmering veil [on]') {
      SimUpgrades["Shimmering veil [off]"].bought = 0;
    } else if (SimUpgrades[upgrade].name === 'Golden switch [on]') {
      SimUpgrades["Golden switch [off]"].bought = 0;
    } else {
      SimUpgrades[upgrade].bought = (SimUpgrades[upgrade].bought + 1) % 2;
    }
    if (Game.CountsAsUpgradeOwned(Game.Upgrades[upgrade].pool)) SimUpgradesOwned += 1;

    if (upgrade === 'Elder Pledge') {
      SimPledges += 1;
      if (SimPledges > 0) SimWin('Elder nap');
      if (SimPledges >= 5) SimWin('Elder slumber');
    } else if (upgrade === 'Elder Covenant') {
      SimWin('Elder calm');
    } else if (upgrade === 'Prism heart biscuits') {
      SimWin('Lovely cookies');
    } else if (upgrade === 'Heavenly key') {
      SimWin('Wholesome');
    }

    const lastAchievementsOwned = SimAchievementsOwned;

    CalculateGains();

    CheckOtherAchiev();

    if (lastAchievementsOwned !== SimAchievementsOwned) {
      CalculateGains();
    }

    const diffMouseCPS = MouseCps() - Game.computedMouseCps;
    if (diffMouseCPS) {
      return [SimCookiesPs - Game.cookiesPs, diffMouseCPS];
    }
    return [SimCookiesPs - Game.cookiesPs];
  }
  return [];
}

;// CONCATENATED MODULE: ./src/Cache/PriceAndIncome/PriceAndIncome.js
/** Section: Functions related to caching income */






/**
 * This functions starts the calculation/simulation of the bonus income of buildings
 * It is called by CM.Cache.CacheIncome()
 * @param	{amount}	amount	Amount to be bought
 * @parem	{string}	target	The target Cache object ("Objects1", "Objects10" or "Objects100")
 */
function CacheBuildingIncome(amount) {
  const result = {};
  Object.keys(Game.Objects).forEach((i) => {
    result[i] = {};
    result[i].bonus = BuyBuildingsBonusIncome(i, amount);
    if (amount !== 1) {
      CacheDoRemakeBuildPrices = 1;
    }
  });
  return result;
}

/**
 * This functions starts the calculation/simulation of the bonus income of upgrades
 * It is called by CM.Cache.CacheIncome()
 */
function CacheUpgradeIncome() {
  CacheUpgrades = {};
  for (let i = 0; i < Game.UpgradesInStore.length; i++) {
    const upgradeName = Game.UpgradesInStore[i].name;
    const bonusIncome = BuyUpgradesBonusIncome(upgradeName);
    if (upgradeName === 'Elder Pledge') {
      CacheUpgrades[upgradeName] = {
        bonus: Game.cookiesPs - CacheAverageGainBank,
      };
      if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.CalcWrink === 1)
        CacheUpgrades[upgradeName].bonus -= CacheAverageGainWrink;
      else if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.CalcWrink === 2)
        CacheUpgrades[upgradeName].bonus -= CacheAverageGainWrinkFattest;
      if (!Number.isFinite(CacheUpgrades[upgradeName].bonus)) CacheUpgrades[upgradeName].bonus = 0;
    } else {
      CacheUpgrades[upgradeName] = {};
      if (bonusIncome[0]) CacheUpgrades[upgradeName].bonus = bonusIncome[0];
      if (bonusIncome[1]) CacheUpgrades[upgradeName].bonusMouse = bonusIncome[1];
    }
  }
}

/**
 * This functions caches the price of each building and stores it in the cache
 */
function CacheBuildingsPrices() {
  Object.keys(Game.Objects).forEach((i) => {
    CacheObjects1[i].price = BuildingGetPrice(
      i,
      Game.Objects[i].basePrice,
      Game.Objects[i].amount,
      Game.Objects[i].free,
      1,
    );
    CacheObjects10[i].price = BuildingGetPrice(
      i,
      Game.Objects[i].basePrice,
      Game.Objects[i].amount,
      Game.Objects[i].free,
      10,
    );
    CacheObjects100[i].price = BuildingGetPrice(
      i,
      Game.Objects[i].basePrice,
      Game.Objects[i].amount,
      Game.Objects[i].free,
      100,
    );
    CacheObjectsNextAchievement[i].price = BuildingGetPrice(
      i,
      Game.Objects[i].basePrice,
      Game.Objects[i].amount,
      Game.Objects[i].free,
      CacheObjectsNextAchievement[i].AmountNeeded,
    );
  });
}

/**
 * This functions caches the income gain of each building and upgrade and stores it in the cache
 * It is called by CM.Main.Loop() and CM.Cache.InitCache()
 */
function CacheIncome() {
  // Simulate Building Buys for 1, 10 and 100 amount
  CacheObjects1 = CacheBuildingIncome(1);
  CacheObjects10 = CacheBuildingIncome(10);
  CacheObjects100 = CacheBuildingIncome(100);

  // Simulate Upgrade Buys
  CacheUpgradeIncome();
}

;// CONCATENATED MODULE: ./src/Cache/Stats/ChainCookies.js



/**
 * This functions calculates the max possible payout given a set of variables
 * It is called by CM.Disp.CreateStatsChainSection() and CM.Cache.CacheChain()
 * @param	{number}					digit		Number of Golden Cookies in chain
 * @param	{number}					maxPayout	Maximum payout
 * @param	{number}					mult		Multiplier
 * @returns	[{number, number, number}]				Total cookies earned, cookie needed for this and next level
 */
function MaxChainCookieReward(digit, maxPayout, mult) {
  let totalFromChain = 0;
  let moni = 0;
  let nextMoni = 0;
  let nextRequired = 0;
  let chain = 1 + Math.max(0, Math.ceil(Math.log(Game.cookies) / Math.LN10) - 10);
  while (nextMoni < maxPayout * mult) {
    moni = Math.max(
      digit,
      Math.min(Math.floor((1 / 9) * 10 ** chain * digit * mult), maxPayout * mult),
    );
    nextMoni = Math.max(
      digit,
      Math.min(Math.floor((1 / 9) * 10 ** (chain + 1) * digit * mult), maxPayout * mult),
    );
    nextRequired = Math.floor((1 / 9) * 10 ** (chain + 1) * digit * mult);
    totalFromChain += moni;
    chain += 1;
  }
  return [totalFromChain, moni, nextRequired];
}

/**
 * This functions caches data related to Chain Cookies reward from Golden Cookioes
 * It is called by CM.Main.Loop() upon changes to cps and CM.Cache.InitCache()
 * @global	[{number, number}]	CM.Cache.ChainMaxReward			Total cookies earned, and cookies needed for next level for normal chain
 * @global	{number}			CM.Cache.ChainRequired			Cookies needed for maximum reward for normal chain
 * @global	{number}			CM.Cache.ChainRequiredNext		Total cookies needed for next level for normal chain
 * @global	[{number, number}]	CM.Cache.ChainMaxWrathReward			Total cookies earned, and cookies needed for next level for wrath chain
 * @global	{number}			CM.Cache.ChainWrathRequired			Cookies needed for maximum reward for wrath chain
 * @global	{number}			CM.Cache.ChainWrathRequiredNext		Total cookies needed for next level for wrath chain
 * @global	[{number, number}]	CM.Cache.ChainFrenzyMaxReward			Total cookies earned, and cookies needed for next level for normal frenzy chain
 * @global	{number}			CM.Cache.ChainFrenzyRequired			Cookies needed for maximum reward for normal frenzy chain
 * @global	{number}			CM.Cache.ChainFrenzyRequiredNext		Total cookies needed for next level for normal frenzy chain
 * @global	[{number, number}]	CM.Cache.ChainFrenzyWrathMaxReward			Total cookies earned, and cookies needed for next level for wrath frenzy chain
 * @global	{number}			CM.Cache.ChainFrenzyWrathRequired			Cookies needed for maximum reward for wrath frenzy chain
 * @global	{number}			CM.Cache.ChainFrenzyWrathRequiredNext		Total cookies needed for next level for wrath frenzy chain
 */
function CacheChain() {
  let maxPayout = CacheNoGoldSwitchCookiesPS * 60 * 60 * 6 * CacheDragonsFortuneMultAdjustment;
  // Removes effect of Frenzy etc.
  const cpsBuffMult = GetCPSBuffMult();
  if (cpsBuffMult > 0) maxPayout /= cpsBuffMult;
  else maxPayout = 0;

  CacheChainMaxReward = MaxChainCookieReward(7, maxPayout, CacheGoldenCookiesMult);
  CacheChainRequired = (CacheChainMaxReward[1] * 2) / CacheGoldenCookiesMult;
  CacheChainRequiredNext = CacheChainMaxReward[2] / 60 / 60 / 6 / CacheDragonsFortuneMultAdjustment;

  CacheChainWrathMaxReward = MaxChainCookieReward(6, maxPayout, CacheWrathCookiesMult);
  CacheChainWrathRequired = (CacheChainWrathMaxReward[1] * 2) / CacheWrathCookiesMult;
  CacheChainWrathRequiredNext =
    CacheChainWrathMaxReward[2] / 60 / 60 / 6 / CacheDragonsFortuneMultAdjustment;

  CacheChainFrenzyMaxReward = MaxChainCookieReward(7, maxPayout * 7, CacheGoldenCookiesMult);
  CacheChainFrenzyRequired = (CacheChainFrenzyMaxReward[1] * 2) / CacheGoldenCookiesMult;
  CacheChainFrenzyRequiredNext =
    CacheChainFrenzyMaxReward[2] / 60 / 60 / 6 / CacheDragonsFortuneMultAdjustment;

  CacheChainFrenzyWrathMaxReward = MaxChainCookieReward(6, maxPayout * 7, CacheWrathCookiesMult);
  CacheChainFrenzyWrathRequired = (CacheChainFrenzyWrathMaxReward[1] * 2) / CacheWrathCookiesMult;
  CacheChainFrenzyWrathRequiredNext =
    CacheChainFrenzyWrathMaxReward[2] / 60 / 60 / 6 / CacheDragonsFortuneMultAdjustment;
}

;// CONCATENATED MODULE: ./src/Cache/Stats/HeavenlyChips.js


/**
 * This functions caches the heavenly chips per second in the last five seconds
 * It is called by CM.Cache.LoopCache()
 * @global	{number}	CM.Cache.HCPerSecond	The Heavenly Chips per second in the last five seconds
 */
function CacheHeavenlyChipsPS() {
  const currDate = Math.floor(Date.now() / 1000);
  // Only calculate every new second
  if ((Game.T / Game.fps) % 1 === 0) {
    const chipsOwned = Game.HowMuchPrestige(Game.cookiesReset);
    const ascendNowToOwn = Math.floor(Game.HowMuchPrestige(Game.cookiesReset + Game.cookiesEarned));
    const ascendNowToGet = ascendNowToOwn - Math.floor(chipsOwned);

    // Add recent gains to AvgQueue's
    const timeDiff = currDate - CacheLastHeavenlyCheck;
    const heavenlyChipsDiffAvg = Math.max(0, ascendNowToGet - CacheLastHeavenlyChips) / timeDiff;
    for (let i = 0; i < timeDiff; i++) {
      HeavenlyChipsDiff.addLatest(heavenlyChipsDiffAvg);
    }

    // Store current data for next loop
    CacheLastHeavenlyCheck = currDate;
    CacheLastHeavenlyChips = ascendNowToGet;

    // Get average gain over period of 5 seconds
    CacheHCPerSecond = HeavenlyChipsDiff.calcAverage(5);
  }
}

;// CONCATENATED MODULE: ./src/Disp/MenuSections/Statistics/CreateMissingUpgrades.js
/** Functions related to displaying the missing upgrades in the Statistics page */



/**
 * This function creates the missing upgrades sections for prestige, normal and cookie upgrades
 */
function AddMissingUpgrades() {
  l('menu').childNodes.forEach((menuSection) => {
    if (menuSection.children[0]) {
      if (menuSection.children[0].innerHTML === 'Prestige' && CacheMissingUpgradesPrestige) {
        const prestigeUpgradesMissing =
          CacheMissingUpgradesPrestige.match(new RegExp('div', 'g') || 0).length / 2;
        const title = document.createElement('div');
        title.id = 'CMMissingUpgradesPrestigeTitle';
        title.className = 'listing';
        const titlefrag = document.createElement('div');
        titlefrag.innerHTML = `<b>Missing Prestige upgrades:</b> ${prestigeUpgradesMissing}/${
          Game.PrestigeUpgrades.length
        } (${Math.floor((prestigeUpgradesMissing / Game.PrestigeUpgrades.length) * 100)}%)`;
        title.appendChild(titlefrag);
        menuSection.appendChild(title);
        const upgrades = document.createElement('div');
        upgrades.className = 'listing crateBox';
        upgrades.innerHTML = CacheMissingUpgradesPrestige;
        menuSection.appendChild(upgrades);
      } else if (menuSection.children[0].innerHTML === 'Upgrades') {
        if (CacheMissingUpgrades) {
          const normalUpgradesMissing =
            CacheMissingUpgrades.match(new RegExp('div', 'g') || 0).length / 2;
          const title = document.createElement('div');
          title.id = 'CMMissingUpgradesTitle';
          title.className = 'listing';
          const titlefrag = document.createElement('div');
          titlefrag.innerHTML = `<b>Missing normal upgrades:</b> ${normalUpgradesMissing}/${
            Game.UpgradesByPool[''].length + Game.UpgradesByPool.tech.length
          } (${Math.floor(
            (normalUpgradesMissing /
              (Game.UpgradesByPool[''].length + Game.UpgradesByPool.tech.length)) *
              100,
          )}%)`;
          title.appendChild(titlefrag);
          menuSection.insertBefore(title, menuSection.childNodes[3]);
          const upgrades = document.createElement('div');
          upgrades.className = 'listing crateBox';
          upgrades.innerHTML = CacheMissingUpgrades;
          menuSection.insertBefore(
            upgrades,
            document.getElementById('CMMissingUpgradesTitle').nextSibling,
          );
        }
        if (CacheMissingUpgradesCookies) {
          const cookieUpgradesMissing =
            CacheMissingUpgradesCookies.match(new RegExp('div', 'g') || 0).length / 2;
          const title = document.createElement('div');
          title.id = 'CMMissingUpgradesCookiesTitle';
          title.className = 'listing';
          const titlefrag = document.createElement('div');
          titlefrag.innerHTML = `<b>Missing Cookie upgrades:</b> ${cookieUpgradesMissing}/${
            Game.UpgradesByPool.cookie.length
          } (${Math.floor((cookieUpgradesMissing / Game.UpgradesByPool.cookie.length) * 100)}%)`;
          title.appendChild(titlefrag);
          menuSection.appendChild(title);
          const upgrades = document.createElement('div');
          upgrades.className = 'listing crateBox';
          upgrades.innerHTML = CacheMissingUpgradesCookies;
          menuSection.appendChild(upgrades);
        }
      }
    }
  });
}

/**
 * This function returns the "crates" (icons) for missing upgrades in the stats sections
 * It returns a html string that gets appended to the respective CM.Cache.MissingUpgrades-variable by CM.Cache.CacheMissingUpgrades()
 * @param	{object}	me	The upgrade object
 * @returns	{string}	?	The HTML string that creates the icon.
 */
function crateMissing(me) {
  let classes = 'crate upgrade missing';
  if (me.pool === 'prestige') classes += ' heavenly';

  let noFrame = 0;
  if (!Game.prefs.crates) noFrame = 1;
  if (noFrame) classes += ' noFrame';

  let { icon } = me;
  if (me.iconFunction) icon = me.iconFunction();
  const tooltip = `function() {return Game.crateTooltip(Game.UpgradesById[${me.id}], 'stats');}`;
  return `<div class="${classes}"
	${Game.getDynamicTooltip(tooltip, 'top', true)}
	style = "${`${icon[2] ? `background-image: url(${icon[2]});` : ''}background-position:${
    -icon[0] * 48
  }px ${-icon[1] * 48}px`};">
	</div>`;
}

;// CONCATENATED MODULE: ./src/Cache/Stats/MissingUpgrades.js



/**
 * This functions caches variables related to missing upgrades
 * It is called by CM.Main.Loop() and CM.Cache.InitCache()
 * @global	{string}	CM.Cache.MissingUpgrades			String containig the HTML to create the "crates" for missing normal upgrades
 * @global	{string}	CM.Cache.MissingUpgradesCookies		String containig the HTML to create the "crates" for missing cookie upgrades
 * @global	{string}	CM.Cache.MissingUpgradesPrestige	String containig the HTML to create the "crates" for missing prestige upgrades
 */
function CacheAllMissingUpgrades() {
  CacheMissingUpgrades = '';
  CacheMissingUpgradesCookies = '';
  CacheMissingUpgradesPrestige = '';
  const list = [];
  // sort the upgrades
  Object.keys(Game.Upgrades).forEach((i) => {
    list.push(Game.Upgrades[i]);
  });
  const sortMap = function (a, b) {
    if (a.order > b.order) return 1;
    if (a.order < b.order) return -1;
    return 0;
  };
  list.sort(sortMap);

  Object.keys(list).forEach((i) => {
    const me = list[i];

    if (me.bought === 0) {
      let str = '';

      str += crateMissing(me);
      /* eslint-disable no-unused-vars */
      if (me.pool === 'prestige') CacheMissingUpgradesPrestige += str;
      else if (me.pool === 'cookie') CacheMissingUpgradesCookies += str;
      else if (me.pool !== 'toggle' && me.pool !== 'unused' && me.pool !== 'debug')
        CacheMissingUpgrades += str;
      /* eslint-enable no-unused-vars */
    }
  });
}

;// CONCATENATED MODULE: ./src/Cache/Stats/Reindeer.js
 // eslint-disable-line no-unused-vars

/**
 * This functions caches the reward of popping a reindeer
 * It is called by CM.Main.Loop() and CM.Cache.InitCache()
 * @global	{number}	CM.Cache.SeaSpec	The reward for popping a reindeer
 */
function CacheSeasonSpec() {
  if (Game.season === 'christmas') {
    let val = Game.cookiesPs * 60;
    if (Game.hasBuff('Elder frenzy')) val *= 0.5;
    if (Game.hasBuff('Frenzy')) val *= 0.75;
    CacheSeaSpec = Math.max(25, val);
    if (Game.Has('Ho ho ho-flavored frosting')) CacheSeaSpec *= 2;
  }
}

;// CONCATENATED MODULE: ./src/Cache/Stats/Stats.js
/** Functions related to Caching stats */





/**
 * This functions caches variables related to the stats page
 */
function CacheStatsCookies() {
  CacheLucky = (CacheNoGoldSwitchCookiesPS * 900) / 0.15;
  CacheLucky *= CacheDragonsFortuneMultAdjustment;
  const cpsBuffMult = GetCPSBuffMult();
  if (cpsBuffMult > 0) CacheLucky /= cpsBuffMult;
  else CacheLucky = 0;
  CacheLuckyReward = CacheGoldenCookiesMult * (CacheLucky * 0.15) + 13;
  CacheLuckyWrathReward = CacheWrathCookiesMult * (CacheLucky * 0.15) + 13;
  CacheLuckyFrenzy = CacheLucky * 7;
  CacheLuckyRewardFrenzy = CacheGoldenCookiesMult * (CacheLuckyFrenzy * 0.15) + 13;
  CacheLuckyWrathRewardFrenzy = CacheWrathCookiesMult * (CacheLuckyFrenzy * 0.15) + 13;
  CacheConjure = CacheLucky * 2;
  CacheConjureReward = CacheConjure * 0.15;

  CacheEdifice = 0;
  let max = 0;
  let n = 0;
  Object.keys(Game.Objects).forEach((i) => {
    if (Game.Objects[i].amount > max) max = Game.Objects[i].amount;
    if (Game.Objects[i].amount > 0) n += 1;
  });
  Object.keys(Game.Objects).forEach((i) => {
    if (
      (Game.Objects[i].amount < max || n === 1) &&
      Game.Objects[i].amount < 400 &&
      Game.Objects[i].price * 2 > CacheEdifice
    ) {
      CacheEdifice = Game.Objects[i].price * 2;
      CacheEdificeBuilding = i;
    }
  });
}

/**
 * This functions calculates the multipliers of Golden and Wrath cookie rewards
 */
function CacheGoldenAndWrathCookiesMults() {
  let goldenMult = 1;
  let wrathMult = 1;
  let mult = 1;

  // Factor auras and upgrade in mults
  if (SimHas('Green yeast digestives')) mult *= 1.01;
  if (SimHas('Dragon fang')) mult *= 1.03;

  goldenMult *= 1 + Game.auraMult('Ancestral Metamorphosis') * 0.1;
  goldenMult *= Game.eff('goldenCookieGain');
  wrathMult *= 1 + Game.auraMult('Unholy Dominion') * 0.1;
  wrathMult *= Game.eff('wrathCookieGain');

  // Calculate final golden and wrath multipliers
  CacheGoldenCookiesMult = mult * goldenMult;
  CacheWrathCookiesMult = mult * wrathMult;

  // Calculate Dragon's Fortune multiplier adjustment:
  // If Dragon's Fortune (or Reality Bending) aura is active and there are currently no golden cookies,
  // compute a multiplier adjustment to apply on the current CPS to simulate 1 golden cookie on screen.
  // Otherwise, the aura effect will be factored in the base CPS making the multiplier not requiring adjustment.
  CacheDragonsFortuneMultAdjustment = 1;
  if (Game.shimmerTypes.golden.n === 0) {
    CacheDragonsFortuneMultAdjustment *= 1 + Game.auraMult("Dragon's Fortune") * 1.23;
  }
}

;// CONCATENATED MODULE: ./src/Cache/TillNextAchievement/IndividualAmountTillNextAchievement.js



function IndividualAmountTillNextAchievement(building) {
  const AchievementsAtStart = Game.AchievementsOwned;
  let index = 100;
  let lastIndexWithChange = 100;
  while (index > -1) {
    BuyBuildingsBonusIncome(building, index);
    if (SimAchievementsOwned > AchievementsAtStart) {
      lastIndexWithChange = index;
      index -= 10;
    } else if (index === 100) {
      return 101;
    } else {
      index += 1;
      while (index <= lastIndexWithChange) {
        BuyBuildingsBonusIncome(building, index);
        if (SimAchievementsOwned > AchievementsAtStart) {
          return index;
        }
        index += 1;
      }
    }
  }
  return 101;
}

;// CONCATENATED MODULE: ./src/Cache/TillNextAchievement/AllAmountTillNextAchievement.js




/**
 * This functions caches the amount of buildings needed till next achievement
 * @param	{boolean}	forceRecalc	Whether a recalcution should be forced (after CPS change)
 */
function AllAmountTillNextAchievement(forceRecalc) {
  const result = {};

  Object.keys(Game.Objects).forEach((i) => {
    if (
      Object.keys(CacheObjectsNextAchievement).length !== 0 &&
      CacheObjectsNextAchievement[i].TotalNeeded > Game.Objects[i].amount &&
      !forceRecalc
    ) {
      result[i] = {
        AmountNeeded: CacheObjectsNextAchievement[i].TotalNeeded - Game.Objects[i].amount,
        TotalNeeded: CacheObjectsNextAchievement[i].TotalNeeded,
        price: BuildingGetPrice(
          i,
          Game.Objects[i].basePrice,
          Game.Objects[i].amount,
          Game.Objects[i].free,
          CacheObjectsNextAchievement[i].TotalNeeded - Game.Objects[i].amount,
        ),
      };
    } else {
      const tillNext = IndividualAmountTillNextAchievement(i);
      result[i] = {
        AmountNeeded: tillNext,
        TotalNeeded: Game.Objects[i].amount + tillNext,
        price: BuildingGetPrice(
          i,
          Game.Objects[i].basePrice,
          Game.Objects[i].amount,
          Game.Objects[i].free,
          tillNext,
        ),
      };
    }
  });
  CacheObjectsNextAchievement = result; // eslint-disable-line no-unused-vars
}

;// CONCATENATED MODULE: ./src/Cache/Wrinklers/Wrinklers.js
/** Caches data related to Wrinklers */




/**
 * This functions caches data related to Wrinklers
 * It is called by CM.Cache.LoopCache() and CM.Cache.InitCache()
 * @global	{number}				CM.Cache.WrinklersTotal		The cookies of all wrinklers
 * @global	{number}				CM.Cache.WrinklersNormal	The cookies of all normal wrinklers
 * @global	{[{number}, {number}]}	CM.Cache.WrinklersFattest	A list containing the cookies and the id of the fattest non-shiny wrinkler
 */
function CacheWrinklers() {
  CacheWrinklersTotal = 0;
  CacheWrinklersNormal = 0;
  CacheWrinklersFattest = [0, null];
  for (let i = 0; i < Game.wrinklers.length; i++) {
    let { sucked } = Game.wrinklers[i];
    let toSuck = 1.1;
    if (Game.Has('Sacrilegious corruption')) toSuck *= 1.05;
    if (Game.wrinklers[i].type === 1) toSuck *= 3; // Shiny wrinklers
    sucked *= toSuck;
    if (Game.Has('Wrinklerspawn')) sucked *= 1.05;
    if (SimObjects.Temple.minigameLoaded) {
      const godLvl = Game.hasGod('scorn');
      if (godLvl === 1) sucked *= 1.15;
      else if (godLvl === 2) sucked *= 1.1;
      else if (godLvl === 3) sucked *= 1.05;
    }
    CacheWrinklersTotal += sucked;
    if (Game.wrinklers[i].type === 0) {
      CacheWrinklersNormal += sucked;
      if (sucked > CacheWrinklersFattest[0]) CacheWrinklersFattest = [sucked, i];
    }
  }
}

;// CONCATENATED MODULE: ./src/Cache/CacheInit.js












 // eslint-disable-line no-unused-vars


/**
 * This functions runs all cache-functions to generate all "full" cache
 */
function InitCache() {
  CacheDragonAuras();
  CacheWrinklers();
  CacheStatsCookies();
  CacheGoldenAndWrathCookiesMults();
  CacheChain();
  CacheAllMissingUpgrades();
  CacheSeasonSpec();
  InitCookiesDiff();
  /** Used by CM.Cache.CacheHeavenlyChipsPS() */
  HeavenlyChipsDiff = new CMAvgQueue(5);
  CacheAverageCookiesFromClicks = new CMAvgQueue(ClickTimes[ClickTimes.length - 1] * 20);
  CacheHeavenlyChipsPS();
  AllAmountTillNextAchievement();
  CacheAvgCPS();
  CacheIncome();
  CacheBuildingsPrices();
  PP_CachePP();
}

;// CONCATENATED MODULE: ./src/Disp/BuildingsUpgrades/UpgradeBar.js


/**
 * This function creates the legend for the upgrade bar
 * @returns	{object}	legend	The legend-object to be added
 */
function CreateUpgradeBarLegend() {
  const legend = document.createElement('div');
  legend.style.minWidth = '330px';
  legend.style.marginBottom = '4px';
  const title = document.createElement('div');
  title.className = 'name';
  title.style.marginBottom = '4px';
  title.textContent = 'Legend';
  legend.appendChild(title);

  const legendLine = function (color, text) {
    const div = document.createElement('div');
    div.style.verticalAlign = 'middle';
    const span = document.createElement('span');
    span.className = ColourBackPre + color;
    span.style.display = 'inline-block';
    span.style.height = '10px';
    span.style.width = '10px';
    span.style.marginRight = '4px';
    div.appendChild(span);
    div.appendChild(document.createTextNode(text));
    return div;
  };

  legend.appendChild(legendLine(ColourBlue, 'Better than the best PP of a building option'));
  legend.appendChild(legendLine(ColourGreen, 'Same as the best PP building option'));
  legend.appendChild(legendLine(ColourYellow, 'Within the top 10 of PP for buildings'));
  legend.appendChild(legendLine(ColourOrange, 'Within the top 20 of PP for buildings'));
  legend.appendChild(legendLine(ColourRed, 'Within the top 30 of PP for buildings'));
  legend.appendChild(legendLine(ColourPurple, 'Outside of the top 30 of PP for buildings'));
  legend.appendChild(legendLine(ColourGray, 'Negative or infinity PP'));
  return legend;
}

/**
 * This function creates the upgrade bar above the upgrade-section in the right section of the screen
 */
function CreateUpgradeBar() {
  const UpgradeBar = document.createElement('div');
  UpgradeBar.id = 'CMUpgradeBar';
  UpgradeBar.style.width = '100%';
  UpgradeBar.style.backgroundColor = 'black';
  UpgradeBar.style.textAlign = 'center';
  UpgradeBar.style.fontWeight = 'bold';
  UpgradeBar.style.display = 'none';
  UpgradeBar.style.zIndex = '21';
  UpgradeBar.onmouseout = function () {
    Game.tooltip.hide();
  };

  const placeholder = document.createElement('div');
  placeholder.appendChild(CreateUpgradeBarLegend());
  UpgradeBar.onmouseover = function () {
    Game.tooltip.draw(this, escape(placeholder.innerHTML), 'store');
  };

  const upgradeNumber = function (id, color) {
    const span = document.createElement('span');
    span.id = id;
    span.className = ColourTextPre + color;
    span.style.width = '14.28571428571429%';
    span.style.display = 'inline-block';
    span.textContent = '0';
    return span;
  };
  UpgradeBar.appendChild(upgradeNumber('CMUpgradeBarBlue', ColourBlue));
  UpgradeBar.appendChild(upgradeNumber('CMUpgradeBarGreen', ColourGreen));
  UpgradeBar.appendChild(upgradeNumber('CMUpgradeBarYellow', ColourYellow));
  UpgradeBar.appendChild(upgradeNumber('CMUpgradeBarOrange', ColourOrange));
  UpgradeBar.appendChild(upgradeNumber('CMUpgradeBarRed', ColourRed));
  UpgradeBar.appendChild(upgradeNumber('CMUpgradeBarPurple', ColourPurple));
  UpgradeBar.appendChild(upgradeNumber('CMUpgradeBarGray', ColourGray));

  l('upgrades').parentNode.insertBefore(UpgradeBar, l('upgrades').parentNode.childNodes[3]);
}

;// CONCATENATED MODULE: ./src/Disp/Initialization/CreateSectionHideButtons.js
/**
 * This function creates two objects at the top of the right column that allowing hiding the upgrade and building section
 */
function CreateSectionHideButtons() {
  const div = document.createElement('div');
  div.id = 'CMSectionHidButtons';
  div.style.textAlign = 'center';
  const a = document.createElement('a');
  a.className = 'option';
  a.onclick = function () {
    if (l('upgrades').style.display === 'flex') {
      l('upgrades').style.display = 'none';
      l('toggleUpgrades').style.display = 'none';
      l('techUpgrades').style.display = 'none';
      l('vaultUpgrades').style.display = 'none';
    } else {
      l('upgrades').style.display = 'flex';
      if (l('toggleUpgrades').children.length !== 0) l('toggleUpgrades').style.display = 'block';
      if (l('techUpgrades').children.length !== 0) l('techUpgrades').style.display = 'block';
      if (l('vaultUpgrades').children.length !== 0) l('vaultUpgrades').style.display = 'block';
    }
  };
  a.textContent = 'Hide/Show Upgrades';
  div.appendChild(a);
  const b = document.createElement('a');
  b.className = 'option';
  b.onclick = function () {
    if (l('products').style.display === 'grid') l('products').style.display = 'none';
    else l('products').style.display = 'grid';
  };
  b.textContent = 'Hide/Show Buildings';
  div.appendChild(b);
  l('store').insertBefore(div, l('store').childNodes[2]);
}

;// CONCATENATED MODULE: ./src/Disp/HelperFunctions/PopWrinklers.js
/**
 * This function pops all normal wrinklers
 * It is called by a click of the 'pop all' button created by CM.Disp.AddMenuStats()
 */
function PopAllNormalWrinklers() {
  Object.keys(Game.wrinklers).forEach((i) => {
    if (Game.wrinklers[i].sucked > 0 && Game.wrinklers[i].type === 0) {
      Game.wrinklers[i].hp = 0;
    }
  });
}

;// CONCATENATED MODULE: ./src/Disp/Tooltips/Tooltip.js

 // eslint-disable-line no-unused-vars




/** All general functions related to creating and updating tooltips */

/**
 * This function creates some very basic tooltips, (e.g., the tooltips in the stats page)
 * The tooltips are created with CM.Disp[placeholder].appendChild(desc)
 * @param	{string}	placeholder	The name used to later refer and spawn the tooltip
 * @param	{string}	text		The text of the tooltip
 * @param	{string}	minWidth	The minimum width of the tooltip
 */
function CreateSimpleTooltip(placeholder, text, minWidth) {
  const Tooltip = document.createElement('div');
  Tooltip.id = placeholder;
  const desc = document.createElement('div');
  desc.style.minWidth = minWidth;
  desc.style.marginBottom = '4px';
  const div = document.createElement('div');
  div.style.textAlign = 'left';
  div.textContent = text;
  desc.appendChild(div);
  Tooltip.appendChild(desc);
  SimpleTooltipElements[placeholder] = Tooltip;
}

/**
 * This function enhance the standard tooltips by creating and changing l('tooltip')
 * The function is called by .onmouseover events that have replaced original code to use CM.Disp.Tooltip()
 * @param	{string}	type					Type of tooltip (b, u, s or g)
 * @param	{string}	name					Name of the object/item the tooltip relates to
 * @returns {string}	l('tooltip').innerHTML	The HTML of the l('tooltip')-object
 */
function CreateTooltip(type, name) {
  if (type === 'b') {
    // Buildings
    l('tooltip').innerHTML = Game.Objects[name].tooltip();
    // Adds amortization info to the list of info per building
    if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TooltipAmor === 1) {
      const buildPrice = BuildingGetPrice(
        Game.Objects[name],
        Game.Objects[name].basePrice,
        0,
        Game.Objects[name].free,
        Game.Objects[name].amount,
      );
      const amortizeAmount = buildPrice - Game.Objects[name].totalCookies;
      if (amortizeAmount > 0) {
        l('tooltip').innerHTML = l('tooltip')
          .innerHTML.split('so far</div>')
          .join(
            `so far<br/>&bull; <b>${Beautify_Beautify(amortizeAmount)}</b> ${
              Math.floor(amortizeAmount) === 1 ? 'cookie' : 'cookies'
            } left to amortize (${
              GetTimeColour(
                (buildPrice - Game.Objects[name].totalCookies) /
                  (Game.Objects[name].storedTotalCps * Game.globalCpsMult),
              ).text
            })</div>`,
          );
      }
    }
    if (Game.buyMode === -1) {
      /*
       * Fix sell price displayed in the object tooltip.
       *
       * The buildings sell price displayed by the game itself (without any mod) is incorrect.
       * The following line of code fixes this issue, and can be safely removed when the game gets fixed.
       *
       * This issue is extensively detailed here: https://github.com/Aktanusa/CookieMonster/issues/359#issuecomment-735658262
       */
      l('tooltip').innerHTML = l('tooltip')
        .innerHTML.split(Beautify_Beautify(Game.Objects[name].bulkPrice))
        .join(
          Beautify_Beautify(
            (Game.Objects[name],
            Game.Objects[name].basePrice,
            Game.Objects[name].amount,
            Game.Objects[name].free,
            Game.buyBulk,
            1),
          ),
        );
    }
  } else if (type === 'u') {
    // Upgrades
    if (!Game.UpgradesInStore[name]) return '';
    l('tooltip').innerHTML = Game.crateTooltip(Game.UpgradesInStore[name], 'store');
  } else if (type === 's') l('tooltip').innerHTML = Game.lumpTooltip();
  // Sugar Lumps
  else if (type === 'g')
    l('tooltip').innerHTML = Game.Objects['Wizard tower'].minigame.spellTooltip(name)();
  // Grimoire
  else if (type === 'p')
    l('tooltip').innerHTML = Game.ObjectsById[2].minigame.tileTooltip(name[0], name[1])();
  // Harvest all button in garden
  else if (type === 'ha') l('tooltip').innerHTML = Game.ObjectsById[2].minigame.toolTooltip(1)();
  else if (type === 'wb') l('tooltip').innerHTML = '';
  else if (type === 'pag') l('tooltip').innerHTML = Game.Objects.Temple.minigame.godTooltip(name)();
  else if (type === 'pas')
    l('tooltip').innerHTML = Game.Objects.Temple.minigame.slotTooltip(name[0])();

  // Adds area for extra tooltip-sections
  if (
    (type === 'b' && Game.buyMode === 1) ||
    type === 'u' ||
    type === 's' ||
    type === 'g' ||
    (type === 'p' && !Game.keys[16]) ||
    type === 'ha' ||
    type === 'wb' ||
    type === 'pag' ||
    (type === 'pas' && name[1] !== -1)
  ) {
    const area = document.createElement('div');
    area.id = 'CMTooltipArea';
    l('tooltip').appendChild(area);
  }

  // Sets global variables used by CM.Disp.UpdateTooltip()
  TooltipType = type;
  TooltipName = name;

  UpdateTooltips();

  return l('tooltip').innerHTML;
}

;// CONCATENATED MODULE: ./src/Disp/Initialization/CreateWrinklerButton.js




/**
 * This function creates two objects at the bottom of the left column that allowing popping of wrinklers
 */
function CreateWrinklerButtons() {
  const popAllA = document.createElement('a');
  popAllA.id = 'PopAllNormalWrinklerButton';
  popAllA.textContent = 'Pop All Normal';
  popAllA.className = 'option';
  popAllA.onclick = function () {
    PopAllNormalWrinklers();
  };
  popAllA.onmouseout = function () {
    Game.tooltip.shouldHide = 1;
  };
  popAllA.onmouseover = function () {
    Game.tooltip.dynamic = 1;
    Game.tooltip.draw(this, () => CreateTooltip('wb', 'PopAllNormal'), 'this');
    Game.tooltip.wobble();
  };
  l('sectionLeftExtra').children[0].append(popAllA);
  const popFattestA = document.createElement('a');
  popFattestA.id = 'PopFattestWrinklerButton';
  popFattestA.textContent = 'Pop Single Fattest';
  popFattestA.className = 'option';
  popFattestA.onclick = function () {
    if (CacheWrinklersFattest[1] !== null) Game.wrinklers[CacheWrinklersFattest[1]].hp = 0;
  };
  popFattestA.onmouseout = function () {
    Game.tooltip.shouldHide = 1;
  };
  popFattestA.onmouseover = function () {
    Game.tooltip.dynamic = 1;
    Game.tooltip.draw(this, () => CreateTooltip('wb', 'PopFattest'), 'this');
    Game.tooltip.wobble();
  };
  l('sectionLeftExtra').children[0].append(popFattestA);
}

;// CONCATENATED MODULE: ./src/Disp/Initialization/CssArea.js


/**
 * This function creates a CSS style that stores certain standard CSS classes used by CookieMonster

 */
function CreateCssArea() {
  DispCSS = document.createElement('style');
  DispCSS.type = 'text/css';
  DispCSS.id = 'CMCSS';

  document.head.appendChild(DispCSS);
}

;// CONCATENATED MODULE: ./src/Disp/Initialization/UpdateBuildingUpgradeStyle.js
/**
 * This function updates the style of the building and upgrade sections to make these sortable
 */
function UpdateBuildingUpgradeStyle() {
  l('products').style.display = 'grid';
  l('storeBulk').style.gridRow = '1/1';

  l('upgrades').style.display = 'flex';
  l('upgrades').style['flex-wrap'] = 'wrap';
}

;// CONCATENATED MODULE: ./src/Disp/Initialization/FlashScreen.js
/**
 * This function creates a white square over the full screen and appends it to l('wrapper')
 */
function CreateFlashScreen() {
  const WhiteScreen = document.createElement('div');
  WhiteScreen.id = 'CMFlashScreen';
  WhiteScreen.style.width = '100%';
  WhiteScreen.style.height = '100%';
  WhiteScreen.style.backgroundColor = 'white';
  WhiteScreen.style.display = 'none';
  WhiteScreen.style.zIndex = '9999999999';
  WhiteScreen.style.position = 'absolute';
  l('wrapper').appendChild(WhiteScreen);
}

;// CONCATENATED MODULE: ./src/Disp/TabTitle/FavIcon.js



/**
 * This function creates the Favicon, it is called by CM.Main.DelayInit()
 */
function CreateFavicon() {
  const Favicon = document.createElement('link');
  Favicon.id = 'CMFavicon';
  Favicon.rel = 'shortcut icon';
  Favicon.href = 'https://orteil.dashnet.org/cookieclicker/favicon.ico';
  document.getElementsByTagName('head')[0].appendChild(Favicon);
}

/**
 * This function updates the Favicon depending on whether a Golden Cookie has spawned
 * By relying on CM.Cache.spawnedGoldenShimmer it only changes for non-user spawned cookie
 */
function UpdateFavicon() {
  if (
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.Favicon === 1 &&
    LastGoldenCookieState > 0
  ) {
    if (CacheSpawnedGoldenShimmer.wrath)
      l('CMFavicon').href =
        'https://CookieMonsterTeam.github.io/CookieMonster/favicon/wrathCookie.ico';
    else
      l('CMFavicon').href =
        'https://CookieMonsterTeam.github.io/CookieMonster/favicon/goldenCookie.ico';
  } else l('CMFavicon').href = 'https://orteil.dashnet.org/cookieclicker/favicon.ico';
}

;// CONCATENATED MODULE: ./src/Sim/InitializeData/InitData.js
/** Functions used to create static objects of Buildings, Upgrades and Achievements */







/**
 * This function creates static objects for Buildings, Upgrades and Achievements
 */
function InitData() {
  // Buildings
  SimObjects = [];
  Object.keys(Game.Objects).forEach((i) => {
    SimObjects[i] = InitialBuildingData(i);
  });

  // Upgrades
  SimUpgrades = [];
  Object.keys(Game.Upgrades).forEach((i) => {
    SimUpgrades[i] = InitUpgrade(i);
  });

  // Achievements
  SimAchievements = [];
  Object.keys(Game.Achievements).forEach((i) => {
    SimAchievements[i] = InitAchievement(i);
  });
  CopyData();
}

;// CONCATENATED MODULE: ./src/Main/ReplaceGameElements/TooltipGrimoire.js



/**
 * This function replaces the original .onmouseover functions of the Grimoire minigame
 */
function ReplaceTooltipGrimoire() {
  if (Game.Objects['Wizard tower'].minigameLoaded) {
    Object.keys(Game.Objects['Wizard tower'].minigame.spellsById).forEach((i) => {
      if (l(`grimoireSpell${i}`).onmouseover !== null) {
        TooltipGrimoireBackup[i] = l(`grimoireSpell${i}`).onmouseover;
        l(`grimoireSpell${i}`).onmouseover = function () {
          Game.tooltip.dynamic = 1;
          Game.tooltip.draw(this, () => CreateTooltip('g', `${i}`), 'this');
          Game.tooltip.wobble();
        };
      }
    });
  }
}

;// CONCATENATED MODULE: ./src/Main/ReplaceGameElements/NativeGrimoire.js





/**
 * This function fixes replaces the .draw function of the Grimoire
 */
function ReplaceNativeGrimoireDraw() {
  if (!HasReplaceNativeGrimoireDraw && Game.Objects['Wizard tower'].minigameLoaded) {
    const { minigame } = Game.Objects['Wizard tower'];
    BackupGrimoireDraw = minigame.draw;
    Game.Objects['Wizard tower'].minigame.draw = function () {
      BackupGrimoireDraw();
      if (
        Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.GrimoireBar === 1 &&
        minigame.magic < minigame.magicM
      ) {
        minigame.magicBarTextL.innerHTML += ` (${FormatTime(
          CalculateGrimoireRefillTime(minigame.magic, minigame.magicM, minigame.magicM),
        )})`;
      }
    };
    HasReplaceNativeGrimoireDraw = true;
  }
}

/**
 * This function fixes replaces the .launch function of the Grimoire
 */
function ReplaceNativeGrimoireLaunch() {
  if (!HasReplaceNativeGrimoireLaunch && Game.Objects['Wizard tower'].minigameLoaded) {
    const { minigame } = Game.Objects['Wizard tower'];
    BackupGrimoireLaunch = minigame.launch;
    BackupGrimoireLaunchMod = new Function( // eslint-disable-line no-new-func
      `return ${minigame.launch
        .toString()
        .split('=this')
        .join("= Game.Objects['Wizard tower'].minigame")}`,
    );
    Game.Objects['Wizard tower'].minigame.launch = function () {
      BackupGrimoireLaunchMod();
      ReplaceTooltipGrimoire();
      HasReplaceNativeGrimoireDraw = false;
      ReplaceNativeGrimoireDraw();

      HasReplaceNativeGrimoireLaunch = true;
    };
  }
}

/**
 * This function fixes replaces the Launch and Draw functions of the Grimoire
 */
function ReplaceNativeGrimoire() {
  ReplaceNativeGrimoireLaunch();
  ReplaceNativeGrimoireDraw();
}

;// CONCATENATED MODULE: ./src/Main/ReplaceGameElements/Tooltips.js
/** Functions related to replacing tooltips */


 // eslint-disable-line no-unused-vars



/**
 * This function replaces the original .onmouseover functions of buildings
 */
function ReplaceTooltipBuild() {
  Object.keys(Game.Objects).forEach((i) => {
    const me = Game.Objects[i];
    if (l(`product${me.id}`).onmouseover !== null) {
      TooltipBuildBackup[i] = l(`product${me.id}`).onmouseover;
      l(`product${me.id}`).onmouseover = function () {
        Game.tooltip.dynamic = 1;
        Game.tooltip.draw(this, () => CreateTooltip('b', `${i}`), 'store');
        Game.tooltip.wobble();
      };
    }
  });
}

/**
 * This function replaces the original .onmouseover functions of sugar lumps
 */
function ReplaceTooltipLump() {
  if (Game.canLumps()) {
    TooltipLumpBackup = l('lumps').onmouseover;
    l('lumps').onmouseover = function () {
      Game.tooltip.dynamic = 1;
      Game.tooltip.draw(this, () => CreateTooltip('s', 'Lump'), 'this');
      Game.tooltip.wobble();
    };
  }
}

/**
 * This function replaces the original .onmouseover functions of all garden plants
 */
function ReplaceTooltipGarden() {
  if (Game.Objects.Farm.minigameLoaded) {
    l('gardenTool-1').onmouseover = function () {
      Game.tooltip.dynamic = 1;
      Game.tooltip.draw(this, () => CreateTooltip('ha', 'HarvestAllButton'), 'this');
      Game.tooltip.wobble();
    };
    Array.from(l('gardenPlot').children).forEach((child) => {
      const coords = child.id.slice(-3);
      // eslint-disable-next-line no-param-reassign
      child.onmouseover = function () {
        Game.tooltip.dynamic = 1;
        Game.tooltip.draw(this, () => CreateTooltip('p', [`${coords[0]}`, `${coords[2]}`]), 'this');
        Game.tooltip.wobble();
      };
    });
  }
}

function ReplaceTooltipPantheon() {
  if (Game.Objects.Temple.minigameLoaded) {
    for (let i = 0; i < 11; i += 1) {
      l(`templeGod${i}`).onmouseover = function () {
        Game.tooltip.dynamic = 1;
        Game.tooltip.draw(this, () => CreateTooltip('pag', i), 'this');
        Game.tooltip.wobble();
      };
    }
    for (let i = 0; i < 3; i += 1) {
      l(`templeSlot${i}`).onmouseover = function () {
        Game.tooltip.dynamic = 1;
        Game.tooltip.draw(
          this,
          () => CreateTooltip('pas', [i, Game.Objects.Temple.minigame.slot[i]]),
          'this',
        );
        Game.tooltip.wobble();
      };
    }
  }
}

/**
 * This function call all functions that replace Game-tooltips with Cookie Monster enhanced tooltips
 */
function ReplaceTooltips() {
  ReplaceTooltipBuild();
  ReplaceTooltipLump();

  // Replace Tooltips of Minigames. Nesting it in LoadMinigames makes sure to replace them even if
  // they were not loaded initially
  // eslint-disable-next-line prefer-destructuring
  LoadMinigames = Game.LoadMinigames;
  Game.LoadMinigames = function () {
    LoadMinigames();
    ReplaceTooltipGarden();
    ReplaceTooltipGrimoire();
    ReplaceTooltipPantheon();
    ReplaceNativeGrimoire();
  };
  Game.LoadMinigames();
}

// EXTERNAL MODULE: ./node_modules/@eastdesire/jscolor/jscolor.js
var jscolor = __webpack_require__(877);
var jscolor_default = /*#__PURE__*/__webpack_require__.n(jscolor);
;// CONCATENATED MODULE: ./src/Cache/Dragon/Dragon.js
/** Functions related to the Dragon */




 // eslint-disable-line no-unused-vars

/**
 * This functions caches the current cost of upgrading the dragon level so it can be displayed in the tooltip
 */
function CacheDragonCost() {
  if (CacheLastDragonLevel !== Game.dragonLevel || SimDoSims) {
    if (
      Game.dragonLevel < 25 &&
      Game.dragonLevels[Game.dragonLevel].buy.toString().includes('sacrifice')
    ) {
      let target = Game.dragonLevels[Game.dragonLevel].buy.toString().match(/Objects\[(.*)\]/)[1];
      const amount = Game.dragonLevels[Game.dragonLevel].buy
        .toString()
        .match(/sacrifice\((.*?)\)/)[1];
      if (target !== 'i') {
        target = target.replaceAll("'", '');
        if (Game.Objects[target].amount < amount) {
          CacheCostDragonUpgrade = 'Not enough buildings to sell';
        } else {
          let cost = 0;
          CopyData();
          for (let i = 0; i < amount; i++) {
            let price =
              SimObjects[target].basePrice *
              Game.priceIncrease **
                Math.max(0, SimObjects[target].amount - 1 - SimObjects[target].free);
            price = Game.modifyBuildingPrice(SimObjects[target], price);
            price = Math.ceil(price);
            cost += price;
            SimObjects[target].amount -= 1;
          }
          CacheCostDragonUpgrade = `Cost to rebuy: ${Beautify_Beautify(cost)}`;
        }
      } else {
        let cost = 0;
        CopyData();
        Object.keys(Game.Objects).forEach((j) => {
          target = j;
          if (Game.Objects[target].amount < amount) {
            CacheCostDragonUpgrade = 'Not enough buildings to sell';
            return;
          }
          for (let i = 0; i < amount; i++) {
            let price =
              SimObjects[target].basePrice *
              Game.priceIncrease **
                Math.max(0, SimObjects[target].amount - 1 - SimObjects[target].free);
            price = Game.modifyBuildingPrice(SimObjects[target], price);
            price = Math.ceil(price);
            cost += price;
            SimObjects[target].amount -= 1;
          }
          CacheCostDragonUpgrade = `Cost to rebuy: ${Beautify_Beautify(cost)}`;
        });
      }
    }
    CacheLastDragonLevel = Game.dragonLevel;
  }
}

;// CONCATENATED MODULE: ./src/Sim/SimulationEvents/AuraChange.js






/**
 * This functions calculates the cps and cost of changing a Dragon Aura
 * It is called by CM.Disp.AddAuraInfo()
 * @param	{number}			aura										The number of the aura currently selected by the mouse/user
 * @returns {[number, number]} 	[CM.Sim.cookiesPs - Game.cookiesPs, price]	The bonus cps and the price of the change
 */
function CalculateChangeAura(aura) {
  CopyData();

  // Check if aura being changed is first or second aura
  const auraToBeChanged = l('promptContent').children[0].innerHTML.includes('secondary');
  if (auraToBeChanged) SimDragonAura2 = aura;
  else SimDragonAura = aura;

  // Sell highest building but only if aura is different
  let price = 0;
  if (SimDragonAura !== CacheDragonAura || SimDragonAura2 !== CacheDragonAura2) {
    for (let i = Game.ObjectsById.length - 1; i > -1; --i) {
      if (Game.ObjectsById[i].amount > 0) {
        const highestBuilding = SimObjects[Game.ObjectsById[i].name].name;
        SimObjects[highestBuilding].amount -= 1;
        SimBuildingsOwned -= 1;
        price =
          SimObjects[highestBuilding].basePrice *
          Game.priceIncrease **
            Math.max(0, SimObjects[highestBuilding].amount - 1 - SimObjects[highestBuilding].free);
        price = Game.modifyBuildingPrice(SimObjects[highestBuilding], price);
        price = Math.ceil(price);
        break;
      }
    }
  }

  const lastAchievementsOwned = SimAchievementsOwned;
  CalculateGains();

  CheckOtherAchiev();
  if (lastAchievementsOwned !== SimAchievementsOwned) {
    CalculateGains();
  }
  return [SimCookiesPs - Game.cookiesPs, price];
}

;// CONCATENATED MODULE: ./src/Disp/Dragon/Dragon.js
/** Functions related to the Dragon */







/**
 * This functions adds the two extra lines about CPS and time to recover to the aura picker infoscreen
 * @param	{number}	aura	The number of the aura currently selected by the mouse/user
 */
function AddAuraInfo(aura) {
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.DragonAuraInfo === 1) {
    const [bonusCPS, priceOfChange] = CalculateChangeAura(aura);
    const timeToRecover = FormatTime(priceOfChange / (bonusCPS + Game.cookiesPs));
    let bonusCPSPercentage;
    if (Game.cookiesPs === 0) bonusCPSPercentage = Beautify_Beautify(Infinity);
    else bonusCPSPercentage = Beautify_Beautify((bonusCPS / Game.cookiesPs) * 100);

    l('dragonAuraInfo').style.minHeight = '60px';
    l('dragonAuraInfo').style.margin = '8px';
    l('dragonAuraInfo').appendChild(document.createElement('div')).className = 'line';
    const div = document.createElement('div');
    div.style.minWidth = '200px';
    div.style.textAlign = 'center';
    div.textContent = `Picking this aura will change CPS by ${Beautify_Beautify(
      bonusCPS,
    )} (${bonusCPSPercentage}% of current CPS).`;
    l('dragonAuraInfo').appendChild(div);
    const div2 = document.createElement('div');
    div2.style.minWidth = '200px';
    div2.style.textAlign = 'center';
    div2.textContent = `It will take ${timeToRecover} to recover the cost.`;
    l('dragonAuraInfo').appendChild(div2);
  }
}

/**
 * This functions adds a tooltip to the level up button displaying the cost of rebuying all
 * It is called by Game.ToggleSpecialMenu() after CM.Main.ReplaceNative()
 */
function AddDragonLevelUpTooltip() {
  // Check if it is the dragon popup that is on screen
  if (
    (l('specialPopup').className.match(/onScreen/) &&
      l('specialPopup').children[0].style.background.match(/dragon/)) !== null
  ) {
    for (let i = 0; i < l('specialPopup').childNodes.length; i++) {
      if (l('specialPopup').childNodes[i].className === 'optionBox') {
        l('specialPopup').children[i].onmouseover = function () {
          CacheDragonCost();
          Game.tooltip.dynamic = 1;
          Game.tooltip.draw(
            l('specialPopup'),
            `<div style="min-width:200px;text-align:center;">${CacheCostDragonUpgrade}</div>`,
            'this',
          );
          Game.tooltip.wobble();
        };
        l('specialPopup').children[i].onmouseout = function () {
          Game.tooltip.shouldHide = 1;
        };
      }
    }
  }
}

;// CONCATENATED MODULE: ./src/Sim/SimulationEvents/ResetAscension.js





 // eslint-disable-line no-unused-vars

/**
 * This function calculates the cookies per click difference betwene current and after a ascension
 * It is called by CM.Disp.CreateStatsPrestigeSection()
 * @param	{number}	newHeavenlyChips	The total heavenly chips after ascension
 * @returns	{number}	ResetCPS			The CPS difference after reset
 */
function ResetBonus(newHeavenlyChips) {
  // Calculate CPS with all Heavenly upgrades
  let curCPS = Game.cookiesPs;

  CopyData();

  if (SimUpgrades["Heavenly key"].bought === 0) {
    SimUpgrades["Heavenly chip secret"].bought = 1;
    SimUpgrades["Heavenly cookie stand"].bought = 1;
    SimUpgrades["Heavenly bakery"].bought = 1;
    SimUpgrades["Heavenly confectionery"].bought = 1;
    SimUpgrades["Heavenly key"].bought = 1;

    CalculateGains();

    curCPS = SimCookiesPs;

    CopyData();
  }

  if (CacheRealCookiesEarned >= 1000000) SimWin('Sacrifice');
  if (CacheRealCookiesEarned >= 1000000000) SimWin('Oblivion');
  if (CacheRealCookiesEarned >= 1000000000000) SimWin('From scratch');
  if (CacheRealCookiesEarned >= 1000000000000000) SimWin('Nihilism');
  if (CacheRealCookiesEarned >= 1000000000000000000) SimWin('Dematerialize');
  if (CacheRealCookiesEarned >= 1000000000000000000000) SimWin('Nil zero zilch');
  if (CacheRealCookiesEarned >= 1000000000000000000000000) SimWin('Transcendence');
  if (CacheRealCookiesEarned >= 1000000000000000000000000000) SimWin('Obliterate');
  if (CacheRealCookiesEarned >= 1000000000000000000000000000000) SimWin('Negative void');
  if (CacheRealCookiesEarned >= 1000000000000000000000000000000000) SimWin('To crumbs, you say?');
  if (CacheRealCookiesEarned >= 1000000000000000000000000000000000000) SimWin('You get nothing');
  if (CacheRealCookiesEarned >= 1000000000000000000000000000000000000000)
    SimWin('Humble rebeginnings');
  if (CacheRealCookiesEarned >= 1000000000000000000000000000000000000000000)
    SimWin('The end of the world');
  if (CacheRealCookiesEarned >= 1000000000000000000000000000000000000000000000)
    SimWin("Oh, you're back");
  if (CacheRealCookiesEarned >= 1000000000000000000000000000000000000000000000000)
    SimWin('Lazarus');
  if (CacheRealCookiesEarned >= 1000000000000000000000000000000000000000000000000000)
    SimWin('Smurf account');
  if (CacheRealCookiesEarned >= 1000000000000000000000000000000000000000000000000000000)
    SimWin("If at first you don't succeed");

  SimUpgrades["Heavenly chip secret"].bought = 1;
  SimUpgrades["Heavenly cookie stand"].bought = 1;
  SimUpgrades["Heavenly bakery"].bought = 1;
  SimUpgrades["Heavenly confectionery"].bought = 1;
  SimUpgrades["Heavenly key"].bought = 1;

  SimPrestige = newHeavenlyChips;

  const lastAchievementsOwned = SimAchievementsOwned;

  CalculateGains();

  CheckOtherAchiev();

  if (lastAchievementsOwned !== SimAchievementsOwned) {
    CalculateGains();
  }

  const ResetCPS = SimCookiesPs - curCPS;

  // Reset Pretige level after calculation as it is used in CM.Sim.CalculateGains() so can't be local
  SimPrestige = Game.prestige;

  return ResetCPS;
}

;// CONCATENATED MODULE: ./src/Config/CheckNotificationPermissions.js
/**
 * This function checks if the user has given permissions for notifications
 * It is called by a change in any of the notification options
 * Note that most browsers will stop asking if the user has ignored the prompt around 6 times
 * @param 	{number}	ToggleOnOff		A number indicating whether the option has been turned off (0) or on (1)
 */
function CheckNotificationPermissions(ToggleOnOff) {
  if (ToggleOnOff === 1) {
    // Check if browser support Promise version of Notification Permissions
    const checkNotificationPromise = function () {
      try {
        Notification.requestPermission().then();
      } catch (e) {
        return false;
      }
      return true;
    };

    // Check if the browser supports notifications and which type
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications.'); // eslint-disable-line no-console
    } else if (checkNotificationPromise()) {
      Notification.requestPermission().then();
    } else {
      Notification.requestPermission();
    }
  }
}

/* harmony default export */ const Config_CheckNotificationPermissions = (CheckNotificationPermissions);

;// CONCATENATED MODULE: ./src/Config/Toggles/ToggleBotBar.js



/**
 * This function toggle the bottom bar
 * It is called by CM.Disp.UpdateAscendState() and a change in Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.BotBar
 */
function ToggleBotBar() {
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.BotBar === 1) {
    l('CMBotBar').style.display = '';
    UpdateBotBar();
  } else {
    l('CMBotBar').style.display = 'none';
  }
  UpdateBotTimerBarPosition();
}

;// CONCATENATED MODULE: ./src/Config/Toggles/ToggleDetailedTime.js



/**
 * This function changes some of the time-displays in the game to be more detailed
 * It is called by a change in CM.Options.DetailedTime
 */
function ToggleDetailedTime() {
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.DetailedTime === 1)
    Game.sayTime = CMSayTime;
  else Game.sayTime = BackupFunctions.sayTime;
}

;// CONCATENATED MODULE: ./src/Config/Toggles/ToggleGCTimer.js



/**
 * This function toggles GC Timers are visible
 * It is called by a change in CM.Options.GCTimer
 */
function ToggleGCTimer() {
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.GCTimer === 1) {
    Object.keys(GCTimers).forEach((i) => {
      GCTimers[i].style.display = 'block';
      GCTimers[i].style.left = CacheGoldenShimmersByID[i].l.style.left;
      GCTimers[i].style.top = CacheGoldenShimmersByID[i].l.style.top;
    });
  } else {
    // eslint-disable-next-line no-return-assign
    Object.keys(GCTimers).forEach((i) => (GCTimers[i].style.display = 'none'));
  }
}

;// CONCATENATED MODULE: ./src/Config/Toggles/ToggleSectionHideButtons.js
/**
 * This function updates the display setting of the two objects created by CM.Disp.CreateWrinklerButtons()
 * It is called by changes in CM.Options.WrinklerButtons
 */
function ToggleSectionHideButtons() {
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.HideSectionsButtons) {
    l('CMSectionHidButtons').style.display = '';
  } else {
    l('CMSectionHidButtons').style.display = 'none';
  }
}

;// CONCATENATED MODULE: ./src/Config/Toggles/ToggleUpgradeBarAndColour.js


/**
 * This function toggles the upgrade bar and the colours of upgrades
 * It is called by a change in CM.Options.UpBarColor
 */
function ToggleUpgradeBarAndColor() {
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.UpBarColor === 1) {
    // Colours and bar on
    l('CMUpgradeBar').style.display = '';
    UpdateUpgrades();
  } else if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.UpBarColor === 2) {
    // Colours on and bar off
    l('CMUpgradeBar').style.display = 'none';
    UpdateUpgrades();
  } else {
    // Colours and bar off
    l('CMUpgradeBar').style.display = 'none';
    Game.RebuildUpgrades();
  }
}

;// CONCATENATED MODULE: ./src/Config/Toggles/ToggleUpgradeBarFixedPos.js
/**
 * This function toggles the position of the upgrade bar from fixed or non-fixed mode
 * It is called by a change in CM.Options.UpgradeBarFixedPos
 */
function ToggleUpgradeBarFixedPos() {
  if (
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.UpgradeBarFixedPos === 1
  ) {
    // Fix to top of screen when scrolling
    l('CMUpgradeBar').style.position = 'sticky';
    l('CMUpgradeBar').style.top = '0px';
  } else {
    l('CMUpgradeBar').style.position = ''; // Possible to scroll offscreen
  }
}

;// CONCATENATED MODULE: ./src/Disp/HelperFunctions/RefreshScale.js




/**
 * This function refreshes all numbers after a change in scale-setting
 * It is therefore called by a changes in CM.Options.Scale, CM.Options.ScaleDecimals, CM.Options.ScaleSeparator and CM.Options.ScaleCutoff
 */
function RefreshScale() {
  BeautifyAll();
  Game.RefreshStore();
  Game.RebuildUpgrades();

  UpdateBotBar();
  UpdateBuildings();
  UpdateUpgrades();
}

;// CONCATENATED MODULE: ./src/Data/SettingClasses/BaseSetting.ts
/** The basic setting class */
class Setting {
    constructor(defaultValue, type, group) {
        this.defaultValue = defaultValue;
        this.type = type;
        this.group = group;
    }
}

;// CONCATENATED MODULE: ./src/Data/SettingClasses/SettingColours.ts

/** The colour picker setting class */
class SettingColours extends Setting {
    constructor(defaultValue, type, group, desc) {
        super(defaultValue, type, group);
        this.desc = desc;
    }
}

;// CONCATENATED MODULE: ./src/Data/SettingClasses/SettingInputNumber.ts

/** The number input setting class */
class SettingInputNumber extends Setting {
    constructor(defaultValue, type, group, label, desc, min, max) {
        super(defaultValue, type, group);
        this.label = label;
        this.desc = desc;
        this.min = min;
        this.max = max;
    }
}

;// CONCATENATED MODULE: ./src/Data/SettingClasses/SettingStandard.ts

/** The standard toggle setting class */
class SettingStandard extends Setting {
    constructor(defaultValue, type, group, label, desc, toggle, func) {
        super(defaultValue, type, group);
        this.label = label;
        this.desc = desc;
        this.toggle = toggle;
        if (func !== undefined) {
            this.func = func;
        }
    }
}

;// CONCATENATED MODULE: ./src/Data/SettingClasses/SettingVolume.ts

/** The volume level setting class */
class SettingVolume extends Setting {
    constructor(defaultValue, type, group, label, desc) {
        super(defaultValue, type, group);
        this.label = label;
        this.desc = desc;
        for (let i = 0; i < 101; i++) {
            this.label[i] = `${i}%`;
        }
    }
}

;// CONCATENATED MODULE: ./src/Data/settings.js















 // eslint-disable-line no-unused-vars





/** This includes all options of CookieMonster and their relevant data */
const settings_settings = {
  // Calculation
  CPSMode: new SettingStandard(
    1,
    'bool',
    'Calculation',
    ['Current cookies per second', 'Average cookies per second'],
    'Calculate times using current cookies per second or average cookies per second',
    false,
  ),
  AvgCPSHist: new SettingStandard(
    3,
    'bool',
    'Calculation',
    [
      'Average CPS in past 10s',
      'Average CPS in past 15s',
      'Average CPS in past 30s',
      'Average CPS in past 1m',
      'Average CPS in past 5m',
      'Average CPS in past 10m',
      'Average CPS in past 15m',
      'Average CPS in past 30m',
    ],
    'How much time average Cookies Per Second should consider',
    false,
  ),
  AvgClicksHist: new SettingStandard(
    0,
    'bool',
    'Calculation',
    [
      'Average clicks in past 1s',
      'Average clicks in past 5s',
      'Average clicks in past 10s',
      'Average clicks in past 15s',
      'Average clicks in past 30s',
    ],
    'How much time average Cookie Clicks should consider',
    false,
  ),
  CalcWrink: new SettingStandard(
    0,
    'bool',
    'Calculation',
    [
      'Calculate with wrinklers OFF',
      'Calculate with wrinklers ON',
      'Calculate with single fattest wrinkler ON',
    ],
    'Calculate times and average Cookies Per Second with (only the single non-shiny fattest) wrinklers',
    true,
    () => {
      SimDoSims = true;
    },
  ),

  // Notation
  Scale: new SettingStandard(
    2,
    'bool',
    'Notation',
    [
      "Game's setting scale",
      'Metric',
      'Short scale',
      'Short scale (Abbreviated)',
      'Scientific notation',
      'Engineering notation',
    ],
    'Change how long numbers are formatted',
    false,
    () => {
      RefreshScale();
    },
  ),
  ScaleDecimals: new SettingStandard(
    2,
    'bool',
    'Notation',
    ['1 decimals', '2 decimals', '3 decimals'],
    `Set the number of decimals used when applicable. This only works with Cookie Monster scales and not with "Game's Setting Scale"`,
    false,
    () => {
      RefreshScale();
    },
  ),
  ScaleSeparator: new SettingStandard(
    0,
    'bool',
    'Notation',
    ['. for decimals (standard)', '. for thousands'],
    'Set the separator used for decimals and thousands',
    false,
    () => {
      RefreshScale();
    },
  ),
  ScaleCutoff: new SettingInputNumber(
    999999,
    'numscale',
    'Notation',
    'Notation cut-off point: ',
    'The number from which Cookie Monster will start formatting numbers based on chosen scale. Standard is 999,999. Setting this above 999,999,999 might break certain notations',
    1,
    999999999,
  ),
  TimeFormat: new SettingStandard(
    0,
    'bool',
    'Notation',
    ['Time XXd, XXh, XXm, XXs', 'Time XX:XX:XX:XX:XX'],
    'Change the time format',
    false,
  ),
  DetailedTime: new SettingStandard(
    1,
    'bool',
    'Notation',
    ['Detailed time OFF', 'Detailed time ON'],
    'Change how time is displayed in certain statistics and tooltips',
    true,
    () => {
      ToggleDetailedTime();
    },
  ),
  PPDisplayTime: new SettingStandard(
    0,
    'bool',
    'Notation',
    ['PP as value (standard)', 'PP as time unit'],
    'Display PP as calculated value or as approximate time unit. Note that PP does not translate directly into a time unit and this is therefore only an approximation.',
    false,
  ),

  // Colours
  BuildColour: new SettingStandard(
    1,
    'bool',
    'Colours',
    ['Building colours OFF', 'Building colours ON'],
    'Colour code buildings',
    true,
    () => {
      UpdateBuildings();
    },
  ),
  PPOnlyConsiderBuyable: new SettingStandard(
    0,
    'bool',
    'Colours',
    ["Don't ignore non-buyable", 'Ignore non-buyable'],
    "Makes Cookie Monster label buildings and upgrades you can't buy right now red, useful in those situations where you just want to spend your full bank 'most optimally'",
    true,
  ),
  PPExcludeTop: new SettingStandard(
    0,
    'bool',
    'Colours',
    [
      "Don't ignore any",
      'Ignore 1st best',
      'Ignore 1st and 2nd best',
      'Ignore 1st, 2nd and 3rd best',
    ],
    'Makes Cookie Monster ignore the 1st, 2nd or 3rd best buildings in labeling and colouring PP values',
    true,
  ),
  PPRigidelMode: new SettingStandard(
    0,
    'bool',
    'Colours',
    ['Rigidel mode OFF', 'Rigidel mode ON'],
    'Makes Cookie Monster ignore all "buy 1" options when colouring PP in order to stay at a total building count ending in 10 for pantheon god Rigidel',
    true,
  ),
  PPSecondsLowerLimit: new SettingInputNumber(
    0,
    'numscale',
    'Colours',
    'Lower limit for PP (in seconds): ',
    'If a building or upgrade costs less than the specified seconds of CPS it will also be considered optimal and label it as such ("PP is less than xx seconds of CPS"); setting to 0 ignores this option',
    0,
    Infinity,
  ),
  ColourBlue: new SettingColours(
    '#4bb8f0',
    'colour',
    'Colours',
    'Standard colour is blue. Used to show upgrades better than best PP building, for Click Frenzy bar, and for various labels',
  ),
  ColourGreen: new SettingColours(
    '#00ff00',
    'colour',
    'Colours',
    'Standard colour is green. Used to show best PP building, for Blood Frenzy bar, and for various labels',
  ),
  ColourYellow: new SettingColours(
    '#ffff00',
    'colour',
    'Colours',
    'Standard colour is yellow. Used to show buildings within the top 10 of PP, for Frenzy bar, and for various labels',
  ),
  ColourOrange: new SettingColours(
    '#ff7f00',
    'colour',
    'Colours',
    'Standard colour is orange. Used to show buildings within the top 20 of PP, for Next Reindeer bar, and for various labels',
  ),
  ColourRed: new SettingColours(
    '#ff0000',
    'colour',
    'Colours',
    'Standard colour is Red. Used to show buildings within the top 30 of PP, for Clot bar, and for various labels',
  ),
  ColourPurple: new SettingColours(
    '#ff00ff',
    'colour',
    'Colours',
    'Standard colour is purple. Used to show buildings outside of the top 30 of PP, for Next Cookie bar, and for various labels',
  ),
  ColourGray: new SettingColours(
    '#b3b3b3',
    'colour',
    'Colours',
    'Standard colour is gray. Used to show negative or infinity PP, and for Next Cookie/Next Reindeer bar',
  ),
  ColourPink: new SettingColours(
    '#ff1493',
    'colour',
    'Colours',
    'Standard colour is pink. Used for Dragonflight bar',
  ),
  ColourBrown: new SettingColours(
    '#8b4513',
    'colour',
    'Colours',
    'Standard colour is brown. Used for Dragon Harvest bar',
  ),

  // BarsDisplay
  BotBar: new SettingStandard(
    1,
    'bool',
    'BarsDisplay',
    ['Bottom bar OFF', 'Bottom bar ON'],
    'Building information',
    true,
    () => {
      ToggleBotBar();
    },
  ),
  TimerBar: new SettingStandard(
    1,
    'bool',
    'BarsDisplay',
    ['Timer bar OFF', 'Timer bar ON'],
    'Bar with timers for golden cookie, season popup, Frenzy (Normal, Clot, Elder), Click Frenzy',
    true,
    () => {
      ToggleTimerBar();
    },
  ),
  TimerBarPos: new SettingStandard(
    0,
    'bool',
    'BarsDisplay',
    ['Timer bar position (top left)', 'Timer bar position (bottom)'],
    'Placement of the timer bar',
    false,
    () => {
      ToggleTimerBarPos();
    },
  ),
  TimerBarOverlay: new SettingStandard(
    2,
    'bool',
    'BarsDisplay',
    ['Timer bar overlay OFF', 'Timer bar overlay only seconds', 'Timer bar overlay full'],
    'Overlay on timers displaying seconds and/or percentage left',
    true,
  ),
  AutosaveTimerBar: new SettingStandard(
    0,
    'bool',
    'BarsDisplay',
    ['Autosave timer bar OFF', 'Autosave timer bar ON'],
    'Show a timer counting down till next autosave in the timer bar',
    true,
  ),
  UpBarColour: new SettingStandard(
    1,
    'bool',
    'BarsDisplay',
    ['Upgrade colours/bar OFF', 'Upgrade colours with bar ON', 'Upgrade colours without bar ON'],
    'Colour code upgrades and optionally add a counter bar',
    false,
    () => {
      ToggleUpgradeBarAndColor();
    },
  ),
  UpgradeBarFixedPos: new SettingStandard(
    1,
    'bool',
    'BarsDisplay',
    ['Upgrade bar fixed position OFF', 'Upgrade bar fixed position ON'],
    'Lock the upgrade bar at top of the screen to prevent it from moving ofscreen when scrolling',
    true,
    () => {
      ToggleUpgradeBarFixedPos();
    },
  ),
  SortBuildings: new SettingStandard(
    0,
    'bool',
    'BarsDisplay',
    [
      'Sort buildings: default',
      'Sort buildings: PP of x1 purchase',
      'Sort buildings: PP of selected bulk mode',
      'Sort buildings: price until next achievement',
    ],
    'Sort the display of buildings in default order, by PP, or until next achievement',
    false,
    () => {
      UpdateBuildings();
    },
  ),
  SortUpgrades: new SettingStandard(
    0,
    'bool',
    'BarsDisplay',
    ['Sort upgrades: default', 'Sort upgrades: PP'],
    'Sort the display of upgrades in either default order or by PP',
    false,
    () => {
      UpdateUpgrades();
    },
  ),
  UpgradesNeverCollapse: new SettingStandard(
    0,
    'bool',
    'BarsDisplay',
    ['Upgrades always expanded OFF', 'Upgrades always expanded ON'],
    'Toggle to make the upgrades sections always expanded to the size needed to display all upgrades',
    true,
    () => {
      UpdateUpgradeSectionsHeight();
    },
  ),
  DragonAuraInfo: new SettingStandard(
    1,
    'bool',
    'BarsDisplay',
    ['Extra dragon aura info OFF', 'Extra dragon aura info ON'],
    'Shows information about changes in CPS and costs in the dragon aura interface.',
    true,
  ),
  GrimoireBar: new SettingStandard(
    1,
    'bool',
    'BarsDisplay',
    ['Grimoire magic meter timer OFF', 'Grimoire magic meter timer ON'],
    'A timer overlay showing how long till the Grimoire magic meter is full',
    true,
  ),
  GCTimer: new SettingStandard(
    1,
    'bool',
    'BarsDisplay',
    ['Golden cookie timer OFF', 'Golden cookie timer ON'],
    'A timer on the golden cookie when it has been spawned',
    true,
    () => {
      ToggleGCTimer();
    },
  ),
  Favicon: new SettingStandard(
    1,
    'bool',
    'BarsDisplay',
    ['Favicon OFF', 'Favicon ON'],
    'Update favicon with golden/wrath cookie',
    true,
    () => {
      UpdateFavicon();
    },
  ),
  WrinklerButtons: new SettingStandard(
    1,
    'bool',
    'BarsDisplay',
    ['Extra wrinkler buttons OFF', 'Extra wrinkler buttons ON'],
    'Show buttons for popping wrinklers at bottom of cookie section',
    true,
    () => {
      ToggleWrinklerButtons();
    },
  ),
  HideSectionsButtons: new SettingStandard(
    0,
    'bool',
    'BarsDisplay',
    ['Hide buildings/upgrades button OFF', 'Hide buildings/upgrades button ON'],
    'Show buttons for hiding and showing the buildings and upgrades sections in the right column',
    true,
    () => {
      ToggleSectionHideButtons();
    },
  ),

  // Tooltip
  TooltipBuildUpgrade: new SettingStandard(
    1,
    'bool',
    'Tooltip',
    ['Building/upgrade tooltip information OFF', 'Building/upgrade tooltip information ON'],
    'Extra information in building/upgrade tooltips',
    true,
  ),
  TooltipAmor: new SettingStandard(
    0,
    'bool',
    'Tooltip',
    [
      'Buildings tooltip amortization information OFF',
      'Buildings tooltip amortization information ON',
    ],
    'Add amortization information to buildings tooltip',
    true,
  ),
  ToolWarnLucky: new SettingStandard(
    1,
    'bool',
    'Tooltip',
    ['Tooltip lucky warning OFF', 'Tooltip lucky warning ON'],
    'A warning when buying if it will put the bank under the amount needed for max "Lucky!" rewards',
    true,
  ),
  ToolWarnLuckyFrenzy: new SettingStandard(
    1,
    'bool',
    'Tooltip',
    ['Tooltip lucky frenzy warning OFF', 'Tooltip lucky frenzy warning ON'],
    'A warning when buying if it will put the bank under the amount needed for max "Lucky!" (Frenzy) rewards',
    true,
  ),
  ToolWarnConjure: new SettingStandard(
    1,
    'bool',
    'Tooltip',
    ['Tooltip conjure warning OFF', 'Tooltip conjure warning ON'],
    'A warning when buying if it will put the bank under the amount needed for max "Conjure Baked Goods" rewards',
    true,
  ),
  ToolWarnConjureFrenzy: new SettingStandard(
    1,
    'bool',
    'Tooltip',
    ['Tooltip conjure frenzy warning OFF', 'Tooltip conjure frenzy warning ON'],
    'A warning when buying if it will put the bank under the amount needed for max "Conjure Baked Goods" rewards with Frenzy active',
    true,
  ),
  ToolWarnEdifice: new SettingStandard(
    1,
    'bool',
    'Tooltip',
    ['Tooltip edifice warning OFF', 'Tooltip edifice warning ON'],
    'A warning when buying if it will put the bank under the amount needed for "Spontaneous Edifice" to possibly give you your most expensive building',
    true,
  ),
  ToolWarnUser: new SettingInputNumber(
    0,
    'numscale',
    'Tooltip',
    'Tooltip warning at x times CPS: ',
    'Use this to show a customized warning if buying it will put the bank under the amount equal to value times cps; setting to 0 disables the function altogether',
    0,
    Infinity,
  ),
  ToolWarnBon: new SettingStandard(
    1,
    'bool',
    'Tooltip',
    ['Calculate tooltip warning with bonus CPS OFF', 'Calculate tooltip warning with bonus CPS ON'],
    'Calculate the warning with or without the bonus CPS you get from buying',
    true,
  ),
  ToolWarnPos: new SettingStandard(
    1,
    'bool',
    'Tooltip',
    ['Tooltip warning position (left)', 'Tooltip warning position (bottom)'],
    'Placement of the warning boxes',
    false,
    () => {
      ToggleToolWarnPos();
    },
  ),
  TooltipGrim: new SettingStandard(
    1,
    'bool',
    'Tooltip',
    ['Grimoire tooltip information OFF', 'Grimoire tooltip information ON'],
    'Extra information in tooltip for grimoire',
    true,
  ),
  TooltipWrink: new SettingStandard(
    1,
    'bool',
    'Tooltip',
    ['Wrinkler tooltip OFF', 'Wrinkler tooltip ON'],
    'Shows the amount of cookies a wrinkler will give when popping it',
    true,
  ),
  TooltipLump: new SettingStandard(
    1,
    'bool',
    'Tooltip',
    ['Sugar lump tooltip OFF', 'Sugar lump tooltip ON'],
    'Shows the current Sugar Lump type in Sugar lump tooltip.',
    true,
  ),
  TooltipPlots: new SettingStandard(
    1,
    'bool',
    'Tooltip',
    ['Garden plots tooltip OFF', 'Garden plots tooltip ON'],
    'Shows a tooltip for plants that have a cookie reward.',
    true,
  ),
  TooltipPantheon: new SettingStandard(
    1,
    'bool',
    'Tooltip',
    ['Pantheon tooltip OFF', 'Pantheon tooltip ON'],
    'Shows additional info in the pantheon tooltip',
    true,
  ),
  TooltipAscendButton: new SettingStandard(
    1,
    'bool',
    'Tooltip',
    ['Show Extra Info Ascend Tooltip OFF', 'Show Extra Info Ascend Tooltip ON'],
    'Shows additional info in the ascend tooltip',
    true,
  ),

  // Statistics
  Stats: new SettingStandard(
    1,
    'bool',
    'Statistics',
    ['Statistics OFF', 'Statistics ON'],
    'Extra Cookie Monster statistics!',
    true,
  ),
  MissingUpgrades: new SettingStandard(
    1,
    'bool',
    'Statistics',
    ['Missing upgrades OFF', 'Missing upgrades ON'],
    'Shows missing upgrades in statistics menu',
    true,
  ),
  MissingAchievements: new SettingStandard(
    0,
    'bool',
    'Statistics',
    ['Missing Achievements OFF', 'Missing Normal Achievements ON'],
    'Shows missing normal achievements in statistics menu.',
    true,
  ),
  UpStats: new SettingStandard(
    1,
    'bool',
    'Statistics',
    ['Statistics update rate (default)', 'Statistics update rate (1s)'],
    'Default rate is once every 5 seconds',
    false,
  ),
  HeavenlyChipsTarget: new SettingInputNumber(
    1,
    'numscale',
    'Statistics',
    'Heavenly chips target: ',
    'Use this to set a heavenly chips target that will be counted towards in the "prestige" statsistics sections',
    1,
    Infinity,
  ),
  ShowMissedGC: new SettingStandard(
    1,
    'bool',
    'Statistics',
    ['Missed GC OFF', 'Missed GC ON'],
    'Show a stat in the statistics screen that counts how many golden cookies you have missed',
    true,
  ),

  // Notification
  Title: new SettingStandard(
    1,
    'bool',
    'NotificationGeneral',
    ['Title OFF', 'Title ON', 'Title pinned tab highlight'],
    'Update title with colden cookie/season popup timers; pinned tab highlight only changes the title when a golden cookie/season popup spawns; "!" means that golden cookie/reindeer can spawn',
    true,
  ),
  GeneralSound: new SettingStandard(
    1,
    'bool',
    'NotificationGeneral',
    ['Consider game volume setting OFF', 'Consider game volume setting ON'],
    'Turning this toggle to "off" makes Cookie Monster no longer consider the volume setting of the base game, allowing mod notifications to play with base game volume turned down',
    true,
  ),
  GCNotification: new SettingStandard(
    0,
    'bool',
    'NotificationGC',
    ['Notification OFF', 'Notification ON'],
    'Create a notification when golden cookie spawns',
    true,
    () => {
      Config_CheckNotificationPermissions(
        Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.GCNotification,
      );
    },
  ),
  GCFlash: new SettingStandard(
    1,
    'bool',
    'NotificationGC',
    ['Flash OFF', 'Flash ON'],
    'Flash screen on golden cookie',
    true,
  ),
  ColourGCFlash: new SettingColours(
    '#ffffff',
    'colour',
    'NotificationGC',
    'The colour of the GC flash, standard colour is white',
  ),
  GCSound: new SettingStandard(
    1,
    'bool',
    'NotificationGC',
    ['Sound OFF', 'Sound ON'],
    'Play a sound on golden cookie',
    true,
  ),
  GCVolume: new SettingVolume(100, 'vol', 'NotificationGC', [], 'Volume'),
  GCSoundURL: new SettingStandard(
    'https://freesound.org/data/previews/66/66717_931655-lq.mp3',
    'url',
    'NotificationGC',
    'Sound URL:',
    'URL of the sound to be played when a golden cookie spawns',
  ),
  FortuneNotification: new SettingStandard(
    0,
    'bool',
    'NotificationFC',
    ['Notification OFF', 'Notification ON'],
    'Create a notification when fortune cookie is on the ticker',
    true,
    () => {
      Config_CheckNotificationPermissions(
        Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.FortuneNotification,
      );
    },
  ),
  FortuneFlash: new SettingStandard(
    1,
    'bool',
    'NotificationFC',
    ['Flash OFF', 'Flash ON'],
    'Flash screen on fortune cookie spawn',
    true,
  ),
  ColourFortuneFlash: new SettingColours(
    '#ffffff',
    'colour',
    'NotificationFC',
    'The colour of the fortune flash, standard colour is white',
  ),
  FortuneSound: new SettingStandard(
    1,
    'bool',
    'NotificationFC',
    ['Sound OFF', 'Sound ON'],
    'Play a sound on fortune cookie spawn',
    true,
  ),
  FortuneVolume: new SettingVolume(100, 'vol', 'NotificationFC', [], 'Volume'),
  FortuneSoundURL: new SettingStandard(
    'https://freesound.org/data/previews/174/174027_3242494-lq.mp3',
    'url',
    'NotificationFC',
    'Sound URL:',
    'URL of the sound to be played when the ticker has a fortune cookie',
  ),
  SeaNotification: new SettingStandard(
    0,
    'bool',
    'NotificationSea',
    ['Notification OFF', 'Notification ON'],
    'Create a notification on season popup',
    true,
    () => {
      Config_CheckNotificationPermissions(
        Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.SeaNotification,
      );
    },
  ),
  SeaFlash: new SettingStandard(
    1,
    'bool',
    'NotificationSea',
    ['Flash OFF', 'Flash ON'],
    'Flash screen on season popup',
    true,
  ),
  ColourSeaFlash: new SettingColours(
    '#ffffff',
    'colour',
    'NotificationSea',
    'The colour of the season popup flash, standard colour is white',
  ),
  SeaSound: new SettingStandard(
    1,
    'bool',
    'NotificationSea',
    ['Sound OFF', 'Sound ON'],
    'Play a sound on season popup',
    true,
  ),
  SeaVolume: new SettingVolume(100, 'vol', 'NotificationSea', [], 'Volume'),
  SeaSoundURL: new SettingStandard(
    'https://www.freesound.org/data/previews/121/121099_2193266-lq.mp3',
    'url',
    'NotificationSea',
    'Sound URL:',
    'URL of the sound to be played when on season popup spawns',
  ),
  GardFlash: new SettingStandard(
    1,
    'bool',
    'NotificationGard',
    ['Garden Tick Flash OFF', 'Flash ON'],
    'Flash screen on garden tick',
    true,
  ),
  ColourGardFlash: new SettingColours(
    '#ffffff',
    'colour',
    'NotificationGard',
    'The colour of the garden flash, standard colour is white',
  ),
  GardSound: new SettingStandard(
    1,
    'bool',
    'NotificationGard',
    ['Sound OFF', 'Sound ON'],
    'Play a sound on garden tick',
    true,
  ),
  GardVolume: new SettingVolume(100, 'vol', 'NotificationGard', [], 'Volume'),
  GardSoundURL: new SettingStandard(
    'https://freesound.org/data/previews/103/103046_861714-lq.mp3',
    'url',
    'NotificationGard',
    'Garden Tick Sound URL:',
    'URL of the sound to be played when the garden ticks',
  ),
  MagicNotification: new SettingStandard(
    0,
    'bool',
    'NotificationMagi',
    ['Notification OFF', 'Notification ON'],
    'Create a notification when magic reaches maximum',
    true,
    () => {
      Config_CheckNotificationPermissions(
        Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.MagicNotification,
      );
    },
  ),
  MagicFlash: new SettingStandard(
    1,
    'bool',
    'NotificationMagi',
    ['Flash OFF', 'Flash ON'],
    'Flash screen when magic reaches maximum',
    true,
  ),
  ColourMagicFlash: new SettingColours(
    '#ffffff',
    'colour',
    'NotificationMagi',
    'The colour of the magic flash, standard colour is white',
  ),
  MagicSound: new SettingStandard(
    1,
    'bool',
    'NotificationMagi',
    ['Sound OFF', 'Sound ON'],
    'Play a sound when magic reaches maximum',
    true,
  ),
  MagicVolume: new SettingVolume(100, 'vol', 'NotificationMagi', [], 'Volume'),
  MagicSoundURL: new SettingStandard(
    'https://freesound.org/data/previews/221/221683_1015240-lq.mp3',
    'url',
    'NotificationMagi',
    'Sound URL:',
    'URL of the sound to be played when magic reaches maxium',
  ),
  WrinklerNotification: new SettingStandard(
    0,
    'bool',
    'NotificationWrink',
    ['Notification OFF', 'Notification ON'],
    'Create a notification when a wrinkler appears',
    true,
    () => {
      Config_CheckNotificationPermissions(
        Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.WrinklerNotification,
      );
    },
  ),
  WrinklerFlash: new SettingStandard(
    1,
    'bool',
    'NotificationWrink',
    ['Flash OFF', 'Flash ON'],
    'Flash screen when a wrinkler appears',
    true,
  ),
  ColourWrinklerFlash: new SettingColours(
    '#ffffff',
    'colour',
    'NotificationWrink',
    'The colour of the wrinkler flash, standard colour is white',
  ),
  WrinklerSound: new SettingStandard(
    1,
    'bool',
    'NotificationWrink',
    ['Sound OFF', 'Sound ON'],
    'Play a sound when a wrinkler appears',
    true,
  ),
  WrinklerVolume: new SettingVolume(100, 'vol', 'NotificationWrink', [], 'Volume'),
  WrinklerSoundURL: new SettingStandard(
    'https://freesound.org/data/previews/124/124186_8043-lq.mp3',
    'url',
    'NotificationWrink',
    'Sound URL:',
    'URL of the sound to be played when a wrinkler appears',
  ),
  WrinklerMaxNotification: new SettingStandard(
    0,
    'bool',
    'NotificationWrinkMax',
    ['Notification OFF', 'Notification ON'],
    'Create a notification when the maximum amount of wrinklers has appeared',
    true,
    () => {
      Config_CheckNotificationPermissions(
        Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.WrinklerMaxNotification,
      );
    },
  ),
  WrinklerMaxFlash: new SettingStandard(
    1,
    'bool',
    'NotificationWrinkMax',
    ['Flash OFF', 'Flash ON'],
    'Flash screen when the maximum amount of Wrinklers has appeared',
    true,
  ),
  ColourWrinklerMaxFlash: new SettingColours(
    '#ffffff',
    'colour',
    'NotificationWrinkMax',
    'The colour of the maximum wrinkler flash, standard colour is white',
  ),
  WrinklerMaxSound: new SettingStandard(
    1,
    'bool',
    'NotificationWrinkMax',
    ['Sound OFF', 'Sound ON'],
    'Play a sound when the maximum amount of wrinklers has appeared',
    true,
  ),
  WrinklerMaxVolume: new SettingVolume(100, 'vol', 'NotificationWrinkMax', [], 'Volume'),
  WrinklerMaxSoundURL: new SettingStandard(
    'https://freesound.org/data/previews/152/152743_15663-lq.mp3',
    'url',
    'NotificationWrinkMax',
    'Sound URL:',
    'URL of the sound to be played when the maximum amount of wrinklers has appeared',
  ),

  // Miscellaneous
  BulkBuyBlock: new SettingStandard(
    1,
    'bool',
    'Miscellaneous',
    ['Block bulk buying OFF', 'Block bulk buying ON'],
    "Block clicking bulk buying when you can't buy all. This prevents buying 7 of a building when you are in buy-10 or buy-100 mode.",
    true,
  ),
  FavouriteSettings: new SettingStandard(
    1,
    'bool',
    'Miscellaneous',
    [
      'Favourite settings section OFF',
      'Favourite settings section ON',
      'Favourite settings section ON (Locked)',
    ],
    "Show stars before each setting which allows selecting it for a 'favourites' section at the top of the Cookie Monster settings. Setting this to Locked removes the stars but shows the 'favourites' section",
    true,
    () => {
      Game.UpdateMenu();
    },
  ),
};

/* harmony default export */ const Data_settings = (settings_settings);

;// CONCATENATED MODULE: ./src/Config/ToggleSetting.js



/** Functions related to toggling or changing an individual setting */

/** Used to name certain DOM or outside facing elements and refer to them */
const ConfigPrefix = 'CMConfig';

/**
 * This function toggles options by incrementing them with 1 and handling changes
 * It is called by the onclick event of options of the "bool" type
 * @param 	{string}	config	The name of the option
 */
function ToggleConfig(config) {
  Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings[config] += 1;

  if (
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings[config] ===
    Data_settings[config].label.length
  ) {
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings[config] = 0;
    if (Data_settings[config].toggle) l(ConfigPrefix + config).className = 'option off';
  } else l(ConfigPrefix + config).className = 'option';

  if (typeof Data_settings[config].func !== 'undefined') {
    Data_settings[config].func();
  }

  saveFramework();
}

/**
 * This function sets the value of the specified volume-option and updates the display in the options menu
 * It is called by the oninput and onchange event of "vol" type options
 * @param 	{string}	config	The name of the option
 */
function ToggleConfigVolume(config) {
  if (l(`slider${config}`) !== null) {
    l(`slider${config}right`).innerHTML = `${l(`slider${config}`).value}%`;
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings[config] = Math.round(
      l(`slider${config}`).value,
    );
  }
  saveFramework();
}

/**
 * This function toggles header options by incrementing them with 1 and handling changes
 * It is called by the onclick event of the +/- next to headers
 * @param 	{string}	config	The name of the header
 */
function ToggleHeader(config) {
  Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.headers[config] += 1;
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.headers[config] > 1)
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.headers[config] = 0;
  saveFramework();
}

;// CONCATENATED MODULE: ./src/Disp/MenuSections/Statistics/CreateDOMElements.js
/** Section: Functions related to the creation of basic DOM elements page */





/**
 * This function creates a header-object for the stats page
 * It is called by CM.Disp.AddMenuStats()
 * @param 	{string}		config	The name of the Config-group
 * @param 	{string}		text	The to-be displayed name of the header
 * @returns	{object}		div		The header object
 */
function StatsHeader(text, config) {
  const div = document.createElement('div');
  div.className = 'title';
  div.style.padding = '0px 16px';
  div.style.opacity = '0.7';
  div.style.fontSize = '17px';
  div.style.fontFamily = '"Kavoon", Georgia, serif';
  div.appendChild(document.createTextNode(`${text} `));
  const span = document.createElement('span');
  span.style.cursor = 'pointer';
  span.style.display = 'inline-block';
  span.style.height = '14px';
  span.style.width = '14px';
  span.style.borderRadius = '7px';
  span.style.textAlign = 'center';
  span.style.backgroundColor = '#C0C0C0';
  span.style.color = 'black';
  span.style.fontSize = '13px';
  span.style.verticalAlign = 'middle';
  span.textContent = Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.headers[config]
    ? '-'
    : '+';
  span.onclick = function () {
    ToggleHeader(config);
    Game.UpdateMenu();
  };
  div.appendChild(span);
  return div;
}

/**
 * This function creates an stats-listing-object for the stats page
 * It is called by CM.Disp.AddMenuStats()
 * @param 	{string}		type		The type fo the listing
 * @param 	{string}		name		The name of the option
 * @param 	{object}		text		The text-object of the option
 * @param 	{string}		placeholder	The id of the to-be displayed tooltip if applicable
 * @returns	{object}		div			The option object
 */
function StatsListing(type, name, text, placeholder) {
  const div = document.createElement('div');
  div.className = 'listing';

  const listingName = document.createElement('b');
  listingName.textContent = name;
  div.appendChild(listingName);
  if (type === 'withTooltip') {
    div.className = 'listing';
    div.appendChild(document.createTextNode(' '));

    const tooltip = document.createElement('span');
    tooltip.onmouseout = function () {
      Game.tooltip.hide();
    };
    tooltip.onmouseover = function () {
      Game.tooltip.draw(this, escape(SimpleTooltipElements[placeholder].innerHTML));
    };
    tooltip.style.cursor = 'default';
    tooltip.style.display = 'inline-block';
    tooltip.style.height = '10px';
    tooltip.style.width = '10px';
    tooltip.style.borderRadius = '5px';
    tooltip.style.textAlign = 'center';
    tooltip.style.backgroundColor = '#C0C0C0';
    tooltip.style.color = 'black';
    tooltip.style.fontSize = '9px';
    tooltip.style.verticalAlign = 'bottom';
    tooltip.textContent = '?';
    div.appendChild(tooltip);
  }
  div.appendChild(document.createTextNode(': '));
  div.appendChild(text);
  return div;
}

/**
 * This function creates an stats-listing-object for the stats page for missing items displays
 * It is called by CM.Disp.AddMenuStats()
 * @param 	{string}		type		The type fo the listing
 * @param 	{string}		name		The name of the option
 * @param 	{object}		text		The text-object of the option
 * @param 	{bool}		  current Whether the season of the item is the current season
 * @returns	{object}		div			The option object
 */
function StatsMissDispListing(type, name, text, current) {
  const div = document.createElement('div');
  div.className = 'listing';

  const listingName = document.createElement('b');
  listingName.textContent = name;
  if (current === true)
    listingName.style.color =
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.ColourGreen;
  div.appendChild(listingName);
  div.appendChild(document.createTextNode(': '));
  div.appendChild(text);
  return div;
}

/**
 * This function creates a tooltip containing all missing holiday items contained in the list theMissDisp
 * @param 	{list}			theMissDisp		A list of the missing holiday items
 * @returns	{object}		frag			The tooltip object
 */
function StatsMissDisp(theMissDisp) {
  const frag = document.createDocumentFragment();
  frag.appendChild(document.createTextNode(`${theMissDisp.length} `));
  const span = document.createElement('span');
  span.onmouseout = function () {
    Game.tooltip.hide();
  };
  const placeholder = document.createElement('div');
  const missing = document.createElement('div');
  missing.style.minWidth = '140px';
  missing.style.marginBottom = '4px';
  const title = document.createElement('div');
  title.className = 'name';
  title.style.marginBottom = '4px';
  title.style.textAlign = 'center';
  title.textContent = 'Missing';
  missing.appendChild(title);
  Object.keys(theMissDisp).forEach((i) => {
    const div = document.createElement('div');
    div.style.textAlign = 'center';
    div.appendChild(document.createTextNode(theMissDisp[i]));
    missing.appendChild(div);
  });
  placeholder.appendChild(missing);
  span.onmouseover = function () {
    Game.tooltip.draw(this, escape(placeholder.innerHTML));
  };
  span.style.cursor = 'default';
  span.style.display = 'inline-block';
  span.style.height = '10px';
  span.style.width = '10px';
  span.style.borderRadius = '5px';
  span.style.textAlign = 'center';
  span.style.backgroundColor = '#C0C0C0';
  span.style.color = 'black';
  span.style.fontSize = '9px';
  span.style.verticalAlign = 'bottom';
  span.textContent = '?';
  frag.appendChild(span);
  return frag;
}

;// CONCATENATED MODULE: ./src/Disp/MenuSections/Statistics/CreateStatsSections.js
/** Functions to create the individual sections of the Statistics page */












/**
 * This function creates the "Lucky" section of the stats page
 * @returns	{object}	section		The object contating the Lucky section
 */
function LuckySection() {
  // This sets which tooltip to display for certain stats
  const goldCookTooltip = Game.auraMult("Dragon's Fortune")
    ? 'GoldCookDragonsFortuneTooltipPlaceholder'
    : 'GoldCookTooltipPlaceholder';

  const section = document.createElement('div');
  section.className = 'CMStatsLuckySection';

  const luckyColour = Game.cookies + GetWrinkConfigBank() < CacheLucky ? ColourRed : ColourGreen;
  const luckyTime =
    Game.cookies + GetWrinkConfigBank() < CacheLucky
      ? FormatTime((CacheLucky - (Game.cookies + GetWrinkConfigBank())) / GetCPS())
      : '';
  const luckyReqFrag = document.createDocumentFragment();
  const luckyReqSpan = document.createElement('span');
  luckyReqSpan.style.fontWeight = 'bold';
  luckyReqSpan.className = ColourTextPre + luckyColour;
  luckyReqSpan.textContent = Beautify_Beautify(CacheLucky);
  luckyReqFrag.appendChild(luckyReqSpan);
  if (luckyTime !== '') {
    const luckyReqSmall = document.createElement('small');
    luckyReqSmall.textContent = ` (${luckyTime})`;
    luckyReqFrag.appendChild(luckyReqSmall);
  }
  section.appendChild(
    StatsListing('withTooltip', '"Lucky!" cookies required', luckyReqFrag, goldCookTooltip),
  );

  const luckyColourFrenzy =
    Game.cookies + GetWrinkConfigBank() < CacheLuckyFrenzy ? ColourRed : ColourGreen;
  const luckyTimeFrenzy =
    Game.cookies + GetWrinkConfigBank() < CacheLuckyFrenzy
      ? FormatTime((CacheLuckyFrenzy - (Game.cookies + GetWrinkConfigBank())) / GetCPS())
      : '';
  const luckyReqFrenFrag = document.createDocumentFragment();
  const luckyReqFrenSpan = document.createElement('span');
  luckyReqFrenSpan.style.fontWeight = 'bold';
  luckyReqFrenSpan.className = ColourTextPre + luckyColourFrenzy;
  luckyReqFrenSpan.textContent = Beautify_Beautify(CacheLuckyFrenzy);
  luckyReqFrenFrag.appendChild(luckyReqFrenSpan);
  if (luckyTimeFrenzy !== '') {
    const luckyReqFrenSmall = document.createElement('small');
    luckyReqFrenSmall.textContent = ` (${luckyTimeFrenzy})`;
    luckyReqFrenFrag.appendChild(luckyReqFrenSmall);
  }
  section.appendChild(
    StatsListing(
      'withTooltip',
      '"Lucky!" cookies required (frenzy)',
      luckyReqFrenFrag,
      goldCookTooltip,
    ),
  );

  const luckySplit = CacheLuckyReward !== CacheLuckyWrathReward;

  const luckyRewardMaxSpan = document.createElement('span');
  luckyRewardMaxSpan.style.fontWeight = 'bold';
  luckyRewardMaxSpan.className = ColourTextPre + CacheLuckyReward;
  luckyRewardMaxSpan.textContent =
    Beautify_Beautify(CacheLuckyReward) + (luckySplit ? ` / ${Beautify_Beautify(CacheLuckyWrathReward)}` : '');
  section.appendChild(
    StatsListing(
      'withTooltip',
      `"Lucky!" reward (max)${luckySplit ? ' (golden / wrath)' : ''}`,
      luckyRewardMaxSpan,
      goldCookTooltip,
    ),
  );

  const luckyRewardFrenzyMaxSpan = document.createElement('span');
  luckyRewardFrenzyMaxSpan.style.fontWeight = 'bold';
  luckyRewardFrenzyMaxSpan.className = ColourTextPre + luckyRewardFrenzyMaxSpan;
  luckyRewardFrenzyMaxSpan.textContent =
    Beautify_Beautify(CacheLuckyRewardFrenzy) +
    (luckySplit ? ` / ${Beautify_Beautify(CacheLuckyWrathRewardFrenzy)}` : '');
  section.appendChild(
    StatsListing(
      'withTooltip',
      `"Lucky!" reward (max) (frenzy)${luckySplit ? ' (golden / wrath)' : ''}`,
      luckyRewardFrenzyMaxSpan,
      goldCookTooltip,
    ),
  );

  const luckyCurBase =
    Math.min(
      (Game.cookies + GetWrinkConfigBank()) * 0.15,
      CacheNoGoldSwitchCookiesPS * CacheDragonsFortuneMultAdjustment * 60 * 15,
    ) + 13;
  const luckyCurSpan = document.createElement('span');
  luckyCurSpan.style.fontWeight = 'bold';
  luckyCurSpan.className = ColourTextPre + luckyCurSpan;
  luckyCurSpan.textContent =
    Beautify_Beautify(CacheGoldenCookiesMult * luckyCurBase) +
    (luckySplit ? ` / ${Beautify_Beautify(CacheWrathCookiesMult * luckyCurBase)}` : '');
  section.appendChild(
    StatsListing(
      'withTooltip',
      `"Lucky!" reward (cur)${luckySplit ? ' (golden / wrath)' : ''}`,
      luckyCurSpan,
      goldCookTooltip,
    ),
  );
  return section;
}

/**
 * This function creates the "Chain" section of the stats page
 * @returns	{object}	section		The object contating the Chain section
 */
function ChainSection() {
  // This sets which tooltip to display for certain stats
  const goldCookTooltip = Game.auraMult("Dragon's Fortune")
    ? 'GoldCookDragonsFortuneTooltipPlaceholder'
    : 'GoldCookTooltipPlaceholder';

  const section = document.createElement('div');
  section.className = 'CMStatsChainSection';

  const chainColour =
    Game.cookies + GetWrinkConfigBank() < CacheChainRequired ? ColourRed : ColourGreen;
  const chainTime =
    Game.cookies + GetWrinkConfigBank() < CacheChainRequired
      ? FormatTime((CacheChainRequired - (Game.cookies + GetWrinkConfigBank())) / GetCPS())
      : '';
  const chainReqFrag = document.createDocumentFragment();
  const chainReqSpan = document.createElement('span');
  chainReqSpan.style.fontWeight = 'bold';
  chainReqSpan.className = ColourTextPre + chainColour;
  chainReqSpan.textContent = Beautify_Beautify(CacheChainRequired);
  chainReqFrag.appendChild(chainReqSpan);
  if (chainTime !== '') {
    const chainReqSmall = document.createElement('small');
    chainReqSmall.textContent = ` (${chainTime})`;
    chainReqFrag.appendChild(chainReqSmall);
  }
  section.appendChild(
    StatsListing('withTooltip', '"Chain" cookies required', chainReqFrag, goldCookTooltip),
  );

  const chainWrathColour =
    Game.cookies + GetWrinkConfigBank() < CacheChainWrathRequired ? ColourRed : ColourGreen;
  const chainWrathTime =
    Game.cookies + GetWrinkConfigBank() < CacheChainWrathRequired
      ? FormatTime((CacheChainWrathRequired - (Game.cookies + GetWrinkConfigBank())) / GetCPS())
      : '';
  const chainWrathReqFrag = document.createDocumentFragment();
  const chainWrathReqSpan = document.createElement('span');
  chainWrathReqSpan.style.fontWeight = 'bold';
  chainWrathReqSpan.className = ColourTextPre + chainWrathColour;
  chainWrathReqSpan.textContent = Beautify_Beautify(CacheChainWrathRequired);
  chainWrathReqFrag.appendChild(chainWrathReqSpan);
  if (chainWrathTime !== '') {
    const chainWrathReqSmall = document.createElement('small');
    chainWrathReqSmall.textContent = ` (${chainWrathTime})`;
    chainWrathReqFrag.appendChild(chainWrathReqSmall);
  }
  section.appendChild(
    StatsListing(
      'withTooltip',
      '"Chain" cookies required (Wrath)',
      chainWrathReqFrag,
      goldCookTooltip,
    ),
  );

  const chainColourFrenzy =
    Game.cookies + GetWrinkConfigBank() < CacheChainFrenzyRequired ? ColourRed : ColourGreen;
  const chainTimeFrenzy =
    Game.cookies + GetWrinkConfigBank() < CacheChainFrenzyRequired
      ? FormatTime((CacheChainFrenzyRequired - (Game.cookies + GetWrinkConfigBank())) / GetCPS())
      : '';
  const chainReqFrenFrag = document.createDocumentFragment();
  const chainReqFrenSpan = document.createElement('span');
  chainReqFrenSpan.style.fontWeight = 'bold';
  chainReqFrenSpan.className = ColourTextPre + chainColourFrenzy;
  chainReqFrenSpan.textContent = Beautify_Beautify(CacheChainFrenzyRequired);
  chainReqFrenFrag.appendChild(chainReqFrenSpan);
  if (chainTimeFrenzy !== '') {
    const chainReqFrenSmall = document.createElement('small');
    chainReqFrenSmall.textContent = ` (${chainTimeFrenzy})`;
    chainReqFrenFrag.appendChild(chainReqFrenSmall);
  }
  section.appendChild(
    StatsListing(
      'withTooltip',
      '"Chain" cookies required (Frenzy)',
      chainReqFrenFrag,
      goldCookTooltip,
    ),
  );

  const chainWrathColourFrenzy =
    Game.cookies + GetWrinkConfigBank() < CacheChainFrenzyWrathRequired ? ColourRed : ColourGreen;
  const chainWrathTimeFrenzy =
    Game.cookies + GetWrinkConfigBank() < CacheChainFrenzyWrathRequired
      ? FormatTime(
          (CacheChainFrenzyWrathRequired - (Game.cookies + GetWrinkConfigBank())) / GetCPS(),
        )
      : '';
  const chainWrathReqFrenFrag = document.createDocumentFragment();
  const chainWrathReqFrenSpan = document.createElement('span');
  chainWrathReqFrenSpan.style.fontWeight = 'bold';
  chainWrathReqFrenSpan.className = ColourTextPre + chainWrathColourFrenzy;
  chainWrathReqFrenSpan.textContent = Beautify_Beautify(CacheChainFrenzyWrathRequired);
  chainWrathReqFrenFrag.appendChild(chainWrathReqFrenSpan);
  if (chainWrathTimeFrenzy !== '') {
    const chainWrathReqFrenSmall = document.createElement('small');
    chainWrathReqFrenSmall.textContent = ` (${chainWrathTimeFrenzy})`;
    chainWrathReqFrenFrag.appendChild(chainWrathReqFrenSmall);
  }
  section.appendChild(
    StatsListing(
      'withTooltip',
      '"Chain" cookies required (frenzy) (Wrath)',
      chainWrathReqFrenFrag,
      goldCookTooltip,
    ),
  );

  section.appendChild(
    StatsListing(
      'withTooltip',
      '"Chain" reward (max) (golden / wrath)',
      document.createTextNode(
        `${Beautify_Beautify(CacheChainMaxReward[0])} / ${Beautify_Beautify(CacheChainWrathMaxReward[0])}`,
      ),
      goldCookTooltip,
    ),
  );

  section.appendChild(
    StatsListing(
      'withTooltip',
      '"Chain" reward (max) (frenzy) (golden / wrath)',
      document.createTextNode(
        `${Beautify_Beautify(CacheChainFrenzyMaxReward[0])} / ${Beautify_Beautify(CacheChainFrenzyMaxReward[0])}`,
      ),
      goldCookTooltip,
    ),
  );

  const chainCurMax = Math.min(
    Game.cookiesPs * 60 * 60 * 6 * CacheDragonsFortuneMultAdjustment,
    Game.cookies * 0.5,
  );
  const chainCur = MaxChainCookieReward(7, chainCurMax, CacheGoldenCookiesMult)[0];
  const chainCurWrath = MaxChainCookieReward(6, chainCurMax, CacheWrathCookiesMult)[0];
  section.appendChild(
    StatsListing(
      'withTooltip',
      '"Chain" reward (cur) (golden / wrath)',
      document.createTextNode(`${Beautify_Beautify(chainCur)} / ${Beautify_Beautify(chainCurWrath)}`),
      goldCookTooltip,
    ),
  );

  section.appendChild(
    StatsListing(
      'withTooltip',
      'CPS needed for next level (g / w)',
      document.createTextNode(
        `${Beautify_Beautify(CacheChainRequiredNext)} / ${Beautify_Beautify(CacheChainWrathRequiredNext)}`,
      ),
      'ChainNextLevelPlaceholder',
    ),
  );
  section.appendChild(
    StatsListing(
      'withTooltip',
      'CPS needed for next level (frenzy) (g / w)',
      document.createTextNode(
        `${Beautify_Beautify(CacheChainFrenzyRequiredNext)} / ${Beautify_Beautify(
          CacheChainFrenzyWrathRequiredNext,
        )}`,
      ),
      'ChainNextLevelPlaceholder',
    ),
  );
  return section;
}

/**
 * This function creates the "Spells" section of the stats page
 * @returns	{object}	section		The object contating the Spells section
 */
function SpellsSection() {
  const section = document.createElement('div');
  section.className = 'CMStatsSpellsSection';

  const conjureColour =
    Game.cookies + GetWrinkConfigBank() < CacheConjure ? ColourRed : ColourGreen;
  const conjureTime =
    Game.cookies + GetWrinkConfigBank() < CacheConjure
      ? FormatTime((CacheConjure - (Game.cookies + GetWrinkConfigBank())) / GetCPS())
      : '';

  const conjureReqFrag = document.createDocumentFragment();
  const conjureReqSpan = document.createElement('span');
  conjureReqSpan.style.fontWeight = 'bold';
  conjureReqSpan.className = ColourTextPre + conjureColour;
  conjureReqSpan.textContent = Beautify_Beautify(CacheConjure);
  conjureReqFrag.appendChild(conjureReqSpan);
  if (conjureTime !== '') {
    const conjureReqSmall = document.createElement('small');
    conjureReqSmall.textContent = ` (${conjureTime})`;
    conjureReqFrag.appendChild(conjureReqSmall);
  }
  section.appendChild(
    StatsListing(
      'withTooltip',
      '"Conjure Baked Goods" cookies required',
      conjureReqFrag,
      'GoldCookTooltipPlaceholder',
    ),
  );
  section.appendChild(
    StatsListing(
      'withTooltip',
      '"Conjure Baked Goods" reward (max)',
      document.createTextNode(Beautify_Beautify(CacheConjureReward)),
      'GoldCookTooltipPlaceholder',
    ),
  );

  const conjureFrenzyColour =
    Game.cookies + GetWrinkConfigBank() < CacheConjure * 7 ? ColourRed : ColourGreen;
  const conjureFrenzyCur = Math.min(
    (Game.cookies + GetWrinkConfigBank()) * 0.15,
    CacheNoGoldSwitchCookiesPS * 60 * 30,
  );
  const conjureFrenzyTime =
    Game.cookies + GetWrinkConfigBank() < CacheConjure * 7
      ? FormatTime((CacheConjure * 7 - (Game.cookies + GetWrinkConfigBank())) / GetCPS())
      : '';

  const conjureFrenzyReqFrag = document.createDocumentFragment();
  const conjureFrenzyReqSpan = document.createElement('span');
  conjureFrenzyReqSpan.style.fontWeight = 'bold';
  conjureFrenzyReqSpan.className = ColourTextPre + conjureFrenzyColour;
  conjureFrenzyReqSpan.textContent = Beautify_Beautify(CacheConjure * 7);
  conjureFrenzyReqFrag.appendChild(conjureFrenzyReqSpan);
  if (conjureFrenzyTime !== '') {
    const conjureFrenzyReqSmall = document.createElement('small');
    conjureFrenzyReqSmall.textContent = ` (${conjureFrenzyTime})`;
    conjureFrenzyReqFrag.appendChild(conjureFrenzyReqSmall);
  }
  section.appendChild(
    StatsListing(
      'withTooltip',
      '"Conjure Baked Goods" cookies required (frenzy)',
      conjureFrenzyReqFrag,
      'GoldCookTooltipPlaceholder',
    ),
  );
  section.appendChild(
    StatsListing(
      'withTooltip',
      '"Conjure Baked Goods" reward (max) (frenzy)',
      document.createTextNode(Beautify_Beautify(CacheConjureReward * 7)),
      'GoldCookTooltipPlaceholder',
    ),
  );
  section.appendChild(
    StatsListing(
      'withTooltip',
      '"Conjure Baked Goods" reward (cur)',
      document.createTextNode(Beautify_Beautify(conjureFrenzyCur)),
      'GoldCookTooltipPlaceholder',
    ),
  );
  if (CacheEdifice) {
    section.appendChild(
      StatsListing(
        'withTooltip',
        '"Spontaneous Edifice" cookies required (most expensive building)',
        document.createTextNode(`${Beautify_Beautify(CacheEdifice)} (${CacheEdificeBuilding})`),
        'GoldCookTooltipPlaceholder',
      ),
    );
  }
  return section;
}

/**
 * This function creates the "Garden" section of the stats page
 * @returns	{object}	section		The object contating the Spells section
 */
function GardenSection() {
  const section = document.createElement('div');
  section.className = 'CMStatsGardenSection';

  const bakeberryColour = Game.cookies < Game.cookiesPs * 60 * 10 * 100 ? ColourRed : ColourGreen;
  const bakeberryFrag = document.createElement('span');
  bakeberryFrag.style.fontWeight = 'bold';
  bakeberryFrag.className = ColourTextPre + bakeberryColour;
  bakeberryFrag.textContent = Beautify_Beautify(Game.cookiesPs * 60 * 10 * 100);
  section.appendChild(
    StatsListing('basic', 'Cookies required for max reward of Bakeberry: ', bakeberryFrag),
  );

  const chocorootColour = Game.cookies < Game.cookiesPs * 60 * 100 ? ColourRed : ColourGreen;
  const chocorootFrag = document.createElement('span');
  chocorootFrag.style.fontWeight = 'bold';
  chocorootFrag.className = ColourTextPre + chocorootColour;
  chocorootFrag.textContent = Beautify_Beautify(Game.cookiesPs * 60 * 100);
  section.appendChild(
    StatsListing('basic', 'Cookies required for max reward of Chocoroot: ', chocorootFrag),
  );

  const queenbeetColour = Game.cookies < Game.cookiesPs * 60 * 60 * 25 ? ColourRed : ColourGreen;
  const queenbeetFrag = document.createElement('span');
  queenbeetFrag.style.fontWeight = 'bold';
  queenbeetFrag.className = ColourTextPre + queenbeetColour;
  queenbeetFrag.textContent = Beautify_Beautify(Game.cookiesPs * 60 * 60 * 25);
  section.appendChild(
    StatsListing('basic', 'Cookies required for max reward of Queenbeet: ', queenbeetFrag),
  );

  const duketaterColour = Game.cookies < Game.cookiesPs * 60 * 15 * 100 ? ColourRed : ColourGreen;
  const duketaterFrag = document.createElement('span');
  duketaterFrag.style.fontWeight = 'bold';
  duketaterFrag.className = ColourTextPre + duketaterColour;
  duketaterFrag.textContent = Beautify_Beautify(Game.cookiesPs * 60 * 15 * 100);
  section.appendChild(
    StatsListing('basic', 'Cookies required for max reward of Duketater: ', duketaterFrag),
  );
  const missingPlantDrops = [];
  Object.keys(PlantDrops).forEach((i) => {
    if (!Game.HasUnlocked(PlantDrops[i])) {
      missingPlantDrops.push(PlantDrops[i]);
    }
  });
  if (missingPlantDrops.length !== 0) {
    section.appendChild(
      StatsListing('basic', 'Rare plant drops left to unlock', StatsMissDisp(missingPlantDrops)),
    );
  }
  return section;
}

/**
 * This function creates the "Prestige" section of the stats page
 * @returns	{object}	section		The object contating the Prestige section
 */
function PrestigeSection() {
  const section = document.createElement('div');
  section.className = 'CMStatsPrestigeSection';

  const possiblePresMax = Math.floor(
    Game.HowMuchPrestige(
      CacheRealCookiesEarned +
        Game.cookiesReset +
        CacheWrinklersTotal +
        (Game.HasUnlocked('Chocolate egg') && !Game.Has('Chocolate egg') ? CacheLastChoEgg : 0),
    ),
  );
  section.appendChild(
    StatsListing(
      'withTooltip',
      'Prestige level (cur / max)',
      document.createTextNode(`${Beautify_Beautify(Game.prestige)} / ${Beautify_Beautify(possiblePresMax)}`),
      'PrestMaxTooltipPlaceholder',
    ),
  );

  const neededCook = Math.max(
    0,
    Game.HowManyCookiesReset(possiblePresMax + 1) -
      (CacheRealCookiesEarned +
        Game.cookiesReset +
        CacheWrinklersTotal +
        ((Game.HasUnlocked('Chocolate egg') && !Game.Has('Chocolate egg') ? CacheLastChoEgg : 0)
          ? CacheLastChoEgg
          : 0)),
  );
  const cookiesNextFrag = document.createDocumentFragment();
  cookiesNextFrag.appendChild(document.createTextNode(Beautify_Beautify(neededCook)));
  const cookiesNextSmall = document.createElement('small');
  cookiesNextSmall.textContent = ` (${FormatTime(neededCook / CacheAvgCPSWithChoEgg, 1)})`;
  cookiesNextFrag.appendChild(cookiesNextSmall);
  section.appendChild(
    StatsListing(
      'withTooltip',
      'Cookies to next level',
      cookiesNextFrag,
      'NextPrestTooltipPlaceholder',
    ),
  );

  section.appendChild(
    StatsListing(
      'withTooltip',
      'Heavenly chips (cur / max)',
      document.createTextNode(
        `${Beautify_Beautify(Game.heavenlyChips)} / ${Beautify_Beautify(
          possiblePresMax - Game.prestige + Game.heavenlyChips,
        )}`,
      ),
      'HeavenChipMaxTooltipPlaceholder',
    ),
  );

  section.appendChild(
    StatsListing(
      'basic',
      'Heavenly chips per second (last 5 seconds)',
      document.createTextNode(Beautify_Beautify(CacheHCPerSecond, 2)),
    ),
  );

  const HCTarget = Number(
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.HeavenlyChipsTarget,
  );
  if (!Number.isNaN(HCTarget)) {
    const CookiesTillTarget =
      HCTarget - Math.floor(Game.HowMuchPrestige(Game.cookiesReset + Game.cookiesEarned));
    if (CookiesTillTarget > 0) {
      section.appendChild(
        StatsListing(
          'basic',
          'Heavenly chips to target set in settings (cur)',
          document.createTextNode(Beautify_Beautify(CookiesTillTarget)),
        ),
      );
      section.appendChild(
        StatsListing(
          'basic',
          'Time till target (cur, current 5 second average)',
          document.createTextNode(FormatTime(CookiesTillTarget / CacheHCPerSecond)),
        ),
      );
    }
  }

  const resetBonus = ResetBonus(possiblePresMax);
  const resetFrag = document.createDocumentFragment();
  resetFrag.appendChild(document.createTextNode(Beautify_Beautify(resetBonus)));
  const increase = Math.round((resetBonus / Game.cookiesPs) * 10000);
  if (Number.isFinite(increase) && increase !== 0) {
    const resetSmall = document.createElement('small');
    resetSmall.textContent = ` (${increase / 100}% of income)`;
    resetFrag.appendChild(resetSmall);
  }
  section.appendChild(
    StatsListing('withTooltip', 'Reset bonus income', resetFrag, 'ResetTooltipPlaceholder'),
  );

  const currentPrestige = Math.floor(Game.HowMuchPrestige(Game.cookiesReset));
  const willHave = Math.floor(Game.HowMuchPrestige(Game.cookiesReset + Game.cookiesEarned));
  const willGet = willHave - currentPrestige;
  if (!Game.Has('Lucky digit')) {
    let delta7 = 7 - (willHave % 10);
    if (delta7 < 0) delta7 += 10;
    const next7Reset = willGet + delta7;
    const next7Total = willHave + delta7;
    const frag7 = document.createDocumentFragment();
    frag7.appendChild(
      document.createTextNode(
        `${next7Total.toLocaleString()} / ${next7Reset.toLocaleString()} (+${delta7})`,
      ),
    );
    section.appendChild(StatsListing('basic', 'Next "Lucky Digit" (total / reset)', frag7));
  }

  if (!Game.Has('Lucky number')) {
    let delta777 = 777 - (willHave % 1000);
    if (delta777 < 0) delta777 += 1000;
    const next777Reset = willGet + delta777;
    const next777Total = willHave + delta777;
    const frag777 = document.createDocumentFragment();
    frag777.appendChild(
      document.createTextNode(
        `${next777Total.toLocaleString()} / ${next777Reset.toLocaleString()} (+${delta777})`,
      ),
    );
    section.appendChild(StatsListing('basic', 'Next "Lucky Number" (total / reset)', frag777));
  }

  if (!Game.Has('Lucky payout')) {
    let delta777777 = 777777 - (willHave % 1000000);
    if (delta777777 < 0) delta777777 += 1000000;
    const next777777Reset = willGet + delta777777;
    const next777777Total = willHave + delta777777;
    const frag777777 = document.createDocumentFragment();
    frag777777.appendChild(
      document.createTextNode(
        `${next777777Total.toLocaleString()} / ${next777777Reset.toLocaleString()} (+${delta777777})`,
      ),
    );
    section.appendChild(StatsListing('basic', 'Next "Lucky Payout" (total / reset)', frag777777));
  }

  return section;
}

/**
 * This function creates the "Season Specials" section of the stats page
 * @returns	{object}	section		The object contating the Season Specials section
 */
function SeasonSection() {
  const section = document.createElement('div');
  section.className = 'CMStatsSeasonSection';

  let specDisp = false;
  const missingHalloweenCookies = [];
  Object.keys(HalloCookies).forEach((i) => {
    if (!Game.Has(HalloCookies[i])) {
      missingHalloweenCookies.push(HalloCookies[i]);
      specDisp = true;
    }
  });
  const missingChristmasCookies = [];
  Object.keys(ChristCookies).forEach((i) => {
    if (!Game.Has(ChristCookies[i])) {
      missingChristmasCookies.push(ChristCookies[i]);
      specDisp = true;
    }
  });
  const missingValentineCookies = [];
  Object.keys(ValCookies).forEach((i) => {
    if (!Game.Has(ValCookies[i])) {
      missingValentineCookies.push(ValCookies[i]);
      specDisp = true;
    }
  });
  const missingNormalEggs = [];
  Object.keys(Game.eggDrops).forEach((i) => {
    if (!Game.HasUnlocked(Game.eggDrops[i])) {
      missingNormalEggs.push(Game.eggDrops[i]);
      specDisp = true;
    }
  });
  const missingRareEggs = [];
  Object.keys(Game.rareEggDrops).forEach((i) => {
    if (!Game.HasUnlocked(Game.rareEggDrops[i])) {
      missingRareEggs.push(Game.rareEggDrops[i]);
      specDisp = true;
    }
  });
  const choEgg = Game.HasUnlocked('Chocolate egg') && !Game.Has('Chocolate egg');
  const centEgg = Game.Has('Century egg');

  if (Game.season === 'christmas' || specDisp || choEgg || centEgg) {
    section.appendChild(StatsHeader('Season Specials', 'Sea'));
    if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.headers.Sea) {
      if (missingHalloweenCookies.length !== 0) {
        section.appendChild(
          StatsMissDispListing(
            'basic',
            'Halloween cookies left to buy',
            StatsMissDisp(missingHalloweenCookies),
            Game.season === 'halloween',
          ),
        );
        let failRateHalloween = 0.95;
        if (Game.HasAchiev('Spooky cookies')) failRateHalloween = 0.8;
        if (Game.Has('Starterror')) failRateHalloween *= 0.9;
        failRateHalloween *= 1 / Game.dropRateMult();
        if (Game.hasGod) {
          const godLvl = Game.hasGod('seasons');
          if (godLvl === 1) failRateHalloween *= 0.9;
          else if (godLvl === 2) failRateHalloween *= 0.95;
          else if (godLvl === 3) failRateHalloween *= 0.97;
        }
        const obtainedCookiesChance = missingHalloweenCookies.length / 7;
        section.appendChild(
          StatsMissDispListing(
            'basic',
            'Chance of receiving a cookie from wrinkler/shiny wrinkler',
            document.createTextNode(
              `${Beautify_Beautify((1 - failRateHalloween) * obtainedCookiesChance * 100)}% / ${Beautify_Beautify(
                (1 - failRateHalloween * 0.9) * obtainedCookiesChance * 100,
              )}%`,
            ),
            Game.season === 'halloween',
          ),
        );
      }
      if (missingChristmasCookies.length !== 0) {
        section.appendChild(
          StatsMissDispListing(
            'basic',
            'Christmas cookies left to buy',
            StatsMissDisp(missingChristmasCookies),
            Game.season === 'christmas',
          ),
        );
        let failRateChristmas = 0.8;
        if (Game.HasAchiev('Let it snow')) failRateChristmas = 0.6;
        failRateChristmas *= 1 / Game.dropRateMult();
        if (Game.Has('Starsnow')) failRateChristmas *= 0.95;
        if (Game.hasGod) {
          const godLvl = Game.hasGod('seasons');
          if (godLvl === 1) failRateChristmas *= 0.9;
          else if (godLvl === 2) failRateChristmas *= 0.95;
          else if (godLvl === 3) failRateChristmas *= 0.97;
        }
        const obtainedCookiesChance = missingChristmasCookies.length / 7;
        section.appendChild(
          StatsMissDispListing(
            'basic',
            'Chance of receiving a cookie from reindeer',
            document.createTextNode(
              `${Beautify_Beautify((1 - failRateChristmas) * obtainedCookiesChance * 100)}%`,
            ),
            Game.season === 'christmas',
          ),
        );
      }
      if (missingValentineCookies.length !== 0) {
        section.appendChild(
          StatsMissDispListing(
            'basic',
            'Valentine cookies left to buy',
            StatsMissDisp(missingValentineCookies),
            Game.season === 'valentines',
          ),
        );
      }
      const dropRateEgg = function (StartingFailRate) {
        let failRateEgg = StartingFailRate * (1 / Game.dropRateMult());
        if (Game.HasAchiev('Hide & seek champion')) failRateEgg *= 0.7;
        if (Game.Has('Omelette')) failRateEgg *= 0.9;
        if (Game.Has('Starspawn')) failRateEgg *= 0.9;
        if (Game.hasGod) {
          const godLvl = Game.hasGod('seasons');
          if (godLvl === 1) failRateEgg *= 0.9;
          else if (godLvl === 2) failRateEgg *= 0.95;
          else if (godLvl === 3) failRateEgg *= 0.97;
        }
        // Calculations courtesy of @svschouw, at https://github.com/Aktanusa/CookieMonster/issues/25
        const succesRateEgg = 1 - failRateEgg;
        const obtainedEggs = Game.eggDrops.length - missingNormalEggs.length;
        const obtainedRareEggs = Game.rareEggDrops.length - missingRareEggs.length;
        const pNormal1 = succesRateEgg * 0.9 * (1 - obtainedEggs / Game.eggDrops.length);
        const pRare1 = succesRateEgg * 0.1 * (1 - obtainedRareEggs / Game.rareEggDrops.length);
        const pRedropNormal = succesRateEgg * 0.9 * (obtainedEggs / Game.eggDrops.length);
        const pRedropRare = succesRateEgg * 0.1 * (obtainedRareEggs / Game.rareEggDrops.length);
        const pRedrop = pRedropNormal + pRedropRare;
        const pNormal2 = pRedrop * 0.9 * (1 - obtainedEggs / Game.eggDrops.length);
        const pRare2 = pRedrop * 0.1 * (1 - obtainedRareEggs / Game.rareEggDrops.length);
        return [pNormal1 + pNormal2, pRare1 + pRare2];
      };
      if (missingNormalEggs.length !== 0) {
        section.appendChild(
          StatsMissDispListing(
            'basic',
            'Normal easter eggs left to unlock',
            StatsMissDisp(missingNormalEggs),
            Game.season === 'easter',
          ),
        );
        section.appendChild(
          StatsMissDispListing(
            'basic',
            'Chance of receiving an egg from wrinkler/golden cookie',
            document.createTextNode(
              `${Beautify_Beautify(dropRateEgg(0.98)[0] * 100)}% / ${Beautify_Beautify(dropRateEgg(0.9)[0] * 100)}%`,
            ),
            Game.season === 'easter',
          ),
        );
      }
      if (missingRareEggs.length !== 0) {
        section.appendChild(
          StatsMissDispListing(
            'basic',
            'Rare easter eggs left to unlock',
            StatsMissDisp(missingRareEggs),
            Game.season === 'easter',
          ),
        );
        section.appendChild(
          StatsMissDispListing(
            'basic',
            'Chance of receiving a rare egg from wrinkler/golden cookie',
            document.createTextNode(
              `${Beautify_Beautify(dropRateEgg(0.98)[1] * 100)}% / ${Beautify_Beautify(dropRateEgg(0.9)[1] * 100)}%`,
            ),
            Game.season === 'easter',
          ),
        );
      }

      if (Game.season === 'christmas')
        section.appendChild(
          StatsMissDispListing(
            'basic',
            'Reindeer reward',
            document.createTextNode(Beautify_Beautify(CacheSeaSpec)),
            true,
          ),
        );
      if (choEgg) {
        section.appendChild(
          StatsListing(
            'withTooltip',
            'Chocolate egg cookies',
            document.createTextNode(Beautify_Beautify(CacheLastChoEgg)),
            'ChoEggTooltipPlaceholder',
          ),
        );
      }
      if (centEgg) {
        section.appendChild(
          StatsListing(
            'basic',
            'Century egg multiplier',
            document.createTextNode(`${Math.round((CacheCentEgg - 1) * 10000) / 100}%`),
          ),
        );
      }
    }
  }
  return section;
}

;// CONCATENATED MODULE: ./src/Disp/MenuSections/Statistics/CreateMissingAchievements.js
function CrateTooltipLockedAchievements(me) {
  const tags = [];
  if (me.pool === 'shadow') tags.push('Shadow Achievement', '#9700cf');
  else tags.push('Achievement', 0);
  tags.push('Locked', 0);

  let neuromancy = 0;
  if (Game.Has('Neuromancy') || (Game.sesame && me.pool === 'debug')) neuromancy = 1;
  if (neuromancy && me.won === 0) tags.push('Click to win!', '#00c462');
  else if (neuromancy && me.won > 0) tags.push('Click to lose!', '#00c462');

  let { icon } = me;
  if (me.iconFunction) icon = me.iconFunction();

  let { desc } = me;
  if (me.descFunc) desc = me.descFunc('stats');

  let tagsStr = '';
  for (let i = 0; i < tags.length; i += 2) {
    if (i % 2 === 0)
      tagsStr += ` <div class="tag" style="color:${tags[i + 1] === 0 ? '#fff' : tags[i + 1]};">[${
        tags[i]
      }]</div>`;
  }
  tagsStr = tagsStr.substring(1);

  return `<div style="padding:8px 4px;min-width:350px;opacity:0.5">
  <div class="icon" style="float:left;margin-left:-8px;margin-top:-8px;background-position:${
    -icon[0] * 48
  }px ${-icon[1] * 48}px;"></div>
  <div class="name">${me.name}</div>
  ${tagsStr}<div class="line"></div><div class="description">${desc}</div></div>
  ${
    Game.sesame
      ? `<div style="font-size:9px;">Id : ${me.id} | Order : ${Math.floor(me.order)}${
          me.tier ? ` | Tier : ${me.tier}` : ''
        }</div>`
      : ''
  }`;
}

/**
 * This function overwrites the crates of missing achievements
 */
function AddMissingAchievements() {
  let achievs;
  Object.values(document.querySelectorAll('div.title')).forEach((i) => {
    if (i.textContent.includes('Achievements')) {
      achievs = i.parentElement.querySelectorAll('div.listing.crateBox')[0];
    }
  });
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.MissingAchievements) {
    Object.values(achievs.children).forEach((achievsCrate) => {
      if (!achievsCrate.className.includes('enabled')) {
        const id = achievsCrate.onclick.toString().split(/\[(.*)\]/gi)[1];
        const { icon } = Game.AchievementsById[id];
        // eslint-disable-next-line no-param-reassign
        achievsCrate.style.backgroundPosition = `${-icon[0] * 48}px ${-icon[1] * 48}px`;
        // eslint-disable-next-line no-param-reassign
        achievsCrate.onmouseover = function () {
          if (!Game.mouseDown) {
            Game.setOnCrate(this);
            Game.tooltip.dynamic = 1;
            Game.tooltip.draw(
              this,
              () =>
                (function () {
                  return CrateTooltipLockedAchievements(Game.AchievementsById[id]);
                })(),
              'top',
            );
            Game.tooltip.wobble();
          }
        };
      }
    });
  }
}

;// CONCATENATED MODULE: ./src/Disp/MenuSections/Statistics/AddStatsPage.js
/** Main function to create the sections of Cookie Monster on the Statistics page */













/**
 * This function adds stats created by CookieMonster to the stats page
 * It is called by CM.Disp.AddMenu
 * @param {object} title	On object that includes the title of the menu
 */
function AddMenuStats(title) {
  const stats = document.createElement('div');
  stats.className = 'subsection';
  stats.appendChild(title);

  stats.appendChild(StatsHeader('Lucky Cookies', 'Lucky'));
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.headers.Lucky) {
    stats.appendChild(LuckySection());
  }

  stats.appendChild(StatsHeader('Chain Cookies', 'Chain'));
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.headers.Chain) {
    stats.appendChild(ChainSection());
  }

  if (Game.Objects['Wizard tower'].minigameLoaded) {
    stats.appendChild(StatsHeader('Spells', 'Spells'));
    if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.headers.Spells) {
      stats.appendChild(SpellsSection());
    }
  }

  if (Game.Objects.Farm.minigameLoaded) {
    stats.appendChild(StatsHeader('Garden', 'Garden'));
    if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.headers.Garden) {
      stats.appendChild(GardenSection());
    }
  }

  stats.appendChild(StatsHeader('Prestige', 'Prestige'));
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.headers.Prestige) {
    stats.appendChild(PrestigeSection());
  }

  if (Game.cpsSucked > 0) {
    stats.appendChild(StatsHeader('Wrinklers', 'Wrink'));
    if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.headers.Wrink) {
      const popAllFrag = document.createDocumentFragment();
      popAllFrag.appendChild(
        document.createTextNode(
          `${Beautify_Beautify(CacheWrinklersTotal)} / ${Beautify_Beautify(CacheWrinklersNormal)} `,
        ),
      );
      const popAllA = document.createElement('a');
      popAllA.textContent = 'Pop All Normal';
      popAllA.className = 'option';
      popAllA.onclick = function () {
        PopAllNormalWrinklers();
      };
      popAllFrag.appendChild(popAllA);
      stats.appendChild(
        StatsListing('basic', 'Rewards of Popping (All/Normal)', popAllFrag),
      );
      const popFattestFrag = document.createDocumentFragment();
      popFattestFrag.appendChild(document.createTextNode(`${Beautify_Beautify(CacheWrinklersFattest[0])} `));
      const popFattestA = document.createElement('a');
      popFattestA.textContent = 'Pop Single Fattest';
      popFattestA.className = 'option';
      popFattestA.onclick = function () {
        if (CacheWrinklersFattest[1] !== null) Game.wrinklers[CacheWrinklersFattest[1]].hp = 0;
      };
      popFattestFrag.appendChild(popFattestA);
      stats.appendChild(
        StatsListing(
          'basic',
          `Rewards of Popping Single Fattest Non-Shiny Wrinkler (id: ${
            CacheWrinklersFattest[1] !== null ? CacheWrinklersFattest[1] : 'None'
          })`,
          popFattestFrag,
        ),
      );
    }
  }

  stats.appendChild(SeasonSection());

  stats.appendChild(StatsHeader('Achievements', 'Achievs'));
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.headers.Achievs) {
    Object.keys(Game.Objects).forEach((i) => {
      const ObjectsTillNext = CacheObjectsNextAchievement[i];
      stats.appendChild(
        StatsListing(
          'basic',
          i,
          ObjectsTillNext.AmountNeeded < 101
            ? document.createTextNode(
                `Next achievement in ${ObjectsTillNext.AmountNeeded}, price: ${Beautify_Beautify(
                  ObjectsTillNext.price,
                )}`,
              )
            : document.createTextNode('No new achievement for next 100 buildings'),
        ),
      );
    });
  }

  stats.appendChild(StatsHeader('Miscellaneous', 'Misc'));
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.headers.Misc) {
    stats.appendChild(
      StatsListing(
        'basic',
        `Average cookies per second (past ${
          CookieTimes[
            Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.AvgCPSHist
          ] < 60
            ? `${
                CookieTimes[
                  Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.AvgCPSHist
                ]
              } seconds`
            : CookieTimes[
                Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.AvgCPSHist
              ] /
                60 +
              (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.AvgCPSHist === 3
                ? ' minute'
                : ' minutes')
        })`,
        document.createTextNode(Beautify_Beautify(GetCPS(), 3)),
      ),
    );
    stats.appendChild(
      StatsListing(
        'basic',
        `Average cookie clicks per second (past ${
          ClickTimes[
            Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.AvgClicksHist
          ]
        }${
          Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.AvgClicksHist === 0
            ? ' second'
            : ' seconds'
        })`,
        document.createTextNode(Beautify_Beautify(CacheAverageClicks, 1)),
      ),
    );
    stats.appendChild(
      StatsListing(
        'basic',
        `Cookies from clicking (past ${
          ClickTimes[
            Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.AvgClicksHist
          ]
        }${
          Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.AvgClicksHist === 0
            ? ' second'
            : ' seconds'
        })`,
        document.createTextNode(
          Beautify_Beautify(
            CacheAverageCookiesFromClicks.calcSum(
              CacheAverageClicks *
                ClickTimes[
                  Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.AvgClicksHist
                ],
            ),
          ),
        ),
      ),
    );
    if (Game.Has('Fortune cookies')) {
      const fortunes = [];
      Object.keys(Fortunes).forEach((i) => {
        if (!Game.Has(Fortunes[i])) {
          fortunes.push(Fortunes[i]);
        }
      });
      if (fortunes.length !== 0)
        stats.appendChild(
          StatsListing(
            'basic',
            'Fortune Upgrades Left to Buy',
            StatsMissDisp(fortunes),
          ),
        );
    }
    if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.ShowMissedGC) {
      stats.appendChild(
        StatsListing(
          'basic',
          'Missed golden cookies',
          document.createTextNode(Beautify_Beautify(Game.missedGoldenClicks)),
        ),
      );
    }
    if (Game.prefs.autosave) {
      const timer = document.createElement('span');
      timer.id = 'CMStatsAutosaveTimer';
      timer.innerText = Game.sayTime(
        Game.fps * 60 - (Game.OnAscend ? 0 : Game.T % (Game.fps * 60)),
        4,
      );
      stats.appendChild(StatsListing('basic', 'Time till autosave', timer));
    }
  }

  l('menu').insertBefore(stats, l('menu').childNodes[2]);

  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.MissingUpgrades) {
    AddMissingUpgrades();
  }
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.MissingAchievements) {
    AddMissingAchievements();
  }
}

;// CONCATENATED MODULE: ./src/Data/Sectionheaders.ts
/** Data related to the display titles of certain sections in menu screens */
/** Display titles of the headers of the Cookie Monster settings section */
const ConfigGroups = {
    Favourite: 'Favourite Settings',
    Calculation: 'Calculation',
    Notation: 'Notation',
    Colours: 'Colours and colour coding',
    BarsDisplay: 'Infobars and visual settings',
    Tooltip: 'Tooltips',
    Statistics: 'Statistics',
    Notification: 'Notifications',
    Miscellaneous: 'Miscellaneous',
};
/** Display titles of the headers of the notification section of the Cookie Monster settings */
const ConfigGroupsNotification = {
    NotificationGeneral: 'General Notifications',
    NotificationGC: 'Golden Cookie',
    NotificationFC: 'Fortune Cookie',
    NotificationSea: 'Season Special',
    NotificationGard: 'Garden Tick',
    NotificationMagi: 'Full Magic Bar',
    NotificationWrink: 'Wrinkler',
    NotificationWrinkMax: 'Maximum Wrinklers',
};

;// CONCATENATED MODULE: ./src/Disp/MenuSections/Settings/CreateHeader.js


/**
 * This function creates a header-object for the options page
 * @param 	{string}		config	The name of the Config-group
 * @param 	{string}		text	The to-be displayed name of the header
 * @returns	{object}		div		The header object
 */
function CreatePrefHeader(config, text) {
  const div = document.createElement('div');
  div.className = 'title';

  div.style.opacity = '0.7';
  div.style.fontSize = '17px';
  div.appendChild(document.createTextNode(`${text} `));
  const span = document.createElement('span'); // Creates the +/- button
  span.style.cursor = 'pointer';
  span.style.display = 'inline-block';
  span.style.height = '14px';
  span.style.width = '14px';
  span.style.borderRadius = '7px';
  span.style.textAlign = 'center';
  span.style.backgroundColor = '#C0C0C0';
  span.style.color = 'black';
  span.style.fontSize = '13px';
  span.style.verticalAlign = 'middle';
  span.textContent = Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.headers[config]
    ? '-'
    : '+';
  span.onclick = function () {
    ToggleHeader(config);
    Game.UpdateMenu();
  };
  div.appendChild(span);
  return div;
}

;// CONCATENATED MODULE: ./src/Config/Toggles/ToggleFavourites.js


/**
 * This function toggles whether a setting is part of the favourites section in setting or not
 * @param {string} config	The name of the toggleable config option
 */
function ToggleFavouriteSetting(config) {
  if (FavouriteSettings.includes(config))
    FavouriteSettings = FavouriteSettings.filter((ele) => ele !== config);
  else FavouriteSettings.push(config);
}

;// CONCATENATED MODULE: ./src/Disp/HelperFunctions/UpdateColours.js



/**
 * This function changes/refreshes colours if the user has set new standard colours
 * The function is therefore called by a change in CM.Options.Colours
 */
function UpdateColours() {
  let str = '';
  for (let i = 0; i < ColoursOrdering.length; i++) {
    str += `.${ColourTextPre}${ColoursOrdering[i]} { color: ${
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings[
        `Colour${ColoursOrdering[i]}`
      ]
    }; }\n`;
  }
  for (let i = 0; i < ColoursOrdering.length; i++) {
    str += `.${ColourBackPre}${ColoursOrdering[i]} { background-color: ${
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings[
        `Colour${ColoursOrdering[i]}`
      ]
    }; }\n`;
  }
  for (let i = 0; i < ColoursOrdering.length; i++) {
    str += `.${ColourBorderPre}${ColoursOrdering[i]} { border: 1px solid ${
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings[
        `Colour${ColoursOrdering[i]}`
      ]
    }; }\n`;
  }
  l('CMCSS').textContent = str;
  UpdateBuildings(); // Class has been already set
}

;// CONCATENATED MODULE: ./src/InitSaveLoad/Variables.js
/** Variable that shows if Cookie Moonster is initzializing */
let isInitializing = false; // eslint-disable-line prefer-const
let test;

;// CONCATENATED MODULE: ./src/Disp/Notifications/Flash.js


/**
 * This function creates a flash depending on configs. It is called by all functions
 * that check game-events and which have settings for Flashes (e.g., Golden Cookies appearing, Magic meter being full)
 * @param	{number}	mode	Sets the intensity of the flash, used to recursively dim flash
 * 								All calls of function have use mode === 3
 * @param	{string}	config	The setting in CM.Options that is checked before creating the flash
 * @param	{bool}    forced		Whether the sound should play regardless of settings, used to test the sound
 */
function Flash(mode, config, forced) {
  // The arguments check makes the sound not play upon initialization of the mod
  if (
    ((Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings[config] === 1 ||
      forced) &&
      mode === 3 &&
      isInitializing === false) ||
    mode === 1
  ) {
    l('CMFlashScreen').style.backgroundColor =
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings[`Colour${config}`];
    l('CMFlashScreen').style.opacity = '0.5';
    if (mode === 3) {
      l('CMFlashScreen').style.display = 'inline';
      setTimeout(() => {
        Flash(2, config, true);
      }, 1000 / Game.fps);
    } else {
      setTimeout(() => {
        Flash(0, config, true);
      }, 1000 / Game.fps);
    }
  } else if (mode === 2) {
    l('CMFlashScreen').style.opacity = '1';
    setTimeout(() => {
      Flash(1, config, true);
    }, 1000 / Game.fps);
  } else if (mode === 0) l('CMFlashScreen').style.display = 'none';
}

;// CONCATENATED MODULE: ./src/Disp/Notifications/Sound.js


/**
 * This function plays a sound depending on configs. It is called by all functions
 * that check game-events and which have settings for sound (e.g., Golden Cookies appearing, Magic meter being full)
 * @param	{variable}	url			A variable that gives the url for the sound (e.g., CM.Options.GCSoundURL)
 * @param	{string}	sndConfig	The setting in CM.Options that is checked before creating the sound
 * @param	{string}	volConfig	The setting in CM.Options that is checked to determine volume
 * @param	{bool}    forced		Whether the sound should play regardless of settings, used to test the sound
 */
function Sound_PlaySound(url, sndConfig, volConfig, forced) {
  // The arguments check makes the sound not play upon initialization of the mod
  if (
    (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings[sndConfig] === 1 ||
      forced) &&
    isInitializing === false
  ) {
    // eslint-disable-next-line new-cap
    const sound = new Audio(url);
    if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.GeneralSound)
      sound.volume =
        (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings[volConfig] / 100) *
        (Game.volume / 100);
    else
      sound.volume =
        Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings[volConfig] / 100;
    sound.play();
  }
}

;// CONCATENATED MODULE: ./src/Disp/MenuSections/Prompt.js
/** Creates a Prompt similar to the base game without some of the stuff breaking them */
function CookieMonsterPrompt(content, options) {
  Game.promptWrapL.className = 'framed';
  const str = content;
  Game.promptL.innerHTML = `${str}<div class="optionBox"></div>`;
  Object.keys(options).forEach((i) => {
    const option = document.createElement('a');
    option.id = `promptOption${i}`;
    option.className = 'option';
    option.onclick = function () {
      PlaySound('snd/tick.mp3');
      options[i][1]();
    };
    option.textContent = options[i][0];
    Game.promptL.children[1].appendChild(option);
  });
  Game.promptAnchorL.style.display = 'block';
  Game.darkenL.style.display = 'block';
  Game.promptL.focus();
  Game.promptOn = 1;
  Game.UpdatePrompt();
}

;// CONCATENATED MODULE: ./src/Disp/MenuSections/Settings/CreateOption.js













/**
 * This function creates the favourite setting star object
 * @param 	{string}		config	The name of the option
 * @returns	{object}		div		The option object
 */
function CreateFavouriteStar(config) {
  const FavStar = document.createElement('a');
  if (FavouriteSettings.includes(config)) {
    FavStar.innerText = '★';
    FavStar.style.color = 'yellow';
  } else FavStar.innerText = '☆';
  FavStar.className = 'option';
  FavStar.onclick = function () {
    ToggleFavouriteSetting(config);
    saveFramework();
    Game.UpdateMenu();
  };
  FavStar.onmouseover = function () {
    Game.tooltip.draw(this, escape(SimpleTooltipElements.FavouriteSettingPlaceholder.innerHTML));
  };
  FavStar.onmouseout = function () {
    Game.tooltip.hide();
  };
  FavStar.appendChild(document.createTextNode(' '));
  return FavStar;
}

/**
 * This function creates an option-object for the options page
 * @param 	{string}		config	The name of the option
 * @returns	{object}		div		The option object
 */
function CreatePrefOption(config) {
  const div = document.createElement('div');
  div.className = 'listing';
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.FavouriteSettings === 1) {
    div.appendChild(CreateFavouriteStar(config));
  }
  if (Data_settings[config].type === 'bool') {
    const a = document.createElement('a');
    if (
      Data_settings[config].toggle &&
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings[config] === 0
    ) {
      a.className = 'option off';
    } else {
      a.className = 'option';
    }
    a.id = ConfigPrefix + config;
    a.onclick = function () {
      ToggleConfig(config);
      Game.UpdateMenu();
    };
    a.textContent =
      Data_settings[config].label[
        Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings[config]
      ];
    div.appendChild(a);
    const label = document.createElement('label');
    label.textContent = Data_settings[config].desc;
    label.style.lineHeight = '1.6';
    div.appendChild(label);
    return div;
  }
  if (Data_settings[config].type === 'vol') {
    const volume = document.createElement('div');
    volume.className = 'sliderBox';
    const title = document.createElement('div');
    title.style.float = 'left';
    title.innerHTML = Data_settings[config].desc;
    volume.appendChild(title);
    const percent = document.createElement('div');
    percent.id = `slider${config}right`;
    percent.style.float = 'right';
    percent.innerHTML = `${Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings[config]}%`;
    volume.appendChild(percent);
    const slider = document.createElement('input');
    slider.className = 'slider';
    slider.id = `slider${config}`;
    slider.style.clear = 'both';
    slider.type = 'range';
    slider.min = '0';
    slider.max = '100';
    slider.step = '1';
    slider.value = Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings[config];
    slider.oninput = function () {
      ToggleConfigVolume(config);
      Game.UpdateMenu();
    };
    slider.onchange = function () {
      ToggleConfigVolume(config);
      Game.UpdateMenu();
    };
    volume.appendChild(slider);
    div.appendChild(volume);
    const a = document.createElement('a');
    a.className = 'option';
    a.onclick = function () {
      Sound_PlaySound(
        Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings[
          config.replace('Volume', 'SoundURL')
        ],
        config.replace('Volume', 'Sound'),
        config,
        true,
      );
    };
    a.textContent = 'Test sound';
    div.appendChild(a);
    return div;
  }
  if (Data_settings[config].type === 'url') {
    const span = document.createElement('span');
    span.className = 'option';
    span.textContent = `${Data_settings[config].label} `;
    span.style.lineHeight = '1.6';
    div.appendChild(span);
    const input = document.createElement('input');
    input.id = ConfigPrefix + config;
    input.className = 'option';
    input.type = 'text';
    input.readOnly = true;
    input.setAttribute(
      'value',
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings[config],
    );
    input.style.width = '300px';
    div.appendChild(input);
    div.appendChild(document.createTextNode(' '));
    const inputPrompt = document.createElement('input');
    inputPrompt.id = `${ConfigPrefix + config}Prompt`;
    inputPrompt.className = 'option';
    inputPrompt.type = 'text';
    inputPrompt.setAttribute(
      'value',
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings[config],
    );
    const a = document.createElement('a');
    a.className = 'option';
    a.onclick = function () {
      CookieMonsterPrompt(inputPrompt.outerHTML, [
        [
          'Save',
          function () {
            Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings[config] = l(
              `${ConfigPrefix}${config}Prompt`,
            ).value;
            saveFramework();
            Game.ClosePrompt();
            Game.UpdateMenu();
          },
        ],
        [
          'Cancel',
          function () {
            Game.ClosePrompt();
          },
        ],
      ]);
    };
    a.textContent = 'Edit';
    div.appendChild(a);
    const label = document.createElement('label');
    label.textContent = Data_settings[config].desc;
    label.style.lineHeight = '1.6';
    div.appendChild(label);
    return div;
  }
  if (Data_settings[config].type === 'colour') {
    const innerSpan = document.createElement('span');
    innerSpan.className = 'option';
    const input = document.createElement('input');
    input.id = config;
    input.style.width = '65px';
    input.setAttribute(
      'value',
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings[config],
    );
    innerSpan.appendChild(input);
    const change = function () {
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings[this.targetElement.id] =
        this.toHEXString();
      UpdateColours();
      saveFramework();
      Game.UpdateMenu();
    };
    // eslint-disable-next-line no-new
    new jscolor(input, { hash: true, position: 'right', onInput: change });
    const label = document.createElement('label');
    label.textContent = Data_settings[config].desc;
    label.style.lineHeight = '1.6';
    innerSpan.appendChild(label);
    if (config.includes('Flash')) {
      const a = document.createElement('a');
      a.className = 'option';
      a.onclick = function () {
        Flash(3, config.replace('Colour', ''), true);
      };
      a.textContent = 'Test flash';
      innerSpan.appendChild(a);
    }
    div.appendChild(innerSpan);
    jscolor_default().init();
    return div;
  }
  if (Data_settings[config].type === 'numscale') {
    const span = document.createElement('span');
    span.className = 'option';
    span.textContent = `${Data_settings[config].label} `;
    span.style.lineHeight = '1.6';
    div.appendChild(span);
    const input = document.createElement('input');
    input.id = ConfigPrefix + config;
    input.className = 'option';
    input.type = 'number';
    input.value = Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings[config];
    input.min = Data_settings[config].min;
    input.max = Data_settings[config].max;
    input.oninput = function () {
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings[config] = this.value;
      saveFramework();
      RefreshScale();
      Game.UpdateMenu();
    };
    div.appendChild(input);
    div.appendChild(document.createTextNode(' '));
    const label = document.createElement('label');
    label.textContent = Data_settings[config].desc;
    label.style.lineHeight = '1.6';
    div.appendChild(label);
    return div;
  }
  return div;
}

;// CONCATENATED MODULE: ./src/Disp/MenuSections/Settings/SettingsPage.js






/**
 * This function adds the options/settings of CookieMonster to the options page
 * It is called by CM.Disp.AddMenu
 * @param {object} title	On object that includes the title of the menu
 */
function AddMenuPref(title) {
  const frag = document.createDocumentFragment();
  frag.appendChild(title);

  Object.keys(ConfigGroups).forEach((group) => {
    if (group === 'Favourite') {
      if (
        FavouriteSettings.length !== 0 &&
        Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.FavouriteSettings > 0
      ) {
        frag.appendChild(CreatePrefHeader(group, ConfigGroups[group])); // (group, display-name of group)
        if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.headers[group])
          for (let index = 0; index < FavouriteSettings.length; index++) {
            frag.appendChild(CreatePrefOption(FavouriteSettings[index]));
          }
      }
    } else {
      frag.appendChild(CreatePrefHeader(group, ConfigGroups[group])); // (group, display-name of group)
      if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.headers[group]) {
        // 0 is show, 1 is collapsed
        // Make sub-sections of Notification section
        if (group === 'Notification') {
          Object.keys(ConfigGroupsNotification).forEach((subGroup) => {
            const subGroupObject = CreatePrefHeader(subGroup, ConfigGroupsNotification[subGroup]); // (group, display-name of group)
            subGroupObject.style.fontSize = '15px';
            subGroupObject.style.opacity = '0.5';
            frag.appendChild(subGroupObject);
            if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.headers[subGroup]) {
              Object.keys(Data_settings).forEach((option) => {
                if (Data_settings[option].group === subGroup) frag.appendChild(CreatePrefOption(option));
              });
            }
          });
        } else {
          Object.keys(Data_settings).forEach((option) => {
            if (Data_settings[option].group === group) frag.appendChild(CreatePrefOption(option));
          });
        }
      }
    }
  });

  l('menu').childNodes[2].insertBefore(
    frag,
    l('menu').childNodes[2].childNodes[l('menu').childNodes[2].childNodes.length - 1],
  );
}

;// CONCATENATED MODULE: ./src/Disp/MenuSections/AddMenus.js



/**
 * This function adds the calll the functions to add extra info to the stats and options pages
 */
function AddMenu() {
  const title = document.createElement('div');
  title.className = 'title';

  if (Game.onMenu === 'prefs') {
    title.textContent = 'Cookie Monster Settings';
    AddMenuPref(title);
  } else if (Game.onMenu === 'stats') {
    if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.Stats) {
      title.textContent = 'Cookie Monster Statistics';
      AddMenuStats(title);
    }
  }
}

;// CONCATENATED MODULE: ./src/Disp/TabTitle/TabTitle.js
/** Functions related to updating the tab in the browser's tab-bar */






/**
 * This function updates the tab title
 * It is called on every loop by Game.Logic() which also sets CM.Disp.Title to Game.cookies
 */
function UpdateTitle() {
  if (
    Game.OnAscend ||
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.Title === 0
  ) {
    document.title = Title;
  } else if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.Title === 1) {
    let addFC = false;
    let addSP = false;
    let titleGC;
    let titleFC;
    let titleSP;

    if (CacheSpawnedGoldenShimmer) {
      if (CacheSpawnedGoldenShimmer.wrath)
        titleGC = `[W${Math.ceil(CacheSpawnedGoldenShimmer.life / Game.fps)}]`;
      else titleGC = `[G${Math.ceil(CacheSpawnedGoldenShimmer.life / Game.fps)}]`;
    } else if (!Game.Has('Golden switch [off]')) {
      titleGC = `[${Number(l('CMTimerBarGCMinBar').textContent) < 0 ? '!' : ''}${Math.ceil(
        (Game.shimmerTypes.golden.maxTime - Game.shimmerTypes.golden.time) / Game.fps,
      )}]`;
    } else titleGC = '[GS]';

    if (LastTickerFortuneState) {
      addFC = true;
      titleFC = '[F]';
    }

    if (Game.season === 'christmas') {
      addSP = true;
      if (LastSeasonPopupState) titleSP = `[R${Math.ceil(CacheSeasonPopShimmer.life / Game.fps)}]`;
      else {
        titleSP = `[${Number(l('CMTimerBarRenMinBar').textContent) < 0 ? '!' : ''}${Math.ceil(
          (Game.shimmerTypes.reindeer.maxTime - Game.shimmerTypes.reindeer.time) / Game.fps,
        )}]`;
      }
    }

    // Remove previous timers and add current cookies
    let str = Title;
    if (str.charAt(0) === '[') {
      str = str.substring(str.lastIndexOf(']') + 1);
    }
    document.title = `${titleGC + (addFC ? titleFC : '') + (addSP ? titleSP : '')} ${str}`;
  } else if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.Title === 2) {
    let str = '';
    let spawn = false;
    if (CacheSpawnedGoldenShimmer) {
      spawn = true;
      if (CacheSpawnedGoldenShimmer.wrath)
        str += `[W${Math.ceil(CacheSpawnedGoldenShimmer.life / Game.fps)}]`;
      else str += `[G${Math.ceil(CacheSpawnedGoldenShimmer.life / Game.fps)}]`;
    }
    if (LastTickerFortuneState) {
      spawn = true;
      str += '[F]';
    }
    if (Game.season === 'christmas' && LastSeasonPopupState) {
      str += `[R${Math.ceil(CacheSeasonPopShimmer.life / Game.fps)}]`;
      spawn = true;
    }
    if (spawn) str += ' - ';
    let title = 'Cookie Clicker';
    if (Game.season === 'fools') title = 'Cookie Baker';
    str += title;
    document.title = str;
  }
}

;// CONCATENATED MODULE: ./src/Disp/Tooltips/AscendButton.js



/**
 * This function creates a header object for tooltips.
 * @param	{string}	text	Title of header
 * @returns {object}	div		An object containing the stylized header
 */
function ReplaceAscendTooltip() {
  const cookiesToNext = Math.max(
    0,
    Game.HowManyCookiesReset(
      Math.floor(Game.HowMuchPrestige(Game.cookiesReset + Game.cookiesEarned)) + 1,
    ) -
      (Game.cookiesEarned + Game.cookiesReset),
  );

  const startDate = Game.sayTime(((Date.now() - Game.startDate) / 1000) * Game.fps, -1);
  let str = '';
  str += `You've been on this run for <b>${
    startDate === '' ? 'not very long' : startDate
  }</b>.<br>`;
  str += '<div class="line"></div>';
  if (Game.prestige > 0) {
    str += `Your prestige level is currently <b>${Beautify_Beautify(Game.prestige)}</b>.<br>(CpS +${Beautify_Beautify(
      Game.prestige,
    )}%)`;
    str += '<div class="line"></div>';
  }
  if (CacheLastHeavenlyChips < 1) str += 'Ascending now would grant you no prestige.';
  else if (CacheLastHeavenlyChips < 2)
    str +=
      'Ascending now would grant you<br><b>1 prestige level</b> (+1% CpS)<br>and <b>1 heavenly chip</b> to spend.';
  else
    str += `Ascending now would grant you<br><b>${Beautify_Beautify(
      CacheLastHeavenlyChips,
    )} prestige levels</b> (+${Beautify_Beautify(CacheLastHeavenlyChips)}% CpS)<br>and <b>${Beautify_Beautify(
      CacheLastHeavenlyChips,
    )} heavenly chips</b> to spend.`;
  str += '<div class="line"></div>';
  str += `You need <b>${Beautify_Beautify(cookiesToNext)} more cookies</b> for the next level.<br>`;
  str += `${
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TooltipAscendButton
      ? `<div class='line'></div>It takes ${CacheTimeTillNextPrestige} to reach the next level and you were making ${Beautify_Beautify(
          CacheHCPerSecond,
          2,
        )} chips on average in the last 5 seconds.<br>`
      : ''
  }`;
  l('ascendTooltip').innerHTML = str;
}

;// CONCATENATED MODULE: ./src/Disp/Tooltips/PositionLocation.js
/**
 * This function updates the location of the tooltip
 * It is called by Game.tooltip.update() because of CM.Main.ReplaceNative()
 */
function UpdateTooltipLocation() {
  if (Game.tooltip.origin === 'store') {
    let warnOffset = 0;
    if (
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.ToolWarnLucky === 1 &&
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.ToolWarnPos === 1 &&
      l('CMDispTooltipWarningParent') !== null
    ) {
      warnOffset = l('CMDispTooltipWarningParent').clientHeight - 4;
    }
    Game.tooltip.tta.style.top = `${Math.min(
      parseInt(Game.tooltip.tta.style.top, 10),
      l('game').clientHeight +
        l('topBar').clientHeight -
        Game.tooltip.tt.clientHeight -
        warnOffset -
        46,
    )}px`;
  }
  // Kept for future possible use if the code changes again
  /* else if (!Game.onCrate && !Game.OnAscend && CM.Options.TimerBar === 1 && CM.Options.TimerBarPos === 0) {
		Game.tooltip.tta.style.top = (parseInt(Game.tooltip.tta.style.top) + parseInt(CM.Disp.TimerBar.style.height)) + 'px';
	} */
}

;// CONCATENATED MODULE: ./src/Main/ReplaceGameElements/TooltipUpgrades.js



/**
 * This function replaces the original .onmouseover functions of upgrades so that it calls CM.Disp.Tooltip()
 * CM.Disp.Tooltip() sets the tooltip type to 'u'
 * It is called by Game.RebuildUpgrades() through CM.Main.ReplaceNative() and is therefore not permanent like the other ReplaceTooltip functions
 */
function ReplaceTooltipUpgrade() {
  TooltipUpgradeBackup = [];
  Object.keys(Game.UpgradesInStore).forEach((i) => {
    if (l(`upgrade${i}`).onmouseover !== null) {
      TooltipUpgradeBackup[i] = l(`upgrade${i}`).onmouseover;
      l(`upgrade${i}`).onmouseover = function () {
        if (!Game.mouseDown) {
          Game.setOnCrate(this);
          Game.tooltip.dynamic = 1;
          Game.tooltip.draw(this, () => CreateTooltip('u', `${i}`), 'store');
          Game.tooltip.wobble();
        }
      };
    }
  });
}

;// CONCATENATED MODULE: ./src/Main/ReplaceGameFunctions/FixMouse.js
/**
 * This function fixes Game.mouseY as a result of bars that are added by CookieMonster
 * It is called by Game.UpdateWrinklers(), Game.UpdateSpecial() and the .onmousover of the BigCookie
 * before execution of their actual function
 */
function FixMouseY(target) {
  if (
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TimerBar === 1 &&
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TimerBarPos === 0
  ) {
    const timerBarHeight = parseInt(l('CMTimerBar').style.height, 10);
    Game.mouseY -= timerBarHeight;
    target();
    Game.mouseY += timerBarHeight;
  } else {
    target();
  }
}

;// CONCATENATED MODULE: ./src/Main/ReplaceGameFunctions/ReplaceNative.js









 // eslint-disable-line no-unused-vars
 // eslint-disable-line no-unused-vars




/**
 * This function replaces certain native (from the base-game) functions
 */
function ReplaceNative() {
  // eslint-disable-next-line no-undef
  BackupFunctions.Beautify = Beautify;
  // eslint-disable-next-line no-undef
  Beautify = Beautify_Beautify;

  BackupFunctions.CalculateGains = Game.CalculateGains;
  Game.CalculateGains = function () {
    BackupFunctions.CalculateGains();
    SimDoSims = 1;
    CycliusDateAtBeginLoop = Date.now();
    CenturyDateAtBeginLoop = Date.now();
  };

  BackupFunctions.tooltip = {};
  BackupFunctions.tooltip.draw = Game.tooltip.draw;
  BackupFunctions.tooltip.drawMod = new Function( // eslint-disable-line no-new-func
    `return ${Game.tooltip.draw.toString().split('this').join('Game.tooltip')}`,
  )();
  Game.tooltip.draw = function (from, text, origin) {
    BackupFunctions.tooltip.drawMod(from, text, origin);
  };

  BackupFunctions.tooltip.update = Game.tooltip.update;
  BackupFunctions.tooltip.updateMod = new Function( // eslint-disable-line no-new-func
    `return ${Game.tooltip.update.toString().split('this.').join('Game.tooltip.')}`,
  )();
  Game.tooltip.update = function () {
    BackupFunctions.tooltip.updateMod();
    UpdateTooltipLocation();
  };

  BackupFunctions.UpdateWrinklers = Game.UpdateWrinklers;
  Game.UpdateWrinklers = function () {
    FixMouseY(BackupFunctions.UpdateWrinklers);
  };

  BackupFunctions.UpdateSpecial = Game.UpdateSpecial;
  Game.UpdateSpecial = function () {
    FixMouseY(BackupFunctions.UpdateSpecial);
  };

  // Assumes newer browsers
  l('bigCookie').removeEventListener('click', Game.ClickCookie, false);
  l('bigCookie').addEventListener(
    'click',
    () => {
      FixMouseY(Game.ClickCookie);
    },
    false,
  );

  BackupFunctions.RebuildUpgrades = Game.RebuildUpgrades;
  Game.RebuildUpgrades = function () {
    BackupFunctions.RebuildUpgrades();
    ReplaceTooltipUpgrade();
    Game.CalculateGains();
  };

  BackupFunctions.ClickProduct = Game.ClickProduct;
  /**
   * This function adds a check to the purchase of a building to allow BulkBuyBlock to work.
   * If the options is 1 (on) bulkPrice is under cookies you can't buy the building.
   */
  Game.ClickProduct = function (what) {
    if (
      !Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.BulkBuyBlock ||
      Game.ObjectsById[what].bulkPrice < Game.cookies ||
      Game.buyMode === -1
    ) {
      BackupFunctions.ClickProduct(what);
    }
  };

  BackupFunctions.DescribeDragonAura = Game.DescribeDragonAura;
  /**
   * This function adds the function CM.Disp.AddAuraInfo() to Game.DescribeDragonAura()
   * This adds information about CPS differences and costs to the aura choosing interface
   * @param	{number}	aura	The number of the aura currently selected by the mouse/user
   */
  Game.DescribeDragonAura = function (aura) {
    BackupFunctions.DescribeDragonAura(aura);
    AddAuraInfo(aura);
  };

  BackupFunctions.ToggleSpecialMenu = Game.ToggleSpecialMenu;
  /**
   * This function adds the code to display the tooltips for the levelUp button of the dragon
   */
  Game.ToggleSpecialMenu = function (on) {
    BackupFunctions.ToggleSpecialMenu(on);
    AddDragonLevelUpTooltip();
  };

  BackupFunctions.UpdateMenu = Game.UpdateMenu;
  Game.UpdateMenu = function () {
    if (typeof (jscolor_default()).picker === 'undefined' || typeof (jscolor_default()).picker.owner === 'undefined') {
      BackupFunctions.UpdateMenu();
      AddMenu();
    }
  };

  BackupFunctions.sayTime = Game.sayTime;
  // eslint-disable-next-line no-unused-vars
  CMSayTime = function (time, detail) {
    if (Number.isNaN(time) || time <= 0) return BackupFunctions.sayTime(time, detail);
    return FormatTime(time / Game.fps, 1);
  };

  BackupFunctions.Logic = Game.Logic;
  Game.Logic = function () {
    BackupFunctions.Logic();

    // Update tab title
    let title = 'Cookie Clicker';
    if (Game.season === 'fools') title = 'Cookie Baker';
    // eslint-disable-next-line no-unused-vars
    Title = `${Game.OnAscend ? 'Ascending! ' : ''}${Beautify_Beautify(Game.cookies)} ${
      Game.cookies === 1 ? 'cookie' : 'cookies'
    } - ${title}`;
    UpdateTitle();

    // Since the Ascend Tooltip is not actually a tooltip we need to add our additional info here...
    ReplaceAscendTooltip();
  };
}

;// CONCATENATED MODULE: ./src/Main/WrinklerArea/AddDetectArea.js
 // eslint-disable-line no-unused-vars

/**
 * This function creates .onmouseover/out events that determine if the mouse is hovering-over a Wrinkler
 * As wrinklers are not appended to the DOM we us a different system than for other tooltips
 */
function AddWrinklerAreaDetect() {
  l('backgroundLeftCanvas').onmouseover = function () {
    TooltipWrinklerArea = 1;
  };
  l('backgroundLeftCanvas').onmouseout = function () {
    TooltipWrinklerArea = 0;
    Game.tooltip.hide();
    Object.keys(Game.wrinklers).forEach((i) => {
      TooltipWrinklerBeingShown[i] = 0;
    });
  };
}

;// CONCATENATED MODULE: ./src/Disp/Buildings/ToggleBuildingLock.js
/**
 * This function toggle the locked state of a building
 * @param	{number}	index	Index of the row to change
 */
function ToggleBuildingLock(index) {
  if (l(`productLock${index}`).innerHTML === 'Unlocked') {
    l(`productLock${index}`).innerHTML = 'Locked';
    l(`row${index}`).children[3].style.pointerEvents = 'none';
  } else {
    l(`productLock${index}`).innerHTML = 'Unlocked';
    l(`row${index}`).children[3].style.pointerEvents = 'auto';
  }
}

;// CONCATENATED MODULE: ./src/Disp/Buildings/CreateBuildingLockButtons.js


/**
 * This function adds a lock button to the "building view" in the middle section
 */
function CreateBuildingLockButtons() {
  Object.keys(l('rows').children).forEach((index) => {
    const productButtons = l('rows').children[index].children[1];
    const button = document.createElement('div');
    button.id = `productLock${Number(index) + 1}`;
    button.className = 'productButton';
    button.innerHTML = 'Unlocked';
    button.onclick = function () {
      ToggleBuildingLock(Number(index) + 1);
    };
    productButtons.appendChild(button);
  });
}

;// CONCATENATED MODULE: ./src/Disp/MenuSections/createMenuInfo.js



/**
 * Creates the <div> to be added to the Info section
 * @returns {object} menuDiv	Object of the <div> of Cookie Monster in info tab
 */
function createMenuInfo() {
  const menuDiv = menuFunctions.createModMenuSection(
    'cookieMonsterMod',
    'Cookie Monster',
    'infoMenu',
  );

  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.headers.infoMenu) {
    menuDiv.appendChild(menuFunctions.createInfoListing(ModDescription));
    menuDiv.appendChild(menuFunctions.createInfoListing(LatestReleaseNotes));
  }

  return menuDiv;
}

;// CONCATENATED MODULE: ./src/Main/Initialization.js













 // eslint-disable-line no-unused-vars




 // eslint-disable-line no-unused-vars




/**
 * Initialization loop of Cookie Monster
 */
function InitializeCookieMonster() {
  // Create global data object
  window.CookieMonsterData = {};

  // Register listeners in Cookie Monster Mod Framework
  Game.mods.cookieMonsterFramework.listeners.infoMenu.push(createMenuInfo);

  InitData();
  CacheStatsCookies();
  InitCache();

  // Stored to check if we need to re-initiliaze data
  LastModCount = Object.keys(Game.mods).length;

  // Creating visual elements
  CreateCssArea();
  CreateBotBar();
  CreateTimerBar();
  CreateUpgradeBar();
  CreateFlashScreen();
  CreateSectionHideButtons();
  CreateFavicon();
  Object.keys(TooltipText).forEach((i) => {
    CreateSimpleTooltip(TooltipText[i][0], TooltipText[i][1], TooltipText[i][2]);
  });
  CreateWrinklerButtons();
  UpdateBuildingUpgradeStyle();
  CreateBuildingLockButtons();

  ReplaceTooltips();
  AddWrinklerAreaDetect();

  // Replace native functions
  ReplaceNative();
  ReplaceNativeGrimoire();
  Game.CalculateGains();

  CMLastAscendState = Game.OnAscend;

  if (Game.prefs.popups)
    Game.Popup(`Cookie Monster version ${VersionMajor}.${VersionMinor} loaded!`);
  else Game.Notify(`Cookie Monster version ${VersionMajor}.${VersionMinor} loaded!`, '', '', 1, 1);

  Game.Win('Third-party');
}

;// CONCATENATED MODULE: ./src/Cache/CPS/CurrWrinklerCPS.js

 // eslint-disable-line no-unused-vars

/**
 * This functions caches the current Wrinkler CPS multiplier
 * @global	{number}	CM.Cache.CurrWrinklerCount		Current number of wrinklers
 * @global	{number}	CM.Cache.CurrWrinklerCPSMult	Current multiplier of CPS because of wrinklers (excluding their negative sucking effect)
 */
function CacheCurrWrinklerCPS() {
  CacheCurrWrinklerCPSMult = 0;
  let count = 0;
  Object.keys(Game.wrinklers).forEach((i) => {
    if (Game.wrinklers[i].phase === 2) count += 1;
  });
  let godMult = 1;
  if (SimObjects.Temple.minigameLoaded) {
    const godLvl = Game.hasGod('scorn');
    if (godLvl === 1) godMult *= 1.15;
    else if (godLvl === 2) godMult *= 1.1;
    else if (godLvl === 3) godMult *= 1.05;
  }
  CacheCurrWrinklerCount = count;
  CacheCurrWrinklerCPSMult =
    count *
    (count * 0.05 * 1.1) *
    (Game.Has('Sacrilegious corruption') * 0.05 + 1) *
    (Game.Has('Wrinklerspawn') * 0.05 + 1) *
    godMult;
}

;// CONCATENATED MODULE: ./src/Cache/CacheLoop.js







 // eslint-disable-line no-unused-vars


/**
 * This functions caches variables that are needed every loop
 * @global	{string}	CM.Cache.TimeTillNextPrestige	Time requried till next prestige level
 */
function LoopCache() {
  // Update Wrinkler Bank
  CacheWrinklers();

  PP_CachePP();
  AllAmountTillNextAchievement(false);
  CacheCurrWrinklerCPS();
  CacheAvgCPS();
  CacheHeavenlyChipsPS();

  const cookiesToNext =
    Game.HowManyCookiesReset(
      Math.floor(Game.HowMuchPrestige(Game.cookiesReset + Game.cookiesEarned)) + 1,
    ) -
    (Game.cookiesEarned + Game.cookiesReset);
  CacheTimeTillNextPrestige = FormatTime(cookiesToNext / GetCPS());
}

;// CONCATENATED MODULE: ./src/Sim/Calculations/NoGoldenSwitchCalc.js




/**
 * This function calculates CPS without the Golden Switch
 * It is called by CM.Cache.NoGoldSwitchCPS()
 */
function CalcNoGoldSwitchCPS() {
  CopyData();
  SimUpgrades["Golden switch [off]"].bought = 0;
  CalculateGains();
  return SimCookiesPs;
}

;// CONCATENATED MODULE: ./src/Cache/CPS/NoGoldSwitchCPS.js

 // eslint-disable-line no-unused-vars

/**
 * This function calculates CPS without the Golden Switch as it might be needed in other functions
 * If so it CM.Sim.Win()'s them and the caller function will know to recall CM.Sim.CalculateGains()
 * It is called at the end of any functions that simulates certain behaviour
 */
function CacheNoGoldSwitchCPS() {
  if (Game.Has('Golden switch [off]')) {
    CacheNoGoldSwitchCookiesPS = CalcNoGoldSwitchCPS();
  } else CacheNoGoldSwitchCookiesPS = Game.cookiesPs;
}

;// CONCATENATED MODULE: ./src/Sim/SimulationEvents/SellBuildingForChoEgg.js

 // eslint-disable-line no-unused-vars


/**
 * This function calculates the maximum cookies obtained from selling buildings just before purchasing the chocolate egg
 * It is called by CM.Cache.CacheSellForChoEgg()
 * @returns	{number}	sellTotal	The maximum cookies to be earned
 */
function SellBuildingsForChoEgg() {
  let sellTotal = 0;

  CopyData();

  // Change auras to Earth Shatterer + Reality bending to optimize money made by selling
  let buildingsToSacrifice = 2;
  if (SimDragonAura === 5 || SimDragonAura === 18) {
    buildingsToSacrifice -= 1;
  }
  if (SimDragonAura2 === 5 || SimDragonAura2 === 18) {
    buildingsToSacrifice -= 1;
  }
  SimDragonAura = 5;
  SimDragonAura2 = 18;

  // Sacrifice highest buildings for the aura switch
  for (let i = 0; i < buildingsToSacrifice; ++i) {
    let highestBuilding = 'Cursor';
    Object.keys(SimObjects).forEach((j) => {
      if (SimObjects[j].amount > 0) {
        highestBuilding = j;
      }
    });
    SimObjects[highestBuilding].amount -= 1;
    SimBuildingsOwned -= 1;
  }

  // Get money made by selling all remaining buildings
  Object.keys(SimObjects).forEach((i) => {
    const me = SimObjects[i];
    sellTotal += BuildingSell(
      Game.Objects[me.name],
      Game.Objects[i].basePrice,
      me.amount,
      Game.Objects[i].free,
      me.amount,
    );
  });

  return sellTotal;
}

;// CONCATENATED MODULE: ./src/Cache/CPS/SellChoEgg.js

 // eslint-disable-line no-unused-vars

/**
 * This functions caches the reward for selling the Chocolate egg
 * It is called by CM.Main.Loop()
 * @global	{number}	CM.Cache.SellForChoEgg	Total cookies to be gained from selling Chocolate egg
 */
function CacheSellAllForChoEgg() {
  let sellTotal = 0;
  // Compute cookies earned by selling stock market goods
  if (Game.Objects.Bank.minigameLoaded) {
    const marketGoods = Game.Objects.Bank.minigame.goods;
    let goodsVal = 0;
    Object.keys(marketGoods).forEach((i) => {
      const marketGood = marketGoods[i];
      goodsVal += marketGood.stock * marketGood.val;
    });
    sellTotal += goodsVal * Game.cookiesPsRawHighest;
  }
  // Compute cookies earned by selling all buildings with optimal auras (ES + RB)
  sellTotal += SellBuildingsForChoEgg();
  CacheSellForChoEgg = sellTotal;
}

;// CONCATENATED MODULE: ./src/Sim/SimulationEvents/GodChange.js



 // eslint-disable-line no-unused-vars

/**
 * This functions calculates the cps and cost of changing a Dragon Aura
 * It is called by CM.Disp.AddAuraInfo()
 * @param	{number}	god		The number of the slot to be swapped in
 * @param	{number     slot	The slot the god will go to
 * @returns {number} 	CM.Sim.cookiesPs - Game.cookiesPs   The bonus cps and the price of the change
 */
function CalculateChangeGod(god, slot) {
  if (!Game.Objects.Temple.minigameLoaded) return 0;
  CopyData();
  const { minigame } = Game.Objects.Temple;
  const CurrentSlot = minigame.godsById[god].slot;
  if (CurrentSlot === '0') SimGod1 = minigame.slot[slot];
  else if (CurrentSlot === '1') SimGod2 = minigame.slot[slot];
  else if (CurrentSlot === '2') SimGod3 = minigame.slot[slot];
  /* eslint-disable no-unused-vars */
  if (slot === 0) SimGod1 = god;
  else if (slot === 1) SimGod2 = god;
  else if (slot === 2) SimGod3 = god;
  /* eslint-enable no-unused-vars */

  const lastAchievementsOwned = SimAchievementsOwned;
  CalculateGains();

  CheckOtherAchiev();
  if (lastAchievementsOwned !== SimAchievementsOwned) {
    CalculateGains();
  }
  return SimCookiesPs - Game.cookiesPs;
}

;// CONCATENATED MODULE: ./src/Cache/PantheonGods/CacheGods.js



/**
 * This functions caches the cps effect of each God in slot 1, 2 or 3
 */
function CachePantheonGods() {
  for (let god = 0; god < 11; god += 1) {
    for (let slot = 0; slot < 3; slot += 1) {
      CacheGods[god][slot] = CalculateChangeGod(god, slot);
    }
  }
}

;// CONCATENATED MODULE: ./src/Disp/HelperFunctions/UpdateAscendState.js





/**
 * This function disables and shows the bars created by CookieMonster when the game is "ascending"
 * It is called by CM.Disp.Draw()
 */
function UpdateAscendState() {
  if (Game.OnAscend) {
    l('game').style.bottom = '0px';
    if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.BotBar === 1)
      l('CMBotBar').style.display = 'none';
    if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.TimerBar === 1)
      l('CMTimerBar').style.display = 'none';
  } else {
    ToggleBotBar();
    ToggleTimerBar();
  }
  UpdateBackground();
}

;// CONCATENATED MODULE: ./src/Main/CheckStates/Garden.js




/**
 * This function checks if a garden tick has happened
 */
function CheckGardenTick() {
  if (
    Game.Objects.Farm.minigameLoaded &&
    LastGardenNextStep !== Game.Objects.Farm.minigame.nextStep
  ) {
    if (LastGardenNextStep !== 0 && LastGardenNextStep < Date.now()) {
      Flash(3, 'GardFlash', false);
      Sound_PlaySound(
        Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.GardSoundURL,
        'GardSound',
        'GardVolume',
        false,
      );
    }
    LastGardenNextStep = Game.Objects.Farm.minigame.nextStep;
  }
}

;// CONCATENATED MODULE: ./src/Disp/GoldenCookieTimers/GoldenCookieTimers.js
/** Section: Functions related to the Golden Cookie Timers */



/**
 * This function creates a new Golden Cookie Timer and appends it CM.Disp.GCTimers based on the id of the cookie
 * @param	{object}	cookie	A Golden Cookie object
 */
function CreateGCTimer(cookie) {
  const GCTimer = document.createElement('div');
  GCTimer.id = `GCTimer${cookie.id}`;
  GCTimer.style.width = '96px';
  GCTimer.style.height = '96px';
  GCTimer.style.position = 'absolute';
  GCTimer.style.zIndex = '10000000001';
  GCTimer.style.textAlign = 'center';
  GCTimer.style.lineHeight = '96px';
  GCTimer.style.fontFamily = '"Kavoon", Georgia, serif';
  GCTimer.style.fontSize = '35px';
  GCTimer.style.cursor = 'pointer';
  GCTimer.style.display = 'block';
  GCTimer.style.pointerEvents = 'none';
  if (Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.GCTimer === 0)
    GCTimer.style.display = 'none';
  GCTimer.style.left = cookie.l.style.left;
  GCTimer.style.top = cookie.l.style.top;
  GCTimer.onclick = function () {
    cookie.pop();
  };
  GCTimer.onmouseover = function () {
    cookie.l.style.filter = 'brightness(125%) drop-shadow(0px 0px 3px rgba(255,255,255,1))'; // eslint-disable-line no-param-reassign
    cookie.l.style.webkitFilter = 'brightness(125%) drop-shadow(0px 0px 3px rgba(255,255,255,1))'; // eslint-disable-line no-param-reassign
  };
  GCTimer.onmouseout = function () {
    cookie.l.style.filter = ''; // eslint-disable-line no-param-reassign
    cookie.l.style.webkitFilter = ''; // eslint-disable-line no-param-reassign
  };

  GCTimers[cookie.id] = GCTimer;
  l('shimmers').appendChild(GCTimer);
}

;// CONCATENATED MODULE: ./src/Disp/Notifications/Notification.js


/**
 * This function creates a notifcation depending on configs. It is called by all functions
 * that check game-events and which have settings for notifications (e.g., Golden Cookies appearing, Magic meter being full)
 * @param	{string}	notifyConfig	The setting in CM.Options that is checked before creating the notification
 * @param	{string}	title			The title of the to-be created notifications
 * @param	{string}	message			The text of the to-be created notifications
 */
function CreateNotification(notifyConfig, title, message) {
  // The arguments check makes the sound not play upon initialization of the mod
  if (
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings[notifyConfig] === 1 &&
    document.visibilityState === 'hidden' &&
    isInitializing === false
  ) {
    const CookieIcon = 'https://orteil.dashnet.org/cookieclicker/favicon.ico';
    // eslint-disable-next-line no-new
    new Notification(title, { body: message, badge: CookieIcon });
  }
}

;// CONCATENATED MODULE: ./src/Main/CheckStates/GoldenCookie.js
 // eslint-disable-line no-unused-vars








/**
 * Auxilirary function that finds all currently spawned shimmers.
 * CM.Cache.spawnedGoldenShimmer stores the non-user spawned cookie to later determine data for the favicon and tab-title
 * It is called by CM.CM.Main.CheckGoldenCookie
 */
function FindShimmer() {
  CurrSpawnedGoldenCookieState = 0;
  CacheGoldenShimmersByID = {};
  Object.keys(Game.shimmers).forEach((i) => {
    CacheGoldenShimmersByID[Game.shimmers[i].id] = Game.shimmers[i];
    if (Game.shimmers[i].spawnLead && Game.shimmers[i].type === 'golden') {
      CacheSpawnedGoldenShimmer = Game.shimmers[i];
      CurrSpawnedGoldenCookieState += 1;
    }
  });
}

/**
 * This function checks for changes in the amount of Golden Cookies
 * It is called by CM.Main.Loop
 */
function CheckGoldenCookie() {
  FindShimmer();
  Object.keys(GCTimers).forEach((i) => {
    if (typeof CacheGoldenShimmersByID[i] === 'undefined') {
      GCTimers[i].parentNode.removeChild(GCTimers[i]);
      delete GCTimers[i];
    }
  });
  if (LastGoldenCookieState !== Game.shimmerTypes.golden.n) {
    LastGoldenCookieState = Game.shimmerTypes.golden.n;
    if (LastGoldenCookieState) {
      if (LastSpawnedGoldenCookieState < CurrSpawnedGoldenCookieState) {
        Flash(3, 'GCFlash', false);
        Sound_PlaySound(
          Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.GCSoundURL,
          'GCSound',
          'GCVolume',
          false,
        );
        CreateNotification(
          'GCNotification',
          'Golden Cookie Spawned',
          'A Golden Cookie has spawned. Click it now!',
        );
      }

      Object.keys(Game.shimmers).forEach((i) => {
        if (typeof GCTimers[Game.shimmers[i].id] === 'undefined') {
          CreateGCTimer(Game.shimmers[i]);
        }
      });
    }
    UpdateFavicon();
    LastSpawnedGoldenCookieState = CurrSpawnedGoldenCookieState;
    if (CurrSpawnedGoldenCookieState === 0) CacheSpawnedGoldenShimmer = 0;
  } else if (
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.GCTimer === 1 &&
    LastGoldenCookieState
  ) {
    Object.keys(GCTimers).forEach((i) => {
      GCTimers[i].style.opacity = CacheGoldenShimmersByID[i].l.style.opacity;
      GCTimers[i].style.transform = CacheGoldenShimmersByID[i].l.style.transform;
      GCTimers[i].textContent = Math.ceil(CacheGoldenShimmersByID[i].life / Game.fps);
    });
  }
}

;// CONCATENATED MODULE: ./src/Main/CheckStates/Grimoire.js





/**
 * This function checks if the magic meter is full
 * It is called by CM.Main.Loop
 */
function CheckMagicMeter() {
  if (
    Game.Objects['Wizard tower'].minigameLoaded &&
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.GrimoireBar === 1
  ) {
    const { minigame } = Game.Objects['Wizard tower'];
    if (minigame.magic < minigame.magicM) LastMagicBarFull = false;
    else if (!LastMagicBarFull) {
      LastMagicBarFull = true;
      Flash(3, 'MagicFlash', false);
      Sound_PlaySound(
        Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.MagicSoundURL,
        'MagicSound',
        'MagicVolume',
        false,
      );
      CreateNotification(
        'MagicNotification',
        'Magic Meter full',
        'Your Magic Meter is full. Cast a spell!',
      );
    }
  }
}

;// CONCATENATED MODULE: ./src/Main/CheckStates/Season.js
 // eslint-disable-line no-unused-vars





/**
 * This function checks if there is reindeer that has spawned
 * It is called by CM.Main.Loop
 */
function CheckSeasonPopup() {
  if (LastSeasonPopupState !== Game.shimmerTypes.reindeer.spawned) {
    LastSeasonPopupState = Game.shimmerTypes.reindeer.spawned;
    Object.keys(Game.shimmers).forEach((i) => {
      if (Game.shimmers[i].spawnLead && Game.shimmers[i].type === 'reindeer') {
        CacheSeasonPopShimmer = Game.shimmers[i];
      }
    });
    Flash(3, 'SeaFlash', false);
    Sound_PlaySound(
      Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.SeaSoundURL,
      'SeaSound',
      'SeaVolume',
      false,
    );
    CreateNotification(
      'SeaNotification',
      'Reindeer sighted!',
      'A Reindeer has spawned. Click it now!',
    );
  }
}

;// CONCATENATED MODULE: ./src/Main/CheckStates/Ticker.js





/**
 * This function checks if there is a fortune cookie on the ticker
 * It is called by CM.Main.Loop
 */
function CheckTickerFortune() {
  if (LastTickerFortuneState !== (Game.TickerEffect && Game.TickerEffect.type === 'fortune')) {
    LastTickerFortuneState = Game.TickerEffect && Game.TickerEffect.type === 'fortune';
    if (LastTickerFortuneState) {
      Flash(3, 'FortuneFlash', false);
      Sound_PlaySound(
        Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.FortuneSoundURL,
        'FortuneSound',
        'FortuneVolume',
        false,
      );
      CreateNotification(
        'FortuneNotification',
        'Fortune Cookie found',
        'A Fortune Cookie has appeared on the Ticker.',
      );
    }
  }
}

;// CONCATENATED MODULE: ./src/Main/CheckStates/Wrinkler.js





/**
 * This function checks if any new Wrinklers have popped up
 * It is called by CM.Main.Loop
 */
function CheckWrinklerCount() {
  if (Game.elderWrath > 0) {
    let CurrentWrinklers = 0;
    Object.keys(Game.wrinklers).forEach((i) => {
      if (Game.wrinklers[i].phase === 2) CurrentWrinklers += 1;
    });
    if (CurrentWrinklers > LastWrinklerCount) {
      LastWrinklerCount = CurrentWrinklers;
      if (
        CurrentWrinklers === Game.getWrinklersMax() &&
        Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.WrinklerMaxFlash
      ) {
        Flash(3, 'WrinklerMaxFlash', false);
      } else {
        Flash(3, 'WrinklerFlash', false);
      }
      if (
        CurrentWrinklers === Game.getWrinklersMax() &&
        Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.WrinklerMaxSound
      ) {
        Sound_PlaySound(
          Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.WrinklerMaxSoundURL,
          'WrinklerMaxSound',
          'WrinklerMaxVolume',
          false,
        );
      } else {
        Sound_PlaySound(
          Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.WrinklerSoundURL,
          'WrinklerSound',
          'WrinklerVolume',
          false,
        );
      }
      if (
        CurrentWrinklers === Game.getWrinklersMax() &&
        Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.settings.WrinklerMaxNotification
      ) {
        CreateNotification(
          'WrinklerMaxNotification',
          'Maximum Wrinklers Reached',
          'You have reached your maximum ammount of wrinklers',
        );
      } else {
        CreateNotification(
          'WrinklerNotification',
          'A Wrinkler appeared',
          'A new wrinkler has appeared',
        );
      }
    } else {
      LastWrinklerCount = CurrentWrinklers;
    }
  }
}

;// CONCATENATED MODULE: ./src/Main/LoopHook.js

























/**
 * Main loop of Cookie Monster
 * CM.init registers it to the "logic" hook provided by the modding api
 */
function CMLoopHook() {
  if (LastAscendState !== Game.OnAscend) {
    LastAscendState = Game.OnAscend;
    UpdateAscendState();
  }
  if (!Game.OnAscend && Game.AscendTimer === 0) {
    // Check if any other mods have been loaded
    if (LastModCount !== Object.keys(Game.mods).length) {
      InitData();
      InitCache();
      LastModCount = Object.keys(Game.mods).length;
    }

    // CM.Sim.DoSims is set whenever CPS has changed
    if (SimDoSims) {
      AllAmountTillNextAchievement(true);
      CacheIncome();

      CacheNoGoldSwitchCPS(); // Needed first
      CacheGoldenAndWrathCookiesMults();
      CacheStatsCookies();
      CacheAllMissingUpgrades();
      CacheChain();
      CacheDragonCost();
      CachePantheonGods();

      CacheSeasonSpec();
      CacheSellAllForChoEgg();

      SimDoSims = 0;
    }

    // Check for aura change to recalculate buildings prices
    const hasBuildAura = Game.auraMult('Fierce Hoarder') > 0;
    if (!CacheHadBuildAura && hasBuildAura) {
      CacheHadBuildAura = true;
      CacheDoRemakeBuildPrices = 1;
    } else if (CacheHadBuildAura && !hasBuildAura) {
      CacheHadBuildAura = false;
      CacheDoRemakeBuildPrices = 1;
    }

    if (CacheDoRemakeBuildPrices) {
      CacheBuildingsPrices();
      CacheDoRemakeBuildPrices = 0;
    }

    LoopCache();

    // Check all changing minigames and game-states
    CheckTickerFortune();
    CheckSeasonPopup();
    CheckGardenTick();
    CheckMagicMeter();
    CheckWrinklerCount();
  }
  // To remove Timers when ascending
  CheckGoldenCookie();
}

;// CONCATENATED MODULE: ./src/InitSaveLoad/init.js






 // eslint-disable-line no-unused-vars

/**
 * This creates a init function for the CM object. Per Game code/comments:
 * "this function is called as soon as the mod is registered
 * declare hooks here"
 * It starts the further initialization of CookieMonster and registers hooks
 */
function init_init() {
  isInitializing = true;
  let proceed = true;

  // Load Cookie Monster Mod Framework and register mod
  initFunctions.initModFramework();
  initFunctions.registerMod('cookieMonsterMod');

  if (Game.version !== Number(VersionMajor)) {
    // eslint-disable-next-line no-restricted-globals, no-alert
    proceed = confirm(
      `Cookie Monster version ${VersionMajor}.${VersionMinor} is meant for Game version ${VersionMajor}. Loading a different version may cause errors. Do you still want to load Cookie Monster?`,
    );
  }
  if (proceed) {
    InitializeCookieMonster();
    Game.registerHook('click', CMClickHook);
    Game.registerHook('draw', CMDrawHook);
    Game.registerHook('logic', CMLoopHook);

    isInitializing = false;
  }
}

;// CONCATENATED MODULE: ./src/Data/headers.js
/** This includes all headers of Cookie Monster and their relevant data */
const headers_headers = {
  Favourite: 1,
  Calculation: 1,
  Notation: 1,
  Colours: 1,
  BarsDisplay: 1,
  Tooltip: 1,
  Statistics: 1,
  Notification: 1,
  NotificationGeneral: 1,
  NotificationGC: 1,
  NotificationFC: 1,
  NotificationSea: 1,
  NotificationGard: 1,
  NotificationMagi: 1,
  NotificationWrink: 1,
  NotificationWrinkMax: 1,
  Miscellaneous: 1,
  Lucky: 1,
  Chain: 1,
  Spells: 1,
  Garden: 1,
  Prestige: 1,
  Wrink: 1,
  Sea: 1,
  Achievs: 1,
  Misc: 1,
  infoMenu: 1,
  optionsMenu: 1,
};

/* harmony default export */ const Data_headers = (headers_headers);

;// CONCATENATED MODULE: ./src/InitSaveLoad/load.js









/**
 * This creates a load function to the CM object. Per Game code/comments:
 * "do stuff with the string data you saved previously"
 */
function load_load(str) {
  InitData();
  loadMod('cookieMonsterMod', str, Data_settings, Data_headers, CMLoopHook);
  UpdateColours();
  if (
    Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod.version !==
    `${VersionMajor}.${VersionMinor}`
  ) {
    if (Game.prefs.popups)
      Game.Popup(
        'A new version of Cookie Monster has been loaded, check out the release notes in the info tab!',
      );
    else
      Game.Notify(
        'A new version of Cookie Monster has been loaded, check out the release notes in the info tab!',
        '',
        '',
        0,
        1,
      );
  }
}

;// CONCATENATED MODULE: ./src/InitSaveLoad/save.js


/**
 * This creates a save function to the CM object. Per Game code/comments:
 * "use this to store persistent data associated with your mod
 * return 'a string to be saved';"
 */
function save_save() {
  const saveObject = Game.mods.cookieMonsterFramework.saveData.cookieMonsterMod;
  saveObject.version = `${VersionMajor}.${VersionMinor}`;
  return JSON.stringify(saveObject);
}

;// CONCATENATED MODULE: ./src/CookieMonster.js




const CM = {
  init: init_init,
  load: load_load,
  save: save_save,
};

Game.registerMod('CookieMonster', CM);

})();

/******/ })()
;
//# sourceMappingURL=https://cookiemonsterteam.github.io/CookieMonster/dist/CookieMonsterDev.js.map