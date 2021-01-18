import { Injectable } from '@nestjs/common';
import { QueueEvents, Worker } from 'bullmq';



@Injectable()
export class AppService {
  worker: Worker
  queueEvents: QueueEvents
}
