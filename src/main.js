require("jquery-ui/button");
require("jquery-ui/dialog");
require("jquery-ui/menu");

const $ = require("jquery"),
  Examples = require("./examples"),
  H = require("./util/helper"),
  InfoView = require("./info-view"),
  QuiverEditor = require("./quiver-editor"),
  Silter = require("./sba/silter"),
  SpecialBiserialAlgebra = require("./sba/algebra");

const exampleMenu = $("#examples"),
  errorDialog = $("#error-dialog").dialog({
    autoOpen: false,
    dialogClass: "error-dialog",
    height: "auto",
    modal: true,
    position: { my: "center", at: "center", of: "#editor" },
    resizable: false,
    width: 380
  }),
  errorMessage = $("#error-message"),
  relationsTextArea = $("#relations");

const infoView = new InfoView(),
  quiverEditor = new QuiverEditor();

$.extend(quiverEditor.view.quiver, {
  vertexIdFunc: x => x + 1,
  arrowIdFunc: x => x < 26 ? String.fromCharCode(97 + x) : null
});

for (const key in Examples) {
  exampleMenu.append(
    $(`<li><div>${key}</div></li>`)
      .click(() => loadExample(key))
  );
}

$(() => {
  loadExample(H.randomKey(Examples));

  $("#quiver-editor");
  $("#article-list").load("./refs.html");

  $("#update")
    .click(update);

  $("#menu").menu();

  update();
});

function update() {
  try {
    const A = new SpecialBiserialAlgebra(quiverEditor.quiver, relationsTextArea.val());
    const S = new Silter(A, A, null);

    infoView.show(A, S);
    infoView.name = quiverEditor.name;
  }
  catch (e) {
    if (!e.userDefined)
      throw e;

    errorMessage.html(e.message);
    errorDialog.dialog({ title: "Update Failed", autoOpen: true });
  }
}

function loadExample(key) {
  quiverEditor.loadFromObject(Examples[key], key);
}
