/*jslint node:true, indent:2, regexp:true, nomen:true, todo: true */
"use strict";

var path = require("path");
var debug = require('debug')('episode-parser');
var titleCase = require("to-title-case");

// filename: string
// options: object
function parseFilename(filename, options) {
  debug("parsing %s", filename);
  //TODO: add multi-episode parsing
  // ShowName.sXXeAA-CC
  // ShowName.sXXeAA-eCC
  // ShowName.sXXeAABBCC
  // ShowName...XX...AA-CC
  // ShowName.sXXeAAeBBeC
  var ext = path.extname(filename).toLowerCase(),
  // the following regex should match:
  //   Community S01E04.mp4
  //   Community s01e04.mp4
  //   Community 1x04.mp4
  //   Community 1-04.mp4
    re = /(.*)\D(\d{1,2})[ex\-](\d{1,2})/i,
    searchResults = filename.match(re),
    show,
    season,
    episode,
    offset,
    episodeObject = {},
    originalFilename = filename;
  filename = path.basename(filename);
  if (options === undefined) {
    options = {};
  }

  offset = options.offset || 0;
  if (searchResults === null) {
    debug("trying search (showname) Season (s#) Episode (e#)");
    // this regex should match:
    //   Community Season 1 Episode 4.mp4
    // (case insensitive)
    re = /(.*)Season.*?(\d{1,2}).*Episode\D*?(\d{1,2})/i;
    searchResults = filename.match(re);
    if (searchResults !== null) { debug("Success"); }
  }

  if (searchResults === null) {
    debug("trying search (showname)...(s#)...(e#)");
    // this regex should match:
    //   Community...1...4.mp4
    re = /(.*)\.+(\d{1,2})\.+(\d{1,2})/;
    searchResults = filename.match(re);
    if (searchResults !== null) { debug("Success"); }
  }

  if (searchResults === null) {
    debug("trying search (showname) (s#e##)");
    // this regex should match:
    //   Community 104.mp4
    re = /(.*)\D(\d)(\d\d)\D/;
    searchResults = filename.match(re);
    if (searchResults !== null) { debug("Success"); }
  }


  if (searchResults === null && options.season) {
    debug("trying search (showname) (e##) - if season specified");
    // this regex should match:
    //   Community 04.mp4
    // but only if we've specified a season with season flag
    re = /(.*)\D(\d+)\D/;
    searchResults = filename.match(re);
    if (searchResults !== null) { debug("Success"); }
  }

  if (searchResults === null && options.season && options.show) {
    debug("trying search (e##) - if season specified and show specified");
    // this regex should match:
    //   04.mp4
    // but only if we've specified a season and show with flags
    re = /(\d+)\D/;
    searchResults = filename.match(re);
    if (searchResults !== null) { debug("Success"); }
  }

  try {
    show = options.show || searchResults[1];
  } catch (e) {
    debug("failed to parse: %s", filename);
    return null;
  }
  show = titleCase(show
      // remove hanging characters
      .replace(/^[\-.\s]+|[\-.\s]+$/g, "")
      .trim());

  if (options.episode) {
    episode = options.episode + offset;
    if (searchResults !== null) {
      searchResults.pop();
    }
  } else {
    try {
      episode = Number(searchResults.pop()) + offset;
    } catch (e) {
      debug("failed to parse: %s", filename);
      return null;
    }
  }

  season = options.season || Number(searchResults.pop());
  //TODO: extract quality https://github.com/echel0n/SickRage/wiki/Quality-Settings
  episodeObject = {
    originalFilename: originalFilename,
    show: show,
    season: season,
    episode: episode,
    extension: ext
  };
  return episodeObject;
}

module.exports =  parseFilename;
