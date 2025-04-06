﻿/**
 * @name        Selector
 * @version     1.3.0
 * @author      rebelliume <rebelliume@gmail.com>
 * @contact     rebelliume
 * @copyright   rebelliume
 * @license     MIT
 * @released    2025/04/05
 * 
 * @returns {object}
 */


(function() {
    const attributes = {
        /**
         *  @return {object} Style
         */
        get STYLE() {
            return this.style;
        },
        /**
         *  @param {string} Value
         *  @return {string} Text
         */
        TEXT: function(value = null) {
            if (value === null) return this.innerText;
            this.innerText = value;
        },
        /**
         *  @param {string} Value
         *  @return {string} HTML
         */
        HTML: function(value = null) {
            if (value === null) return this.innerHTML;
            this.innerHTML = value;
        },
        /**
         *  @param {string} Value
         *  @return {string} Value
         */
        VAL: function(value = null) {
            if (value === null) return this.value;
            this.value = value;
        },
        /**
         *  @param {string} Property
         *  @param {string} Value
         *  @return {object} Attribute
         */
        ATTR: function (prop, value = null) {
            if (value === null) return this.getAttribute(prop);
            this.setAttribute(prop, value)
        },
        /**
         *  @param {string} Value
         *  @return {string} CSSText
         */
        CSS: function(value = null) {
            if (value === null) return this.style.cssText;
            this.style.cssText = value;
        },
        /**
         *  @return {string} DOM
         */
        ENABLE: function() {
            return this.disabled = false;
        },
        /**
         *  @return {string} DOM
         */
        DISABLE: function(value = null) {
            return this.disabled = true;
        },
        /**
         *  @param {string} Object
         *  @param {string} Name
         *  @param {object} Callback
         */
        ADDEVENT: function (value, callback, options = {}) {
            return this.addEventListener(value, callback, options);
        },
        /**
         *  @param {string} Object
         *  @param {string} Name
         *  @param {object} Callback
         */
        REMEVENT: function (value, callback, options = {}) {
            return this.removeEventListener(value, callback, options);
        }
    }
    const attributeMethods = Object.fromEntries(
        Object.entries(attributes).map(([key, fn]) => [key, fn])
    );
    const elementCache = new WeakMap();
    const $ = {
        $: function (element) {
            if (!element) { 
                return null;
            }

            const defMethod = element;

            if (!elementCache.has(element)) {
                Object.assign(element, attributeMethods);
                elementCache.set(element, true);
            }

            return defMethod;
        },
        /**
         *  @param {string} Value
         *  @return {object} DOM
         */
        ID: function (value) {
            return this.$(document.getElementById(value));
        },
        /**
         *  @param {string} Value
         *  @return {object} DOM
         */
        CLASS: function (value) {
            return this.$(document.getElementsByClassName(value));
        },
        /**
         *  @param {string} Value
         *  @return {object} DOM
         */
        TAG: function (value) {
            return this.$(document.getElementsByTagName(value));
        },
        /**
         *  @param {string} Value
         *  @return {object} DOM
         */
        NAME: function (value) {
            return this.$(document.getElementsByName(value));
        },
        /**
         *  @param {string} Value
         *  @return {object} DOM
         */
        QUERY: function (value) {
            return this.$(document.querySelector(value));
        },
        /**
         *  @param {string} Value
         *  @return {object} DOM
         */
        QUERYALL: function (value) {
            return this.$(document.querySelectorAll(value));
        },
        /**
         *  @param {object} Object
         *  @return {object} DOM
         */
        OBJ: function (value) {
            return this.$(value);
        },
        /**
         *  @param {string} Value
         *  @return {object} DOM
         */
        CREATE: function (value) {
            return document.createElement(value);
        },
        /**
         *  @param {string} Value
         *  @param {string} Name
         *  @return {object} DOM
         */
        CREATENS: function (value, name) {
            return document.createElementNS(value, name);
        },
        /**
         *  @param {string} Name
         *  @param {string} Value
         *  @param {number} Expire
         *  @return {string} Cookie
         */
        COOKIE: function (name, value = null, expire = 1) {
            if(name === null) {
                return undefined;
            }

            if (value === null) {
                const date = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
                return date ? date[1] : '';
            }
            else {
                let cookieStr = `${name}=${value};path=/`;
                if (expire) {
                    const date = new Date(Date.now() + expire * 86400000);
                    cookieStr += `;expires=${date.toUTCString()}`;
                }
                document.cookie = cookieStr;
            }
        },
        /**
         *  @param {string} Name
         *  @param {string} Value
         *  @return {string} Storage
         */
        STORAGE: function (name, value = null) {
            if(value === null) return localStorage.getItem(name);
            return localStorage.setItem(name, value)

        },
        /**
         *  @param {string} Name
         *  @param {string} Value
         *  @return {string} Storage
         */
        SESTORAGE: function (name, value = null) {
            if(value === null) return sessionStorage.getItem(name);
            return sessionStorage.setItem(name, value)
        },
        /**
         *  @param {number} Time
         */
        WAIT: async function (value) {
            await new Promise(resolve => setTimeout(resolve, value));
        },
        /**
         *  @param {object} Callback
         *  @param {number} Time
         */
        TIMEOUT: function (callback, value) {
            return setTimeout(callback, value);
        },
        /**
         *  @param {object} Callback
         *  @param {number} Time
         */
        INTERVAL: function (callback, value) {
            return setInterval(callback, value); 
        },
        /**
         *  @param {object} Callback
         *  @param {number} Time
         */
        CLEARINTERVAL: function (value) {
            clearInterval(value) 
        },
        /**
         *  @param {object} Value
         *  @param {boolean} Option
         *  @return {object} JSON
         */
        JSON: function (value, option) {
            if (!value) {
                return undefined;
            }

            if (option == true) return JSON.stringify(value);
            return JSON.parse(value);
        },
        /**
         *  @param {object} Object
         *  @param {string} Value
         *  @return {boolean} Type
         */
        TYPE: function (value, type = null) {
            if(type === null) {
                return typeof value;
            }

            const typeChecks = {
                object: () => typeof value === 'object',
                string: () => typeof value === 'string',
                number: () => typeof value === 'number',
                boolean: () => typeof value === 'boolean',
                function: () => typeof value === 'function',
                undefined: () => typeof value === 'undefined',
                bigint: () => typeof value === 'bigint',
                array: () => Array.isArray(value),
                null: () => value === null,
                empty: () => typeof value === 'undefined' || value === null || value === '',
                defined: () => typeof value !== 'undefined' && value !== null
            };
            
            return typeChecks[type] ? typeChecks[type]() : false;        
        },
        /**
         *  @param {object} Object
         *  @param {string} Value
         *  @return {object} Cast
         */
        CAST: function (value, type) {
            const converters = {
                string: val => String(val),
                number: val => Number(val),
                int: val => parseInt(val, 10),
                float: val => parseFloat(val),
                boolean: val => Boolean(val),
                bigint: val => BigInt(val),
                array: val => Array.isArray(val) ? val : [val]
            };

            if(!converters[type]) {
                return value;
            }
            
            return converters[type](value);
        },
        /**
         *  @param {object} Object
         *  @param {string} Value
         *  @param {number} Base
         *  @return {object} Convert
         */
        CONVERT: function (value, type, base) {
            switch (type)
            {
                case 'int':
                    return parseInt(value, base);
                break;
                case 'string':                
                    return value.toString(base);
                break;            
                default:
                    return value;
            }    
        },
        /**
         *  @param {string} Value
         *  @param {string} Rules
         *  @return {object} Validate
         */
        VALIDATE: function (value, rules = null) {
            if (!rules) {
                return undefined;
            }

            let match;
            const ruleCache = new Map();
            const rulePattern = /([^:]+)(?::([^|]*))?(?:\||$)/g;          

            function validateRule(value, ruleName, ruleValue) {
                const validators = {
                    required: val => (!val || val.trim() === '') && 'field is required.',
                    min: (val, rval) => {
                        const min = parseInt(rval, 10);
                        return isNaN(min) || val.length < min ? `field must be at least ${rval} characters.` : null;
                    },
                    max: (v, rval) => {
                        const max = parseInt(rval, 10);
                        return isNaN(max) || val.length > max ? `field cannot exceed ${rval} characters.` : null;
                    },
                    email: val => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) && 'field is not a valid email.',
                    alpha: val => !/^[A-Za-z]+$/.test(val) && 'field must contain only letters.',
                    numeric: val => !/^\d+$/.test(val) && 'field must be a number.',
                    persian: val => !/^[\u0600-\u06FF\s]+$/.test(val) && 'field must contain only Persian letters.',
                    englishNumber: val => !/^[0-9]+$/.test(val) && 'field must contain only English numbers.',
                    persianNumber: val => !/^[\u06F0-\u06F9]+$/.test(val) && 'field must contain only Persian numbers.',
                    maxValue: (val, rval) => {
                        const num = parseFloat(val);
                        const max = parseFloat(rval);
                        return isNaN(num) || isNaN(max) || num > max ? `field cannot be greater than ${rval}.` : null;
                    },
                    minValue: (val, rval) => {
                        const num = parseFloat(val);
                        const min = parseFloat(rval);
                        return isNaN(num) || isNaN(min) || num < min ? `field cannot be less than ${rval}.` : null;
                    },
                    date: val => !/^\d{4}-\d{2}-\d{2}$/.test(val) && 'field must be a valid date (YYYY-MM-DD).',
                    url: val => !/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(val) && 'field must be a valid URL.',
                    phone: val => !/^\+?[0-9]{10,15}$/.test(val) && 'field must be a valid phone number.'
                };

                if (!validators[ruleName]) {
                    return null;
                }

                return validators[ruleName](value, ruleValue);
            }

            while ((match = rulePattern.exec(rules)) !== null) {
                const [_, ruleName, ruleValue] = match;
                if (ruleCache.has(ruleName)) continue;
                                
                const result = validateRule(value, ruleName, ruleValue);
                if (result) {
                    return result;
                }
                ruleCache.set(ruleName, true);
            }

            return undefined;
        },
        /**
         *  @param {object} Options
         *  @return {object} AJAX
         */
        AJAX: function(options) {
            const xhr = new XMLHttpRequest();
            
            if (options.username && options.password) { 
                xhr.open(options.method, options.url, options.async, options.username, options.password);
            }
            else { 
                xhr.open(options.method, options.url, true);
            }
            if (options.headers) {
                for (let header in options.headers) {
                    xhr.setRequestHeader(header, options.headers[header]);
                }
            }
            if (options.token) {
                options.headers.Authorization = 'Bearer ' + options.token;
            }
            if (options.timeout) {
                xhr.timeout = options.timeout;
                xhr.ontimeout = function () {
                    options.error('error 408');
                }
            }
            xhr.responseType = options.responseType || 'text';
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        let response = xhr.response;
                        if (options.responseType === 'json') {
                            response = JSON.parse(response);
                        }
                        options.success(response, xhr.status);
                    }
                    else {
                        options.error(xhr.statusText, xhr.status);
                    }
                }
            };
            if (options.cache) {
                const cachedResponse = localStorage.getItem(options.url);
                if (cachedResponse) {
                    options.success(JSON.parse(cachedResponse), 200);
                    return;
                }
            }        
            if (options.cache) {
                xhr.addEventListener('load', function () {
                    localStorage.setItem(options.url, xhr.responseText);
                });
            }
            if (options.progress) {
                xhr.addEventListener('progress', function (event) {
                    options.progress(event.loaded, event.total);
                });
            }
            if (options.abort) {
                xhr.addEventListener('abort', function () {
                    options.abort();
                });
            }
            if (options.cancel) {
                const cancelToken = options.cancelToken;
                if (cancelToken) {
                    cancelToken.promise.then(function () {
                        xhr.abort();
                    });
                }
            }
            if (options.uploadProgress) {
                const upload = xhr.upload;
                if (upload) {
                    upload.addEventListener('progress', function (event) {
                        options.uploadProgress(event.loaded, event.total);
                    });
                }
            }
            if (options.withCredentials) {
                xhr.withCredentials = true;
            }
            if (options.beforeSend) {
                options.beforeSend(xhr);
            }
            if (options.mimeType) {
                xhr.overrideMimeType(options.mimeType);
            }
            if (options.transformRequest) {
                options.data = options.transformRequest(options.data);
            }
            if (options.transformResponse) {
                xhr.addEventListener('load', function () {
                    xhr.response = options.transformResponse(xhr.response);
                });
            }
            if (options.retry) {
                let retries = 0;
                const retryLimit = options.retryLimit || 3;
                const retryInterval = options.retryInterval || 1000;
        
                xhr.addEventListener('error', function () {
                    if (retries < retryLimit) {
                        setTimeout(function () {
                            retries++;
                            if (options.username && options.password) { 
                                xhr.open(options.method, options.url, options.async, options.username, options.password);
                            }
                            else { 
                                xhr.open(options.method, options.url, true);
                            }
                            xhr.send(options.data);
                        }, retryInterval);
                    }
                    else {
                        options.error(xhr.statusText, xhr.status);
                    }
                });
            }
            if (options.redirect) {
                xhr.addEventListener('load', function () {
                    if (xhr.status >= 300 && xhr.status < 400) {
                        const redirectUrl = xhr.getResponseHeader('Location');
                        if (redirectUrl) {
                            options.url = redirectUrl;
                            if (options.username && options.password) { 
                                xhr.open(options.method, options.url, options.async, options.username, options.password);
                            }
                            else { 
                                xhr.open(options.method, options.url, true);
                            }
                            xhr.send(options.data);
                        }
                        else {
                            options.error('404');
                        }
                    }
                    else {
                        options.success(xhr.response, xhr.status);
                    }
                });
            }
            xhr.send(options.data);
        },
        /**
         *  @param {object} Options
         *  @return {object} Fetch
         */
        FETCH: function(options) {
            let init = {
                method: options.method,
                headers: options.headers || {},
                body: options.data || null,
                responseType: options.responseType || 'text',
                cache: options.cache ? 'default' : 'no-store',
                redirect: options.redirect ? 'follow' : 'manual'
            };
            
            if (options.username && options.password) {
                init.headers.Authorization = 'Basic ' + btoa(options.username + ':' + options.password);
            }
            if (options.token) {
                init.headers.Authorization = 'Bearer ' + options.token;
            }
            if (options.timeout) {
                setTimeout(function () {
                    options.error('error 408');
                }, options.timeout);
            }
            if (options.cache) {
                const cachedResponse = localStorage.getItem(options.url);
                if (cachedResponse) {
                    options.success(JSON.parse(cachedResponse), 200);
                }
            }
            if (options.progress) {
                init.onprogress = function (event) {
                    options.progress(event.loaded, event.total);
                }
            }
            if (options.abort) {
                const abortController = new AbortController();
                const signal = abortController.signal;
        
                signal.addEventListener('abort', function () {
                    options.abort();
                });
            }
            if (options.cancel) {
                const abortController = new AbortController();
                const signal = abortController.signal;
                const cancelToken = options.cancelToken;
                if (cancelToken) {
                    cancelToken.promise.then(function () {
                        abortController.abort();
                    });
                }
            }
            if (options.uploadProgress) {
                init.onUploadProgress = function (event) {
                    options.uploadProgress(event.loaded, event.total);
                }
            }
            if (options.withCredentials) {
                init.credentials = 'include';
            }
            if (options.beforeSend) {
                options.beforeSend(init);
            }
            if (options.mimeType) {
                init.headers['Content-Type'] = options.mimeType;
            }
            if (options.transformRequest) {
                init.body = options.transformRequest(init.body);
            }
            if (options.transformResponse) {
                init.onLoad = function () {
                    init.body = options.transformResponse(init.body);
                }
            }
            if (options.retry) {
                let retries = 0;
                const retryLimit = options.retryLimit || 3;
                const retryInterval = options.retryInterval || 1000;
        
                function doFetch() {
                    fetch(options.url, init)
                        .then(function (response) {
                            if (response.status < 200 || response.status >= 300) {
                                throw new Error(response.statusText);
                            }
                            return response;
                        })
                        .then(function (response) {
                            if (options.responseType === 'json') {
                                return response.json();
                            }
                            return response.text();
                        })
                        .then(function (data) {
                            options.success(data, 200);
                        })
                        .catch(function (err) {
                            if (retries < retryLimit) {
                                retries++;
                                setTimeout(doFetch, retryInterval);
                            }
                            else {
                                options.error(err.message || 'Unknown error', 0);
                            }
                        });
                }
                doFetch();
            }
            else {
                fetch(options.url, init)
                    .then(function (response) {
                        if (response.status < 200 || response.status >= 300) {
                            throw new Error(response.statusText);
                        }
                        return response;
                    })
                    .then(function (response) {
                        if (options.responseType === 'json') {
                            return response.json();
                        }
                        return response.text();
                    })
                    .then(function (data) {
                        options.success(data, 200);
                    })
                    .catch(function (err) {
                        options.error(err.message || 'Unknown error', 0);
                    });
            }
            if (options.redirect) {
                init.onLoad = function () {
                    if (response.status >= 300 && response.status < 400) {
                        const redirectUrl = response.headers.get('Location');
                        if (redirectUrl) {
                            options.url = redirectUrl;
                            fetch(options.url, init)
                                .then(function (response) {
                                    if (response.status < 200 || response.status >= 300) {
                                        throw new Error(response.statusText);
                                    }
                                    return response;
                                })
                                .then(function (response) {
                                    if (options.responseType === 'json') {
                                        return response.json();
                                    }
                                    return response.text();
                                })
                                .then(function (data) {
                                    options.success(data, 200);
                                })
                                .catch(function (err) {
                                    options.error('404');
                                });
                        }
                        else {
                            options.error('404');
                        }
                    }
                    else {
                        options.success(response.body, response.status);
                    }
                };
            }
        },
        /**
         *  @param {object} Options
         *  @return {object} Socket
         */
        SOCKET: function(options) {
            const ws = new WebSocket(options.url);
    
            ws.onopen = function () { 
                if (options.onopen) {
                    options.onopen();
                }
            };
            ws.onerror = function (event) {
                if (options.onerror) {
                    options.onerror(event);
                }
            };
            ws.onclose = function (event) {
                if (options.onclose) {
                    options.onclose(event);
                }
            };
            ws.onmessage = function (event) {
                if (options.onmessage) {
                    options.onmessage(event.data);
                }
            };
            
            return {
                send: data => ws.send(data),
                close: () => ws.close()
            };
        },
        /**
         *  @param {string} Value
         */
        TIME: function (value) {
            console.time(value);
        },
        /**
         *  @param {string} Value
         */
        TIMEEND: function (value) {
            console.timeEnd(value);
        },
        /**
         *  @param {string} Value
         *  @param {string} Options
         */
        LOG: function (value, options = null) {
            if (options === null) console.log(value);
            console.log(value, options);
        },
        /**
         *  @param {string} Value
         */
        ERROR: function (value) {
            console.error(value);
        },
        /**
         *  @param {string} Value
         */
        WARN: function (value) {
            console.warn(value);
        },
        CLEAR: function () {
            console.clear();
        }
    };
    for (const key in $) {
        if (typeof $[key] === 'function' && key != '$') {
            window['$' + key] = $[key].bind($);
        }
    }
})();