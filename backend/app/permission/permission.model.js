const mongoose = require('mongoose');
const { toJSON, paginate } = require("../../utils/mongoose");
const { scope, actionTypes, resourceTypes } = require('../../config/enums');
const permissionSchema = new mongoose.Schema(
  {
    resource: { type: String, required: true, trim: true, enums: { ...Object.values(resourceTypes) } },
    action: { type: String, required: true, trim: true, enums: { ...Object.values(actionTypes) } },
    scope: { type: String, required: true, trim: true, default: scope.SELF, enums: { ...Object.values(scope) } }, // 'any', 'own', 'team'
    name: { type: String, required: true, unique: true }, // e.g., 'users:update:own'
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

// Before saving, construct the name
permissionSchema.pre('validate', function (next) {
  if (this.isModified('resource') || this.isModified('action') || this.isModified('scope')) {
    this.name = `${this.resource}:${this.action}:${this.scope}`;
  }
  next();
});

// // Create a virtual property `name` for easier use (e.g., 'users:create')
// permissionSchema.virtual('name').get(function () {
//   return `${this.resource}:${this.action}`;
// });
permissionSchema.plugin(toJSON);
permissionSchema.plugin(paginate);
// Ensure that each resource-action pair is unique
permissionSchema.index({ name: 1, resource: 1, action: 1 }, { unique: true });

const Permission = mongoose.model('Permission', permissionSchema);

module.exports = Permission;