// models/role.model.js
const mongoose = require('mongoose');
const { toJSON, paginate } = require("../../utils/mongoose");
const autopopulate = require("mongoose-autopopulate");
const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission', autopopulate: { maxDepth: 1, select: { "resource": 1, "action": 1, "scope": 1, name: 1, id: 1 } },
      },
    ],
  },
  {
    timestamps: true,
  }
);
roleSchema.plugin(toJSON);
roleSchema.plugin(paginate);
roleSchema.plugin(autopopulate);
const Role = mongoose.model('Role', roleSchema);

module.exports = Role;