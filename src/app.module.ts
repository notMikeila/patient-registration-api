import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { MessagingModule } from "./messaging/messaging.module";
import { PatientModule } from "./patient/patient.module";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler"

@Module({
  controllers: [AppController],

  imports: [
    ConfigModule.forRoot({ // load environment variables
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{ // rate limiting config
      ttl: 60000,
      limit: 10,
    }]),
    MessagingModule,
    PatientModule,
  ],

  providers: [
    {
      provide: "APP_GUARD",
      useClass: ThrottlerGuard, // rate limiting guard
    },
  ],
})
export class AppModule {}
