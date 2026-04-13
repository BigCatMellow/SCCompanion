# StarCraft TMG Companion

Clean static build for GitHub Pages.

## What To Publish

Commit the contents of this folder as the root of a GitHub repository:

- `index.html`
- `.nojekyll`
- `Army Builder/`
- `assets/`
- `data/`

## GitHub Pages

1. Push this folder to GitHub.
2. Open the repository settings.
3. Go to Pages.
4. Set the source to `Deploy from a branch`.
5. Select the `main` branch and `/root`.
6. Open the GitHub Pages URL after deployment finishes.

## Notes

- The companion and Army Builder must stay on the same site so browser storage can be shared between them.
- Roster imports use `localStorage`, so saved armies live in the browser/device being used.
- `.nojekyll` is included so GitHub Pages serves the static files directly.
