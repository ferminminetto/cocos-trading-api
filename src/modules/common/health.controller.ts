import { Controller, Get, Inject } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health')
@Controller("api/health")
export class HealthController {
    constructor (@Inject('LOGGER') private readonly logger) {}

    @Get()
    @ApiOperation({ summary: 'Healthcheck endpoint', description: 'Returns API status' })
    @ApiResponse({ status: 200, description: 'Simple endpoint to check API status. Useful for Docker healthchecks, orchestrators, and external monitoring.', schema: { example: { status: 'OK' } } })
    getHealth(): { status: string } {
        this.logger.info('Health check requested');
        return { status: "OK" };
    }
}