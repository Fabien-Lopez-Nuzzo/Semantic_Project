import Router from "next/router";
import Image from "next/image";
import { useState, useEffect } from "react";
import fetch from "node-fetch";
import axios from "axios";
const WBK = require("wikibase-sdk");
const wbk = WBK({
  instance: "https://www.wikidata.org",
  sparqlEndpoint: "https://query.my-wikibase-instan.se/sparql", // Required to use `sparqlQuery` and `getReverseClaims` functions, optional otherwise
});

export default function Info() {
  const router = Router;
  const name = router?.query?.name.toString();
  const [cocktail, setCocktail] = useState(undefined);
  const [cocktailInfo, setCocktailInfo] = useState(undefined);
  const [instanceOf, setInstanceOf] = useState(undefined);
  const [subclassOf, setSubclassOf] = useState(undefined);

  useEffect(() => {
    const getInfoCocktail = async () => {
      // console.log(router?.query?.name);
      const url = wbk.cirrusSearchPages({
        search: name,
      });
      fetch(url)
        .then((res) => res.json())
        .then(wbk.parse.wb.pagesTitles)
        .then(async (titles) => {
          const ids = titles;
          const entitiesUrl = wbk.getEntities({ ids });
          return await fetch(entitiesUrl);
        })
        .then((res) => res.json())
        .then((entities) => {
          setCocktailInfo(Object.values(entities.entities)[0]);
        })
        .catch((error) => console.log("error", error));
      let res = await axios.get(
        "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + name
      );
      setCocktail(res?.data?.drinks[0]);
    };
    getInfoCocktail();
  }, []);

  useEffect(() => {
    const getInfoEntities = async () => {
      // console.log(router?.query?.name);
      const instanceId =
        cocktailInfo?.claims["P31"][0].mainsnak.datavalue.value.id;
      console.log(cocktailInfo);
      const subclassId =
        cocktailInfo?.claims["P279"][0].mainsnak.datavalue.value.id;
      // console.log(instanceId);
      const instance = await fetch("api/hello?params=" + instanceId);
      const data = await instance.json();

      const subclass = await fetch("api/hello?params=" + subclassId);
      const data2 = await subclass.json();
      setInstanceOf(data?.entities[instanceId].labels.en.value);
      setSubclassOf(data2?.entities[subclassId].labels.en.value);
      // console.log(data?.entities[instanceId]);
      console.log(data2);
    };
    getInfoEntities();
  }, [cocktailInfo]);

  return (
    <div className="bg-slate-800 h-auto min-h-screen w-full flex justify-start flex-col items-center text-white">
      <div className="w-3/4 h-[300px] flex justify-center items-center bg-gray-500 my-5 flex-row rounded-xl">
        <div className="w-1/2 h-full flex flex-col justify-center items-center">
          <Image src={cocktail?.strDrinkThumb} height="250" width="175" />
          <p>{cocktail?.strDrink}</p>
          <p>{cocktail?.strAlcoholic} Drink</p>
        </div>
        <div className="w-1/2 h-full flex flex-col justify-center space-y-20">
          <div>
            <p className="underline">Description:</p>
            <p>{cocktailInfo?.descriptions?.en?.value}</p>
          </div>
          <div>
            <p className="underline">Instructions:</p>
            <p>{cocktail?.strInstructions}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-500 w-3/4 flex justify-center">
        <div className="w-full grid grid-cols-3 gap-8 justify-items-center">
          <div className="bg-red-400 w-1/3">
            <p>Instance of:</p>
            <p>{instanceOf}</p>
          </div>
          <div className="bg-red-400 w-1/3">
            <p>Subclass of:</p>
            <p>{subclassOf}</p>
          </div>
          <div className="bg-red-400 w-1/3">
            <p>Instance of:</p>
          </div>
          <div className="bg-red-400 w-1/3">
            <p>Instance of:</p>
          </div>
        </div>
      </div>
    </div>
  );
}
