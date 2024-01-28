import { createRemixStub } from '@remix-run/testing';
import { render, screen, waitFor } from '@testing-library/react';

import Index from '@/routes/_index';

it('render homepage', async () => {
  const RemixStub = createRemixStub([{ path: '/', Component: Index }]);

  render(<RemixStub />);

  await waitFor(() =>
    screen.getByRole('heading', {
      name: /Welcome to Remix/i,
      level: 1,
    })
  );
});
