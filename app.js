const pageTitles = {
  dashboard: "Mesa de despacho",
  process: "Preparar correspondencia",
  templates: "Textos-base",
  accounts: "Remetentes autorizados",
  history: "Historico de protocolo"
};

const issues = [
  {
    type: "ambiguous",
    name: "Linha 8 - Alex Pereira",
    detail: "Genero ambiguo. Rascunho bloqueado ate correcao manual.",
    label: "Ambiguo"
  },
  {
    type: "invalid",
    name: "Linha 14 - Maria sem e-mail",
    detail: "Campo obrigatorio ausente.",
    label: "Invalido"
  },
  {
    type: "duplicate",
    name: "Linha 18 - joao@exemplo.com",
    detail: "E-mail duplicado na planilha.",
    label: "Duplicado"
  },
  {
    type: "ambiguous",
    name: "Linha 26 - Ariel Santos",
    detail: "Inferencia insegura pelo primeiro nome.",
    label: "Ambiguo"
  },
  {
    type: "invalid",
    name: "Linha 32 - contato@",
    detail: "Formato de e-mail invalido.",
    label: "Invalido"
  }
];

let currentStep = 1;
let running = false;
let toastTimer;

const views = document.querySelectorAll(".view");
const navItems = document.querySelectorAll("[data-view]");
const viewButtons = document.querySelectorAll("[data-view-button]");
const pageTitle = document.querySelector("#page-title");
const stepIndicators = document.querySelectorAll("[data-step-indicator]");
const stepPanels = document.querySelectorAll("[data-step-panel]");
const prevStep = document.querySelector("#prev-step");
const nextStep = document.querySelector("#next-step");
const resetFlow = document.querySelector("#reset-flow");
const issueList = document.querySelector("#issue-list");
const filters = document.querySelectorAll("[data-filter]");
const startRun = document.querySelector("#start-run");
const runFill = document.querySelector("#run-fill");
const runMeter = document.querySelector("#run-meter");
const runStatus = document.querySelector("#run-status");
const processedCount = document.querySelector("#processed-count");
const createdCount = document.querySelector("#created-count");
const failedCount = document.querySelector("#failed-count");
const severeModal = document.querySelector("#severe-modal");
const closeModal = document.querySelector("#close-modal");
const confirmSevere = document.querySelector("#confirm-severe");
const toast = document.querySelector("#toast");
const primaryTopAction = document.querySelector('[data-view-button="process"]');
const accountTopAction = document.querySelector('[data-view-button="accounts"]');
const stepActionLabels = [
  "Ir para planilha",
  "Validar planilha",
  "Revisar mensagem",
  "Ir para despacho"
];

function validateCurrentStep() {
  if (currentStep !== 1) return true;

  const requiredFields = document.querySelectorAll('[data-step-panel="1"] [required]');
  const subject = document.querySelector("#static-subject");
  subject.setCustomValidity(subject.value.includes("{{") ? "O assunto nao pode conter variaveis." : "");

  for (const field of requiredFields) {
    if (!field.checkValidity()) {
      field.reportValidity();
      field.focus();
      return false;
    }
  }

  return true;
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("visible");
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 4000);
}

function setView(viewName, options = {}) {
  views.forEach((view) => view.classList.toggle("active", view.id === viewName));
  navItems.forEach((item) => {
    const selected = item.dataset.view === viewName;
    item.classList.toggle("active", selected);
    if (selected) item.setAttribute("aria-current", "page");
    else item.removeAttribute("aria-current");
  });
  pageTitle.textContent = pageTitles[viewName] || "Dashboard";
  primaryTopAction.hidden = viewName === "process";
  accountTopAction.hidden = viewName === "accounts";

  if (options.history !== false) {
    const url = new URL(window.location.href);
    if (viewName === "dashboard") url.searchParams.delete("view");
    else url.searchParams.set("view", viewName);
    window.history.pushState({ view: viewName }, "", url);
  }

  if (options.focus !== false) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    pageTitle.focus({ preventScroll: true });
  }
}

function setStep(step, options = {}) {
  currentStep = Math.max(1, Math.min(5, step));

  stepIndicators.forEach((item) => {
    const itemStep = Number(item.dataset.stepIndicator);
    item.classList.toggle("active", itemStep === currentStep);
    item.classList.toggle("done", itemStep < currentStep);
    if (itemStep === currentStep) item.setAttribute("aria-current", "step");
    else item.removeAttribute("aria-current");
  });

  stepPanels.forEach((panel) => {
    panel.classList.toggle("active", Number(panel.dataset.stepPanel) === currentStep);
  });

  prevStep.disabled = currentStep === 1;
  nextStep.hidden = currentStep === 5;
  nextStep.textContent = stepActionLabels[currentStep - 1] || "Continuar";

  if (options.focus) {
    const heading = document.querySelector(`[data-step-panel="${currentStep}"] h2`);
    if (heading) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
      heading.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
}

function renderIssues(filter = "all") {
  const filtered = filter === "all" ? issues : issues.filter((issue) => issue.type === filter);
  issueList.innerHTML = "";

  filtered.forEach((issue) => {
    const issueIndex = issues.indexOf(issue);
    const item = document.createElement("article");
    item.className = `issue-item ${issue.resolved ? "resolved" : ""}`;
    item.dataset.issueIndex = String(issueIndex);
    item.innerHTML = `
      <div>
        <strong>${issue.name}</strong>
        <span>${issue.detail}</span>
      </div>
      <button class="secondary-button" type="button" ${issue.resolved ? "disabled" : ""}>${issue.resolved ? "Resolvido" : issue.type === "ambiguous" ? "Informar genero" : "Resolver registro"}</button>
    `;
    issueList.appendChild(item);
  });
}

function runDraftCreation() {
  if (running) return;
  running = true;

  let processed = 0;
  let created = 0;
  let failed = 0;

  startRun.disabled = true;
  startRun.setAttribute("aria-busy", "true");
  startRun.textContent = "Criando rascunhos...";
  runStatus.textContent = "EM PROCESSAMENTO";
  runStatus.className = "status-tag warning";

  const timer = setInterval(() => {
    processed += 3;
    created += processed >= 24 ? 2 : 3;
    failed = processed >= 21 ? 1 : 0;

    const percent = Math.min(100, (processed / 26) * 100);
    runFill.style.width = `${percent}%`;
    runMeter.setAttribute("aria-valuenow", String(Math.min(processed, 26)));
    processedCount.textContent = `${Math.min(processed, 26)}/26`;
    createdCount.textContent = String(Math.min(created, 25));
    failedCount.textContent = String(failed);

    if (processed >= 26) {
      clearInterval(timer);
      running = false;
      startRun.disabled = false;
      startRun.removeAttribute("aria-busy");
      startRun.textContent = "Reprocessar 1 falha";
      runStatus.textContent = "CONCLUIDO";
      runStatus.className = "status-tag success";
      createdCount.textContent = "25";
      failedCount.textContent = "1";
      showToast("25 rascunhos criados. 1 falha ficou disponivel para nova tentativa.");
    }
  }, 260);
}

navItems.forEach((item) => {
  item.addEventListener("click", () => setView(item.dataset.view));
});

viewButtons.forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.viewButton));
});

prevStep.addEventListener("click", () => setStep(currentStep - 1, { focus: true }));

nextStep.addEventListener("click", () => {
  if (!validateCurrentStep()) return;

  if (currentStep === 3 && severeModal && typeof severeModal.showModal === "function") {
    severeModal.showModal();
    return;
  }

  if (currentStep < 5) {
    setStep(currentStep + 1, { focus: true });
  }
});

document.querySelector("#static-subject").addEventListener("input", (event) => {
  event.target.setCustomValidity("");
});

resetFlow.addEventListener("click", () => {
  if (window.confirm("Limpar a preparacao e voltar para a primeira etapa?")) {
    setStep(1, { focus: true });
    showToast("Preparacao limpa.");
  }
});

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    filters.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-pressed", "false");
    });
    filter.classList.add("active");
    filter.setAttribute("aria-pressed", "true");
    renderIssues(filter.dataset.filter);
  });
});

issueList.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  const item = event.target.closest(".issue-item");
  if (!button || !item) return;
  const issue = issues[Number(item.dataset.issueIndex)];
  issue.resolved = true;
  item.classList.add("resolved");
  button.textContent = "Resolvido";
  button.disabled = true;
  showToast(`${issue.name} marcado como resolvido.`);
});

document.querySelectorAll(".sheet-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".sheet-tab").forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-selected", "false");
    });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    showToast(`Aba ${tab.textContent.trim()} selecionada.`);
  });
});

document.querySelectorAll(".template-item").forEach((template) => {
  template.addEventListener("click", () => {
    document.querySelectorAll(".template-item").forEach((item) => item.classList.remove("active"));
    template.classList.add("active");
    showToast(`${template.querySelector("strong").textContent} selecionado.`);
  });
});

document.querySelectorAll('.editor-toolbar button[aria-pressed]').forEach((button) => {
  button.addEventListener("click", () => {
    const pressed = button.getAttribute("aria-pressed") === "true";
    button.setAttribute("aria-pressed", String(!pressed));
  });
});

document.querySelectorAll("[data-demo-action]").forEach((button) => {
  button.addEventListener("click", () => showToast(button.dataset.demoAction));
});

startRun.addEventListener("click", runDraftCreation);

if (closeModal) {
  closeModal.addEventListener("click", () => severeModal.close());
}

if (confirmSevere) {
  confirmSevere.addEventListener("click", () => {
    severeModal.close();
    setStep(4, { focus: true });
  });
}

window.addEventListener("popstate", () => {
  const view = new URLSearchParams(window.location.search).get("view") || "dashboard";
  setView(pageTitles[view] ? view : "dashboard", { history: false });
});

const params = new URLSearchParams(window.location.search);
const initialView = params.get("view");
const initialStep = Number(params.get("step") || 1);

renderIssues();
setStep(initialStep);

if (initialView && pageTitles[initialView]) {
  setView(initialView, { history: false, focus: false });
} else {
  setView("dashboard", { history: false, focus: false });
}
