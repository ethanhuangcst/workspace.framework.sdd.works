# Browser checks

Load this file when the work includes a web UI. It holds facts for the helper in this skill folder. The model chooses what to run from the thread.

Selectors: role, accessible name, text, or `data-testid`. Layout-only CSS is a weak selector. On failure, put a screenshot path and the relevant console lines in the report.

## Server helper

`scripts/with_server.py` starts one or more servers, waits for the ports, runs the child command, then stops the servers.

Run this first:

```bash
python scripts/with_server.py --help
```

Read the script only when `--help` is not enough. The child command is Playwright only. The helper owns the server.

Use the project's documented dev command when the app is already how this repo starts. Use the helper when you need that lifecycle.

One server:

```bash
python scripts/with_server.py --server "npm run dev" --port 5173 -- python your_automation.py
```

Two servers:

```bash
python scripts/with_server.py \
  --server "cd backend && python server.py" --port 3000 \
  --server "cd frontend && npm run dev" --port 5173 \
  -- python your_automation.py
```

The port in the command is the port the app actually listens on.

## Page shape

Static HTML: open it with `file://` or take selectors from the file. If that view is incomplete, treat the page as dynamic.

Dynamic page: the DOM before the app is ready is the wrong DOM. Wait for `networkidle` or a stable selector, then inspect. A screenshot, `page.content()`, or a locator list is evidence. Selectors copied from source can be wrong on the rendered page.

A fixed sleep is a weak wait. `page.wait_for_selector()` or `page.wait_for_load_state("networkidle")` matches the rendered state.

Python Playwright shape when the repo does not already use `@playwright/test`:

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("http://localhost:5173")
    page.wait_for_load_state("networkidle")
    browser.close()
```

Close the browser when the script ends. Headless Chromium is the default launch.

## Examples in this folder

- `examples/element_discovery.py`: buttons, links, and inputs on a rendered page.
- `examples/static_html_automation.py`: a local HTML file through `file://`.
- `examples/console_logging.py`: console lines during the run.
