#!/bin/bash

# Find files containing company?.country?.currency_symbol or company?.country.currency_symbol
files=$(grep -rl 'company?.country\.currency_symbol\|company?.country?.currency_symbol' src/container/Dashboard src/components src/hooks)

for file in $files; do
  echo "Processing $file"
  
  # Check if useWorkspaceCurrencySymbol is already imported
  if ! grep -q "useWorkspaceCurrencySymbol" "$file"; then
    # Add import after the last import statement
    awk '/^import/ {last=NR} {lines[NR]=$0} END {for (i=1; i<=NR; i++) {print lines[i]; if (i==last) print "import { useWorkspaceCurrencySymbol } from \"@/hooks/useWorkspaceCurrencySymbol\";"}}' "$file" > "$file.tmp"
    mv "$file.tmp" "$file"
  fi
  
  # Replace company?.country?.currency_symbol and company?.country.currency_symbol with currencySymbol
  sed -i '' 's/company\?\.country\?\.currency_symbol/currencySymbol/g' "$file"
  sed -i '' 's/company\?\.country\.currency_symbol/currencySymbol/g' "$file"
  
  # We need to make sure currencySymbol is defined in the component
  # This is a bit tricky to do automatically with sed, so I'll just do a few manually that I know are safe or just let the user know.
done
