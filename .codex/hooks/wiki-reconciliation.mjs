let input = "";
process.stdin.setEncoding("utf8");
for await (const chunk of process.stdin) input += chunk;

let event;
try {
  event = JSON.parse(input.replace(/^\uFEFF/u, "").trim());
} catch {
  process.stdout.write("{}");
  process.exit(0);
}

const handoff = event.last_assistant_message ?? "";
if (event.stop_hook_active || handoff.includes("Context reconciliation:")) {
  process.stdout.write("{}");
  process.exit(0);
}

process.stdout.write(JSON.stringify({
  decision: "block",
  reason: "Before completing, perform the context-reconciliation gate in the closest AGENTS.md: re-read the local wiki source map, repair or delete task-created contradictions, validate changed links, and then finish with a concise line beginning 'Context reconciliation:'.",
}));
