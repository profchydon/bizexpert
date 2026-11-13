export function resolveScriptApprovalCopy(count: number) {
  if (count === 0) {
    return {
      title: "Nothing to review",
      description:
        "When an employee needs a change on their computer that you have to approve first, it will show up here. They wait in the chat until you decide.",
    };
  }

  const noun = count === 1 ? "request" : "requests";
  return {
    title: `${count} ${noun} waiting for your approval`,
    description:
      "Approve to let it run on their computer, or reject to stop it. They’ll see your decision in their chat.",
  };
}
