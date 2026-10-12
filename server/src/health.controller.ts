import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { API_CONTRACT_VERSION } from './common/api-version';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOkResponse({ description: 'Service is up' })
  check() {
    return {
      status: 'ok',
      service: 'folio-server',
      phase: 'B-D-local',
      contract: API_CONTRACT_VERSION,
    };
  }
}
