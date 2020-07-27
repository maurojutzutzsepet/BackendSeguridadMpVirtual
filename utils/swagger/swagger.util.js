const fs = require("fs");

function saveJSON(json_file) {
  //create if not exist folder
  if (!fs.existsSync("./swagger")) fs.mkdirSync(`./swagger`);

  fs.writeFileSync("./swagger/swagger.json", json_file, "utf8", function(err) {
    if (err)
      return reject("An error occured while writing JSON Object to File.");
    console.log("Swagger File Generated!");
    resolve(true);
  });
}

module.exports.saveJSON = saveJSON;