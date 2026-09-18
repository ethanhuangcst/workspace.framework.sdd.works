"use client";

import { useMemo, useState } from "react";
import { t, type Locale } from "../../i18n/t";
import { Button } from "../ui/Button";
import { Callout } from "../ui/Callout";
import { CopyButton } from "../ui/CopyButton";
import { Dialog } from "../ui/Dialog";
import { KeysLeadList } from "./KeysLeadList";

export type KeyRow = {
  id: string;
  name: string;
  description: string;
  value: string;
};

export type KeysListProps = {
  locale: Locale;
  keys: KeyRow[];
  showSaved?: boolean;
  onDeleteSelected: (ids: string[]) => void | Promise<void>;
};

/** Keys list — mockup `06-keys.html` (content only; wrap in AppShell contentClassName=`content--keys`). */
export function KeysList({
  locale,
  keys,
  showSaved = false,
  onDeleteSelected,
}: KeysListProps) {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const selectedIds = useMemo(
    () => Object.keys(selected).filter((id) => selected[id]),
    [selected],
  );
  const allSelected = keys.length > 0 && selectedIds.length === keys.length;

  function toggleAll(checked: boolean) {
    const next: Record<string, boolean> = {};
    if (checked) {
      for (const row of keys) next[row.id] = true;
    }
    setSelected(next);
  }

  if (keys.length === 0) {
    return (
      <>
        <div className="page-head">
          <p className="eyebrow">{t(locale, "admin.keys.eyebrow")}</p>
          <div className="page-head-row">
            <KeysLeadList locale={locale} />
            <div className="page-head-actions">
              <Button variant="page" href="/admin/keys/new" data-testid="issue-key">
                {t(locale, "admin.keys.issue")}
              </Button>
            </div>
          </div>
        </div>
        <div className="empty">
          <p>{t(locale, "admin.keys.empty")}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page-head">
        <p className="eyebrow">{t(locale, "admin.keys.eyebrow")}</p>
        <div className="page-head-row">
          <KeysLeadList locale={locale} />
          <div className="page-head-actions">
            <Button variant="page" href="/admin/keys/new" data-testid="issue-key">
              {t(locale, "admin.keys.issue")}
            </Button>
            <Button
              variant="page"
              type="button"
              disabled={selectedIds.length === 0}
              data-testid="keys-delete-selected"
              onClick={() => setConfirmOpen(true)}
            >
              {t(locale, "admin.keys.bulk_delete")}
            </Button>
          </div>
        </div>
      </div>
      {showSaved ? (
        <Callout variant="success">{t(locale, "admin.keys.saved")}</Callout>
      ) : null}
      <div className="table-wrap" data-keys-table>
        <table data-testid="keys-table">
          <thead>
            <tr>
              <th className="table-check">
                <input
                  type="checkbox"
                  data-testid="keys-select-all"
                  aria-label={t(locale, "admin.keys.select_all")}
                  checked={allSelected}
                  onChange={(e) => toggleAll(e.target.checked)}
                />
              </th>
              <th>{t(locale, "admin.keys.col_name")}</th>
              <th>{t(locale, "admin.keys.col_description")}</th>
              <th>{t(locale, "admin.keys.col_value")}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {keys.map((row) => (
              <tr key={row.id} data-testid={`key-row-${row.name}`}>
                <td className="table-check">
                  <input
                    type="checkbox"
                    checked={Boolean(selected[row.id])}
                    onChange={(e) =>
                      setSelected((prev) => ({
                        ...prev,
                        [row.id]: e.target.checked,
                      }))
                    }
                  />
                </td>
                <td className="mono">{row.name}</td>
                <td>{row.description}</td>
                <td>
                  <span className="key-value-cell" title={row.value}>
                    {row.value}
                  </span>
                </td>
                <td>
                  <div className="row-actions">
                    <CopyButton
                      value={row.value}
                      label={t(locale, "admin.keys.copy_list")}
                      copiedLabel={t(locale, "admin.common.copied")}
                    />
                    <a href={`/admin/keys/${row.id}`} data-testid={`key-edit-${row.id}`}>
                      {t(locale, "admin.keys.edit")}
                    </a>
                    <a
                      href={`/admin/keys/${row.id}?confirm=delete`}
                      data-testid={`key-delete-link-${row.id}`}
                    >
                      {t(locale, "admin.keys.delete")}
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={t(locale, "admin.keys.delete_selected_title")}
        body={t(locale, "admin.keys.delete_selected_body", {
          count: selectedIds.length,
        })}
        actions={
          <>
            <Button
              type="button"
              data-testid="keys-delete-selected-confirm"
              onClick={async () => {
                await onDeleteSelected(selectedIds);
                setSelected({});
                setConfirmOpen(false);
              }}
            >
              {t(locale, "admin.keys.delete_selected_submit")}
            </Button>
            <Button
              variant="text"
              type="button"
              onClick={() => setConfirmOpen(false)}
            >
              {t(locale, "admin.common.cancel")}
            </Button>
          </>
        }
      />
    </>
  );
}
