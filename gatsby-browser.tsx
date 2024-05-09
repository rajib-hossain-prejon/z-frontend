import React from 'react';
import { WrapRootElementBrowserArgs } from 'gatsby';

import GatsbyShared from './gatsby-shared';

export const wrapRootElement = ({ element }: WrapRootElementBrowserArgs) => {
  return <GatsbyShared>{element}</GatsbyShared>;
};
