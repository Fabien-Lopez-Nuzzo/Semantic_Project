import Head from "next/head";
import Image from "next/image";
import Router from "next/router";
import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import fetch from "node-fetch";
import axios from "axios";
const WBK = require("wikibase-sdk");
const wbk = WBK({
  instance: "https://www.wikidata.org",
  sparqlEndpoint: "https://query.my-wikibase-instan.se/sparql", // Required to use `sparqlQuery` and `getReverseClaims` functions, optional otherwise
});

export default function Info() {
  const router = Router;
  useEffect(() => {
    const getInfoCocktail = async () => {
      console.log(router?.query?.name);
      const url = wbk.cirrusSearchPages({
        search: router?.query?.name.toString(),
      });
      fetch(url)
        .then((res) => res.json())
        .then(wbk.parse.wb.pagesTitles)
        .then((titles) => {
          // If you where searching in an entity namespace, which is the default namespace on Wikibase instances,
          // those titles are either entities ids (ex: Q1) or prefixed entities ids (ex: Item:Q1)
          // In the first case, we can just do
          const ids = titles;
          // In the second case, to get the ids, we need to drop the prefix
          // const ids = titles.map((title) => title.split(":")[1]);
          // From there, to get the full entities data, you could do
          const entitiesUrl = wbk.getEntities({ ids });
          return fetch(entitiesUrl);
        })
        .then((res) => res.json())
        // .then(wbk.parse.wb.entities)
        .then((entities) => {
          console.log(entities);
        })
        .catch((error) => console.log("error", error));

      var myHeaders = new Headers();
      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      fetch(
        "https://www.wikidata.org/w/api.php?action=wbgetentities&props=labels&ids=Q2536409&languages=en",
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error));
      let test = await axios.get(
        "https://www.thecocktaildb.com/api/json/v1/1/search.php?f=f"
      );
      console.log(test);
    };
    getInfoCocktail();
  }, []);
  return (
    <div className="bg-red-200 h-screen w-full flex justify-center items-center">
      <div className="w-1/2 h-1/2 flex justify-center items-center">
        <div className="w-1/4"></div>
      </div>
    </div>
  );
}
