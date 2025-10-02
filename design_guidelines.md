# Design Guidelines - Sistema de Inventário

## Design Approach

**Selected Approach**: Design System - Material Design inspired with enterprise modifications

**Justification**: This is a utility-focused, data-intensive inventory management system requiring:
- Clear information hierarchy for complex forms and tables
- Consistent, learnable interface patterns
- Efficient data entry and retrieval workflows
- Professional, trustworthy aesthetic suitable for enterprise use

**Key Design Principles**:
1. **Clarity First**: Every element serves a functional purpose
2. **Efficiency**: Minimize clicks and cognitive load for repetitive tasks
3. **Consistency**: Predictable patterns across all modules
4. **Data Integrity**: Visual cues to prevent errors and confirm actions
5. **Accessibility**: High contrast, readable text, clear focus states

## Core Design Elements

### A. Color Palette

**Light Mode (Primary)**:
- **Primary**: 210 85% 45% (Professional blue for actions, navigation)
- **Primary Hover**: 210 85% 38%
- **Secondary**: 210 20% 50% (Neutral gray-blue for less emphasis)
- **Success**: 142 76% 36% (Green for confirmations, active status)
- **Warning**: 38 92% 50% (Orange for pending, alerts)
- **Error**: 0 84% 60% (Red for destructive actions, critical status)
- **Background**: 0 0% 98% (Off-white main background)
- **Surface**: 0 0% 100% (White cards, panels)
- **Surface Hover**: 210 20% 98%
- **Border**: 210 20% 88% (Subtle borders)
- **Text Primary**: 210 15% 20% (Dark gray-blue)
- **Text Secondary**: 210 10% 45%

**Dark Mode (Optional)**:
- **Primary**: 210 90% 60%
- **Background**: 210 15% 12%
- **Surface**: 210 15% 16%
- **Border**: 210 15% 24%
- **Text Primary**: 210 10% 95%

**Status Colors** (consistent across modes):
- **Em Uso** (In Use): 142 76% 36% (Green)
- **Devolver** (Return): 38 92% 50% (Orange)
- **Correio** (Mail): 210 85% 55% (Blue)
- **Guardado** (Stored): 210 20% 50% (Gray)
- **Troca** (Exchange): 280 65% 55% (Purple)

### B. Typography

**Font Stack**: 
- Primary: 'Inter', system-ui, -apple-system, sans-serif
- Monospace (for IDs, patrimônio): 'JetBrains Mono', monospace

**Scale**:
- **Display**: 32px/36px, weight 600 (Page titles)
- **H1**: 24px/32px, weight 600 (Section headers)
- **H2**: 20px/28px, weight 600 (Card titles, module names)
- **H3**: 18px/24px, weight 600 (Subsections)
- **Body Large**: 16px/24px, weight 400 (Form labels, table headers)
- **Body**: 14px/20px, weight 400 (Default text, table cells)
- **Small**: 13px/18px, weight 400 (Helper text, timestamps)
- **Caption**: 12px/16px, weight 400 (Metadata, counts)

### C. Layout System

**Spacing Primitives**: Use Tailwind units - 2, 3, 4, 6, 8, 12, 16, 20
- Tight spacing: p-2, gap-2 (within buttons, compact lists)
- Standard spacing: p-4, gap-4 (form fields, card content)
- Section spacing: p-6, py-8 (card padding, section separation)
- Page margins: p-8, px-12 (main content areas)

**Grid System**:
- **Sidebar Navigation**: Fixed 240px width on desktop, collapsible on tablet/mobile
- **Main Content Area**: Fluid with max-width of 1400px
- **Form Layouts**: 2-column grid on desktop (grid-cols-2), single column mobile
- **Table Layouts**: Full-width responsive with horizontal scroll if needed
- **Dashboard Cards**: 3-column grid on desktop (grid-cols-3), 2 on tablet, 1 on mobile

### D. Component Library

**Navigation**:
- **Top Bar**: Fixed height 64px, contains logo, user profile, notifications
- **Sidebar**: Collapsible menu with icons + labels, active state with primary color background at 10% opacity
- **Breadcrumbs**: Show current location in hierarchy using chevron separators

**Forms**:
- **Input Fields**: Height 40px, rounded corners (rounded-md), border-2 on focus with primary color
- **Labels**: Above inputs, body-large weight 500, with required asterisk in error color
- **Select Dropdowns**: Custom styled with chevron icon, same height as inputs
- **Date Pickers**: Calendar icon inside input on right, clear date functionality
- **Checkboxes**: 20px square with checkmark, primary color when checked
- **Text Areas**: Min height 100px, auto-expand with content, max height 300px
- **Field Groups**: Related fields grouped with subtle background (surface color), padding p-4, rounded-lg

**Buttons**:
- **Primary**: Solid primary color, white text, height 40px, rounded-md, px-6
- **Secondary**: Outlined with primary border, primary text
- **Destructive**: Solid error color background
- **Ghost**: Transparent background, hover shows surface color
- All buttons have subtle shadow on hover, disabled state at 50% opacity

**Tables**:
- **Header**: Sticky, background surface color, font weight 600, border-bottom-2
- **Rows**: Alternating subtle background (zebra striping), hover state with surface-hover color
- **Action Buttons**: Small ghost buttons in action column (Ver Detalhes, Editar, Excluir)
- **Filters**: Top of table, horizontal layout with select dropdowns and search input
- **Pagination**: Bottom center, showing "X-Y de Z items"

**Cards**:
- **Standard Card**: White/surface background, rounded-lg, shadow-sm, padding p-6
- **Stat Cards** (Dashboard): Primary metric large (display size), secondary info small, optional icon top-right
- **Equipment Cards**: Header with equipment type + status badge, content area with key fields, footer with action buttons

**Status Badges**:
- **Pill Shape**: Rounded-full, px-3, py-1, text-sm font-medium
- **Color Coded**: Background at 15% opacity of status color, text in solid status color
- **With Icons**: Optional dot or icon before text

**Modals**:
- **Overlay**: Background black at 50% opacity
- **Container**: Max-width 600px (forms) or 900px (details view), centered, rounded-lg, shadow-xl
- **Header**: Padding p-6, border-bottom, title H2, close button top-right
- **Content**: Padding p-6, max-height for scroll if needed
- **Footer**: Padding p-6, border-top, buttons right-aligned

**Data Visualization** (Dashboard):
- **Charts**: Use Chart.js or similar, match color palette
- **Bar Charts**: For equipment counts by status, category
- **Line Charts**: For trends over time if applicable
- **Donut Charts**: For distribution by UF, segmento

**Histórico/Audit Log**:
- **Timeline Layout**: Vertical line on left, cards connected to timeline
- **Log Entry**: Timestamp (small, text-secondary), user name (body weight 600), action description, affected fields highlighted in code formatting

### E. Page-Specific Layouts

**Login Screen**:
- Centered card 400px wide, logo at top, form fields stacked, "Entrar" button full-width, subtle gradient background

**Dashboard (Perfil Controle)**:
- 3-column stat card grid at top (Total Equipamentos, Por Status, Por UF)
- Chart section below with 2 charts side-by-side
- No equipment details, only aggregated metrics

**Gestão de Usuários (Admin)**:
- Table with columns: Nome, Email, Perfil (badge), Status (ativo/inativo badge), Ações
- "Adicionar Usuário" button top-right primary
- Modal form for new user with perfil selection (radio buttons)

**Cadastro de Equipamento**:
- Type selector at top (3 large cards: Notebook, Celular, Terminal)
- Form sections with headers: Informações Básicas, Dados Técnicos, Documentação, Checklist (notebooks only)
- Fields in 2-column grid, full-width for text areas
- "Salvar Equipamento" primary button bottom-right, "Cancelar" secondary

**Visualização de Inventário**:
- Tabs for equipment type at top (Notebooks, Celulares, Terminais, Todos)
- Filter bar below tabs (selects for Status, UF, Segmento, Fornecedor, search input)
- Table with relevant columns per equipment type
- Action column always right-most with 3 icon buttons

**Detalhes do Equipamento** (Modal):
- Two-column layout: left shows all field values (read-only with labels), right shows checklist status, termo/foto links as clickable buttons
- Edit mode: same layout but fields become editable
- "Salvar Alterações" saves and logs to histórico

**Histórico**:
- Filter by date range, user, action type at top
- Timeline layout with most recent at top
- Each entry expandable to show changed field values (before/after)

### F. Animations

**Minimal, purposeful animations only**:
- Modal: Fade in overlay 150ms, scale content from 0.95 to 1 over 200ms
- Dropdown menus: Slide down 150ms
- Button hover: Background color transition 150ms
- Table row hover: Background color transition 100ms
- Page transitions: None (instant for data-focused app)

## Implementation Notes

- Maintain consistent 2-4-8 spacing rhythm throughout
- All interactive elements must have clear hover, focus, and active states
- Forms must show validation errors inline below fields in error color
- Success messages appear as toast notifications top-right
- Destructive actions (Excluir) require confirmation modal
- Loading states use spinner on primary color for async operations
- Empty states show helpful illustration + text + action button