import Head from "next/head";
import Image from "next/image";
import Router from "next/router";
import { useState, useEffect } from "react";
import fetch from "node-fetch";
import axios from "axios";

const ListInfoWiki = ({ cocktail }) => {
  const [instanceOf, setInstanceOf] = useState(undefined);

  useEffect(() => {
    const getAllProperties = async () => {
      console.log(cocktail);
      // let res2 = await axios.post("http://localhost:3001/wikidata/info", {ids: claims["31"]});
      //   setInstanceOf()
    };
    getAllProperties();
  });
  return (
    <div className="bg-gray-500 w-3/4 flex justify-center">
      <div className="w-full grid grid-cols-3 gap-8 justify-items-center">
        <div className="bg-red-400 w-1/5">
          <p>Instance of:</p>
        </div>
        <div className="bg-red-400 w-1/5">
          <p>Instance of:</p>
        </div>
        <div className="bg-red-400 w-1/5">
          <p>Instance of:</p>
        </div>
        <div className="bg-red-400 w-1/5">
          <p>Instance of:</p>
        </div>
      </div>
    </div>
  );
};

export default ListInfoWiki;
