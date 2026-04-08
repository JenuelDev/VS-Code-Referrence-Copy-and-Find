import assert from 'node:assert/strict';
import * as vscode from 'vscode';

export async function runExtensionTests() {
    const commands = await vscode.commands.getCommands(true);
    assert.ok(commands.includes('vscode-super-power.copyLineReference'));
    assert.ok(commands.includes('vscode-super-power.copyFunctionReference'));
    assert.ok(commands.includes('vscode-super-power.copyReference'));
    assert.ok(commands.includes('vscode-super-power.goToReference'));
}
