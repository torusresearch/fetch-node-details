import _asyncToGenerator from '@babel/runtime/helpers/asyncToGenerator';
import _classCallCheck from '@babel/runtime/helpers/classCallCheck';
import _createClass from '@babel/runtime/helpers/createClass';
import _defineProperty from '@babel/runtime/helpers/defineProperty';
import _regeneratorRuntime from '@babel/runtime/regenerator';
import { post, generateJsonRPCObject } from '@toruslabs/http-helpers';
import JsonStringify from 'json-stable-stringify';
import log from 'loglevel';
import { toHex } from 'web3-utils';

var TORUS_NETWORK = {
  DEVNET: "devnet",
  TESTNET: "testnet",
  MAINNET: "mainnet"
};

var _NETWORK_URLS;
var NETWORK_URLS = (_NETWORK_URLS = {}, _defineProperty(_NETWORK_URLS, TORUS_NETWORK.DEVNET, ["https://sapphire-dev-2-1.authnetwork.dev", "https://sapphire-dev-2-2.authnetwork.dev", "https://sapphire-dev-2-3.authnetwork.dev", "https://sapphire-dev-2-4.authnetwork.dev", "https://sapphire-dev-2-5.authnetwork.dev"]), _defineProperty(_NETWORK_URLS, TORUS_NETWORK.TESTNET, ["https://lrc1.authnetwork.dev", "https://lrc2.authnetwork.dev", "https://lrc3.authnetwork.dev", "https://lrc4.authnetwork.dev", "https://lrc5.authnetwork.dev"]), _NETWORK_URLS);

var thresholdSame = function thresholdSame(arr, t) {
  var hashMap = {};
  for (var i = 0; i < arr.length; i += 1) {
    var str = JsonStringify(arr[i]);
    hashMap[str] = hashMap[str] ? hashMap[str] + 1 : 1;
    if (hashMap[str] === t) {
      return arr[i];
    }
  }
  return undefined;
};

var NodeDetailManager = /*#__PURE__*/function () {
  function NodeDetailManager() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$network = _ref.network,
      network = _ref$network === void 0 ? TORUS_NETWORK.DEVNET : _ref$network;
    _classCallCheck(this, NodeDetailManager);
    _defineProperty(this, "_torusNodeBaseEndpoints", []);
    _defineProperty(this, "_torusNodeRSSEndpoints", []);
    _defineProperty(this, "_torusNodeSSSEndpoints", []);
    _defineProperty(this, "_torusNodeTSSEndpoints", []);
    _defineProperty(this, "_torusNodePub", []);
    _defineProperty(this, "_torusIndexes", []);
    _defineProperty(this, "updated", void 0);
    _defineProperty(this, "network", void 0);
    this.network = network;
    this.updated = false;
  }
  _createClass(NodeDetailManager, [{
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
      var _getNodeDetails = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
        var endPoints, lookupPromises, lookupResponses, threholdNodes, parsedNodes, updatedBaseEndpoints, updatedSSSEndpoints, updatedRSSEndpoints, updatedTSSEndpoints, updatedNodePub, indexes, index, endpoint, nodeInfo, pubKx, pubKy;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
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
                  return post(x, generateJsonRPCObject("NodeDetailsRequest", {})).catch(function (err) {
                    return log.error("node lookup request failed", err);
                  });
                });
                _context.next = 7;
                return Promise.all(lookupPromises);
              case 7:
                lookupResponses = _context.sent;
                threholdNodes = thresholdSame(lookupResponses.map(function (resp) {
                  return JsonStringify(resp.result);
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
                    X: toHex(pubKx).replace("0x", ""),
                    Y: toHex(pubKy).replace("0x", "")
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
_defineProperty(NodeDetailManager, "NODE_DETAILS_DEVNET", {
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

export { TORUS_NETWORK, NodeDetailManager as default };
//# sourceMappingURL=fetchNodeDetailsSapphire.esm.js.map
