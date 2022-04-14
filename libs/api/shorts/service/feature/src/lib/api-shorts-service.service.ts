import {
  Short,
  ShortCreateInput,
  ShortTag,
  ShortCreateTagInput,
  ShortUpdateInput,
  ShortReport,
  ShortReportInput,
} from '@graduates/api/shorts/api/shared/entities/data-access';
import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  GetAllShortsQuery,
  GetShortByIdQuery,
  GetShortByTagQuery,
  GetShortByUserQuery,
  GetUserByIdQuery,
} from './queries/api-shorts-query.query';
import {
  CreateShortCommand,
  DeleteShortCommand,
  UpdateShortCommand,
} from './commands/api-shorts-command.command';
import { User } from '@graduates/api/authentication/api/shared/interfaces/data-access';
import {
  GetTagsByShortIdQuery,
  GetAllTagsQuery,
} from './queries/api-short-tag-query.query';
import {
  CreateTagCommand,
  UpdateTagsCommand,
  UpdateTagByShortCommand,
  DeleteTagsCommand,
  DeleteTagsByShortCommand,
  DeleteTagByShortTagCommand,
} from './commands/api-short-tag-command.command';

import {
  GetAllReportsQuery,
  GetReportsForShortQuery,
  GetReportsByUserQuery,
  GetReportQuery,
} from './queries/api-short-report-query.query';

import {
  CreateReportCommand,
  DeleteReportCommand,
} from './commands/api-short-report-command.command';

@Injectable()
export class ShortsService {
  /**
   * Constructor - injects QueryBus and CommandBus
   * @param {QueryBus} queryBus The query bus
   * @param {CommandBus} commandBus The command bus
   */
  constructor(
    private readonly queryBus: QueryBus,
    private commandBus: CommandBus
  ) {}

  /**
   * Find all shorts from database
   * @return {Promise<Short[]>}
   */
  async findAllShorts(): Promise<Short[]> {
    return await this.queryBus.execute(new GetAllShortsQuery());
  }

  /**
   * Find a short by id
   * @param {string} id The id of the short to find
   * @return {Promise<Short | null>}
   */
  async findShortById(id: string): Promise<Short> {
    return await this.queryBus.execute(new GetShortByIdQuery(id));
  }

  //* Remove later
  async findUserById(id: string): Promise<User> {
    return await this.queryBus.execute(new GetUserByIdQuery(id));
  }

  /**
   * Find all shorts by user id
   * @param {string} userId The id of the user to find the shorts for
   * @return {Promise<Short[] | null>}
   */
  async findShortsByUser(userId: string): Promise<Short[]> {
    return await this.queryBus.execute(new GetShortByUserQuery(userId));
  }

  /**
   * Find all shorts by tag id
   * @param {string} tagId The id of the tag to find the shorts for
   * @return {Promise<Short[] | null>}
   */
  async findShortsByTag(tagId: string): Promise<Short[]> {
    return await this.queryBus.execute(new GetShortByTagQuery(tagId));
  }

  /**
   * Create a new short
   * @param {ShortCreateInput} short The short to create
   * @param {string} userId The id of the user to create the short for
   * @return {Promise<Short | null>}
   */
  async createShort(short: ShortCreateInput, userId: string): Promise<Short> {
    return await this.commandBus.execute(new CreateShortCommand(short, userId));
  }

  /**
   * Delete a short
   * @param {string} id The id of the short to delete
   * @return {Promise<Short | null>}
   */
  async deleteShort(id: string): Promise<Short | null> {
    return await this.commandBus.execute(new DeleteShortCommand(id));
  }

  /**
   * Update a short
   * @param {ShortUpdateInput} short The short to be updated along with tyhe new values
   * @return {Promise<Short | null>}
   */
  async updateShort(short: ShortUpdateInput): Promise<Short | null> {
    return await this.commandBus.execute(new UpdateShortCommand(short));
  }

  /**
   * Find all tags
   * @return {Promise<ShortTag[]>}
   */
  async findAllTags(): Promise<ShortTag[]> {
    return await this.queryBus.execute(new GetAllTagsQuery());
  }

  /**
   * Find tags by short id
   * @param {string} id The id of the short to find the tags by
   * @return {Promise<ShortTag[]>}
   */
  async findTagsByShortId(id: string): Promise<ShortTag[]> {
    return await this.queryBus.execute(new GetTagsByShortIdQuery(id));
  }

  /**
   * Create a new tag
   * @param {ShortCreateTagInput} tag The tag to create
   * @return {Promise<ShortTag | null>}
   */
  async createTag(tag: ShortCreateTagInput): Promise<ShortTag | null> {
    return await this.commandBus.execute(new CreateTagCommand(tag));
  }

  /**
   * Update a tag
   * @param {string} tag The current text content of the tag
   * @param {string} newTag The new text content of the tag
   * @return {Promise<string>}
   */
  async updateTags(tag: string, newTag: string): Promise<string> {
    return await this.commandBus.execute(new UpdateTagsCommand(tag, newTag));
  }

  /**
   * Update a tag by the short id
   * @param {string} shortId The cid of the short
   * @param {string} tag The current text content of the tag
   * @param {string} newTag The new text content of the tag
   * @return {Promise<string>}
   */
  async updateTagByShortId(
    shortId: string,
    tag: string,
    newTag: string
  ): Promise<string> {
    return await this.commandBus.execute(
      new UpdateTagByShortCommand(shortId, tag, newTag)
    );
  }

  /**
   * Delete tags by text content
   * @param {string} tag The text content of the tag
   * @return {Promise<string>}
   */
  async deleteTags(tag: string): Promise<string> {
    return await this.commandBus.execute(new DeleteTagsCommand(tag));
  }

  /**
   * Delete all tags for a short
   * @param {string} shortId The short id
   * @return {Promise<string>}
   */
  async deleteTagsByShortId(shortId: string): Promise<string> {
    return await this.commandBus.execute(new DeleteTagsByShortCommand(shortId));
  }

  /**
   * Delete a certain tag
   * @param {string} shortId The short id
   * @param {string} tag The text content of the tag
   * @return {Promise<string>}
   */
  async deleteTagByShortTag(shortId: string, tag: string): Promise<string> {
    return await this.commandBus.execute(
      new DeleteTagByShortTagCommand(shortId, tag)
    );
  }

  /**
   * Get all reports
   * @return {Promise<ShortReport>}
   */
  async getAllReports(): Promise<ShortReport[]> {
    return await this.queryBus.execute(new GetAllReportsQuery());
  }

  /**
   * Get all reports by user
   * @param {string} userId The id of the user to get the reports for
   * @return {Promise<ShortReport[]>}
   */
  async getReportsByUser(userId: string): Promise<ShortReport[]> {
    return await this.queryBus.execute(new GetReportsByUserQuery(userId));
  }

  /**
   * Get all reports for short
   * @param {string} shortId The id of the short to get the reports for
   * @return {Promise<ShortReport[]>}
   */
  async getReportsForShort(shortId: string): Promise<ShortReport[]> {
    return await this.queryBus.execute(new GetReportsForShortQuery(shortId));
  }

  /**
   * Get a single report
   * @param {string} shortId The id of the short to get the reports for
   * @param {string} userId The id of the user to get the reports for
   * @return {Promise<ShortReport>}
   */
  async getReport(
    shortId: string,
    userId: string
  ): Promise<ShortReport | null> {
    return await this.queryBus.execute(new GetReportQuery(shortId, userId));
  }

  /**
   * Create a new report
   * @param {ShortReportInput} report The id of the short to get the reports for
   * @param {string} userId The id of the user to get the reports for
   * @return {Promise<ShortReport>}
   */
  async reportShort(
    report: ShortReportInput,
    userId: string
  ): Promise<ShortReport | null> {
    return await this.queryBus.execute(new CreateReportCommand(report, userId));
  }

  /**
   * Delete a report
   * @param {shortId} report The id of the short to get the reports for
   * @param {string} userId The id of the user to get the reports for
   * @return {Promise<ShortReport>}
   */
  async deleteReport(
    shortId: string,
    userId: string
  ): Promise<ShortReport | null> {
    return await this.queryBus.execute(
      new DeleteReportCommand(shortId, userId)
    );
  }
}
