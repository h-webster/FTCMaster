import handler from "./api/event-extract.js"; // adjust path

// mock req/res objects
const req = {};
const res = {
  status: (code) => {
    console.log("Status:", code);
    return res;
  },
  json: (obj) => {
    console.log("JSON response:", JSON.stringify(obj, null, 2));
    return res;
  },
};

handler(req, res).then(() => {
  console.log("Test finished!");
});
