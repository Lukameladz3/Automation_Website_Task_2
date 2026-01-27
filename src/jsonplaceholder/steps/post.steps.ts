import { expect } from "@playwright/test";
import type { APIResponse } from "@playwright/test";
import { JsonPlaceholderService } from "../api/services/json-placeholder.service";
import * as PostTypes from "../models/schemas/post.schemas";
import { PostTestData } from "@test-data/jsonplaceholder";
import { step } from "../utils/step-decorator";
import { SortUtils } from "../utils/sort.utils";

/**
 * Steps for Post API operations.
 * Handles CRUD operations and post-specific validations.
 */
export class PostSteps {
  constructor(private service: JsonPlaceholderService) {}

  // ==================== API Call Steps - Validated Methods ====================

  @step("Create new post")
  async createPost(
    request: PostTypes.CreatePostRequest,
  ): Promise<PostTypes.CreatePostResponse> {
    return (await this.service.createPost(
      request,
    )) as PostTypes.CreatePostResponse;
  }

  @step("Create post with partial validation")
  async createPostWithPartialValidation(
    payload: Partial<{ title: string; body: string; userId: number }>,
  ): Promise<PostTypes.CreatePostResponsePartial> {
    return (await this.service.createPost(payload, {
      schema: PostTypes.CreatePostResponsePartialSchema,
    })) as PostTypes.CreatePostResponsePartial;
  }

  @step("Create post with passthrough (security testing)")
  async createPostWithPassthrough(
    payload: { title: string; body: string; userId: number } & Record<
      string,
      unknown
    >,
  ): Promise<PostTypes.CreatePostResponsePassthrough> {
    return (await this.service.createPost(payload, {
      schema: PostTypes.CreatePostResponsePassthroughSchema,
    })) as PostTypes.CreatePostResponsePassthrough;
  }

  @step("Get post by ID")
  async getPost(postId: number): Promise<PostTypes.Post> {
    return (await this.service.getPostById(postId)) as PostTypes.Post;
  }

  @step("Get all posts")
  async getAllPosts(): Promise<PostTypes.Post[]> {
    return (await this.service.getAllPosts()) as PostTypes.Post[];
  }

  @step("Get posts by user ID")
  async getPostsByUserId(userId: number): Promise<PostTypes.Post[]> {
    return (await this.service.getAllPosts({
      params: { userId },
    })) as PostTypes.Post[];
  }

  @step("Update post")
  async updatePost(
    postId: number,
    title: string,
    body: string,
    userId: number,
  ): Promise<
    PostTypes.UpdatePostResponse | PostTypes.UpdatePostResponsePartial
  > {
    return (await this.service.updatePost(postId, { title, body, userId })) as
      | PostTypes.UpdatePostResponse
      | PostTypes.UpdatePostResponsePartial;
  }

  @step("Delete post")
  async deletePost(postId: number): Promise<Record<string, never>> {
    return (await this.service.deletePost(postId)) as Record<string, never>;
  }

  // ==================== Verification Steps ====================

  @step("Verify post matches expected data")
  async verifyPost(
    post:
      | PostTypes.Post
      | PostTypes.CreatePostResponse
      | PostTypes.CreatePostResponsePassthrough,
    expected: { id?: number; userId?: number; title?: string; body?: string },
  ): Promise<void> {
    const hasExpectedValues = Object.values(expected).some(
      (value) => value !== undefined,
    );
    expect(
      hasExpectedValues,
      "At least one expected value must be provided for verification",
    ).toBe(true);

    if (expected.id !== undefined) {
      expect(post.id, "Post ID mismatch").toBe(expected.id);
    }
    if (expected.userId !== undefined) {
      expect(post.userId, "Post userId mismatch").toBe(expected.userId);
    }
    if (expected.title !== undefined) {
      expect(post.title, "Post title mismatch").toBe(expected.title);
    }
    if (expected.body !== undefined) {
      expect(post.body, "Post body mismatch").toBe(expected.body);
    }
  }

  @step("Verify post has content")
  async verifyPostHasContent(
    post: PostTypes.Post | PostTypes.CreatePostResponse,
  ): Promise<void> {
    expect(post.title.length, "Post should have title").toBeGreaterThan(0);
    expect(post.body.length, "Post should have body").toBeGreaterThan(0);
  }

  // ==================== Array Verification Steps ====================

  @step("Verify posts are sorted by ID")
  async verifyPostsSortedById(
    posts: PostTypes.Post[],
    order: "asc" | "desc" = "asc",
  ): Promise<void> {
    const ids = SortUtils.extractProperty(posts, "id");
    const sortedIds = SortUtils.sortNumbers(ids, order);
    expect(ids).toEqual(sortedIds);
  }

  @step("Verify all posts belong to user")
  async verifyAllPostsBelongToUser(
    posts: PostTypes.Post[],
    userId: number,
  ): Promise<void> {
    const allMatch = posts.every((post) => post.userId === userId);
    expect(allMatch, `All posts should belong to userId ${userId}`).toBe(true);
  }
}
