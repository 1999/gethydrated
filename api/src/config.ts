const sqsEndpoint = process.env.SQS_ENDPOINT || 'http://queue:9324';
const sqsQueueName = process.env.SQS_QUEUE_NAME || 'default';

const config = {
  sqs: {
    connection: {
      apiVersion: '2012-11-05',
      endpoint: sqsEndpoint,
      region: 'localhost',
      accessKeyId: 'DUMMY-accessId',
      secretAccessKey: 'DUMMY-accessKey',
      // logger: logger,
    },
    queueName: sqsQueueName,
    queueUrl: `${sqsEndpoint}/queue/${sqsQueueName}`,
  },
};

export default config;
