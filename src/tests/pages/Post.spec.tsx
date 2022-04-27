import { render, screen } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { getSession } from 'next-auth/react';
import Post, { getServerSideProps } from '../../pages/posts/[slug]';
import { client } from '../../services/prismic';

jest.mock('../../services/prismic', () => {
  return {
    client: {
      getByUID: jest.fn(),
    },
  };
});

jest.mock('next-auth/react');

const post = {
  slug: 'my-new-post',
  title: 'My new post',
  content: '<p>Post content</p>',
  updatedAt: '22 de abril de 2022',
};
describe('Post page', () => {
  it('renders correctly', () => {
    render(<Post post={post} />);

    expect(screen.getByText('My new post')).toBeInTheDocument();
  });

  it('redirects user if no subscription is found', async () => {
    const getSessionMocked = mocked(getSession);

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: null,
    } as any);

    const response = await getServerSideProps({
      req: {
        cookies: {},
      },
      params: {
        slug: 'my-new-post',
      },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: '/posts/preview/my-new-post',
        }),
      }),
    );
  });

  it('loads initial data', async () => {
    const getSessionMocked = mocked(getSession);

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription',
    } as any);
    const getPrismicClientMocked = mocked(client);

    getPrismicClientMocked.getByUID.mockResolvedValueOnce({
      data: {
        title: [{ type: 'heading', text: 'My new post' }],
        content: [{ type: 'paragraph', text: 'Post content' }],
      },
      last_publication_date: '2022-04-22T03:00:00.000Z',
    } as any);

    const response = await getServerSideProps({
      params: {
        slug: 'my-new-post',
      },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'my-new-post',
            title: 'My new post',
            content: '<p>Post content</p>',
            updatedAt: '22 de abril de 2022',
          },
        },
      }),
    );
  });
});
