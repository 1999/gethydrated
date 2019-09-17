import AWS from 'aws-sdk';
import config from './config';

export const listenQueueChanges = async (sqs: AWS.SQS): Promise<void> => {
  const poll = async (): Promise<AWS.SQS.Message[]> => {
    const data = await sqs.receiveMessage({ QueueUrl: config.sqs.queueUrl, WaitTimeSeconds: 20 }).promise();
    return data.Messages || [];
  };

  console.log('run polling...');

  while (true) {
    const messages = await poll();
    console.log(messages);
  }
};

export const putIntoQueue = async (sqs: AWS.SQS, cards: any): Promise<void> => {
  for (const card of cards) {
    // await Card.findOrCreate({
    //   where: {
    //     card_id: card.id,
    //     revision: card.revision,
    //   },
    //   defaults: {
    //     card_id: card.id,
    //     revision: card.revision,
    //     prev_revision: '', // TODO
    //     created_at: card.created_at,
    //     deleted: card.deleted,
    //     title: card.title,
    //     data: card, // TODO
    //   },
    // });

    sqs.sendMessage({
      MessageBody: JSON.stringify(card),
      QueueUrl: config.sqs.queueUrl,
    }, (err, data) => {
      console.log('send message', { err, data });
    });
  }
};

export const assertQueueExists = async (sqs: AWS.SQS): Promise<string> => {
  const { QueueUrls } = await sqs.listQueues().promise();
  if (QueueUrls && QueueUrls.length) {
    return QueueUrls[0];
  }

  const { QueueUrl } = await sqs.createQueue({ QueueName: config.sqs.queueName }).promise();
  if (!QueueUrl) {
    throw new Error('Created QueueUrl is empty');
  }

  return QueueUrl;
};
