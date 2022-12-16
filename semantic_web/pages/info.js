import Image from "next/image";
import logo from '../public/logo.png'
import Router from "next/router";
import { useState, useEffect } from "react";
import fetch from "node-fetch";
import axios from "axios";
const WBK = require("wikibase-sdk");
const wbk = WBK({
  instance: "https://www.wikidata.org",
  sparqlEndpoint: "https://query.my-wikibase-instan.se/sparql", // Required to use `sparqlQuery` and `getReverseClaims` functions, optional otherwise
});

function capitalizeFirstLetter(string) { return string[0] && string[0].toUpperCase() + string.slice(1);}

export default function Info() {
  const router = Router;
  const [data, setData] = useState(undefined);
  useEffect(() => {
    const getInfoCocktail = async () => {
      // console.log(router?.query?.name);
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
          // console.log(entities);
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
      let res = await axios.get(
        "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + router?.query?.name.toString().toLowerCase()
      );
      console.log(res);
      console.log("~~~~~~~~~~~~");
      setData(res);
    };
    getInfoCocktail();
  }, []);

  // function drawQuantity(measure) {
  //   return item["strMeasure" + i] != undefined ? capitalizeFirstLetter(item["strMeasure" + i].trim())
  // }
  const getIngredients = (item) => {
    let ingredients = [];
    for (let i = 1; i <= 15 && item["strIngredient" + i] != null; i++)
      ingredients.push({"name": item["strIngredient" + i], "quantity": item["strMeasure" + i] != undefined ? capitalizeFirstLetter(item["strMeasure" + i].trim()) : "unspecified"});
    return ingredients;
  };

  return (
    <div className="h-full min-h-screen w-full" style={{backgroundColor: "#FEE369"}}>
      <div className="w-full items-center flex flex-col">
        <center><Image src={logo} alt="wimc logo" style={{marginTop: "1rem"}} /></center>
        {/* <hr style={{color: "#000000"}} /> */}
        <div className="w-9/10 h-9/10 justify-center items-center">
          <hr />
          {data != undefined &&
            data["data"]["drinks"]?.map((item, _idx) => {
              return (
                <>
                  <h1 style={{fontWeight: "bold", fontSize: "36px"}}>{item["strDrink"]}</h1>
                  <h2 style={{fontWeight: "bold", fontSize: "20px", marginTop: "5px"}}>Ingredients:</h2>
                  <div className="ingredients">
                    { getIngredients(item) != undefined &&
                      getIngredients(item)?.map((ingred, _idx) => {
                        return (
                            <p>{ingred["name"]} <i>({ingred["quantity"]})</i></p>
                        );
                      })
                    }
                  </div>
                  <hr />
                </>
              );
          })}
        </div>
      </div>
    </div>
  );
}
