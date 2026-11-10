import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate as isUuid } from 'uuid';

/**
 * Validates that a route parameter is a valid UUID (v4).
 *
 * Throws BadRequestException with a descriptive message if validation fails.
 *
 * @example
 * @Get(':id')
 * findOne(@Param('id', ParseUUIDPipe) id: string) { ... }
 */
@Injectable()
export class ParseUUIDPipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (typeof value !== 'string' || !isUuid(value)) {
      const paramName = metadata.data ?? 'parameter';
      throw new BadRequestException(
        `Validation failed: '${value}' is not a valid UUID for '${paramName}'`,
      );
    }
    return value;
  }
}
