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
package io.wcm.caconfig.editor.impl;

import java.io.IOException;
import java.util.Collection;
import java.util.SortedSet;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.CharEncoding;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.apache.sling.caconfig.management.ConfigurationData;
import org.apache.sling.caconfig.management.ConfigurationManager;
import org.apache.sling.caconfig.resource.ConfigurationResourceResolver;
import org.apache.sling.caconfig.spi.metadata.ConfigurationMetadata;
import org.apache.sling.commons.json.JSONArray;
import org.apache.sling.commons.json.JSONException;
import org.apache.sling.commons.json.JSONObject;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

/**
 * Get configuration names with labels and descriptions.
 */
@Component(service = Servlet.class, immediate = true, property = {
    "sling.servlet.resourceTypes=/apps/wcm-io/caconfig/editor/components/page/editor",
    "sling.servlet.extensions=json",
    "sling.servlet.selectors=" + ConfigNamesServlet.SELECTOR,
    "sling.servlet.methods=GET"
})
public class ConfigNamesServlet extends SlingSafeMethodsServlet {
  private static final long serialVersionUID = 1L;

  /**
   * Selector
   */
  public static final String SELECTOR = "configNames";

  @Reference
  private ConfigurationManager configManager;
  @Reference
  private ConfigurationResourceResolver configurationResourceResolver;
  @Reference
  private EditorConfig editorConfig;

  @Override
  protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
    if (!editorConfig.isEnabled()) {
      response.sendError(HttpServletResponse.SC_FORBIDDEN);
      return;
    }

    Resource contextResource = request.getResource();
    try {
      JSONObject result = new JSONObject();
      result.putOpt("contextPath", getContextPath(contextResource));
      result.put("configNames", getConfigNames(contextResource));

      response.setContentType("application/json;charset=" + CharEncoding.UTF_8);
      response.getWriter().write(result.toString());
    }
    catch (JSONException ex) {
      throw new ServletException("Unable to generate JSON.", ex);
    }
  }

  @SuppressWarnings("null")
  private String getContextPath(Resource contextResource) {
    return configurationResourceResolver.getContextPath(contextResource);
  }

  @SuppressWarnings("null")
  private JSONArray getConfigNames(Resource contextResource) throws JSONException {
    JSONArray output = new JSONArray();

    SortedSet<String> configNames = configManager.getConfigurationNames();
    for (String configName : configNames) {
      ConfigurationMetadata metadata = configManager.getConfigurationMetadata(configName);
      if (metadata != null) {
        JSONObject item = new JSONObject();
        item.put("configName", configName);
        item.putOpt("label", metadata.getLabel());
        item.putOpt("description", metadata.getDescription());
        item.put("collection", metadata.isCollection());
        item.put("exists", hasConfig(contextResource, configName, metadata.isCollection()));
        output.put(item);
      }
    }

    return output;
  }

  @SuppressWarnings("null")
  private boolean hasConfig(Resource contextResource, String configName, boolean collection) {
    if (collection) {
      Collection<ConfigurationData> configs = configManager.getConfigurationCollection(contextResource, configName).getItems();
      return !configs.isEmpty();
    }
    else {
      ConfigurationData config = configManager.getConfiguration(contextResource, configName);
      return config != null && config.getResourcePath() != null;
    }
  }

}
