# Wanderlust - Copilot Instructions

This is an **Airbnb-like vacation rental listing platform** built with Express.js and MongoDB. 

## Architecture Overview

**Stack**: Node.js/Express (server) + EJS (templating) + MongoDB (database)

**Core Flow**: 
- `app.js` = main Express server with REST API routes (CRUD for listings & reviews)
- `models/` = MongoDB schemas (Listing has many Reviews via ObjectId references)
- `views/` = EJS templates organized by feature (listings, shared includes/layout)
- `schema.js` = Joi validation schemas (server-side form validation)
- `utils/` = Custom error handling and async wrapper utilities

**Data Model**:
- Listing: title, description, price, location, country, image URL, reviews[] (references)
- Review: comment, rating (1-5), createdAt timestamp

## Key Patterns & Conventions

**Error Handling**:
- Use `wrapAsync(fn)` utility to wrap async route handlers → auto-catches Promise rejections and passes to error middleware
- Throw `new ExpressError(statusCode, message)` for validation or domain errors
- Error middleware at bottom of `app.js` renders `error.ejs` template with status code & message

**Validation**:
- Joi schemas defined in `schema.js` with nested object structure (e.g., `listing: { title, description... }`)
- `validateListing` middleware runs on POST/PUT routes; extracts validation errors as formatted string
- Data arrives nested: `req.body.listing` (not `req.body` directly)

**Database**:
- MongoDB connection: `mongodb://127.0.0.1:27017/wanderlust` (local instance required)
- Mongoose models extend Schema with custom setters (e.g., image URL default if empty string)
- Reviews stored as ObjectId references in Listing.reviews array

**View Structure**:
- EJS-mate for layout system: `layouts/boilerplate.ejs` is parent template
- Partials in `includes/` (navbar, footer)
- Feature views in `listings/` (index, show, new, edit)
- Error page: generic `error.ejs`

## Common Tasks

**Add a New Listing Property**:
1. Update schema in `models/listing.js`
2. Add field to Joi schema in `schema.js` under `listing` object
3. Update `listings/new.ejs` and `listings/edit.ejs` forms
4. Update `listings/show.ejs` to display field

**Fix Route Errors**:
- Check if `wrapAsync()` wraps the route handler
- Verify error message format matches `new ExpressError(code, msg)`
- Ensure Joi validation middleware runs before handler on POST/PUT

**Review Feature Extends Listing**:
- Reviews are created separately but pushed to Listing.reviews array
- Always save both the Review document AND the updated Listing document
- Use `Listing.findById(id).populate('reviews')` to load full review objects (if needed later)

## Development

**Start Server**: `node app.js` (requires MongoDB running locally on port 27017)

**Database Seed**: See `init/` folder for sample data initialization scripts (if added later)

**Static Assets**: CSS/JS served from `public/` folder via Express.static middleware

**Port**: Server listens on 8080
