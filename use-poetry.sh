#!/bin/bash
# Switch to Poetry for local development
cd api
if [ -f "pyproject.toml.backup" ]; then
  mv pyproject.toml.backup pyproject.toml
  mv poetry.lock.backup poetry.lock
  echo "✅ Switched to Poetry (local development mode)"
else
  echo "⚠️  Already using Poetry"
fi
