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
   * Controller for details view
   * (for singletons, collections and nested configs/collection)
   */
  angular.module("io.wcm.caconfig.editor")
    .controller("DetailController", DetailController);

  DetailController.$inject = ["$rootScope", "$scope", "$route", "$compile", "configService", "modalService"];

  /* eslint-disable max-params */
  function DetailController($rootScope, $scope, $route, $compile, configService, modalService) {
  /* eslint-enable max-params */
    var that = this;

    that.current = {
      configName: $route.current.params.configName,
      configs: []
    };

    // If detail view was loaded directly via deeplink, we need to first loadConfigNames
    if (!configService.getState().contextPath || !configService.getState().configNames.length) {
      configService.loadConfigNames()
        .then(init);
    }
    else {
      init();
    }

    $rootScope.saveWarning = function (redirectUrl) {
      $rootScope.redirectUrl = null;
      if (angular.isString(redirectUrl)) {
        $rootScope.redirectUrl = redirectUrl;
      }
      modalService.show(modalService.modal.SAVE_CONFIG);
    };

    that.saveConfig = function () {
      configService.saveCurrentConfig()
        .then(function (redirect) {
          if (redirect) {
            $rootScope.go(redirect.configName || "");
          }
          else {
            $rootScope.go(that.current.parent ? that.current.parent.configName : "");
          }
        });
    };

    that.removeConfig = function() {
      modalService.show(modalService.modal.DELETE_CONFIG);
    };

    $rootScope.deleteConfig = function () {
      configService.deleteCurrentConfig()
        .then(function (redirect) {
          if (redirect) {
            $rootScope.go(redirect.configName || "");
          }
          else {
            $rootScope.go(that.current.parent ? that.current.parent.configName : "");
          }
        });
    };

    that.addCollectionItem = function () {
      modalService.show(modalService.modal.ADD_COLLECTION_ITEM);
      that.configForm.$setDirty();
    };

    /**
     * Loads config data and sets various properties
     */
    function init() {
      // Load Configuration Details
      configService.loadConfig(that.current.configName)
        .then(function (currentData) {
          if (!angular.isUndefined(currentData)) {
            that.current.configs = currentData.configs;
            that.current.isCollection = currentData.isCollection;
            that.current.collectionProperties = currentData.collectionProperties;
            that.current.label = currentData.configNameObject.label || that.current.configName;
            that.current.breadcrumbs = currentData.configNameObject.breadcrumbs || [];
            that.current.parent = that.current.breadcrumbs[that.current.breadcrumbs.length - 1];
            that.current.description = currentData.configNameObject.description;
            that.current.contextPath = configService.getState().contextPath;
            $rootScope.title = $rootScope.i18n.title + ": " + that.current.label;
          }
          that.dvReady = true;
        });
    }
  }
}(angular));
