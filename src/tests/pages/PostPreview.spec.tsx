import { render, screen } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import PostPreview, { getStaticProps } from '../../pages/posts/preview/[slug]';
import { client } from '../../services/prismic';

jest.mock('../../services/prismic', () => {
  return {
    client: {
      getByUID: jest.fn(),
    },
  };
});

jest.mock('next-auth/react');

jest.mock('next/router');

const post = {
  slug: 'my-new-post',
  title: 'My new post',
  content: '<p>Post content</p>',
  updatedAt: '22 de abril de 2022',
};

describe('Post page', () => {
  it('renders correctly', () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: 'unauthenticated',
    });

    render(<PostPreview post={post} />);

    expect(screen.getByText('My new post')).toBeInTheDocument();
    expect(screen.getByText('Deseja continuar lendo?')).toBeInTheDocument();
  });

  it('redirects user if subscription is found', async () => {
    const useSessionMocked = mocked(useSession);
    const useRouterMocked = mocked(useRouter);

    useSessionMocked.mockReturnValue({
      data: { activeSubscription: 'fake-active-subscription' },
    } as any);

    const pushMock = jest.fn();

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any);

    render(<PostPreview post={post} />);

    expect(pushMock).toHaveBeenCalledWith('/posts/my-new-post');
  });

  it('loads initial data', async () => {
    const getPrismicClientMocked = mocked(client);

    getPrismicClientMocked.getByUID.mockResolvedValueOnce({
      data: {
        title: [{ type: 'heading', text: 'My new post' }],
        content: [{ type: 'paragraph', text: 'Post content' }],
      },
      last_publication_date: '2022-04-22T03:00:00.000Z',
    } as any);

    const response = await getStaticProps({
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
