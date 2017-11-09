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

  /**
   * Renders the wrapping elements for the Coral ui popover.
   * The content itself is transcluded. The content can also contain markup.
   *
   * @example
   * <caconfig-popup-content content="Description Text"></caconfig-popup-content>
   */
  angular.module("io.wcm.caconfig.widgets")
    .directive("caconfigPopupContent", popupContent);

  popupContent.$inject = ["templateUrlList"];

  function popupContent(templateList) {

    var directive = {
      scope: {
        content: "="
      },
      restrict: "E",
      templateUrl: templateList.popupContent
    };

    return directive;
  }
}(angular));
