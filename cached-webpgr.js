/*
 * cached-webpgr.js - simple localStorage based caching of JavaScript files
 * https://github.com/webpgr/cached-webpgr.js
 * Author: Webpgr http://webpgr.com by Falko Krause <falko@webpgr.com>
 * License: MIT
 *
 * usage example:
 *  ```
 *  requireScript('jquery', '1.11.2', 'http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js', false, function(){
 *    requireScript('examplecss', '0.0.3', 'example.css',true);
 *  });
 *  ```
 */


/**
 * ##_cacheScript
 * This function requires IE7+, Firefox, Chrome, Opera, Safari.
 * It will make an ajax call to retrive the desired script from the provided url and store it
 * in the localStorage under the provided name. The stored script will be wrapped like in this example:
 * `{content: '// scrip content $(document).ready(...)', version: '1.02.03'}`
 * @param {string} url (see `requireScript` or 'css')
 * @param {string} name (see `requireScript` or 'css')
 * @param {string} version (see `requireScript` or 'css')
 * @param {Boolean} css (false =js, true=css)
 * @param {Function} callback (see `requireScript` or 'css')
 */
	var dd=document;
	function _cacheScript(name, version, url, css, callback) {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4) {
				if (xmlhttp.status == 200) {
					localStorage.setItem(name, JSON.stringify({
            					content: xmlhttp.responseText,
            					version: version
          				}));
					_injectScript(name, version, url, css, callback)
        			} else {
					if (callback) callback();
        			}
      			}
    		}
    	xmlhttp.open("GET", url, true);
    	xmlhttp.send();
	}
  /*
   * ##_loadScript
   * For loading external scripts (local or cross domain with CORS)
   * @param {string} url (see `requireScript` or 'css')
   * @param {string} name (see `requireScript` or 'css')
   * @param {string} version (see `requireScript` or 'css')
   * @param {bool} css (false =js, true=css)
   * @param {Function} callback (see `requireScript` or 'css')
   */
	function _loadScript(name, version, url, css, callback) {
  		var s 
		if (css)
			s = dd.createElement('script');
		else
			s = dd.createElement('style');
  		
		if (s.readyState) {
    		s.onreadystatechange = function()
			{
      			console.log("s.onreadystatechange");
				if (s.readyState == "loaded" || s.readyState == "complete") {
        			s.onreadystatechange = null;
        			if (callback) callback();
      			}
    		};
  		} else {
			console.log("s.onload");
    		s.onload = function() {
      			if (callback) callback();
    		}
  		}
		s.setAttribute("src", url);
		dd.getElementsByTagName("head")[0].appendChild(s)
	}

  /*
   * ##_injectScript
   * Injects a script loaded from localStorage into the DOM.
   * If the script version is differnt than the requested one, the localStorage key is cleared and a new version will be loaded next time.
   * @param {string} url (see `requireScript` or 'css')
   * @param {string} name (see `requireScript` or 'css')
   * @param {string} version (see `requireScript` or 'css')
   * @param {bool} css (false =js, true=css)
   * @param {Function} callback (see `requireScript` or 'css')
   */
	function _injectScript(name, version, url, css, callback) {
  		var c = JSON.parse(localStorage.getItem(name));
		if (c.version != version) {
			localStorage.removeItem(name);
    		_cacheScript(name, version, url, css, callback);
    		return;
  		}
  		var s 
		if (css)
			s = dd.createElement('style');
		else
			s = dd.createElement('script');
			
  		var scriptContent = dd.createTextNode(c.content);
  		s.appendChild(scriptContent);
  		dd.getElementsByTagName("head")[0].appendChild(s);
  		if (callback) callback();
	}

  /*
   * ##requireScript
   * If the requested script is not available in the localStorage it will be loaded from the provided url (see `_loadScript`).
   * If the script is present in the localStorage it will be injected (see `_injectScript`) into the DOM.
   * @param {string} url (see `requireScript` or 'css')
   * @param {string} name (see `requireScript` or 'css')
   * @param {string} version (see `requireScript` or 'css')
   * @param {bool} css (false =js, true=css)
   * @param {Function} callback (see `requireScript` or 'css')
   */
	function requireScript(name, version, url, css, callback) {
		if (typeof localStorage === 'undefined')
		{
			console.log("localStorage");
			_loadScript(name, version, url, css, callback)
		}else if (localStorage.getItem(name) == null) {
				_cacheScript(name, version, url, css, callback);
  			  } else {
				_injectScript(name, version, url, css, callback);
  			  }
		}
