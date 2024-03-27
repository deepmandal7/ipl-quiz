import { ApiResponseProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class AuthResponseData {
  @ApiResponseProperty({
    example:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhMmNkMGNmZi00NmExLTQxODgtOWNkZS0wMWQ1Y2E5NjE1ZDUiLCJ1c2VydHlwZSI6IkFETUlOIiwiaWF0IjoxNjgxOTg1ODQ4fQ.kl8LVd7OVtgZJ5BkkxnlObi-rrAc5xxbbZz2QT9WDfM',
  })
  @IsString()
  @IsNotEmpty()
  Authorization: string;
}

export class AuthResponseEntity {
  @ApiResponseProperty({
    example: 'Logged in succesfully',
  })
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  msg: string;

  @ApiResponseProperty({
    example: {
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhMmNkMGNmZi00NmExLTQxODgtOWNkZS0wMWQ1Y2E5NjE1ZDUiLCJ1c2VydHlwZSI6IkFETUlOIiwiaWF0IjoxNjgxOTg1ODQ4fQ.kl8LVd7OVtgZJ5BkkxnlObi-rrAc5xxbbZz2QT9WDfM',
    },
  })
  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AuthResponseData)
  data: AuthResponseData;
}
