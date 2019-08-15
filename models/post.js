const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');

const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: false
    },
    body: {
      type: String,
      required: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

postSchema.plugin(URLSlugs('title', { field: 'slug' }));
postSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Post', postSchema);
