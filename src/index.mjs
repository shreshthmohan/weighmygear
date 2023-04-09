import * as cheerio from "cheerio";
import { singlePageExtract } from "./utils/singlePageExtract.mjs";
import { fetchOptions } from "./constants.mjs";

import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// singlePageExtract(
//   "https://www.rei.com/rei-garage/product/174077/mountainsmith-lookout-40-pack"
// ).then(data => {
//   console.log(data)
// });

// get all single product links in page

const alreadyCrawled = new Set();
const productURLs = new Set();

const extractSingleProductLinksFromPage = async (url) => {
  if (alreadyCrawled.has(url)) {
    return;
  }

  const URLObject = new URL(url);
  const origin = URLObject.origin;

  const response = await fetch(url, fetchOptions);

  const html = await response.text();

  // console.log(html);

  const $ = cheerio.load(html);

  const productURLsSeclector = $("div#search-results > ul > li > a");

  // const productURLs = new Set();

  // const productData = singlePageExtract();
  // if (productData) {
  //   const __filename = fileURLToPath(import.meta.url);
  //   const __dirname = path.dirname(__filename);

  //   fs.writeFileSync(
  //     path.normalize(`${__dirname}/../data/productInfo.json`),
  //     JSON.stringify(productData),
  //     { flag: "a" }
  //   );
  // }

  productURLsSeclector.each(function (i, elem) {
    const href = $(this).attr("href");

    // TODO: check if href is full URL or only pathname
    const fullProductURL = `${origin}${href}`;

    // console.log(fullProductURL);
    productURLs.add(fullProductURL);
  });

  alreadyCrawled.add(url);

  const newURLs = new Set();

  const newURLsSelector = $("nav a");

  newURLsSelector.each(function (i, elem) {
    const href = $(this).attr("href");
    newURLs.add(`${origin}${href}`);
  });

  console.log("new urls:", newURLs.size);

  // return Array.from(productURLs);
};

const backpacksURL = "https://www.rei.com/c/backpacking-packs";

await extractSingleProductLinksFromPage(backpacksURL);

const productPromises = [];

productURLs.forEach((purl) => {
  const productPromise = singlePageExtract(purl);

  productPromises.push(productPromise);
});

const allData = await Promise.allSettled(productPromises);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const writeFilePath = path.normalize(`${__dirname}/../data/productInfo.json`);
//   fs.writeFileSync(
//     JSON.stringify(productData),
//     { flag: "a" }
//   );
// }

allData.forEach((pd) => {
  if (pd.value) {
    fs.writeFileSync(writeFilePath, JSON.stringify(pd) + "\n", { flag: "a" });
  }
});
