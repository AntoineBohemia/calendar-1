// Importation des fonctions pour manipuler les dates et des modules spécifiques pour afficher une modale d'événement et gérer l'état global.
import { getDay, getMonth, getYear, getDaysInMonth } from "./dates";
import { showEventModal } from "./event-modal";
import { state } from "./state";

// Définition du modèle HTML pour le corps principal du calendrier, incluant un conteneur pour les jours.
const template = `
  <section class="calendar" data-view="${state.calendar.view}">
    <div class="inner">
    </div>
  </section>
`;

// Fonction pour gérer les clics sur le calendrier, en particulier sur les cellules représentant les jours.
function onCalendarClick(ev) {
  // Vérifie si l'élément cliqué est une cellule du calendrier.
  if (ev.target.classList.contains("cell")) {
    const date = ev.target.getAttribute("data-date");
    // Affiche la modale pour ajouter un événement à la date cliquée.
    showEventModal(date, (value) => {
      // Ajoute l'événement à l'état global si ce n'est pas déjà fait.
      if (!state.events.hasOwnProperty(date)) {
        state.events[date] = [];
      }
      state.events[date].push(value);
      // Met à jour l'affichage pour refléter le nouvel événement.
      updateView();
    });
  }
}

// Fonction pour initialiser le calendrier.
export function initCalendar() {
  // Insère le modèle HTML du calendrier dans l'élément spécifié par 'state.$element'.
  state.$element.insertAdjacentHTML("beforeend", template);
  // Enregistre le conteneur du calendrier dans l'état global.
  state.calendar.$element = state.$element.querySelector("section.calendar");
  // Met à jour l'affichage du calendrier.
  updateView();

  // Ajoute un écouteur d'événements pour gérer les clics sur le calendrier.
  state.calendar.$element.addEventListener("click", onCalendarClick);

  // Définit une méthode pour mettre à jour la date sélectionnée dans le calendrier et rafraîchir l'affichage.
  state.calendar.setDate = (date) => {
    state.calendar.date = date;
    updateView();
  };
}

// Fonction pour mettre à jour l'affichage du calendrier en fonction de la date sélectionnée.
function updateView() {
  const { date } = state.calendar;

  // Obtient la date actuelle et la date sélectionnée pour le calendrier.
  const cYear = getYear();
  const cMonth = getMonth();
  const cDay = getDay();
  const year = getYear(date);
  const month = getMonth(date);

  // Calcule le nombre de jours dans le mois sélectionné.
  const days = getDaysInMonth(year, month);
  let content = "";
  // Génère le contenu HTML pour chaque jour du mois.
  for (let day = 1; day <= days; day++) {
    content += `<div class="cell ${cYear === year && cMonth === month && cDay === day ? "act" : ""}" data-date="${year}-${month}-${day}"><label>${day}</label>`;
    // Ajoute les événements existants pour chaque jour.
    const events = state.events[`${year}-${month}-${day}`];
    if (events) {
      content += `<ul>${events.map((it) => `<li class="ev">${it}</li>`).join("")}</ul>`;
    }
    content += `</div>`;
  }
  // Met à jour le contenu du calendrier avec les cellules générées.
  state.calendar.$element.querySelector(".inner").innerHTML = content;

  // Notifie les abonnés d'un changement de date.
  state.calendar.onDateChange$.publish(date);
}

// Variables pour gérer le déplacement des événements entre les jours du calendrier.
let isMoving = false;
let activeEvent = null;
let activeCell = null;

// Fonction pour configurer la fonctionnalité de glisser-déposer des événements entre les jours.
function setupDragDrop() {
  // Débute le déplacement d'un événement.
  window.addEventListener("mousedown", (ev) => {
    if (!ev.target.classList.contains("ev")) return;
    isMoving = true;
    activeEvent = ev.target;
    activeEvent.style.width = `${activeEvent.clientWidth}px`;
    activeEvent.classList.add("moving");
  });

  // Termine le déplacement d'un événement et le déplace vers une nouvelle date si nécessaire.
  window.addEventListener("mouseup", (ev) => {
    if (!isMoving) return;
    isMoving = false;
    activeEvent.classList.remove("moving");
    activeEvent.style.top = "";
    activeEvent.style.left = "";

    // Déplace l'événement vers la cellule active s'il y en a une.
    if (activeCell) {
      const event = activeEvent.innerText;
      const prevCell = activeEvent.parentNode.parentNode;
      const key = activeCell.getAttribute("data-date");
      const prevKey = prevCell.getAttribute("data-date");
      state.events[prevKey] = state.events[prevKey].filter((it) => it !== event);
      if (!state.events[key]) {
        state.events[key] = [];
      }
      state.events[key].push(event);
      updateView();
    }
  });

  // Suit le mouvement de l'événement pendant son déplacement.
  window.addEventListener("mousemove", (ev) => {
    if (!isMoving || !activeEvent) return;
    if (ev.target.classList.contains("cell")) {
      activeCell = ev.target;
    }
    activeEvent.style.top = `${ev.clientY}px`;
    activeEvent.style.left = `${ev.clientX}px`;
  });
}
