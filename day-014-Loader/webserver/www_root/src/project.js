require=function t(e,s,n){function r(o,a){if(!s[o]){if(!e[o]){var c="function"==typeof require&&require;if(!a&&c)return c(o,!0);if(i)return i(o,!0);var u=new Error("Cannot find module '"+o+"'");throw u.code="MODULE_NOT_FOUND",u}var l=s[o]={exports:{}};e[o][0].call(l.exports,function(t){var s=e[o][1][t];return r(s||t)},l,l.exports,t,e,s,n)}return s[o].exports}for(var i="function"==typeof require&&require,o=0;o<n.length;o++)r(n[o]);return r}({game_scene:[function(t,e,s){"use strict";cc._RF.push(e,"bdbed3DvzRPy5X4D4+Aynyy","game_scene");var n=t("http");cc.Class({extends:cc.Component,properties:{is_debug:!1},onLoad:function(){this.disk=this.node.getChildByName("disk").getComponent("show_result_anim")},start:function(){},update:function(t){},on_start_lucky_action:function(){console.log("on_start_lucky_action called"),n.get("http://127.0.0.1:6080","/lucky","uname=blake&phone=13875556666",function(t,e){t?console.log("err!!!:",t):(console.log("#######",e),this.disk.start_lucky_draw(parseInt(e)))}.bind(this))}}),cc._RF.pop()},{http:"http"}],http:[function(t,e,s){"use strict";cc._RF.push(e,"12fccZ7ZetD8qyfarZqew1k","http");var n={get:function(t,e,s,n){var r=cc.loader.getXMLHttpRequest();r.timeout=5e3;var i=t+e;return s&&(i=i+"?"+s),r.open("GET",i,!0),cc.sys.isNative&&r.setRequestHeader("Accept-Encoding","gzip,deflate","text/html;charset=UTF-8"),r.onreadystatechange=function(){if(4===r.readyState&&r.status>=200&&r.status<300){console.log("http res("+r.responseText.length+"):"+r.responseText);try{var t=r.responseText;return void(null!==n&&n(null,t))}catch(t){n(t,null)}}else n(r.readyState+":"+r.status,null)},r.send(),r},post:function(t,e,s,n,r){var i=cc.loader.getXMLHttpRequest();i.timeout=5e3;var o=t+e;return s&&(o=o+"?"+s),i.open("POST",o,!0),cc.sys.isNative&&i.setRequestHeader("Accept-Encoding","gzip,deflate","text/html;charset=UTF-8"),n&&(i.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),i.setRequestHeader("Content-Length",n.length)),i.onreadystatechange=function(){if(4===i.readyState&&i.status>=200&&i.status<300)try{var t=i.responseText;return void(null!==r&&r(null,t))}catch(t){r(t,null)}else r(i.readyState+":"+i.status,null)},n&&i.send(n),i},download:function(t,e,s,n){var r=cc.loader.getXMLHttpRequest();r.timeout=5e3;var i=t+e;return s&&(i=i+"?"+s),r.responseType="arraybuffer",r.open("GET",i,!0),cc.sys.isNative&&r.setRequestHeader("Accept-Encoding","gzip,deflate","text/html;charset=UTF-8"),r.onreadystatechange=function(){if(4===r.readyState&&r.status>=200&&r.status<300){for(var t=r.response,e=new DataView(t),s=new Uint8Array(t.byteLength),i=0;i<s.length;i++)s[i]=e.getUint8(i);n(null,s)}else n(r.readyState+":"+r.status,null)},r.send(),r}};e.exports=n,cc._RF.pop()},{}],show_result_anim:[function(t,e,s){"use strict";cc._RF.push(e,"1d008/YoktIrJSUh0BSNn9r","show_result_anim"),cc.Class({extends:cc.Component,properties:{},onLoad:function(){this.started=!1,this.disk=this.node,this.v_speed=1e3,this.total_time=0,this.working_time=0},start_lucky_draw:function(t){this.started=!0;var e=[133.5,31.5,-71.5,-175,83,-20,-123],s=this.disk.rotation;s-=360*Math.floor(s/360),this.v_speed=1e3;var n=2160+e[t-1]-s;n+=30*Math.random()-15,this.working_time=0,this.total_time=2*n/this.v_speed,this.a_v=-this.v_speed/this.total_time},update:function(t){if(!(!1===this.started||this.working_time>=this.total_time)){this.working_time+=t,this.working_time>=this.total_time&&(t-=this.working_time-this.total_time,this.started=!1);var e=this.v_speed*t+this.a_v*t*t*.5;this.disk.rotation+=e,this.v_speed+=this.a_v*t}}}),cc._RF.pop()},{}]},{},["game_scene","http","show_result_anim"]);