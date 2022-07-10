import { plainToClass } from 'class-transformer';
import {
  IsBoolean,
  IsBooleanString,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';

export class EnvironmentVariables {
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  APP_PORT: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  APP_BASE: string;

  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  SHOW_ERROR_STACK: boolean;

  @IsString()
  @IsNotEmpty()
  FIREBASE_CERT_PATH: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  FIREBASE_DATABASE_URL: string
}

export function ValidateEnv(config: Record<string, any>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
