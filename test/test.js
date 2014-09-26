/*jslint indent:2, node:true, nomen:true */
/*globals describe, it, beforeEach, afterEach */
"use strict";

var parseFilename = require("../");
var assert = require("assert");

describe("parseFilename()", function () {
  it("should return object with show in title case", function (done) {
    var result = parseFilename("parks and recreation S01E04.mp4");
    assert.strictEqual(result.show, "Parks and Recreation");
    done();
  });
  it("should return object with show, season and episode numbers from filename in S##E## form", function (done) {
    var result = parseFilename("Community S01E04.mp4");
    assert.strictEqual(result.show, "Community", "show should be 'Community'");
    assert.strictEqual(result.season, 1, "season should be 1");
    assert.strictEqual(result.episode, 4, "episode should be 4");
    assert.strictEqual(result.extension, ".mp4", "extension should be '.mp4'");
    done();
  });
  it("should return object with show, season and episode numbers from filename in s##e## form", function (done) {
    var result = parseFilename("community s01e04.mp4");
    assert.strictEqual(result.show, "Community", "show should be 'Community'");
    assert.strictEqual(result.season, 1, "season should be 1");
    assert.strictEqual(result.episode, 4, "episode should be 4");
    assert.strictEqual(result.extension, ".mp4", "extension should be '.mp4'");
    done();
  });
  it("should return object with show, season and episode numbers from filename in #x## form", function (done) {
    var result = parseFilename("community 1x04.mp4");
    assert.strictEqual(result.show, "Community", "show should be 'Community'");
    assert.strictEqual(result.season, 1, "season should be 1");
    assert.strictEqual(result.episode, 4, "episode should be 4");
    assert.strictEqual(result.extension, ".mp4", "extension should be '.mp4'");
    done();
  });
  it("should return object with show, season and episode numbers from filename in #-## form", function (done) {
    var result = parseFilename("community 1-04.mp4");
    assert.strictEqual(result.show, "Community", "show should be 'Community'");
    assert.strictEqual(result.season, 1, "season should be 1");
    assert.strictEqual(result.episode, 4, "episode should be 4");
    assert.strictEqual(result.extension, ".mp4", "extension should be '.mp4'");
    done();
  });
  it("should return object with show, season and episode numbers from filename in 'Season # Episode ##' form", function (done) {
    var result = parseFilename("Community Season 1 Episode 14.mp4");
    assert.strictEqual(result.show, "Community", "show should be 'Community'");
    assert.strictEqual(result.season, 1, "season should be 1");
    assert.strictEqual(result.episode, 14, "episode should be 14");
    assert.strictEqual(result.extension, ".mp4", "extension should be '.mp4'");
    done();
  });
  it("should return object with show, season and episode numbers from filename in ### form", function (done) {
    var result = parseFilename("Community 104.mp4");
    assert.strictEqual(result.show, "Community", "show should be 'Community'");
    assert.strictEqual(result.season, 1, "season should be 1");
    assert.strictEqual(result.episode, 4, "episode should be 4");
    assert.strictEqual(result.extension, ".mp4", "extension should be '.mp4'");
    done();
  });
  it("should return object with show, season and episode numbers from filename seperated by dots", function (done) {
    var result = parseFilename("Parks.And.Recreation.S01E04.mp4");
    assert.strictEqual(result.show, "Parks and Recreation", "show should be 'Parks and Recreation'");
    assert.strictEqual(result.season, 1, "season should be 1");
    assert.strictEqual(result.episode, 4, "episode should be 4");
    assert.strictEqual(result.extension, ".mp4", "extension should be '.mp4'");
    done();
  });
  it("should return object with show, season and episode numbers even if there are numbers in the showname", function (done) {
    var result = parseFilename("30 Rock S01E04.mp4");
    assert.strictEqual(result.show, "30 Rock", "show should be '30 Rock'");
    assert.strictEqual(result.season, 1, "season should be 1");
    assert.strictEqual(result.episode, 4, "episode should be 4");
    assert.strictEqual(result.extension, ".mp4", "extension should be '.mp4'");
    done();
  });
  it("should return object with show, season and episode numbers from filename with lots of trailing info", function (done) {
    var result = parseFilename("Parks and Recreation S01E04.720p.HDTV.X264-DIMENSION.mp4");
    assert.strictEqual(result.show, "Parks and Recreation", "show should be 'Parks and Recreation'");
    assert.strictEqual(result.season, 1, "season should be 1");
    assert.strictEqual(result.episode, 4, "episode should be 4");
    assert.strictEqual(result.extension, ".mp4", "extension should be '.mp4'");
    done();
  });
  it("should return object with show, season and episode numbers from filename with trailing characters after showname", function (done) {
    var result = parseFilename("Parks and Recreation - S01E04.mp4");
    assert.strictEqual(result.show, "Parks and Recreation", "show should be 'Parks and Recreation'");
    assert.strictEqual(result.season, 1, "season should be 1");
    assert.strictEqual(result.episode, 4, "episode should be 4");
    assert.strictEqual(result.extension, ".mp4", "extension should be '.mp4'");
    done();
  });
  it("should return object with show, season and episode numbers from filename with trailing characters after showname", function (done) {
    var result = parseFilename("Parks and Recreation - S01E04.mp4");
    assert.strictEqual(result.show, "Parks and Recreation", "show should be 'Parks and Recreation'");
    assert.strictEqual(result.season, 1, "season should be 1");
    assert.strictEqual(result.episode, 4, "episode should be 4");
    assert.strictEqual(result.extension, ".mp4", "extension should be '.mp4'");
    done();
  });
  it("should return object with show, season and episode numbers from filename in the show...##...## form", function (done) {
    var result = parseFilename("Community...3...1.mp4");
    assert.strictEqual(result.show, "Community", "show should be 'Community'");
    assert.strictEqual(result.season, 3, "season should be 3");
    assert.strictEqual(result.episode, 1, "episode should be 1");
    assert.strictEqual(result.extension, ".mp4", "extension should be '.mp4'");
    done();
  });
  it("should return null when filename doesn't match any patterns", function (done) {
    var result = parseFilename("this-is-a-really-useless-file-dontcha-think");
    assert.strictEqual(result, null);
    done();
  });
});
