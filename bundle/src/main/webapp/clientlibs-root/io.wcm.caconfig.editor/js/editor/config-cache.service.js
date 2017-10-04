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
(function (angular, _) {
  "use strict";

  var STORED_CONFIG_CACHE = "caconfig-configCache";

  /**
   * Config Cache service
   *
   * Storing Config Data information in memory / in local storage.
   */
  angular.module("io.wcm.caconfig.editor")
    .service("configCacheService", ConfigCacheService);

  ConfigCacheService.$inject = ["$window"];

  function ConfigCacheService($window) {
    var that = this;
    var configCache = {};

    /**
     * Gets "configNameObject" for a config,
     * first checking the configCache,
     * then falling back to the "storedConfigCache" (in local storage)
     *
     * @param  {String} configName
     * @return {Object}
     */
    that.getConfigNameObject = function(configName) {
      var storedConfigCache;
      var config = configCache[configName];

      if (angular.isObject(config) && angular.isObject(config.configNameObject)) {
        return config.configNameObject;
      }

      storedConfigCache = getStoredConfigCache();
      config = storedConfigCache[configName];

      if (angular.isObject(config) && angular.isObject(config.configNameObject)) {
        return config.configNameObject;
      }

      return {};
    };

    that.plantConfigCache = function (data) {
      configCache = configCache || {};
      angular.forEach(data, function (config) {
        var configName = config.configName;
        if (configName) {
          configCache[configName] = configCache[configName] || {};
          configCache[configName].configNameObject = config;
        }
      });
      return configCache;
    };

    /**
     * @param  {Array}   configs
     * @param  {String=} parentName
     */
    that.updateConfigCache = function (configs, parentName) {
      var configData,
          i;

      for (i = 0; i < configs.length; i++) {
        configData = configs[i];
        addConfigToCache(configData, parentName);
      }
      setStoredConfigCache();
    };

    function addConfigToCache(configData, parentName) {
      var isNested = false;
      var isCollection = false;
      var isCollectionItem = false;
      var children,
          config,
          configName,
          parent,
          properties;

      if (angular.isObject(configData.nestedConfig)) {
        configName = configData.nestedConfig.configName;
        isNested = true;
      }
      else if (angular.isObject(configData.nestedConfigCollection)) {
        configName = configData.nestedConfigCollection.configName;
        isNested = true;
        isCollection = true;
      }
      else {
        configName = configData.configName;
      }

      if (!configName) {
        return;
      }

      configCache[configName] = configCache[configName] || {};
      config = configCache[configName];

      isCollectionItem = angular.isString(configData.collectionItemName);

      // if already has been added to cache
      if (!angular.isUndefined(config.hasChildren) && !isCollectionItem
          && !(isNested && isCollection)) {
        return;
      }

      if (!isCollectionItem) {
        parent = that.getConfigNameObject(parentName);

        config.parent = angular.equals(parent, {}) ? null : parent;
        config.configNameObject = config.configNameObject || {};

        if (isNested) {
          config.configNameObject.configName = configName;
          config.configNameObject.collection = isCollection;
          config.configNameObject.name = configData.name;
          config.configNameObject.description = configData.metadata.description;
          config.configNameObject.label = configData.metadata.label;
        }

        config.configNameObject.breadcrumbs = buildBreadcrumbs(configName);
      }

      properties = getConfigProperties(configData, isNested, isCollection);
      children = getChildren(properties);

      if (children.length) {
        config.hasChildren = true;
        that.updateConfigCache(children, configName);
      }
      else {
        config.hasChildren = false;
      }
    }

    /**
     * @param  {Object}  configData
     * @param  {Boolean} isNested
     * @param  {Boolean} isCollection
     * @return {Array}
     */
    function getConfigProperties(configData, isNested, isCollection) {
      var properties = [];

      if (isNested && isCollection) {
        properties = _.flatten(_.map(configData.nestedConfigCollection.items, "properties"));
      }
      else if (isNested) {
        properties = configData.nestedConfig.properties;
      }
      else {
        properties = configData.properties;
      }

      return angular.isArray(properties) ? properties : [];
    }

    /**
     * Extracts sub/child-configs (nestedConfig or nestedConfigCollection)
     * from config properties
     * @param  {Array} properties
     * @return {Array}
     */
    function getChildren(properties) {
      var children = [];
      children = _.filter(properties, function (property) {
        return angular.isObject(property.nestedConfig)
          || angular.isObject(property.nestedConfigCollection);
      });

      return children;
    }

    /**
     * @param  {String} configName
     * @return {Array}
     */
    function buildBreadcrumbs(configName) {
      var config = configCache[configName];
      var breadcrumbs = [];
      var configNameObject,
          parent;

      if (!config || !config.parent) {
        return breadcrumbs;
      }

      configNameObject = config.configNameObject;

      if (configNameObject.breadcrumbs) {
        return configNameObject.breadcrumbs;
      }

      parent = angular.copy(config.parent);

      if (parent.collection) {
        parent.itemName = configName.replace(parent.configName, "")
          .replace(configNameObject.name, "")
          .replace(/^\//, "")     // remove slash at start
          .replace(/\/$/, "")     // remove slash at end
          .replace(/\//g, " / "); // add spaces around remaining slashes, for view
      }

      breadcrumbs.push(parent);
      breadcrumbs = buildBreadcrumbs(parent.configName).concat(breadcrumbs);

      return breadcrumbs;
    }

    function setStoredConfigCache() {
      $window.localStorage.setItem(STORED_CONFIG_CACHE, angular.toJson(configCache));
    }

    function getStoredConfigCache() {
      var storedConfigCache = angular.fromJson($window.localStorage.getItem(STORED_CONFIG_CACHE));
      if (angular.isObject(storedConfigCache)) {
        return storedConfigCache;
      }
      return {};
    }

    that.removeStoredConfigCache = function () {
      $window.localStorage.removeItem(STORED_CONFIG_CACHE);
    };

  }

}(angular, _));
