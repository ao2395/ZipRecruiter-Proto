#!/bin/bash
# Switch to pip for Vercel deployment
cd api
if [ -f "pyproject.toml" ]; then
  mv pyproject.toml pyproject.toml.backup
  mv poetry.lock poetry.lock.backup
  echo "✅ Switched to pip (Vercel deployment mode)"
else
  echo "⚠️  Already using pip"
fi
