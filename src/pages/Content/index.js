var t = '';

async function gText() {
  t = (document.all) ? document.selection.createRange().text : document.getSelection();
  const text = t.toString();

  if (text.length > 0) {
    let json = await fetch(`http://localhost:9000/translate/${text}`);
    let data = await json.json();
    let translation = data.result;
    if (confirm(`Add Text: ${text} and Translation: ${translation} to Anki?`)) {
      fetch(`http://localhost:9000/add/${translation}/${text}`, { method: "POST" });
    }
  }
}

document.onmouseup = gText;
if (!document.all) document.captureEvents(Event.MOUSEUP);
