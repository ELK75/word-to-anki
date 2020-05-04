import React, {useState, useEffect} from 'react';
import './Popup.css';

const Popup = () => {

  const [on, setOn] = useState(false);

  let classes = on ? "button on" : "button off";
  let state = on ? "On" : "Off"

  useEffect(() => {
    if (on) {
      console.log('here');
      chrome.browserAction.onClicked.addListener(function (tab) {
        chrome.tabs.executeScript(null, { file: '../Background/index.js' });
      });
    }
  }, [on])

  return (
    <div className="App">
      <button className={classes} onClick={() => setOn(!on)}>{state}</button>
    </div>
  );
};

export default Popup;
