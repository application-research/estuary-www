import * as S from '@common/server';

export default async function getPrice(req: any, res: any) {
  await S.cors(req, res);

  let json;
  try {
    const response = await fetch('https://data.storage.market/api/market/filecoin');
    json = await response.json();
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: 'Network price issue.' });
  }

  if (!json || !json.price) {
    return res.status(500).json({ error: 'Could not fetch price.' });
  }

  return res.json({
    ...json,
  });
}
