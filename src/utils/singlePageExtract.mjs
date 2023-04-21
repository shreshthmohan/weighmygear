// Extract information from a single product page
import { fetchOptions } from "../constants.mjs";

import * as cheerio from "cheerio";

export const singlePageExtract = async (url) => {
  try {
    const response = await fetch(url, fetchOptions);

    // Get the HTML code of the webpage
    const html = await response.text();
    const $ = cheerio.load(html);

    const productData = {};

    const breadCrumbsSelector = 'nav[aria-label="breadcrumbs"] > ol > li > a';

    // console.log($(breadCrumbsSelector));

    const breadcrumbsSelection = $(breadCrumbsSelector);

    const bArr = Array.from(breadcrumbsSelection);

    const breadcrumbs = [];
    bArr.forEach((b) => {
      const bc = cheerio.load(b);

      const crumbText = bc.text();
      if (crumbText) {
        breadcrumbs.push(crumbText);
      }
    });

    productData.url = url;

    productData.breadcrumbs = breadcrumbs;

    productData.title = $("#product-page-title").text();

    productData.brand = $("#product-brand-link").text();

    productData.price = $("#buy-box-price").text();

    const rows = $(".tech-specs__row");

    const rowsArr = Array.from(rows);

    rowsArr.forEach((r) => {
      const x = cheerio.load(r);

      const xText = x(".tech-specs__header").text();

      const xValue = x(".tech-specs__cell .tech-specs__value");

      const xValueArr = Array.from(xValue);

      const xValueArrText = xValueArr.map((xv) => {
        const xvl = cheerio.load(xv);
        const xvlText = xvl.text();

        return xvlText;
      });

      productData[xText] = xValueArrText;
    });

    // console.log(productData);
    return productData;
  } catch (error) {
    console.log("error in ", url, error);
  }
};
