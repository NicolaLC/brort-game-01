parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"MuPq":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.EGameResult=exports.DECK_CARDS=void 0;var e=["A","2","3","4","5","6","7","8","9","J","Q","K","10"];exports.DECK_CARDS=e;var s={Win:0,Lose:1,Tie:2};exports.EGameResult=s;
},{}],"d6sW":[function(require,module,exports) {
"use strict";var e=require("./constants"),n=document.getElementById("console"),o=[],t=[],r=[],c=[],a=0,s=0,i=1,d=21,u=function(e){n.innerHTML+="".concat(e||"","</br>")},l=function(){n.innerHTML=""},m=function(){u("<b>Welcome player</b>"),u(),u("Press <b>[SPACEBAR]</b> to start a new game...");document.addEventListener("keydown",function e(n){32===n.keyCode&&(document.removeEventListener("keydown",e),l(),y())})},b=function(e){var n=0;return e.forEach(function(e){var o=e.getScore();11===o&&n+o>21&&(o=1),n+=o}),n},E=function(){for(var n=[];n.length<3;)n.push(f(n,e.DECK_CARDS));return n},v=function e(){var n=E(t);return 21!==b(n)?e():(t.push(n.random()),n)},f=function(n,o){if(0===n.length)return e.DECK_CARDS.random();var t=n.filter(function(e){return o.indexOf(e)<0});return 0===t.length&&(t=e.DECK_CARDS),t.random()},h=function(){var e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0];if(l(),u("<h1>Level ".concat(i," of ").concat(d,"</h1>")),u(),u("<h2>Player: ".concat(a," Opponent: ").concat(s,"</h2>")),u(),u('<b class="player-log">Your deck</b>: '.concat(o.join(", "))),u(),u('<b class="player-log">Your cards</b>: '.concat(t.join(", "))),u('<b class="player-log">Your score</b>: '.concat(b(t))),u(),u('<b class="opponent-log">Opponent cards</b>: '.concat(c.join(", "))),u('<b class="opponent-log">Opponent score</b>: '.concat(b(c))),u(),e){u("Press <b>[SPACEBAR]</b> to draw, or <b>[ESC]</b> to stop.");document.addEventListener("keydown",function e(n){32===n.keyCode&&(document.removeEventListener("keydown",e),l(),C()),27===n.keyCode&&(document.removeEventListener("keydown",e),l(),k())})}},y=function(){o=v(),r=E(),c=[r.random()],h()},C=function(){t.length===o.length||t.length>=5?k():(t.push(f(o,t)),c.push(e.DECK_CARDS.random()),h())},p=function(){t=[],c=[]},k=function(){c.length<r.length&&c.push(r.random()),h(!1);var n=b(t),o=b(c);p();var i=e.EGameResult.Tie;switch(n!==o&&(i=21===n?e.EGameResult.Win:n<21?o<n?e.EGameResult.Win:o<21?e.EGameResult.Lose:e.EGameResult.Win:o>n?e.EGameResult.Win:e.EGameResult.Lose),i){case e.EGameResult.Win:a++,u("<b>Player Wins</b>");break;case e.EGameResult.Lose:s++,u("<b>Opponent Wins</b>");break;case e.EGameResult.Tie:u("<b>Tie</b>")}if(a<2&&s<2){u("Press <b>[SPACEBAR]</b> to proceed.");document.addEventListener("keydown",function e(n){32===n.keyCode&&(document.removeEventListener("keydown",e),l(),C())})}else R()},R=function(){2===a?(u("Congratulations, you win this match!"),u("Press <b>[SPACEBAR]</b> to proceed.")):(u("Oh no, you lose this match!"),u("Press <b>[SPACEBAR]</b> to restart."));document.addEventListener("keydown",function e(n){32===n.keyCode&&(document.removeEventListener("keydown",e),2===a?w():window.location.reload())})},w=function(){++i>d?(confirm("E bravo nabbetto, ce l'hai fatta hai vinto!"),window.location.reload()):(a=0,s=0,l(),g())},g=function(){var n=[e.DECK_CARDS.random(),e.DECK_CARDS.random()];u("Choose a card to add to your deck: <b>[1] ".concat(n[0],"</b> <b>[2] ").concat(n[1],"</b>"));document.addEventListener("keydown",function e(t){49===t.keyCode&&(document.removeEventListener("keydown",e),o.push(n[0]),l(),C()),50===t.keyCode&&(document.removeEventListener("keydown",e),o.push(n[1]),l(),C())})};m();
},{"./constants":"MuPq"}]},{},["d6sW"], null)
//# sourceMappingURL=/main.cd1cc2d7.js.map