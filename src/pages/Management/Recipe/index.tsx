import React from 'react';

import Lazyload from '@/components/LazyLoad';

const RecipePageLazy = React.lazy(
  () => import('@/pages/Management/Recipe/RecipePage'),
);

const ManagementRecipePage = () => {
  return <Lazyload component={RecipePageLazy} />;
};

export default ManagementRecipePage;