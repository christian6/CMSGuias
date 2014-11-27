// @preserve jQuery.floatThead 1.2.9dev - http://mkoryak.github.io/floatThead/ - Copyright (c) 2012 - 2014 Misha Koryak
// @license MIT
!function(a){function b(a,b,c){if(8==g){var d=j.width(),e=f.debounce(function(){var a=j.width();d!=a&&(d=a,c())},a);j.on(b,e)}else j.on(b,f.debounce(c,a))}function c(a){window.console&&window.console&&window.console.log&&window.console.log(a)}function d(){var b=a('<div style="width:50px;height:50px;overflow-y:scroll;position:absolute;top:-200px;left:-200px;"><div style="height:100px;width:100%"></div>');a("body").append(b);var c=b.innerWidth(),d=a("div",b).innerWidth();return b.remove(),c-d}function e(a){if(a.dataTableSettings)for(var b=0;b<a.dataTableSettings.length;b++){var c=a.dataTableSettings[b].nTable;if(a[0]==c)return!0}return!1}a.floatThead=a.floatThead||{},a.floatThead.defaults={cellTag:null,headerCellSelector:"tr:first>th:visible",zIndex:1001,debounceResizeMs:10,useAbsolutePositioning:!0,scrollingTop:0,scrollingBottom:0,scrollContainer:function(){return a([])},getSizingRow:function(a){return a.find("tbody tr:visible:first>*:visible")},floatTableClass:"floatThead-table",floatWrapperClass:"floatThead-wrapper",floatContainerClass:"floatThead-container",copyTableClass:!0,debug:!1};var f=window._,g=function(){for(var a=3,b=document.createElement("b"),c=b.all||[];a=1+a,b.innerHTML="<!--[if gt IE "+a+"]><i><![endif]-->",c[0];);return a>4?a:document.documentMode}(),h=null,i=function(){if(g)return!1;var b=a("<table><colgroup><col></colgroup><tbody><tr><td style='width:10px'></td></tbody></table>");a("body").append(b);var c=b.find("col").width();return b.remove(),0==c},j=a(window);a.fn.floatThead=function(k){if(k=k||{},!f&&(f=window._||a.floatThead._,!f))throw new Error("jquery.floatThead-slim.js requires underscore. You should use the non-lite version since you do not have underscore.");if(8>g)return this;if(null==h&&(h=i(),h&&(document.createElement("fthtr"),document.createElement("fthtd"),document.createElement("fthfoot"))),f.isString(k)){var l=k,m=this;return this.filter("table").each(function(){var b=a(this).data("floatThead-attached");if(b&&f.isFunction(b[l])){var c=b[l]();"undefined"!=typeof c&&(m=c)}}),m}var n=a.extend({},a.floatThead.defaults||{},k);return a.each(k,function(b){b in a.floatThead.defaults||!n.debug||c("jQuery.floatThead: used ["+b+"] key to init plugin, but that param is not an option for the plugin. Valid options are: "+f.keys(a.floatThead.defaults).join(", "))}),this.filter(":not(."+n.floatTableClass+")").each(function(){function c(a){return a+".fth-"+x+".floatTHead"}function i(){var b=0;z.find("tr:visible").each(function(){b+=a(this).outerHeight(!0)}),Z.outerHeight(b),$.outerHeight(b)}function k(){var a=y.outerWidth(),b=H.width()||a,c="hidden"!=H.css("overflow-y")?b-E.vertical:b;if(W.width(c),N){var d=100*a/c;R.css("width",d+"%")}else R.outerWidth(a)}function l(){B=(f.isFunction(n.scrollingTop)?n.scrollingTop(y):n.scrollingTop)||0,C=(f.isFunction(n.scrollingBottom)?n.scrollingBottom(y):n.scrollingBottom)||0}function m(){var b,c;if(U)b=T.find("col").length;else{var d;if(d=null==n.cellTag&&n.headerCellSelector?n.headerCellSelector:"tr:first>"+n.cellTag,f.isNumber(d))return d;c=z.find(d),b=0,c.each(function(){b+=parseInt(a(this).attr("colspan")||1,10)})}if(b!=G){G=b;for(var e,g=[],i=[],j=[],k=0;b>k;k++)g.push((e=c.eq(k).text())?'<th scope="col" class="floatThead-col">'+e+"</th>":'<th class="floatThead-col"/>'),i.push("<col/>"),j.push("<fthtd style='display:table-cell;height:0;width:auto;'/>");i=i.join(""),g=g.join(""),h&&(j=j.join(""),V.html(j),bb=V.find("fthtd")),Z.html(g),$=Z.find("th"),U||T.html(i),_=T.find("col"),S.html(i),ab=S.find("col")}return b}function o(){if(!D){if(D=!0,I){var a=y.width(),b=P.width();a>b&&y.css("minWidth",a)}y.css(eb),R.css(eb),R.append(z),A.before(Y),i()}}function p(){D&&(D=!1,I&&y.width(gb),Y.detach(),y.prepend(z),y.css(fb),R.css(fb),y.css("minWidth",hb),y.css("minWidth",y.width()))}function q(a){I!=a&&(I=a,W.css({position:I?"absolute":"fixed"}))}function r(a,b,c,d){return h?c:d?n.getSizingRow(a,b,c):b}function s(){var a,b=m();return function(){var c=r(y,_,bb,g);if(c.length==b&&b>0){if(!U)for(a=0;b>a;a++)_.eq(a).css("width","");p();var d=[];for(a=0;b>a;a++)d[a]=c.get(a).offsetWidth;for(a=0;b>a;a++)ab.eq(a).width(d[a]),_.eq(a).width(d[a]);o()}else R.append(z),y.css(fb),R.css(fb),i()}}function t(a){var b=H.css("border-"+a+"-width"),c=0;return b&&~b.indexOf("px")&&(c=parseInt(b,10)),c}function u(){var a,b=H.scrollTop(),c=0,d=K?J.outerHeight(!0):0,e=L?d:-d,f=W.height(),g=y.offset(),i=0;if(N){var k=H.offset();c=g.top-k.top+b,K&&L&&(c+=d),c-=t("top"),i=t("left")}else a=g.top-B-f+C+E.horizontal;var l=j.scrollTop(),m=j.scrollLeft(),n=H.scrollLeft();return b=H.scrollTop(),function(k){var r=y[0].offsetWidth<=0&&y[0].offsetHeight<=0;if(!r&&X)return X=!1,setTimeout(function(){y.trigger("reflow")},1),null;if(r&&(X=!0,!I))return null;if("windowScroll"==k?(l=j.scrollTop(),m=j.scrollLeft()):"containerScroll"==k?(b=H.scrollTop(),n=H.scrollLeft()):"init"!=k&&(l=j.scrollTop(),m=j.scrollLeft(),b=H.scrollTop(),n=H.scrollLeft()),!h||!(0>l||0>m)){if(Q)q("windowScrollDone"==k?!0:!1);else if("windowScrollDone"==k)return null;g=y.offset(),K&&L&&(g.top+=d);var s,t,u=y.outerHeight();if(N&&I){if(c>=b){var v=c-b;s=v>0?v:0}else s=O?0:b;t=i}else!N&&I?(l>a+u+e?s=u-f+e:g.top>l+B?(s=0,p()):(s=B+l-g.top+c+(L?d:0),o()),t=0):N&&!I?(c>b||b-c>u?(s=g.top-l,p()):(s=g.top+b-l-c,o()),t=g.left+n-m):N||I||(l>a+u+e?s=u+B-l+a+e:g.top>l+B?(s=g.top-l,o()):s=B,t=g.left-m);return{top:s,left:t}}}}function v(){var a=null,b=null,c=null;return function(d,e,f){null==d||a==d.top&&b==d.left||(W.css({top:d.top,left:d.left}),a=d.top,b=d.left),e&&k(),f&&i();var g=H.scrollLeft();I&&c==g||(W.scrollLeft(g),c=g)}}function w(){if(H.length){var a=H.width(),b=H.height(),c=y.height(),d=y.width(),e=d>a?F:0,f=c>b?F:0;E.horizontal=d>a-f?F:0,E.vertical=c>b-e?F:0}}var x=f.uniqueId(),y=a(this);if(y.data("floatThead-attached"))return!0;if(!y.is("table"))throw new Error('jQuery.floatThead must be run on a table element. ex: $("table").floatThead();');var z=y.find("thead:first"),A=y.find("tbody:first");if(0==z.length)throw new Error("jQuery.floatThead must be run on a table that contains a <thead> element");var B,C,D=!1,E={vertical:0,horizontal:0},F=d(),G=0,H=n.scrollContainer(y)||a([]),I=n.useAbsolutePositioning;null==I&&(I=n.scrollContainer(y).length),I||(D=!0);var J=y.find("caption"),K=1==J.length;if(K)var L="top"===(J.css("caption-side")||J.attr("align")||"top");var M=a('<fthfoot style="display:table-footer-group;border-spacing:0;height:0;border-collapse:collapse;"/>'),N=H.length>0,O=!1,P=a([]),Q=9>=g&&!N&&I,R=a("<table/>"),S=a("<colgroup/>"),T=y.find("colgroup:first"),U=!0;0==T.length&&(T=a("<colgroup/>"),U=!1);var V=a('<fthrow style="display:table-row;border-spacing:0;height:0;border-collapse:collapse"/>'),W=a('<div style="overflow: hidden;"></div>'),X=!1,Y=a("<thead/>"),Z=a('<tr class="size-row"/>'),$=a([]),_=a([]),ab=a([]),bb=a([]);Y.append(Z),y.prepend(T),h&&(M.append(V),y.append(M)),R.append(S),W.append(R),n.copyTableClass&&R.attr("class",y.attr("class")),R.attr({cellpadding:y.attr("cellpadding"),cellspacing:y.attr("cellspacing"),border:y.attr("border")});var cb=y.css("display");if(R.css({borderCollapse:y.css("borderCollapse"),border:y.css("border"),display:cb}),"none"==cb&&(X=!0),R.addClass(n.floatTableClass).css("margin",0),I){var db=function(a,b){var c=a.css("position"),d="relative"==c||"absolute"==c;if(!d||b){var e={paddingLeft:a.css("paddingLeft"),paddingRight:a.css("paddingRight")};W.css(e),a=a.wrap("<div class='"+n.floatWrapperClass+"' style='position: relative; clear:both;'></div>").parent(),O=!0}return a};N?(P=db(H,!0),P.append(W)):(P=db(y),y.after(W))}else y.after(W);W.css({position:I?"absolute":"fixed",marginTop:0,top:I?0:"auto",zIndex:n.zIndex}),W.addClass(n.floatContainerClass),l();var eb={"table-layout":"fixed"},fb={"table-layout":y.css("tableLayout")||"auto"},gb=y[0].style.width||"",hb=y.css("minWidth")||"";w();var ib,jb=function(){(ib=s())()};jb();var kb=u(),lb=v();lb(kb("init"),!0);var mb=f.debounce(function(){lb(kb("windowScrollDone"),!1)},300),nb=function(){lb(kb("windowScroll"),!1),mb()},ob=function(){lb(kb("containerScroll"),!1)},pb=function(){l(),w(),jb(),kb=u(),(lb=v())(kb("resize"),!0,!0)},qb=f.debounce(function(){w(),l(),jb(),kb=u(),lb(kb("reflow"),!0)},1);N?I?H.on(c("scroll"),ob):(H.on(c("scroll"),ob),j.on(c("scroll"),nb)):j.on(c("scroll"),nb),j.on(c("load"),qb),b(n.debounceResizeMs,c("resize"),pb),y.on("reflow",qb),e(y)&&y.on("filter",qb).on("sort",qb).on("page",qb),y.data("floatThead-attached",{destroy:function(){var a=".fth-"+x;p(),y.css(fb),T.remove(),h&&M.remove(),Y.parent().length&&Y.replaceWith(z),y.off("reflow"),H.off(a),O&&(H.length?H.unwrap():y.unwrap()),y.css("minWidth",hb),W.remove(),y.data("floatThead-attached",!1),j.off(a)},reflow:function(){qb()},setHeaderHeight:function(){i()},getFloatContainer:function(){return W},getRowGroups:function(){return D?W.find("thead").add(y.find("tbody,tfoot")):y.find("thead,tbody,tfoot")}})}),this}}(jQuery),function(a){a.floatThead=a.floatThead||{},a.floatThead._=window._||function(){var b={},c=Object.prototype.hasOwnProperty,d=["Arguments","Function","String","Number","Date","RegExp"];b.has=function(a,b){return c.call(a,b)},b.keys=function(a){if(a!==Object(a))throw new TypeError("Invalid object");var c=[];for(var d in a)b.has(a,d)&&c.push(d);return c};var e=0;return b.uniqueId=function(a){var b=++e+"";return a?a+b:b},a.each(d,function(){var a=this;b["is"+a]=function(b){return Object.prototype.toString.call(b)=="[object "+a+"]"}}),b.debounce=function(a,b,c){var d,e,f,g,h;return function(){f=this,e=arguments,g=new Date;var i=function(){var j=new Date-g;b>j?d=setTimeout(i,b-j):(d=null,c||(h=a.apply(f,e)))},j=c&&!d;return d||(d=setTimeout(i,b)),j&&(h=a.apply(f,e)),h}},b}()}(jQuery);