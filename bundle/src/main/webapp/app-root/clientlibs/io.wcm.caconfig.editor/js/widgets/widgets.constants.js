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
  "use strict";

  var ANYTHING = /^.*$/;
  var INTEGER = /^[-+]?[0-9]+([eE][-+]?[0-9]+)?$/;
  var FLOAT = /^[-+]?[0-9]*[\.,]?[0-9]+([eE][-+]?[0-9]+)?$/;
  /**
   * Provides the list of available templates, used in directives
   */
  angular.module("io.wcm.caconfig.widgets")
    .constant("templateUrlList", {
      filterDropDownList: "filterDropDownList.html",
      map: "map.html",
      parameterValue: "parameterValue.html",
      pathBrowser: "pathBrowser.html",
      popupContainer: "popupContainer.html",
      popupContent: "popupContent.html",
      multifield: "multifield.html"
    })
    .constant("inputMap", {
      Boolean: {type: "checkbox"},
      Integer: {type: "number", pattern: INTEGER},
      Long: {type: "number", pattern: INTEGER},
      Double: {type: "number", pattern: FLOAT},
      String: {type: "text", pattern: ANYTHING}
    });
})(angular);

