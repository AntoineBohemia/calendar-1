// Importation des fonctions pour manipuler les dates depuis le module "dates".
import { getExactDate, addMonths, getMonth, getYear } from "./dates";
// Importation de l'objet i18n pour l'internationalisation depuis le module "i18n".
import { i18n } from "./i18n";
// Importation de l'état global de l'application depuis le module "state".
import { state } from "./state";

// Définition du modèle HTML pour l'en-tête du calendrier, incluant des boutons pour la navigation et le choix de la vue (jour, semaine, mois).
const template = `
<div id="calendar">
  <header class="main">
    <div class="button"><label>Today</label></div>
    <button>4 personnes</button>

    <nav>
      <button data-dir="prev">←</button>
      <h2>August 2022</h2>
      <button data-dir="next">→</button>
    </nav>

    <div class="nav02">
    <button data-dir="day">Jour</button>
    <button data-dir="week">Semaine</button>
    <button data-dir="month">Mois</button>
    </div>
  </header>
</div>
`;

// Fonction pour initialiser l'en-tête du calendrier.
export function initHeader() {
  // Insère le modèle HTML de l'en-tête du calendrier dans l'élément spécifié par 'state.$element'.
  state.$element.insertAdjacentHTML("beforeend", template);

  // Sélectionne l'élément 'header' avec la classe 'main' et ajoute un écouteur d'événements pour gérer les clics sur celui-ci.
  const header = document.querySelector("header.main");
  header.addEventListener("click", (ev) => {
    const { target } = ev; // L'élément qui a été cliqué.

    // Gère les clics sur les boutons.
    switch (target.tagName) {
      case "BUTTON":
        {
          // Vérifie si le bouton cliqué est dans la navigation ('nav') ou non.
          const parent = target.parentElement;
          parent.tagName === "NAV" ? onNavClick(target) : onTodayClick();
        }
        break;
    }
  });

  // Sélectionne l'élément 'h2' pour mettre à jour le mois et l'année affichés dans l'en-tête du calendrier.
  const label = header.querySelector("h2");
  // S'abonne aux changements de date sur l'objet 'calendar' dans 'state' et met à jour le mois et l'année dans le label.
  state.calendar.onDateChange$.subscribe((date) => {
    const month = getMonth(date); // Obtient le mois de la date.
    const year = getYear(date); // Obtient l'année de la date.
    // Met à jour le label avec le mois (traduit via i18n) et l'année.
    label.innerHTML = `${i18n["month-" + month]} ${year}`;
  });
}

// Fonction appelée lors du clic sur un bouton qui n'est pas dans la navigation (par exemple, pour sélectionner la date d'aujourd'hui).
function onTodayClick() {
  // Définit la date du calendrier sur la date actuelle.
  state.calendar.setDate(getExactDate());
}

// Fonction appelée lors du clic sur un bouton de navigation (précédent ou suivant).
function onNavClick(target) {
  // Obtient la direction à partir de l'attribut 'data-dir' du bouton ('prev' pour précédent, sinon suivant).
  const direction = target.getAttribute("data-dir");
  // Calcule la nouvelle date en ajoutant ou soustrayant un mois à la date actuelle du calendrier.
  const next = addMonths(state.calendar.date, direction === "prev" ? -1 : 1);
  // Met à jour la date du calendrier avec la nouvelle date calculée.
  state.calendar.setDate(next);
}
