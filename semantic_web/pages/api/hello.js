// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const WBK = require("wikibase-sdk");
const wbk = WBK({
  instance: "https://www.wikidata.org",
  sparqlEndpoint: "https://query.my-wikibase-instan.se/sparql", // Required to use `sparqlQuery` and `getReverseClaims` functions, optional otherwise
});

export default function handler(req, res) {
  res.status(200).json({ name: 'John Doe' })
}
