import { Request, Response } from 'express';
import { eq, sql, like, or, desc } from 'drizzle-orm';
import { db } from '../db/index.js';
import { resources } from '../db/schema.js';
import type { ApiResponse, PaginatedResponse } from '../types/api.types.js';
import type { Resource } from '../db/schema.js';
import type {
  CreateResourceInput,
  UpdateResourceInput,
  ResourceFilters,
} from '../validators/resource.validator.js';

export async function createResource(req: Request, res: Response): Promise<void> {
  try {
    const data = req.body as CreateResourceInput;

    // Insert into database using Drizzle
    const [newResource] = await db
      .insert(resources)
      .values({
        name: data.name,
        description: data.description || null,
        status: data.status || 'active',
      })
      .returning();

    const response: ApiResponse<Resource> = {
      success: true,
      data: newResource!,  // Add non-null assertion
      message: 'Resource created successfully',
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating resource:', error);

    const response: ApiResponse = {
      success: false,
      error: 'Failed to create resource',
    };

    res.status(500).json(response);
  }
}

export async function getAllResources(req: Request, res: Response): Promise<void> {
  try {
    const filters = req.query as unknown as ResourceFilters;

    const conditions = [];

    if (filters.status) {
      conditions.push(eq(resources.status, filters.status));
    }

    if (filters.search) {
      conditions.push(
        or(
          like(resources.name, `%${filters.search}%`),
          like(resources.description, `%${filters.search}%`)
        )
      );
    }

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(resources)
      .where(conditions.length > 0 ? sql`${sql.join(conditions, sql` AND `)}` : undefined);

    const total = Number(countResult?.count) || 0;

    const limit = Number(filters.limit) || 20;
    const offset = Number(filters.offset) || 0;

    const resourcesList = await db
      .select()
      .from(resources)
      .where(conditions.length > 0 ? sql`${sql.join(conditions, sql` AND `)}` : undefined)
      .orderBy(desc(resources.createdAt))
      .limit(limit)
      .offset(offset);

    const response: PaginatedResponse<Resource> = {
      success: true,
      data: resourcesList,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching resources:', error);

    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch resources',
    };

    res.status(500).json(response);
  }
}

export async function getResourceById(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);

    const [resource] = await db
      .select()
      .from(resources)
      .where(eq(resources.id, id))
      .limit(1);

    if (!resource) {
      const response: ApiResponse = {
        success: false,
        error: 'Resource not found',
      };

      res.status(404).json(response);
      return;
    }

    const response: ApiResponse<Resource> = {
      success: true,
      data: resource,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching resource:', error);

    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch resource',
    };

    res.status(500).json(response);
  }
}

export async function updateResource(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    const data = req.body as UpdateResourceInput;

    const [existingResource] = await db
      .select()
      .from(resources)
      .where(eq(resources.id, id))
      .limit(1);

    if (!existingResource) {
      const response: ApiResponse = {
        success: false,
        error: 'Resource not found',
      };

      res.status(404).json(response);
      return;
    }

    const updateData: Record<string, any> = {};

    if (data.name !== undefined) {
      updateData.name = data.name;
    }

    if (data.description !== undefined) {
      updateData.description = data.description || null;
    }

    if (data.status !== undefined) {
      updateData.status = data.status;
    }

    updateData.updatedAt = new Date().toISOString();

    const [updatedResource] = await db
      .update(resources)
      .set(updateData)
      .where(eq(resources.id, id))
      .returning();

    const response: ApiResponse<Resource> = {
      success: true,
      data: updatedResource!,  // Add non-null assertion
      message: 'Resource updated successfully',
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error updating resource:', error);

    const response: ApiResponse = {
      success: false,
      error: 'Failed to update resource',
    };

    res.status(500).json(response);
  }
}

export async function deleteResource(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);

    const [existingResource] = await db
      .select()
      .from(resources)
      .where(eq(resources.id, id))
      .limit(1);

    if (!existingResource) {
      const response: ApiResponse = {
        success: false,
        error: 'Resource not found',
      };

      res.status(404).json(response);
      return;
    }

    await db.delete(resources).where(eq(resources.id, id));

    const response: ApiResponse = {
      success: true,
      message: 'Resource deleted successfully',
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error deleting resource:', error);

    const response: ApiResponse = {
      success: false,
      error: 'Failed to delete resource',
    };

    res.status(500).json(response);
  }
}