;(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], function () {
      return factory(root)
    })
  } else if (typeof exports === "object") {
    module.exports = factory(root)
  } else {
    window.ajio = factory(root)
  }
})(
  typeof global !== "undefined"
    ? global
    : typeof window !== "undefined"
    ? window
    : this,
  function (window) {
    "use strict"

    //
    // Variables
    //

    var settings
    var userDefaults = {}
    var baseUrl = "" //define baseUrl

    // Default settings
    var defaults = {
      method: "GET",
      username: null,
      password: null,
      data: {},
      //its Content-Type
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      responseType: "text",
      timeout: null,
      withCredentials: false,
    }
    var post_settings = {
      method: "POST",
      username: null,
      password: null,
      data: {},
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      responseType: "text",
      timeout: null,
      withCredentials: false,
    }

    var delete_settings = {
      method: "DELETE",
      username: null,
      password: null,
      data: {},
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      responseType: "text",
      timeout: null,
      withCredentials: false,
    }

    var put_settings = {
      method: "PUT",
      username: null,
      password: null,
      data: {},
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      responseType: "text",
      timeout: null,
      withCredentials: false,
    }
    // new patch feature
    var patch_settings = {
      method: "PATCH",
      username: null,
      password: null,
      data: {},
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      responseType: "text",
      timeout: null,
      withCredentials: false,
    }

    //
    // Methods
    //

    /**
     * Merge two or more objects together.
     * @param   {Object}   objects  The objects to merge together
     * @returns {Object}            Merged values of defaults and options
     */
    var extend = function () {
      // Variables
      var extended = {}

      // Merge the object into the extended object
      var merge = function (obj) {
        for (var prop in obj) {
          if (obj.hasOwnProperty(prop)) {
            if (
              Object.prototype.toString.call(obj[prop]) === "[object Object]"
            ) {
              extended[prop] = extend(extended[prop], obj[prop])
            } else {
              extended[prop] = obj[prop]
            }
          }
        }
      }

      // Loop through each object and conduct a merge
      for (var i = 0; i < arguments.length; i++) {
        var obj = arguments[i]
        merge(obj)
      }

      return extended
    }

    /**
     * Parse text response into JSON
     * @private
     * @param  {String} req The response
     * @return {Array}      A JSON Object of the responseText, plus the orginal response
     */
    var parse = function (req) {
      var result
      if (settings.responseType !== "text" && settings.responseType !== "") {
        return req.response
      }
      try {
        result = JSON.parse(req.responseText)
      } catch (e) {
        result = req.responseText
      }
      return result
    }

    /**
     * Convert an object into a query string
     * @link   https://blog.garstasio.com/you-dont-need-jquery/ajax/
     * @param  {Object|Array|String} obj The object
     * @return {String}                  The query string
     */
    var param = function (obj) {
      // If already a string, or if a FormData object, return it as-is
      if (
        typeof obj === "string" ||
        Object.prototype.toString.call(obj) === "[object FormData]"
      )
        return obj

      // If the content-type is set to JSON, stringify the JSON object
      if (
        /application\/json/i.test(settings.headers["Content-Type"]) ||
        Object.prototype.toString.call(obj) === "[object Array]"
      )
        return JSON.stringify(obj)

      // Otherwise, convert object to a serialized string
      var encoded = []
      for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          encoded.push(
            encodeURIComponent(prop) + "=" + encodeURIComponent(obj[prop])
          )
        }
      }
      return encoded.join("&")
    }

    /**
     * Make an XHR request, returned as a Promise
     * @param  {String} url The request URL
     * @return {Promise}    The XHR request Promise
     */
    var makeRequest = function (url) {
      // concat the baseUrl to the url
      // if the baseUrl is not provided it will remain an empty string ''
      // so  `${baseUrl}${url}` will not be used...
      var _mainUrl = baseUrl + url
      // Create the XHR request
      var request = new XMLHttpRequest()

      // Setup the Promise
      var xhrPromise = new Promise(function (resolve, reject) {
        // Setup our listener to process compeleted requests
        request.onreadystatechange = function () {
          // Only run if the request is complete
          if (request.readyState !== 4) return

          // Prevent timeout errors from being processed
          if (!request.status) return

          // Process the response
          if (request.status >= 200 && request.status < 300) {
            // If successful
            resolve(parse(request))
          } else {
            // If failed
            reject({
              status: request.status,
              statusText: request.statusText,
              responseText: request.responseText,
            })
          }
        }

        // Setup our HTTP request
        request.open(
          settings.method,
          _mainUrl,
          true,
          settings.username,
          settings.password
        )
        request.responseType = settings.responseType

        // Add headers
        for (var header in settings.headers) {
          if (settings.headers.hasOwnProperty(header)) {
            request.setRequestHeader(header, settings.headers[header])
          }
        }

        // Set timeout
        if (settings.timeout) {
          request.timeout = settings.timeout
          request.ontimeout = function (e) {
            reject({
              status: 408,
              statusText: "Request timeout",
            })
          }
        }

        // Add withCredentials
        if (settings.withCredentials) {
          console.log(settings.username)
          request.withCredentials = true
        }

        // Send the request
        request.send(param(settings.data))
      })

      // Cancel the XHR request
      xhrPromise.cancel = function () {
        request.abort()
      }

      // Return the request as a Promise
      return xhrPromise
    }

    /* ...userDefaults,  this will override the current params like timeout
     * if options is provided it will not use the userDefaults
     * if provided it will override stuff that are not specified like timout
     */
    var get = function (url, options) {
      settings = extend(
        defaults,
        { ...options, ...userDefaults } || { ...userDefaults }
      )
      return makeRequest(url)
    }
    var post = function (url, options) {
      settings = extend(
        post_settings,
        { ...options, ...userDefaults } || { ...userDefaults }
      )

      return makeRequest(url)
    }

    var put = function (url, options) {
      settings = extend(
        put_settings,
        { ...options, ...userDefaults } || { ...userDefaults }
      )
      return makeRequest(url)
    }
    var _delete = function (url, options) {
      settings = extend(
        delete_settings,
        { ...options, ...userDefaults } || { ...userDefaults }
      )
      return makeRequest(url)
    }

    var patch = function (url, options) {
      settings = extend(
        patch_settings,
        { ...options, ...userDefaults } || { ...userDefaults }
      )
      return makeRequest(url)
    }

    //utility helpers
    const removeSlashFromUrl = (url) => {
      /**
         * this regexp is forr potetial dummy users,
         *  that will like to crash our little application
         * if https://google.com/ or https://google.com// then remove / or //
    
        */
      const newUrl = url.split(/(\/|\/\/)$/)
      return newUrl[0]
    }

    // baseUrl feature
    var _baseUrl = (url) => {
      baseUrl = removeSlashFromUrl(url)
    }

    var Defaults = function (timeout = 1000, username = null, password = null) {
      // a defualt timeout of 1000
      this.timeout = timeout
      this.username = username
      this.password = password

      userDefaults = this
      if (typeof this.username === "string") {
        // if there is a username go withCredentials
        userDefaults.withCredentials = this.username !== "" ? true : false
      }
      return userDefaults
    }

    //
    // Public Methods
    //

    var init = {
      get,
      post,
      put,
      delete: _delete,
      patch,
      baseUrl: _baseUrl,
      version: "v0.1.2-beta",
    }

    return init
  }
)
