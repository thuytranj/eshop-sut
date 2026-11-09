import {
  type ChecklistItem,
  type CaseDefinition,
  type ItemId,
  type Screen,
  type IA,
  type Mode,
} from '../contracts.ts';

interface CaseBlueprint {
  itemId: ItemId;
  screen: Screen;
  ia: IA;
  cases: {
    caseId: string;
    mode: Mode;
    required: boolean;
  }[];
}

const BLUEPRINTS: CaseBlueprint[] = [
  // FR-03 (15 items)
  { itemId: 'GUI-001', screen: 'FR-03', ia: 'IA-01', cases: [{ caseId: 'lang-check', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-002', screen: 'FR-03', ia: 'IA-01', cases: [{ caseId: 'button-color', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-003', screen: 'FR-03', ia: 'IA-01', cases: [{ caseId: 'h1-count', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-004', screen: 'FR-03', ia: 'IA-02', cases: [{ caseId: 'email-validation', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-005', screen: 'FR-03', ia: 'IA-02', cases: [{ caseId: 'step-indicator', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-006', screen: 'FR-03', ia: 'IA-02', cases: [{ caseId: 'password-fields', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-007', screen: 'FR-03', ia: 'IA-02', cases: [{ caseId: 'password-strength', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-008', screen: 'FR-03', ia: 'IA-02', cases: [{ caseId: 'otp-format', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-009', screen: 'FR-03', ia: 'IA-03', cases: [{ caseId: 'back-login-link', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-010', screen: 'FR-03', ia: 'IA-03', cases: [{ caseId: 'tab-step1', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-011', screen: 'FR-03', ia: 'IA-03', cases: [{ caseId: 'tab-step2', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-012', screen: 'FR-03', ia: 'IA-03', cases: [{ caseId: 'enter-key', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-013', screen: 'FR-03', ia: 'IA-04', cases: [{ caseId: 'live-otp-code', mode: 'live', required: true }] },
  { itemId: 'GUI-014', screen: 'FR-03', ia: 'IA-04', cases: [{ caseId: 'bind-email', mode: 'live', required: true }] },
  { itemId: 'GUI-015', screen: 'FR-03', ia: 'IA-04', cases: [{ caseId: 'reset-success', mode: 'live', required: true }] },

  // FR-05 (19 items)
  { itemId: 'GUI-016', screen: 'FR-05', ia: 'IA-01', cases: [{ caseId: 'grid-responsive', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-017', screen: 'FR-05', ia: 'IA-01', cases: [{ caseId: 'card-info', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-018', screen: 'FR-05', ia: 'IA-01', cases: [{ caseId: 'currency-format', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-019', screen: 'FR-05', ia: 'IA-01', cases: [{ caseId: 'single-h1', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-020', screen: 'FR-05', ia: 'IA-01', cases: [{ caseId: 'color-contrast', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-021', screen: 'FR-05', ia: 'IA-01', cases: [{ caseId: 'xss-search-safe', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-022', screen: 'FR-05', ia: 'IA-02', cases: [{ caseId: 'search-by-name', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-023', screen: 'FR-05', ia: 'IA-02', cases: [{ caseId: 'clear-search-keyword', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-024', screen: 'FR-05', ia: 'IA-03', cases: [{ caseId: 'active-home-nav', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-025', screen: 'FR-05', ia: 'IA-03', cases: [{ caseId: 'cart-badge-update', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-026', screen: 'FR-05', ia: 'IA-03', cases: [{ caseId: 'detail-click', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-027', screen: 'FR-05', ia: 'IA-03', cases: [{ caseId: 'tab-order', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-028', screen: 'FR-05', ia: 'IA-04', cases: [{ caseId: 'loading-indicator', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-029', screen: 'FR-05', ia: 'IA-04', cases: [{ caseId: 'search-empty-state', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-030', screen: 'FR-05', ia: 'IA-04', cases: [{ caseId: 'image-alt', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-031', screen: 'FR-05', ia: 'IA-04', cases: [{ caseId: 'add-cart-toast', mode: 'mock-ui', required: true }] },
  {
    itemId: 'GUI-065',
    screen: 'FR-05',
    ia: 'IA-02',
    cases: [
      { caseId: 'ime-synthetic', mode: 'mock-ui', required: true },
      { caseId: 'ime-manual', mode: 'manual', required: true },
    ],
  },
  { itemId: 'GUI-067', screen: 'FR-05', ia: 'IA-04', cases: [{ caseId: 'network-retry', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-070', screen: 'FR-05', ia: 'IA-04', cases: [{ caseId: 'click-spam-prevent', mode: 'mock-ui', required: true }] },

  // FR-07 (18 items)
  { itemId: 'GUI-032', screen: 'FR-07', ia: 'IA-01', cases: [{ caseId: 'table-5-columns', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-033', screen: 'FR-07', ia: 'IA-01', cases: [{ caseId: 'exact-total-label', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-034', screen: 'FR-07', ia: 'IA-01', cases: [{ caseId: 'money-align-right', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-035', screen: 'FR-07', ia: 'IA-01', cases: [{ caseId: 'responsive-cart', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-036', screen: 'FR-07', ia: 'IA-02', cases: [{ caseId: 'plus-minus-buttons', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-037', screen: 'FR-07', ia: 'IA-02', cases: [{ caseId: 'direct-quantity-input', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-038', screen: 'FR-07', ia: 'IA-02', cases: [{ caseId: 'invalid-quantity', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-039', screen: 'FR-07', ia: 'IA-03', cases: [{ caseId: 'active-cart-nav', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-040', screen: 'FR-07', ia: 'IA-03', cases: [{ caseId: 'breadcrumb-home', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-041', screen: 'FR-07', ia: 'IA-03', cases: [{ caseId: 'continue-shopping-exact', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-042', screen: 'FR-07', ia: 'IA-03', cases: [{ caseId: 'cart-tab-order', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-043', screen: 'FR-07', ia: 'IA-04', cases: [{ caseId: 'merge-same-product', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-044', screen: 'FR-07', ia: 'IA-04', cases: [{ caseId: 'delete-confirm-dialog', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-045', screen: 'FR-07', ia: 'IA-04', cases: [{ caseId: 'confirm-cancel-escape', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-046', screen: 'FR-07', ia: 'IA-04', cases: [{ caseId: 'empty-cart-state', mode: 'mock-ui', required: true }] },
  {
    itemId: 'GUI-066',
    screen: 'FR-07',
    ia: 'IA-01',
    cases: [
      { caseId: 'a11y-aria-dom', mode: 'mock-ui', required: true },
      { caseId: 'a11y-screen-reader', mode: 'manual', required: true },
    ],
  },
  { itemId: 'GUI-068', screen: 'FR-07', ia: 'IA-02', cases: [{ caseId: 'transient-empty-input', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-069', screen: 'FR-07', ia: 'IA-01', cases: [{ caseId: 'touch-target-44px', mode: 'mock-ui', required: true }] },

  // FR-15 (18 items)
  { itemId: 'GUI-047', screen: 'FR-15', ia: 'IA-01', cases: [{ caseId: 'admin-table-columns', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-048', screen: 'FR-15', ia: 'IA-01', cases: [{ caseId: 'admin-single-h1', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-049', screen: 'FR-15', ia: 'IA-01', cases: [{ caseId: 'action-button-colors', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-050', screen: 'FR-15', ia: 'IA-02', cases: [{ caseId: 'required-field-markers', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-051', screen: 'FR-15', ia: 'IA-02', cases: [{ caseId: 'product-name-255', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-052', screen: 'FR-15', ia: 'IA-02', cases: [{ caseId: 'product-price-bounds', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-053', screen: 'FR-15', ia: 'IA-02', cases: [{ caseId: 'category-select', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-054', screen: 'FR-15', ia: 'IA-02', cases: [{ caseId: 'load-edit-form', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-055', screen: 'FR-15', ia: 'IA-02', cases: [{ caseId: 'error-position-above-submit', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-056', screen: 'FR-15', ia: 'IA-03', cases: [{ caseId: 'active-tab-highlight', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-057', screen: 'FR-15', ia: 'IA-03', cases: [{ caseId: 'logout-button-exact', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-058', screen: 'FR-15', ia: 'IA-03', cases: [{ caseId: 'cancel-form-no-mutation', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-059', screen: 'FR-15', ia: 'IA-03', cases: [{ caseId: 'modal-focus-trap', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-060', screen: 'FR-15', ia: 'IA-04', cases: [{ caseId: 'isolate-update', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-061', screen: 'FR-15', ia: 'IA-04', cases: [{ caseId: 'confirm-delete-modal', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-062', screen: 'FR-15', ia: 'IA-04', cases: [{ caseId: 'cancel-delete-modal', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-063', screen: 'FR-15', ia: 'IA-04', cases: [{ caseId: 'crud-feedback-toast', mode: 'mock-ui', required: true }] },
  { itemId: 'GUI-064', screen: 'FR-15', ia: 'IA-04', cases: [{ caseId: 'admin-table-image-alt', mode: 'mock-ui', required: true }] },
];

export function getCaseCatalog(items: ChecklistItem[], targetIds: string[] = ['chrome-local']): CaseDefinition[] {
  const itemMap = new Map<string, ChecklistItem>();
  for (const item of items) {
    itemMap.set(item.id, item);
  }

  const catalog: CaseDefinition[] = [];

  for (const bp of BLUEPRINTS) {
    const item = itemMap.get(bp.itemId);
    const reqIds = item
      ? item.requirement_ids.split(';').map((s) => s.trim()).filter(Boolean)
      : [];

    for (const c of bp.cases) {
      catalog.push({
        itemId: bp.itemId,
        caseId: c.caseId,
        screen: bp.screen,
        ia: bp.ia,
        mode: c.mode,
        required: c.required,
        targetIds,
        requirementIds: reqIds,
      });
    }
  }

  return catalog;
}

export function getAllItemBlueprints(): CaseBlueprint[] {
  return BLUEPRINTS;
}
