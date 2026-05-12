/**
 * @name        Selector
 * @version     2.0.0
 * @description DOM selector utility
 * @author      rebelliume <rebelliume@gmail.com>
 * @contact     rebelliume
 * @copyright   rebelliume
 * @license     MIT
 * @since       2024
 * @released    2026/04/12
 */


(function() {
    const attributes = {
        /**
         *  @param {string} Value
         *  @return {string} Text
         */
        TEXT: function(value = null) {
            if (value === null) return this.element.innerText;
            this.element.innerText = value;

            return this;
        },
        /**
         *  @param {string} Value
         *  @return {string} HTML
         */
        HTML: function(value = null) {
            if (value === null) return this.element.innerHTML;
            this.element.innerHTML = value;

            return this;
        },
        /**
         *  @param {string} Value
         *  @return {string} Value
         */
        VAL: function(value = null) {
            if (value === null) return this.element.value;
            this.element.value = value;

            return this;
        },
        /**
         *  @param {string} Property
         *  @param {string} Value
         *  @return {object} Attribute
         */
        ATTR: function (prop, value = null) {
            if (value === null) return this.element.getAttribute(prop);
            this.element.setAttribute(prop, value);

            return this;
        },
        /**
         *  @param {string} Value
         *  @return {string} CSS
         */
        CSS: function(value = null) {
            if (value === null) return this.element.style.cssText;
            this.element.style.cssText = value;

            return this;
        },
        /**
         *
         */
        ENABLE: function() {
            this.element.disabled = false;

            return this;
        },
        /**
         *
         */
        DISABLE: function() {
            this.element.disabled = true;

            return this;
        },
        /**
         *  @param {string} Value
         */
        ADDCLASS: function(value = null) {
            this.element.classList.add(value);

            return this;
        },
        /**
         *  @param {string} Value
         */
        REMCLASS: function(value = null) {
            this.element.classList.remove(value);

            return this;
        },
        /**
         *  @param {string} Value
         */
        APPEND: function(value = null) {
            if (value instanceof ElementWrapper) {
                this.element.appendChild(value.element);
            } else {
                this.element.appendChild(value);
            }
            return this;
        },
        /**
         *  @param {string} Value
         */
        PREPEND: function(value = null) {
            if (value instanceof ElementWrapper) {
                this.element.insertBefore(value.element, this.element.firstChild);
            } else {
                this.element.insertBefore(value, this.element.firstChild);
            }

            return this;
        },
        /**
         *
         */
        REMOVE: function() {
            this.element.parentNode?.removeChild(this.element);

            return this;
        },
        /**
         *
         */
        EMPTY: function() {
            this.element.innerHTML = '';

            return this;
        },
        /**
         *  @param {string} Value
         */
        TOGGCLASS: function(value = null) {
            this.element.classList.toggle(value);

            return this;
        },
        /**
         *  @param {string} Value
         *  @return {boolean} Value
         */
        HASCLASS: function(value = null) {
            return this.element.classList.contains(value);
        },
        /**
         *  @return {object} DOM
         */
        PARENT: function() {
            return this.element.parentElement;
        },
        /**
         *  @return {array} DOMs
         */
        CHILD: function() {
            return this.element.children;
        },
        /**
         *  @return {object} DOM
         */
        NEXT: function() {
            return this.element.nextElementSibling;
        },
        /**
         *  @return {object} DOM
         */
        PREV: function() {
           return this.element.previousElementSibling;
        },
        /**
         *  
         */
        SHOW: function() {
            this.element.style.display = '';

            return this;
        },
        /**
         *  
         */
        HIDE: function() {
            this.element.style.display = 'none';

            return this;
        },
        /**
         *  
         */
        TOGGLE: function() {
            this.element.style.display = this.element.style.display === 'none' ? '' : 'none';

            return this;
        },
        /**
         *  @param {object} Keyframes
         *  @param {number} Duration
         *  @param {string} Easing
         */
        ANIMATE: function(keyframes, duration = 300, easing = 'ease') {
            return new Promise(resolve => {
                const animation = this.element.animate(keyframes, {
                    duration: duration,
                    easing: easing,
                    fill: 'forwards'
                });
                animation.onfinish = () => resolve(this);
            });
        },
        /**
         *  @param {number} Duration
         */
        FADEIN: function(duration = 300) {
            this.element.style.display = '';
            return this.ANIMATE(
                [{ opacity: 0 }, { opacity: 1 }],
                duration
            );
        },
        /**
         *  @param {number} Duration
         */
        FADEOUT: function(duration = 300) {
            return this.ANIMATE(
                [{ opacity: 1 }, { opacity: 0 }],
                duration
            ).then(() => {
                this.element.style.display = 'none';
                return this;
            });
        },
        /**
         *  @param {string} Direction
         *  @param {number} Duration
         */
        SLIDE: function(direction = 'down', duration = 300) {
            const keyframes = direction === 'down'
                ? [{ transform: 'translateY(-20px)', opacity: 0 },
                { transform: 'translateY(0)',     opacity: 1 }]
                : [{ transform: 'translateY(0)',     opacity: 1 },
                { transform: 'translateY(-20px)', opacity: 0 }];
            return this.ANIMATE(keyframes, duration);
        },
        /**
         *  @param {string} Type
         *  @param {object} Callback
         *  @param {array} Options
         */
        ADDEVENT: function (type, callback, options = {}) {
            return this.element.addEventListener(type, callback, options);
        },
        /**
         *  @param {string} Type
         *  @param {object} Callback
         *  @param {array} Options
         */
        REMEVENT: function (type, callback, options = {}) {
            return this.element.removeEventListener(type, callback, options);
        }
    }

    const attributeMethods = Object.fromEntries(
        Object.entries(attributes).map(([key, fn]) => [key, fn])
    );
    const elementCache = new WeakMap();

    function ElementWrapper(value) { this.element = value; }
    Object.assign(ElementWrapper.prototype, attributeMethods);
    Object.defineProperty(ElementWrapper.prototype, 'STYLE', { get() { return this.element.style; } });

    const types = {
        object:     (value) => typeof value === 'object',
        string:     (value) => typeof value === 'string',
        number:     (value) => typeof value === 'number',
        boolean:    (value) => typeof value === 'boolean',
        function:   (value) => typeof value === 'function',
        undefined:  (value) => typeof value === 'undefined',
        bigint:     (value) => typeof value === 'bigint',
        array:      (value) => Array.isArray(value),
        null:       (value) => value === null,
        empty:      (value) => typeof value === 'undefined' || value === null || value === '',
        defined:    (value) => typeof value !== 'undefined' && value !== null
    };
    
    const casts = {
        string:     value => String(value),
        number:     value => Number(value),
        int:        value => parseInt(value, 10),
        float:      value => parseFloat(value),
        boolean:    value => Boolean(value),
        bigint:     value => BigInt(value),
        array:      value => Array.isArray(value) ? value : [value]
    };

    const validators = {
        required:       value => (value === null || value === undefined || String(value).trim() === '') && 'field is required.',
        min:            (value, rvalue) => {
            const min = parseInt(rvalue, 10);
            return isNaN(min) || value.length < min ? `field must be at least ${rvalue} characters.` : null;
        },
        max:            (value, rvalue) => {
            const max = parseInt(rvalue, 10);
            return isNaN(max) || value.length > max ? `field cannot exceed ${rvalue} characters.` : null;
        },
        email:          value => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && 'field is not a valid email.',
        alpha:          value => !/^[A-Za-z]+$/.test(value) && 'field must contain only letters.',
        numeric:        value => !/^\d+$/.test(value) && 'field must be a number.',
        persian:        value => !/^[\u0600-\u06FF\s]+$/.test(value) && 'field must contain only Persian letters.',
        englishNumber:  value => !/^[0-9]+$/.test(value) && 'field must contain only English numbers.',
        persianNumber:  value => !/^[\u06F0-\u06F9]+$/.test(value) && 'field must contain only Persian numbers.',
        maxValue:       (value, rvalue) => {
            const num = parseFloat(value);
            const max = parseFloat(rvalue);
            return isNaN(num) || isNaN(max) || num > max ? `field cannot be greater than ${rvalue}.` : null;
        },
        minValue:       (value, rvalue) => {
            const num = parseFloat(value);
            const min = parseFloat(rvalue);
            return isNaN(num) || isNaN(min) || num < min ? `field cannot be less than ${rvalue}.` : null;
        },
        date:           value => !/^\d{4}-\d{2}-\d{2}$/.test(value) && 'field must be a valid date (YYYY-MM-DD).',
        url:            value => !/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(value) && 'field must be a valid URL.',
        phone:          value => !/^\+?[0-9]{10,15}$/.test(value) && 'field must be a valid phone number.'
    };
    
    const createState = function(initialValue) {
        let _value = initialValue;
        const _subscribers = [];

        return {
            get value() {
                return _value;
            },

            set value(newVal) {
                if (_value === newVal) return;
                const oldVal = _value;
                _value = newVal;
                _subscribers.forEach(fn => fn(newVal, oldVal));
            },

            UPDATE(fn) {
                this.value = fn(_value);
                return this;
            },

            LISTEN(fn) {
                _subscribers.push(fn);
                return function unsubscribe() {
                    const idx = _subscribers.indexOf(fn);
                    if (idx > -1) _subscribers.splice(idx, 1);
                };
            },

            BIND(element, prop = 'innerText') {
                this.subscribe(val => {
                    const el = element.element || element;
                    el[prop] = val;
                });
                const el = element.element || element;
                el[prop] = _value;
                return this;
            },

            RESET() {
                this.value = initialValue;
                return this;
            }
        };
    };

    const protoKeys = Object.getOwnPropertyNames(ElementWrapper.prototype).filter( key => key !== 'constructor' );
    const protoDescriptors = Object.fromEntries( protoKeys.map(key => [key, Object.getOwnPropertyDescriptor(ElementWrapper.prototype, key)]) );
    const cachedDefinitions = protoKeys.map(key => {
        const desc = protoDescriptors[key];
        return { key, desc, isAccessor: !!(desc.get || desc.set) };
    });

    const $ = {
        $: function (element) {
            if (!element) { 
                return null;
            }

            if (!elementCache.has(element)) {
                const wrapper = new ElementWrapper(element);
                
                cachedDefinitions.forEach(({ key, desc, isAccessor }) => {
                    if (isAccessor) {
                        Object.defineProperty(element, key, {
                            get: desc.get ? desc.get.bind(wrapper) : undefined,
                            set: desc.set ? desc.set.bind(wrapper) : undefined,
                            configurable: true,
                            enumerable: false
                        });
                    } else {
                        Object.defineProperty(element, key, {
                            value: desc.value.bind(wrapper),
                            configurable: true,
                            enumerable: false,
                            writable: true
                        });
                    }
                });
                
                elementCache.set(element, wrapper);
            }
            return element;
        },
        /**
         *  @param {object} Variable
         */
        STATE: createState,
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
                const safeName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                const match = document.cookie.match(
                    new RegExp(`(?:^|; )${safeName}=([^;]*)`)
                );

                return match ? decodeURIComponent(match[1]) : '';
            }

            const encodedValue = encodeURIComponent(value);
            let cookieStr = `${name}=${encodedValue}; path=/`;

            if (expire) {
                const date = new Date(Date.now() + (expire * 86400000));
                cookieStr += `; expires=${date.toUTCString()}`;
            }

            document.cookie = cookieStr;
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
        CLEARTIMEOUT: function (value) {
            clearTimeout(value);
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
            clearInterval(value);
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

            return types[type] ? types[type](value) : false;        
        },
        /**
         *  @param {object} Object
         *  @param {string} Value
         *  @return {object} Cast
         */
        CAST: function (value, type) {
            if(!casts[type]) {
                return value;
            }
            
            return casts[type](value);
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
            if (options.token) {
                options.headers = options.headers || {};
                options.headers.Authorization = 'Bearer ' + options.token;
            }
            if (options.headers) {
                for (let header in options.headers) {
                    xhr.setRequestHeader(header, options.headers[header]);
                }
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
            if (options.delay) {
                setTimeout(() => {
                    xhr.send(options.data);
                }, options.delay);
            }
            else {
                xhr.send(options.data);
            }
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
                const abortController = new AbortController();

                setTimeout(() => {abortController.abort(); options.error('error 408');}, options.timeout);
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
                    abortController.abort();
                });
            }
            if (options.cancel) {
                const abortController = new AbortController();
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
                            if (options.transformResponse) {
                                options.transformResponse(response);
                            }
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
                        if (options.transformResponse) {
                            options.transformResponse(response);
                        }
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
                                    if (options.transformResponse) {
                                        options.transformResponse(response);
                                    }
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
         *  @param {object} Function
         *  @param {number} Delay
         *  @return {object} Function
         */
        DEBOUNCE(func, delay = 300) {
            let timer;
            return (...args) => {
                clearTimeout(timer);
                timer = setTimeout(() => func(...args), delay);
            };
        },
        /**
         *  @param {object} Function
         *  @param {number} Limit
         *  @return {object} Function
         */
        THROTTLE(func, limit = 300) {
            let lastCall = 0;
            return (...args) => {
                const now = Date.now();
                if (now - lastCall >= limit) {
                    lastCall = now;
                    return func(...args);
                }
            };
        },
        /**
         *  @param {string} Value
         */
        TRACE: function (value) {
            console.trace(value);
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
            if (options !== null) {
                console.log(value, options);
            } else {
                console.log(value);
            }
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