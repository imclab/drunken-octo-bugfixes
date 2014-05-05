/**
 * Polls for a issue commends, checks if it changed.
 *
 *
 * Note: Most of this stuff is probably done by Angular, but I don't know it,
 * and using Backbone requires writing way too much boilerplate.
 */


// On page loaded...
$(function () {
  var repo = 'drunken-octo-bugfixes',
      owner = 'eddieantonio',
      POLLING_INTERVAL = 5000, // in milliseconds.
      RESOURCE_URL = 'https://api.github.com/repos/' + owner + '/' + repo + '/issues';


  var Issue = Backbone.Model.extend({});

  // Only need one collection for this demo; no sense extending Collection.
  var issueCollection = new Backbone.Collection({
    model: Issue,
    comparator: 'id',
  });

  issueCollection.url = RESOURCE_URL;

  /* Keep track of how many times we failed to fetch the resource. */
  var errorTolerance = 3;

  function schedule() {
    setTimeout(fetch, POLLING_INTERVAL);
  }

  function fetch() {
    issueCollection.fetch({

      success: function () {
        rerender();
        schedule();
      },

      error: function () {
        errorTolerance -= 1;
        if (errorTolerance) {
          schedule();
        } else {
          alert("Could not fetch collection (tried 3 times).");
        }
      }
    });
  }

  /* Completely rerenders the collection. */
  function rerender() {
    console.log(issueCollection);
    $('#container')
      // Ugh... the proper way to do this is with a view listening on model
      // change events.
      .text(JSON.stringify(issueCollection.toJSON(), null, 2));
  }

  /* The initial fetch. */
  fetch();

});
