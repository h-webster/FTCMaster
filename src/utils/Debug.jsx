export function Debug(msg) {
   let debugging = true;
   if (debugging) {
    console.log(msg);
   }
}

export function Debug_Data(msg, code) {
    let debugging = true;
    if (debugging) {
        console.log(msg);
        console.log("Debug Code: " + code);
    }
}