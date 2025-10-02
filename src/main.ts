import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger, ValidationPipe } from '@nestjs/common'
import helmet from 'helmet'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(helmet())

  // enable CORS
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe())
  const port = process.env.PORT || 8080
  await app.listen(port)
  Logger.log(`Application running on: ${process.env.PORT}`)
}
bootstrap()
