import AWS from 'aws-sdk';
import { RequestHandler } from 'express';
// import { Card } from '../database';
import config from '../config';

const sync = (sqs: AWS.SQS): RequestHandler => {
  return async (req, res) => {
    // TODO validate incoming cards structure
    // TODO sanitise incoming cards data (only use known props)
    // TODO group imcoming cards by id
    // TODO sort incoming cards by revision
    // TODO insert: if id doesn't exist - store
    // TODO insert: if [id, revision] exists ignore
    // TODO is there existing card with this [id, revision]? yes - looks like a merge conflict

    for (const card of req.body.cards) {
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
      })
    }

    res.json({ foo: 'bar' });
  }
}

export default sync;
