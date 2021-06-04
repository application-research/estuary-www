import * as S from "@common/server";

export default async function getPrice(req, res) {
  await S.cors(req, res);

  let json;
  try {
    const response = await fetch(
      "https://cloud.iexapis.com/stable/crypto/filusdt/price?token=pk_aa330a89a4724944ae1a525879a19f2d"
    );
    json = await response.json();
    console.log(json);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "Network price issue." });
  }

  if (!json || !json.price) {
    return res.status(500).json({ error: "Could not fetch price." });
  }

  return res.json({
    ...json,
  });
}
