(function () {
  var STORAGE = window.SDD_I18N_STORAGE;
  var CATALOGS = window.SDD_I18N;
  var LANG = window.SDD_LOCALE_LANG;
  var LOCALES = window.SDD_LOCALES;
  var HOST = window.SDD_HOST || "framework.sdd.works";

  function currentLocale() {
    var stored = localStorage.getItem(STORAGE);
    if (LOCALES.indexOf(stored) !== -1) return stored;
    return "EN";
  }

  function t(key, vars) {
    var loc = currentLocale();
    var catalog = CATALOGS[loc] || {};
    var en = CATALOGS.EN || {};
    var value = catalog[key];
    if (value == null || value === "") value = en[key];
    if (value == null || value === "") value = key;
    if (vars) {
      Object.keys(vars).forEach(function (name) {
        value = value.replace(new RegExp("\\{" + name + "\\}", "g"), vars[name]);
      });
    }
    return value;
  }

  function applyI18n() {
    var loc = currentLocale();
    document.documentElement.lang = LANG[loc] || "en";
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var vars = {};
      var raw = el.getAttribute("data-i18n-vars");
      if (raw) {
        try {
          vars = JSON.parse(raw);
        } catch (e) {
          vars = {};
        }
      }
      var value = t(key, vars);
      if (el.dataset.i18nAttr) {
        el.setAttribute(el.dataset.i18nAttr, value);
      } else {
        el.textContent = value;
      }
    });
    document.querySelectorAll("[data-page-title]").forEach(function (el) {
      document.title = el.getAttribute("data-page-title");
    });
    var titleKey = document.body.getAttribute("data-title-key");
    if (titleKey) {
      document.title = t(titleKey) + " — " + HOST;
    } else if (!document.title) {
      document.title = HOST;
    }
    document.querySelectorAll(".locale-switch button").forEach(function (btn) {
      var on = btn.getAttribute("data-locale") === loc;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  function bindLocale() {
    document.querySelectorAll(".locale-switch button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        localStorage.setItem(STORAGE, btn.getAttribute("data-locale"));
        applyI18n();
      });
    });
  }

  function bindPassword() {
    document.querySelectorAll(".password-toggle").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var input = document.getElementById(btn.getAttribute("data-for"));
        if (!input) return;
        var show = input.type === "password";
        input.type = show ? "text" : "password";
        btn.setAttribute("aria-pressed", show ? "true" : "false");
        btn.setAttribute("data-i18n", show ? "admin.login.hide_password" : "admin.login.show_password");
        applyI18n();
      });
    });
  }

  function bindCopy() {
    document.querySelectorAll("[data-copy]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var text = btn.getAttribute("data-copy");
        var label = btn.querySelector(".setup-pill-text") || btn;
        var idleKey =
          label.getAttribute("data-i18n-idle") ||
          label.getAttribute("data-i18n") ||
          btn.getAttribute("data-i18n-idle") ||
          btn.getAttribute("data-i18n") ||
          "admin.keys.copy";
        if (!label.getAttribute("data-i18n-idle")) {
          label.setAttribute("data-i18n-idle", idleKey);
        }
        var done = function () {
          label.setAttribute("data-i18n", "admin.common.copied");
          applyI18n();
          setTimeout(function () {
            label.setAttribute("data-i18n", label.getAttribute("data-i18n-idle") || "admin.keys.copy");
            applyI18n();
          }, 1600);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done).catch(done);
        } else {
          done();
        }
      });
    });
  }

  function bindMenu() {
    var toggle = document.querySelector(".menu-toggle");
    var shell = document.querySelector(".app-shell");
    if (!toggle || !shell) return;
    toggle.addEventListener("click", function () {
      shell.classList.toggle("is-nav-open");
    });
  }

  function bindDialogs() {
    document.querySelectorAll("[data-open-dialog]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        var dlg = document.getElementById(btn.getAttribute("data-open-dialog"));
        if (dlg) dlg.classList.add("is-open");
      });
    });
    document.querySelectorAll("[data-close-dialog]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var dlg = btn.closest(".dialog-backdrop");
        if (dlg) dlg.classList.remove("is-open");
      });
    });
    document.querySelectorAll(".dialog-backdrop").forEach(function (dlg) {
      dlg.addEventListener("click", function (e) {
        if (e.target === dlg) dlg.classList.remove("is-open");
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      document.querySelectorAll(".dialog-backdrop.is-open").forEach(function (dlg) {
        dlg.classList.remove("is-open");
      });
    });
  }

  function applyQueryState() {
    var params = new URLSearchParams(location.search);
    if (params.get("error") === "1") {
      var err = document.querySelector("[data-error]");
      if (err) err.hidden = false;
    }
    if (params.get("sent") === "1") {
      var sent = document.querySelector("[data-sent]");
      var lead = document.querySelector("[data-reset-lead]");
      var form = document.querySelector("[data-reset-form]");
      var backHome = document.querySelector("[data-reset-back-home]");
      var backLogin = document.querySelector("[data-reset-back-login]");
      if (sent) sent.hidden = false;
      if (lead) lead.hidden = true;
      if (form) form.hidden = true;
      if (backHome) backHome.hidden = true;
      if (backLogin) backLogin.hidden = false;
    }
    if (params.get("done") === "1") {
      var done = document.querySelector("[data-set-done]");
      var formBlock = document.querySelector("[data-set-form]");
      var inviteDone = document.querySelector("[data-invite-done]");
      var inviteForm = document.querySelector("[data-invite-form]");
      if (done) done.hidden = false;
      if (formBlock) formBlock.hidden = true;
      if (inviteDone) inviteDone.hidden = false;
      if (inviteForm) inviteForm.hidden = true;
    } else {
      var doneDefault = document.querySelector("[data-set-done]");
      if (doneDefault) doneDefault.hidden = true;
    }
    if (params.get("expired") === "1") {
      var inviteExpired = document.querySelector("[data-invite-expired]");
      var inviteFormExp = document.querySelector("[data-invite-form]");
      if (inviteExpired) inviteExpired.hidden = false;
      if (inviteFormExp) inviteFormExp.hidden = true;
    }
    if (params.get("sync") === "error") {
      var syncErr = document.querySelector("[data-framework-error]");
      if (syncErr) syncErr.hidden = false;
    }
    if (params.get("empty") === "1") {
      var tree = document.querySelector("[data-framework-tree]");
      var treeLabel = document.querySelector("[data-framework-tree-label]");
      var fwEmpty = document.querySelector("[data-framework-empty]");
      var fwRepo = document.querySelector("[data-framework-repo]");
      if (tree) tree.hidden = true;
      if (treeLabel) treeLabel.hidden = true;
      if (fwRepo) fwRepo.hidden = true;
      if (fwEmpty) fwEmpty.hidden = false;
    }
    var mode = params.get("mode");
    if (mode === "reset") {
      var emptyLead = document.querySelector("[data-set-empty-lead]");
      var resetLead = document.querySelector("[data-set-reset-lead]");
      var emptyNote = document.querySelector("[data-set-empty-note]");
      if (emptyLead) emptyLead.hidden = true;
      if (resetLead) resetLead.hidden = false;
      if (emptyNote) emptyNote.hidden = true;
    }
    var setError = params.get("error");
    if (setError === "session") {
      var sessionCallout = document.querySelector("[data-set-error-session]");
      var fields = document.querySelector("[data-set-fields]");
      var formBlock = document.querySelector("[data-set-form]");
      if (sessionCallout) sessionCallout.hidden = false;
      if (fields) fields.hidden = true;
      if (formBlock) formBlock.hidden = false;
    }
    if (setError === "mismatch") {
      var mismatch = document.querySelector("[data-set-error-mismatch]");
      if (mismatch) mismatch.hidden = false;
    }
    if (params.get("empty") === "1") {
      var table = document.querySelector("[data-keys-table]");
      var empty = document.querySelector("[data-keys-empty]");
      if (table) table.hidden = true;
      if (empty) empty.hidden = false;
    }
    if (params.get("saved") === "1") {
      var keysSaved = document.querySelector("[data-keys-saved]");
      if (keysSaved) keysSaved.hidden = false;
    }
    var confirm = params.get("confirm");
    if (confirm) {
      var dlg = document.getElementById("dialog-" + confirm);
      if (dlg) dlg.classList.add("is-open");
    }
  }

  function bindKeysSelection() {
    var table = document.querySelector("[data-keys-table]");
    if (!table) return;
    var selectAll = table.querySelector("[data-testid=keys-select-all]");
    var deleteBtn = document.querySelector("[data-testid=keys-delete-selected]");
    var confirmBtn = document.querySelector("[data-testid=keys-delete-selected-confirm]");
    var dialog = document.getElementById("dialog-delete-selected");
    var dialogBody = dialog ? dialog.querySelector(".dialog-body") : null;

    function rowBoxes() {
      return Array.prototype.slice.call(table.querySelectorAll("tbody input[type=checkbox]"));
    }

    function update() {
      var boxes = rowBoxes();
      var checked = boxes.filter(function (box) {
        return box.checked;
      });
      if (deleteBtn) deleteBtn.disabled = checked.length === 0;
      if (selectAll) {
        selectAll.checked = boxes.length > 0 && checked.length === boxes.length;
        selectAll.indeterminate = checked.length > 0 && checked.length < boxes.length;
      }
      if (dialogBody) {
        dialogBody.setAttribute("data-i18n-vars", JSON.stringify({ count: String(checked.length) }));
        applyI18n();
      }
    }

    if (selectAll) {
      selectAll.addEventListener("change", function () {
        rowBoxes().forEach(function (box) {
          box.checked = selectAll.checked;
        });
        update();
      });
    }
    rowBoxes().forEach(function (box) {
      box.addEventListener("change", update);
    });
    if (deleteBtn) {
      deleteBtn.addEventListener("click", function () {
        if (deleteBtn.disabled) return;
        if (dialog) dialog.classList.add("is-open");
      });
    }
    if (confirmBtn) {
      confirmBtn.addEventListener("click", function () {
        rowBoxes()
          .filter(function (box) {
            return box.checked;
          })
          .forEach(function (box) {
            var row = box.closest("tr");
            if (row) row.remove();
          });
        if (dialog) dialog.classList.remove("is-open");
        update();
      });
    }
    update();
  }

  function bindSettingsForm() {
    var form = document.querySelector("[data-settings-form]");
    if (!form) return;
    var input = form.querySelector("[data-settings-url]");
    var save = form.querySelector("[data-settings-save]");
    var saved = document.querySelector("[data-settings-saved]");
    var err = document.querySelector("[data-settings-error]");
    if (!input || !save) return;

    var baseline = input.value.trim();

    function syncSave() {
      var dirty = input.value.trim() !== baseline;
      save.disabled = !dirty;
    }

    input.addEventListener("input", syncSave);
    input.addEventListener("change", syncSave);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (save.disabled) return;
      var next = input.value.trim();
      if (saved) saved.hidden = true;
      if (err) err.hidden = true;

      // Mock: URLs containing "fail" or "invalid" simulate unreachable GitHub.
      var unreachable = /fail|invalid|404/i.test(next);
      if (unreachable) {
        if (err) err.hidden = false;
        input.value = baseline;
        syncSave();
        applyI18n();
        return;
      }

      baseline = next;
      input.value = baseline;
      if (saved) saved.hidden = false;
      syncSave();
      applyI18n();
    });

    var params = new URLSearchParams(location.search);
    if (params.get("saved") === "1" && saved) saved.hidden = false;
    if (params.get("error") === "unreachable" && err) err.hidden = false;
    syncSave();
  }

  function bindSecretLookup() {
    var form = document.querySelector("[data-testid='secret-lookup']");
    if (!form) return;
    var input = form.querySelector("[data-testid='secret-name']");
    var button = form.querySelector("[data-testid='secret-get']");
    var result = document.querySelector("[data-testid='secret-result']");
    var resultText = result ? result.querySelector(".secret-result-text") : null;
    var resultCopy = result ? result.querySelector("[data-testid='secret-result-copy']") : null;
    var error = document.querySelector("[data-testid='secret-error']");

    function scrollResultIntoView(node) {
      if (node && typeof node.scrollIntoView === "function") {
        node.scrollIntoView({ block: "start", behavior: "smooth" });
      }
    }

    function showLookup() {
      var name = (input && input.value ? input.value : "").trim();
      if (result) {
        result.hidden = true;
        if (resultText) resultText.textContent = "";
        if (resultCopy) {
          resultCopy.hidden = true;
          resultCopy.removeAttribute("data-copy");
        }
      }
      if (error) {
        error.hidden = true;
        error.removeAttribute("data-i18n");
        error.textContent = "";
      }
      if (!name) {
        if (error) {
          error.hidden = false;
          error.setAttribute("data-i18n", "admin.guide.secret_empty");
          applyI18n();
          scrollResultIntoView(error);
        }
        return;
      }
      // Mock: exact demo name only; any other name is not found (no fuzzy match).
      if (name === "sdd-trial-googlemaps") {
        if (result && resultText) {
          result.hidden = false;
          resultText.textContent = "sample-secret-value";
          if (resultCopy) {
            resultCopy.hidden = false;
            resultCopy.setAttribute("data-copy", "sample-secret-value");
          }
          scrollResultIntoView(result);
        }
        return;
      }
      if (error) {
        error.hidden = false;
        error.setAttribute("data-i18n", "admin.guide.secret_missing");
        applyI18n();
        scrollResultIntoView(error);
      }
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      showLookup();
    });
    if (button) {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        showLookup();
      });
    }
  }

  function bindResetForm() {
    var form = document.querySelector("[data-reset-form]");
    if (!form) return;
    var submit = form.querySelector("[data-testid='reset-submit']");

    function showSent() {
      var sent = document.querySelector("[data-sent]");
      var sentBody = document.querySelector("[data-reset-sent]");
      var lead = document.querySelector("[data-reset-lead]");
      var backHome = document.querySelector("[data-reset-back-home]");
      var backLogin = document.querySelector("[data-reset-back-login]");
      if (sentBody) {
        sentBody.setAttribute("data-i18n", "admin.reset.sent");
        applyI18n();
      }
      if (sent) sent.hidden = false;
      if (lead) lead.hidden = true;
      form.hidden = true;
      if (backHome) backHome.hidden = true;
      if (backLogin) backLogin.hidden = false;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      showSent();
    });
    if (submit) {
      submit.addEventListener("click", function (event) {
        event.preventDefault();
        showSent();
      });
    }
  }

  function showGuideTab(name) {
    var tabs = document.querySelectorAll(".guide-tab[data-tab]");
    if (!tabs.length) return;
    tabs.forEach(function (btn) {
      var on = btn.getAttribute("data-tab") === name;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-selected", on ? "true" : "false");
    });
    document.querySelectorAll(".guide-tab-panel[data-panel]").forEach(function (panel) {
      panel.hidden = panel.getAttribute("data-panel") !== name;
    });
  }

  function bindGuideTabs() {
    var tabs = document.querySelectorAll(".guide-tab[data-tab]");
    if (!tabs.length) return;
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        showGuideTab(tab.getAttribute("data-tab"));
      });
    });
    var initial = new URLSearchParams(location.search).get("tab");
    if (initial === "features" || initial === "setup") {
      showGuideTab(initial);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    bindLocale();
    bindPassword();
    bindCopy();
    bindMenu();
    bindDialogs();
    bindKeysSelection();
    bindSettingsForm();
    bindGuideTabs();
    bindResetForm();
    bindSecretLookup();
    applyQueryState();
    applyI18n();
  });

  window.sddT = t;
})();
