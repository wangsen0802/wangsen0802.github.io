export type SandboxLang = 'html' | 'js' | 'ts'

export interface SandboxConsoleEntry {
  type: 'log' | 'error' | 'warn'
  args: string[]
}

export function useSandbox(lang: SandboxLang = 'html') {
  const consoleOutput = ref<SandboxConsoleEntry[]>([])

  /** Build HTML template for iframe srcdoc */
  function buildSrcdoc(code: string): string {
    if (lang === 'html') {
      return code
    }

    // JS/TS mode: wrap with console capture template
    const escapedCode = code.replace(/<\/script>/g, '<\\/script>')
    return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head><body>
<script>
(function() {
  var _logs = [];
  var _origLog = console.log;
  var _origError = console.error;
  var _origWarn = console.warn;

  function _sendLogs() {
    parent.postMessage({ type: 'sandbox-console', logs: _logs }, '*');
  }

  console.log = function() {
    var args = Array.prototype.slice.call(arguments).map(function(a) {
      try { return typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a); }
      catch(e) { return String(a); }
    });
    _logs.push({ type: 'log', args: args });
    _origLog.apply(console, arguments);
    _sendLogs();
  };

  console.error = function() {
    var args = Array.prototype.slice.call(arguments).map(function(a) { return String(a); });
    _logs.push({ type: 'error', args: args });
    _origError.apply(console, arguments);
    _sendLogs();
  };

  console.warn = function() {
    var args = Array.prototype.slice.call(arguments).map(function(a) { return String(a); });
    _logs.push({ type: 'warn', args: args });
    _origWarn.apply(console, arguments);
    _sendLogs();
  };

  try {
    ${escapedCode}
  } catch(e) {
    _logs.push({ type: 'error', args: [e.message] });
    _sendLogs();
  }
})();
<\/script>
</body></html>`
  }

  /** Handle iframe postMessage */
  function handleMessage(event: MessageEvent) {
    if (event.data?.type === 'sandbox-console' && Array.isArray(event.data.logs)) {
      consoleOutput.value = event.data.logs.map((entry: { type: string; args: string[] }) => ({
        type: entry.type as SandboxConsoleEntry['type'],
        args: entry.args,
      }))
    }
  }

  /** Clear console output */
  function clearConsole() {
    consoleOutput.value = []
  }

  onMounted(() => {
    window.addEventListener('message', handleMessage)
  })

  onUnmounted(() => {
    window.removeEventListener('message', handleMessage)
  })

  return {
    consoleOutput,
    buildSrcdoc,
    clearConsole,
  }
}
