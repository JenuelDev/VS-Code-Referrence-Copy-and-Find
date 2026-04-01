import * as vscode from 'vscode';

function findFunctionByName(
  symbols: vscode.DocumentSymbol[],
  name: string
): vscode.DocumentSymbol | undefined {
  for (const symbol of symbols) {
    if (
      (symbol.kind === vscode.SymbolKind.Function ||
        symbol.kind === vscode.SymbolKind.Method ||
        symbol.kind === vscode.SymbolKind.Constructor) &&
      symbol.name === name
    ) {
      return symbol;
    }
    const childMatch = findFunctionByName(symbol.children, name);
    if (childMatch) {
      return childMatch;
    }
  }
  return undefined;
}

function findFunctionAtDeclaration(
  symbols: vscode.DocumentSymbol[],
  position: vscode.Position
): vscode.DocumentSymbol | undefined {
  for (const symbol of symbols) {
    if (!symbol.range.contains(position)) {
      continue;
    }
    // Check children first (depth-first for innermost match)
    const childMatch = findFunctionAtDeclaration(symbol.children, position);
    if (childMatch) {
      return childMatch;
    }
    // Only match if cursor is on the declaration line (selectionRange = the function name)
    if (
      (symbol.kind === vscode.SymbolKind.Function ||
        symbol.kind === vscode.SymbolKind.Method ||
        symbol.kind === vscode.SymbolKind.Constructor) &&
      symbol.selectionRange.start.line === position.line
    ) {
      return symbol;
    }
  }
  return undefined;
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('vscode-super-power.copyLineReference', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const relativePath = vscode.workspace.asRelativePath(editor.document.uri);
      const line = editor.selection.active.line + 1;
      const reference = `${relativePath}::${line}`;

      await vscode.env.clipboard.writeText(reference);
      vscode.window.showInformationMessage(`Copied: ${reference}`);
    }),

    vscode.commands.registerCommand('vscode-super-power.copyFunctionReference', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const symbols = await vscode.commands.executeCommand<vscode.DocumentSymbol[]>(
        'vscode.executeDocumentSymbolProvider',
        editor.document.uri
      );

      if (!symbols) {
        vscode.window.showWarningMessage('No symbol provider available for this file type.');
        return;
      }

      const position = editor.selection.active;
      const fn = findFunctionAtDeclaration(symbols, position);

      if (!fn) {
        vscode.window.showWarningMessage('No function found at cursor position.');
        return;
      }

      const relativePath = vscode.workspace.asRelativePath(editor.document.uri);
      const reference = `${relativePath}::${fn.name}()`;

      await vscode.env.clipboard.writeText(reference);
      vscode.window.showInformationMessage(`Copied: ${reference}`);
    }),

    vscode.commands.registerCommand('vscode-super-power.goToReference', async () => {
      const quickPick = vscode.window.createQuickPick();
      quickPick.placeholder = 'Search files by name, or paste a reference (path::line or path::function())';
      quickPick.matchOnDescription = true;

      let debounceTimer: NodeJS.Timeout | undefined;

      quickPick.onDidChangeValue(value => {
        if (debounceTimer) {
          clearTimeout(debounceTimer);
        }
        debounceTimer = setTimeout(async () => {
          if (!value) {
            quickPick.items = [];
            return;
          }

          const hasRef = value.includes('::');
          const filePart = hasRef ? value.substring(0, value.indexOf('::')) : value;
          const target = hasRef ? value.substring(value.indexOf('::') + 2) : '';

          // Search for matching files
          const glob = filePart.includes('/') ? `**/${filePart}` : `**/*${filePart}*`;
          const files = await vscode.workspace.findFiles(glob, '**/node_modules/**', 20);

          if (hasRef && files.length > 0) {
            // Show matched files with the reference target as description
            quickPick.items = files.map(uri => {
              const rel = vscode.workspace.asRelativePath(uri);
              return {
                label: `$(references) ${rel}`,
                description: `:: ${target}`,
                detail: `Go to ${target.match(/\(\)$/) ? `function ${target}` : `line ${target}`}`,
                alwaysShow: true,
                uri,
                target,
              } as vscode.QuickPickItem & { uri: vscode.Uri; target: string };
            });
          } else {
            // Normal file search
            quickPick.items = files.map(uri => {
              const rel = vscode.workspace.asRelativePath(uri);
              return {
                label: `$(file) ${rel}`,
                uri,
                target: '',
              } as vscode.QuickPickItem & { uri: vscode.Uri; target: string };
            });
          }
        }, 150);
      });

      quickPick.onDidAccept(async () => {
        const selected = quickPick.selectedItems[0] as vscode.QuickPickItem & { uri?: vscode.Uri; target?: string } | undefined;
        quickPick.hide();

        if (!selected || !('uri' in selected) || !selected.uri) {
          return;
        }

        const fileUri = selected.uri;
        const target = selected.target || '';
        const document = await vscode.workspace.openTextDocument(fileUri);

        if (!target) {
          // Just open the file
          await vscode.window.showTextDocument(document);
          return;
        }

        const lineNumber = parseInt(target, 10);

        if (!isNaN(lineNumber) && String(lineNumber) === target.trim()) {
          const line = Math.max(0, lineNumber - 1);
          const editor = await vscode.window.showTextDocument(document);
          const pos = new vscode.Position(line, 0);
          editor.selection = new vscode.Selection(pos, pos);
          editor.revealRange(new vscode.Range(pos, pos), vscode.TextEditorRevealType.InCenter);
        } else {
          const funcName = target.replace(/\(\)$/, '');
          const symbols = await vscode.commands.executeCommand<vscode.DocumentSymbol[]>(
            'vscode.executeDocumentSymbolProvider',
            fileUri
          );

          const fn = symbols ? findFunctionByName(symbols, funcName) : undefined;

          if (!fn) {
            vscode.window.showWarningMessage(`Function "${funcName}" not found`);
            return;
          }

          const editor = await vscode.window.showTextDocument(document);
          const pos = fn.selectionRange.start;
          editor.selection = new vscode.Selection(pos, pos);
          editor.revealRange(fn.range, vscode.TextEditorRevealType.InCenter);
        }
      });

      quickPick.onDidHide(() => quickPick.dispose());
      quickPick.show();
    }),

    vscode.commands.registerCommand('vscode-super-power.copyReference', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const relativePath = vscode.workspace.asRelativePath(editor.document.uri);
      const position = editor.selection.active;

      // Try to find a function at cursor
      const symbols = await vscode.commands.executeCommand<vscode.DocumentSymbol[]>(
        'vscode.executeDocumentSymbolProvider',
        editor.document.uri
      );

      const fn = symbols ? findFunctionAtDeclaration(symbols, position) : undefined;

      if (fn) {
        const reference = `${relativePath}::${fn.name}()`;
        await vscode.env.clipboard.writeText(reference);
        vscode.window.showInformationMessage(`Copied: ${reference}`);
      } else {
        const line = position.line + 1;
        const reference = `${relativePath}::${line}`;
        await vscode.env.clipboard.writeText(reference);
        vscode.window.showInformationMessage(`Copied: ${reference}`);
      }
    })
  );
}

export function deactivate() {}
