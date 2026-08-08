let input = "";
process.stdin.setEncoding("utf8");
for await (const chunk of process.stdin) input += chunk;

const reconciliationReason = "Before completing, reconcile the closest AGENTS.md with wiki/Sources.md: repair or delete task-created contradictions, validate every changed link, add no inventories or history, and end the final handoff with a concise 'Context reconciliation:' line.";
const block = (reason = reconciliationReason) => {
  process.stdout.write(JSON.stringify({ decision: "block", reason }));
};

let event;
try {
  event = JSON.parse(input.replace(/^\uFEFF/u, "").trim());
} catch {
  block("The task-end hook received malformed input. Retry the stop after checking the hook invocation; context reconciliation is still required.");
  process.exit(0);
}

if (!event || typeof event !== "object" || Array.isArray(event)) {
  block("The task-end hook received invalid input. Retry the stop after checking the hook invocation; context reconciliation is still required.");
  process.exit(0);
}

if (event.stop_hook_active === true) {
  process.stdout.write("{}");
  process.exit(0);
}

const handoff = typeof event.last_assistant_message === "string" ? event.last_assistant_message : "";
const finalLine = handoff.split(/\r?\n/u).map((line) => line.trim()).filter(Boolean).at(-1) ?? "";
if (finalLine.startsWith("Context reconciliation:")) {
  process.stdout.write("{}");
  process.exit(0);
}

block();
