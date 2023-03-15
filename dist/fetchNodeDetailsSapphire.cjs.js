/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
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
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "TORUS_NETWORK": () => (/* reexport */ TORUS_NETWORK),
  "default": () => (/* reexport */ nodeDetailManager)
});

;// CONCATENATED MODULE: ./src/interfaces.ts
var TORUS_NETWORK = {
  DEVNET: "devnet",
  TESTNET: "testnet",
  MAINNET: "mainnet"
};
;// CONCATENATED MODULE: external "@babel/runtime/helpers/asyncToGenerator"
const asyncToGenerator_namespaceObject = require("@babel/runtime/helpers/asyncToGenerator");
var asyncToGenerator_default = /*#__PURE__*/__webpack_require__.n(asyncToGenerator_namespaceObject);
;// CONCATENATED MODULE: external "@babel/runtime/helpers/classCallCheck"
const classCallCheck_namespaceObject = require("@babel/runtime/helpers/classCallCheck");
var classCallCheck_default = /*#__PURE__*/__webpack_require__.n(classCallCheck_namespaceObject);
;// CONCATENATED MODULE: external "@babel/runtime/helpers/createClass"
const createClass_namespaceObject = require("@babel/runtime/helpers/createClass");
var createClass_default = /*#__PURE__*/__webpack_require__.n(createClass_namespaceObject);
;// CONCATENATED MODULE: external "@babel/runtime/helpers/defineProperty"
const defineProperty_namespaceObject = require("@babel/runtime/helpers/defineProperty");
var defineProperty_default = /*#__PURE__*/__webpack_require__.n(defineProperty_namespaceObject);
;// CONCATENATED MODULE: external "@babel/runtime/regenerator"
const regenerator_namespaceObject = require("@babel/runtime/regenerator");
var regenerator_default = /*#__PURE__*/__webpack_require__.n(regenerator_namespaceObject);
;// CONCATENATED MODULE: external "@toruslabs/http-helpers"
const http_helpers_namespaceObject = require("@toruslabs/http-helpers");
;// CONCATENATED MODULE: external "json-stable-stringify"
const external_json_stable_stringify_namespaceObject = require("json-stable-stringify");
var external_json_stable_stringify_default = /*#__PURE__*/__webpack_require__.n(external_json_stable_stringify_namespaceObject);
;// CONCATENATED MODULE: external "loglevel"
const external_loglevel_namespaceObject = require("loglevel");
var external_loglevel_default = /*#__PURE__*/__webpack_require__.n(external_loglevel_namespaceObject);
;// CONCATENATED MODULE: external "web3-utils"
const external_web3_utils_namespaceObject = require("web3-utils");
;// CONCATENATED MODULE: ./src/constants.ts

var _NETWORK_URLS;

var NETWORK_URLS = (_NETWORK_URLS = {}, defineProperty_default()(_NETWORK_URLS, TORUS_NETWORK.DEVNET, ["https://sapphire-dev-2-1.authnetwork.dev", "https://sapphire-dev-2-2.authnetwork.dev", "https://sapphire-dev-2-3.authnetwork.dev", "https://sapphire-dev-2-4.authnetwork.dev", "https://sapphire-dev-2-5.authnetwork.dev"]), defineProperty_default()(_NETWORK_URLS, TORUS_NETWORK.TESTNET, ["https://lrc1.authnetwork.dev", "https://lrc2.authnetwork.dev", "https://lrc3.authnetwork.dev", "https://lrc4.authnetwork.dev", "https://lrc5.authnetwork.dev"]), _NETWORK_URLS);
;// CONCATENATED MODULE: ./src/utils.ts

var thresholdSame = function thresholdSame(arr, t) {
  var hashMap = {};
  for (var i = 0; i < arr.length; i += 1) {
    var str = external_json_stable_stringify_default()(arr[i]);
    hashMap[str] = hashMap[str] ? hashMap[str] + 1 : 1;
    if (hashMap[str] === t) {
      return arr[i];
    }
  }
  return undefined;
};
;// CONCATENATED MODULE: ./src/nodeDetailManager.ts












var NodeDetailManager = /*#__PURE__*/function () {
  function NodeDetailManager() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$network = _ref.network,
      network = _ref$network === void 0 ? TORUS_NETWORK.DEVNET : _ref$network;
    classCallCheck_default()(this, NodeDetailManager);
    defineProperty_default()(this, "_torusNodeBaseEndpoints", []);
    defineProperty_default()(this, "_torusNodeRSSEndpoints", []);
    defineProperty_default()(this, "_torusNodeSSSEndpoints", []);
    defineProperty_default()(this, "_torusNodeTSSEndpoints", []);
    defineProperty_default()(this, "_torusNodePub", []);
    defineProperty_default()(this, "_torusIndexes", []);
    defineProperty_default()(this, "updated", void 0);
    defineProperty_default()(this, "network", void 0);
    this.network = network;
    this.updated = false;
  }
  createClass_default()(NodeDetailManager, [{
    key: "_nodeDetails",
    get: function get() {
      return {
        torusNodeBaseEndpoints: this._torusNodeBaseEndpoints,
        torusNodeSSSEndpoints: this._torusNodeSSSEndpoints,
        torusNodeRSSEndpoints: this._torusNodeRSSEndpoints,
        torusNodeTSSEndpoints: this._torusNodeTSSEndpoints,
        torusNodePub: this._torusNodePub,
        torusIndexes: this._torusIndexes,
        updated: this.updated
      };
    }
  }, {
    key: "getNodeDetails",
    value: function () {
      var _getNodeDetails = asyncToGenerator_default()( /*#__PURE__*/regenerator_default().mark(function _callee() {
        var endPoints, lookupPromises, lookupResponses, threholdNodes, parsedNodes, updatedBaseEndpoints, updatedSSSEndpoints, updatedRSSEndpoints, updatedTSSEndpoints, updatedNodePub, indexes, index, endpoint, nodeInfo, pubKx, pubKy;
        return regenerator_default().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                if (!this.updated) {
                  _context.next = 3;
                  break;
                }
                return _context.abrupt("return", this._nodeDetails);
              case 3:
                endPoints = NETWORK_URLS[this.network];
                lookupPromises = endPoints.map(function (x) {
                  return (0,http_helpers_namespaceObject.post)(x, (0,http_helpers_namespaceObject.generateJsonRPCObject)("NodeDetailsRequest", {})).catch(function (err) {
                    return external_loglevel_default().error("node lookup request failed", err);
                  });
                });
                _context.next = 7;
                return Promise.all(lookupPromises);
              case 7:
                lookupResponses = _context.sent;
                threholdNodes = thresholdSame(lookupResponses.map(function (resp) {
                  return external_json_stable_stringify_default()(resp.result);
                }), ~~(endPoints.length / 2) + 1);
                if (threholdNodes) {
                  _context.next = 11;
                  break;
                }
                throw new Error("Unable to reach threshold for node lookups");
              case 11:
                parsedNodes = JSON.parse(threholdNodes || "[]");
                if (!(parsedNodes.length !== endPoints.length)) {
                  _context.next = 14;
                  break;
                }
                throw new Error("Unable to fetch info for required nodes, required: ".concat(endPoints.length, ", found: ").concat(parsedNodes.length));
              case 14:
                updatedBaseEndpoints = [];
                updatedSSSEndpoints = [];
                updatedRSSEndpoints = [];
                updatedTSSEndpoints = [];
                updatedNodePub = [];
                indexes = []; // nodes returns node list in sorted order of node indexes
                // currently node indexes are sorted in the order of endpoints.
                // so looping over endpoints is fine.
                for (index = 0; index < endPoints.length; index += 1) {
                  endpoint = endPoints[index];
                  nodeInfo = parsedNodes[index];
                  pubKx = nodeInfo.public_key.X;
                  pubKy = nodeInfo.public_key.Y;
                  indexes.push(parseInt(nodeInfo.node_index, 10));
                  updatedBaseEndpoints.push(endpoint);
                  updatedSSSEndpoints.push("".concat(endpoint, "/sss/jrpc"));
                  updatedRSSEndpoints.push("".concat(endpoint, "/rss"));
                  updatedTSSEndpoints.push("".concat(endpoint, "/tss"));
                  updatedNodePub.push({
                    X: (0,external_web3_utils_namespaceObject.toHex)(pubKx).replace("0x", ""),
                    Y: (0,external_web3_utils_namespaceObject.toHex)(pubKy).replace("0x", "")
                  });
                }
                this._torusNodeBaseEndpoints = updatedBaseEndpoints;
                this._torusNodeSSSEndpoints = updatedSSSEndpoints;
                this._torusNodeRSSEndpoints = updatedRSSEndpoints;
                this._torusNodeTSSEndpoints = updatedTSSEndpoints;
                this._torusNodePub = updatedNodePub;
                this._torusIndexes = indexes;
                this.updated = true;
                return _context.abrupt("return", this._nodeDetails);
              case 31:
                _context.prev = 31;
                _context.t0 = _context["catch"](0);
                if (!(this.network === TORUS_NETWORK.DEVNET)) {
                  _context.next = 35;
                  break;
                }
                return _context.abrupt("return", NodeDetailManager.NODE_DETAILS_DEVNET);
              case 35:
                throw _context.t0;
              case 36:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 31]]);
      }));
      function getNodeDetails() {
        return _getNodeDetails.apply(this, arguments);
      }
      return getNodeDetails;
    }()
  }]);
  return NodeDetailManager;
}();
defineProperty_default()(NodeDetailManager, "NODE_DETAILS_DEVNET", {
  torusNodeBaseEndpoints: ["https://sapphire-dev-2-1.authnetwork.dev", "https://sapphire-dev-2-2.authnetwork.dev", "https://sapphire-dev-2-3.authnetwork.dev", "https://sapphire-dev-2-4.authnetwork.dev", "https://sapphire-dev-2-5.authnetwork.dev"],
  torusNodeSSSEndpoints: ["https://sapphire-dev-2-1.authnetwork.dev/sss/jrpc", "https://sapphire-dev-2-2.authnetwork.dev/sss/jrpc", "https://sapphire-dev-2-3.authnetwork.dev/sss/jrpc", "https://sapphire-dev-2-4.authnetwork.dev/sss/jrpc", "https://sapphire-dev-2-5.authnetwork.dev/sss/jrpc"],
  torusNodeRSSEndpoints: ["https://sapphire-dev-2-1.authnetwork.dev/rss", "https://sapphire-dev-2-2.authnetwork.dev/rss", "https://sapphire-dev-2-3.authnetwork.dev/rss", "https://sapphire-dev-2-4.authnetwork.dev/rss", "https://sapphire-dev-2-5.authnetwork.dev/rss"],
  torusNodeTSSEndpoints: ["https://sapphire-dev-2-1.authnetwork.dev/tss", "https://sapphire-dev-2-2.authnetwork.dev/tss", "https://sapphire-dev-2-3.authnetwork.dev/tss", "https://sapphire-dev-2-4.authnetwork.dev/tss", "https://sapphire-dev-2-5.authnetwork.dev/tss"],
  torusIndexes: [1, 2, 3, 4, 5],
  torusNodePub: [{
    X: "f74389b0a4c8d10d2a687ae575f69b20f412d41ab7f1fe6b358aa14871327247",
    Y: "54e3a73098ed9bced3ef8821736e9794f9264a1420c0c7ad15d2fa617ba35ef7"
  }, {
    X: "bc38813a6873e526087918507c78fc3a61624670ee851ecfb4f3bef55d027b5a",
    Y: "ac4b21229f662a0aefdfdac21cf17c3261a392c74a8790db218b34e3e4c1d56a"
  }, {
    X: "b56541684ea5fa40c8337b7688d502f0e9e092098962ad344c34e94f06d293fb",
    Y: "759a998cef79d389082f9a75061a29190eec0cac99b8c25ddcf6b58569dad55c"
  }, {
    X: "7bcb058d4c6ffc6ba4bfdfd93d141af35a66338a62c7c27cdad2ae3f8289b767",
    Y: "336ab1935e41ed4719e162587f0ab55518db4207a1eb36cc72303f1b86689d2b"
  }, {
    X: "bf12a136ef94399ea098f926f04e26a4ec4ac70f69cce274e8893704c4951773",
    Y: "bdd44828020f52ce510e026338216ada184a6867eb4e19fb4c2d495d4a7e15e4"
  }],
  updated: false
});
/* harmony default export */ const nodeDetailManager = (NodeDetailManager);
;// CONCATENATED MODULE: ./src/index.ts


module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=fetchNodeDetailsSapphire.cjs.js.map