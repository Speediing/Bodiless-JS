/**
 * Copyright © 2022 Johnson & Johnson
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { FC, Fragment } from 'react';
import {
  withMenuOptions,
} from '@bodiless/core';
import {
  menuFormPageMove,
  menuFormPageClone,
  menuFormPageDelete,
  usePageMenuOptions,
} from '@bodiless/page';
import { useSDK } from '@contentful/react-apps-toolkit';
import { ContentfulClient } from './ContentfulClient';
import { menuFormPageNew } from './MenuFormPageNew';

export const ContentfulEditPageButtons: FC = () => {
  const sdk = useSDK();
  const defaultClient = new ContentfulClient(sdk);

  const cloneOptions = {
    name: 'clone',
    icon: 'collections',
    label: 'Clone',
    handler: () => menuFormPageClone(defaultClient),
    isDisabled: true,
    isHidden: true,
  };

  const deleteOptions = {
    name: 'deletepage',
    icon: 'delete',
    label: 'Delete',
    handler: () => menuFormPageDelete(defaultClient),
    isDisabled: true,
    isHidden: true,
  };

  const moveOptions = {
    name: 'move',
    icon: 'drive_file_move',
    label: 'Move',
    handler: () => menuFormPageMove(defaultClient),
    isDisabled: true,
    isHidden: true,
  };

  const newOptions = {
    name: 'newpage',
    icon: 'note_add',
    label: 'New',
    handler: () => menuFormPageNew(defaultClient),
    isDisabled: true,
    isHidden: false,
  };

  const withClonePageButton = withMenuOptions({
    useMenuOptions: () => usePageMenuOptions(cloneOptions),
    name: 'ClonePage',
    root: true,
  });

  const withDeletePageButton = withMenuOptions({
    useMenuOptions: () => usePageMenuOptions(deleteOptions),
    name: 'DeletePage',
    root: true,
  });

  const withMovePageButton = withMenuOptions({
    useMenuOptions: () => usePageMenuOptions(moveOptions),
    name: 'MovePage',
    root: true,
  });

  const withNewPageButton = withMenuOptions({
    useMenuOptions: () => usePageMenuOptions(newOptions),
    name: 'NewPage',
    root: true,
  });

  const ClonePageButton = withClonePageButton(Fragment);
  const DeletePageButton = withDeletePageButton(Fragment);
  const MovePageButton = withMovePageButton(Fragment);
  const NewPageButton = withNewPageButton(Fragment);

  return (
    <>
      <NewPageButton />
      <MovePageButton />
      <DeletePageButton />
      <ClonePageButton />
    </>
  );
};
