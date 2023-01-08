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
  const [inceptionOf, setInceptionOf] = useState(undefined);
  const [basedOn, setBasedOn] = useState(undefined);
  const [countryOrigin, setCountryOrigin] = useState(undefined);
  const [communCategory, setCommunCategory] = useState(undefined);
  const [ingredientsQuantities, setIngredientsQuantities] = useState(undefined);

  useEffect(() => {
    const getInfoCocktail = async () => {
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
      let tmp = [];
      for (let index = 1; index <= 15; index++) {
        if (res?.data?.drinks[0]["strIngredient" + index])
          tmp.push([
            res?.data?.drinks[0]["strIngredient" + index],
            res?.data?.drinks[0]["strMeasure" + index],
          ]);
      }
      let finalInfo = [];
      tmp.forEach(async (element) => {
        // console.log(element);
        let data = await axios.get(
          "https://www.thecocktaildb.com/api/json/v1/1/search.php?i=" +
            element[0]
        );
        finalInfo.push([
          element[0],
          data?.data.ingredients[0].strAlcohol,
          element[1],
          data?.data.ingredients[0].strDescription,
        ]);
        // console.log(data);
      });
      setIngredientsQuantities(finalInfo);
    };
    getInfoCocktail();
  }, []);

  useEffect(() => {
    const getInfoEntities = async () => {
      // console.log(router?.query?.name);
      console.log(cocktailInfo);
      const instanceId = cocktailInfo?.claims["P31"]
        ? cocktailInfo?.claims["P31"][0].mainsnak.datavalue.value.id
        : "";
      const subclassId = cocktailInfo?.claims["P279"]
        ? cocktailInfo?.claims["P279"][0].mainsnak.datavalue.value.id
        : "";
      const inceptionTime = cocktailInfo?.claims["P571"]
        ? cocktailInfo?.claims["P571"][0].mainsnak.datavalue.value.time
        : "";
      const basedId = cocktailInfo?.claims["P144"]
        ? cocktailInfo?.claims["P144"][0].mainsnak.datavalue.value.id
        : "";
      const countryId = cocktailInfo?.claims["P495"]
        ? cocktailInfo?.claims["P495"][0].mainsnak.datavalue.value.id
        : "";
      const commun = cocktailInfo?.claims["P373"]
        ? cocktailInfo?.claims["P373"][0].mainsnak.datavalue.value
        : "";

      const instance = await fetch("api/hello?params=" + instanceId);
      const subclass = await fetch("api/hello?params=" + subclassId);
      const based = await fetch("api/hello?params=" + basedId);
      const country = await fetch("api/hello?params=" + countryId);

      const data1 = await instance.json();
      const data2 = await subclass.json();
      const data3 = await based.json();
      const data4 = await country.json();
      setInstanceOf(
        instanceId ? data1?.entities[instanceId].labels.en.value : "-"
      );
      setSubclassOf(
        subclassId ? data2?.entities[subclassId].labels.en.value : "-"
      );
      setInceptionOf(inceptionTime ? inceptionTime.slice(1, 5) : "-");
      setBasedOn(basedId ? data3?.entities[basedId].labels.en.value : "-");
      setCountryOrigin(
        countryId ? data4?.entities[countryId].labels.en.value : "-"
      );
      setCommunCategory(commun ? commun : "-");
    };
    getInfoEntities();
  }, [cocktailInfo]);

  return (
    <div className="bg-slate-800 h-auto min-h-screen w-full flex justify-start flex-col items-center text-white">
      <div className="w-3/4 h-[300px] flex justify-center items-center bg-gray-500 my-5 flex-row rounded-xl">
        <div className="w-1/2 h-full flex flex-col justify-center items-center">
          <Image src={cocktail?.strDrinkThumb} height="200" width="200" />
          <p style={{fontWeight: "700", fontSize: "24px"}}>{cocktail?.strDrink}</p>
          <p>{cocktail?.strAlcoholic} drink</p>
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

      <div className="w-3/4 flex justify-center flex-col">
        <div className="w-full grid grid-cols-3 gap-8 justify-items-center">
          <div className="bg-gray-500 w-1/2 flex justify-center items-center flex-col h-[75px] rounded-xl">
            <p className="text-lg underline">Instance of</p>
            <p>{instanceOf}</p>
          </div>
          <div className="bg-gray-500 w-1/2 flex justify-center items-center flex-col h-[75px] rounded-xl">
            <p className="text-lg underline">Subclass of</p>
            <p>{subclassOf}</p>
          </div>
          <div className="bg-gray-500 w-1/2 flex justify-center items-center flex-col h-[75px] rounded-xl">
            <p className="text-lg underline">Date of inception</p>
            <p>{inceptionOf}</p>
          </div>
          <div className="bg-gray-500 w-1/2 flex justify-center items-center flex-col h-[75px] rounded-xl">
            <p className="text-lg underline">Based on</p>
            <p>{basedOn}</p>
          </div>
          <div className="bg-gray-500 w-1/2 flex justify-center items-center flex-col h-[75px] rounded-xl">
            <p className="text-lg underline">Region of origin</p>
            <center><p>{countryOrigin}</p></center>
          </div>
          <div className="bg-gray-500 w-1/2 flex justify-center items-center flex-col h-[75px] rounded-xl">
            <p className="text-lg underline">Common category</p>
            <p>{communCategory}</p>
          </div>
        </div>
        <table id="collectionTable" className="w-full leading-normal my-10">
          <thead id="headTable" className="text-center rounded-lg">
            <tr className="uppercase">
              <th className="px-5 py-5 border-b-2 border-gray-200 bg-gray-500 text-xs font-semibold text-white uppercase tracking-wider">
                Name
              </th>
              <th className="px-5 py-5 border-b-2 border-gray-200 bg-gray-500 text-xs font-semibold text-white uppercase tracking-wider">
                Alcoholic or not
              </th>
              <th className="px-5 py-5 border-b-2 border-gray-200 bg-gray-500 text-xs font-semibold text-white uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-5 py-5 border-b-2 border-gray-200 bg-gray-500 text-xs font-semibold text-white uppercase tracking-wider">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {ingredientsQuantities &&
              ingredientsQuantities.map((item) => (
                <tr>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {item[0]}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {item[1]}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {item[2] ? item[2] : "No quantity"}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {item[3] ? item[3] : "No description"}
                    </p>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
