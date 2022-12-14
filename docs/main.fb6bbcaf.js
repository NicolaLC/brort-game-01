// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/constants.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EGameResult = exports.DECK_CARDS = void 0;
var DECK_CARDS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "J", "Q", "K", "10"];
exports.DECK_CARDS = DECK_CARDS;
var EGameResult = {
  Win: 0,
  Lose: 1,
  Tie: 2
};
exports.EGameResult = EGameResult;
},{}],"js/game/graphics.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.showModal = exports.clear = exports.render = void 0;

var _logic = require("./logic");

var opponentSide = document.getElementById("opponent-side");
var opponentDeckCells = opponentSide.querySelectorAll(".deck-grid-cell");
var playerSide = document.getElementById("player-side");
var playerCardsCells = playerSide.querySelectorAll(".deck-grid-cell");
var playerDeckContainer = playerSide.querySelector(".player-deck");
var log = document.querySelector(".log");
var modal;

var render = function render() {
  renderOpponent();
  renderPlayer();
  log.innerHTML = _logic.playerTurn ? "Your turn! <span>Press <b>[SPACE]</b> to draw, <b>[ESC]</b> to exit.</span>" : "Opponent Turn!";
};

exports.render = render;

var clear = function clear() {
  opponentDeckCells.forEach(function (element) {
    element.innerHTML = "";
  });
  playerCardsCells.forEach(function (element) {
    element.innerHTML = "";
  });
  playerDeckContainer.innerHTML = "";

  if (modal != null) {
    modal.close();
  }

  log.innerHTML = "";
};

exports.clear = clear;

var renderOpponent = function renderOpponent() {
  _logic.opponentCards.forEach(function (card, index) {
    opponentDeckCells[index].innerHTML = "<div class=\"card\">".concat(card, "</div>");
  });
};

var renderPlayer = function renderPlayer() {
  _logic.playerCards.forEach(function (card, index) {
    playerCardsCells[index].innerHTML = "<div class=\"card\">".concat(card, "</div>");
  });

  var result = "";

  _logic.playerDeck.forEach(function (card) {
    var bUsed = _logic.playerCards.indexOf(card) > -1;
    result += "<div class=\"card ".concat(bUsed ? "used" : "", "\">").concat(card, "</div>");
  });

  playerDeckContainer.innerHTML = result;
};

var showModal = function showModal(title, content, proceedLabel, cancelLabel, onProceed, onCancel) {
  var html = "\n\t\t\t<div class=\"dialog-title\">\n\t\t\t\t".concat(title, "\n\t\t\t</div>\n\t\t\t<div class=\"dialog-content\">\n\t\t\t\t").concat(content, "\n\t\t\t</div>\n\t\t\t<div class=\"dialog-actions\">\n\t\t\t</div>\n\t\t");

  if (modal == null) {
    var newModal = document.createElement("dialog");
    newModal.classList.add("modal");
    newModal.innerHTML = html;
    modal = document.body.appendChild(newModal);
  } else {
    modal.innerHTML = html;
  }

  var actions = modal.querySelector(".dialog-actions");

  if (cancelLabel) {
    var cancelButton = document.createElement("button");
    cancelButton.innerHTML = cancelLabel;
    cancelButton.addEventListener("click", function () {
      modal.close();

      if (onCancel) {
        onCancel();
      }
    });
    actions.appendChild(cancelButton);
  }

  var proceedButton = document.createElement("button");
  proceedButton.innerHTML = proceedLabel;
  proceedButton.addEventListener("click", function () {
    modal.close();

    if (onProceed) {
      onProceed();
    }
  });
  actions.appendChild(proceedButton);
  modal.showModal();
};

exports.showModal = showModal;
},{"./logic":"js/game/logic.js"}],"js/game/logic.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.playerTurn = exports.playerDeck = exports.opponentCards = exports.playerCards = exports.intro = void 0;

var _constants = require("../constants");

var _graphics = require("./graphics");

var consoleContainer = document.getElementById('console');
var playerDeck = [];
exports.playerDeck = playerDeck;
var playerCards = [];
exports.playerCards = playerCards;
var opponentDeck = [];
var opponentCards = [];
exports.opponentCards = opponentCards;
var playerWins = 0;
var opponentWins = 0;
var currentLevel = 1;
var maxLevel = 21;
var playerTurn = true;
exports.playerTurn = playerTurn;

var writeToConsole = function writeToConsole(message) {
  consoleContainer.innerHTML += "".concat(message ? message : "", "</br>");
  (0, _graphics.render)();
};

var clearConsole = function clearConsole() {
  consoleContainer.innerHTML = "";
  (0, _graphics.clear)();
};

var intro = function intro() {
  clearConsole();
  startGame();
};

exports.intro = intro;

var getScore = function getScore(deck) {
  var result = 0;
  deck.forEach(function (card) {
    var cardScore = card.getScore();

    if (cardScore === 11 && result + cardScore > 21) {
      cardScore = 1;
    }

    result += cardScore;
  });
  return result;
};

var getRandomDeck = function getRandomDeck() {
  var deck = [];

  while (deck.length < 3) {
    deck.push(getRandomCard(deck, _constants.DECK_CARDS));
  }

  return deck;
};

var getStarterDeck = function getStarterDeck() {
  var deck = getRandomDeck(playerCards);

  if (getScore(deck) !== 21) {
    return getStarterDeck();
  }

  playerCards.push(deck.random());
  playerCards.push(getRandomCardFromDeck(deck, playerCards));
  return deck;
};

var getRandomCard = function getRandomCard(deck, cards) {
  if (deck.length === 0) {
    return _constants.DECK_CARDS.random();
  }

  var availableCards = cards.filter(function (c) {
    return deck.indexOf(c) < 0;
  });

  if (availableCards.length === 0) {
    availableCards = _constants.DECK_CARDS;
  }

  return availableCards.random();
};

var getRandomCardFromDeck = function getRandomCardFromDeck(deck, cards) {
  if (deck.length === 0) {
    return _constants.DECK_CARDS.random();
  }

  var availableCards = deck.filter(function (c) {
    return cards.indexOf(c) < 0;
  });

  if (availableCards.length === 0) {
    availableCards = _constants.DECK_CARDS;
  }

  return availableCards.random();
};

var waitForPlayerActions = function waitForPlayerActions() {
  exports.playerTurn = playerTurn = true;

  var onKeyHandler = function onKeyHandler(e) {
    if (e.keyCode === 32) {
      e.preventDefault();
      e.stopImmediatePropagation();
      document.removeEventListener('keydown', onKeyHandler);
      clearConsole();
      exports.playerTurn = playerTurn = false;
      drawAnotherCard();
    }

    if (e.keyCode === 27) {
      e.preventDefault();
      e.stopImmediatePropagation();
      document.removeEventListener('keydown', onKeyHandler);
      clearConsole();
      exports.playerTurn = playerTurn = false;
      stopDrawing();
    }
  };

  document.addEventListener('keydown', onKeyHandler);
};

var drawGameBoard = function drawGameBoard() {
  var bProceed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  clearConsole();
  writeToConsole("<h1>Level ".concat(currentLevel, " of ").concat(maxLevel, "</h1>"));
  writeToConsole();
  writeToConsole("<h2>Player: ".concat(playerWins, " Opponent: ").concat(opponentWins, "</h2>"));
  writeToConsole();
  writeToConsole("<b class=\"player-log\">Your deck</b>: ".concat(playerDeck.join(", ")));
  writeToConsole();
  writeToConsole("<b class=\"player-log\">Your cards</b>: ".concat(playerCards.join(", ")));
  writeToConsole("<b class=\"player-log\">Your score</b>: ".concat(getScore(playerCards)));
  writeToConsole();
  writeToConsole("<b class=\"opponent-log\">Opponent cards</b>: ".concat(opponentCards.join(", ")));
  writeToConsole("<b class=\"opponent-log\">Opponent score</b>: ".concat(getScore(opponentCards)));
  writeToConsole();
};

var startGame = function startGame() {
  exports.playerDeck = playerDeck = getStarterDeck();
  opponentDeck = getRandomDeck();
  exports.opponentCards = opponentCards = [opponentDeck.random()];
  waitForPlayerActions();
  drawGameBoard();
};

var drawAnotherCard = function drawAnotherCard() {
  if (playerCards.length === playerDeck.length || playerCards.length >= 5) {
    stopDrawing();
    return;
  }

  playerCards.push(getRandomCardFromDeck(playerDeck, playerCards));

  if (playerCards.length === 1) {
    playerCards.push(getRandomCardFromDeck(playerDeck, playerCards));
  }

  drawGameBoard();
  setTimeout(function () {
    opponentCards.push(_constants.DECK_CARDS.random());
    waitForPlayerActions();
    drawGameBoard();
  }, 2000);
};

var clearCards = function clearCards() {
  exports.playerCards = playerCards = [];
  exports.opponentCards = opponentCards = [];
};

var stopDrawing = function stopDrawing() {
  while (opponentCards.length < playerCards.length) {
    opponentCards.push(_constants.DECK_CARDS.random());
  }

  drawGameBoard(false);
  setTimeout(function () {
    var playerScore = getScore(playerCards);
    var opponentScore = getScore(opponentCards);
    clearCards();
    var gameResult = _constants.EGameResult.Tie;

    if (playerScore !== opponentScore) {
      if (playerScore === 21) {
        gameResult = _constants.EGameResult.Win;
      } else if (playerScore < 21) {
        if (opponentScore < playerScore) {
          gameResult = _constants.EGameResult.Win;
        } else if (opponentScore < 21) {
          gameResult = _constants.EGameResult.Lose;
        } else {
          gameResult = _constants.EGameResult.Win;
        }
      } else {
        if (opponentScore > playerScore) {
          gameResult = _constants.EGameResult.Win;
        } else {
          // playerScore > opponentScore || opponentScore <= 21
          gameResult = _constants.EGameResult.Lose;
        }
      }
    }

    var modalContent = "";

    switch (gameResult) {
      case _constants.EGameResult.Win:
        playerWins++;
        modalContent = "You Win!";
        break;

      case _constants.EGameResult.Lose:
        opponentWins++;
        modalContent = "You Lose!";
        break;

      case _constants.EGameResult.Tie:
        modalContent = "Tie!";
        break;
    }

    (0, _graphics.showModal)("Turn ended.", modalContent, "[<b>SPACEBAR</b>] continue.", "", function () {
      if (playerWins < 2 && opponentWins < 2) {
        clearConsole();
        drawAnotherCard();
      } else {
        turnEnded();
      }
    });
  }, 2000);
};

var turnEnded = function turnEnded() {
  if (playerWins === 2) {
    newLevel();
  } else {
    window.location.reload();
  }
};

var newLevel = function newLevel() {
  currentLevel++;

  if (currentLevel > maxLevel) {
    if (confirm("E bravo nabbetto, ce l'hai fatta hai vinto!")) {
      window.location.reload();
    } else {
      window.location.reload();
    }
  } else {
    playerWins = 0;
    opponentWins = 0;
    clearConsole();
    chooseRandomCard();
  }
};

var chooseRandomCard = function chooseRandomCard() {
  var cards = [_constants.DECK_CARDS.random(), _constants.DECK_CARDS.random()];
  (0, _graphics.showModal)("Choose a new card.", "Choose a card to add to your deck:", "[2] <b>".concat(cards[1], "</b>"), "[1] <b>".concat(cards[0], "</b>"), function () {
    playerDeck.push(cards[1]);
    clearConsole();
    drawAnotherCard();
  }, function () {
    playerDeck.push(cards[0]);
    clearConsole();
    drawAnotherCard();
  });

  var onKeyHandler = function onKeyHandler(e) {
    if (e.keyCode === 49) {
      document.removeEventListener('keydown', onKeyHandler);
      playerDeck.push(cards[0]);
      clearConsole();
      drawAnotherCard();
    }

    if (e.keyCode === 50) {
      document.removeEventListener('keydown', onKeyHandler);
      playerDeck.push(cards[1]);
      clearConsole();
      drawAnotherCard();
    }
  };

  document.addEventListener('keydown', onKeyHandler);
};
},{"../constants":"js/constants.js","./graphics":"js/game/graphics.js"}],"js/main.js":[function(require,module,exports) {
"use strict";

var _logic = require("./game/logic");

(function () {
  (0, _logic.intro)();
})();
},{"./game/logic":"js/game/logic.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "65408" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ??? Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] ????  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">????</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/main.js"], null)
//# sourceMappingURL=/main.fb6bbcaf.js.map