const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { toJSON, paginate } = require("../../utils/mongoose");

// Creation of schema
const testSchema = new Schema({
  test1: String,
  test2: String
},
  // will add createdAt and updateAt on every new record
  { timestamps: true }
)

// Inject plugin in schema
testSchema.plugin(toJSON);
testSchema.plugin(paginate);

const Test = mongoose.model("Test", testSchema);

module.exports = Test