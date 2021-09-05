"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var test_helpers_1 = require("@openzeppelin/test-helpers");
var bn_js_1 = __importDefault(require("bn.js"));
var chai_bn_1 = __importDefault(require("chai-bn"));
var chai_1 = __importDefault(require("chai"));
chai_1.default.use(chai_bn_1.default(bn_js_1.default));
var Journal = artifacts.require("Journal");
var Paper = artifacts.require("Paper");
var State = {
    Pending: 0,
    RequestChanges: 1,
    Approved: 2,
    Rejected: 3,
};
var ipfsHash = "0000";
var reviewTime = 100000;
var getPaper = function () { return __awaiter(void 0, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
    switch (_c.label) {
        case 0:
            _b = (_a = Paper).at;
            return [4 /*yield*/, Journal.deployed()];
        case 1: return [4 /*yield*/, (_c.sent()).getPaper(ipfsHash)];
        case 2: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
    }
}); }); };
contract("Paper", function (accounts) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        before(function () { return __awaiter(void 0, void 0, void 0, function () {
            var journal;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Journal.deployed()];
                    case 1:
                        journal = _a.sent();
                        journal.addPaper(ipfsHash, reviewTime);
                        return [2 /*return*/];
                }
            });
        }); });
        it("addFeedback", function () {
            return __awaiter(this, void 0, void 0, function () {
                var paper, _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, getPaper()];
                        case 1:
                            paper = _d.sent();
                            return [4 /*yield*/, paper.addReviewer(accounts[0])];
                        case 2:
                            _d.sent();
                            return [4 /*yield*/, paper.addFeedback("The paper is correct.")];
                        case 3:
                            _d.sent();
                            // valid case
                            _a = expect;
                            return [4 /*yield*/, paper.feedbacks(0)];
                        case 4:
                            // valid case
                            _a.apply(void 0, [(_d.sent())[0]]).to.be.equal("The paper is correct.");
                            _c = (_b = paper).removeReviewer;
                            return [4 /*yield*/, Journal.deployed()];
                        case 5: return [4 /*yield*/, (_d.sent()).owner()];
                        case 6: 
                        // invalid case
                        return [4 /*yield*/, _c.apply(_b, [_d.sent()])];
                        case 7:
                            // invalid case
                            _d.sent();
                            return [4 /*yield*/, test_helpers_1.expectRevert(paper.addFeedback("The paper is just rubbish."), "You are not part of the reviewer's list. \
          Therefore, you can't perform this operation.")];
                        case 8:
                            _d.sent();
                            return [2 /*return*/];
                    }
                });
            });
        });
        it("validateFeedback", function () {
            return __awaiter(this, void 0, void 0, function () {
                var paper, _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, getPaper()];
                        case 1:
                            paper = _d.sent();
                            _b = (_a = paper).addReviewer;
                            return [4 /*yield*/, Journal.deployed()];
                        case 2: return [4 /*yield*/, (_d.sent()).owner()];
                        case 3: return [4 /*yield*/, _b.apply(_a, [_d.sent()])];
                        case 4:
                            _d.sent();
                            return [4 /*yield*/, paper.addFeedback("The paper is correct.")];
                        case 5:
                            _d.sent();
                            // valid case
                            return [4 /*yield*/, paper.validateFeedback(0)];
                        case 6:
                            // valid case
                            _d.sent();
                            _c = expect;
                            return [4 /*yield*/, paper.feedbacks(0)];
                        case 7:
                            (_c.apply(void 0, [(_d.sent())[2]]).to.be).bignumber.equal(new bn_js_1.default(State["Approved"]));
                            return [2 /*return*/];
                    }
                });
            });
        });
        it("deleteFeedback", function () {
            return __awaiter(this, void 0, void 0, function () {
                var paper, _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, getPaper()];
                        case 1:
                            paper = _d.sent();
                            _b = (_a = paper).addReviewer;
                            return [4 /*yield*/, Journal.deployed()];
                        case 2: return [4 /*yield*/, (_d.sent()).owner()];
                        case 3: return [4 /*yield*/, _b.apply(_a, [_d.sent()])];
                        case 4:
                            _d.sent();
                            return [4 /*yield*/, paper.addFeedback("The paper is correct.")];
                        case 5:
                            _d.sent();
                            // valid case
                            return [4 /*yield*/, paper.validateFeedback(0)];
                        case 6:
                            // valid case
                            _d.sent();
                            _c = expect;
                            return [4 /*yield*/, paper.feedbacks(0)];
                        case 7:
                            (_c.apply(void 0, [(_d.sent())[2]]).to.be).bignumber.equal(new bn_js_1.default(State["Rejected"]));
                            return [2 /*return*/];
                    }
                });
            });
        });
        it("addReviewState_validCase", function () {
            return __awaiter(this, void 0, void 0, function () {
                var paper, reviewState, _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, getPaper()];
                        case 1:
                            paper = _c.sent();
                            // valid case
                            (expect(paper.paperState).to.be).bignumber.equal(new bn_js_1.default(State["Pending"]));
                            return [4 /*yield*/, paper.addReviewState(new bn_js_1.default(State["Approved"]))];
                        case 2:
                            _c.sent();
                            _b = (_a = paper).reviewStates;
                            return [4 /*yield*/, Journal.deployed()];
                        case 3: return [4 /*yield*/, (_c.sent()).owner()];
                        case 4: return [4 /*yield*/, _b.apply(_a, [_c.sent()])];
                        case 5:
                            reviewState = _c.sent();
                            (expect(reviewState).to.be).bignumber.equal(new bn_js_1.default(State["Approved"]));
                            (expect(paper.paperState).to.be).bignumber.equal(new bn_js_1.default(State["Approved"]));
                            return [2 /*return*/];
                    }
                });
            });
        });
        it("addReviewState_invalidCase", function () {
            return __awaiter(this, void 0, void 0, function () {
                var paper;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, getPaper()];
                        case 1:
                            paper = _a.sent();
                            return [4 /*yield*/, test_helpers_1.expectRevert(paper.addReviewState("The paper is just rubbish."), "You are not part of the reviewer's list. \
          Therefore, you can't perform this operation.")];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        });
        it("claimAuthority", function () {
            return __awaiter(this, void 0, void 0, function () {
                var paper, _a, _b, _c, _d, _e, _f, _g, _h;
                return __generator(this, function (_j) {
                    switch (_j.label) {
                        case 0: return [4 /*yield*/, getPaper()];
                        case 1:
                            paper = _j.sent();
                            // invalid case
                            return [4 /*yield*/, test_helpers_1.expectRevert(paper.claimAuthority(""), "This paper review is still ongoing.")];
                        case 2:
                            // invalid case
                            _j.sent();
                            // valid case
                            _a = expect;
                            return [4 /*yield*/, paper.author()];
                        case 3:
                            // valid case
                            _a.apply(void 0, [_j.sent()]).to.be.equal(accounts[1]);
                            _c = (_b = paper).addReviewer;
                            return [4 /*yield*/, Journal.deployed()];
                        case 4: return [4 /*yield*/, (_j.sent()).owner()];
                        case 5: return [4 /*yield*/, _c.apply(_b, [_j.sent()])];
                        case 6:
                            _j.sent();
                            _e = (_d = paper).claimAuthority;
                            return [4 /*yield*/, Journal.deployed()];
                        case 7: return [4 /*yield*/, (_j.sent()).owner()];
                        case 8: return [4 /*yield*/, _e.apply(_d, [_j.sent()])];
                        case 9:
                            _j.sent();
                            _g = expect;
                            return [4 /*yield*/, paper.author()];
                        case 10:
                            _h = (_f = _g.apply(void 0, [_j.sent()]).to.be).equal;
                            return [4 /*yield*/, Journal.deployed()];
                        case 11: return [4 /*yield*/, (_j.sent()).owner()];
                        case 12:
                            _h.apply(_f, [_j.sent()]);
                            return [2 /*return*/];
                    }
                });
            });
        });
        return [2 /*return*/];
    });
}); });
