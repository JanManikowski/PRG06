// File: ./models/somemodel.js

// Require Mongoose
const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;

const SongsSchema = new Schema({
    title: String,
    artist: String,
    genre: String,
},{toJSON: {virtuals:true}});

// Add virtual property to Note, to include (dynamic) links
SongsSchema.virtual('_links').get(
    function (){
        return{
            self: {
                href: `${process.env.BASE_URI}songs/${this._id}`
            },
            collection: {
                href: `${process.env.BASE_URI}songs/`
            }
        }
    }
)
// Export function to create "SomeModel" model class
module.exports = mongoose.model("Song", SongsSchema);
