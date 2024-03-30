import { Module } from '@nestjs/common';
import { CommerceModule } from './commerce/commerce.module';


@Module({
  imports: [CommerceModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
