import { Module } from '@nestjs/common';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { AgentsModule } from './agents/agents.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { auth } from './auth';
import { PrismaModule } from './common/prisma/prisma.module';
import { ListingAvailabilityModule } from './listing-availability/listing-availability.module';
import { ListingRatesModule } from './listing-rates/listing-rates.module';
import { ListingsModule } from './listings/listings.module';
import { UsersModule } from './users/users.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [
    PrismaModule,
    AgentsModule,
    UsersModule,
    AuthModule.forRoot({
      auth,
      bodyParser: {
        json: {
          limit: '2mb',
        },
        urlencoded: {
          extended: true,
          limit: '2mb',
        },
      },
    }),
    ListingAvailabilityModule,
    ListingRatesModule,
    ListingsModule,
    BookingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
