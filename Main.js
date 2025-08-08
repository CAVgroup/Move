// scripts.js

// ----------------------------
// Cozy ElectroCore Admin JS
// ----------------------------

(() => {
  // User DB simulation (in-memory)
  // Admin account is user: 2739@€+83+ pass: admin (simple for demo)
  const usersDB = {
    "2739@€+83+": {
      username: "Gocur",
      password: "2739@€+83+",
      coins: 10000,
      xp: 9999,
      notes: "",
      projects: [
        { id: 1, title: "Cozy Lamp Circuit", featured: true, description: "A gentle night lamp build." },
        { id: 2, title: "Spring Timer", featured: false, description: "Automates watering cycles." }
      ],
    },
    "friend1": {
      username: "friend1",
      coins: 500,
      xp: 150,
      projects: [],
      notes: "",
    },
    "builder42": {
      username: "builder42",
      coins: 1200,
      xp: 4500,
      projects: [
        { id: 3, title: "Smart Door", featured: false, description: "Opens automatically on approach." }
      ],
      notes: "",
    },
  };

  // Current logged in user state
  let currentUser = null;
  let currentLang = "en";

  // DOM references
  const loginSection = document.getElementById("loginSection");
  const adminToolkitSection = document.getElementById("adminToolkitSection");

  const loginNotification = document.getElementById("loginNotification");

  // Login buttons & form
  const loginGoogleBtn = document.getElementById("loginGoogleBtn");
  const loginGitHubBtn = document.getElementById("loginGitHubBtn");
  const customLoginForm = document.getElementById("customLoginForm");
  const customUsernameInput = document.getElementById("customUsername");
  const customPasswordInput = document.getElementById("customPassword");

  // Language buttons
  const langEnBtn = document.getElementById("langEnBtn");
  const langEsBtn = document.getElementById("langEsBtn");

  // Admin toolkit elements
  // Gift Coins
  const giftCoinsForm = document.getElementById("giftCoinsForm");
  const friendNameInput = document.getElementById("friendNameInput");
  const coinsAmountInput = document.getElementById("coinsAmountInput");
  const giftCoinsMessage = document.getElementById("giftCoinsMessage");

  // Top Up Coins
  const topUpAmountSlider = document.getElementById("topUpAmountSlider");
  const topUpDisplay = document.getElementById("topUpDisplay");
  const topUpBtn = document.getElementById("topUpBtn");
  const topUpMessage = document.getElementById("topUpMessage");

  // Award XP
  const awardXpForm = document.getElementById("awardXpForm");
  const xpUserInput = document.getElementById("xpUserInput");
  const xpAmountInput = document.getElementById("xpAmountInput");
  const awardXpMessage = document.getElementById("awardXpMessage");

  // Public Gallery
  const galleryGrid = document.getElementById("galleryGrid");
  const galleryMessage = document.getElementById("galleryMessage");

  // Player Lookup
  const lookupUsernameInput = document.getElementById("lookupUsernameInput");
  const lookupBtn = document.getElementById("lookupBtn");
  const lookupResult = document.getElementById("lookupResult");

  // Private Notes
  const privateNotesTextArea = document.getElementById("privateNotesTextArea");
  const saveNotesBtn = document.getElementById("saveNotesBtn");
  const saveNotesMessage = document.getElementById("saveNotesMessage");

  // --- Utility functions ---

  function showNotification(element, message, isError = false, duration = 3000) {
    element.textContent = message;
    element.style.color = isError ? "#c0392b" : "#2ecc71"; // red or green
    element.hidden = false;
    setTimeout(() => {
      element.hidden = true;
    }, duration);
  }

  function clearForm(form) {
    form.reset();
  }

  function updateCoinsDisplay() {
    if (currentUser) {
      topUpDisplay.textContent = `${currentUser.coins} coins`;
    }
  }

  function sanitizeInput(str) {
    return String(str).trim();
  }

  // --------------------------
  // Language switching
  // --------------------------

  function setLanguage(lang) {
    currentLang = lang;

    // Update aria-pressed buttons
    langEnBtn.setAttribute("aria-pressed", lang === "en" ? "true" : "false");
    langEsBtn.setAttribute("aria-pressed", lang === "es" ? "true" : "false");

    // TODO: Ideally load translation strings dynamically; here is demo

    const texts = {
      en: {
        loginTitle: "Login to Your Account",
        customLoginTitle: "Custom Account Login",
        usernameLabel: "Username:",
        passwordLabel: "Password:",
        loginButton: "Login",
        giftCoinsTitle: "🎁 Gift Coins to Friends",
        giftCoinsFriend: "Friend’s Username:",
        giftCoinsAmount: "Amount of Coins:",
        giftCoinsButton: "Give Coins",
        topUpTitle: "💰 Top Up Your Coin Pouch",
        topUpLabel: "Select Amount to Add:",
        topUpButton: "Add Coins",
        awardXpTitle: "✨ Award XP to Brilliant Builders",
        awardXpUser: "Player Username:",
        awardXpAmount: "XP Amount:",
        awardXpButton: "Award XP",
        publicGalleryTitle: "🛍️ Workshop Public Gallery",
        playerLookupTitle: "🔍 Look Up Fellow Inventors",
        lookupLabel: "Enter Username:",
        lookupButton: "Look Up",
        privateNotesTitle: "📝 Private Notes Journal",
        saveNotesButton: "Save Notes",
        loginFailed: "Login failed. Check your username and password.",
        loginSuccess: "Welcome back, ",
      },
      es: {
        loginTitle: "Inicia sesión en tu cuenta",
        customLoginTitle: "Inicio de sesión personalizado",
        usernameLabel: "Nombre de usuario:",
        passwordLabel: "Contraseña:",
        loginButton: "Iniciar sesión",
        giftCoinsTitle: "🎁 Regalar monedas a amigos",
        giftCoinsFriend: "Nombre de usuario del amigo:",
        giftCoinsAmount: "Cantidad de monedas:",
        giftCoinsButton: "Dar monedas",
        topUpTitle: "💰 Recarga tu bolsa de monedas",
        topUpLabel: "Selecciona la cantidad para agregar:",
        topUpButton
<strong>XP:</strong> ${user.xp || 0}<br />
      <strong>Projects:</strong> ${user.projects && user.projects.length > 0 ? user.projects.map(p => p.title).join(", ") : "None"}
    `;
    lookupResult.hidden = false;
  });

  // --------------------------
  // Private Notes Handler
  // --------------------------

  function loadNotes() {
    if (currentUser && currentUser.notes) {
      privateNotesTextArea.value = currentUser.notes;
    } else {
      privateNotesTextArea.value = "";
    }
  }

  saveNotesBtn.addEventListener("click", () => {
    if (!currentUser) return;
    currentUser.notes = privateNotesTextArea.value;
    showNotification(saveNotesMessage, "Notes saved!");
  });

  // --------------------------
  // Language Buttons Events
  // --------------------------

  langEnBtn.addEventListener("click", () => setLanguage("en"));
  langEsBtn.addEventListener("click", () => setLanguage("es"));

  // --------------------------
  // Initial setup
  // --------------------------

  // Hide admin toolkit at start
  adminToolkitSection.hidden = true;
  loginNotification.hidden = true;
  giftCoinsMessage.hidden = true;
  topUpMessage.hidden = true;
  awardXpMessage.hidden = true;
  galleryMessage.hidden = true;
  lookupResult.hidden = true;
  saveNotesMessage.hidden = true;

  // Set initial slider display
  topUpDisplay.textContent = `${topUpAmountSlider.value} coins`;

})();