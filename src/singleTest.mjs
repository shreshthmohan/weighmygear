import { singlePageExtract } from "./utils/singlePageExtract.mjs";

const data = await singlePageExtract(
  // "https://www.rei.com/product/145655/gregory-wander-70-pack-kids"
  // "https://www.rei.com/rei-garage/product/174077/mountainsmith-lookout-40-pack"
  "https://www.rei.com/product/217409/rei-co-op-trailmade-60-pack-mens"
);

console.log(data);
