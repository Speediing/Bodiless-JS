import { BodilessMobxStore } from '@bodiless/core';
import { createClient } from 'contentful-management';
import { KnownSDK } from '@contentful/app-sdk';
import {
  CONTENTFUL_DEFAULT_LANGUAGE,
  CONTENTFUL_PAGE_CONTENT_TYPE,
  CONTENTFUL_NODE_CONTENT_TYPE
} from '../Constants';

export const ContentfulEditorDataRetriever = async (sdk: KnownSDK, pagePath: string) => {
  const cma = createClient(
    { apiAdapter: sdk.cmaAdapter },
    {
      type: 'plain',
      defaults: {
        environmentId: sdk.ids.environmentAlias ?? sdk.ids.environment,
        spaceId: sdk.ids.space,
        organizationId: sdk.ids.organization,
      },
    }
  );
  const result = new Map();
  const pagePathNoTrailing = pagePath === '/' ? pagePath :pagePath.replace(/\/$/, '');

  // Temporary store sdk inside data object in order to pass it to the contentful client store.
  result.set('sdk', sdk);

  // Retrieve the page for the current path.
  const pages = await cma.entry.getMany({
    query: {
      content_type: CONTENTFUL_PAGE_CONTENT_TYPE,
      'fields.path': pagePathNoTrailing,
    }
  });

  if (pages.total) {
    // Retrieve all the nodes for the current path.
    const nodes = await cma.entry.getMany({
      query: {
        content_type: CONTENTFUL_NODE_CONTENT_TYPE,
        'fields.path[match]': `pages${pages.items[0].fields.path[CONTENTFUL_DEFAULT_LANGUAGE]}`,
      }
    });
    nodes.items.forEach(async (node) => {
      if (node.fields.path[CONTENTFUL_DEFAULT_LANGUAGE].replace(`pages${pagePathNoTrailing}/`, '').indexOf('/') === -1) {
        const key = `Page${BodilessMobxStore.nodeChildDelimiter}${node.fields.path[CONTENTFUL_DEFAULT_LANGUAGE].replace(`pages${pagePathNoTrailing}/`, '')}`;
        const data = node.fields.content[CONTENTFUL_DEFAULT_LANGUAGE];
        result.set(key, data);
      }
    });
  }
  // Retrieve the page for the current path.
  const siteEntries = await cma.entry.getMany({
    query: {
      content_type: CONTENTFUL_NODE_CONTENT_TYPE,
      'fields.path[match]': 'site',
    }
  });

  siteEntries.items.forEach(siteItem => {
    const key = `Site${BodilessMobxStore.nodeChildDelimiter}${siteItem.fields.path[CONTENTFUL_DEFAULT_LANGUAGE].replace('site/', '')}`;
    const data = siteItem.fields.content[CONTENTFUL_DEFAULT_LANGUAGE];
    result.set(key, data);
  });

  return result;
};