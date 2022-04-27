import { render, screen } from '@testing-library/react';
import { mocked } from 'jest-mock';
import Posts, { getStaticProps } from '../../pages/posts';
import { client } from '../../services/prismic';

jest.mock('../../services/prismic', () => {
  return {
    client: {
      getAllByType: jest.fn(),
    },
  };
});

const posts = [
  {
    slug: 'my-new-post',
    title: 'My new post',
    excerpt: 'Post excerpt',
    updatedAt: '22 de abril de 2022',
  },
];

describe('Posts page', () => {
  it('renders correctly', () => {
    const getPrismicClientMocked = mocked(client);
    getPrismicClientMocked.getAllByType.mockResolvedValue({
      data: posts,
    } as any);

    render(<Posts posts={posts} />);

    expect(screen.getByText('My new post')).toBeInTheDocument();
  });

  it('loads initial data', async () => {
    const getPrismicClientMocked = mocked(client);

    getPrismicClientMocked.getAllByType.mockReturnValueOnce([
      {
        uid: 'my-new-post',
        data: {
          title: [
            {
              type: 'heading1',
              text: 'My new post',
            },
          ],
          content: [
            {
              type: 'paragraph',
              text: 'Post excerpt',
            },
          ],
        },
        last_publication_date: '2022-04-22T03:00:00.000Z',
      },
    ] as any);

    const response = await getStaticProps({ previewData: undefined });

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: 'my-new-post',
              title: 'My new post',
              excerpt: 'Post excerpt',
              updatedAt: '22 de abril de 2022',
            },
          ],
        },
      }),
    );
  });
});
