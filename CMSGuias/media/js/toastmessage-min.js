/*
 * Copyright 2010 akquinet
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 *  This JQuery Plugin will help you in showing some nice Toast-Message like notification messages. The behavior is
 *  similar to the android Toast class.
 *  You have 4 different toast types you can show. Each type comes with its own icon and colored border. The types are:
 *  - notice
 *  - success
 *  - warning
 *  - error
 *
 *  The following methods will display a toast message:
 *
 *   $().toastmessage('showNoticeToast', 'some message here');
 *   $().toastmessage('showSuccessToast', "some message here");
 *   $().toastmessage('showWarningToast', "some message here");
 *   $().toastmessage('showErrorToast', "some message here");
 *
 *   // user configured toastmessage:
 *   $().toastmessage('showToast', {
 *      text     : 'Hello World',
 *      sticky   : true,
 *      position : 'top-right',
 *      type     : 'success',
 *      close    : function () {console.log("toast is closed ...");}
 *   });
 *
 *   To see some more examples please have a look into the Tests in src/test/javascript/ToastmessageTest.js
 *
 *   For further style configuration please see corresponding css file: jquery-toastmessage.css
 *
 *   This plugin is based on the jquery-notice (http://sandbox.timbenniks.com/projects/jquery-notice/)
 *   but is enhanced in several ways:
 *
 *   configurable positioning
 *   convenience methods for different message types
 *   callback functionality when closing the toast
 *   included some nice free icons
 *   reimplemented to follow jquery plugin good practices rules
 *
 *   Author: Daniel Bremer-Tonn and Christian Valdez Chavez
**/
(function($)
{
	var settings = {
		inEffect: {opacity: 'show'},	// in effect
		inEffectDuration: 	600,				// in effect duration in miliseconds
		stayTime: 		3000,				// time in miliseconds before the item has to disappear
		text: 				'',					// content of the item. Might be a string or a jQuery object. Be aware that any jQuery object which is acting as a message will be deleted when the toast is fading away.
		sticky: 			false,				// should the toast item sticky or not?
		type: 				'notice', 			// notice, warning, error, success
    position:     "",        // top-left, top-center, top-right, middle-left, middle-center, middle-right ... Position of the toast container holding different toast. Position can be set only once at the very first call, changing the position after the first call does nothing
    closeText:    '',                 // text which will be shown as close button, set to '' when you want to introduce an image via css
    close:        null,                // callback function when the toastmessage is closed
    showButtons: false,
    buttons: [],
		success: function (result) { }
  };
  //var confirm = {"text":"Confirm?","buttons":[{value:"Ok"}]}
	var methods = {
	  init : function(options)
		{
			if (options) {
				$.extend( settings, options );
			}
		},

		showToast : function(options)
		{
			var localSettings = {};
			settings.position = options.position == null ? "middle-center" : options.position
		  $.extend(localSettings, settings, options);
			// declare variables
		  var toastWrapAll, toastItemOuter, toastItemInner, toastItemClose, toastItemImage, toastButtons, toastItemButtons;

			toastWrapAll	= (!$('.toast-container').length) ? $('<div></div>').addClass('toast-container').addClass('toast-position-' + localSettings.position).appendTo('body') : $('.toast-container');
			toastItemOuter	= $('<div></div>').addClass('toast-item-wrapper');
			toastItemInner	= $('<div></div>').hide().addClass('toast-item toast-type-' + localSettings.type).appendTo(toastWrapAll).html($('<p>').append (localSettings.text)).animate(localSettings.inEffect, localSettings.inEffectDuration).wrap(toastItemOuter);
			toastItemClose	= $('<div></div>').addClass('toast-item-close').prependTo(toastItemInner).html(localSettings.closeText).click(function() { $().toastmessage('removeToast',toastItemInner, localSettings) });
			toastItemImage  = $('<div></div>').addClass('toast-item-image').addClass('toast-item-image-' + localSettings.type).prependTo(toastItemInner);
			// si lista de botones es mayor a 1 creamos botones
			if (localSettings.buttons.length > 0) {
				toastItemButtons  = $('<div></div>').addClass('toast-item-btn').prependTo(toastItemInner);
				$(localSettings.buttons).each(function (index, button) {
					toastButtons = $('<button value='+button.value+'></button>').addClass('toast-buttons').prependTo(toastItemButtons).html(button.value).click(function(event) {
						event.preventDefault();
						var value = $(this).val();
						localSettings.success(value);
						$().toastmessage('removeToast',toastItemInner, localSettings);
					});
				});
			};

		  if(navigator.userAgent.match(/MSIE 6/i))
			{
		   	toastWrapAll.css({top: document.documentElement.scrollTop});
		  }
		  // si lo vuelve sticky
			if(!localSettings.sticky)
			{
				setTimeout(function()
				{
					$().toastmessage('removeToast', toastItemInner, localSettings);
				},
				localSettings.stayTime);
			}
			settings.position = "";
		  return toastItemInner;
		},

		showNoticeToast : function (message)
		{
			console.error(message);
			var options = {text : message, type : 'notice'};
			return $().toastmessage('showToast', options);
		},

		showSuccessToast : function (message)
		{
		    var options = {text : message, type : 'success'};
		    return $().toastmessage('showToast', options);
		},

		showErrorToast : function (message)
		{
		    var options = {text : message, type : 'error'};
		    return $().toastmessage('showToast', options);
		},

		showWarningToast : function (message)
		{
			var options = {text : message, type : 'warning'};
			return $().toastmessage('showToast', options);
		},

		showConfirmToast : function (confirm)
		{
			var options = { text: confirm.message, type: 'confirm', buttons: confirm.buttons, success: confirm.success, position: confirm.position};
			return $().toastmessage('showToast', options)
		},

		removeToast: function(obj, options)
		{
			obj.animate({opacity: '0'}, 600, function()
			{
				obj.parent().animate({height: '0px'}, 300, function()
				{
					obj.parent().remove();
					$(".toast-container").remove();
				});
			});
			// callback
			if (options && options.close !== null)
			{
			    options.close();
			}
		}
	};

	$.fn.toastmessage = function( method ) {
		// Method calling logic
		if ( methods[method] ) {
		  return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
		  return methods.init.apply( this, arguments );
		} else {
		  $.error( 'Method ' +  method + ' does not exist on jQuery.toastmessage' );
		}
	};

})(jQuery);
/*(function(c){var b={inEffect:{opacity:"show"},inEffectDuration:600,stayTime:3000,text:"",sticky:false,type:"notice",position:"top-right",closeText:"",close:null};
var a={init:function(d){if(d){c.extend(b,d)
}},showToast:function(f){var g={};
c.extend(g,b,f);
var j,e,d,i,h;
j=(!c(".toast-container").length)?c("<div></div>").addClass("toast-container").addClass("toast-position-"+g.position).appendTo("body"):c(".toast-container");
e=c("<div></div>").addClass("toast-item-wrapper");
d=c("<div></div>").hide().addClass("toast-item toast-type-"+g.type).appendTo(j).html(c("<p>").append(g.text)).animate(g.inEffect,g.inEffectDuration).wrap(e);
i=c("<div></div>").addClass("toast-item-close").prependTo(d).html(g.closeText).click(function(){c().toastmessage("removeToast",d,g)
});
h=c("<div></div>").addClass("toast-item-image").addClass("toast-item-image-"+g.type).prependTo(d);
if(navigator.userAgent.match(/MSIE 6/i)){j.css({top:document.documentElement.scrollTop})
}if(!g.sticky){setTimeout(function(){c().toastmessage("removeToast",d,g)
},g.stayTime)
}return d
},showNoticeToast:function(e){var d={text:e,type:"notice"};
return c().toastmessage("showToast",d)
},showSuccessToast:function(e){var d={text:e,type:"success"};
return c().toastmessage("showToast",d)
},showErrorToast:function(e){var d={text:e,type:"error"};
return c().toastmessage("showToast",d)
},showWarningToast:function(e){var d={text:e,type:"warning"};
return c().toastmessage("showToast",d)
},removeToast:function(e,d){e.animate({opacity:"0"},600,function(){e.parent().animate({height:"0px"},300,function(){e.parent().remove()
})
});
if(d&&d.close!==null){d.close()
}}};
c.fn.toastmessage=function(d){if(a[d]){return a[d].apply(this,Array.prototype.slice.call(arguments,1))
}else{if(typeof d==="object"||!d){return a.init.apply(this,arguments)
}else{c.error("Method "+d+" does not exist on jQuery.toastmessage")
}}}
})(jQuery);
// Recufiguration
$().toastmessage({
    text     : '',
    sticky   : false,
    position : 'middle-center',
    type     : 'success'
});*/