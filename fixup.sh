#!/usr/bin/env bash

cat > build/cjs/package.json <<!EOF
{
  "version": "$(node -p 'require("./package.json").version')",
  "type": "commonjs"
}
!EOF

cat >build/mjs/package.json <<!EOF
{
  "version": "$(node -p 'require("./package.json").version')",
  "type": "module"
}
!EOF
