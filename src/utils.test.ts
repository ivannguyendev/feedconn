import test from "ava";
import * as Utils from "./utils";

// test(`${flaword.FlawordOptions.name} default options`, (t) => {
//   let testOptions: flaword.FlawordOptions = {
//     blacklist: [],
//     whitelist: [],
//     isEmpty: false,
//   };
//   const options = new flaword.FlawordOptions();
//   t.is(options.blacklist.length, testOptions.blacklist.length);
//   t.is(options.whitelist.length, testOptions.whitelist.length);
//   t.is(options.isEmpty, testOptions.isEmpty);
// });

// test(`${flaword.Flaword.check.name} detect sleep syntax`, (t) => {
//   const flawCheck = flaword.Flaword.check({
//     fields: "_id",
//     populate: ";+sleep(3000);+var+x=",
//     filter: {},
//     sort: "-updatedAt",
//     skip: 0,
//     limit: 1,
//   });
//   t.is(flawCheck.isFlaw, true);
//   t.is(flawCheck.key, "populate");
// });

// test(`${flaword.Flaword.check.name} fresh request`, (t) => {
//   const flawCheck = flaword.Flaword.check({
//     fields: "_id",
//     populate: "",
//     filter: {},
//     sort: "-updatedAt",
//     skip: 0,
//     limit: 1,
//   });
//   t.is(flawCheck.isFlaw, false);
// });
