import Image from "next/image";
import logo from "../public/logo.png";
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
  const [allDrinks, setAllDrinks] = useState([]);
  const notifyError = (props) => toast.error(props);
  const [cocktailSearch, setCocktailSearch] = useState();

  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  useEffect(() => {
    const getAllDrinks = async () => {
      const tmp = [];
      for (let index = 0; index <= 26; index++) {
        let letter = String.fromCharCode(index + 65);
        let allDrinks = await axios.get(
          "https://www.thecocktaildb.com/api/json/v1/1/search.php?f=" + letter
        );
        allDrinks &&
          allDrinks?.data?.drinks?.forEach((element) => {
            tmp.push([element.strDrink.toLowerCase(), element.strDrink]);
          });
      }
      setAllDrinks(tmp);
    };

    const getRandomDrinks = async () => {
      let tmp = [];
      // let nb = getRandomArbitrary
      for (let index = 0; index < 8; index++) {
        let randomDrinks = await axios.get(
          "https://www.thecocktaildb.com/api/json/v1/1/random.php"
        );
        tmp.push(randomDrinks?.data?.drinks[0])
      }
      setCocktailSearch(tmp);
    };
    getAllDrinks();
    getRandomDrinks();
  }, []);

  const searchWiki = async (e) => {
    if (e.key == "Enter" || e.keycode == 13) {
      var idx = -1;
      allDrinks.forEach(function callback(value, index) {
        if (value[0] == search.toLowerCase()) idx = index;
      });
      if (idx != -1) {
        router.push({ pathname: "/info", query: { name: allDrinks[idx][1] } });
      } else {
        let res = await axios.get("https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=" + search)
        if (res.data.drinks != undefined) {
          setCocktailSearch(res.data.drinks);
        } else {
          notifyError("This cocktail or ingredient does not exist");
        }
      }
    }
  };
  return (
    <div className="h-full w-full relative min-h-screen text-black bg-gray-600">
      <div className="h-full min-h-screen w-full flex flex-col">
        <div className="w-full flex flex-col items-center">
          <Image src={logo} alt="wimc logo" style={{ marginTop: "1rem" }} />
          <hr style={{ color: "#000000" }} />
          <div className="w-2/3 flex justify-center items-center text-4xl font-bold" style={{marginTop: "8px"}}>
            <input
              type="text"
              placeholder="Search a cocktail"
              className="w-full rounded-xl text-center" style={{height: "48px"}}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyUp={(e) => searchWiki(e)}
            />
          </div>
          <div className="w-9/10 flex justify-center items-start my-10">
            <div className="grid grid-cols-4 justify-around" style={{gap: "16px 32px"}}>
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
                        // searchWiki()
                        router.push({
                          pathname: "/info",
                          query: { name: search?.strDrink },
                        });

                        // router.push(search?.drinks[0].strDrink);
                        // setModalMovie(search);
                        // openModal();
                        // setSearch(search?.drinks[0].strDrink);
                        // searchWiki(0, "Clicked");
                      }}
                    >
                      <div className="h-[200px] w-full flex justify-center">
                        <Image
                          src={search?.strDrinkThumb}
                          height="350"
                          width="175"
                          // quality="100"
                          // onClick={() => searchWiki({key: "Enter"})}
                        />
                      </div>
                      <div className="h-[64px] w-full flex flex-col justify-around items-center text-white text-center ">
                        <div className="flex flex-col justify-center items-center">
                          <p>{search?.strDrink}</p>
                          <p style={{ fontSize: 12 }}>
                            - {search?.strAlcoholic} -
                          </p>
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
