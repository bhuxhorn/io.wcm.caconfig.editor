/*
 * #%L
 * wcm.io
 * %%
 * Copyright (C) 2016 wcm.io
 * %%
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * #L%
 */
(function (angular) {
  var uid = ["0", "0", "0" ];

  "use strict";
  /**
   * Utilities module.
   * TODO: write unit tests
   */
  angular.module("io.wcm.caconfig.utilities", [])
    .factory("utilities", utilitiesFactory);

  function utilitiesFactory() {

    var utilities = {
      nextUid: nextUid,
      loadAutocompleteOptions: loadAutocompleteOptions,
      contains: contains,
      indexOfMatchingObject: indexOfMatchingObject,
      indexOfValueObject: indexOfValueObject
    };
    return utilities;

    /**
     *
     * @returns unique Id
     */
    function nextUid() {
      var index = uid.length;
      var digit;

      while (index) {
        index--;
        digit = uid[index].charCodeAt(0);
        if (digit == 57 /*"9"*/) {
          uid[index] = "A";
          return uid.join("");
        }
        if (digit == 90  /*"Z"*/) {
          uid[index] = "0";
        } else {
          uid[index] = String.fromCharCode(digit + 1);
          return uid.join("");
        }
      }
      uid.unshift("0");
      return uid.join("");
    }

    /**
     * Helper method for the CUI:PathBrowser widget
     * @param path
     * @param callback
     * @returns {boolean}
     */
    function loadAutocompleteOptions(path, callback) {
      jQuery.get(path + ".pages.json", {
          predicate: "hierarchyNotFile"
        },
        function(data) {
          var pages = data.pages;
          var result = [];
          for(var i = 0; i < pages.length; i++) {
            result.push(pages[i].label);
          }
          if (callback) callback(result);
        }, "json");
      return false;
    }

    /**
     *
     * @param array containing objects
     * @param object
     * @returns index of an object in array with the same value for "key" property as "object",
     * -1 if no such object was found
     */
    function indexOfMatchingObject(array, object, key) {
      var index = -1;
      if (array) {
        for(var i = 0; i < array.length; i++) {
          if (array[i][key] === object[key]) {
            index = i;
            break;
          }
        }
      }
      return index;
    }

    /**
     *
     * @param array containing objects with "value" property
     * @param object containing "value" property
     * @returns index of an object in array with the same value property as "object", -1 if no such object was found
     */
    function indexOfValueObject(array, object) {
      return indexOfMatchingObject(array, object, "value");
    }

    /**
     *
     * @param array
     * @param object
     * @returns index of an object in array, -1 if the object does not exist in array
     */
    function contains(array, object) {
      var contains = false;
      if (array) {
        for(var i = 0; i < array.length; i++) {
          if (array[i] === object) {
            contains = true;
            break;
          }
        }
      }
      return contains;
    }
  }
})(angular);


