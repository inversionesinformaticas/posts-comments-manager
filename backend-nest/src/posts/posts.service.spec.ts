import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Comment } from '../comments/schemas/comment.schema';
import { PostsService } from './posts.service';
import { Post } from './schemas/post.schema';

describe('PostsService', () => {
  let service: PostsService;

  const createMockPost = (id: string, title: string, author: string) => ({
    _id: id,
    title,
    author,
    createdAt: new Date(),
    toObject: () => ({
      _id: id,
      title,
      author,
      createdAt: new Date(),
    }),
  });

  const mockPosts = [
    createMockPost('1', 'Post A', 'Ana'),
    createMockPost('2', 'Post B', 'Bruno'),
  ];

  const postModelMock = {
    find: jest.fn(),
    countDocuments: jest.fn(),
  };

  const commentModelMock = {
    aggregate: jest.fn(),
    countDocuments: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    commentModelMock.aggregate.mockReturnValue({
      exec: jest.fn().mockResolvedValue([]),
    });
    commentModelMock.countDocuments.mockReturnValue({
      exec: jest.fn().mockResolvedValue(0),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: getModelToken(Post.name), useValue: postModelMock },
        { provide: getModelToken(Comment.name), useValue: commentModelMock },
      ],
    }).compile();

    service = module.get(PostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAllPaginated should return pagination metadata and commentCount', async () => {
    const execMock = jest.fn().mockResolvedValue(mockPosts);
    const limitMock = jest.fn().mockReturnValue({ exec: execMock });
    const skipMock = jest.fn().mockReturnValue({ limit: limitMock });
    const sortMock = jest.fn().mockReturnValue({ skip: skipMock });
    postModelMock.find.mockReturnValue({ sort: sortMock });
    postModelMock.countDocuments.mockReturnValue({ exec: jest.fn().mockResolvedValue(2) });

    const result = await service.findAllPaginated({
      page: 1,
      limit: 6,
    });

    expect(postModelMock.find).toHaveBeenCalledWith({});
    expect(sortMock).toHaveBeenCalledWith({ createdAt: -1 });
    expect(skipMock).toHaveBeenCalledWith(0);
    expect(limitMock).toHaveBeenCalledWith(6);
    expect(result.items).toEqual([
      { _id: '1', title: 'Post A', author: 'Ana', createdAt: expect.any(Date), commentCount: 0 },
      { _id: '2', title: 'Post B', author: 'Bruno', createdAt: expect.any(Date), commentCount: 0 },
    ]);
    expect(result.pagination).toEqual({
      page: 1,
      limit: 6,
      totalItems: 2,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    });
  });

  it('findAllPaginated should apply search filter on title and author', async () => {
    const execMock = jest.fn().mockResolvedValue([mockPosts[0]]);
    const limitMock = jest.fn().mockReturnValue({ exec: execMock });
    const skipMock = jest.fn().mockReturnValue({ limit: limitMock });
    const sortMock = jest.fn().mockReturnValue({ skip: skipMock });
    postModelMock.find.mockReturnValue({ sort: sortMock });
    postModelMock.countDocuments.mockReturnValue({ exec: jest.fn().mockResolvedValue(1) });

    await service.findAllPaginated({
      page: 1,
      limit: 6,
      search: 'primer',
    });

    expect(postModelMock.find).toHaveBeenCalledWith({
      $or: [
        { title: { $regex: 'primer', $options: 'i' } },
        { author: { $regex: 'primer', $options: 'i' } },
      ],
    });
    expect(postModelMock.countDocuments).toHaveBeenCalledWith({
      $or: [
        { title: { $regex: 'primer', $options: 'i' } },
        { author: { $regex: 'primer', $options: 'i' } },
      ],
    });
  });
});
