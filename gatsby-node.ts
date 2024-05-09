// Implement the Gatsby API “onCreatePage”. This is
// called after every page is created.
export const onCreatePage = async ({ page, actions }: any) => {
  const { createPage } = actions;

  // page.matchPath is a special key that's used for matching pages
  // only on the client.
  if (page.path.match(/^\/dashboard/)) {
    const pageConfig = { ...page, matchPath: '/dashboard/*' };

    // Update the page.
    createPage(pageConfig);
  }

  if (page.path.match(/^\/manage/)) {
    const pageConfig = { ...page, matchPath: '/manage/*' };
    createPage(pageConfig);
  }

  if (page.path.match(/^\/ads/)) {
    const pageConfig = { ...page, matchPath: '/ads/*' };
    createPage(pageConfig);
  }
};
