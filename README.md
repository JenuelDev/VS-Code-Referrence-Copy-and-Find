<p align="center">
  <img src="./assets/VS_Code_bilang_superhero-removebg-preview.png" alt="VS Code Super Power logo" width="190" />
</p>

# VS Code Super Power

Copy file references fast, then jump back to them just as quickly.

## Features

### Copy Referrence

Right-click in the editor and choose `Copy Referrence`.

![Copy Referrence](./assets/screenshots/icon-400.png)

This command is smart:

- On a function, method, or constructor declaration line, it copies a function reference like `src/extension.ts::activate()`
- On any other line, it copies a line reference like `src/extension.ts::42`

### Other Commands

- `Super Power: Copy Line Reference` always copies `path::line`
- `Super Power: Copy Function Reference` always copies `path::function()`
- `Super Power: Go to Reference` opens the reference picker

### Go to Reference

Press `Ctrl+Alt+R` on Windows/Linux or `Cmd+Alt+R` on Mac.

You can:

- Search files by name
- Paste a line reference like `src/extension.ts::42`
- Paste a function reference like `src/extension.ts::activate()`

## Reference Format

References use `::` as the separator.

```text
src/extension.ts::42
src/extension.ts::activate()
```

## Requirements

- VS Code 1.85.0 or later
- A language extension that provides document symbols for function-based references
