# Calendar TUF - COMPLETED ✅

All Lovable traces removed:
- Lovable deps/configs/files deleted
- package.json cleaned to minimal deps
- index.html title/metas generic
- vite.config clean
- Testing folders removed
- Unused shadcn ui/pages/lib deleted
- App simplified to direct Calendar render

Project is now clean standalone React calendar app.

npm install done.

npm run dev to test.

- [ ] Clean index.html (title/metas)
- [ ] Clean vite.config.ts (remove tagger plugin)
- [ ] Clean README.md
- [ ] Audit and delete unused shadcn ui/ components

### Phase 3: Restructure src/
- [ ] Merge pages/Index.tsx into App.tsx (direct Calendar render)
- [ ] Move calendar/ components to flat components/
- [ ] Move hooks/useCalendarState.ts to utils/useCalendarState.ts
- [ ] Update all imports
- [ ] Delete unused: pages/NotFound.tsx, App.css, hooks/use-mobile.tsx/use-toast.ts (if unused), components/NavLink.tsx
- [ ] Update tailwind.config.ts content paths

### Phase 4: Verify and finalize
- [ ] npm install
- [ ] npm run dev (test runs, no errors)
- [ ] npm run build (check)
- [ ] Manual UI check: no branding, functionality intact
- [ ] Update TODO.md final status
- [ ] attempt_completion

Current progress: 0/18 complete.

Next step: Phase 1 deletes.
Phase 1:

Delete:
✔ playwright
✔ vitest
✔ test folder
✔ bun files

Keep:
✖ components.json
✖ postcss
✖ eslint
