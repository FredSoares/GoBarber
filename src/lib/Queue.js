import Bee from 'bee-queue';
import CancellationMail from '../app/jobs/CancellationMail';
import redisConfig from '../config/redis';

/* variavel que contem todos os jobs */
const jobs = [CancellationMail];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  /* para cada jobs cria uma fila passando o Bee que é
   * a instancia que conecta com o redis para armazenar e retornar valores e
   * o handle que processa a fila */
  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  /* armazenar job dentro da fila */
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  /* pega todos os jobs e processa em background */
  processQueue() {
    jobs.forEach((job) => {
      const { bee, handle } = this.queues[job.key];

      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}
export default new Queue();
