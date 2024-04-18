// Importation de l'objet 'state' depuis le module 'state', utilisé pour accéder à l'état global de l'application.
import {state} from "./state";

// Définition d'un objet '$elements' pour stocker des références aux éléments DOM du modal.
const $elements = {
  modal: null, // Le conteneur principal du modal.
  header: null, // L'élément 'h3' qui affiche la date.
  input: null, // Le champ de saisie pour le nom de l'événement.
  saveBtn: null // Le bouton de sauvegarde.
}

// Objet 'scope' pour stocker la date courante et la fonction de rappel ('callback') spécifiée lors de l'affichage du modal.
let scope = {
  date: null,
  callback: null
}

// Modèle HTML pour le modal de création d'événement.
const template = `
  <section class="event-modal">
    <div class="cover" />
    <div class="content">
      <div class="data">
        <h3>Create event on <span></span></h3>
        <input placeholder="Event..." type="text" />
      </div>
      <footer>
        <button class="cancel">Cancel</button>
        <button class="primary">Save</button>
      </footer>
    </div>
  </section>
`;

// Fonction pour initialiser le modal en l'ajoutant au DOM et en configurant les gestionnaires d'événements.
export function initEventModal() {
  // Ajoute le modal à l'élément spécifié par 'state.$element'.
  state.$element.insertAdjacentHTML('beforeend', template);
  
  // Récupère et stocke les références aux éléments du modal dans '$elements'.
  $elements.modal = document.querySelector("section.event-modal");
  $elements.header = $elements.modal.querySelector("h3");
  $elements.input = $elements.modal.querySelector("input");

  // Ajoute des écouteurs d'événements pour les boutons 'Cancel' et 'Save', et pour la touche 'Enter' dans le champ de saisie.
  $elements.modal.querySelector(".cancel").addEventListener("click", hideEventModal);
  $elements.modal.querySelector(".primary").addEventListener("click", save);
  $elements.input.addEventListener("keyup", ev => {
    if (ev.key === "Enter") {
      save();
    }
  })
}

// Fonction pour afficher le modal, permettant à l'utilisateur de créer un nouvel événement pour une date donnée.
export function showEventModal(date, callback) {
  // Affiche la date dans l'en-tête du modal et rend le modal visible.
  $elements.header.querySelector("span").innerHTML = date;
  $elements.modal.style.display = "block";
  
  // Réinitialise le champ de saisie et place le focus dessus.
  $elements.input.value = "";
  $elements.input.focus();

  // Stocke la date et la fonction de rappel dans 'scope' pour une utilisation ultérieure.
  scope.date = date;
  scope.callback = callback;
}

// Fonction pour sauvegarder l'événement créé et fermer le modal.
export function save() {
  // Obtient la valeur du champ de saisie et, si elle n'est pas vide, appelle la fonction de rappel avec cette valeur.
  const value = $elements.input.value;
  if (!value) return;

  scope.callback(value);
  hideEventModal(); // Ferme le modal après la sauvegarde.
}

// Fonction pour cacher le modal.
export function hideEventModal() {
  $elements.modal.style.display = "none";
}
