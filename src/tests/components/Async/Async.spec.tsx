import { render, screen } from '@testing-library/react';
import { Async } from '.';

test('it renders correctly', async () => {
  render(<Async />);

  expect(screen.getByText('Hello world')).toBeInTheDocument();

  expect(await screen.findByText('Button')).toBeInTheDocument();
  // await waitFor(() => {
  //   return expect(screen.getByText('Button')).toBeInTheDocument();
  // });

  // --- if element will be removed from screen
  // await waitForElementToBeRemoved(screen.queryByText('Button'))
  // --- or
  // await waitFor(() => {
  //   return expect(screen.queryByText('Button')).not.toBeInTheDocument();
  // });
});
