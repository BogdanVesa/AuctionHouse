const  db = require("../config/db");
const utils = require("../utils");

const getAllTags =  async (req,res) => {

    const tags =  await utils.getAllRows("tags",["TagID","name"]);
    res.status(200).json(tags);
}
module.exports= {getAllTags};