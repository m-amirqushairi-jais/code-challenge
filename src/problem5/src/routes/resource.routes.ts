import { Router } from 'express';
import {
  createResource,
  getAllResources,
  getResourceById,
  updateResource,
  deleteResource,
} from '../controllers/resource.controller.js';
import { validate } from '../middleware/validate.js';
import {
  createResourceSchema,
  updateResourceSchema,
  resourceFiltersSchema,
  resourceIdSchema,
} from '../validators/resource.validator.js';

const router = Router();

/**
 * @route   POST /api/resources
 * @desc    Create a new resource
 * @access  Public
 * @body    { name: string, description?: string, status?: 'active' | 'inactive' }
 */
router.post(
  '/',
  validate(createResourceSchema, 'body'),
  createResource
);

/**
 * @route   GET /api/resources
 * @desc    Get all resources with optional filters
 * @access  Public
 * @query   ?status=active&search=keyword&limit=10&offset=0
 */
router.get(
  '/',
  validate(resourceFiltersSchema, 'query'),
  getAllResources
);

/**
 * @route   GET /api/resources/:id
 * @desc    Get a single resource by ID
 * @access  Public
 * @params  id - Resource ID (number)
 */
router.get(
  '/:id',
  validate(resourceIdSchema, 'params'),
  getResourceById
);

/**
 * @route   PUT /api/resources/:id
 * @desc    Update a resource by ID
 * @access  Public
 * @params  id - Resource ID (number)
 * @body    { name?: string, description?: string, status?: 'active' | 'inactive' }
 */
router.put(
  '/:id',
  validate(resourceIdSchema, 'params'),
  validate(updateResourceSchema, 'body'),
  updateResource
);

/**
 * @route   DELETE /api/resources/:id
 * @desc    Delete a resource by ID
 * @access  Public
 * @params  id - Resource ID (number)
 */
router.delete(
  '/:id',
  validate(resourceIdSchema, 'params'),
  deleteResource
);

export default router;