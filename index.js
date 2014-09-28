/*jslint node:true, indent:2, regexp:true, nomen:true, todo: true, bitwise: true */
"use strict";

var path = require("path");
var debug = require('debug')('episode-parser');
var titleCase = require("to-title-case");

var stopWords = ['season', 'mkv', 'mp4', 'avi', 'mpg', 'episode'];

function parseSeason(input) {
  var result = input.toLowerCase().match(/.*season.*?(\d{1,2})/);
  if (result) {
    return parseInt(result[1], 10);
  }
  return null;
}


// filename: string
// options: object
function parseFilename(filename) {
  debug("parsing %s", filename);

  var ext = path.extname(filename).toLowerCase(),
    originalFilename = filename,
    pathSplit = filename.split("/"),
    split,
    foundname = false,
    show = '',
    season,
    episode,
    lastEpisode,
    i,
    episodeObject;
  filename = path.basename(filename);
  split = filename.split(/[. \-]/);

  debug("split: %s", split);

  function setEpisode(number) {
    if (!episode) {
      episode = number;
      lastEpisode = number;
    } else if (Math.abs(episode - number) <= 4) {
      if (episode > number) {
        episode = number;
      } else if (lastEpisode < number) {
        lastEpisode = number;
      }
    }
  }

  function parse(piece) {
    if (!piece) { return; }

    piece = piece.toLowerCase();
    var number = parseInt(piece, 10),
      seasonString = '',
      j,
      c,
      epSplit = piece.split(/[e-e]/);
    if (stopWords.indexOf(piece) >= 0) {
      if (show) { foundname = true; }
      return;
    }

    if (/\dx\d/.test(piece)) {
      piece.split('x').forEach(parse);
      if (show) { foundname = true; }
      return;
    }
    if (/s\d/.test(piece)) {
      if (show) { foundname = true; }

      for (j = 1; j < piece.length; j += 1) {
        c = piece.charAt(j);
        if (c >= '0' && c <= '9') {
          seasonString += c;
        } else {
          break;
        }
      }
      season = parseInt(seasonString, 10);
      parse(piece.substr(j, piece.length));
    } else if (/e\d/.test(piece)) {
      if (show) { foundname = true; }
      for (j in epSplit) {
        if (epSplit.hasOwnProperty(j)) {
          setEpisode(parseInt(epSplit[j], 10));
        }
      }
    } else if (!isNaN(number) && show) {
      if (show) { foundname = true; }
      if (episode) {
        setEpisode(number);
      } else if (!season) {season = number;
        } else { setEpisode(number); }
    } else if (!foundname) {
      show += piece;
      show += " ";
    }
  }

  for (i in split) {
    if (split.hasOwnProperty(i)) {
      parse(split[i]);
    }
  }
  show = titleCase(show
      // remove hanging characters
      .replace(/^[\-.\s]+|[\-.\s]+$/g, "")
      .trim());

  if (season > 101) {
    lastEpisode = episode = season % 100;
    season = season / 100 | 0;
  }
  if (season && !episode) {
    setEpisode(season);
    season = null;
  }

  if (!season) {
    if (pathSplit.length >= 2) {
      season = parseSeason(pathSplit[pathSplit.length - 2]);
    }
  }

  if (!episode || !season) {
    return null;
  }

  episodeObject = {
    originalFilename: originalFilename,
    SeriesName: show,
    season: season,
    episode: episode,
    lastEpisode: lastEpisode,
    extension: ext
  };
  debug("result: %s", JSON.stringify(episodeObject));
  return episodeObject;
}


module.exports =  parseFilename;
