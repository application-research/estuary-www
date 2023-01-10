const NODE = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = NODE === 'production';

if (!IS_PRODUCTION) {
  require('dotenv').config();
}

import * as S from '@common/server';
import * as Support from '@common/support';

import { IncomingWebhook } from '@slack/webhook';

export default async function apiEquinixStats(req, res) {
  await S.cors(req, res);
  console.log('request received', req, res);

  const url = process.env.SLACK_WEB_HOOK_URL;
  const webhook = new IncomingWebhook(url);

  await Support.send({
    deviceValue: req.body.deviceValue,
    totalCost: req.body.totalCost,
    webhook,
  });

  res.json({ success: true });
}
