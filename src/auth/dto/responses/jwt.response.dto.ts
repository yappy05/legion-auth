import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const JwtResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export class JwtResponseDto extends createZodDto(JwtResponseSchema) {}
export type JwtResponse = z.infer<typeof JwtResponseSchema>;
