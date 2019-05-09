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
package io.wcm.caconfig.editor.model;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.caconfig.resource.ConfigurationResourceResolver;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.osgi.annotation.versioning.ProviderType;

import com.day.cq.wcm.api.Page;

import io.wcm.sling.models.annotations.AemObject;
import io.wcm.caconfig.editor.impl.ConfigDataServlet;
import io.wcm.caconfig.editor.impl.ConfigNamesServlet;
import io.wcm.caconfig.editor.impl.ConfigPersistServlet;
import io.wcm.caconfig.editor.impl.EditorConfig;

/**
 * Provides editor configuration options
 */
@Model(adaptables = {
    HttpServletRequest.class,
    Resource.class
})
@ProviderType
public class EditorConfiguration {

  private final String configNamesUrl;
  private final String configDataUrl;
  private final String configPersistUrl;
  private final String contextPath;
  private final String language;
  private final boolean enabled;

  /**
   * @param currentResource Current resource
   */
  @Inject
  public EditorConfiguration(@SlingObject Resource currentResource,
      @OSGiService ConfigurationResourceResolver configResourceResolver,
      @OSGiService EditorConfig editorConfig,
      @AemObject Page currentPage) {
    this.configNamesUrl = currentResource.getPath() + "." + ConfigNamesServlet.SELECTOR + ".json";
    this.configDataUrl = currentResource.getPath() + "." + ConfigDataServlet.SELECTOR + ".json";
    this.configPersistUrl = currentResource.getPath() + "." + ConfigPersistServlet.SELECTOR + ".json";
    this.contextPath = configResourceResolver.getContextPath(currentResource);
    this.language = currentPage.getLanguage(false).getLanguage();
    this.enabled = editorConfig.isEnabled();
  }

  public String getConfigNamesUrl() {
    return configNamesUrl;
  }

  public String getConfigDataUrl() {
    return configDataUrl;
  }

  public String getConfigPersistUrl() {
    return configPersistUrl;
  }

  public String getContextPath() {
    return this.contextPath;
  }

  public String getLanguage() {
    return this.language;
  }

  public boolean isEnabled() {
    return this.enabled;
  }

}
