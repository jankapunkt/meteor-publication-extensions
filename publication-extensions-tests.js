// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by publication-extensions.js.
import { name as packageName } from "meteor/jkuester:publication-extensions";

// Write your tests here!
// Here is an example.
Tinytest.add('publication-extensions - example', function (test) {
  test.equal(packageName, "publication-extensions");
});
