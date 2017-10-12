/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "bbac44ef246cf8265adb"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(2)(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Player = exports.Player = function () {
    function Player(game) {
        _classCallCheck(this, Player);

        this.game = game;
        this.points = 0;
        this.cards = [];
    }

    _createClass(Player, [{
        key: 'resetPoints',
        value: function resetPoints() {
            this.points = 0;
            this.cards = [];
        }
    }, {
        key: 'isLost',
        value: function isLost() {
            var MAXIMUM_VALUE = 21;
            if (this.points > MAXIMUM_VALUE) {
                return true;
            }
            return false;
        }
    }, {
        key: 'drawCard',
        value: function drawCard() {
            var card = this.game.getRandomCard();
            this.cards.push(card);
            this.points = this.countPoints();
            return card;
        }
    }, {
        key: 'sumValues',
        value: function sumValues() {
            if (this.cards == null) {
                return 0;
            }
            return this.cards.reduce(function (a, b) {
                var value = b['value'];

                return b['value'] == null ? a : a + b['value'];
            }, 0);
        }
    }, {
        key: 'countPoints',
        value: function countPoints() {
            var sum = this.sumValues();
            if (sum > 21) {
                for (var i in this.cards) {
                    var obj = this.cards[i];
                    if (obj.type === 'ace' && obj.value !== obj.additionalValue) {
                        this.cards[i].value = obj.additionalValue;
                        return this.countPoints();
                    }
                };
            }
            return sum;
        }
    }]);

    return Player;
}();

/***/ }),
/* 1 */,
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _GameUI = __webpack_require__(3);

var _languageEn = __webpack_require__(10);

var _languagePl = __webpack_require__(11);

__webpack_require__(21);
__webpack_require__(19);

var element = document.getElementById("blackjack");
var languages = {
    pl: _languagePl.langPl,
    en: _languageEn.langEn
};

var gameUI = new _GameUI.GameUI(element);
gameUI.setLanguages(languages);

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.GameUI = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Game = __webpack_require__(4);

var _Game2 = _interopRequireDefault(_Game);

var _Player = __webpack_require__(0);

var _Player2 = _interopRequireDefault(_Player);

var _Human = __webpack_require__(5);

var _Human2 = _interopRequireDefault(_Human);

var _Computer = __webpack_require__(6);

var _Computer2 = _interopRequireDefault(_Computer);

var _State = __webpack_require__(7);

var _Language = __webpack_require__(9);

var _Language2 = _interopRequireDefault(_Language);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GameUI = exports.GameUI = function () {
	function GameUI(element) {
		_classCallCheck(this, GameUI);

		this.game = new _Game2.default();
		this.player = new _Human2.default(this.game);
		this.computer = new _Computer2.default(this.game);
		this.element = element;
		this.state = new _State.State(this);
		this.createEvents();
	}

	_createClass(GameUI, [{
		key: 'createEvents',
		value: function createEvents() {
			var _this = this;

			this.element.querySelector(".page-start").style.display = 'block';
			this.element.querySelector(".page-game").style.display = 'none';

			this.element.querySelector(".start").addEventListener("click", function () {
				_this.startEvent();
			});
			this.element.querySelector(".new").addEventListener("click", function () {
				_this.newGameEvent();
			});
			this.element.querySelector(".get-card").addEventListener("click", function () {
				_this.getCardEvent();
			});
			this.element.querySelector(".check").addEventListener("click", function () {
				_this.checkEvent();
			});
			this.element.querySelector(".next").addEventListener("click", function () {
				_this.nextEvent();
			});

			document.addEventListener('keydown', function (event) {
				_this.state.keyboardInvokeOperation(event.keyCode);
			});

			this.element.querySelector(".flag-poland").addEventListener("click", function () {
				_this.language.setLanguage('pl');
			});
			this.element.querySelector(".flag-england").addEventListener("click", function () {
				_this.language.setLanguage('en');
			});
		}
	}, {
		key: 'startEvent',
		value: function startEvent() {
			this.player.reset();
			this.start();
		}
	}, {
		key: 'newGameEvent',
		value: function newGameEvent() {
			this.start();
		}
	}, {
		key: 'getCardEvent',
		value: function getCardEvent() {
			this.getCard();
		}
	}, {
		key: 'checkEvent',
		value: function checkEvent() {
			this.check();
			this.state.setState(new _State.FinishState());
		}
	}, {
		key: 'nextEvent',
		value: function nextEvent() {
			this.player.bid = parseInt(this.element.querySelector("input[name='bid']").value);
			var validateResult = this.validateBid(this.player.bid);

			if (!validateResult.status) {
				document.querySelector('.bid-error').innerHTML = validateResult.message;
				return false;
			}

			this.element.querySelector(".cash_player").innerHTML = this.player.cash;
			this.element.querySelector(".bid").innerHTML = this.player.bid;
			this.element.querySelector(".page-bid").style.display = 'none';
			this.element.querySelector(".page-game").style.display = 'block';
			this.state.setState(new _State.GameState());
		}
	}, {
		key: 'setLanguages',
		value: function setLanguages(languages) {
			this.language = new _Language2.default(this.element, languages);

			var userLang = navigator.language || navigator.userLanguage;

			if (userLang.toLowerCase() === 'pl') {
				this.language.setLanguage('pl');
			} else {
				this.language.setLanguage('en');
			}
		}
	}, {
		key: 'validateBid',
		value: function validateBid(bid) {
			var validateResult = { status: false };
			if (isNaN(bid)) {
				validateResult.message = this.language.translate('enterNumber');

				return validateResult;
			}
			if (bid < 0) {
				validateResult.message = this.language.translate('tooSmallBid');
				return validateResult;
			}
			if (bid > this.player.cash) {
				validateResult.message = this.language.translate('notEnoughMoney');
				return validateResult;
			}
			validateResult.status = true;
			return validateResult;
		}
	}, {
		key: 'restartGame',
		value: function restartGame() {
			this.game.initGame();
			this.player.resetPoints();
			this.computer.resetPoints();
			this.state.setState(new _State.SetBidState());

			if (this.player.cash <= 0) {
				this.element.querySelector(".lose-message").innerHTML = this.language.translate('loseTryAgain');
				this.state.setState(new _State.StartState());
				this.element.querySelector(".page-start").style.display = 'block';
				this.element.querySelector(".page-game").style.display = 'none';
				return;
			}

			this.element.querySelector(".bid-error").innerHTML = "";
			this.element.querySelector(".player-card-container").innerHTML = "";
			this.element.querySelector(".message").innerHTML = "";
			this.element.querySelector(".points").innerHTML = 0;
			this.element.querySelector(".cash").innerHTML = this.player.cash;
			this.element.querySelector(".computer-card-container").innerHTML = "";
			this.element.querySelector(".computer-points").innerHTML = 0;

			this.element.querySelector(".page-start").style.display = 'none';
			this.element.querySelector(".page-bid").style.display = 'block';
			this.element.querySelector(".page-game").style.display = 'none';

			this.element.querySelector(".get-card").style.display = 'inline-block';
			this.element.querySelector(".check").style.display = 'inline-block';
			this.element.querySelector(".new").style.display = 'none';
			this.element.querySelector(".opponent").style.display = 'none';

			this.element.querySelector("input[name='bid']").focus();
			this.element.querySelector("input[name='bid']").select();
		}
	}, {
		key: 'start',
		value: function start() {
			this.restartGame();
		}
	}, {
		key: 'getCard',
		value: function getCard() {
			var card = this.player.drawCard();

			var cardElement = document.createElement("div");
			cardElement.className = "card " + card.class;
			this.element.querySelector(".player-card-container").appendChild(cardElement);
			this.element.querySelector(".points").innerHTML = this.player.points;

			if (this.player.isLost()) {
				this.state.setState(new _State.FinishState());
				this.player.cash -= this.player.bid;
				this.element.querySelector('.message').innerHTML = this.language.translate('exceedLimit');
				this.element.querySelector(".get-card").style.display = 'none';
				this.element.querySelector(".check").style.display = 'none';
				this.element.querySelector(".new").style.display = 'inline-block';
			}
		}
	}, {
		key: 'check',
		value: function check() {
			while (!this.computer.isPassed()) {
				var card = this.computer.drawCard();
				var cardElement = document.createElement("div");
				cardElement.className = "card " + card.class;
				this.element.querySelector(".computer-card-container").appendChild(cardElement);
			}
			this.element.querySelector(".computer-points").innerHTML = this.computer.points;

			var message = void 0;
			if (this.computer.isLost() || this.computer.points < this.player.points) {
				message = this.language.translate('win');
				this.player.cash += this.player.bid;
			} else if (this.computer.points === this.player.points) {
				message = this.language.translate('draw');
			} else {
				message = this.language.translate('lose');
				this.player.cash -= this.player.bid;
			}
			this.element.querySelector('.message').innerHTML = message;
			this.element.querySelector(".get-card").style.display = 'none';
			this.element.querySelector(".check").style.display = 'none';
			this.element.querySelector(".new").style.display = 'inline-block';
			this.element.querySelector(".opponent").style.display = 'block';
		}
	}]);

	return GameUI;
}();

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = function () {
    function Game() {
        _classCallCheck(this, Game);

        this.initGame();
    }

    _createClass(Game, [{
        key: 'initGame',
        value: function initGame() {

            this.cardPoints = [];
            var cardTypes = ['clubs', 'hearts', 'spades', 'diamonds'];
            var cardValues = {
                'ace': 11, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6,
                'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10, 'jack': 10, 'queen': 10, 'king': 10
            };

            for (var i in cardTypes) {
                for (var name in cardValues) {
                    var card = {
                        value: cardValues[name],
                        type: name,
                        class: name + '_' + cardTypes[i]
                    };
                    if (name === 'ace') {
                        card.additionalValue = 1;
                    }
                    this.cardPoints.push(card);
                }
            }
        }
    }, {
        key: 'getRandomCard',
        value: function getRandomCard() {
            var desiredIndex = Math.floor(Math.random() * this.cardPoints.length);
            var card = this.cardPoints[desiredIndex];
            this.cardPoints.splice(desiredIndex, 1);
            return card;
        }
    }]);

    return Game;
}();

exports.default = Game;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Player2 = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Human = function (_Player) {
	_inherits(Human, _Player);

	function Human(game) {
		_classCallCheck(this, Human);

		var _this = _possibleConstructorReturn(this, (Human.__proto__ || Object.getPrototypeOf(Human)).call(this, game));

		_this.reset();
		return _this;
	}

	_createClass(Human, [{
		key: 'reset',
		value: function reset() {
			this.cash = 10000;
			this.bid = 0;
		}
	}, {
		key: 'setBid',
		value: function setBid(bid) {
			this.bid = bid;
		}
	}]);

	return Human;
}(_Player2.Player);

exports.default = Human;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Player2 = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Computer = function (_Player) {
    _inherits(Computer, _Player);

    function Computer() {
        _classCallCheck(this, Computer);

        return _possibleConstructorReturn(this, (Computer.__proto__ || Object.getPrototypeOf(Computer)).apply(this, arguments));
    }

    _createClass(Computer, [{
        key: 'isPassed',
        value: function isPassed() {
            if (this.points >= 15) {
                return true;
            }
            return false;
        }
    }]);

    return Computer;
}(_Player2.Player);

exports.default = Computer;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FinishState = exports.GameState = exports.SetBidState = exports.StartState = exports.StateOption = exports.State = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _keyboard_code_enums = __webpack_require__(8);

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var State = exports.State = function () {
    function State(gameUI) {
        _classCallCheck(this, State);

        this.gameUI = gameUI;
        this.setState(new StartState());
    }

    _createClass(State, [{
        key: 'setState',
        value: function setState(state) {
            this.state = state;
            this.state.setGameUI(this.gameUI);
        }
    }, {
        key: 'keyboardInvokeOperation',
        value: function keyboardInvokeOperation(keycode) {
            var operation = this.state.keyOperation[keycode];
            if (typeof operation !== 'undefined') {
                operation();
            }
        }
    }]);

    return State;
}();

var StateOption = exports.StateOption = function () {
    function StateOption() {
        _classCallCheck(this, StateOption);

        this.keyOperation = [];
    }

    _createClass(StateOption, [{
        key: 'setGameUI',
        value: function setGameUI(gameUI) {
            this.gameUI = gameUI;
        }
    }]);

    return StateOption;
}();

var StartState = exports.StartState = function (_StateOption) {
    _inherits(StartState, _StateOption);

    function StartState() {
        _classCallCheck(this, StartState);

        var _this = _possibleConstructorReturn(this, (StartState.__proto__ || Object.getPrototypeOf(StartState)).call(this));

        _this.keyOperation[_keyboard_code_enums.enums.keyboard.ENTER] = function () {
            _this.gameUI.startEvent();
        };
        return _this;
    }

    return StartState;
}(StateOption);

var SetBidState = exports.SetBidState = function (_StateOption2) {
    _inherits(SetBidState, _StateOption2);

    function SetBidState() {
        _classCallCheck(this, SetBidState);

        var _this2 = _possibleConstructorReturn(this, (SetBidState.__proto__ || Object.getPrototypeOf(SetBidState)).call(this));

        _this2.keyOperation[_keyboard_code_enums.enums.keyboard.ENTER] = function () {
            _this2.gameUI.nextEvent();
        };
        return _this2;
    }

    return SetBidState;
}(StateOption);

var GameState = exports.GameState = function (_StateOption3) {
    _inherits(GameState, _StateOption3);

    function GameState() {
        _classCallCheck(this, GameState);

        var _this3 = _possibleConstructorReturn(this, (GameState.__proto__ || Object.getPrototypeOf(GameState)).call(this));

        _this3.keyOperation[_keyboard_code_enums.enums.keyboard.ENTER] = function () {
            _this3.gameUI.checkEvent();
        };

        _this3.keyOperation[_keyboard_code_enums.enums.keyboard.SPACE] = function () {
            _this3.gameUI.getCardEvent();;
        };
        return _this3;
    }

    return GameState;
}(StateOption);

var FinishState = exports.FinishState = function (_StateOption4) {
    _inherits(FinishState, _StateOption4);

    function FinishState() {
        _classCallCheck(this, FinishState);

        var _this4 = _possibleConstructorReturn(this, (FinishState.__proto__ || Object.getPrototypeOf(FinishState)).call(this));

        _this4.keyOperation[_keyboard_code_enums.enums.keyboard.ENTER] = function () {
            _this4.gameUI.newGameEvent();
        };
        return _this4;
    }

    return FinishState;
}(StateOption);

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
      value: true
});
var enums = exports.enums = {};
enums.keyboard = {
      BACKSPACE: 8,
      TAB: 9,
      ENTER: 13,
      SHIFT: 16,
      CTRL: 17,
      ALT: 18,
      PAUSE: 19,
      CAPS_LOCK: 20,
      ESCAPE: 27,
      SPACE: 32,
      PAGE_UP: 33,
      PAGE_DOWN: 34,
      END: 35,
      HOME: 36,
      LEFT_ARROW: 37,
      UP_ARROW: 38,
      RIGHT_ARROW: 39,
      DOWN_ARROW: 40,
      INSERT: 45,
      DELETE: 46,
      KEY_0: 48,
      KEY_1: 49,
      KEY_2: 50,
      KEY_3: 51,
      KEY_4: 52,
      KEY_5: 53,
      KEY_6: 54,
      KEY_7: 55,
      KEY_8: 56,
      KEY_9: 57,
      KEY_A: 65,
      KEY_B: 66,
      KEY_C: 67,
      KEY_D: 68,
      KEY_E: 69,
      KEY_F: 70,
      KEY_G: 71,
      KEY_H: 72,
      KEY_I: 73,
      KEY_J: 74,
      KEY_K: 75,
      KEY_L: 76,
      KEY_M: 77,
      KEY_N: 78,
      KEY_O: 79,
      KEY_P: 80,
      KEY_Q: 81,
      KEY_R: 82,
      KEY_S: 83,
      KEY_T: 84,
      KEY_U: 85,
      KEY_V: 86,
      KEY_W: 87,
      KEY_X: 88,
      KEY_Y: 89,
      KEY_Z: 90,
      LEFT_META: 91,
      RIGHT_META: 92,
      SELECT: 93,
      NUMPAD_0: 96,
      NUMPAD_1: 97,
      NUMPAD_2: 98,
      NUMPAD_3: 99,
      NUMPAD_4: 100,
      NUMPAD_5: 101,
      NUMPAD_6: 102,
      NUMPAD_7: 103,
      NUMPAD_8: 104,
      NUMPAD_9: 105,
      MULTIPLY: 106,
      ADD: 107,
      SUBTRACT: 109,
      DECIMAL: 110,
      DIVIDE: 111,
      F1: 112,
      F2: 113,
      F3: 114,
      F4: 115,
      F5: 116,
      F6: 117,
      F7: 118,
      F8: 119,
      F9: 120,
      F10: 121,
      F11: 122,
      F12: 123,
      NUM_LOCK: 144,
      SCROLL_LOCK: 145,
      SEMICOLON: 186,
      EQUALS: 187,
      COMMA: 188,
      DASH: 189,
      PERIOD: 190,
      FORWARD_SLASH: 191,
      GRAVE_ACCENT: 192,
      OPEN_BRACKET: 219,
      BACK_SLASH: 220,
      CLOSE_BRACKET: 221,
      SINGLE_QUOTE: 222
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Language = function () {
    function Language(element, languageFiles) {
        _classCallCheck(this, Language);

        this.element = element;
        this.currentLanguage = 'en';
        this.languageFiles = languageFiles;
    }

    _createClass(Language, [{
        key: 'setLanguage',
        value: function setLanguage(lang) {
            this.currentLanguage = this.languageFiles[lang];
            this.element.querySelector(".start").innerHTML = this.translate('play');
            this.element.querySelector(".next").innerHTML = this.translate('next');
            this.element.querySelector(".get-card").innerHTML = this.translate('drawCart');
            this.element.querySelector(".get-card").innerHTML = this.translate('drawCart');
            this.element.querySelector(".check").innerHTML = this.translate('stand');

            var cashLabels = this.element.querySelectorAll('.cash-label');
            for (var i = 0; i < cashLabels.length; i++) {
                cashLabels[i].innerHTML = this.translate('cash');
            }

            this.element.querySelector('.bet-label').innerHTML = this.translate('bet');
            this.element.querySelector('.set-bet-label').innerHTML = this.translate('setBet');
            this.element.querySelector('.value-label').innerHTML = this.translate('cartValue');
            this.element.querySelector('.opponent-value-label').innerHTML = this.translate('opponentCartValue');
        }
    }, {
        key: 'translate',
        value: function translate(word) {
            return this.currentLanguage[word];
        }
    }]);

    return Language;
}();

exports.default = Language;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var langEn = exports.langEn = {
    play: 'Play',
    next: 'Next',
    drawCart: 'Draw a cart',
    stand: 'Stand',
    enterNumber: "Please, enter a number",
    tooSmallBid: "Too small bet",
    notEnoughMoney: "You have not enough money",
    loseTryAgain: "You lost. Can you try again??",
    exceedLimit: "Exceed limit 21.",
    win: 'Congratulation, you won!',
    draw: "Draw",
    lose: 'Opponent won',
    cash: 'Cash',
    setBet: 'Enter your bet',
    bet: 'Bet',
    cartValue: 'Value of cart',
    opponentCartValue: 'Value of opponent cart'
};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var langPl = exports.langPl = {
    play: 'Graj',
    next: 'Dalej',
    drawCart: 'Pobierz karte',
    stand: 'Pas',
    enterNumber: "Nie podano liczby",
    tooSmallBid: "Za mała stawka",
    notEnoughMoney: "Nie masz tyle pieniędzy",
    loseTryAgain: "Niestety przegraleś. Może zaczniemy od nowa?",
    exceedLimit: "Przekroczono wartość 21.",
    win: 'Gratulacje, wygraleś!',
    draw: "Remis",
    lose: 'Wygrał przeciwnik',
    cash: 'Kasa',
    setBet: 'Ustaw wysokość stawki',
    bet: 'Stawka',
    cartValue: 'Wartość kart',
    opponentCartValue: 'Wartość kart przeciwnika'
};

/***/ }),
/* 12 */,
/* 13 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(15);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 15 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 16 */,
/* 17 */,
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(13)(undefined);
// imports


// module
exports.push([module.i, ".button {\n  display: inline-block;\n  *display: inline;\n  zoom: 1;\n  padding: 6px 20px;\n  margin: 0;\n  cursor: pointer;\n  border: 1px solid #bbb;\n  overflow: visible;\n  font: bold 1em arial, helvetica, sans-serif;\n  text-decoration: none;\n  white-space: nowrap;\n  color: #555;\n  background-color: #ddd;\n  background-image: linear-gradient(top, white, rgba(255, 255, 255, 0)), url(data:image/png;base64,iVBORw0KGg[...]QmCC);\n  transition: background-color .2s ease-out;\n  background-clip: padding-box;\n  /* Fix bleeding */\n  border-radius: 3px;\n  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.3), 0 2px 2px -1px rgba(0, 0, 0, 0.5), 0 1px 0 rgba(255, 255, 255, 0.3) inset;\n  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.9); }\n\n.button:hover {\n  background-color: #eee;\n  color: #555; }\n\n.button:active {\n  background: #e9e9e9;\n  position: relative;\n  top: 1px;\n  text-shadow: none;\n  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.3) inset; }\n\n.button.color {\n  color: #fff;\n  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);\n  background-image: linear-gradient(top, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0)), url(data:image/png;base64,iVBORw0KGg[...]QmCC); }\n\n.button.red {\n  background-color: #c43c35;\n  border-color: #c43c35; }\n\n.button.red:hover {\n  background-color: #ee5f5b; }\n\n.button.red:active {\n  background: #c43c35; }\n\n.button.large {\n  padding: 12px 30px; }\n", ""]);

// exports


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(18);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(14)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(18, function() {
			var newContent = __webpack_require__(18);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(13)(undefined);
// imports


// module
exports.push([module.i, "html {\n  color: #F0F8FF;\n  text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;\n  font-family: 'Roboto', sans-serif;\n  font-size: 26px;\n  font-weight: bold;\n  background-color: #076324;\n  background-image: url(\"http://www.transparenttextures.com/patterns/black-felt.png\"); }\n\nh1 {\n  font-family: 'Wendy One', sans-serif;\n  margin: 20px;\n  font-size: 6em;\n  text-shadow: -10px 0 black, 0 3px black, -10px 0 black, 0 -8px black; }\n\n.buttons {\n  margin-top: 20px; }\n\n.flag {\n  margin: 10px;\n  background: none;\n  border: none; }\n\n.bid-error {\n  color: #ff1a1a;\n  font-weight: bold; }\n\nbutton.start {\n  margin-top: 20px; }\n\ninput {\n  padding: 12px 20px;\n  margin: 8px 0;\n  display: inline-block;\n  border: 1px solid #ccc;\n  border-radius: 4px;\n  box-sizing: border-box; }\n\n.money-format {\n  color: #ffa31a; }\n\n.money-format::after {\n  content: '$'; }\n\n.card-container {\n  height: 100px; }\n\n#blackjack {\n  text-align: center; }\n\n.my-money {\n  padding: 10px 15px; }\n\n.my-bid {\n  padding: 15px;\n  margin: 10px; }\n\n.card {\n  display: inline-block;\n  margin: 2px; }\n\n@media only screen and (max-width: 500px) {\n  html {\n    font-size: 16px; }\n  h1 {\n    margin-bottom: 20px;\n    font-size: 3em; } }\n\n.ace_clubs {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -2px -1px; }\n\n.two_clubs {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -75px -1px; }\n\n.three_clubs {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -148px -1px; }\n\n.four_clubs {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -221px -1px; }\n\n.five_clubs {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -294px -1px; }\n\n.six_clubs {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -367px -1px; }\n\n.seven_clubs {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -440px -1px; }\n\n.eight_clubs {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -513px -1px; }\n\n.nine_clubs {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -586px -1px; }\n\n.ten_clubs {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -659px -1px; }\n\n.jack_clubs {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -732px -1px; }\n\n.queen_clubs {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -805px -1px; }\n\n.king_clubs {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -878px -1px; }\n\n.ace_hearts {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -2px -99px; }\n\n.two_hearts {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -75px -99px; }\n\n.three_hearts {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -148px -99px; }\n\n.four_hearts {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -221px -99px; }\n\n.five_hearts {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -294px -99px; }\n\n.six_hearts {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -367px -99px; }\n\n.seven_hearts {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -440px -99px; }\n\n.eight_hearts {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -513px -99px; }\n\n.nine_hearts {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -586px -99px; }\n\n.ten_hearts {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -659px -99px; }\n\n.jack_hearts {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -732px -99px; }\n\n.queen_hearts {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -805px -99px; }\n\n.king_hearts {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -878px -99px; }\n\n.ace_spades {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -2px -197px; }\n\n.two_spades {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -75px -197px; }\n\n.three_spades {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -148px -197px; }\n\n.four_spades {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -221px -197px; }\n\n.five_spades {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -294px -197px; }\n\n.six_spades {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -367px -197px; }\n\n.seven_spades {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -440px -197px; }\n\n.eight_spades {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -513px -197px; }\n\n.nine_spades {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -586px -197px; }\n\n.ten_spades {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -659px -197px; }\n\n.jack_spades {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -732px -197px; }\n\n.queen_spades {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -805px -197px; }\n\n.king_spades {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -878px -197px; }\n\n.ace_diamonds {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -2px -295px; }\n\n.two_diamonds {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -75px -295px; }\n\n.three_diamonds {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -148px -295px; }\n\n.four_diamonds {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -221px -295px; }\n\n.five_diamonds {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -294px -295px; }\n\n.six_diamonds {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -367px -295px; }\n\n.seven_diamonds {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -440px -295px; }\n\n.eight_diamonds {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -513px -295px; }\n\n.nine_diamonds {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -586px -295px; }\n\n.ten_diamonds {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -659px -295px; }\n\n.jack_diamonds {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -732px -295px; }\n\n.queen_diamonds {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -805px -295px; }\n\n.king_diamonds {\n  width: 71px;\n  height: 97px;\n  background: url(\"images/windows-playing-cards.png\") -878px -295px; }\n", ""]);

// exports


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(20);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(14)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(20, function() {
			var newContent = __webpack_require__(20);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYmJhYzQ0ZWYyNDZjZjgyNjVhZGIiLCJ3ZWJwYWNrOi8vLy4vc3JjL1BsYXllci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2NyaXB0LmpzIiwid2VicGFjazovLy8uL3NyYy9HYW1lVUkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0dhbWUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0h1bWFuLmpzIiwid2VicGFjazovLy8uL3NyYy9Db21wdXRlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvU3RhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2tleWJvYXJkX2NvZGVfZW51bXMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0xhbmd1YWdlLmpzIiwid2VicGFjazovLy8uL3NyYy9sYW5ndWFnZS1lbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGFuZ3VhZ2UtcGwuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi91cmxzLmpzIiwid2VicGFjazovLy8uL3Njc3MvYnV0dG9ucy5zY3NzIiwid2VicGFjazovLy8uL3Njc3MvYnV0dG9ucy5zY3NzPzQ1ZWYiLCJ3ZWJwYWNrOi8vLy4vc2Nzcy9zdHlsZXMuc2NzcyIsIndlYnBhY2s6Ly8vLi9zY3NzL3N0eWxlcy5zY3NzPzdmOGUiXSwibmFtZXMiOlsiUGxheWVyIiwiZ2FtZSIsInBvaW50cyIsImNhcmRzIiwiTUFYSU1VTV9WQUxVRSIsImNhcmQiLCJnZXRSYW5kb21DYXJkIiwicHVzaCIsImNvdW50UG9pbnRzIiwicmVkdWNlIiwiYSIsImIiLCJ2YWx1ZSIsInN1bSIsInN1bVZhbHVlcyIsImkiLCJvYmoiLCJ0eXBlIiwiYWRkaXRpb25hbFZhbHVlIiwicmVxdWlyZSIsImVsZW1lbnQiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwibGFuZ3VhZ2VzIiwicGwiLCJlbiIsImdhbWVVSSIsInNldExhbmd1YWdlcyIsIkdhbWVVSSIsInBsYXllciIsImNvbXB1dGVyIiwic3RhdGUiLCJjcmVhdGVFdmVudHMiLCJxdWVyeVNlbGVjdG9yIiwic3R5bGUiLCJkaXNwbGF5IiwiYWRkRXZlbnRMaXN0ZW5lciIsInN0YXJ0RXZlbnQiLCJuZXdHYW1lRXZlbnQiLCJnZXRDYXJkRXZlbnQiLCJjaGVja0V2ZW50IiwibmV4dEV2ZW50IiwiZXZlbnQiLCJrZXlib2FyZEludm9rZU9wZXJhdGlvbiIsImtleUNvZGUiLCJsYW5ndWFnZSIsInNldExhbmd1YWdlIiwicmVzZXQiLCJzdGFydCIsImdldENhcmQiLCJjaGVjayIsInNldFN0YXRlIiwiYmlkIiwicGFyc2VJbnQiLCJ2YWxpZGF0ZVJlc3VsdCIsInZhbGlkYXRlQmlkIiwic3RhdHVzIiwiaW5uZXJIVE1MIiwibWVzc2FnZSIsImNhc2giLCJ1c2VyTGFuZyIsIm5hdmlnYXRvciIsInVzZXJMYW5ndWFnZSIsInRvTG93ZXJDYXNlIiwiaXNOYU4iLCJ0cmFuc2xhdGUiLCJpbml0R2FtZSIsInJlc2V0UG9pbnRzIiwiZm9jdXMiLCJzZWxlY3QiLCJyZXN0YXJ0R2FtZSIsImRyYXdDYXJkIiwiY2FyZEVsZW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NOYW1lIiwiY2xhc3MiLCJhcHBlbmRDaGlsZCIsImlzTG9zdCIsImlzUGFzc2VkIiwiR2FtZSIsImNhcmRQb2ludHMiLCJjYXJkVHlwZXMiLCJjYXJkVmFsdWVzIiwibmFtZSIsImRlc2lyZWRJbmRleCIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImxlbmd0aCIsInNwbGljZSIsIkh1bWFuIiwiQ29tcHV0ZXIiLCJTdGF0ZSIsIlN0YXJ0U3RhdGUiLCJzZXRHYW1lVUkiLCJrZXljb2RlIiwib3BlcmF0aW9uIiwia2V5T3BlcmF0aW9uIiwiU3RhdGVPcHRpb24iLCJrZXlib2FyZCIsIkVOVEVSIiwiU2V0QmlkU3RhdGUiLCJHYW1lU3RhdGUiLCJTUEFDRSIsIkZpbmlzaFN0YXRlIiwiZW51bXMiLCJCQUNLU1BBQ0UiLCJUQUIiLCJTSElGVCIsIkNUUkwiLCJBTFQiLCJQQVVTRSIsIkNBUFNfTE9DSyIsIkVTQ0FQRSIsIlBBR0VfVVAiLCJQQUdFX0RPV04iLCJFTkQiLCJIT01FIiwiTEVGVF9BUlJPVyIsIlVQX0FSUk9XIiwiUklHSFRfQVJST1ciLCJET1dOX0FSUk9XIiwiSU5TRVJUIiwiREVMRVRFIiwiS0VZXzAiLCJLRVlfMSIsIktFWV8yIiwiS0VZXzMiLCJLRVlfNCIsIktFWV81IiwiS0VZXzYiLCJLRVlfNyIsIktFWV84IiwiS0VZXzkiLCJLRVlfQSIsIktFWV9CIiwiS0VZX0MiLCJLRVlfRCIsIktFWV9FIiwiS0VZX0YiLCJLRVlfRyIsIktFWV9IIiwiS0VZX0kiLCJLRVlfSiIsIktFWV9LIiwiS0VZX0wiLCJLRVlfTSIsIktFWV9OIiwiS0VZX08iLCJLRVlfUCIsIktFWV9RIiwiS0VZX1IiLCJLRVlfUyIsIktFWV9UIiwiS0VZX1UiLCJLRVlfViIsIktFWV9XIiwiS0VZX1giLCJLRVlfWSIsIktFWV9aIiwiTEVGVF9NRVRBIiwiUklHSFRfTUVUQSIsIlNFTEVDVCIsIk5VTVBBRF8wIiwiTlVNUEFEXzEiLCJOVU1QQURfMiIsIk5VTVBBRF8zIiwiTlVNUEFEXzQiLCJOVU1QQURfNSIsIk5VTVBBRF82IiwiTlVNUEFEXzciLCJOVU1QQURfOCIsIk5VTVBBRF85IiwiTVVMVElQTFkiLCJBREQiLCJTVUJUUkFDVCIsIkRFQ0lNQUwiLCJESVZJREUiLCJGMSIsIkYyIiwiRjMiLCJGNCIsIkY1IiwiRjYiLCJGNyIsIkY4IiwiRjkiLCJGMTAiLCJGMTEiLCJGMTIiLCJOVU1fTE9DSyIsIlNDUk9MTF9MT0NLIiwiU0VNSUNPTE9OIiwiRVFVQUxTIiwiQ09NTUEiLCJEQVNIIiwiUEVSSU9EIiwiRk9SV0FSRF9TTEFTSCIsIkdSQVZFX0FDQ0VOVCIsIk9QRU5fQlJBQ0tFVCIsIkJBQ0tfU0xBU0giLCJDTE9TRV9CUkFDS0VUIiwiU0lOR0xFX1FVT1RFIiwiTGFuZ3VhZ2UiLCJsYW5ndWFnZUZpbGVzIiwiY3VycmVudExhbmd1YWdlIiwibGFuZyIsImNhc2hMYWJlbHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwid29yZCIsImxhbmdFbiIsInBsYXkiLCJuZXh0IiwiZHJhd0NhcnQiLCJzdGFuZCIsImVudGVyTnVtYmVyIiwidG9vU21hbGxCaWQiLCJub3RFbm91Z2hNb25leSIsImxvc2VUcnlBZ2FpbiIsImV4Y2VlZExpbWl0Iiwid2luIiwiZHJhdyIsImxvc2UiLCJzZXRCZXQiLCJiZXQiLCJjYXJ0VmFsdWUiLCJvcHBvbmVudENhcnRWYWx1ZSIsImxhbmdQbCJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtRUFBMkQ7QUFDM0Q7QUFDQTtBQUNBLFdBQUc7O0FBRUgsb0RBQTRDO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHdEQUFnRDtBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsZUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQUk7QUFDSjs7OztBQUlBO0FBQ0Esc0RBQThDO0FBQzlDO0FBQ0E7QUFDQSxvQ0FBNEI7QUFDNUIscUNBQTZCO0FBQzdCLHlDQUFpQzs7QUFFakMsK0NBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDhDQUFzQztBQUN0QztBQUNBO0FBQ0EscUNBQTZCO0FBQzdCLHFDQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQW9CLGdCQUFnQjtBQUNwQztBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBb0IsZ0JBQWdCO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsYUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxhQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx5QkFBaUIsOEJBQThCO0FBQy9DO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQUk7QUFDSjs7QUFFQSw0REFBb0Q7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQW1CLDJCQUEyQjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwwQkFBa0IsY0FBYztBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QixnQkFBZ0IsaUJBQWlCLHFFQUFxRSxFQUFFLGtCQUFrQixnQkFBZ0IsaUJBQWlCLHNFQUFzRSxFQUFFLGlCQUFpQixnQkFBZ0IsaUJBQWlCLHNFQUFzRSxFQUFFLGlCQUFpQixnQkFBZ0IsaUJBQWlCLHNFQUFzRSxFQUFFLGdCQUFnQixnQkFBZ0IsaUJBQWlCLHNFQUFzRSxFQUFFLGtCQUFrQixnQkFBZ0IsaUJBQWlCLHNFQUFzRSxFQUFFLGtCQUFrQixnQkFBZ0IsaUJBQWlCLHNFQUFzRSxFQUFFLGlCQUFpQixnQkFBZ0IsaUJBQWlCLHNFQUFzRSxFQUFFLGdCQUFnQixnQkFBZ0IsaUJBQWlCLHNFQUFzRSxFQUFFLGlCQUFpQixnQkFBZ0IsaUJBQWlCLHNFQUFzRSxFQUFFLGtCQUFrQixnQkFBZ0IsaUJBQWlCLHNFQUFzRSxFQUFFLGlCQUFpQixnQkFBZ0IsaUJBQWlCLHNFQUFzRSxFQUFFLGlCQUFpQixnQkFBZ0IsaUJBQWlCLHFFQUFxRSxFQUFFLGlCQUFpQixnQkFBZ0IsaUJBQWlCLHNFQUFzRSxFQUFFLG1CQUFtQixnQkFBZ0IsaUJBQWlCLHVFQUF1RSxFQUFFLGtCQUFrQixnQkFBZ0IsaUJBQWlCLHVFQUF1RSxFQUFFLGtCQUFrQixnQkFBZ0IsaUJBQWlCLHVFQUF1RSxFQUFFLGlCQUFpQixnQkFBZ0IsaUJBQWlCLHVFQUF1RSxFQUFFLG1CQUFtQixnQkFBZ0IsaUJBQWlCLHVFQUF1RSxFQUFFLG1CQUFtQixnQkFBZ0IsaUJBQWlCLHVFQUF1RSxFQUFFLGtCQUFrQixnQkFBZ0IsaUJBQWlCLHVFQUF1RSxFQUFFLGlCQUFpQixnQkFBZ0IsaUJBQWlCLHVFQUF1RSxFQUFFLGtCQUFrQixnQkFBZ0IsaUJBQWlCLHVFQUF1RSxFQUFFLG1CQUFtQixnQkFBZ0IsaUJBQWlCLHVFQUF1RSxFQUFFLGtCQUFrQixnQkFBZ0IsaUJBQWlCLHVFQUF1RSxFQUFFLGlCQUFpQixnQkFBZ0IsaUJBQWlCLHNFQUFzRSxFQUFFLGlCQUFpQixnQkFBZ0IsaUJBQWlCLHVFQUF1RSxFQUFFLG1CQUFtQixnQkFBZ0IsaUJBQWlCLHdFQUF3RSxFQUFFLGtCQUFrQixnQkFBZ0IsaUJBQWlCLHdFQUF3RSxFQUFFLGtCQUFrQixnQkFBZ0IsaUJBQWlCLHdFQUF3RSxFQUFFLGlCQUFpQixnQkFBZ0IsaUJBQWlCLHdFQUF3RSxFQUFFLG1CQUFtQixnQkFBZ0IsaUJBQWlCLHdFQUF3RSxFQUFFLG1CQUFtQixnQkFBZ0IsaUJBQWlCLHdFQUF3RSxFQUFFLGtCQUFrQixnQkFBZ0IsaUJBQWlCLHdFQUF3RSxFQUFFLGlCQUFpQixnQkFBZ0IsaUJBQWlCLHdFQUF3RSxFQUFFLGtCQUFrQixnQkFBZ0IsaUJBQWlCLHdFQUF3RSxFQUFFLG1CQUFtQixnQkFBZ0IsaUJBQWlCLHdFQUF3RSxFQUFFLGtCQUFrQixnQkFBZ0IsaUJBQWlCLHdFQUF3RSxFQUFFLG1CQUFtQixnQkFBZ0IsaUJBQWlCLHNFQUFzRSxFQUFFLG1CQUFtQixnQkFBZ0IsaUJBQWlCLHVFQUF1RSxFQUFFLHFCQUFxQixnQkFBZ0IsaUJBQWlCLHdFQUF3RSxFQUFFLG9CQUFvQixnQkFBZ0IsaUJBQWlCLHdFQUF3RSxFQUFFLG9CQUFvQixnQkFBZ0IsaUJBQWlCLHdFQUF3RSxFQUFFLG1CQUFtQixnQkFBZ0IsaUJBQWlCLHdFQUF3RSxFQUFFLHFCQUFxQixnQkFBZ0IsaUJBQWlCLHdFQUF3RSxFQUFFLHFCQUFxQixnQkFBZ0IsaUJBQWlCLHdFQUF3RSxFQUFFLG9CQUFvQixnQkFBZ0IsaUJBQWlCLHdFQUF3RSxFQUFFLG1CQUFtQixnQkFBZ0IsaUJBQWlCLHdFQUF3RSxFQUFFLG9CQUFvQixnQkFBZ0IsaUJBQWlCLHdFQUF3RSxFQUFFLHFCQUFxQixnQkFBZ0IsaUJBQWlCLHdFQUF3RSxFQUFFLG9CQUFvQixnQkFBZ0IsaUJBQWlCLHdFQUF3RSxFQUFFOztBQUUva1A7Ozs7Ozs7QUNQQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLGdDQUFnQyxVQUFVLEVBQUU7QUFDNUMsQyIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHRmdW5jdGlvbiBob3REaXNwb3NlQ2h1bmsoY2h1bmtJZCkge1xuIFx0XHRkZWxldGUgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdO1xuIFx0fVxuIFx0dmFyIHBhcmVudEhvdFVwZGF0ZUNhbGxiYWNrID0gdGhpc1tcIndlYnBhY2tIb3RVcGRhdGVcIl07XG4gXHR0aGlzW1wid2VicGFja0hvdFVwZGF0ZVwiXSA9IFxyXG4gXHRmdW5jdGlvbiB3ZWJwYWNrSG90VXBkYXRlQ2FsbGJhY2soY2h1bmtJZCwgbW9yZU1vZHVsZXMpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdGhvdEFkZFVwZGF0ZUNodW5rKGNodW5rSWQsIG1vcmVNb2R1bGVzKTtcclxuIFx0XHRpZihwYXJlbnRIb3RVcGRhdGVDYWxsYmFjaykgcGFyZW50SG90VXBkYXRlQ2FsbGJhY2soY2h1bmtJZCwgbW9yZU1vZHVsZXMpO1xyXG4gXHR9IDtcclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdERvd25sb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0dmFyIGhlYWQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF07XHJcbiBcdFx0dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XHJcbiBcdFx0c2NyaXB0LnR5cGUgPSBcInRleHQvamF2YXNjcmlwdFwiO1xyXG4gXHRcdHNjcmlwdC5jaGFyc2V0ID0gXCJ1dGYtOFwiO1xyXG4gXHRcdHNjcmlwdC5zcmMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLnAgKyBcIlwiICsgY2h1bmtJZCArIFwiLlwiICsgaG90Q3VycmVudEhhc2ggKyBcIi5ob3QtdXBkYXRlLmpzXCI7XHJcbiBcdFx0aGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3REb3dubG9hZE1hbmlmZXN0KHJlcXVlc3RUaW1lb3V0KSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHRyZXF1ZXN0VGltZW91dCA9IHJlcXVlc3RUaW1lb3V0IHx8IDEwMDAwO1xyXG4gXHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuIFx0XHRcdGlmKHR5cGVvZiBYTUxIdHRwUmVxdWVzdCA9PT0gXCJ1bmRlZmluZWRcIilcclxuIFx0XHRcdFx0cmV0dXJuIHJlamVjdChuZXcgRXJyb3IoXCJObyBicm93c2VyIHN1cHBvcnRcIikpO1xyXG4gXHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0dmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuIFx0XHRcdFx0dmFyIHJlcXVlc3RQYXRoID0gX193ZWJwYWNrX3JlcXVpcmVfXy5wICsgXCJcIiArIGhvdEN1cnJlbnRIYXNoICsgXCIuaG90LXVwZGF0ZS5qc29uXCI7XHJcbiBcdFx0XHRcdHJlcXVlc3Qub3BlbihcIkdFVFwiLCByZXF1ZXN0UGF0aCwgdHJ1ZSk7XHJcbiBcdFx0XHRcdHJlcXVlc3QudGltZW91dCA9IHJlcXVlc3RUaW1lb3V0O1xyXG4gXHRcdFx0XHRyZXF1ZXN0LnNlbmQobnVsbCk7XHJcbiBcdFx0XHR9IGNhdGNoKGVycikge1xyXG4gXHRcdFx0XHRyZXR1cm4gcmVqZWN0KGVycik7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRyZXF1ZXN0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG4gXHRcdFx0XHRpZihyZXF1ZXN0LnJlYWR5U3RhdGUgIT09IDQpIHJldHVybjtcclxuIFx0XHRcdFx0aWYocmVxdWVzdC5zdGF0dXMgPT09IDApIHtcclxuIFx0XHRcdFx0XHQvLyB0aW1lb3V0XHJcbiBcdFx0XHRcdFx0cmVqZWN0KG5ldyBFcnJvcihcIk1hbmlmZXN0IHJlcXVlc3QgdG8gXCIgKyByZXF1ZXN0UGF0aCArIFwiIHRpbWVkIG91dC5cIikpO1xyXG4gXHRcdFx0XHR9IGVsc2UgaWYocmVxdWVzdC5zdGF0dXMgPT09IDQwNCkge1xyXG4gXHRcdFx0XHRcdC8vIG5vIHVwZGF0ZSBhdmFpbGFibGVcclxuIFx0XHRcdFx0XHRyZXNvbHZlKCk7XHJcbiBcdFx0XHRcdH0gZWxzZSBpZihyZXF1ZXN0LnN0YXR1cyAhPT0gMjAwICYmIHJlcXVlc3Quc3RhdHVzICE9PSAzMDQpIHtcclxuIFx0XHRcdFx0XHQvLyBvdGhlciBmYWlsdXJlXHJcbiBcdFx0XHRcdFx0cmVqZWN0KG5ldyBFcnJvcihcIk1hbmlmZXN0IHJlcXVlc3QgdG8gXCIgKyByZXF1ZXN0UGF0aCArIFwiIGZhaWxlZC5cIikpO1xyXG4gXHRcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRcdC8vIHN1Y2Nlc3NcclxuIFx0XHRcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHRcdFx0dmFyIHVwZGF0ZSA9IEpTT04ucGFyc2UocmVxdWVzdC5yZXNwb25zZVRleHQpO1xyXG4gXHRcdFx0XHRcdH0gY2F0Y2goZSkge1xyXG4gXHRcdFx0XHRcdFx0cmVqZWN0KGUpO1xyXG4gXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRyZXNvbHZlKHVwZGF0ZSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH07XHJcbiBcdFx0fSk7XHJcbiBcdH1cclxuXG4gXHRcclxuIFx0XHJcbiBcdHZhciBob3RBcHBseU9uVXBkYXRlID0gdHJ1ZTtcclxuIFx0dmFyIGhvdEN1cnJlbnRIYXNoID0gXCJiYmFjNDRlZjI0NmNmODI2NWFkYlwiOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdHZhciBob3RSZXF1ZXN0VGltZW91dCA9IDEwMDAwO1xyXG4gXHR2YXIgaG90Q3VycmVudE1vZHVsZURhdGEgPSB7fTtcclxuIFx0dmFyIGhvdEN1cnJlbnRDaGlsZE1vZHVsZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHR2YXIgaG90Q3VycmVudFBhcmVudHMgPSBbXTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHR2YXIgaG90Q3VycmVudFBhcmVudHNUZW1wID0gW107IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdENyZWF0ZVJlcXVpcmUobW9kdWxlSWQpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdHZhciBtZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdGlmKCFtZSkgcmV0dXJuIF9fd2VicGFja19yZXF1aXJlX187XHJcbiBcdFx0dmFyIGZuID0gZnVuY3Rpb24ocmVxdWVzdCkge1xyXG4gXHRcdFx0aWYobWUuaG90LmFjdGl2ZSkge1xyXG4gXHRcdFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdKSB7XHJcbiBcdFx0XHRcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XS5wYXJlbnRzLmluZGV4T2YobW9kdWxlSWQpIDwgMClcclxuIFx0XHRcdFx0XHRcdGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0ucGFyZW50cy5wdXNoKG1vZHVsZUlkKTtcclxuIFx0XHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFttb2R1bGVJZF07XHJcbiBcdFx0XHRcdFx0aG90Q3VycmVudENoaWxkTW9kdWxlID0gcmVxdWVzdDtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihtZS5jaGlsZHJlbi5pbmRleE9mKHJlcXVlc3QpIDwgMClcclxuIFx0XHRcdFx0XHRtZS5jaGlsZHJlbi5wdXNoKHJlcXVlc3QpO1xyXG4gXHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0Y29uc29sZS53YXJuKFwiW0hNUl0gdW5leHBlY3RlZCByZXF1aXJlKFwiICsgcmVxdWVzdCArIFwiKSBmcm9tIGRpc3Bvc2VkIG1vZHVsZSBcIiArIG1vZHVsZUlkKTtcclxuIFx0XHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbXTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKHJlcXVlc3QpO1xyXG4gXHRcdH07XHJcbiBcdFx0dmFyIE9iamVjdEZhY3RvcnkgPSBmdW5jdGlvbiBPYmplY3RGYWN0b3J5KG5hbWUpIHtcclxuIFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcclxuIFx0XHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcclxuIFx0XHRcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfX1tuYW1lXTtcclxuIFx0XHRcdFx0fSxcclxuIFx0XHRcdFx0c2V0OiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gXHRcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX19bbmFtZV0gPSB2YWx1ZTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fTtcclxuIFx0XHR9O1xyXG4gXHRcdGZvcih2YXIgbmFtZSBpbiBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoX193ZWJwYWNrX3JlcXVpcmVfXywgbmFtZSkgJiYgbmFtZSAhPT0gXCJlXCIpIHtcclxuIFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGZuLCBuYW1lLCBPYmplY3RGYWN0b3J5KG5hbWUpKTtcclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFx0Zm4uZSA9IGZ1bmN0aW9uKGNodW5rSWQpIHtcclxuIFx0XHRcdGlmKGhvdFN0YXR1cyA9PT0gXCJyZWFkeVwiKVxyXG4gXHRcdFx0XHRob3RTZXRTdGF0dXMoXCJwcmVwYXJlXCIpO1xyXG4gXHRcdFx0aG90Q2h1bmtzTG9hZGluZysrO1xyXG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uZShjaHVua0lkKS50aGVuKGZpbmlzaENodW5rTG9hZGluZywgZnVuY3Rpb24oZXJyKSB7XHJcbiBcdFx0XHRcdGZpbmlzaENodW5rTG9hZGluZygpO1xyXG4gXHRcdFx0XHR0aHJvdyBlcnI7XHJcbiBcdFx0XHR9KTtcclxuIFx0XHJcbiBcdFx0XHRmdW5jdGlvbiBmaW5pc2hDaHVua0xvYWRpbmcoKSB7XHJcbiBcdFx0XHRcdGhvdENodW5rc0xvYWRpbmctLTtcclxuIFx0XHRcdFx0aWYoaG90U3RhdHVzID09PSBcInByZXBhcmVcIikge1xyXG4gXHRcdFx0XHRcdGlmKCFob3RXYWl0aW5nRmlsZXNNYXBbY2h1bmtJZF0pIHtcclxuIFx0XHRcdFx0XHRcdGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRpZihob3RDaHVua3NMb2FkaW5nID09PSAwICYmIGhvdFdhaXRpbmdGaWxlcyA9PT0gMCkge1xyXG4gXHRcdFx0XHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH07XHJcbiBcdFx0cmV0dXJuIGZuO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RDcmVhdGVNb2R1bGUobW9kdWxlSWQpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdHZhciBob3QgPSB7XHJcbiBcdFx0XHQvLyBwcml2YXRlIHN0dWZmXHJcbiBcdFx0XHRfYWNjZXB0ZWREZXBlbmRlbmNpZXM6IHt9LFxyXG4gXHRcdFx0X2RlY2xpbmVkRGVwZW5kZW5jaWVzOiB7fSxcclxuIFx0XHRcdF9zZWxmQWNjZXB0ZWQ6IGZhbHNlLFxyXG4gXHRcdFx0X3NlbGZEZWNsaW5lZDogZmFsc2UsXHJcbiBcdFx0XHRfZGlzcG9zZUhhbmRsZXJzOiBbXSxcclxuIFx0XHRcdF9tYWluOiBob3RDdXJyZW50Q2hpbGRNb2R1bGUgIT09IG1vZHVsZUlkLFxyXG4gXHRcclxuIFx0XHRcdC8vIE1vZHVsZSBBUElcclxuIFx0XHRcdGFjdGl2ZTogdHJ1ZSxcclxuIFx0XHRcdGFjY2VwdDogZnVuY3Rpb24oZGVwLCBjYWxsYmFjaykge1xyXG4gXHRcdFx0XHRpZih0eXBlb2YgZGVwID09PSBcInVuZGVmaW5lZFwiKVxyXG4gXHRcdFx0XHRcdGhvdC5fc2VsZkFjY2VwdGVkID0gdHJ1ZTtcclxuIFx0XHRcdFx0ZWxzZSBpZih0eXBlb2YgZGVwID09PSBcImZ1bmN0aW9uXCIpXHJcbiBcdFx0XHRcdFx0aG90Ll9zZWxmQWNjZXB0ZWQgPSBkZXA7XHJcbiBcdFx0XHRcdGVsc2UgaWYodHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIilcclxuIFx0XHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgZGVwLmxlbmd0aDsgaSsrKVxyXG4gXHRcdFx0XHRcdFx0aG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBbaV1dID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7fTtcclxuIFx0XHRcdFx0ZWxzZVxyXG4gXHRcdFx0XHRcdGhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwXSA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkge307XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0ZGVjbGluZTogZnVuY3Rpb24oZGVwKSB7XHJcbiBcdFx0XHRcdGlmKHR5cGVvZiBkZXAgPT09IFwidW5kZWZpbmVkXCIpXHJcbiBcdFx0XHRcdFx0aG90Ll9zZWxmRGVjbGluZWQgPSB0cnVlO1xyXG4gXHRcdFx0XHRlbHNlIGlmKHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIpXHJcbiBcdFx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGRlcC5sZW5ndGg7IGkrKylcclxuIFx0XHRcdFx0XHRcdGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwW2ldXSA9IHRydWU7XHJcbiBcdFx0XHRcdGVsc2VcclxuIFx0XHRcdFx0XHRob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW2RlcF0gPSB0cnVlO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdGRpc3Bvc2U6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdGhvdC5fZGlzcG9zZUhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdGFkZERpc3Bvc2VIYW5kbGVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gXHRcdFx0XHRob3QuX2Rpc3Bvc2VIYW5kbGVycy5wdXNoKGNhbGxiYWNrKTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRyZW1vdmVEaXNwb3NlSGFuZGxlcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuIFx0XHRcdFx0dmFyIGlkeCA9IGhvdC5fZGlzcG9zZUhhbmRsZXJzLmluZGV4T2YoY2FsbGJhY2spO1xyXG4gXHRcdFx0XHRpZihpZHggPj0gMCkgaG90Ll9kaXNwb3NlSGFuZGxlcnMuc3BsaWNlKGlkeCwgMSk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcclxuIFx0XHRcdC8vIE1hbmFnZW1lbnQgQVBJXHJcbiBcdFx0XHRjaGVjazogaG90Q2hlY2ssXHJcbiBcdFx0XHRhcHBseTogaG90QXBwbHksXHJcbiBcdFx0XHRzdGF0dXM6IGZ1bmN0aW9uKGwpIHtcclxuIFx0XHRcdFx0aWYoIWwpIHJldHVybiBob3RTdGF0dXM7XHJcbiBcdFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzLnB1c2gobCk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0YWRkU3RhdHVzSGFuZGxlcjogZnVuY3Rpb24obCkge1xyXG4gXHRcdFx0XHRob3RTdGF0dXNIYW5kbGVycy5wdXNoKGwpO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdHJlbW92ZVN0YXR1c0hhbmRsZXI6IGZ1bmN0aW9uKGwpIHtcclxuIFx0XHRcdFx0dmFyIGlkeCA9IGhvdFN0YXR1c0hhbmRsZXJzLmluZGV4T2YobCk7XHJcbiBcdFx0XHRcdGlmKGlkeCA+PSAwKSBob3RTdGF0dXNIYW5kbGVycy5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdH0sXHJcbiBcdFxyXG4gXHRcdFx0Ly9pbmhlcml0IGZyb20gcHJldmlvdXMgZGlzcG9zZSBjYWxsXHJcbiBcdFx0XHRkYXRhOiBob3RDdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF1cclxuIFx0XHR9O1xyXG4gXHRcdGhvdEN1cnJlbnRDaGlsZE1vZHVsZSA9IHVuZGVmaW5lZDtcclxuIFx0XHRyZXR1cm4gaG90O1xyXG4gXHR9XHJcbiBcdFxyXG4gXHR2YXIgaG90U3RhdHVzSGFuZGxlcnMgPSBbXTtcclxuIFx0dmFyIGhvdFN0YXR1cyA9IFwiaWRsZVwiO1xyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90U2V0U3RhdHVzKG5ld1N0YXR1cykge1xyXG4gXHRcdGhvdFN0YXR1cyA9IG5ld1N0YXR1cztcclxuIFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgaG90U3RhdHVzSGFuZGxlcnMubGVuZ3RoOyBpKyspXHJcbiBcdFx0XHRob3RTdGF0dXNIYW5kbGVyc1tpXS5jYWxsKG51bGwsIG5ld1N0YXR1cyk7XHJcbiBcdH1cclxuIFx0XHJcbiBcdC8vIHdoaWxlIGRvd25sb2FkaW5nXHJcbiBcdHZhciBob3RXYWl0aW5nRmlsZXMgPSAwO1xyXG4gXHR2YXIgaG90Q2h1bmtzTG9hZGluZyA9IDA7XHJcbiBcdHZhciBob3RXYWl0aW5nRmlsZXNNYXAgPSB7fTtcclxuIFx0dmFyIGhvdFJlcXVlc3RlZEZpbGVzTWFwID0ge307XHJcbiBcdHZhciBob3RBdmFpbGFibGVGaWxlc01hcCA9IHt9O1xyXG4gXHR2YXIgaG90RGVmZXJyZWQ7XHJcbiBcdFxyXG4gXHQvLyBUaGUgdXBkYXRlIGluZm9cclxuIFx0dmFyIGhvdFVwZGF0ZSwgaG90VXBkYXRlTmV3SGFzaDtcclxuIFx0XHJcbiBcdGZ1bmN0aW9uIHRvTW9kdWxlSWQoaWQpIHtcclxuIFx0XHR2YXIgaXNOdW1iZXIgPSAoK2lkKSArIFwiXCIgPT09IGlkO1xyXG4gXHRcdHJldHVybiBpc051bWJlciA/ICtpZCA6IGlkO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RDaGVjayhhcHBseSkge1xyXG4gXHRcdGlmKGhvdFN0YXR1cyAhPT0gXCJpZGxlXCIpIHRocm93IG5ldyBFcnJvcihcImNoZWNrKCkgaXMgb25seSBhbGxvd2VkIGluIGlkbGUgc3RhdHVzXCIpO1xyXG4gXHRcdGhvdEFwcGx5T25VcGRhdGUgPSBhcHBseTtcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJjaGVja1wiKTtcclxuIFx0XHRyZXR1cm4gaG90RG93bmxvYWRNYW5pZmVzdChob3RSZXF1ZXN0VGltZW91dCkudGhlbihmdW5jdGlvbih1cGRhdGUpIHtcclxuIFx0XHRcdGlmKCF1cGRhdGUpIHtcclxuIFx0XHRcdFx0aG90U2V0U3RhdHVzKFwiaWRsZVwiKTtcclxuIFx0XHRcdFx0cmV0dXJuIG51bGw7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcCA9IHt9O1xyXG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzTWFwID0ge307XHJcbiBcdFx0XHRob3RBdmFpbGFibGVGaWxlc01hcCA9IHVwZGF0ZS5jO1xyXG4gXHRcdFx0aG90VXBkYXRlTmV3SGFzaCA9IHVwZGF0ZS5oO1xyXG4gXHRcclxuIFx0XHRcdGhvdFNldFN0YXR1cyhcInByZXBhcmVcIik7XHJcbiBcdFx0XHR2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG4gXHRcdFx0XHRob3REZWZlcnJlZCA9IHtcclxuIFx0XHRcdFx0XHRyZXNvbHZlOiByZXNvbHZlLFxyXG4gXHRcdFx0XHRcdHJlamVjdDogcmVqZWN0XHJcbiBcdFx0XHRcdH07XHJcbiBcdFx0XHR9KTtcclxuIFx0XHRcdGhvdFVwZGF0ZSA9IHt9O1xyXG4gXHRcdFx0dmFyIGNodW5rSWQgPSAwO1xyXG4gXHRcdFx0eyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWxvbmUtYmxvY2tzXHJcbiBcdFx0XHRcdC8qZ2xvYmFscyBjaHVua0lkICovXHJcbiBcdFx0XHRcdGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0aWYoaG90U3RhdHVzID09PSBcInByZXBhcmVcIiAmJiBob3RDaHVua3NMb2FkaW5nID09PSAwICYmIGhvdFdhaXRpbmdGaWxlcyA9PT0gMCkge1xyXG4gXHRcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRyZXR1cm4gcHJvbWlzZTtcclxuIFx0XHR9KTtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90QWRkVXBkYXRlQ2h1bmsoY2h1bmtJZCwgbW9yZU1vZHVsZXMpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdGlmKCFob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSB8fCAhaG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0pXHJcbiBcdFx0XHRyZXR1cm47XHJcbiBcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0gPSBmYWxzZTtcclxuIFx0XHRmb3IodmFyIG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRob3RVcGRhdGVbbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHRpZigtLWhvdFdhaXRpbmdGaWxlcyA9PT0gMCAmJiBob3RDaHVua3NMb2FkaW5nID09PSAwKSB7XHJcbiBcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKSB7XHJcbiBcdFx0aWYoIWhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdKSB7XHJcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXNNYXBbY2h1bmtJZF0gPSB0cnVlO1xyXG4gXHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSA9IHRydWU7XHJcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXMrKztcclxuIFx0XHRcdGhvdERvd25sb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RVcGRhdGVEb3dubG9hZGVkKCkge1xyXG4gXHRcdGhvdFNldFN0YXR1cyhcInJlYWR5XCIpO1xyXG4gXHRcdHZhciBkZWZlcnJlZCA9IGhvdERlZmVycmVkO1xyXG4gXHRcdGhvdERlZmVycmVkID0gbnVsbDtcclxuIFx0XHRpZighZGVmZXJyZWQpIHJldHVybjtcclxuIFx0XHRpZihob3RBcHBseU9uVXBkYXRlKSB7XHJcbiBcdFx0XHQvLyBXcmFwIGRlZmVycmVkIG9iamVjdCBpbiBQcm9taXNlIHRvIG1hcmsgaXQgYXMgYSB3ZWxsLWhhbmRsZWQgUHJvbWlzZSB0b1xyXG4gXHRcdFx0Ly8gYXZvaWQgdHJpZ2dlcmluZyB1bmNhdWdodCBleGNlcHRpb24gd2FybmluZyBpbiBDaHJvbWUuXHJcbiBcdFx0XHQvLyBTZWUgaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL2Nocm9taXVtL2lzc3Vlcy9kZXRhaWw/aWQ9NDY1NjY2XHJcbiBcdFx0XHRQcm9taXNlLnJlc29sdmUoKS50aGVuKGZ1bmN0aW9uKCkge1xyXG4gXHRcdFx0XHRyZXR1cm4gaG90QXBwbHkoaG90QXBwbHlPblVwZGF0ZSk7XHJcbiBcdFx0XHR9KS50aGVuKFxyXG4gXHRcdFx0XHRmdW5jdGlvbihyZXN1bHQpIHtcclxuIFx0XHRcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKHJlc3VsdCk7XHJcbiBcdFx0XHRcdH0sXHJcbiBcdFx0XHRcdGZ1bmN0aW9uKGVycikge1xyXG4gXHRcdFx0XHRcdGRlZmVycmVkLnJlamVjdChlcnIpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHQpO1xyXG4gXHRcdH0gZWxzZSB7XHJcbiBcdFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW107XHJcbiBcdFx0XHRmb3IodmFyIGlkIGluIGhvdFVwZGF0ZSkge1xyXG4gXHRcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoaG90VXBkYXRlLCBpZCkpIHtcclxuIFx0XHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaCh0b01vZHVsZUlkKGlkKSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHRcdGRlZmVycmVkLnJlc29sdmUob3V0ZGF0ZWRNb2R1bGVzKTtcclxuIFx0XHR9XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdEFwcGx5KG9wdGlvbnMpIHtcclxuIFx0XHRpZihob3RTdGF0dXMgIT09IFwicmVhZHlcIikgdGhyb3cgbmV3IEVycm9yKFwiYXBwbHkoKSBpcyBvbmx5IGFsbG93ZWQgaW4gcmVhZHkgc3RhdHVzXCIpO1xyXG4gXHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG4gXHRcclxuIFx0XHR2YXIgY2I7XHJcbiBcdFx0dmFyIGk7XHJcbiBcdFx0dmFyIGo7XHJcbiBcdFx0dmFyIG1vZHVsZTtcclxuIFx0XHR2YXIgbW9kdWxlSWQ7XHJcbiBcdFxyXG4gXHRcdGZ1bmN0aW9uIGdldEFmZmVjdGVkU3R1ZmYodXBkYXRlTW9kdWxlSWQpIHtcclxuIFx0XHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbdXBkYXRlTW9kdWxlSWRdO1xyXG4gXHRcdFx0dmFyIG91dGRhdGVkRGVwZW5kZW5jaWVzID0ge307XHJcbiBcdFxyXG4gXHRcdFx0dmFyIHF1ZXVlID0gb3V0ZGF0ZWRNb2R1bGVzLnNsaWNlKCkubWFwKGZ1bmN0aW9uKGlkKSB7XHJcbiBcdFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdFx0Y2hhaW46IFtpZF0sXHJcbiBcdFx0XHRcdFx0aWQ6IGlkXHJcbiBcdFx0XHRcdH07XHJcbiBcdFx0XHR9KTtcclxuIFx0XHRcdHdoaWxlKHF1ZXVlLmxlbmd0aCA+IDApIHtcclxuIFx0XHRcdFx0dmFyIHF1ZXVlSXRlbSA9IHF1ZXVlLnBvcCgpO1xyXG4gXHRcdFx0XHR2YXIgbW9kdWxlSWQgPSBxdWV1ZUl0ZW0uaWQ7XHJcbiBcdFx0XHRcdHZhciBjaGFpbiA9IHF1ZXVlSXRlbS5jaGFpbjtcclxuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdGlmKCFtb2R1bGUgfHwgbW9kdWxlLmhvdC5fc2VsZkFjY2VwdGVkKVxyXG4gXHRcdFx0XHRcdGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRpZihtb2R1bGUuaG90Ll9zZWxmRGVjbGluZWQpIHtcclxuIFx0XHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWRlY2xpbmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4sXHJcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWRcclxuIFx0XHRcdFx0XHR9O1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKG1vZHVsZS5ob3QuX21haW4pIHtcclxuIFx0XHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdFx0dHlwZTogXCJ1bmFjY2VwdGVkXCIsXHJcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4sXHJcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWRcclxuIFx0XHRcdFx0XHR9O1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBtb2R1bGUucGFyZW50cy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0XHRcdHZhciBwYXJlbnRJZCA9IG1vZHVsZS5wYXJlbnRzW2ldO1xyXG4gXHRcdFx0XHRcdHZhciBwYXJlbnQgPSBpbnN0YWxsZWRNb2R1bGVzW3BhcmVudElkXTtcclxuIFx0XHRcdFx0XHRpZighcGFyZW50KSBjb250aW51ZTtcclxuIFx0XHRcdFx0XHRpZihwYXJlbnQuaG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pIHtcclxuIFx0XHRcdFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGVjbGluZWRcIixcclxuIFx0XHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLmNvbmNhdChbcGFyZW50SWRdKSxcclxuIFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdFx0XHRwYXJlbnRJZDogcGFyZW50SWRcclxuIFx0XHRcdFx0XHRcdH07XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGlmKG91dGRhdGVkTW9kdWxlcy5pbmRleE9mKHBhcmVudElkKSA+PSAwKSBjb250aW51ZTtcclxuIFx0XHRcdFx0XHRpZihwYXJlbnQuaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pIHtcclxuIFx0XHRcdFx0XHRcdGlmKCFvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0pXHJcbiBcdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSA9IFtdO1xyXG4gXHRcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdLCBbbW9kdWxlSWRdKTtcclxuIFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRkZWxldGUgb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdO1xyXG4gXHRcdFx0XHRcdG91dGRhdGVkTW9kdWxlcy5wdXNoKHBhcmVudElkKTtcclxuIFx0XHRcdFx0XHRxdWV1ZS5wdXNoKHtcclxuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXHJcbiBcdFx0XHRcdFx0XHRpZDogcGFyZW50SWRcclxuIFx0XHRcdFx0XHR9KTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcclxuIFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdHR5cGU6IFwiYWNjZXB0ZWRcIixcclxuIFx0XHRcdFx0bW9kdWxlSWQ6IHVwZGF0ZU1vZHVsZUlkLFxyXG4gXHRcdFx0XHRvdXRkYXRlZE1vZHVsZXM6IG91dGRhdGVkTW9kdWxlcyxcclxuIFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXM6IG91dGRhdGVkRGVwZW5kZW5jaWVzXHJcbiBcdFx0XHR9O1xyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0ZnVuY3Rpb24gYWRkQWxsVG9TZXQoYSwgYikge1xyXG4gXHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGIubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdFx0dmFyIGl0ZW0gPSBiW2ldO1xyXG4gXHRcdFx0XHRpZihhLmluZGV4T2YoaXRlbSkgPCAwKVxyXG4gXHRcdFx0XHRcdGEucHVzaChpdGVtKTtcclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIGF0IGJlZ2luIGFsbCB1cGRhdGVzIG1vZHVsZXMgYXJlIG91dGRhdGVkXHJcbiBcdFx0Ly8gdGhlIFwib3V0ZGF0ZWRcIiBzdGF0dXMgY2FuIHByb3BhZ2F0ZSB0byBwYXJlbnRzIGlmIHRoZXkgZG9uJ3QgYWNjZXB0IHRoZSBjaGlsZHJlblxyXG4gXHRcdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xyXG4gXHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbXTtcclxuIFx0XHR2YXIgYXBwbGllZFVwZGF0ZSA9IHt9O1xyXG4gXHRcclxuIFx0XHR2YXIgd2FyblVuZXhwZWN0ZWRSZXF1aXJlID0gZnVuY3Rpb24gd2FyblVuZXhwZWN0ZWRSZXF1aXJlKCkge1xyXG4gXHRcdFx0Y29uc29sZS53YXJuKFwiW0hNUl0gdW5leHBlY3RlZCByZXF1aXJlKFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgXCIpIHRvIGRpc3Bvc2VkIG1vZHVsZVwiKTtcclxuIFx0XHR9O1xyXG4gXHRcclxuIFx0XHRmb3IodmFyIGlkIGluIGhvdFVwZGF0ZSkge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGhvdFVwZGF0ZSwgaWQpKSB7XHJcbiBcdFx0XHRcdG1vZHVsZUlkID0gdG9Nb2R1bGVJZChpZCk7XHJcbiBcdFx0XHRcdHZhciByZXN1bHQ7XHJcbiBcdFx0XHRcdGlmKGhvdFVwZGF0ZVtpZF0pIHtcclxuIFx0XHRcdFx0XHRyZXN1bHQgPSBnZXRBZmZlY3RlZFN0dWZmKG1vZHVsZUlkKTtcclxuIFx0XHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0XHRyZXN1bHQgPSB7XHJcbiBcdFx0XHRcdFx0XHR0eXBlOiBcImRpc3Bvc2VkXCIsXHJcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogaWRcclxuIFx0XHRcdFx0XHR9O1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdHZhciBhYm9ydEVycm9yID0gZmFsc2U7XHJcbiBcdFx0XHRcdHZhciBkb0FwcGx5ID0gZmFsc2U7XHJcbiBcdFx0XHRcdHZhciBkb0Rpc3Bvc2UgPSBmYWxzZTtcclxuIFx0XHRcdFx0dmFyIGNoYWluSW5mbyA9IFwiXCI7XHJcbiBcdFx0XHRcdGlmKHJlc3VsdC5jaGFpbikge1xyXG4gXHRcdFx0XHRcdGNoYWluSW5mbyA9IFwiXFxuVXBkYXRlIHByb3BhZ2F0aW9uOiBcIiArIHJlc3VsdC5jaGFpbi5qb2luKFwiIC0+IFwiKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRzd2l0Y2gocmVzdWx0LnR5cGUpIHtcclxuIFx0XHRcdFx0XHRjYXNlIFwic2VsZi1kZWNsaW5lZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkRlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRGVjbGluZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFwiQWJvcnRlZCBiZWNhdXNlIG9mIHNlbGYgZGVjbGluZTogXCIgKyByZXN1bHQubW9kdWxlSWQgKyBjaGFpbkluZm8pO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcImRlY2xpbmVkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRGVjbGluZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25EZWNsaW5lZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRGVjbGluZWQpXHJcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXCJBYm9ydGVkIGJlY2F1c2Ugb2YgZGVjbGluZWQgZGVwZW5kZW5jeTogXCIgKyByZXN1bHQubW9kdWxlSWQgKyBcIiBpbiBcIiArIHJlc3VsdC5wYXJlbnRJZCArIGNoYWluSW5mbyk7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRjYXNlIFwidW5hY2NlcHRlZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vblVuYWNjZXB0ZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25VbmFjY2VwdGVkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVVbmFjY2VwdGVkKVxyXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFwiQWJvcnRlZCBiZWNhdXNlIFwiICsgbW9kdWxlSWQgKyBcIiBpcyBub3QgYWNjZXB0ZWRcIiArIGNoYWluSW5mbyk7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRjYXNlIFwiYWNjZXB0ZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25BY2NlcHRlZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkFjY2VwdGVkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRkb0FwcGx5ID0gdHJ1ZTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJkaXNwb3NlZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkRpc3Bvc2VkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRGlzcG9zZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGRvRGlzcG9zZSA9IHRydWU7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRkZWZhdWx0OlxyXG4gXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiVW5leGNlcHRpb24gdHlwZSBcIiArIHJlc3VsdC50eXBlKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihhYm9ydEVycm9yKSB7XHJcbiBcdFx0XHRcdFx0aG90U2V0U3RhdHVzKFwiYWJvcnRcIik7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGFib3J0RXJyb3IpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKGRvQXBwbHkpIHtcclxuIFx0XHRcdFx0XHRhcHBsaWVkVXBkYXRlW21vZHVsZUlkXSA9IGhvdFVwZGF0ZVttb2R1bGVJZF07XHJcbiBcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWRNb2R1bGVzLCByZXN1bHQub3V0ZGF0ZWRNb2R1bGVzKTtcclxuIFx0XHRcdFx0XHRmb3IobW9kdWxlSWQgaW4gcmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XHJcbiBcdFx0XHRcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0XHRcdFx0aWYoIW91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSlcclxuIFx0XHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0gPSBbXTtcclxuIFx0XHRcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdLCByZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKTtcclxuIFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYoZG9EaXNwb3NlKSB7XHJcbiBcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWRNb2R1bGVzLCBbcmVzdWx0Lm1vZHVsZUlkXSk7XHJcbiBcdFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSB3YXJuVW5leHBlY3RlZFJlcXVpcmU7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIFN0b3JlIHNlbGYgYWNjZXB0ZWQgb3V0ZGF0ZWQgbW9kdWxlcyB0byByZXF1aXJlIHRoZW0gbGF0ZXIgYnkgdGhlIG1vZHVsZSBzeXN0ZW1cclxuIFx0XHR2YXIgb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzID0gW107XHJcbiBcdFx0Zm9yKGkgPSAwOyBpIDwgb3V0ZGF0ZWRNb2R1bGVzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRtb2R1bGVJZCA9IG91dGRhdGVkTW9kdWxlc1tpXTtcclxuIFx0XHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdICYmIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmhvdC5fc2VsZkFjY2VwdGVkKVxyXG4gXHRcdFx0XHRvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMucHVzaCh7XHJcbiBcdFx0XHRcdFx0bW9kdWxlOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRlcnJvckhhbmRsZXI6IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmhvdC5fc2VsZkFjY2VwdGVkXHJcbiBcdFx0XHRcdH0pO1xyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gTm93IGluIFwiZGlzcG9zZVwiIHBoYXNlXHJcbiBcdFx0aG90U2V0U3RhdHVzKFwiZGlzcG9zZVwiKTtcclxuIFx0XHRPYmplY3Qua2V5cyhob3RBdmFpbGFibGVGaWxlc01hcCkuZm9yRWFjaChmdW5jdGlvbihjaHVua0lkKSB7XHJcbiBcdFx0XHRpZihob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSA9PT0gZmFsc2UpIHtcclxuIFx0XHRcdFx0aG90RGlzcG9zZUNodW5rKGNodW5rSWQpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH0pO1xyXG4gXHRcclxuIFx0XHR2YXIgaWR4O1xyXG4gXHRcdHZhciBxdWV1ZSA9IG91dGRhdGVkTW9kdWxlcy5zbGljZSgpO1xyXG4gXHRcdHdoaWxlKHF1ZXVlLmxlbmd0aCA+IDApIHtcclxuIFx0XHRcdG1vZHVsZUlkID0gcXVldWUucG9wKCk7XHJcbiBcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdGlmKCFtb2R1bGUpIGNvbnRpbnVlO1xyXG4gXHRcclxuIFx0XHRcdHZhciBkYXRhID0ge307XHJcbiBcdFxyXG4gXHRcdFx0Ly8gQ2FsbCBkaXNwb3NlIGhhbmRsZXJzXHJcbiBcdFx0XHR2YXIgZGlzcG9zZUhhbmRsZXJzID0gbW9kdWxlLmhvdC5fZGlzcG9zZUhhbmRsZXJzO1xyXG4gXHRcdFx0Zm9yKGogPSAwOyBqIDwgZGlzcG9zZUhhbmRsZXJzLmxlbmd0aDsgaisrKSB7XHJcbiBcdFx0XHRcdGNiID0gZGlzcG9zZUhhbmRsZXJzW2pdO1xyXG4gXHRcdFx0XHRjYihkYXRhKTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdGhvdEN1cnJlbnRNb2R1bGVEYXRhW21vZHVsZUlkXSA9IGRhdGE7XHJcbiBcdFxyXG4gXHRcdFx0Ly8gZGlzYWJsZSBtb2R1bGUgKHRoaXMgZGlzYWJsZXMgcmVxdWlyZXMgZnJvbSB0aGlzIG1vZHVsZSlcclxuIFx0XHRcdG1vZHVsZS5ob3QuYWN0aXZlID0gZmFsc2U7XHJcbiBcdFxyXG4gXHRcdFx0Ly8gcmVtb3ZlIG1vZHVsZSBmcm9tIGNhY2hlXHJcbiBcdFx0XHRkZWxldGUgaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFxyXG4gXHRcdFx0Ly8gd2hlbiBkaXNwb3NpbmcgdGhlcmUgaXMgbm8gbmVlZCB0byBjYWxsIGRpc3Bvc2UgaGFuZGxlclxyXG4gXHRcdFx0ZGVsZXRlIG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcclxuIFx0XHJcbiBcdFx0XHQvLyByZW1vdmUgXCJwYXJlbnRzXCIgcmVmZXJlbmNlcyBmcm9tIGFsbCBjaGlsZHJlblxyXG4gXHRcdFx0Zm9yKGogPSAwOyBqIDwgbW9kdWxlLmNoaWxkcmVuLmxlbmd0aDsgaisrKSB7XHJcbiBcdFx0XHRcdHZhciBjaGlsZCA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlLmNoaWxkcmVuW2pdXTtcclxuIFx0XHRcdFx0aWYoIWNoaWxkKSBjb250aW51ZTtcclxuIFx0XHRcdFx0aWR4ID0gY2hpbGQucGFyZW50cy5pbmRleE9mKG1vZHVsZUlkKTtcclxuIFx0XHRcdFx0aWYoaWR4ID49IDApIHtcclxuIFx0XHRcdFx0XHRjaGlsZC5wYXJlbnRzLnNwbGljZShpZHgsIDEpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyByZW1vdmUgb3V0ZGF0ZWQgZGVwZW5kZW5jeSBmcm9tIG1vZHVsZSBjaGlsZHJlblxyXG4gXHRcdHZhciBkZXBlbmRlbmN5O1xyXG4gXHRcdHZhciBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcztcclxuIFx0XHRmb3IobW9kdWxlSWQgaW4gb3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRpZihtb2R1bGUpIHtcclxuIFx0XHRcdFx0XHRtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyA9IG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0XHRmb3IoaiA9IDA7IGogPCBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcy5sZW5ndGg7IGorKykge1xyXG4gXHRcdFx0XHRcdFx0ZGVwZW5kZW5jeSA9IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2pdO1xyXG4gXHRcdFx0XHRcdFx0aWR4ID0gbW9kdWxlLmNoaWxkcmVuLmluZGV4T2YoZGVwZW5kZW5jeSk7XHJcbiBcdFx0XHRcdFx0XHRpZihpZHggPj0gMCkgbW9kdWxlLmNoaWxkcmVuLnNwbGljZShpZHgsIDEpO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gTm90IGluIFwiYXBwbHlcIiBwaGFzZVxyXG4gXHRcdGhvdFNldFN0YXR1cyhcImFwcGx5XCIpO1xyXG4gXHRcclxuIFx0XHRob3RDdXJyZW50SGFzaCA9IGhvdFVwZGF0ZU5ld0hhc2g7XHJcbiBcdFxyXG4gXHRcdC8vIGluc2VydCBuZXcgY29kZVxyXG4gXHRcdGZvcihtb2R1bGVJZCBpbiBhcHBsaWVkVXBkYXRlKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYXBwbGllZFVwZGF0ZSwgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdG1vZHVsZXNbbW9kdWxlSWRdID0gYXBwbGllZFVwZGF0ZVttb2R1bGVJZF07XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBjYWxsIGFjY2VwdCBoYW5kbGVyc1xyXG4gXHRcdHZhciBlcnJvciA9IG51bGw7XHJcbiBcdFx0Zm9yKG1vZHVsZUlkIGluIG91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0aWYobW9kdWxlKSB7XHJcbiBcdFx0XHRcdFx0bW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdFx0dmFyIGNhbGxiYWNrcyA9IFtdO1xyXG4gXHRcdFx0XHRcdGZvcihpID0gMDsgaSA8IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRcdFx0XHRkZXBlbmRlbmN5ID0gbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbaV07XHJcbiBcdFx0XHRcdFx0XHRjYiA9IG1vZHVsZS5ob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcGVuZGVuY3ldO1xyXG4gXHRcdFx0XHRcdFx0aWYoY2IpIHtcclxuIFx0XHRcdFx0XHRcdFx0aWYoY2FsbGJhY2tzLmluZGV4T2YoY2IpID49IDApIGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRcdFx0XHRjYWxsYmFja3MucHVzaChjYik7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGZvcihpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0XHRcdFx0Y2IgPSBjYWxsYmFja3NbaV07XHJcbiBcdFx0XHRcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHRcdFx0XHRjYihtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyk7XHJcbiBcdFx0XHRcdFx0XHR9IGNhdGNoKGVycikge1xyXG4gXHRcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcclxuIFx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiYWNjZXB0LWVycm9yZWRcIixcclxuIFx0XHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0XHRcdGRlcGVuZGVuY3lJZDogbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbaV0sXHJcbiBcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyXHJcbiBcdFx0XHRcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRcdGlmKCFlcnJvcilcclxuIFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yID0gZXJyO1xyXG4gXHRcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBMb2FkIHNlbGYgYWNjZXB0ZWQgbW9kdWxlc1xyXG4gXHRcdGZvcihpID0gMDsgaSA8IG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0dmFyIGl0ZW0gPSBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXNbaV07XHJcbiBcdFx0XHRtb2R1bGVJZCA9IGl0ZW0ubW9kdWxlO1xyXG4gXHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbbW9kdWxlSWRdO1xyXG4gXHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCk7XHJcbiBcdFx0XHR9IGNhdGNoKGVycikge1xyXG4gXHRcdFx0XHRpZih0eXBlb2YgaXRlbS5lcnJvckhhbmRsZXIgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gXHRcdFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdFx0XHRpdGVtLmVycm9ySGFuZGxlcihlcnIpO1xyXG4gXHRcdFx0XHRcdH0gY2F0Y2goZXJyMikge1xyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xyXG4gXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1hY2NlcHQtZXJyb3ItaGFuZGxlci1lcnJvcmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnIyLFxyXG4gXHRcdFx0XHRcdFx0XHRcdG9yZ2luYWxFcnJvcjogZXJyLCAvLyBUT0RPIHJlbW92ZSBpbiB3ZWJwYWNrIDRcclxuIFx0XHRcdFx0XHRcdFx0XHRvcmlnaW5hbEVycm9yOiBlcnJcclxuIFx0XHRcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XHJcbiBcdFx0XHRcdFx0XHRcdGlmKCFlcnJvcilcclxuIFx0XHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjI7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdGVycm9yID0gZXJyO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xyXG4gXHRcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtYWNjZXB0LWVycm9yZWRcIixcclxuIFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyXHJcbiBcdFx0XHRcdFx0XHR9KTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0aWYoIWVycm9yKVxyXG4gXHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIGhhbmRsZSBlcnJvcnMgaW4gYWNjZXB0IGhhbmRsZXJzIGFuZCBzZWxmIGFjY2VwdGVkIG1vZHVsZSBsb2FkXHJcbiBcdFx0aWYoZXJyb3IpIHtcclxuIFx0XHRcdGhvdFNldFN0YXR1cyhcImZhaWxcIik7XHJcbiBcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0aG90U2V0U3RhdHVzKFwiaWRsZVwiKTtcclxuIFx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xyXG4gXHRcdFx0cmVzb2x2ZShvdXRkYXRlZE1vZHVsZXMpO1xyXG4gXHRcdH0pO1xyXG4gXHR9XHJcblxuIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aG90OiBob3RDcmVhdGVNb2R1bGUobW9kdWxlSWQpLFxuIFx0XHRcdHBhcmVudHM6IChob3RDdXJyZW50UGFyZW50c1RlbXAgPSBob3RDdXJyZW50UGFyZW50cywgaG90Q3VycmVudFBhcmVudHMgPSBbXSwgaG90Q3VycmVudFBhcmVudHNUZW1wKSxcbiBcdFx0XHRjaGlsZHJlbjogW11cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgaG90Q3JlYXRlUmVxdWlyZShtb2R1bGVJZCkpO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBfX3dlYnBhY2tfaGFzaF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmggPSBmdW5jdGlvbigpIHsgcmV0dXJuIGhvdEN1cnJlbnRIYXNoOyB9O1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBob3RDcmVhdGVSZXF1aXJlKDIpKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDIpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGJiYWM0NGVmMjQ2Y2Y4MjY1YWRiIiwiZXhwb3J0IGNsYXNzIFBsYXllciB7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKGdhbWUpIHtcclxuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xyXG4gICAgICAgIHRoaXMucG9pbnRzID0gMDtcclxuICAgICAgICB0aGlzLmNhcmRzID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgcmVzZXRQb2ludHMoKXtcclxuICAgICAgICB0aGlzLnBvaW50cyA9IDA7XHJcbiAgICAgICAgdGhpcy5jYXJkcyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIGlzTG9zdCgpIHtcclxuICAgICAgICBjb25zdCBNQVhJTVVNX1ZBTFVFID0gMjE7XHJcbiAgICAgICAgaWYgKHRoaXMucG9pbnRzID4gTUFYSU1VTV9WQUxVRSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGRyYXdDYXJkKCkge1xyXG4gICAgICAgIHZhciBjYXJkID0gdGhpcy5nYW1lLmdldFJhbmRvbUNhcmQoKTtcclxuICAgICAgICB0aGlzLmNhcmRzLnB1c2goY2FyZCk7XHJcbiAgICAgICAgdGhpcy5wb2ludHMgPSB0aGlzLmNvdW50UG9pbnRzKCk7XHJcbiAgICAgICAgcmV0dXJuIGNhcmQ7XHJcbiAgICB9XHJcblxyXG4gICAgc3VtVmFsdWVzKCl7XHJcbiAgICAgICAgaWYgKHRoaXMuY2FyZHMgPT0gbnVsbCl7XHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIH0gXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FyZHMucmVkdWNlKChhLGIpID0+IHtcclxuICAgICAgICAgICAgbGV0IHZhbHVlID0gYlsndmFsdWUnXTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBiWyd2YWx1ZSddID09IG51bGwgPyBhIDogYSArIGJbJ3ZhbHVlJ107XHJcbiAgICAgICAgfSwwKTsgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgY291bnRQb2ludHMoKXtcclxuICAgICAgICBsZXQgc3VtID0gdGhpcy5zdW1WYWx1ZXMoKTtcclxuICAgICAgICBpZiAoc3VtID4gMjEpe1xyXG4gICAgICAgICAgICBmb3IobGV0IGkgaW4gdGhpcy5jYXJkcykge1xyXG4gICAgICAgICAgICAgICAgbGV0IG9iaiA9IHRoaXMuY2FyZHNbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAob2JqLnR5cGUgPT09ICdhY2UnICYmIG9iai52YWx1ZSAhPT0gb2JqLmFkZGl0aW9uYWxWYWx1ZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYXJkc1tpXS52YWx1ZSA9IG9iai5hZGRpdGlvbmFsVmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY291bnRQb2ludHMoKTsgIFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc3VtO1xyXG4gICAgfVxyXG5cclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9QbGF5ZXIuanMiLCJpbXBvcnQge0dhbWVVSX0gZnJvbSAnLi9HYW1lVUkuanMnO1xyXG5pbXBvcnQge2xhbmdFbn0gZnJvbSAnLi9sYW5ndWFnZS1lbi5qcyc7XHJcbmltcG9ydCB7bGFuZ1BsfSBmcm9tICcuL2xhbmd1YWdlLXBsLmpzJztcclxucmVxdWlyZSgnLi8uLi9zY3NzL3N0eWxlcy5zY3NzJyk7XHJcbnJlcXVpcmUoJy4vLi4vc2Nzcy9idXR0b25zLnNjc3MnKTtcclxuIFxyXG5sZXQgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmxhY2tqYWNrXCIpO1xyXG5sZXQgbGFuZ3VhZ2VzID0ge1xyXG4gICAgcGwgOiBsYW5nUGwsXHJcbiAgICBlbiA6IGxhbmdFblxyXG59XHJcblxyXG5sZXQgZ2FtZVVJID0gbmV3IEdhbWVVSShlbGVtZW50KTtcclxuZ2FtZVVJLnNldExhbmd1YWdlcyhsYW5ndWFnZXMpO1xyXG5cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3NjcmlwdC5qcyIsImltcG9ydCBHYW1lIGZyb20gJy4vR2FtZS5qcyc7XHJcbmltcG9ydCBQbGF5ZXIgZnJvbSAnLi9QbGF5ZXIuanMnO1xyXG5pbXBvcnQgSHVtYW4gZnJvbSAnLi9IdW1hbi5qcyc7XHJcbmltcG9ydCBDb21wdXRlciBmcm9tICcuL0NvbXB1dGVyLmpzJztcclxuaW1wb3J0IHtTdGF0ZSwgU3RhcnRTdGF0ZSwgU2V0QmlkU3RhdGUsIEdhbWVTdGF0ZSwgRmluaXNoU3RhdGV9ICBmcm9tICcuL1N0YXRlLmpzJztcclxuaW1wb3J0IExhbmd1YWdlIGZyb20gJy4vTGFuZ3VhZ2UuanMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEdhbWVVSXtcclxuXHRjb25zdHJ1Y3RvcihlbGVtZW50KXtcclxuXHRcdHRoaXMuZ2FtZSA9IG5ldyBHYW1lKCk7XHJcblx0XHR0aGlzLnBsYXllciA9IG5ldyBIdW1hbih0aGlzLmdhbWUpO1xyXG5cdFx0dGhpcy5jb21wdXRlciA9IG5ldyBDb21wdXRlcih0aGlzLmdhbWUpO1xyXG5cdFx0dGhpcy5lbGVtZW50ID0gZWxlbWVudDtcclxuXHRcdHRoaXMuc3RhdGUgPSBuZXcgU3RhdGUodGhpcyk7XHJcblx0XHR0aGlzLmNyZWF0ZUV2ZW50cygpO1xyXG5cdH1cclxuXHJcblx0Y3JlYXRlRXZlbnRzKCl7XHJcblx0XHR0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5wYWdlLXN0YXJ0XCIpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG5cdFx0dGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGFnZS1nYW1lXCIpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcblxyXG5cdFx0dGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc3RhcnRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuXHRcdFx0dGhpcy5zdGFydEV2ZW50KCk7XHJcblx0XHR9KTtcclxuXHRcdHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLm5ld1wiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG5cdFx0XHR0aGlzLm5ld0dhbWVFdmVudCgpO1xyXG5cdFx0fSk7XHJcblx0XHR0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5nZXQtY2FyZFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG5cdFx0XHR0aGlzLmdldENhcmRFdmVudCgpO1xyXG5cdFx0fSk7XHJcblx0XHR0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5jaGVja1wiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG5cdFx0XHR0aGlzLmNoZWNrRXZlbnQoKTtcclxuXHRcdH0pO1xyXG5cdFx0dGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubmV4dFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG5cdFx0XHR0aGlzLm5leHRFdmVudCgpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xyXG5cdFx0XHR0aGlzLnN0YXRlLmtleWJvYXJkSW52b2tlT3BlcmF0aW9uKGV2ZW50LmtleUNvZGUpO1xyXG5cdFx0ICB9KTtcclxuXHJcblx0XHR0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5mbGFnLXBvbGFuZFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwoKSA9PiB7XHJcblx0XHRcdHRoaXMubGFuZ3VhZ2Uuc2V0TGFuZ3VhZ2UoJ3BsJyk7XHJcblx0XHR9KTtcclxuXHRcdHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLmZsYWctZW5nbGFuZFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwoKSA9PiB7XHJcblx0XHRcdHRoaXMubGFuZ3VhZ2Uuc2V0TGFuZ3VhZ2UoJ2VuJyk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHN0YXJ0RXZlbnQoKXtcclxuXHRcdHRoaXMucGxheWVyLnJlc2V0KCk7XHJcblx0XHR0aGlzLnN0YXJ0KCk7XHJcblx0fVxyXG5cclxuXHRuZXdHYW1lRXZlbnQoKXtcclxuXHRcdHRoaXMuc3RhcnQoKTtcdFx0XHJcblx0fVxyXG5cdFxyXG5cdGdldENhcmRFdmVudCgpe1xyXG5cdFx0dGhpcy5nZXRDYXJkKCk7XHJcblx0fVxyXG5cdFxyXG5cdGNoZWNrRXZlbnQoKXtcclxuXHRcdHRoaXMuY2hlY2soKTtcclxuXHRcdHRoaXMuc3RhdGUuc2V0U3RhdGUobmV3IEZpbmlzaFN0YXRlKCkpO1xyXG5cdH1cclxuXHRcclxuXHRuZXh0RXZlbnQoKXtcclxuXHRcdHRoaXMucGxheWVyLmJpZCA9IHBhcnNlSW50KHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiaW5wdXRbbmFtZT0nYmlkJ11cIikudmFsdWUpO1xyXG5cdFx0bGV0IHZhbGlkYXRlUmVzdWx0ID0gdGhpcy52YWxpZGF0ZUJpZCh0aGlzLnBsYXllci5iaWQpO1xyXG5cclxuXHRcdGlmICghdmFsaWRhdGVSZXN1bHQuc3RhdHVzKXtcclxuXHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJpZC1lcnJvcicpLmlubmVySFRNTCA9IHZhbGlkYXRlUmVzdWx0Lm1lc3NhZ2U7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5jYXNoX3BsYXllclwiKS5pbm5lckhUTUwgPSB0aGlzLnBsYXllci5jYXNoO1xyXG5cdFx0dGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYmlkXCIpLmlubmVySFRNTCA9IHRoaXMucGxheWVyLmJpZDtcclxuXHRcdHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLnBhZ2UtYmlkXCIpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcblx0XHR0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5wYWdlLWdhbWVcIikuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcblx0XHR0aGlzLnN0YXRlLnNldFN0YXRlKG5ldyBHYW1lU3RhdGUoKSk7XHJcblx0fVxyXG5cclxuXHRzZXRMYW5ndWFnZXMobGFuZ3VhZ2VzKXtcclxuXHRcdHRoaXMubGFuZ3VhZ2UgPSBuZXcgTGFuZ3VhZ2UodGhpcy5lbGVtZW50LCBsYW5ndWFnZXMpO1xyXG5cdFx0XHJcblx0XHR2YXIgdXNlckxhbmcgPSBuYXZpZ2F0b3IubGFuZ3VhZ2UgfHwgbmF2aWdhdG9yLnVzZXJMYW5ndWFnZTsgXHJcblxyXG5cdFx0aWYgKHVzZXJMYW5nLnRvTG93ZXJDYXNlKCkgPT09ICdwbCcpe1xyXG5cdFx0XHR0aGlzLmxhbmd1YWdlLnNldExhbmd1YWdlKCdwbCcpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHRoaXMubGFuZ3VhZ2Uuc2V0TGFuZ3VhZ2UoJ2VuJyk7XHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcbiAgICB2YWxpZGF0ZUJpZChiaWQpe1xyXG4gICAgICAgIGxldCB2YWxpZGF0ZVJlc3VsdCA9IHtzdGF0dXMgOiBmYWxzZX07XHJcbiAgICAgICAgaWYgKGlzTmFOKGJpZCkpe1xyXG4gICAgICAgICAgICB2YWxpZGF0ZVJlc3VsdC5tZXNzYWdlID0gdGhpcy5sYW5ndWFnZS50cmFuc2xhdGUoJ2VudGVyTnVtYmVyJyk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gdmFsaWRhdGVSZXN1bHQ7ICAgICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGJpZCA8IDApe1xyXG4gICAgICAgICAgICB2YWxpZGF0ZVJlc3VsdC5tZXNzYWdlID0gdGhpcy5sYW5ndWFnZS50cmFuc2xhdGUoJ3Rvb1NtYWxsQmlkJyk7XHJcbiAgICAgICAgICAgIHJldHVybiB2YWxpZGF0ZVJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoYmlkID4gdGhpcy5wbGF5ZXIuY2FzaCl7XHJcbiAgICAgICAgICAgIHZhbGlkYXRlUmVzdWx0Lm1lc3NhZ2UgPSB0aGlzLmxhbmd1YWdlLnRyYW5zbGF0ZSgnbm90RW5vdWdoTW9uZXknKTtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbGlkYXRlUmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YWxpZGF0ZVJlc3VsdC5zdGF0dXMgPSB0cnVlO1xyXG4gICAgICAgIHJldHVybiB2YWxpZGF0ZVJlc3VsdDtcclxuICAgIH1cclxuXHJcblx0cmVzdGFydEdhbWUoKXtcclxuXHRcdHRoaXMuZ2FtZS5pbml0R2FtZSgpO1xyXG5cdFx0dGhpcy5wbGF5ZXIucmVzZXRQb2ludHMoKTtcclxuXHRcdHRoaXMuY29tcHV0ZXIucmVzZXRQb2ludHMoKTtcclxuXHRcdHRoaXMuc3RhdGUuc2V0U3RhdGUobmV3IFNldEJpZFN0YXRlKCkpO1x0XHJcblxyXG5cdFx0aWYgKHRoaXMucGxheWVyLmNhc2ggPD0gMCl7XHJcblx0XHRcdHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLmxvc2UtbWVzc2FnZVwiKS5pbm5lckhUTUwgPSB0aGlzLmxhbmd1YWdlLnRyYW5zbGF0ZSgnbG9zZVRyeUFnYWluJyk7XHJcblx0XHRcdHRoaXMuc3RhdGUuc2V0U3RhdGUobmV3IFN0YXJ0U3RhdGUoKSk7XHRcclxuXHRcdFx0dGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGFnZS1zdGFydFwiKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuXHRcdFx0dGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGFnZS1nYW1lXCIpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYmlkLWVycm9yXCIpLmlubmVySFRNTCA9IFwiXCI7XHJcblx0XHR0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGF5ZXItY2FyZC1jb250YWluZXJcIikuaW5uZXJIVE1MID0gXCJcIjtcclxuXHRcdHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLm1lc3NhZ2VcIikuaW5uZXJIVE1MID0gXCJcIjtcclxuXHRcdHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvaW50c1wiKS5pbm5lckhUTUwgPSAwO1xyXG5cdFx0dGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY2FzaFwiKS5pbm5lckhUTUwgPSB0aGlzLnBsYXllci5jYXNoO1xyXG5cdFx0dGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29tcHV0ZXItY2FyZC1jb250YWluZXJcIikuaW5uZXJIVE1MID0gXCJcIjtcclxuXHRcdHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbXB1dGVyLXBvaW50c1wiKS5pbm5lckhUTUwgPSAwO1xyXG5cclxuXHRcdHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLnBhZ2Utc3RhcnRcIikuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuXHRcdHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLnBhZ2UtYmlkXCIpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG5cdFx0dGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGFnZS1nYW1lXCIpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcblx0XHRcclxuXHRcdHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLmdldC1jYXJkXCIpLnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lLWJsb2NrJztcclxuXHRcdHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLmNoZWNrXCIpLnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lLWJsb2NrJztcclxuXHRcdHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLm5ld1wiKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG5cdFx0dGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIub3Bwb25lbnRcIikuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuXHJcblx0XHR0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcImlucHV0W25hbWU9J2JpZCddXCIpLmZvY3VzKCk7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFtuYW1lPSdiaWQnXVwiKS5zZWxlY3QoKTtcclxuXHR9XHJcblxyXG5cdHN0YXJ0KCl7XHJcblx0XHR0aGlzLnJlc3RhcnRHYW1lKCk7XHJcblx0fVxyXG5cclxuXHRnZXRDYXJkKCl7XHJcblx0XHRsZXQgY2FyZCA9IHRoaXMucGxheWVyLmRyYXdDYXJkKCk7XHJcblx0XHRcclxuXHRcdGxldCBjYXJkRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcblx0XHRjYXJkRWxlbWVudC5jbGFzc05hbWUgPSBcImNhcmQgXCIgKyBjYXJkLmNsYXNzO1xyXG5cdFx0dGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxheWVyLWNhcmQtY29udGFpbmVyXCIpLmFwcGVuZENoaWxkKGNhcmRFbGVtZW50KTtcclxuXHRcdHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvaW50c1wiKS5pbm5lckhUTUwgPSB0aGlzLnBsYXllci5wb2ludHM7XHJcblxyXG5cdFx0aWYgKHRoaXMucGxheWVyLmlzTG9zdCgpKSB7XHJcblx0XHRcdHRoaXMuc3RhdGUuc2V0U3RhdGUobmV3IEZpbmlzaFN0YXRlKCkpO1xyXG5cdFx0XHR0aGlzLnBsYXllci5jYXNoIC09IHRoaXMucGxheWVyLmJpZDtcclxuXHRcdFx0dGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tZXNzYWdlJykuaW5uZXJIVE1MID0gdGhpcy5sYW5ndWFnZS50cmFuc2xhdGUoJ2V4Y2VlZExpbWl0Jyk7XHJcblx0XHRcdHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLmdldC1jYXJkXCIpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcblx0XHRcdHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLmNoZWNrXCIpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcblx0XHRcdHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLm5ld1wiKS5zdHlsZS5kaXNwbGF5ID0gJ2lubGluZS1ibG9jayc7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRjaGVjaygpe1xyXG5cdFx0d2hpbGUgKCF0aGlzLmNvbXB1dGVyLmlzUGFzc2VkKCkpIHtcclxuXHRcdFx0bGV0IGNhcmQgPSB0aGlzLmNvbXB1dGVyLmRyYXdDYXJkKCk7XHJcblx0XHRcdGxldCBjYXJkRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcblx0XHRcdGNhcmRFbGVtZW50LmNsYXNzTmFtZSA9IFwiY2FyZCBcIiArIGNhcmQuY2xhc3M7XHJcblx0XHRcdHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbXB1dGVyLWNhcmQtY29udGFpbmVyXCIpLmFwcGVuZENoaWxkKGNhcmRFbGVtZW50KTtcclxuXHRcdH1cclxuXHRcdHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbXB1dGVyLXBvaW50c1wiKS5pbm5lckhUTUwgPSB0aGlzLmNvbXB1dGVyLnBvaW50cztcclxuXHRcclxuXHRcdGxldCBtZXNzYWdlO1xyXG5cdFx0aWYgKHRoaXMuY29tcHV0ZXIuaXNMb3N0KCkgfHwgdGhpcy5jb21wdXRlci5wb2ludHMgPCB0aGlzLnBsYXllci5wb2ludHMpIHtcclxuXHRcdFx0bWVzc2FnZSA9IHRoaXMubGFuZ3VhZ2UudHJhbnNsYXRlKCd3aW4nKTtcclxuXHRcdFx0dGhpcy5wbGF5ZXIuY2FzaCArPSB0aGlzLnBsYXllci5iaWQ7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmKHRoaXMuY29tcHV0ZXIucG9pbnRzID09PSB0aGlzLnBsYXllci5wb2ludHMpe1xyXG5cdFx0XHRtZXNzYWdlID0gdGhpcy5sYW5ndWFnZS50cmFuc2xhdGUoJ2RyYXcnKTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRtZXNzYWdlID0gdGhpcy5sYW5ndWFnZS50cmFuc2xhdGUoJ2xvc2UnKTtcclxuXHRcdFx0dGhpcy5wbGF5ZXIuY2FzaCAtPSB0aGlzLnBsYXllci5iaWQ7XHJcblx0XHR9XHJcblx0XHR0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLm1lc3NhZ2UnKS5pbm5lckhUTUwgPSBtZXNzYWdlO1xyXG5cdFx0dGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ2V0LWNhcmRcIikuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuXHRcdHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLmNoZWNrXCIpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcblx0XHR0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5uZXdcIikuc3R5bGUuZGlzcGxheSA9ICdpbmxpbmUtYmxvY2snO1xyXG5cdFx0dGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIub3Bwb25lbnRcIikuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcblx0fVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL0dhbWVVSS5qcyIsIlxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lIHtcclxuICAgIFxyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgICAgICB0aGlzLmluaXRHYW1lKCk7XHJcbiAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgaW5pdEdhbWUoKSB7XHJcbiAgICBcclxuICAgICAgICAgICAgdGhpcy5jYXJkUG9pbnRzID0gW107XHJcbiAgICAgICAgICAgIGxldCBjYXJkVHlwZXMgPSBbJ2NsdWJzJywgJ2hlYXJ0cycsICdzcGFkZXMnLCAnZGlhbW9uZHMnXTtcclxuICAgICAgICAgICAgbGV0IGNhcmRWYWx1ZXMgPSB7XHJcbiAgICAgICAgICAgICAgICAnYWNlJzogMTEsICd0d28nOiAyLCAndGhyZWUnOiAzLCAnZm91cic6IDQsICdmaXZlJzogNSwgJ3NpeCc6IDYsXHJcbiAgICAgICAgICAgICAgICAnc2V2ZW4nOiA3LCAnZWlnaHQnOiA4LCAnbmluZSc6IDksICd0ZW4nOiAxMCwgJ2phY2snOiAxMCwgJ3F1ZWVuJzogMTAsICdraW5nJzogMTBcclxuICAgICAgICAgICAgfTtcclxuICAgIFxyXG4gICAgICAgICAgICBmb3IgKGxldCBpIGluIGNhcmRUeXBlcykge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgbmFtZSBpbiBjYXJkVmFsdWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNhcmQgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBjYXJkVmFsdWVzW25hbWVdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBuYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzczogbmFtZSArICdfJyArIGNhcmRUeXBlc1tpXSxcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChuYW1lID09PSAnYWNlJyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhcmQuYWRkaXRpb25hbFZhbHVlID0gMTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYXJkUG9pbnRzLnB1c2goY2FyZClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBnZXRSYW5kb21DYXJkKCkge1xyXG4gICAgICAgICAgICB2YXIgZGVzaXJlZEluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGhpcy5jYXJkUG9pbnRzLmxlbmd0aCk7XHJcbiAgICAgICAgICAgIHZhciBjYXJkID0gdGhpcy5jYXJkUG9pbnRzW2Rlc2lyZWRJbmRleF07XHJcbiAgICAgICAgICAgIHRoaXMuY2FyZFBvaW50cy5zcGxpY2UoZGVzaXJlZEluZGV4LCAxKTtcclxuICAgICAgICAgICAgcmV0dXJuIGNhcmQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9HYW1lLmpzIiwiaW1wb3J0IHtQbGF5ZXJ9IGZyb20gJy4vUGxheWVyLmpzJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSHVtYW4gZXh0ZW5kcyBQbGF5ZXIge1xyXG5cdGNvbnN0cnVjdG9yKGdhbWUpIHtcclxuXHRcdHN1cGVyKGdhbWUpO1xyXG4gICAgICAgIHRoaXMucmVzZXQoKTtcclxuXHR9XHJcblxyXG4gICAgcmVzZXQoKXsgICAgICAgIFxyXG5cdFx0dGhpcy5jYXNoID0gMTAwMDA7XHJcblx0XHR0aGlzLmJpZCA9IDA7XHJcbiAgICB9XHJcblxyXG5cdHNldEJpZChiaWQpe1xyXG5cdFx0dGhpcy5iaWQgPSBiaWQ7XHJcblx0fVxyXG59XHJcblxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvSHVtYW4uanMiLCJpbXBvcnQge1BsYXllcn0gZnJvbSAnLi9QbGF5ZXIuanMnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21wdXRlciBleHRlbmRzIFBsYXllciB7XHJcbiAgICBcclxuICAgIGlzUGFzc2VkKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnBvaW50cyA+PSAxNSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL0NvbXB1dGVyLmpzIiwiaW1wb3J0IHtlbnVtc30gZnJvbSAnLi9rZXlib2FyZF9jb2RlX2VudW1zLmpzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBTdGF0ZXtcclxuICAgIGNvbnN0cnVjdG9yKGdhbWVVSSl7XHJcbiAgICAgICAgdGhpcy5nYW1lVUkgPSBnYW1lVUk7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShuZXcgU3RhcnRTdGF0ZSgpKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRTdGF0ZShzdGF0ZSl7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xyXG4gICAgICAgIHRoaXMuc3RhdGUuc2V0R2FtZVVJKHRoaXMuZ2FtZVVJKTtcclxuICAgIH1cclxuXHJcbiAgICBrZXlib2FyZEludm9rZU9wZXJhdGlvbihrZXljb2RlKXtcclxuICAgICAgICBsZXQgb3BlcmF0aW9uID0gdGhpcy5zdGF0ZS5rZXlPcGVyYXRpb25ba2V5Y29kZV07XHJcbiAgICAgICAgaWYgKHR5cGVvZiBvcGVyYXRpb24gIT09ICd1bmRlZmluZWQnKXtcclxuICAgICAgICAgICAgb3BlcmF0aW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU3RhdGVPcHRpb257XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMua2V5T3BlcmF0aW9uID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgc2V0R2FtZVVJKGdhbWVVSSl7XHJcbiAgICAgICAgdGhpcy5nYW1lVUkgPSBnYW1lVUk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTdGFydFN0YXRlIGV4dGVuZHMgU3RhdGVPcHRpb257XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5rZXlPcGVyYXRpb25bZW51bXMua2V5Ym9hcmQuRU5URVJdID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmdhbWVVSS5zdGFydEV2ZW50KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU2V0QmlkU3RhdGUgZXh0ZW5kcyBTdGF0ZU9wdGlvbntcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLmtleU9wZXJhdGlvbltlbnVtcy5rZXlib2FyZC5FTlRFUl0gPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZVVJLm5leHRFdmVudCgpOyAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEdhbWVTdGF0ZSBleHRlbmRzIFN0YXRlT3B0aW9ue1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMua2V5T3BlcmF0aW9uW2VudW1zLmtleWJvYXJkLkVOVEVSXSA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5nYW1lVUkuY2hlY2tFdmVudCgpOyAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMua2V5T3BlcmF0aW9uW2VudW1zLmtleWJvYXJkLlNQQUNFXSA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5nYW1lVUkuZ2V0Q2FyZEV2ZW50KCk7OyAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRmluaXNoU3RhdGUgZXh0ZW5kcyBTdGF0ZU9wdGlvbntcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLmtleU9wZXJhdGlvbltlbnVtcy5rZXlib2FyZC5FTlRFUl0gPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZVVJLm5ld0dhbWVFdmVudCgpOyAgICAgICAgICAgXHJcbiAgICAgICAgfSAgICAgICAgXHJcbiAgICB9XHJcbn0gICBcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvU3RhdGUuanMiLCJleHBvcnQgdmFyIGVudW1zID0ge307ICAgXHJcbmVudW1zLmtleWJvYXJkID0ge1xyXG4gICAgICBCQUNLU1BBQ0U6IDgsXHJcbiAgICAgIFRBQjogOSxcclxuICAgICAgRU5URVI6IDEzLFxyXG4gICAgICBTSElGVDogMTYsXHJcbiAgICAgIENUUkw6IDE3LFxyXG4gICAgICBBTFQ6IDE4LFxyXG4gICAgICBQQVVTRTogMTksXHJcbiAgICAgIENBUFNfTE9DSzogMjAsXHJcbiAgICAgIEVTQ0FQRTogMjcsXHJcbiAgICAgIFNQQUNFOiAzMixcclxuICAgICAgUEFHRV9VUDogMzMsXHJcbiAgICAgIFBBR0VfRE9XTjogMzQsXHJcbiAgICAgIEVORDogMzUsXHJcbiAgICAgIEhPTUU6IDM2LFxyXG4gICAgICBMRUZUX0FSUk9XOiAzNyxcclxuICAgICAgVVBfQVJST1c6IDM4LFxyXG4gICAgICBSSUdIVF9BUlJPVzogMzksXHJcbiAgICAgIERPV05fQVJST1c6IDQwLFxyXG4gICAgICBJTlNFUlQ6IDQ1LFxyXG4gICAgICBERUxFVEU6IDQ2LFxyXG4gICAgICBLRVlfMDogNDgsXHJcbiAgICAgIEtFWV8xOiA0OSxcclxuICAgICAgS0VZXzI6IDUwLFxyXG4gICAgICBLRVlfMzogNTEsXHJcbiAgICAgIEtFWV80OiA1MixcclxuICAgICAgS0VZXzU6IDUzLFxyXG4gICAgICBLRVlfNjogNTQsXHJcbiAgICAgIEtFWV83OiA1NSxcclxuICAgICAgS0VZXzg6IDU2LFxyXG4gICAgICBLRVlfOTogNTcsXHJcbiAgICAgIEtFWV9BOiA2NSxcclxuICAgICAgS0VZX0I6IDY2LFxyXG4gICAgICBLRVlfQzogNjcsXHJcbiAgICAgIEtFWV9EOiA2OCxcclxuICAgICAgS0VZX0U6IDY5LFxyXG4gICAgICBLRVlfRjogNzAsXHJcbiAgICAgIEtFWV9HOiA3MSxcclxuICAgICAgS0VZX0g6IDcyLFxyXG4gICAgICBLRVlfSTogNzMsXHJcbiAgICAgIEtFWV9KOiA3NCxcclxuICAgICAgS0VZX0s6IDc1LFxyXG4gICAgICBLRVlfTDogNzYsXHJcbiAgICAgIEtFWV9NOiA3NyxcclxuICAgICAgS0VZX046IDc4LFxyXG4gICAgICBLRVlfTzogNzksXHJcbiAgICAgIEtFWV9QOiA4MCxcclxuICAgICAgS0VZX1E6IDgxLFxyXG4gICAgICBLRVlfUjogODIsXHJcbiAgICAgIEtFWV9TOiA4MyxcclxuICAgICAgS0VZX1Q6IDg0LFxyXG4gICAgICBLRVlfVTogODUsXHJcbiAgICAgIEtFWV9WOiA4NixcclxuICAgICAgS0VZX1c6IDg3LFxyXG4gICAgICBLRVlfWDogODgsXHJcbiAgICAgIEtFWV9ZOiA4OSxcclxuICAgICAgS0VZX1o6IDkwLFxyXG4gICAgICBMRUZUX01FVEE6IDkxLFxyXG4gICAgICBSSUdIVF9NRVRBOiA5MixcclxuICAgICAgU0VMRUNUOiA5MyxcclxuICAgICAgTlVNUEFEXzA6IDk2LFxyXG4gICAgICBOVU1QQURfMTogOTcsXHJcbiAgICAgIE5VTVBBRF8yOiA5OCxcclxuICAgICAgTlVNUEFEXzM6IDk5LFxyXG4gICAgICBOVU1QQURfNDogMTAwLFxyXG4gICAgICBOVU1QQURfNTogMTAxLFxyXG4gICAgICBOVU1QQURfNjogMTAyLFxyXG4gICAgICBOVU1QQURfNzogMTAzLFxyXG4gICAgICBOVU1QQURfODogMTA0LFxyXG4gICAgICBOVU1QQURfOTogMTA1LFxyXG4gICAgICBNVUxUSVBMWTogMTA2LFxyXG4gICAgICBBREQ6IDEwNyxcclxuICAgICAgU1VCVFJBQ1Q6IDEwOSxcclxuICAgICAgREVDSU1BTDogMTEwLFxyXG4gICAgICBESVZJREU6IDExMSxcclxuICAgICAgRjE6IDExMixcclxuICAgICAgRjI6IDExMyxcclxuICAgICAgRjM6IDExNCxcclxuICAgICAgRjQ6IDExNSxcclxuICAgICAgRjU6IDExNixcclxuICAgICAgRjY6IDExNyxcclxuICAgICAgRjc6IDExOCxcclxuICAgICAgRjg6IDExOSxcclxuICAgICAgRjk6IDEyMCxcclxuICAgICAgRjEwOiAxMjEsXHJcbiAgICAgIEYxMTogMTIyLFxyXG4gICAgICBGMTI6IDEyMyxcclxuICAgICAgTlVNX0xPQ0s6IDE0NCxcclxuICAgICAgU0NST0xMX0xPQ0s6IDE0NSxcclxuICAgICAgU0VNSUNPTE9OOiAxODYsXHJcbiAgICAgIEVRVUFMUzogMTg3LFxyXG4gICAgICBDT01NQTogMTg4LFxyXG4gICAgICBEQVNIOiAxODksXHJcbiAgICAgIFBFUklPRDogMTkwLFxyXG4gICAgICBGT1JXQVJEX1NMQVNIOiAxOTEsXHJcbiAgICAgIEdSQVZFX0FDQ0VOVDogMTkyLFxyXG4gICAgICBPUEVOX0JSQUNLRVQ6IDIxOSxcclxuICAgICAgQkFDS19TTEFTSDogMjIwLFxyXG4gICAgICBDTE9TRV9CUkFDS0VUOiAyMjEsXHJcbiAgICAgIFNJTkdMRV9RVU9URTogMjIyXHJcbiAgICB9O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9rZXlib2FyZF9jb2RlX2VudW1zLmpzIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGFuZ3VhZ2V7XHJcblx0XHJcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50LGxhbmd1YWdlRmlsZXMpe1xyXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50TGFuZ3VhZ2UgPSAnZW4nXHJcbiAgICAgICAgdGhpcy5sYW5ndWFnZUZpbGVzID0gbGFuZ3VhZ2VGaWxlcztcclxuICAgIH1cclxuXHJcbiAgICBzZXRMYW5ndWFnZShsYW5nKXtcclxuICAgICAgICB0aGlzLmN1cnJlbnRMYW5ndWFnZSA9IHRoaXMubGFuZ3VhZ2VGaWxlc1tsYW5nXTtcclxuICAgICAgICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5zdGFydFwiKS5pbm5lckhUTUwgPSB0aGlzLnRyYW5zbGF0ZSgncGxheScpO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLm5leHRcIikuaW5uZXJIVE1MID0gdGhpcy50cmFuc2xhdGUoJ25leHQnKTtcclxuICAgICAgICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5nZXQtY2FyZFwiKS5pbm5lckhUTUwgPSB0aGlzLnRyYW5zbGF0ZSgnZHJhd0NhcnQnKTtcclxuICAgICAgICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5nZXQtY2FyZFwiKS5pbm5lckhUTUwgPSB0aGlzLnRyYW5zbGF0ZSgnZHJhd0NhcnQnKTtcclxuICAgICAgICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5jaGVja1wiKS5pbm5lckhUTUwgPSB0aGlzLnRyYW5zbGF0ZSgnc3RhbmQnKTtcclxuXHJcbiAgICAgICAgbGV0IGNhc2hMYWJlbHMgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNhc2gtbGFiZWwnKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNhc2hMYWJlbHMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICBjYXNoTGFiZWxzW2ldLmlubmVySFRNTCA9IHRoaXMudHJhbnNsYXRlKCdjYXNoJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJldC1sYWJlbCcpLmlubmVySFRNTCA9IHRoaXMudHJhbnNsYXRlKCdiZXQnKTsgXHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZXQtYmV0LWxhYmVsJykuaW5uZXJIVE1MID0gdGhpcy50cmFuc2xhdGUoJ3NldEJldCcpOyBcclxuICAgICAgICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnZhbHVlLWxhYmVsJykuaW5uZXJIVE1MID0gdGhpcy50cmFuc2xhdGUoJ2NhcnRWYWx1ZScpOyBcclxuICAgICAgICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLm9wcG9uZW50LXZhbHVlLWxhYmVsJykuaW5uZXJIVE1MID0gdGhpcy50cmFuc2xhdGUoJ29wcG9uZW50Q2FydFZhbHVlJyk7IFxyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNsYXRlKHdvcmQpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRMYW5ndWFnZVt3b3JkXTtcclxuICAgIH1cclxuXHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvTGFuZ3VhZ2UuanMiLCJleHBvcnQgdmFyIGxhbmdFbiA9IHtcclxuICAgIHBsYXk6ICdQbGF5JyxcclxuICAgIG5leHQ6ICdOZXh0JyxcclxuICAgIGRyYXdDYXJ0OiAnRHJhdyBhIGNhcnQnLFxyXG4gICAgc3RhbmQ6ICdTdGFuZCcsXHJcbiAgICBlbnRlck51bWJlcjogXCJQbGVhc2UsIGVudGVyIGEgbnVtYmVyXCIsXHJcbiAgICB0b29TbWFsbEJpZDogXCJUb28gc21hbGwgYmV0XCIsXHJcbiAgICBub3RFbm91Z2hNb25leTogXCJZb3UgaGF2ZSBub3QgZW5vdWdoIG1vbmV5XCIsXHJcbiAgICBsb3NlVHJ5QWdhaW46IFwiWW91IGxvc3QuIENhbiB5b3UgdHJ5IGFnYWluPz9cIixcclxuICAgIGV4Y2VlZExpbWl0OiBcIkV4Y2VlZCBsaW1pdCAyMS5cIixcclxuICAgIHdpbiA6ICdDb25ncmF0dWxhdGlvbiwgeW91IHdvbiEnLFxyXG4gICAgZHJhdyA6IFwiRHJhd1wiLFxyXG4gICAgbG9zZSA6ICdPcHBvbmVudCB3b24nLFxyXG4gICAgY2FzaCA6ICdDYXNoJyxcclxuICAgIHNldEJldCA6ICdFbnRlciB5b3VyIGJldCcsXHJcbiAgICBiZXQgOiAnQmV0JyxcclxuICAgIGNhcnRWYWx1ZSA6ICdWYWx1ZSBvZiBjYXJ0JyxcclxuICAgIG9wcG9uZW50Q2FydFZhbHVlIDogJ1ZhbHVlIG9mIG9wcG9uZW50IGNhcnQnLFxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2xhbmd1YWdlLWVuLmpzIiwiZXhwb3J0IHZhciBsYW5nUGwgPSB7XHJcbiAgICBwbGF5IDogJ0dyYWonLFxyXG4gICAgbmV4dCA6ICdEYWxlaicsXHJcbiAgICBkcmF3Q2FydCA6ICdQb2JpZXJ6IGthcnRlJyxcclxuICAgIHN0YW5kIDogJ1BhcycsXHJcbiAgICBlbnRlck51bWJlciA6IFwiTmllIHBvZGFubyBsaWN6YnlcIixcclxuICAgIHRvb1NtYWxsQmlkIDogXCJaYSBtYcWCYSBzdGF3a2FcIixcclxuICAgIG5vdEVub3VnaE1vbmV5IDogXCJOaWUgbWFzeiB0eWxlIHBpZW5pxJlkenlcIixcclxuICAgIGxvc2VUcnlBZ2FpbiA6XCJOaWVzdGV0eSBwcnplZ3JhbGXFmy4gTW/FvGUgemFjem5pZW15IG9kIG5vd2E/XCIsXHJcbiAgICBleGNlZWRMaW1pdCA6IFwiUHJ6ZWtyb2N6b25vIHdhcnRvxZvEhyAyMS5cIixcclxuICAgIHdpbiA6ICdHcmF0dWxhY2plLCB3eWdyYWxlxZshJyxcclxuICAgIGRyYXcgOiBcIlJlbWlzXCIsXHJcbiAgICBsb3NlIDogJ1d5Z3JhxYIgcHJ6ZWNpd25paycsXHJcbiAgICBjYXNoIDogJ0thc2EnLFxyXG4gICAgc2V0QmV0IDogJ1VzdGF3IHd5c29rb8WbxIcgc3Rhd2tpJyxcclxuICAgIGJldCA6ICdTdGF3a2EnLFxyXG4gICAgY2FydFZhbHVlIDogJ1dhcnRvxZvEhyBrYXJ0JyxcclxuICAgIG9wcG9uZW50Q2FydFZhbHVlIDogJ1dhcnRvxZvEhyBrYXJ0IHByemVjaXduaWthJ1xyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2xhbmd1YWdlLXBsLmpzIiwiLypcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbi8vIGNzcyBiYXNlIGNvZGUsIGluamVjdGVkIGJ5IHRoZSBjc3MtbG9hZGVyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHVzZVNvdXJjZU1hcCkge1xuXHR2YXIgbGlzdCA9IFtdO1xuXG5cdC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcblx0bGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuXHRcdHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuXHRcdFx0dmFyIGNvbnRlbnQgPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0sIHVzZVNvdXJjZU1hcCk7XG5cdFx0XHRpZihpdGVtWzJdKSB7XG5cdFx0XHRcdHJldHVybiBcIkBtZWRpYSBcIiArIGl0ZW1bMl0gKyBcIntcIiArIGNvbnRlbnQgKyBcIn1cIjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBjb250ZW50O1xuXHRcdFx0fVxuXHRcdH0pLmpvaW4oXCJcIik7XG5cdH07XG5cblx0Ly8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3Rcblx0bGlzdC5pID0gZnVuY3Rpb24obW9kdWxlcywgbWVkaWFRdWVyeSkge1xuXHRcdGlmKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKVxuXHRcdFx0bW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgXCJcIl1dO1xuXHRcdHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpZCA9IHRoaXNbaV1bMF07XG5cdFx0XHRpZih0eXBlb2YgaWQgPT09IFwibnVtYmVyXCIpXG5cdFx0XHRcdGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcblx0XHR9XG5cdFx0Zm9yKGkgPSAwOyBpIDwgbW9kdWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGl0ZW0gPSBtb2R1bGVzW2ldO1xuXHRcdFx0Ly8gc2tpcCBhbHJlYWR5IGltcG9ydGVkIG1vZHVsZVxuXHRcdFx0Ly8gdGhpcyBpbXBsZW1lbnRhdGlvbiBpcyBub3QgMTAwJSBwZXJmZWN0IGZvciB3ZWlyZCBtZWRpYSBxdWVyeSBjb21iaW5hdGlvbnNcblx0XHRcdC8vICB3aGVuIGEgbW9kdWxlIGlzIGltcG9ydGVkIG11bHRpcGxlIHRpbWVzIHdpdGggZGlmZmVyZW50IG1lZGlhIHF1ZXJpZXMuXG5cdFx0XHQvLyAgSSBob3BlIHRoaXMgd2lsbCBuZXZlciBvY2N1ciAoSGV5IHRoaXMgd2F5IHdlIGhhdmUgc21hbGxlciBidW5kbGVzKVxuXHRcdFx0aWYodHlwZW9mIGl0ZW1bMF0gIT09IFwibnVtYmVyXCIgfHwgIWFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcblx0XHRcdFx0aWYobWVkaWFRdWVyeSAmJiAhaXRlbVsyXSkge1xuXHRcdFx0XHRcdGl0ZW1bMl0gPSBtZWRpYVF1ZXJ5O1xuXHRcdFx0XHR9IGVsc2UgaWYobWVkaWFRdWVyeSkge1xuXHRcdFx0XHRcdGl0ZW1bMl0gPSBcIihcIiArIGl0ZW1bMl0gKyBcIikgYW5kIChcIiArIG1lZGlhUXVlcnkgKyBcIilcIjtcblx0XHRcdFx0fVxuXHRcdFx0XHRsaXN0LnB1c2goaXRlbSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXHRyZXR1cm4gbGlzdDtcbn07XG5cbmZ1bmN0aW9uIGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSwgdXNlU291cmNlTWFwKSB7XG5cdHZhciBjb250ZW50ID0gaXRlbVsxXSB8fCAnJztcblx0dmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuXHRpZiAoIWNzc01hcHBpbmcpIHtcblx0XHRyZXR1cm4gY29udGVudDtcblx0fVxuXG5cdGlmICh1c2VTb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgPT09ICdmdW5jdGlvbicpIHtcblx0XHR2YXIgc291cmNlTWFwcGluZyA9IHRvQ29tbWVudChjc3NNYXBwaW5nKTtcblx0XHR2YXIgc291cmNlVVJMcyA9IGNzc01hcHBpbmcuc291cmNlcy5tYXAoZnVuY3Rpb24gKHNvdXJjZSkge1xuXHRcdFx0cmV0dXJuICcvKiMgc291cmNlVVJMPScgKyBjc3NNYXBwaW5nLnNvdXJjZVJvb3QgKyBzb3VyY2UgKyAnICovJ1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIFtjb250ZW50XS5jb25jYXQoc291cmNlVVJMcykuY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbignXFxuJyk7XG5cdH1cblxuXHRyZXR1cm4gW2NvbnRlbnRdLmpvaW4oJ1xcbicpO1xufVxuXG4vLyBBZGFwdGVkIGZyb20gY29udmVydC1zb3VyY2UtbWFwIChNSVQpXG5mdW5jdGlvbiB0b0NvbW1lbnQoc291cmNlTWFwKSB7XG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuXHR2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKTtcblx0dmFyIGRhdGEgPSAnc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsJyArIGJhc2U2NDtcblxuXHRyZXR1cm4gJy8qIyAnICsgZGF0YSArICcgKi8nO1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcbi8vIG1vZHVsZSBpZCA9IDEzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5cbnZhciBzdHlsZXNJbkRvbSA9IHt9O1xuXG52YXJcdG1lbW9pemUgPSBmdW5jdGlvbiAoZm4pIHtcblx0dmFyIG1lbW87XG5cblx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRpZiAodHlwZW9mIG1lbW8gPT09IFwidW5kZWZpbmVkXCIpIG1lbW8gPSBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcdHJldHVybiBtZW1vO1xuXHR9O1xufTtcblxudmFyIGlzT2xkSUUgPSBtZW1vaXplKGZ1bmN0aW9uICgpIHtcblx0Ly8gVGVzdCBmb3IgSUUgPD0gOSBhcyBwcm9wb3NlZCBieSBCcm93c2VyaGFja3Ncblx0Ly8gQHNlZSBodHRwOi8vYnJvd3NlcmhhY2tzLmNvbS8jaGFjay1lNzFkODY5MmY2NTMzNDE3M2ZlZTcxNWMyMjJjYjgwNVxuXHQvLyBUZXN0cyBmb3IgZXhpc3RlbmNlIG9mIHN0YW5kYXJkIGdsb2JhbHMgaXMgdG8gYWxsb3cgc3R5bGUtbG9hZGVyXG5cdC8vIHRvIG9wZXJhdGUgY29ycmVjdGx5IGludG8gbm9uLXN0YW5kYXJkIGVudmlyb25tZW50c1xuXHQvLyBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS93ZWJwYWNrLWNvbnRyaWIvc3R5bGUtbG9hZGVyL2lzc3Vlcy8xNzdcblx0cmV0dXJuIHdpbmRvdyAmJiBkb2N1bWVudCAmJiBkb2N1bWVudC5hbGwgJiYgIXdpbmRvdy5hdG9iO1xufSk7XG5cbnZhciBnZXRFbGVtZW50ID0gKGZ1bmN0aW9uIChmbikge1xuXHR2YXIgbWVtbyA9IHt9O1xuXG5cdHJldHVybiBmdW5jdGlvbihzZWxlY3Rvcikge1xuXHRcdGlmICh0eXBlb2YgbWVtb1tzZWxlY3Rvcl0gPT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdHZhciBzdHlsZVRhcmdldCA9IGZuLmNhbGwodGhpcywgc2VsZWN0b3IpO1xuXHRcdFx0Ly8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcblx0XHRcdGlmIChzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG5cdFx0XHRcdFx0Ly8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcblx0XHRcdFx0XHRzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuXHRcdFx0XHR9IGNhdGNoKGUpIHtcblx0XHRcdFx0XHRzdHlsZVRhcmdldCA9IG51bGw7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdG1lbW9bc2VsZWN0b3JdID0gc3R5bGVUYXJnZXQ7XG5cdFx0fVxuXHRcdHJldHVybiBtZW1vW3NlbGVjdG9yXVxuXHR9O1xufSkoZnVuY3Rpb24gKHRhcmdldCkge1xuXHRyZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpXG59KTtcblxudmFyIHNpbmdsZXRvbiA9IG51bGw7XG52YXJcdHNpbmdsZXRvbkNvdW50ZXIgPSAwO1xudmFyXHRzdHlsZXNJbnNlcnRlZEF0VG9wID0gW107XG5cbnZhclx0Zml4VXJscyA9IHJlcXVpcmUoXCIuL3VybHNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obGlzdCwgb3B0aW9ucykge1xuXHRpZiAodHlwZW9mIERFQlVHICE9PSBcInVuZGVmaW5lZFwiICYmIERFQlVHKSB7XG5cdFx0aWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHN0eWxlLWxvYWRlciBjYW5ub3QgYmUgdXNlZCBpbiBhIG5vbi1icm93c2VyIGVudmlyb25tZW50XCIpO1xuXHR9XG5cblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cblx0b3B0aW9ucy5hdHRycyA9IHR5cGVvZiBvcHRpb25zLmF0dHJzID09PSBcIm9iamVjdFwiID8gb3B0aW9ucy5hdHRycyA6IHt9O1xuXG5cdC8vIEZvcmNlIHNpbmdsZS10YWcgc29sdXRpb24gb24gSUU2LTksIHdoaWNoIGhhcyBhIGhhcmQgbGltaXQgb24gdGhlICMgb2YgPHN0eWxlPlxuXHQvLyB0YWdzIGl0IHdpbGwgYWxsb3cgb24gYSBwYWdlXG5cdGlmICghb3B0aW9ucy5zaW5nbGV0b24pIG9wdGlvbnMuc2luZ2xldG9uID0gaXNPbGRJRSgpO1xuXG5cdC8vIEJ5IGRlZmF1bHQsIGFkZCA8c3R5bGU+IHRhZ3MgdG8gdGhlIDxoZWFkPiBlbGVtZW50XG5cdGlmICghb3B0aW9ucy5pbnNlcnRJbnRvKSBvcHRpb25zLmluc2VydEludG8gPSBcImhlYWRcIjtcblxuXHQvLyBCeSBkZWZhdWx0LCBhZGQgPHN0eWxlPiB0YWdzIHRvIHRoZSBib3R0b20gb2YgdGhlIHRhcmdldFxuXHRpZiAoIW9wdGlvbnMuaW5zZXJ0QXQpIG9wdGlvbnMuaW5zZXJ0QXQgPSBcImJvdHRvbVwiO1xuXG5cdHZhciBzdHlsZXMgPSBsaXN0VG9TdHlsZXMobGlzdCwgb3B0aW9ucyk7XG5cblx0YWRkU3R5bGVzVG9Eb20oc3R5bGVzLCBvcHRpb25zKTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gdXBkYXRlIChuZXdMaXN0KSB7XG5cdFx0dmFyIG1heVJlbW92ZSA9IFtdO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpdGVtID0gc3R5bGVzW2ldO1xuXHRcdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XG5cblx0XHRcdGRvbVN0eWxlLnJlZnMtLTtcblx0XHRcdG1heVJlbW92ZS5wdXNoKGRvbVN0eWxlKTtcblx0XHR9XG5cblx0XHRpZihuZXdMaXN0KSB7XG5cdFx0XHR2YXIgbmV3U3R5bGVzID0gbGlzdFRvU3R5bGVzKG5ld0xpc3QsIG9wdGlvbnMpO1xuXHRcdFx0YWRkU3R5bGVzVG9Eb20obmV3U3R5bGVzLCBvcHRpb25zKTtcblx0XHR9XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IG1heVJlbW92ZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGRvbVN0eWxlID0gbWF5UmVtb3ZlW2ldO1xuXG5cdFx0XHRpZihkb21TdHlsZS5yZWZzID09PSAwKSB7XG5cdFx0XHRcdGZvciAodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspIGRvbVN0eWxlLnBhcnRzW2pdKCk7XG5cblx0XHRcdFx0ZGVsZXRlIHN0eWxlc0luRG9tW2RvbVN0eWxlLmlkXTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG59O1xuXG5mdW5jdGlvbiBhZGRTdHlsZXNUb0RvbSAoc3R5bGVzLCBvcHRpb25zKSB7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGl0ZW0gPSBzdHlsZXNbaV07XG5cdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XG5cblx0XHRpZihkb21TdHlsZSkge1xuXHRcdFx0ZG9tU3R5bGUucmVmcysrO1xuXG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0ZG9tU3R5bGUucGFydHNbal0oaXRlbS5wYXJ0c1tqXSk7XG5cdFx0XHR9XG5cblx0XHRcdGZvcig7IGogPCBpdGVtLnBhcnRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdGRvbVN0eWxlLnBhcnRzLnB1c2goYWRkU3R5bGUoaXRlbS5wYXJ0c1tqXSwgb3B0aW9ucykpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgcGFydHMgPSBbXTtcblxuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGl0ZW0ucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0cGFydHMucHVzaChhZGRTdHlsZShpdGVtLnBhcnRzW2pdLCBvcHRpb25zKSk7XG5cdFx0XHR9XG5cblx0XHRcdHN0eWxlc0luRG9tW2l0ZW0uaWRdID0ge2lkOiBpdGVtLmlkLCByZWZzOiAxLCBwYXJ0czogcGFydHN9O1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBsaXN0VG9TdHlsZXMgKGxpc3QsIG9wdGlvbnMpIHtcblx0dmFyIHN0eWxlcyA9IFtdO1xuXHR2YXIgbmV3U3R5bGVzID0ge307XG5cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGl0ZW0gPSBsaXN0W2ldO1xuXHRcdHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuXHRcdHZhciBjc3MgPSBpdGVtWzFdO1xuXHRcdHZhciBtZWRpYSA9IGl0ZW1bMl07XG5cdFx0dmFyIHNvdXJjZU1hcCA9IGl0ZW1bM107XG5cdFx0dmFyIHBhcnQgPSB7Y3NzOiBjc3MsIG1lZGlhOiBtZWRpYSwgc291cmNlTWFwOiBzb3VyY2VNYXB9O1xuXG5cdFx0aWYoIW5ld1N0eWxlc1tpZF0pIHN0eWxlcy5wdXNoKG5ld1N0eWxlc1tpZF0gPSB7aWQ6IGlkLCBwYXJ0czogW3BhcnRdfSk7XG5cdFx0ZWxzZSBuZXdTdHlsZXNbaWRdLnBhcnRzLnB1c2gocGFydCk7XG5cdH1cblxuXHRyZXR1cm4gc3R5bGVzO1xufVxuXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQgKG9wdGlvbnMsIHN0eWxlKSB7XG5cdHZhciB0YXJnZXQgPSBnZXRFbGVtZW50KG9wdGlvbnMuaW5zZXJ0SW50bylcblxuXHRpZiAoIXRhcmdldCkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0SW50bycgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuXHR9XG5cblx0dmFyIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wID0gc3R5bGVzSW5zZXJ0ZWRBdFRvcFtzdHlsZXNJbnNlcnRlZEF0VG9wLmxlbmd0aCAtIDFdO1xuXG5cdGlmIChvcHRpb25zLmluc2VydEF0ID09PSBcInRvcFwiKSB7XG5cdFx0aWYgKCFsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcCkge1xuXHRcdFx0dGFyZ2V0Lmluc2VydEJlZm9yZShzdHlsZSwgdGFyZ2V0LmZpcnN0Q2hpbGQpO1xuXHRcdH0gZWxzZSBpZiAobGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AubmV4dFNpYmxpbmcpIHtcblx0XHRcdHRhcmdldC5pbnNlcnRCZWZvcmUoc3R5bGUsIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcblx0XHR9XG5cdFx0c3R5bGVzSW5zZXJ0ZWRBdFRvcC5wdXNoKHN0eWxlKTtcblx0fSBlbHNlIGlmIChvcHRpb25zLmluc2VydEF0ID09PSBcImJvdHRvbVwiKSB7XG5cdFx0dGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcblx0fSBlbHNlIGlmICh0eXBlb2Ygb3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJvYmplY3RcIiAmJiBvcHRpb25zLmluc2VydEF0LmJlZm9yZSkge1xuXHRcdHZhciBuZXh0U2libGluZyA9IGdldEVsZW1lbnQob3B0aW9ucy5pbnNlcnRJbnRvICsgXCIgXCIgKyBvcHRpb25zLmluc2VydEF0LmJlZm9yZSk7XG5cdFx0dGFyZ2V0Lmluc2VydEJlZm9yZShzdHlsZSwgbmV4dFNpYmxpbmcpO1xuXHR9IGVsc2Uge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIltTdHlsZSBMb2FkZXJdXFxuXFxuIEludmFsaWQgdmFsdWUgZm9yIHBhcmFtZXRlciAnaW5zZXJ0QXQnICgnb3B0aW9ucy5pbnNlcnRBdCcpIGZvdW5kLlxcbiBNdXN0IGJlICd0b3AnLCAnYm90dG9tJywgb3IgT2JqZWN0LlxcbiAoaHR0cHM6Ly9naXRodWIuY29tL3dlYnBhY2stY29udHJpYi9zdHlsZS1sb2FkZXIjaW5zZXJ0YXQpXFxuXCIpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudCAoc3R5bGUpIHtcblx0aWYgKHN0eWxlLnBhcmVudE5vZGUgPT09IG51bGwpIHJldHVybiBmYWxzZTtcblx0c3R5bGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZSk7XG5cblx0dmFyIGlkeCA9IHN0eWxlc0luc2VydGVkQXRUb3AuaW5kZXhPZihzdHlsZSk7XG5cdGlmKGlkeCA+PSAwKSB7XG5cdFx0c3R5bGVzSW5zZXJ0ZWRBdFRvcC5zcGxpY2UoaWR4LCAxKTtcblx0fVxufVxuXG5mdW5jdGlvbiBjcmVhdGVTdHlsZUVsZW1lbnQgKG9wdGlvbnMpIHtcblx0dmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuXG5cdG9wdGlvbnMuYXR0cnMudHlwZSA9IFwidGV4dC9jc3NcIjtcblxuXHRhZGRBdHRycyhzdHlsZSwgb3B0aW9ucy5hdHRycyk7XG5cdGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBzdHlsZSk7XG5cblx0cmV0dXJuIHN0eWxlO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVMaW5rRWxlbWVudCAob3B0aW9ucykge1xuXHR2YXIgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaW5rXCIpO1xuXG5cdG9wdGlvbnMuYXR0cnMudHlwZSA9IFwidGV4dC9jc3NcIjtcblx0b3B0aW9ucy5hdHRycy5yZWwgPSBcInN0eWxlc2hlZXRcIjtcblxuXHRhZGRBdHRycyhsaW5rLCBvcHRpb25zLmF0dHJzKTtcblx0aW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIGxpbmspO1xuXG5cdHJldHVybiBsaW5rO1xufVxuXG5mdW5jdGlvbiBhZGRBdHRycyAoZWwsIGF0dHJzKSB7XG5cdE9iamVjdC5rZXlzKGF0dHJzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0XHRlbC5zZXRBdHRyaWJ1dGUoa2V5LCBhdHRyc1trZXldKTtcblx0fSk7XG59XG5cbmZ1bmN0aW9uIGFkZFN0eWxlIChvYmosIG9wdGlvbnMpIHtcblx0dmFyIHN0eWxlLCB1cGRhdGUsIHJlbW92ZSwgcmVzdWx0O1xuXG5cdC8vIElmIGEgdHJhbnNmb3JtIGZ1bmN0aW9uIHdhcyBkZWZpbmVkLCBydW4gaXQgb24gdGhlIGNzc1xuXHRpZiAob3B0aW9ucy50cmFuc2Zvcm0gJiYgb2JqLmNzcykge1xuXHQgICAgcmVzdWx0ID0gb3B0aW9ucy50cmFuc2Zvcm0ob2JqLmNzcyk7XG5cblx0ICAgIGlmIChyZXN1bHQpIHtcblx0ICAgIFx0Ly8gSWYgdHJhbnNmb3JtIHJldHVybnMgYSB2YWx1ZSwgdXNlIHRoYXQgaW5zdGVhZCBvZiB0aGUgb3JpZ2luYWwgY3NzLlxuXHQgICAgXHQvLyBUaGlzIGFsbG93cyBydW5uaW5nIHJ1bnRpbWUgdHJhbnNmb3JtYXRpb25zIG9uIHRoZSBjc3MuXG5cdCAgICBcdG9iai5jc3MgPSByZXN1bHQ7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgXHQvLyBJZiB0aGUgdHJhbnNmb3JtIGZ1bmN0aW9uIHJldHVybnMgYSBmYWxzeSB2YWx1ZSwgZG9uJ3QgYWRkIHRoaXMgY3NzLlxuXHQgICAgXHQvLyBUaGlzIGFsbG93cyBjb25kaXRpb25hbCBsb2FkaW5nIG9mIGNzc1xuXHQgICAgXHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdCAgICBcdFx0Ly8gbm9vcFxuXHQgICAgXHR9O1xuXHQgICAgfVxuXHR9XG5cblx0aWYgKG9wdGlvbnMuc2luZ2xldG9uKSB7XG5cdFx0dmFyIHN0eWxlSW5kZXggPSBzaW5nbGV0b25Db3VudGVyKys7XG5cblx0XHRzdHlsZSA9IHNpbmdsZXRvbiB8fCAoc2luZ2xldG9uID0gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpKTtcblxuXHRcdHVwZGF0ZSA9IGFwcGx5VG9TaW5nbGV0b25UYWcuYmluZChudWxsLCBzdHlsZSwgc3R5bGVJbmRleCwgZmFsc2UpO1xuXHRcdHJlbW92ZSA9IGFwcGx5VG9TaW5nbGV0b25UYWcuYmluZChudWxsLCBzdHlsZSwgc3R5bGVJbmRleCwgdHJ1ZSk7XG5cblx0fSBlbHNlIGlmIChcblx0XHRvYmouc291cmNlTWFwICYmXG5cdFx0dHlwZW9mIFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIFVSTC5jcmVhdGVPYmplY3RVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBVUkwucmV2b2tlT2JqZWN0VVJMID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgQmxvYiA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIlxuXHQpIHtcblx0XHRzdHlsZSA9IGNyZWF0ZUxpbmtFbGVtZW50KG9wdGlvbnMpO1xuXHRcdHVwZGF0ZSA9IHVwZGF0ZUxpbmsuYmluZChudWxsLCBzdHlsZSwgb3B0aW9ucyk7XG5cdFx0cmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlKTtcblxuXHRcdFx0aWYoc3R5bGUuaHJlZikgVVJMLnJldm9rZU9iamVjdFVSTChzdHlsZS5ocmVmKTtcblx0XHR9O1xuXHR9IGVsc2Uge1xuXHRcdHN0eWxlID0gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuXHRcdHVwZGF0ZSA9IGFwcGx5VG9UYWcuYmluZChudWxsLCBzdHlsZSk7XG5cdFx0cmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlKTtcblx0XHR9O1xuXHR9XG5cblx0dXBkYXRlKG9iaik7XG5cblx0cmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZVN0eWxlIChuZXdPYmopIHtcblx0XHRpZiAobmV3T2JqKSB7XG5cdFx0XHRpZiAoXG5cdFx0XHRcdG5ld09iai5jc3MgPT09IG9iai5jc3MgJiZcblx0XHRcdFx0bmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiZcblx0XHRcdFx0bmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcFxuXHRcdFx0KSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dXBkYXRlKG9iaiA9IG5ld09iaik7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlbW92ZSgpO1xuXHRcdH1cblx0fTtcbn1cblxudmFyIHJlcGxhY2VUZXh0ID0gKGZ1bmN0aW9uICgpIHtcblx0dmFyIHRleHRTdG9yZSA9IFtdO1xuXG5cdHJldHVybiBmdW5jdGlvbiAoaW5kZXgsIHJlcGxhY2VtZW50KSB7XG5cdFx0dGV4dFN0b3JlW2luZGV4XSA9IHJlcGxhY2VtZW50O1xuXG5cdFx0cmV0dXJuIHRleHRTdG9yZS5maWx0ZXIoQm9vbGVhbikuam9pbignXFxuJyk7XG5cdH07XG59KSgpO1xuXG5mdW5jdGlvbiBhcHBseVRvU2luZ2xldG9uVGFnIChzdHlsZSwgaW5kZXgsIHJlbW92ZSwgb2JqKSB7XG5cdHZhciBjc3MgPSByZW1vdmUgPyBcIlwiIDogb2JqLmNzcztcblxuXHRpZiAoc3R5bGUuc3R5bGVTaGVldCkge1xuXHRcdHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IHJlcGxhY2VUZXh0KGluZGV4LCBjc3MpO1xuXHR9IGVsc2Uge1xuXHRcdHZhciBjc3NOb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKTtcblx0XHR2YXIgY2hpbGROb2RlcyA9IHN0eWxlLmNoaWxkTm9kZXM7XG5cblx0XHRpZiAoY2hpbGROb2Rlc1tpbmRleF0pIHN0eWxlLnJlbW92ZUNoaWxkKGNoaWxkTm9kZXNbaW5kZXhdKTtcblxuXHRcdGlmIChjaGlsZE5vZGVzLmxlbmd0aCkge1xuXHRcdFx0c3R5bGUuaW5zZXJ0QmVmb3JlKGNzc05vZGUsIGNoaWxkTm9kZXNbaW5kZXhdKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c3R5bGUuYXBwZW5kQ2hpbGQoY3NzTm9kZSk7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGFwcGx5VG9UYWcgKHN0eWxlLCBvYmopIHtcblx0dmFyIGNzcyA9IG9iai5jc3M7XG5cdHZhciBtZWRpYSA9IG9iai5tZWRpYTtcblxuXHRpZihtZWRpYSkge1xuXHRcdHN0eWxlLnNldEF0dHJpYnV0ZShcIm1lZGlhXCIsIG1lZGlhKVxuXHR9XG5cblx0aWYoc3R5bGUuc3R5bGVTaGVldCkge1xuXHRcdHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcblx0fSBlbHNlIHtcblx0XHR3aGlsZShzdHlsZS5maXJzdENoaWxkKSB7XG5cdFx0XHRzdHlsZS5yZW1vdmVDaGlsZChzdHlsZS5maXJzdENoaWxkKTtcblx0XHR9XG5cblx0XHRzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcblx0fVxufVxuXG5mdW5jdGlvbiB1cGRhdGVMaW5rIChsaW5rLCBvcHRpb25zLCBvYmopIHtcblx0dmFyIGNzcyA9IG9iai5jc3M7XG5cdHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuXG5cdC8qXG5cdFx0SWYgY29udmVydFRvQWJzb2x1dGVVcmxzIGlzbid0IGRlZmluZWQsIGJ1dCBzb3VyY2VtYXBzIGFyZSBlbmFibGVkXG5cdFx0YW5kIHRoZXJlIGlzIG5vIHB1YmxpY1BhdGggZGVmaW5lZCB0aGVuIGxldHMgdHVybiBjb252ZXJ0VG9BYnNvbHV0ZVVybHNcblx0XHRvbiBieSBkZWZhdWx0LiAgT3RoZXJ3aXNlIGRlZmF1bHQgdG8gdGhlIGNvbnZlcnRUb0Fic29sdXRlVXJscyBvcHRpb25cblx0XHRkaXJlY3RseVxuXHQqL1xuXHR2YXIgYXV0b0ZpeFVybHMgPSBvcHRpb25zLmNvbnZlcnRUb0Fic29sdXRlVXJscyA9PT0gdW5kZWZpbmVkICYmIHNvdXJjZU1hcDtcblxuXHRpZiAob3B0aW9ucy5jb252ZXJ0VG9BYnNvbHV0ZVVybHMgfHwgYXV0b0ZpeFVybHMpIHtcblx0XHRjc3MgPSBmaXhVcmxzKGNzcyk7XG5cdH1cblxuXHRpZiAoc291cmNlTWFwKSB7XG5cdFx0Ly8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjY2MDM4NzVcblx0XHRjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiICsgYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSArIFwiICovXCI7XG5cdH1cblxuXHR2YXIgYmxvYiA9IG5ldyBCbG9iKFtjc3NdLCB7IHR5cGU6IFwidGV4dC9jc3NcIiB9KTtcblxuXHR2YXIgb2xkU3JjID0gbGluay5ocmVmO1xuXG5cdGxpbmsuaHJlZiA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG5cblx0aWYob2xkU3JjKSBVUkwucmV2b2tlT2JqZWN0VVJMKG9sZFNyYyk7XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qc1xuLy8gbW9kdWxlIGlkID0gMTRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiXG4vKipcbiAqIFdoZW4gc291cmNlIG1hcHMgYXJlIGVuYWJsZWQsIGBzdHlsZS1sb2FkZXJgIHVzZXMgYSBsaW5rIGVsZW1lbnQgd2l0aCBhIGRhdGEtdXJpIHRvXG4gKiBlbWJlZCB0aGUgY3NzIG9uIHRoZSBwYWdlLiBUaGlzIGJyZWFrcyBhbGwgcmVsYXRpdmUgdXJscyBiZWNhdXNlIG5vdyB0aGV5IGFyZSByZWxhdGl2ZSB0byBhXG4gKiBidW5kbGUgaW5zdGVhZCBvZiB0aGUgY3VycmVudCBwYWdlLlxuICpcbiAqIE9uZSBzb2x1dGlvbiBpcyB0byBvbmx5IHVzZSBmdWxsIHVybHMsIGJ1dCB0aGF0IG1heSBiZSBpbXBvc3NpYmxlLlxuICpcbiAqIEluc3RlYWQsIHRoaXMgZnVuY3Rpb24gXCJmaXhlc1wiIHRoZSByZWxhdGl2ZSB1cmxzIHRvIGJlIGFic29sdXRlIGFjY29yZGluZyB0byB0aGUgY3VycmVudCBwYWdlIGxvY2F0aW9uLlxuICpcbiAqIEEgcnVkaW1lbnRhcnkgdGVzdCBzdWl0ZSBpcyBsb2NhdGVkIGF0IGB0ZXN0L2ZpeFVybHMuanNgIGFuZCBjYW4gYmUgcnVuIHZpYSB0aGUgYG5wbSB0ZXN0YCBjb21tYW5kLlxuICpcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3MpIHtcbiAgLy8gZ2V0IGN1cnJlbnQgbG9jYXRpb25cbiAgdmFyIGxvY2F0aW9uID0gdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB3aW5kb3cubG9jYXRpb247XG5cbiAgaWYgKCFsb2NhdGlvbikge1xuICAgIHRocm93IG5ldyBFcnJvcihcImZpeFVybHMgcmVxdWlyZXMgd2luZG93LmxvY2F0aW9uXCIpO1xuICB9XG5cblx0Ly8gYmxhbmsgb3IgbnVsbD9cblx0aWYgKCFjc3MgfHwgdHlwZW9mIGNzcyAhPT0gXCJzdHJpbmdcIikge1xuXHQgIHJldHVybiBjc3M7XG4gIH1cblxuICB2YXIgYmFzZVVybCA9IGxvY2F0aW9uLnByb3RvY29sICsgXCIvL1wiICsgbG9jYXRpb24uaG9zdDtcbiAgdmFyIGN1cnJlbnREaXIgPSBiYXNlVXJsICsgbG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZSgvXFwvW15cXC9dKiQvLCBcIi9cIik7XG5cblx0Ly8gY29udmVydCBlYWNoIHVybCguLi4pXG5cdC8qXG5cdFRoaXMgcmVndWxhciBleHByZXNzaW9uIGlzIGp1c3QgYSB3YXkgdG8gcmVjdXJzaXZlbHkgbWF0Y2ggYnJhY2tldHMgd2l0aGluXG5cdGEgc3RyaW5nLlxuXG5cdCAvdXJsXFxzKlxcKCAgPSBNYXRjaCBvbiB0aGUgd29yZCBcInVybFwiIHdpdGggYW55IHdoaXRlc3BhY2UgYWZ0ZXIgaXQgYW5kIHRoZW4gYSBwYXJlbnNcblx0ICAgKCAgPSBTdGFydCBhIGNhcHR1cmluZyBncm91cFxuXHQgICAgICg/OiAgPSBTdGFydCBhIG5vbi1jYXB0dXJpbmcgZ3JvdXBcblx0ICAgICAgICAgW14pKF0gID0gTWF0Y2ggYW55dGhpbmcgdGhhdCBpc24ndCBhIHBhcmVudGhlc2VzXG5cdCAgICAgICAgIHwgID0gT1Jcblx0ICAgICAgICAgXFwoICA9IE1hdGNoIGEgc3RhcnQgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICg/OiAgPSBTdGFydCBhbm90aGVyIG5vbi1jYXB0dXJpbmcgZ3JvdXBzXG5cdCAgICAgICAgICAgICAgICAgW14pKF0rICA9IE1hdGNoIGFueXRoaW5nIHRoYXQgaXNuJ3QgYSBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgICAgIHwgID0gT1Jcblx0ICAgICAgICAgICAgICAgICBcXCggID0gTWF0Y2ggYSBzdGFydCBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgICAgICAgICBbXikoXSogID0gTWF0Y2ggYW55dGhpbmcgdGhhdCBpc24ndCBhIHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAgICAgXFwpICA9IE1hdGNoIGEgZW5kIHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICApICA9IEVuZCBHcm91cFxuICAgICAgICAgICAgICAqXFwpID0gTWF0Y2ggYW55dGhpbmcgYW5kIHRoZW4gYSBjbG9zZSBwYXJlbnNcbiAgICAgICAgICApICA9IENsb3NlIG5vbi1jYXB0dXJpbmcgZ3JvdXBcbiAgICAgICAgICAqICA9IE1hdGNoIGFueXRoaW5nXG4gICAgICAgKSAgPSBDbG9zZSBjYXB0dXJpbmcgZ3JvdXBcblx0IFxcKSAgPSBNYXRjaCBhIGNsb3NlIHBhcmVuc1xuXG5cdCAvZ2kgID0gR2V0IGFsbCBtYXRjaGVzLCBub3QgdGhlIGZpcnN0LiAgQmUgY2FzZSBpbnNlbnNpdGl2ZS5cblx0ICovXG5cdHZhciBmaXhlZENzcyA9IGNzcy5yZXBsYWNlKC91cmxcXHMqXFwoKCg/OlteKShdfFxcKCg/OlteKShdK3xcXChbXikoXSpcXCkpKlxcKSkqKVxcKS9naSwgZnVuY3Rpb24oZnVsbE1hdGNoLCBvcmlnVXJsKSB7XG5cdFx0Ly8gc3RyaXAgcXVvdGVzIChpZiB0aGV5IGV4aXN0KVxuXHRcdHZhciB1bnF1b3RlZE9yaWdVcmwgPSBvcmlnVXJsXG5cdFx0XHQudHJpbSgpXG5cdFx0XHQucmVwbGFjZSgvXlwiKC4qKVwiJC8sIGZ1bmN0aW9uKG8sICQxKXsgcmV0dXJuICQxOyB9KVxuXHRcdFx0LnJlcGxhY2UoL14nKC4qKSckLywgZnVuY3Rpb24obywgJDEpeyByZXR1cm4gJDE7IH0pO1xuXG5cdFx0Ly8gYWxyZWFkeSBhIGZ1bGwgdXJsPyBubyBjaGFuZ2Vcblx0XHRpZiAoL14oI3xkYXRhOnxodHRwOlxcL1xcL3xodHRwczpcXC9cXC98ZmlsZTpcXC9cXC9cXC8pL2kudGVzdCh1bnF1b3RlZE9yaWdVcmwpKSB7XG5cdFx0ICByZXR1cm4gZnVsbE1hdGNoO1xuXHRcdH1cblxuXHRcdC8vIGNvbnZlcnQgdGhlIHVybCB0byBhIGZ1bGwgdXJsXG5cdFx0dmFyIG5ld1VybDtcblxuXHRcdGlmICh1bnF1b3RlZE9yaWdVcmwuaW5kZXhPZihcIi8vXCIpID09PSAwKSB7XG5cdFx0ICBcdC8vVE9ETzogc2hvdWxkIHdlIGFkZCBwcm90b2NvbD9cblx0XHRcdG5ld1VybCA9IHVucXVvdGVkT3JpZ1VybDtcblx0XHR9IGVsc2UgaWYgKHVucXVvdGVkT3JpZ1VybC5pbmRleE9mKFwiL1wiKSA9PT0gMCkge1xuXHRcdFx0Ly8gcGF0aCBzaG91bGQgYmUgcmVsYXRpdmUgdG8gdGhlIGJhc2UgdXJsXG5cdFx0XHRuZXdVcmwgPSBiYXNlVXJsICsgdW5xdW90ZWRPcmlnVXJsOyAvLyBhbHJlYWR5IHN0YXJ0cyB3aXRoICcvJ1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBwYXRoIHNob3VsZCBiZSByZWxhdGl2ZSB0byBjdXJyZW50IGRpcmVjdG9yeVxuXHRcdFx0bmV3VXJsID0gY3VycmVudERpciArIHVucXVvdGVkT3JpZ1VybC5yZXBsYWNlKC9eXFwuXFwvLywgXCJcIik7IC8vIFN0cmlwIGxlYWRpbmcgJy4vJ1xuXHRcdH1cblxuXHRcdC8vIHNlbmQgYmFjayB0aGUgZml4ZWQgdXJsKC4uLilcblx0XHRyZXR1cm4gXCJ1cmwoXCIgKyBKU09OLnN0cmluZ2lmeShuZXdVcmwpICsgXCIpXCI7XG5cdH0pO1xuXG5cdC8vIHNlbmQgYmFjayB0aGUgZml4ZWQgY3NzXG5cdHJldHVybiBmaXhlZENzcztcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL3VybHMuanNcbi8vIG1vZHVsZSBpZCA9IDE1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikodW5kZWZpbmVkKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIi5idXR0b24ge1xcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbiAgKmRpc3BsYXk6IGlubGluZTtcXG4gIHpvb206IDE7XFxuICBwYWRkaW5nOiA2cHggMjBweDtcXG4gIG1hcmdpbjogMDtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG4gIGJvcmRlcjogMXB4IHNvbGlkICNiYmI7XFxuICBvdmVyZmxvdzogdmlzaWJsZTtcXG4gIGZvbnQ6IGJvbGQgMWVtIGFyaWFsLCBoZWx2ZXRpY2EsIHNhbnMtc2VyaWY7XFxuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxuICB3aGl0ZS1zcGFjZTogbm93cmFwO1xcbiAgY29sb3I6ICM1NTU7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZGRkO1xcbiAgYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KHRvcCwgd2hpdGUsIHJnYmEoMjU1LCAyNTUsIDI1NSwgMCkpLCB1cmwoZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dbLi4uXVFtQ0MpO1xcbiAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAuMnMgZWFzZS1vdXQ7XFxuICBiYWNrZ3JvdW5kLWNsaXA6IHBhZGRpbmctYm94O1xcbiAgLyogRml4IGJsZWVkaW5nICovXFxuICBib3JkZXItcmFkaXVzOiAzcHg7XFxuICBib3gtc2hhZG93OiAwIDFweCAwIHJnYmEoMCwgMCwgMCwgMC4zKSwgMCAycHggMnB4IC0xcHggcmdiYSgwLCAwLCAwLCAwLjUpLCAwIDFweCAwIHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4zKSBpbnNldDtcXG4gIHRleHQtc2hhZG93OiAwIDFweCAwIHJnYmEoMjU1LCAyNTUsIDI1NSwgMC45KTsgfVxcblxcbi5idXR0b246aG92ZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2VlZTtcXG4gIGNvbG9yOiAjNTU1OyB9XFxuXFxuLmJ1dHRvbjphY3RpdmUge1xcbiAgYmFja2dyb3VuZDogI2U5ZTllOTtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIHRvcDogMXB4O1xcbiAgdGV4dC1zaGFkb3c6IG5vbmU7XFxuICBib3gtc2hhZG93OiAwIDFweCAxcHggcmdiYSgwLCAwLCAwLCAwLjMpIGluc2V0OyB9XFxuXFxuLmJ1dHRvbi5jb2xvciB7XFxuICBjb2xvcjogI2ZmZjtcXG4gIHRleHQtc2hhZG93OiAwIDFweCAwIHJnYmEoMCwgMCwgMCwgMC4yKTtcXG4gIGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCh0b3AsIHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4zKSwgcmdiYSgyNTUsIDI1NSwgMjU1LCAwKSksIHVybChkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ1suLi5dUW1DQyk7IH1cXG5cXG4uYnV0dG9uLnJlZCB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjYzQzYzM1O1xcbiAgYm9yZGVyLWNvbG9yOiAjYzQzYzM1OyB9XFxuXFxuLmJ1dHRvbi5yZWQ6aG92ZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2VlNWY1YjsgfVxcblxcbi5idXR0b24ucmVkOmFjdGl2ZSB7XFxuICBiYWNrZ3JvdW5kOiAjYzQzYzM1OyB9XFxuXFxuLmJ1dHRvbi5sYXJnZSB7XFxuICBwYWRkaW5nOiAxMnB4IDMwcHg7IH1cXG5cIiwgXCJcIl0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyP3tcInVybFwiOmZhbHNlfSEuL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzIS4vc2Nzcy9idXR0b25zLnNjc3Ncbi8vIG1vZHVsZSBpZCA9IDE4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS0xLTEhLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanMhLi9idXR0b25zLnNjc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIFByZXBhcmUgY3NzVHJhbnNmb3JtYXRpb25cbnZhciB0cmFuc2Zvcm07XG5cbnZhciBvcHRpb25zID0ge1wiaG1yXCI6dHJ1ZX1cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTEtMSEuLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcyEuL2J1dHRvbnMuc2Nzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMS0xIS4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzIS4vYnV0dG9ucy5zY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3Njc3MvYnV0dG9ucy5zY3NzXG4vLyBtb2R1bGUgaWQgPSAxOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHVuZGVmaW5lZCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCJodG1sIHtcXG4gIGNvbG9yOiAjRjBGOEZGO1xcbiAgdGV4dC1zaGFkb3c6IC0xcHggMCBibGFjaywgMCAxcHggYmxhY2ssIDFweCAwIGJsYWNrLCAwIC0xcHggYmxhY2s7XFxuICBmb250LWZhbWlseTogJ1JvYm90bycsIHNhbnMtc2VyaWY7XFxuICBmb250LXNpemU6IDI2cHg7XFxuICBmb250LXdlaWdodDogYm9sZDtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMwNzYzMjQ7XFxuICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXFxcImh0dHA6Ly93d3cudHJhbnNwYXJlbnR0ZXh0dXJlcy5jb20vcGF0dGVybnMvYmxhY2stZmVsdC5wbmdcXFwiKTsgfVxcblxcbmgxIHtcXG4gIGZvbnQtZmFtaWx5OiAnV2VuZHkgT25lJywgc2Fucy1zZXJpZjtcXG4gIG1hcmdpbjogMjBweDtcXG4gIGZvbnQtc2l6ZTogNmVtO1xcbiAgdGV4dC1zaGFkb3c6IC0xMHB4IDAgYmxhY2ssIDAgM3B4IGJsYWNrLCAtMTBweCAwIGJsYWNrLCAwIC04cHggYmxhY2s7IH1cXG5cXG4uYnV0dG9ucyB7XFxuICBtYXJnaW4tdG9wOiAyMHB4OyB9XFxuXFxuLmZsYWcge1xcbiAgbWFyZ2luOiAxMHB4O1xcbiAgYmFja2dyb3VuZDogbm9uZTtcXG4gIGJvcmRlcjogbm9uZTsgfVxcblxcbi5iaWQtZXJyb3Ige1xcbiAgY29sb3I6ICNmZjFhMWE7XFxuICBmb250LXdlaWdodDogYm9sZDsgfVxcblxcbmJ1dHRvbi5zdGFydCB7XFxuICBtYXJnaW4tdG9wOiAyMHB4OyB9XFxuXFxuaW5wdXQge1xcbiAgcGFkZGluZzogMTJweCAyMHB4O1xcbiAgbWFyZ2luOiA4cHggMDtcXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXG4gIGJvcmRlcjogMXB4IHNvbGlkICNjY2M7XFxuICBib3JkZXItcmFkaXVzOiA0cHg7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94OyB9XFxuXFxuLm1vbmV5LWZvcm1hdCB7XFxuICBjb2xvcjogI2ZmYTMxYTsgfVxcblxcbi5tb25leS1mb3JtYXQ6OmFmdGVyIHtcXG4gIGNvbnRlbnQ6ICckJzsgfVxcblxcbi5jYXJkLWNvbnRhaW5lciB7XFxuICBoZWlnaHQ6IDEwMHB4OyB9XFxuXFxuI2JsYWNramFjayB7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7IH1cXG5cXG4ubXktbW9uZXkge1xcbiAgcGFkZGluZzogMTBweCAxNXB4OyB9XFxuXFxuLm15LWJpZCB7XFxuICBwYWRkaW5nOiAxNXB4O1xcbiAgbWFyZ2luOiAxMHB4OyB9XFxuXFxuLmNhcmQge1xcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbiAgbWFyZ2luOiAycHg7IH1cXG5cXG5AbWVkaWEgb25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDUwMHB4KSB7XFxuICBodG1sIHtcXG4gICAgZm9udC1zaXplOiAxNnB4OyB9XFxuICBoMSB7XFxuICAgIG1hcmdpbi1ib3R0b206IDIwcHg7XFxuICAgIGZvbnQtc2l6ZTogM2VtOyB9IH1cXG5cXG4uYWNlX2NsdWJzIHtcXG4gIHdpZHRoOiA3MXB4O1xcbiAgaGVpZ2h0OiA5N3B4O1xcbiAgYmFja2dyb3VuZDogdXJsKFxcXCJpbWFnZXMvd2luZG93cy1wbGF5aW5nLWNhcmRzLnBuZ1xcXCIpIC0ycHggLTFweDsgfVxcblxcbi50d29fY2x1YnMge1xcbiAgd2lkdGg6IDcxcHg7XFxuICBoZWlnaHQ6IDk3cHg7XFxuICBiYWNrZ3JvdW5kOiB1cmwoXFxcImltYWdlcy93aW5kb3dzLXBsYXlpbmctY2FyZHMucG5nXFxcIikgLTc1cHggLTFweDsgfVxcblxcbi50aHJlZV9jbHVicyB7XFxuICB3aWR0aDogNzFweDtcXG4gIGhlaWdodDogOTdweDtcXG4gIGJhY2tncm91bmQ6IHVybChcXFwiaW1hZ2VzL3dpbmRvd3MtcGxheWluZy1jYXJkcy5wbmdcXFwiKSAtMTQ4cHggLTFweDsgfVxcblxcbi5mb3VyX2NsdWJzIHtcXG4gIHdpZHRoOiA3MXB4O1xcbiAgaGVpZ2h0OiA5N3B4O1xcbiAgYmFja2dyb3VuZDogdXJsKFxcXCJpbWFnZXMvd2luZG93cy1wbGF5aW5nLWNhcmRzLnBuZ1xcXCIpIC0yMjFweCAtMXB4OyB9XFxuXFxuLmZpdmVfY2x1YnMge1xcbiAgd2lkdGg6IDcxcHg7XFxuICBoZWlnaHQ6IDk3cHg7XFxuICBiYWNrZ3JvdW5kOiB1cmwoXFxcImltYWdlcy93aW5kb3dzLXBsYXlpbmctY2FyZHMucG5nXFxcIikgLTI5NHB4IC0xcHg7IH1cXG5cXG4uc2l4X2NsdWJzIHtcXG4gIHdpZHRoOiA3MXB4O1xcbiAgaGVpZ2h0OiA5N3B4O1xcbiAgYmFja2dyb3VuZDogdXJsKFxcXCJpbWFnZXMvd2luZG93cy1wbGF5aW5nLWNhcmRzLnBuZ1xcXCIpIC0zNjdweCAtMXB4OyB9XFxuXFxuLnNldmVuX2NsdWJzIHtcXG4gIHdpZHRoOiA3MXB4O1xcbiAgaGVpZ2h0OiA5N3B4O1xcbiAgYmFja2dyb3VuZDogdXJsKFxcXCJpbWFnZXMvd2luZG93cy1wbGF5aW5nLWNhcmRzLnBuZ1xcXCIpIC00NDBweCAtMXB4OyB9XFxuXFxuLmVpZ2h0X2NsdWJzIHtcXG4gIHdpZHRoOiA3MXB4O1xcbiAgaGVpZ2h0OiA5N3B4O1xcbiAgYmFja2dyb3VuZDogdXJsKFxcXCJpbWFnZXMvd2luZG93cy1wbGF5aW5nLWNhcmRzLnBuZ1xcXCIpIC01MTNweCAtMXB4OyB9XFxuXFxuLm5pbmVfY2x1YnMge1xcbiAgd2lkdGg6IDcxcHg7XFxuICBoZWlnaHQ6IDk3cHg7XFxuICBiYWNrZ3JvdW5kOiB1cmwoXFxcImltYWdlcy93aW5kb3dzLXBsYXlpbmctY2FyZHMucG5nXFxcIikgLTU4NnB4IC0xcHg7IH1cXG5cXG4udGVuX2NsdWJzIHtcXG4gIHdpZHRoOiA3MXB4O1xcbiAgaGVpZ2h0OiA5N3B4O1xcbiAgYmFja2dyb3VuZDogdXJsKFxcXCJpbWFnZXMvd2luZG93cy1wbGF5aW5nLWNhcmRzLnBuZ1xcXCIpIC02NTlweCAtMXB4OyB9XFxuXFxuLmphY2tfY2x1YnMge1xcbiAgd2lkdGg6IDcxcHg7XFxuICBoZWlnaHQ6IDk3cHg7XFxuICBiYWNrZ3JvdW5kOiB1cmwoXFxcImltYWdlcy93aW5kb3dzLXBsYXlpbmctY2FyZHMucG5nXFxcIikgLTczMnB4IC0xcHg7IH1cXG5cXG4ucXVlZW5fY2x1YnMge1xcbiAgd2lkdGg6IDcxcHg7XFxuICBoZWlnaHQ6IDk3cHg7XFxuICBiYWNrZ3JvdW5kOiB1cmwoXFxcImltYWdlcy93aW5kb3dzLXBsYXlpbmctY2FyZHMucG5nXFxcIikgLTgwNXB4IC0xcHg7IH1cXG5cXG4ua2luZ19jbHVicyB7XFxuICB3aWR0aDogNzFweDtcXG4gIGhlaWdodDogOTdweDtcXG4gIGJhY2tncm91bmQ6IHVybChcXFwiaW1hZ2VzL3dpbmRvd3MtcGxheWluZy1jYXJkcy5wbmdcXFwiKSAtODc4cHggLTFweDsgfVxcblxcbi5hY2VfaGVhcnRzIHtcXG4gIHdpZHRoOiA3MXB4O1xcbiAgaGVpZ2h0OiA5N3B4O1xcbiAgYmFja2dyb3VuZDogdXJsKFxcXCJpbWFnZXMvd2luZG93cy1wbGF5aW5nLWNhcmRzLnBuZ1xcXCIpIC0ycHggLTk5cHg7IH1cXG5cXG4udHdvX2hlYXJ0cyB7XFxuICB3aWR0aDogNzFweDtcXG4gIGhlaWdodDogOTdweDtcXG4gIGJhY2tncm91bmQ6IHVybChcXFwiaW1hZ2VzL3dpbmRvd3MtcGxheWluZy1jYXJkcy5wbmdcXFwiKSAtNzVweCAtOTlweDsgfVxcblxcbi50aHJlZV9oZWFydHMge1xcbiAgd2lkdGg6IDcxcHg7XFxuICBoZWlnaHQ6IDk3cHg7XFxuICBiYWNrZ3JvdW5kOiB1cmwoXFxcImltYWdlcy93aW5kb3dzLXBsYXlpbmctY2FyZHMucG5nXFxcIikgLTE0OHB4IC05OXB4OyB9XFxuXFxuLmZvdXJfaGVhcnRzIHtcXG4gIHdpZHRoOiA3MXB4O1xcbiAgaGVpZ2h0OiA5N3B4O1xcbiAgYmFja2dyb3VuZDogdXJsKFxcXCJpbWFnZXMvd2luZG93cy1wbGF5aW5nLWNhcmRzLnBuZ1xcXCIpIC0yMjFweCAtOTlweDsgfVxcblxcbi5maXZlX2hlYXJ0cyB7XFxuICB3aWR0aDogNzFweDtcXG4gIGhlaWdodDogOTdweDtcXG4gIGJhY2tncm91bmQ6IHVybChcXFwiaW1hZ2VzL3dpbmRvd3MtcGxheWluZy1jYXJkcy5wbmdcXFwiKSAtMjk0cHggLTk5cHg7IH1cXG5cXG4uc2l4X2hlYXJ0cyB7XFxuICB3aWR0aDogNzFweDtcXG4gIGhlaWdodDogOTdweDtcXG4gIGJhY2tncm91bmQ6IHVybChcXFwiaW1hZ2VzL3dpbmRvd3MtcGxheWluZy1jYXJkcy5wbmdcXFwiKSAtMzY3cHggLTk5cHg7IH1cXG5cXG4uc2V2ZW5faGVhcnRzIHtcXG4gIHdpZHRoOiA3MXB4O1xcbiAgaGVpZ2h0OiA5N3B4O1xcbiAgYmFja2dyb3VuZDogdXJsKFxcXCJpbWFnZXMvd2luZG93cy1wbGF5aW5nLWNhcmRzLnBuZ1xcXCIpIC00NDBweCAtOTlweDsgfVxcblxcbi5laWdodF9oZWFydHMge1xcbiAgd2lkdGg6IDcxcHg7XFxuICBoZWlnaHQ6IDk3cHg7XFxuICBiYWNrZ3JvdW5kOiB1cmwoXFxcImltYWdlcy93aW5kb3dzLXBsYXlpbmctY2FyZHMucG5nXFxcIikgLTUxM3B4IC05OXB4OyB9XFxuXFxuLm5pbmVfaGVhcnRzIHtcXG4gIHdpZHRoOiA3MXB4O1xcbiAgaGVpZ2h0OiA5N3B4O1xcbiAgYmFja2dyb3VuZDogdXJsKFxcXCJpbWFnZXMvd2luZG93cy1wbGF5aW5nLWNhcmRzLnBuZ1xcXCIpIC01ODZweCAtOTlweDsgfVxcblxcbi50ZW5faGVhcnRzIHtcXG4gIHdpZHRoOiA3MXB4O1xcbiAgaGVpZ2h0OiA5N3B4O1xcbiAgYmFja2dyb3VuZDogdXJsKFxcXCJpbWFnZXMvd2luZG93cy1wbGF5aW5nLWNhcmRzLnBuZ1xcXCIpIC02NTlweCAtOTlweDsgfVxcblxcbi5qYWNrX2hlYXJ0cyB7XFxuICB3aWR0aDogNzFweDtcXG4gIGhlaWdodDogOTdweDtcXG4gIGJhY2tncm91bmQ6IHVybChcXFwiaW1hZ2VzL3dpbmRvd3MtcGxheWluZy1jYXJkcy5wbmdcXFwiKSAtNzMycHggLTk5cHg7IH1cXG5cXG4ucXVlZW5faGVhcnRzIHtcXG4gIHdpZHRoOiA3MXB4O1xcbiAgaGVpZ2h0OiA5N3B4O1xcbiAgYmFja2dyb3VuZDogdXJsKFxcXCJpbWFnZXMvd2luZG93cy1wbGF5aW5nLWNhcmRzLnBuZ1xcXCIpIC04MDVweCAtOTlweDsgfVxcblxcbi5raW5nX2hlYXJ0cyB7XFxuICB3aWR0aDogNzFweDtcXG4gIGhlaWdodDogOTdweDtcXG4gIGJhY2tncm91bmQ6IHVybChcXFwiaW1hZ2VzL3dpbmRvd3MtcGxheWluZy1jYXJkcy5wbmdcXFwiKSAtODc4cHggLTk5cHg7IH1cXG5cXG4uYWNlX3NwYWRlcyB7XFxuICB3aWR0aDogNzFweDtcXG4gIGhlaWdodDogOTdweDtcXG4gIGJhY2tncm91bmQ6IHVybChcXFwiaW1hZ2VzL3dpbmRvd3MtcGxheWluZy1jYXJkcy5wbmdcXFwiKSAtMnB4IC0xOTdweDsgfVxcblxcbi50d29fc3BhZGVzIHtcXG4gIHdpZHRoOiA3MXB4O1xcbiAgaGVpZ2h0OiA5N3B4O1xcbiAgYmFja2dyb3VuZDogdXJsKFxcXCJpbWFnZXMvd2luZG93cy1wbGF5aW5nLWNhcmRzLnBuZ1xcXCIpIC03NXB4IC0xOTdweDsgfVxcblxcbi50aHJlZV9zcGFkZXMge1xcbiAgd2lkdGg6IDcxcHg7XFxuICBoZWlnaHQ6IDk3cHg7XFxuICBiYWNrZ3JvdW5kOiB1cmwoXFxcImltYWdlcy93aW5kb3dzLXBsYXlpbmctY2FyZHMucG5nXFxcIikgLTE0OHB4IC0xOTdweDsgfVxcblxcbi5mb3VyX3NwYWRlcyB7XFxuICB3aWR0aDogNzFweDtcXG4gIGhlaWdodDogOTdweDtcXG4gIGJhY2tncm91bmQ6IHVybChcXFwiaW1hZ2VzL3dpbmRvd3MtcGxheWluZy1jYXJkcy5wbmdcXFwiKSAtMjIxcHggLTE5N3B4OyB9XFxuXFxuLmZpdmVfc3BhZGVzIHtcXG4gIHdpZHRoOiA3MXB4O1xcbiAgaGVpZ2h0OiA5N3B4O1xcbiAgYmFja2dyb3VuZDogdXJsKFxcXCJpbWFnZXMvd2luZG93cy1wbGF5aW5nLWNhcmRzLnBuZ1xcXCIpIC0yOTRweCAtMTk3cHg7IH1cXG5cXG4uc2l4X3NwYWRlcyB7XFxuICB3aWR0aDogNzFweDtcXG4gIGhlaWdodDogOTdweDtcXG4gIGJhY2tncm91bmQ6IHVybChcXFwiaW1hZ2VzL3dpbmRvd3MtcGxheWluZy1jYXJkcy5wbmdcXFwiKSAtMzY3cHggLTE5N3B4OyB9XFxuXFxuLnNldmVuX3NwYWRlcyB7XFxuICB3aWR0aDogNzFweDtcXG4gIGhlaWdodDogOTdweDtcXG4gIGJhY2tncm91bmQ6IHVybChcXFwiaW1hZ2VzL3dpbmRvd3MtcGxheWluZy1jYXJkcy5wbmdcXFwiKSAtNDQwcHggLTE5N3B4OyB9XFxuXFxuLmVpZ2h0X3NwYWRlcyB7XFxuICB3aWR0aDogNzFweDtcXG4gIGhlaWdodDogOTdweDtcXG4gIGJhY2tncm91bmQ6IHVybChcXFwiaW1hZ2VzL3dpbmRvd3MtcGxheWluZy1jYXJkcy5wbmdcXFwiKSAtNTEzcHggLTE5N3B4OyB9XFxuXFxuLm5pbmVfc3BhZGVzIHtcXG4gIHdpZHRoOiA3MXB4O1xcbiAgaGVpZ2h0OiA5N3B4O1xcbiAgYmFja2dyb3VuZDogdXJsKFxcXCJpbWFnZXMvd2luZG93cy1wbGF5aW5nLWNhcmRzLnBuZ1xcXCIpIC01ODZweCAtMTk3cHg7IH1cXG5cXG4udGVuX3NwYWRlcyB7XFxuICB3aWR0aDogNzFweDtcXG4gIGhlaWdodDogOTdweDtcXG4gIGJhY2tncm91bmQ6IHVybChcXFwiaW1hZ2VzL3dpbmRvd3MtcGxheWluZy1jYXJkcy5wbmdcXFwiKSAtNjU5cHggLTE5N3B4OyB9XFxuXFxuLmphY2tfc3BhZGVzIHtcXG4gIHdpZHRoOiA3MXB4O1xcbiAgaGVpZ2h0OiA5N3B4O1xcbiAgYmFja2dyb3VuZDogdXJsKFxcXCJpbWFnZXMvd2luZG93cy1wbGF5aW5nLWNhcmRzLnBuZ1xcXCIpIC03MzJweCAtMTk3cHg7IH1cXG5cXG4ucXVlZW5fc3BhZGVzIHtcXG4gIHdpZHRoOiA3MXB4O1xcbiAgaGVpZ2h0OiA5N3B4O1xcbiAgYmFja2dyb3VuZDogdXJsKFxcXCJpbWFnZXMvd2luZG93cy1wbGF5aW5nLWNhcmRzLnBuZ1xcXCIpIC04MDVweCAtMTk3cHg7IH1cXG5cXG4ua2luZ19zcGFkZXMge1xcbiAgd2lkdGg6IDcxcHg7XFxuICBoZWlnaHQ6IDk3cHg7XFxuICBiYWNrZ3JvdW5kOiB1cmwoXFxcImltYWdlcy93aW5kb3dzLXBsYXlpbmctY2FyZHMucG5nXFxcIikgLTg3OHB4IC0xOTdweDsgfVxcblxcbi5hY2VfZGlhbW9uZHMge1xcbiAgd2lkdGg6IDcxcHg7XFxuICBoZWlnaHQ6IDk3cHg7XFxuICBiYWNrZ3JvdW5kOiB1cmwoXFxcImltYWdlcy93aW5kb3dzLXBsYXlpbmctY2FyZHMucG5nXFxcIikgLTJweCAtMjk1cHg7IH1cXG5cXG4udHdvX2RpYW1vbmRzIHtcXG4gIHdpZHRoOiA3MXB4O1xcbiAgaGVpZ2h0OiA5N3B4O1xcbiAgYmFja2dyb3VuZDogdXJsKFxcXCJpbWFnZXMvd2luZG93cy1wbGF5aW5nLWNhcmRzLnBuZ1xcXCIpIC03NXB4IC0yOTVweDsgfVxcblxcbi50aHJlZV9kaWFtb25kcyB7XFxuICB3aWR0aDogNzFweDtcXG4gIGhlaWdodDogOTdweDtcXG4gIGJhY2tncm91bmQ6IHVybChcXFwiaW1hZ2VzL3dpbmRvd3MtcGxheWluZy1jYXJkcy5wbmdcXFwiKSAtMTQ4cHggLTI5NXB4OyB9XFxuXFxuLmZvdXJfZGlhbW9uZHMge1xcbiAgd2lkdGg6IDcxcHg7XFxuICBoZWlnaHQ6IDk3cHg7XFxuICBiYWNrZ3JvdW5kOiB1cmwoXFxcImltYWdlcy93aW5kb3dzLXBsYXlpbmctY2FyZHMucG5nXFxcIikgLTIyMXB4IC0yOTVweDsgfVxcblxcbi5maXZlX2RpYW1vbmRzIHtcXG4gIHdpZHRoOiA3MXB4O1xcbiAgaGVpZ2h0OiA5N3B4O1xcbiAgYmFja2dyb3VuZDogdXJsKFxcXCJpbWFnZXMvd2luZG93cy1wbGF5aW5nLWNhcmRzLnBuZ1xcXCIpIC0yOTRweCAtMjk1cHg7IH1cXG5cXG4uc2l4X2RpYW1vbmRzIHtcXG4gIHdpZHRoOiA3MXB4O1xcbiAgaGVpZ2h0OiA5N3B4O1xcbiAgYmFja2dyb3VuZDogdXJsKFxcXCJpbWFnZXMvd2luZG93cy1wbGF5aW5nLWNhcmRzLnBuZ1xcXCIpIC0zNjdweCAtMjk1cHg7IH1cXG5cXG4uc2V2ZW5fZGlhbW9uZHMge1xcbiAgd2lkdGg6IDcxcHg7XFxuICBoZWlnaHQ6IDk3cHg7XFxuICBiYWNrZ3JvdW5kOiB1cmwoXFxcImltYWdlcy93aW5kb3dzLXBsYXlpbmctY2FyZHMucG5nXFxcIikgLTQ0MHB4IC0yOTVweDsgfVxcblxcbi5laWdodF9kaWFtb25kcyB7XFxuICB3aWR0aDogNzFweDtcXG4gIGhlaWdodDogOTdweDtcXG4gIGJhY2tncm91bmQ6IHVybChcXFwiaW1hZ2VzL3dpbmRvd3MtcGxheWluZy1jYXJkcy5wbmdcXFwiKSAtNTEzcHggLTI5NXB4OyB9XFxuXFxuLm5pbmVfZGlhbW9uZHMge1xcbiAgd2lkdGg6IDcxcHg7XFxuICBoZWlnaHQ6IDk3cHg7XFxuICBiYWNrZ3JvdW5kOiB1cmwoXFxcImltYWdlcy93aW5kb3dzLXBsYXlpbmctY2FyZHMucG5nXFxcIikgLTU4NnB4IC0yOTVweDsgfVxcblxcbi50ZW5fZGlhbW9uZHMge1xcbiAgd2lkdGg6IDcxcHg7XFxuICBoZWlnaHQ6IDk3cHg7XFxuICBiYWNrZ3JvdW5kOiB1cmwoXFxcImltYWdlcy93aW5kb3dzLXBsYXlpbmctY2FyZHMucG5nXFxcIikgLTY1OXB4IC0yOTVweDsgfVxcblxcbi5qYWNrX2RpYW1vbmRzIHtcXG4gIHdpZHRoOiA3MXB4O1xcbiAgaGVpZ2h0OiA5N3B4O1xcbiAgYmFja2dyb3VuZDogdXJsKFxcXCJpbWFnZXMvd2luZG93cy1wbGF5aW5nLWNhcmRzLnBuZ1xcXCIpIC03MzJweCAtMjk1cHg7IH1cXG5cXG4ucXVlZW5fZGlhbW9uZHMge1xcbiAgd2lkdGg6IDcxcHg7XFxuICBoZWlnaHQ6IDk3cHg7XFxuICBiYWNrZ3JvdW5kOiB1cmwoXFxcImltYWdlcy93aW5kb3dzLXBsYXlpbmctY2FyZHMucG5nXFxcIikgLTgwNXB4IC0yOTVweDsgfVxcblxcbi5raW5nX2RpYW1vbmRzIHtcXG4gIHdpZHRoOiA3MXB4O1xcbiAgaGVpZ2h0OiA5N3B4O1xcbiAgYmFja2dyb3VuZDogdXJsKFxcXCJpbWFnZXMvd2luZG93cy1wbGF5aW5nLWNhcmRzLnBuZ1xcXCIpIC04NzhweCAtMjk1cHg7IH1cXG5cIiwgXCJcIl0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyP3tcInVybFwiOmZhbHNlfSEuL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzIS4vc2Nzcy9zdHlsZXMuc2Nzc1xuLy8gbW9kdWxlIGlkID0gMjBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTEtMSEuLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcyEuL3N0eWxlcy5zY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBQcmVwYXJlIGNzc1RyYW5zZm9ybWF0aW9uXG52YXIgdHJhbnNmb3JtO1xuXG52YXIgb3B0aW9ucyA9IHtcImhtclwiOnRydWV9XG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS0xLTEhLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanMhLi9zdHlsZXMuc2Nzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMS0xIS4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzIS4vc3R5bGVzLnNjc3NcIik7XG5cdFx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblx0XHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0XHR9KTtcblx0fVxuXHQvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc2Nzcy9zdHlsZXMuc2Nzc1xuLy8gbW9kdWxlIGlkID0gMjFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==