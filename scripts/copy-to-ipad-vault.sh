#!/usr/bin/env bash
set -euo pipefail

# Optional first argument: a different test vault (also useful for local testing).
ultrafocus_project="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
ultrafocus_icloud="${HOME}/Library/Mobile Documents/iCloud~md~obsidian/Documents"
ultrafocus_vault="${1:-${ultrafocus_icloud}/Ultrafocus iPad test}"

if [[ $# -gt 1 ]]; then
  echo "Usage: $0 [test-vault-path]" >&2
  exit 1
fi

if [[ $# -eq 0 && ! -d "$ultrafocus_icloud" ]]; then
  echo "Obsidian iCloud folder not found: $ultrafocus_icloud" >&2
  echo "Create an iCloud vault in Obsidian on your iPad first, then try again." >&2
  exit 1
fi

# Stop before copying anything if type checking or bundling fails.
cd -- "$ultrafocus_project"
npm run build

ultrafocus_destination="$ultrafocus_vault/.obsidian/plugins/ultrafocus"
mkdir -p -- "$ultrafocus_destination"
cp -- "$ultrafocus_project/main.js" \
  "$ultrafocus_project/manifest.json" \
  "$ultrafocus_project/styles.css" \
  "$ultrafocus_destination/"

# Preserve notes, plugin settings, and the vault's enabled-plugin list on reruns.
if [[ ! -e "$ultrafocus_vault/Ultrafocus iPad test.md" ]]; then
  cp -- "$ultrafocus_project/tests/iPad test.md" "$ultrafocus_vault/Ultrafocus iPad test.md"
fi

printf '\nBuild copied to: %s\n' "$ultrafocus_destination"
printf 'Plugin version: %s\n' "$(node -p 'require("./manifest.json").version')"
printf '%s\n' \
  'Wait for iCloud to finish syncing, then open this vault in iPad Obsidian.' \
  'Enable Ultrafocus in Settings > Community plugins and open the test note.' \
  'After syncing an update, turn Ultrafocus OFF then ON in Settings > Community plugins.' \
  'Reopening the app from the Home Screen may resume the old build without reloading it.' \
  'Confirm the Hide tab title bar setting appears before testing focus mode.'
