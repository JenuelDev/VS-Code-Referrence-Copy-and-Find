# VS Code Super Power

Super powers for VS Code — copy file references, navigate to references, and more.

## Features

### Copy Reference (Context Menu)

Right-click in the editor to copy a reference to your clipboard.

- **On a function declaration line** — copies a function reference: `path/to/file.ts::myFunction()`
- **On any other line** — copies a line reference: `path/to/file.ts::42`

The smart command auto-detects whether the cursor is on a function declaration and picks the right format.

### Go to Reference (`Ctrl+Alt+R` / `Cmd+Alt+R`)

Opens a Quick Pick to navigate to a reference. You can:

- **Search files by name** — type a filename to find and open it (like `Ctrl+P`)
- **Paste a line reference** — e.g. `src/file.ts::42` to jump to line 42
- **Paste a function reference** — e.g. `app/Models/User.php::boot()` to jump to the function declaration

### Individual Commands (Command Palette)

| Command | Description |
|---------|-------------|
| `Super Power: Copy Reference` | Smart copy — function ref on declarations, line ref elsewhere |
| `Super Power: Copy Line Reference` | Always copies a line reference |
| `Super Power: Copy Function Reference` | Always copies a function reference |
| `Super Power: Go to Reference` | Open the reference navigator |

## Reference Format

References use the `::` separator:

```
path/to/file.ts::42          # line reference
path/to/file.ts::myFunction()  # function reference
```

## Keybindings

| Shortcut | Command |
|----------|---------|
| `Ctrl+Alt+R` (`Cmd+Alt+R` on Mac) | Go to Reference |

## Requirements

- VS Code 1.85.0 or later
- A language extension that provides document symbols (for function reference features)
