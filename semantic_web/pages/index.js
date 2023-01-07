import Image from "next/image";
import logo from '../public/logo.png'
import Router from "next/router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
const WBK = require("wikibase-sdk");
const wbk = WBK({
  instance: "https://www.wikidata.org",
  sparqlEndpoint: "https://query.my-wikibase-instan.se/sparql", // Required to use `sparqlQuery` and `getReverseClaims` functions, optional otherwise
});

export default function Home() {
  const router = Router;
  const [search, setSearch] = useState("");
  const notifyError = (props) => toast.error(props);
  const [cocktailSearch, setCocktailSearch] = useState();

  useEffect(() => {
    const getRandomDrinks = async () => {
      let tmp = [];
      for (let index = 0; index < 8; index++) {
        let randomDrinks = await axios.get("https://www.thecocktaildb.com/api/json/v1/1/random.php");
        tmp.push(randomDrinks?.data);
      }
      setCocktailSearch(tmp);
      console.log(tmp);
    };
    getRandomDrinks();
  }, []);

  const searchWiki = async (e, s = "") => {
    if (e.key == "Enter" || e.keycode == 13 || s != "") {
      let res = await axios.get("https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + search);
      if (res.data.drinks)
        router.push({ pathname: "/info", query: { name: search } });
      else
        notifyError("This cocktail does not exist");
    }
    // const url = wbk.cirrusSearchPages({ search: "mojito" });
    // fetch(url)
    //   .then((res) => res.json())
    //   .then(wbk.parse.wb.pagesTitles)
    //   .then((titles) => {
    //     // If you where searching in an entity namespace, which is the default namespace on Wikibase instances,
    //     // those titles are either entities ids (ex: Q1) or prefixed entities ids (ex: Item:Q1)
    //     // In the first case, we can just do
    //     const ids = titles;
    //     // In the second case, to get the ids, we need to drop the prefix
    //     // const ids = titles.map((title) => title.split(":")[1]);
    //     // From there, to get the full entities data, you could do
    //     const entitiesUrl = wbk.getEntities({ ids });
    //     return fetch(entitiesUrl);
    //   })
    //   .then((res) => res.json())
    //   // .then(wbk.parse.wb.entities)
    //   .then((entities) => {
    //     console.log(entities);
    //   })
    //   .catch((error) => console.log("error", error));
    // var myHeaders = new Headers();
    // myHeaders.append("Content-Type", "text/plain");
    // myHeaders.append(
    //   "Cookie",
    //   "GeoIP=SE:F:J__nk__ping:57.80:14.14:v4; WMF-Last-Access-Global=13-Dec-2022; WMF-Last-Access=13-Dec-2022"
    // );
    // var requestOptions = {
    //   method: "GET",
    //   headers: myHeaders,
    //   // body: raw,
    //   redirect: "follow",
    // };
    // fetch(
    //   "https://www.wikidata.org/w/api.php?action=wbgetentities&props=labels&ids=Q2536409&languages=en",
    //   requestOptions
    // )
    //   .then((response) => response.text())
    //   .then((result) => console.log(result))
    //   .catch((error) => console.log("error", error));
    // let test = await axios.get(
    //   "https://www.thecocktaildb.com/api/json/v1/1/search.php?f=f"
    // );
    // console.log(test);
  };

  return (
    <div className="h-full w-full relative min-h-screen bg-gray-600">
      <div className="h-full min-h-screen w-full flex flex-col">
        <div className="w-full flex flex-col items-center">
          <Image src={logo} alt="wimc logo" style={{marginTop: "1rem"}} />
          {/* <hr style={{color: "#000000"}} /> */}
          <div className="w-2/3 flex justify-center items-center mt-10 text-4xl font-bold ">
            <input
              type="text" placeholder="Search a cocktail" value={search}
              className="w-full rounded-xl text-center" style={{height: "48px"}}
              onChange={(e) => setSearch(e.target.value)} onKeyUp={(e) => searchWiki(e)}
            />
          </div>
          <div className="w-9/10 h-[550px] flex justify-center items-center my-10">
            <div className="grid grid-cols-4 mt-10 gap-8 justify-around">
              {cocktailSearch &&
                cocktailSearch?.map((search, index) => {
                  return (
                    <motion.div
                      key={index}
                      className="w-48 h-[275px] bg-slate-800 p-2 rounded-lg mx-auto cursor-pointer"
                      whileHover={{
                        scale: 1.05,
                      }}
                      onClick={() => {
                        // setModalMovie(search);
                        // openModal();
                        setSearch(search?.drinks[0].strDrink);
                        // searchWiki(0, "Clicked");
                      }}
                    >
                      <div className="h-[200px] w-full flex justify-center">
                        <Image
                          src={search?.drinks[0].strDrinkThumb}
                          height="350"
                          width="175"
                          // onClick={() => searchWiki({key: "Enter"})}
                        />
                      </div>
                      <div className="h-[64px] w-full flex flex-col justify-around items-center text-white text-center ">
                        <div className="flex flex-col justify-center items-center">
                          <p>{search?.drinks[0].strDrink}</p>
                          <p style={{fontSize: 12}}>- {search?.drinks[0].strAlcoholic} -</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" pauseOnFocusLoss={false} />
    </div>
  );
}
