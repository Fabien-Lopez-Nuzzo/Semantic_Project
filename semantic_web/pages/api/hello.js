import axios from "axios";

export default async function handler(req, res) {
  let data = await wikidata(req.query.params);
  res.status(200).json(data);
}

async function wikidata(params) {
  const info = await axios.get(
    "https://www.wikidata.org/w/api.php?action=wbgetentities&props=labels&ids=" +
      params +
      "&languages=en&format=json"
  );
  console.log(info.data);
  return info.data;
}
