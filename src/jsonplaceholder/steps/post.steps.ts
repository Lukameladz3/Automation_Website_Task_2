import { expect } from "@playwright/test";
import type { APIResponse } from "@playwright/test";
import { JsonPlaceholderService } from "../api/services/json-placeholder.service";
import type { Post } from "../models/schemas/get.schemas";
import type {
  CreatePostResponse,
  CreatePostResponsePassthrough,
  CreatePostResponsePartial,
} from "../models/schemas/post.schemas";
import type {
  UpdatePostResponse,
  UpdatePostResponsePartial,
} from "../models/schemas/put.schemas";
import { JsonPlaceholderTestData } from "../constants/json-placeholder.constants";
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
  async createPost(request: CreatePostRequest): Promise<CreatePostResponse> {
    return await this.service.createPost(request);
  }

  @step("Create post with partial validation")
  async createPostWithPartialValidation(
    payload: Partial<{ title: string; body: string; userId: number }>,
  ): Promise<CreatePostResponsePartial> {
    return await this.service.createPostWithPartialValidation(payload);
  }

  @step("Create post with passthrough (security testing)")
  async createPostWithPassthrough(
    payload: { title: string; body: string; userId: number } & Record<
      string,
      unknown
    >,
  ): Promise<CreatePostResponsePassthrough> {
    return await this.service.createPostWithPassthrough(payload);
  }

  @step("Get post by ID")
  async getPost(postId: number): Promise<Post> {
    return await this.service.getPostById(postId);
  }

  @step("Get all posts")
  async getAllPosts(): Promise<Post[]> {
    return await this.service.getAllPosts();
  }

  @step("Get posts by user ID")
  async getPostsByUserId(userId: number): Promise<Post[]> {
    return await this.service.getPostsByUserId(userId);
  }

  @step("Update post")
  async updatePost(
    postId: number,
    title: string,
    body: string,
    userId: number,
  ): Promise<UpdatePostResponse | UpdatePostResponsePartial> {
    return await this.service.updatePost(postId, { title, body, userId });
  }

  @step("Delete post")
  async deletePost(postId: number): Promise<Record<string, never>> {
    return await this.service.deletePost(postId);
  }

  // ==================== Raw API Methods for Error Testing ====================

  @step("Get post by string ID (for negative testing)")
  async getPostByStringId(postId: string): Promise<APIResponse> {
    return await this.service.getPostByStringId(postId);
  }

  @step("Get raw post response")
  async getRawPostResponse(postId: number): Promise<APIResponse> {
    return await this.service.getRawPostResponse(postId);
  }

  @step("Create post raw (for negative testing)")
  async createPostRaw(payload: unknown): Promise<APIResponse> {
    return await this.service.createPostRaw(payload);
  }

  @step("Update post raw (for negative testing)")
  async updatePostRaw(postId: number, payload: unknown): Promise<APIResponse> {
    return await this.service.updatePostRaw(postId, payload);
  }

  @step("Delete post raw (for negative testing)")
  async deletePostRaw(postId: number): Promise<APIResponse> {
    return await this.service.deletePostRaw(postId);
  }

  // ==================== Verification Steps ====================

  @step("Verify post matches expected data")
  async verifyPost(
    post: Post | CreatePostResponse | CreatePostResponsePassthrough,
    expected: { id?: number; userId?: number; title?: string; body?: string },
  ): Promise<void> {
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
  async verifyPostHasContent(post: Post | CreatePostResponse): Promise<void> {
    expect(post.title.length, "Post should have title").toBeGreaterThan(0);
    expect(post.body.length, "Post should have body").toBeGreaterThan(0);
  }

  @step("Verify created post ID is 101")
  async verifyCreatedPostId(
    post: CreatePostResponse | CreatePostResponsePartial,
  ): Promise<void> {
    expect(post.id).toBe(JsonPlaceholderTestData.POST.EXPECTED_CREATED_POST_ID);
  }

  @step("Verify passthrough field value")
  async verifyPassthroughField(
    post: CreatePostResponsePassthrough,
    fieldName: string,
    expectedValue: unknown,
  ): Promise<void> {
    const postAny = post as Record<string, unknown>;
    expect(postAny[fieldName]).toBe(expectedValue);
  }

  // ==================== Array Verification Steps ====================

  @step("Verify posts count")
  async verifyPostsCount(posts: Post[], expectedCount: number): Promise<void> {
    expect(posts.length).toBe(expectedCount);
  }

  @step("Verify posts are sorted by ID")
  async verifyPostsSortedById(
    posts: Post[],
    order: "asc" | "desc" = "asc",
  ): Promise<void> {
    const ids = SortUtils.extractProperty(posts, "id");
    const sortedIds = SortUtils.sortNumbers(ids, order);
    expect(ids).toEqual(sortedIds);
  }

  @step("Verify all posts belong to user")
  async verifyAllPostsBelongToUser(
    posts: Post[],
    userId: number,
  ): Promise<void> {
    const allMatch = posts.every((post) => post.userId === userId);
    expect(allMatch, `All posts should belong to userId ${userId}`).toBe(true);
  }
}
