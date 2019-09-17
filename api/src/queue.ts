import AWS from 'aws-sdk';
import config from './config';

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
