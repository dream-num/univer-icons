import React, { Suspense } from 'react';
import Content from '../md/introduction.mdx';

function Introduction() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Content />
    </Suspense>
  );
}

export default Introduction;
