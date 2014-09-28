/*jslint indent:2, node:true, nomen:true */
/*globals describe, it, beforeEach, afterEach */
"use strict";

var parseFilename = require("../");
var assert = require("assert");


var tests = [];

tests.push({ orginal: "Grey's Anatomy - S02E25 - 17 Seconds.avi", SeriesName: "Grey's Anatomy",
  episode: 25, lastEpisode: 25, season: 2 });


describe("lots of tests", function () {
  tests.forEach(function (show) {
    it(show.orginal, function (done) {
      var result = parseFilename(show.orginal);
      assert.strictEqual(result.SeriesName, show.SeriesName);
      assert.strictEqual(result.season, show.season);
      assert.strictEqual(result.episode, show.episode);
      assert.strictEqual(result.lastEpisode, show.lastEpisode);
      done();
    });
  });
});
