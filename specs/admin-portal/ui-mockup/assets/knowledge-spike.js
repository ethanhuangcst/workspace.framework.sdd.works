(function () {
  "use strict";

  var ROOT = "assets/samples/knowledge";
  var PATH_ROOT = "knowledge";
  var LOCALE_MAP = { EN: "en", CN: "zh-Hans", HANT: "zh-Hant" };
  var STORAGE = window.SDD_I18N_STORAGE || "sdd.locale";
  var LOCALES = window.SDD_LOCALES || ["EN", "CN", "HANT"];

  function currentContentLocale() {
    var stored = localStorage.getItem(STORAGE);
    if (LOCALES.indexOf(stored) !== -1) {
      return LOCALE_MAP[stored] || "en";
    }
    return "en";
  }

  function labelFor(entry, locale) {
    var labels = entry.labels || {};
    return labels[locale] || labels.en || entry.id || "";
  }

  function indexUrl(folderSegments) {
    var base = ROOT;
    if (folderSegments.length) {
      base += "/" + folderSegments.join("/");
    }
    return base + "/.index.json";
  }

  function fetchJson(url) {
    return fetch(url).then(function (res) {
      if (!res.ok) throw new Error("index " + url);
      return res.json();
    });
  }

  function fetchText(url) {
    return fetch(url).then(function (res) {
      if (!res.ok) throw new Error("file " + url);
      return res.text();
    });
  }

  function mdToHtml(md) {
    if (window.marked && typeof window.marked.parse === "function") {
      return window.marked.parse(md, { gfm: true });
    }
    return "<pre>" + escapeHtml(md) + "</pre>";
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function parseRoute() {
    var params = new URLSearchParams(window.location.search);
    var pathParam = params.get("path") || "";
    var folderSegments = pathParam
      ? pathParam.split("/").filter(Boolean)
      : [];
    var doc = params.get("doc") || "";
    return { folderSegments: folderSegments, doc: doc };
  }

  function buildRoute(folderSegments, doc) {
    var params = new URLSearchParams();
    if (folderSegments.length) {
      params.set("path", folderSegments.join("/"));
    }
    if (doc) params.set("doc", doc);
    var q = params.toString();
    return window.location.pathname + (q ? "?" + q : "");
  }

  function wrapTables(html) {
    return html.replace(
      /<table>/g,
      '<div class="content-table"><table>',
    ).replace(/<\/table>/g, "</table></div>");
  }

  var state = {
    index: null,
    folderSegments: [],
    doc: "",
    loading: false,
    error: "",
  };

  var els = {};

  function cacheElements() {
    els.root = document.getElementById("knowledge-browser");
    if (!els.root) return false;
    els.note = els.root.querySelector("[aria-live]");
    els.path = els.root.querySelector(".knowledge-path");
    els.list = els.root.querySelector(".knowledge-list-view");
    els.article = els.root.querySelector(".knowledge-article-view");
    return true;
  }

  function setStatus(msg) {
    if (els.note) els.note.textContent = msg;
  }

  function renderPath() {
    if (!els.path) return;
    var segs = state.folderSegments;
    var doc = state.doc;
    var atRoot = segs.length === 0 && !doc;

    if (atRoot) {
      els.path.hidden = false;
      els.path.innerHTML =
        '<span class="knowledge-path-current">' +
        escapeHtml(PATH_ROOT) +
        "</span>";
      return;
    }

    var html = "";
    html +=
      '<a class="knowledge-path-link" href="' +
      escapeHtml(buildRoute([], "")) +
      '" data-path-depth="0">' +
      escapeHtml(PATH_ROOT) +
      "</a>";

    for (var i = 0; i < segs.length; i += 1) {
      html += '<span class="knowledge-path-sep" aria-hidden="true">/</span>';
      var segment = segs[i];
      var isCurrentFolder = i === segs.length - 1 && !doc;
      if (isCurrentFolder) {
        html +=
          '<span class="knowledge-path-current">' +
          escapeHtml(segment) +
          "</span>";
      } else {
        html +=
          '<a class="knowledge-path-link" href="' +
          escapeHtml(buildRoute(segs.slice(0, i + 1), "")) +
          '" data-path-depth="' +
          String(i + 1) +
          '">' +
          escapeHtml(segment) +
          "</a>";
      }
    }

    if (doc) {
      html += '<span class="knowledge-path-sep" aria-hidden="true">/</span>';
      html +=
        '<span class="knowledge-path-current">' +
        escapeHtml(doc) +
        "</span>";
    }

    els.path.hidden = false;
    els.path.innerHTML = html;
    bindPathNav();
  }

  function bindPathNav() {
    if (!els.path) return;
    els.path.querySelectorAll(".knowledge-path-link").forEach(function (link) {
      link.addEventListener("click", function (ev) {
        if (!plainClick(ev)) return;
        ev.preventDefault();
        var depth = Number(link.getAttribute("data-path-depth") || "0");
        if (depth === 0) {
          navigate([], "");
          return;
        }
        navigate(state.folderSegments.slice(0, depth), "");
      });
    });
  }

  function findEntry(index, id) {
    if (!index || !index.entries) return null;
    for (var i = 0; i < index.entries.length; i++) {
      if (index.entries[i].id === id) return index.entries[i];
    }
    return null;
  }

  function navigate(folderSegments, doc, replace) {
    var url = buildRoute(folderSegments, doc);
    if (replace) {
      history.replaceState(null, "", url);
    } else {
      history.pushState(null, "", url);
    }
    state.folderSegments = folderSegments;
    state.doc = doc;
    render();
  }

  function renderList(index, locale) {
    var html = "";
    html += '<ul class="knowledge-list" role="list">';
    index.entries.forEach(function (entry) {
      html += renderRow(entry, locale);
    });
    html += "</ul>";
    els.list.innerHTML = html;
    bindRows();
  }

  function folderHref(path) {
    var next = state.folderSegments.concat(String(path).split("/").filter(Boolean));
    return buildRoute(next, "");
  }

  function plainClick(ev) {
    return (
      ev.button === 0 &&
      !ev.metaKey &&
      !ev.ctrlKey &&
      !ev.shiftKey &&
      !ev.altKey
    );
  }

  function renderRow(entry, locale) {
    var title = labelFor(entry, locale);
    if (entry.kind === "folder") {
      return (
        '<li class="knowledge-list-item">' +
        '<a class="knowledge-link" href="' +
        escapeHtml(folderHref(entry.path)) +
        '" data-action="folder" data-path="' +
        escapeHtml(entry.path) +
        '">' +
        escapeHtml(title) +
        "</a></li>"
      );
    }
    var href = escapeHtml(buildRoute(state.folderSegments, entry.id));
    var open = entry.open === "new_tab" ? "new_tab" : "same_tab";
    if (open === "new_tab") {
      return (
        '<li class="knowledge-list-item">' +
        '<a class="knowledge-link" href="' +
        href +
        '" target="_blank" rel="noopener noreferrer" data-action="new-tab">' +
        escapeHtml(title) +
        '<span class="knowledge-link-note">new tab</span>' +
        "</a></li>"
      );
    }
    return (
      '<li class="knowledge-list-item">' +
      '<a class="knowledge-link" href="' +
      href +
      '" data-action="same-tab" data-id="' +
      escapeHtml(entry.id) +
      '">' +
      escapeHtml(title) +
      "</a></li>"
    );
  }

  function bindRows() {
    els.list.querySelectorAll('[data-action="folder"]').forEach(function (link) {
      link.addEventListener("click", function (ev) {
        if (!plainClick(ev)) return;
        ev.preventDefault();
        var sub = link.getAttribute("data-path");
        navigate(
          state.folderSegments.concat(String(sub).split("/").filter(Boolean)),
          "",
        );
      });
    });
    els.list.querySelectorAll('[data-action="same-tab"]').forEach(function (link) {
      link.addEventListener("click", function (ev) {
        if (!plainClick(ev)) return;
        ev.preventDefault();
        navigate(state.folderSegments, link.getAttribute("data-id"));
      });
    });
  }

  function renderArticle(entry, locale) {
    var loc = locale;
    var rel = entry.paths[loc] || entry.paths.en;
    var folderPrefix = state.folderSegments.length
      ? state.folderSegments.join("/") + "/"
      : "";
    var mdUrl = ROOT + "/" + folderPrefix + rel;
    setStatus("Loading " + rel + "…");
    fetchText(mdUrl)
      .then(function (md) {
        els.article.innerHTML = wrapTables(mdToHtml(md));
        setStatus("Showing article (" + loc + ").");
      })
      .catch(function (err) {
        els.article.innerHTML =
          '<p class="knowledge-error">Could not load markdown: ' +
          escapeHtml(err.message) +
          "</p>";
        setStatus("Load failed.");
      });
  }

  function render() {
    if (!cacheElements()) return;
    var route = parseRoute();
    state.folderSegments = route.folderSegments;
    state.doc = route.doc;
    var locale = currentContentLocale();
    setStatus("Loading .index.json…");
    state.loading = true;
    els.list.hidden = false;
    els.article.hidden = true;
    els.list.innerHTML = '<p class="knowledge-loading">Loading…</p>';

    fetchJson(indexUrl(state.folderSegments))
      .then(function (index) {
        state.index = index;
        state.loading = false;
        renderPath();
        if (state.doc) {
          var entry = findEntry(index, state.doc);
          if (!entry || entry.kind !== "file") {
            els.list.hidden = false;
            els.article.hidden = true;
            els.list.innerHTML =
              '<p class="knowledge-error">Unknown document id in this folder.</p>';
            setStatus("Unknown doc id.");
            return;
          }
          els.list.hidden = true;
          els.article.hidden = false;
          renderArticle(entry, locale);
        } else {
          els.list.hidden = false;
          els.article.hidden = true;
          renderList(index, locale);
          setStatus(
            "Listing from .index.json (" +
              state.folderSegments.join("/") +
              " or root). Locale: " +
              locale +
              ".",
          );
        }
      })
      .catch(function (err) {
        state.loading = false;
        els.list.innerHTML =
          '<p class="knowledge-error">' +
          escapeHtml(err.message) +
          ". Serve mockups over HTTP (see page note).</p>";
        setStatus("Index load failed.");
      });
  }

  function init() {
    if (!cacheElements()) return;
    window.addEventListener("popstate", render);
    document.querySelectorAll(".locale-switch button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        window.setTimeout(render, 0);
      });
    });
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
