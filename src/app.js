import { initCalendar } from "./calendar";
import { initHeader } from "./header";
import { state } from "./state";

export function initApp(selector) {
  state.$element = document.querySelector(selector);
  initHeader();
  initCalendar();

  window.onbeforeunload = () => {
    window.localStorage.setItem("events", JSON.stringify(state.events));
  };
}
