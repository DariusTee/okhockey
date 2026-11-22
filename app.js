const state = { dashboard: null };

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const number = new Intl.NumberFormat("de-DE");
const dateLong = new Intl.DateTimeFormat("de-DE", { weekday: "long", day: "2-digit", month: "long" });
const dateShort = new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "short" });

function parseLocalDate(value) {
  return new Date(`${value}T12:00:00`);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function request(url, options) {
  const response = await fetch(url, {
    headers: { "content-type": "application/json", ...(options?.headers || {}) },
    ...options
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "Anfrage fehlgeschlagen.");
  return payload;
}

function renderSummary() {
  const { summary, latestMetrics } = state.dashboard;
  $("#stat-open").textContent = number.format(summary.open);
  $("#stat-production").textContent = number.format(summary.inProduction);
  $("#stat-subscribers").textContent = latestMetrics ? number.format(latestMetrics.subscribers) : "—";
  $("#stat-views").textContent = latestMetrics ? number.format(latestMetrics.views28d) : "—";
  $("#stat-date").textContent = latestMetrics ? `Stand ${dateShort.format(parseLocalDate(latestMetrics.date))}` : "noch kein Snapshot";
  $("#stat-ctr").textContent = latestMetrics ? `${latestMetrics.ctr.toLocaleString("de-DE")} % CTR` : "CTR noch offen";
}

function contentCard(item) {
  const options = state.dashboard.config.pipeline
    .map((status) => `<option value="${status.id}" ${status.id === item.status ? "selected" : ""}>${escapeHtml(status.label)}</option>`)
    .join("");
  const publishDate = item.publishAt ? dateShort.format(parseLocalDate(item.publishAt)) : "ohne Datum";
  return `
    <article class="content-card">
      <div class="card-meta">
        <span class="format-tag">${escapeHtml(item.format)}</span>
        <i class="priority priority-${escapeHtml(item.priority)}" title="Priorität: ${escapeHtml(item.priority)}"></i>
      </div>
      <h4>${escapeHtml(item.title)}</h4>
      <div class="card-footer">
        <span>${escapeHtml(publishDate)}</span>
        <span class="select-wrap" title="Status ändern">
          <select class="status-select" data-content-id="${encodeURIComponent(item.id)}" aria-label="Status für ${escapeHtml(item.title)} ändern">${options}</select>
        </span>
      </div>
    </article>`;
}

function renderPipeline() {
  const { config, content } = state.dashboard;
  $("#pipeline-board").innerHTML = config.pipeline.map((status) => {
    const items = content.filter((item) => item.status === status.id);
    return `
      <section class="pipeline-column ${items.length ? "is-active" : ""}">
        <div class="column-heading"><h3>${escapeHtml(status.label)}</h3><span>${items.length}</span></div>
        <div class="column-body">
          ${items.length ? items.map(contentCard).join("") : '<p class="empty-column">Noch frei</p>'}
        </div>
      </section>`;
  }).join("");

  $$(".status-select").forEach((select) => {
    select.addEventListener("change", async () => {
      try {
        await request(`/api/content/${select.dataset.contentId}`, {
          method: "PATCH",
          body: JSON.stringify({ status: select.value })
        });
        await loadDashboard();
        toast("Status aktualisiert");
      } catch (error) {
        toast(error.message, true);
      }
    });
  });
}

function renderSchedule() {
  const { upcoming } = state.dashboard;
  $("#schedule-count").textContent = upcoming.length;
  $("#schedule-list").innerHTML = upcoming.length
    ? upcoming.slice(0, 7).map((item) => {
        const date = parseLocalDate(item.publishAt);
        return `
          <article class="schedule-item">
            <div class="date-tile"><strong>${String(date.getDate()).padStart(2, "0")}</strong><span>${date.toLocaleDateString("de-DE", { month: "short" })}</span></div>
            <div class="schedule-copy"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.format)} · ${escapeHtml(item.owner)}</p></div>
            <div class="schedule-platforms">${item.platforms.map(escapeHtml).join(" · ")}</div>
          </article>`;
      }).join("")
    : '<div class="empty-state"><p>Noch keine kommenden Veröffentlichungen.<br />Lege bei einer Idee ein Zieldatum fest.</p></div>';
}

function renderMetrics() {
  const snapshots = state.dashboard.metrics.slice(-8);
  const chart = $("#metric-chart");
  const details = $("#metric-details");
  if (!snapshots.length) {
    chart.innerHTML = '<div class="empty-state"><p>Noch keine KPI-Daten.<br />Starte mit deinem ersten Snapshot.</p></div>';
    details.innerHTML = `
      <div class="metric-detail"><strong>—</strong><span>Watchtime · 28 T.</span></div>
      <div class="metric-detail"><strong>—</strong><span>CTR</span></div>
      <div class="metric-detail"><strong>—</strong><span>Ø Wiedergabe</span></div>`;
    return;
  }
  const maximum = Math.max(...snapshots.map((item) => item.views28d), 1);
  chart.innerHTML = snapshots.map((item) => `
    <div class="chart-bar-wrap" title="${number.format(item.views28d)} Views">
      <div class="chart-bar" style="height:${Math.max(3, (item.views28d / maximum) * 100)}%"></div>
      <span>${dateShort.format(parseLocalDate(item.date))}</span>
    </div>`).join("");
  const latest = snapshots.at(-1);
  details.innerHTML = `
    <div class="metric-detail"><strong>${number.format(latest.watchHours28d)}</strong><span>Watchtime · 28 T.</span></div>
    <div class="metric-detail"><strong>${latest.ctr.toLocaleString("de-DE")}%</strong><span>CTR</span></div>
    <div class="metric-detail"><strong>${latest.averageViewPercentage.toLocaleString("de-DE")}%</strong><span>Ø Wiedergabe</span></div>`;
}

function renderCadence() {
  const cadence = state.dashboard.config.cadence;
  const entries = [
    [cadence.longformPerWeek, "Longform / Woche"],
    [cadence.shortsPerWeek, "Shorts / Woche"],
    [cadence.communityPostsPerWeek, "Community Posts / Woche"]
  ];
  $("#cadence-grid").innerHTML = entries.map(([value, label]) => `
    <article class="cadence-card"><strong>${number.format(value)}×</strong><span>${label}</span></article>`).join("");
}

function configureForms() {
  const { config } = state.dashboard;
  $("#format-options").innerHTML = config.formats.map((format) => `<option>${escapeHtml(format)}</option>`).join("");
  $("#platform-options").innerHTML = config.platforms.map((platform, index) => `
    <label><input type="checkbox" name="platforms" value="${escapeHtml(platform)}" ${index === 0 ? "checked" : ""} /> ${escapeHtml(platform)}</label>`).join("");
}

async function loadDashboard() {
  state.dashboard = await request("/api/dashboard");
  $("#mission").textContent = state.dashboard.config.mission;
  renderSummary();
  renderPipeline();
  renderSchedule();
  renderMetrics();
  renderCadence();
  configureForms();
}

function toast(message, isError = false) {
  const element = $("#toast");
  element.textContent = message;
  element.style.background = isError ? "var(--red)" : "var(--lime)";
  element.style.color = isError ? "white" : "#101600";
  element.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => element.classList.remove("show"), 2600);
}

function formObject(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function setupDialogs() {
  $$('[data-open]').forEach((button) => {
    button.addEventListener("click", () => {
      const dialog = document.getElementById(button.dataset.open);
      if (dialog.id === "metrics-dialog") $("[name=date]", dialog).value = new Date().toISOString().slice(0, 10);
      dialog.showModal();
    });
  });
  $$('[data-close]').forEach((button) => button.addEventListener("click", () => button.closest("dialog").close()));
  $$('dialog').forEach((dialog) => dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  }));
}

function setupForms() {
  $("#content-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const error = $(".form-error", form);
    error.textContent = "";
    const payload = formObject(form);
    payload.platforms = $$('[name="platforms"]:checked', form).map((input) => input.value);
    try {
      await request("/api/content", { method: "POST", body: JSON.stringify(payload) });
      form.reset();
      form.closest("dialog").close();
      await loadDashboard();
      toast("Idee angelegt");
    } catch (requestError) {
      error.textContent = requestError.message;
    }
  });

  $("#metrics-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const error = $(".form-error", form);
    error.textContent = "";
    try {
      await request("/api/metrics", { method: "POST", body: JSON.stringify(formObject(form)) });
      form.closest("dialog").close();
      await loadDashboard();
      toast("KPI-Snapshot gespeichert");
    } catch (requestError) {
      error.textContent = requestError.message;
    }
  });
}

async function init() {
  $("#today").textContent = dateLong.format(new Date());
  setupDialogs();
  setupForms();
  try {
    await loadDashboard();
  } catch (error) {
    document.body.innerHTML = `<main class="empty-state"><p>Control Room konnte nicht geladen werden.<br />${escapeHtml(error.message)}</p></main>`;
  }
}

init();
